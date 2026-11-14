#!/usr/bin/env node
/* ============================================================
   math6q 云端同步服务 v1.0（零 npm 依赖，Node >= 18）
   ------------------------------------------------------------
   数据集中存储（容器内 /app/data，宿主机挂载 NAS 目录）：
     users.json                用户表 {ver:2, rev, users:[...]}（与前端结构一致）
     users.json.bak1/.bak2     滚动双备份
     state/qd6_state_<手机号>.json        每用户学习存档 {rev, data}
     state/....bak1/.bak2      滚动双备份
     sessions.json             token 会话表（落盘，重启不丢）
   一致性：
     - Node 单线程 + 每文件写队列串行化
     - 存档 PUT 走乐观锁：rev 不匹配返回 409 + 服务端最新（客户端合并后重试）
     - 全部写操作 tmp+rename 原子替换，写前滚备份
   鉴权：
     - 注册/登录签发 Bearer token（30 天），会话落盘
     - /api/state 只能访问 token 所属账号（服务端强制）
     - /api/admin/* 校验 role==='admin'
   密码：SHA-256(salt::pass)，与前端 index.html 的 hashPass 完全一致
   ============================================================ */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8877;
const DATA = process.env.QD6_DATA || path.join(__dirname, 'data');
const UFILE = path.join(DATA, 'users.json');
const SFILE = path.join(DATA, 'sessions.json');
const SDIR = path.join(DATA, 'state');
const TOKEN_TTL = 30 * 24 * 3600 * 1000;   // 30 天
const BODY_MAX = 5 * 1024 * 1024;          // 5MB

/* 预置管理员（与前端一致；仅当用户表无此号时创建） */
const ADMIN_PHONE = '13455656547';
const ADMIN_PASS = 'KAyFN&6t253Z#m2x0Fq3';

/* ---------- 工具 ---------- */
function hashPass(salt, pass) {
  return crypto.createHash('sha256').update(salt + '::' + pass, 'utf8').digest('hex');
}
function nowStr() {
  var d = new Date();
  var p = function (n) { return (n < 10 ? '0' : '') + n; };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
    p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}
function validPhone(p) { return /^1\d{10}$/.test(p); }
/* 密码规则：10 位，含数字/大写/小写/特殊符号。管理员重置同样校验；
   例外：预置管理员原密码(19位)仅在首次预置时使用，不经过此校验 */
function passIssue(p) {
  if (typeof p !== 'string' || p.length !== 10) return '密码长度必须恰好 10 位（当前 ' + (p ? p.length : 0) + ' 位）';
  if (!/[0-9]/.test(p)) return '密码必须包含数字';
  if (!/[A-Z]/.test(p)) return '密码必须包含大写字母';
  if (!/[a-z]/.test(p)) return '密码必须包含小写字母';
  if (!/[^0-9A-Za-z]/.test(p)) return '密码必须包含特殊符号（如 !@#$%^&*）';
  return null;
}

/* ---------- 原子写 + 双备份 ---------- */
function atomicWrite(file, obj) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj));
  try { fs.renameSync(tmp, file); }   // 同目录 rename = 原子
  catch (e) { fs.copyFileSync(tmp, file); fs.unlinkSync(tmp); }
}
/* 写前滚动备份：bak1←旧值，bak2←原bak1 */
function rollBackup(file) {
  try {
    if (fs.existsSync(file)) {
      const b1 = file + '.bak1', b2 = file + '.bak2';
      if (fs.existsSync(b1)) fs.copyFileSync(b1, b2);
      fs.copyFileSync(file, b1);
    }
  } catch (e) { console.warn('备份失败(忽略):', e.message); }
}

/* 每个文件的写队列（串行化，防并发交错） */
const chains = new Map();
function enqueued(file, fn) {
  const prev = chains.get(file) || Promise.resolve();
  const next = prev.then(fn, fn);
  chains.set(file, next);
  next.catch(e => { if (!(e && e.code)) console.error('写队列异常', file, e); });  /* 业务错误（带 code）不打日志 */
  return next;
}

/* ---------- 用户表 ---------- */
let USERS = null;
function loadUsers() {
  /* 主表损坏 → 双备份恢复 */
  for (const f of [UFILE, UFILE + '.bak1', UFILE + '.bak2']) {
    try {
      const v = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (v && Array.isArray(v.users)) { console.warn('用户表从', path.basename(f), '载入'); return v; }
    } catch (e) { }
  }
  return { ver: 2, rev: 0, users: [] };
}
function userFilePath(phone) {
  /* 手机号纯数字，直接拼 key；双保险再过一遍白名单 */
  if (!/^1\d{10}$/.test(phone)) throw new Error('非法手机号');
  return path.join(SDIR, 'qd6_state_' + phone + '.json');
}

/* ---------- 会话 ---------- */
let SESS = null;
function loadSess() {
  try { const v = JSON.parse(fs.readFileSync(SFILE, 'utf8')); if (v && v.tokens) return v; } catch (e) { }
  return { tokens: {} };
}
function saveSess() { atomicWrite(SFILE, SESS); }
function sessGC() {
  const now = Date.now(); let dirty = false;
  for (const k of Object.keys(SESS.tokens)) {
    if (!SESS.tokens[k] || SESS.tokens[k].exp < now) { delete SESS.tokens[k]; dirty = true; }
  }
  return dirty;
}
function issueToken(u) {
  const t = crypto.randomBytes(24).toString('hex');
  SESS.tokens[t] = { phone: u.phone, role: u.role, name: u.name, exp: Date.now() + TOKEN_TTL };
  if (sessGC()) { /* 顺手清理 */ }
  enqueued(SFILE, () => saveSess());
  return t;
}
function auth(req) {
  const h = req.headers['authorization'] || '';
  const m = /^Bearer\s+([0-9a-f]{48})$/i.exec(h);
  if (!m) return null;
  const s = SESS.tokens[m[1]];
  if (!s || s.exp < Date.now()) return null;
  const u = USERS.users.find(x => x.phone === s.phone);
  if (!u) return null;                 // 账号被删 → 会话失效
  /* 封禁/改权限实时生效：以用户表当前值为准 */
  return { token: m[1], user: u, brief: { phone: u.phone, role: u.role, name: u.name, perms: u.perms || null, banned: !!u.banned } };
}

/* ---------- HTTP 基础 ---------- */
function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > BODY_MAX) { reject(new Error('body too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(new Error('bad json')); }
    });
    req.on('error', reject);
  });
}

/* ---------- 业务：注册/登录 ---------- */
function publicUser(u) {
  return { phone: u.phone, role: u.role, name: u.name, perms: u.perms || null, banned: !!u.banned, banReason: u.banReason || null, regAt: u.regAt, lastLogin: u.lastLogin };
}
function doRegister(body) {
  const ph = String(body.phone || '').trim();
  const nm = String(body.name || '').trim().slice(0, 12);
  const p = String(body.pass || '');
  if (!validPhone(ph)) fail(400, '手机号格式不正确：必须 11 位且以 1 开头');
  if (USERS.users.some(x => x.phone === ph)) fail(400, '该手机号已注册过，请直接登录');
  const issue = passIssue(p);
  if (issue) fail(400, issue);
  const salt = crypto.randomBytes(8).toString('hex');
  const user = { phone: ph, role: 'user', name: nm || ('同学' + ph.slice(-4)), salt, hash: hashPass(salt, p), regAt: nowStr(), lastLogin: null };
  return enqueued(UFILE, () => {
    /* 队列内复查（防并发重名） */
    if (USERS.users.some(x => x.phone === ph)) throw { code: 400, msg: '该手机号已注册过，请直接登录' };
    rollBackup(UFILE);
    USERS.rev++;
    USERS.users.push(user);
    USERS.savedAt = Date.now();
    atomicWrite(UFILE, USERS);
    return { ok: 1, token: issueToken(user), user: publicUser(user) };
  });
}
function doLogin(body) {
  const ph = String(body.phone || '').trim();
  const p = String(body.pass || '');
  const u = USERS.users.find(x => x.phone === ph);
  if (!u) fail(400, '该手机号尚未注册，请先注册');
  if (u.banned) fail(403, '该账号已被封禁' + (u.banReason ? '：' + u.banReason : ''));
  if (u.lockUntil && Date.now() < u.lockUntil) fail(429, '密码错误次数过多，请 ' + Math.ceil((u.lockUntil - Date.now()) / 60000) + ' 分钟后再试');
  if (hashPass(u.salt, p) !== u.hash) {
    return enqueued(UFILE, () => {
      const uu = USERS.users.find(x => x.phone === ph);
      if (!uu) throw { code: 400, msg: '该手机号尚未注册' };
      uu.failN = (uu.failN || 0) + 1;
      if (uu.failN >= 5) { uu.lockUntil = Date.now() + 10 * 60 * 1000; uu.failN = 0; }
      rollBackup(UFILE); USERS.rev++;
      atomicWrite(UFILE, USERS);
      throw { code: 401, msg: '密码不正确' + (uu.lockUntil ? '，已连续错 5 次，锁定 10 分钟' : '') };
    });
  }
  return enqueued(UFILE, () => {
    const uu = USERS.users.find(x => x.phone === ph);
    if (!uu) throw { code: 400, msg: '该手机号尚未注册' };
    if (uu.banned) throw { code: 403, msg: '该账号已被封禁' };
    uu.failN = 0; delete uu.lockUntil; uu.lastLogin = nowStr();
    rollBackup(UFILE); USERS.rev++;
    atomicWrite(UFILE, USERS);
    return { ok: 1, token: issueToken(uu), user: publicUser(uu) };
  });
}

/* ---------- 业务：学习存档（乐观锁） ---------- */
function stateRead(phone) {
  const f = userFilePath(phone);
  try {
    const v = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (v && typeof v === 'object' && 'data' in v) return v;
  } catch (e) { }
  for (const suf of ['.bak1', '.bak2']) {
    try {
      const v = JSON.parse(fs.readFileSync(f + suf, 'utf8'));
      if (v && 'data' in v) { console.warn('存档从备份恢复', phone, suf); return v; }
    } catch (e) { }
  }
  return { rev: 0, data: null };
}
function stateWrite(phone, data, rev) {
  const f = userFilePath(phone);
  return enqueued(f, () => {
    const cur = stateRead(phone);
    if (typeof rev !== 'number' || rev !== cur.rev) {
      return { code: 409, body: { ok: 0, err: 'conflict', rev: cur.rev, data: cur.data } };
    }
    rollBackup(f);
    const next = { rev: cur.rev + 1, savedAt: Date.now(), data: data };
    atomicWrite(f, next);
    return { ok: 1, rev: next.rev };
  });
}

/* ---------- 业务：管理员 ---------- */
function adminList() {
  return USERS.users.map(u => {
    const o = publicUser(u);
    o.locked = !!(u.lockUntil && Date.now() < u.lockUntil);
    o.failN = u.failN || 0;
    /* 学习摘要（读档统计） */
    try {
      const st = stateRead(u.phone);
      const d = st.data || {};
      let att = 0, cor = 0, lit = 0, wrong = 0, days = 0;
      Object.keys(d.st || {}).forEach(k => { att += d.st[k].att || 0; cor += d.st[k].cor || 0; });
      Object.keys(d.lit || {}).forEach(k => { if (d.lit[k]) lit++; });
      wrong = (d.wrong || []).length;
      days = Object.keys(d.days || {}).length;
      o.stat = { att, cor, lit, wrong, days };
    } catch (e) { o.stat = { att: 0, cor: 0, lit: 0, wrong: 0, days: 0 }; }
    return o;
  });
}
function findU(phone) { return USERS.users.find(x => x.phone === phone); }
function usersCommit(mut) {
  return enqueued(UFILE, () => {
    const r = mut();                    // mut 内 throw 业务错误
    rollBackup(UFILE);
    USERS.rev++;
    USERS.savedAt = Date.now();
    atomicWrite(UFILE, USERS);
    return r === undefined ? { ok: 1 } : r;
  });
}
function adminAddUser(body) {
  const ph = String(body.phone || '').trim();
  const nm = String(body.name || '').trim().slice(0, 12);
  const p = String(body.pass || '');
  if (!validPhone(ph)) fail(400, '手机号格式不正确：必须 11 位且以 1 开头');
  const issue = passIssue(p);
  if (issue) fail(400, issue);
  return usersCommit(() => {
    if (findU(ph)) throw { code: 400, msg: '该手机号已存在' };
    const salt = crypto.randomBytes(8).toString('hex');
    USERS.users.push({ phone: ph, role: 'user', name: nm || ('同学' + ph.slice(-4)), salt, hash: hashPass(salt, p), regAt: nowStr(), lastLogin: null });
    return { ok: 1, user: ph };
  });
}
function adminEditUser(phone, body) {
  return usersCommit(() => {
    const u = findU(phone);
    if (!u) throw { code: 404, msg: '账号不存在' };
    if (u.role === 'admin') throw { code: 403, msg: '不能编辑管理员账号的角色保护字段' };
    if (body.name !== undefined) {
      const nm = String(body.name).trim().slice(0, 12);
      if (!nm) throw { code: 400, msg: '昵称不能为空' };
      u.name = nm;
    }
    if (body.perms !== undefined) {
      if (body.perms === null) delete u.perms;      // null = 全功能
      else if (typeof body.perms === 'object') u.perms = body.perms;
    }
    return { ok: 1 };
  });
}
function adminResetPass(phone, body) {
  const p = String(body.pass || '');
  const issue = passIssue(p);
  if (issue) fail(400, issue);
  return usersCommit(() => {
    const u = findU(phone);
    if (!u) throw { code: 404, msg: '账号不存在' };
    const salt = crypto.randomBytes(8).toString('hex');
    u.salt = salt; u.hash = hashPass(salt, p);
    delete u.failN; delete u.lockUntil;
    return { ok: 1 };
  });
}
function adminBan(phone, body) {
  return usersCommit(() => {
    const u = findU(phone);
    if (!u) throw { code: 404, msg: '账号不存在' };
    if (u.role === 'admin') throw { code: 403, msg: '不能封禁管理员账号' };
    u.banned = true;
    u.banReason = String(body.reason || '').trim().slice(0, 60);
    u.banAt = nowStr();
    /* 踢出该账号所有会话 */
    let dirty = false;
    for (const k of Object.keys(SESS.tokens)) {
      if (SESS.tokens[k].phone === phone) { delete SESS.tokens[k]; dirty = true; }
    }
    if (dirty) enqueued(SFILE, () => saveSess());
    return { ok: 1 };
  });
}
function adminUnban(phone) {
  return usersCommit(() => {
    const u = findU(phone);
    if (!u) throw { code: 404, msg: '账号不存在' };
    delete u.banned; delete u.banReason; delete u.banAt;
    return { ok: 1 };
  });
}
function adminDelUser(phone) {
  return usersCommit(() => {
    const u = findU(phone);
    if (!u) throw { code: 404, msg: '账号不存在' };
    if (u.role === 'admin') throw { code: 403, msg: '不能删除管理员账号' };
    USERS.users = USERS.users.filter(x => x.phone !== phone);
    /* 学习存档：滚备份后移除（主档删，bak 保留兜底） */
    try {
      const f = userFilePath(phone);
      if (fs.existsSync(f)) {
        if (fs.existsSync(f + '.bak1')) fs.copyFileSync(f + '.bak1', f + '.bak2');
        fs.copyFileSync(f, f + '.bak1');
        fs.unlinkSync(f);
      }
    } catch (e) { console.warn('删除存档失败(忽略)', e.message); }
    /* 踢出会话 */
    for (const k of Object.keys(SESS.tokens)) {
      if (SESS.tokens[k].phone === phone) delete SESS.tokens[k];
    }
    enqueued(SFILE, () => saveSess());
    return { ok: 1 };
  });
}
/* 迁移导入：兼容前端导出格式 {db:{users:[...]}} 或 {users:[...]} */
function adminImport(body) {
  const db = body.db || body;
  if (!db || !Array.isArray(db.users)) fail(400, '格式不对：需要 users 数组');
  const list = db.users.filter(u => u && validPhone(u.phone) && u.hash && u.salt);
  if (!list.length) fail(400, '没有可导入的有效账号（需含 phone/salt/hash）');
  return usersCommit(() => {
    let add = 0, upd = 0;
    list.forEach(u => {
      const i = USERS.users.findIndex(x => x.phone === u.phone);
      if (i >= 0) { USERS.users[i] = u; upd++; }
      else { USERS.users.push(u); add++; }
    });
    return { ok: 1, added: add, updated: upd, total: USERS.users.length };
  });
}

function fail(code, msg) { throw { code, msg }; }   /* 业务错误：统一抛出，路由层转 HTTP 状态码 */

/* ---------- 路由 ---------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (req.method === 'OPTIONS') return send(res, 204, {});
  try {
    /* 探测 */
    if (p === '/api/ping') return send(res, 200, { ok: 1, cloud: 1, ver: 1, now: nowStr() });

    /* 认证类 */
    if (p === '/api/register' && req.method === 'POST') return send(res, 200, await doRegister(await readBody(req)));
    if (p === '/api/login' && req.method === 'POST') return send(res, 200, await doLogin(await readBody(req)));

    /* 以下全部需要登录 */
    const a = auth(req);
    if (p === '/api/whoami') {
      if (!a) return send(res, 401, { ok: 0, err: '未登录或会话过期' });
      return send(res, 200, { ok: 1, user: a.brief });
    }
    if (p === '/api/logout' && req.method === 'POST') {
      if (a) { delete SESS.tokens[a.token]; enqueued(SFILE, () => saveSess()); }
      return send(res, 200, { ok: 1 });
    }
    if (p === '/api/state') {
      if (!a) return send(res, 401, { ok: 0, err: '未登录' });
      if (req.method === 'GET') {
        const st = stateRead(a.user.phone);
        return send(res, 200, { ok: 1, rev: st.rev, data: st.data });
      }
      if (req.method === 'PUT') {
        const body = await readBody(req);
        const r = await stateWrite(a.user.phone, body.data, body.rev);
        return send(res, r.code || 200, r.body !== undefined ? r.body : r);
      }
    }

    /* 管理员端点 */
    if (p.startsWith('/api/admin/')) {
      if (!a) return send(res, 401, { ok: 0, err: '未登录' });
      if (a.user.role !== 'admin') return send(res, 403, { ok: 0, err: '需要管理员权限' });
      const parts = p.split('/').filter(Boolean);   // ['api','admin','users',phone?,'ban'?]
      if (p === '/api/admin/users' && req.method === 'GET') return send(res, 200, { ok: 1, users: adminList() });
      if (p === '/api/admin/users' && req.method === 'POST') return send(res, 200, await adminAddUser(await readBody(req)));
      if (p === '/api/admin/import' && req.method === 'POST') return send(res, 200, await adminImport(await readBody(req)));
      if (parts[2] === 'users' && parts[3]) {
        const phone = parts[3];
        if (parts.length === 4 && req.method === 'PUT') return send(res, 200, await adminEditUser(phone, await readBody(req)));
        if (parts[4] === 'resetpass' && req.method === 'POST') return send(res, 200, await adminResetPass(phone, await readBody(req)));
        if (parts[4] === 'ban' && req.method === 'POST') return send(res, 200, await adminBan(phone, await readBody(req)));
        if (parts[4] === 'unban' && req.method === 'POST') return send(res, 200, await adminUnban(phone));
        if (parts.length === 4 && req.method === 'DELETE') return send(res, 200, await adminDelUser(phone));
      }
      return send(res, 404, { ok: 0, err: 'no such admin endpoint' });
    }

    return send(res, 404, { ok: 0, err: 'not found' });
  } catch (e) {
    if (e && e.code && e.msg) return send(res, e.code, { ok: 0, err: e.msg });
    console.error('服务器错误', req.method, p, e);
    return send(res, 500, { ok: 0, err: '服务器内部错误' });
  }
});

/* ---------- 启动 ---------- */
fs.mkdirSync(SDIR, { recursive: true });
USERS = loadUsers();
SESS = loadSess();
/* 预置管理员（沿用前端账号；哈希不兼容时自动重建） */
(function ensureAdmin() {
  const u = findU(ADMIN_PHONE);
  if (!u) {
    const salt = crypto.randomBytes(8).toString('hex');
    USERS.users.push({ phone: ADMIN_PHONE, role: 'admin', name: '管理员', salt, hash: hashPass(salt, ADMIN_PASS), regAt: '2026-01-01 00:00:00', lastLogin: null });
    USERS.rev++; atomicWrite(UFILE, USERS);
    console.log('已预置管理员', ADMIN_PHONE);
  } else if (u.role !== 'admin') {
    u.role = 'admin'; USERS.rev++; atomicWrite(UFILE, USERS);
  }
  /* 存量本地账号的 hash 是纯 JS sha256 产物，与 node crypto 结果一致，无需转换 */
})();
sessGC();
server.listen(PORT, '0.0.0.0', () => {
  console.log('math6q 云端同步服务已启动 http://0.0.0.0:' + PORT + '，数据目录 ' + DATA + '，用户数 ' + USERS.users.length);
});
