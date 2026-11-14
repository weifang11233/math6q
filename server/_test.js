/* math6q 云端服务端到端断言测试（本地起服务，打 HTTP） */
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = path.join(ROOT, '_test_data');
try { fs.rmSync(DATA, { recursive: true, force: true }); } catch (e) { }

let passed = 0, failed = 0;
function chk(name, cond, extra) {
  if (cond) { passed++; console.log('  ✓', name); }
  else { failed++; console.log('  ✗', name, extra !== undefined ? '→ ' + JSON.stringify(extra).slice(0, 200) : ''); }
}
function req(method, p, body, token) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : JSON.stringify(body);
    const r = http.request({
      host: '127.0.0.1', port: 8897, path: p, method,
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        data ? { 'Content-Length': Buffer.byteLength(data) } : {},
        token ? { Authorization: 'Bearer ' + token } : {})
    }, res => {
      let s = '';
      res.on('data', c => s += c);
      res.on('end', () => { try { resolve({ code: res.statusCode, body: JSON.parse(s) }); } catch (e) { resolve({ code: res.statusCode, body: s }); } });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  const srv = spawn('node', [path.join(ROOT, 'server.js')], {
    env: Object.assign({}, process.env, { PORT: '8897', QD6_DATA: DATA }),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  srv.stderr.on('data', d => console.error('[srv-err]', String(d).trim()));
  /* 等待监听 */
  for (let i = 0; i < 40; i++) {
    try { await req('GET', '/api/ping'); break; } catch (e) { await new Promise(r => setTimeout(r, 150)); }
  }

  console.log('── 探测与会话 ──');
  let r = await req('GET', '/api/ping');
  chk('ping 200', r.code === 200 && r.body.cloud === 1, r);

  console.log('── 注册 / 登录 ──');
  r = await req('POST', '/api/register', { phone: '13900001001', name: '小明', pass: 'Aa1#bcdefg' });
  chk('注册成功并返回 token', r.code === 200 && r.body.token && r.body.token.length === 48, r);
  const tokXiao = r.body.token;
  r = await req('POST', '/api/register', { phone: '13900001001', pass: 'Aa1#bcdefg' });
  chk('重复注册被拒', r.code === 400, r);
  r = await req('POST', '/api/register', { phone: '13900001002', pass: 'weak' });
  chk('弱密码被拒', r.code === 400 && /10 位/.test(r.body.err), r);
  r = await req('POST', '/api/register', { phone: '23900001003', pass: 'Aa1#bcdefg' });
  chk('非法手机号被拒', r.code === 400, r);
  r = await req('POST', '/api/login', { phone: '13900001001', pass: 'wrong' });
  chk('错误密码 401', r.code === 401, r);
  r = await req('POST', '/api/login', { phone: '13900001001', pass: 'Aa1#bcdefg' });
  chk('正确密码登录成功', r.code === 200 && r.body.user.role === 'user', r);
  const tokXiao2 = r.body.token;
  chk('两次登录 token 不同（多会话）', tokXiao !== tokXiao2);

  console.log('── 预置管理员 ──');
  r = await req('POST', '/api/login', { phone: '13455656547', pass: 'KAyFN&6t253Z#m2x0Fq3' });
  chk('预置管理员可登录', r.code === 200 && r.body.user.role === 'admin', r);
  const tokAdmin = r.body.token;

  console.log('── 学习存档（乐观锁一致性核心）──');
  r = await req('GET', '/api/state', undefined, tokXiao);
  chk('新账号存档为空 rev=0', r.code === 200 && r.body.rev === 0 && r.body.data === null, r);
  r = await req('PUT', '/api/state', { rev: 0, data: { name: '小明', att: 1, st: { 1: { att: 5, cor: 4 } } } }, tokXiao);
  chk('rev=0 写入成功 rev=1', r.code === 200 && r.body.rev === 1, r);
  /* 模拟设备 B 拿着旧 rev 写（设备 A 已写过）→ 冲突 409 + 服务端最新 */
  r = await req('PUT', '/api/state', { rev: 0, data: { name: '小明', st: {} } }, tokXiao2);
  chk('旧 rev 写入返回 409 冲突并带最新数据', r.code === 409 && r.body.rev === 1 && r.body.data && r.body.data.st['1'].att === 5, r);
  /* 设备 B 用服务端最新 rev 重写（合并后提交） */
  r = await req('PUT', '/api/state', { rev: r.body.rev, data: { name: '小明', att: 1, st: { 1: { att: 5, cor: 4 }, 2: { att: 3, cor: 3 } } } }, tokXiao2);
  chk('合并后用最新 rev 写入成功', r.code === 200 && r.body.rev === 2, r);
  r = await req('GET', '/api/state', undefined, tokXiao);
  chk('读回数据一致', r.body.rev === 2 && r.body.data.st['2'].cor === 3, r);
  /* 越权：用户不能读写别人存档 —— token 绑定账号，服务端无跨账号接口 */
  r = await req('GET', '/api/state', undefined, 'ffffffffffffffffffffffffffffffffffffffffffffffff');
  chk('假 token 401', r.code === 401, r);

  console.log('── 管理员账号管理 ──');
  r = await req('GET', '/api/admin/users', undefined, tokXiao);
  chk('普通用户访问管理端点 403', r.code === 403, r);
  r = await req('GET', '/api/admin/users', undefined, tokAdmin);
  chk('管理员列表含统计', r.code === 200 && r.body.users.length >= 2 && r.body.users[0].stat !== undefined, r.body.users && r.body.users.length);
  r = await req('POST', '/api/admin/users', { phone: '13900001003', name: '小刚', pass: 'Bb2$xywert' }, tokAdmin);
  chk('管理员新增账号', r.code === 200, r);
  r = await req('POST', '/api/admin/users', { phone: '13900001001', pass: 'Bb2$xywert' }, tokAdmin);
  chk('新增重号被拒', r.code === 400, r);
  r = await req('PUT', '/api/admin/users/13900001003', { name: '小刚改' }, tokAdmin);
  chk('编辑昵称', r.code === 200, r);
  r = await req('PUT', '/api/admin/users/13900001003', { perms: { gen: true, daily: false } }, tokAdmin);
  chk('编辑模块授权', r.code === 200, r);
  r = await req('GET', '/api/whoami', undefined, tokAdmin);
  chk('whoami 正常', r.code === 200 && r.body.user.role === 'admin', r);
  /* 小刚登录验证新昵称与授权，然后重置密码 */
  r = await req('POST', '/api/login', { phone: '13900001003', pass: 'Bb2$xywert' });
  chk('新增账号可用原密码登录', r.code === 200 && r.body.user.name === '小刚改', r.body.user);
  const tokGang = r.body.token;
  r = await req('POST', '/api/admin/users/13900001003/resetpass', { pass: 'Cc3$zcvbnm' }, tokAdmin);
  chk('重置密码', r.code === 200, r);
  r = await req('POST', '/api/login', { phone: '13900001003', pass: 'Bb2$xywert' });
  chk('旧密码失效', r.code === 401, r);
  r = await req('POST', '/api/login', { phone: '13900001003', pass: 'Cc3$zcvbnm' });
  chk('新密码可登录', r.code === 200, r);
  /* 重置密码后旧 token 仍有效（账号未删除）——但封禁会踢 */
  r = await req('POST', '/api/admin/users/13900001003/ban', { reason: '测试封禁' }, tokAdmin);
  chk('封禁账号', r.code === 200, r);
  r = await req('GET', '/api/state', undefined, tokGang);
  chk('封禁后会话立即失效（auth 实时校验）', r.code === 401, r);
  r = await req('POST', '/api/login', { phone: '13900001003', pass: 'Cc3$zcvbnm' });
  chk('封禁后无法登录', r.code === 403, r);
  r = await req('POST', '/api/admin/users/13900001003/unban', undefined, tokAdmin);
  chk('解封', r.code === 200, r);
  r = await req('POST', '/api/login', { phone: '13900001003', pass: 'Cc3$zcvbnm' });
  chk('解封后可登录', r.code === 200, r);
  /* 删除账号 */
  const gangToken = r.body.token;
  r = await req('PUT', '/api/state', { rev: 0, data: { name: '小刚改', st: { 3: { att: 2, cor: 2 } } } }, gangToken);
  chk('小刚写存档', r.code === 200, r);
  r = await req('DELETE', '/api/admin/users/13900001003', undefined, tokAdmin);
  chk('删除账号', r.code === 200, r);
  r = await req('POST', '/api/login', { phone: '13900001003', pass: 'Cc3$zcvbnm' });
  chk('删除后无法登录', r.code === 400, r);
  r = await req('GET', '/api/state', undefined, gangToken);
  chk('删除后会话失效', r.code === 401, r);
  chk('存档主档已删、备份保留', fs.existsSync(path.join(DATA, 'state', 'qd6_state_13900001003.json.bak1')) && !fs.existsSync(path.join(DATA, 'state', 'qd6_state_13900001003.json')), 'bak1=' + fs.existsSync(path.join(DATA, 'state', 'qd6_state_13900001003.json.bak1')));

  console.log('── 管理员保护 ──');
  r = await req('DELETE', '/api/admin/users/13455656547', undefined, tokAdmin);
  chk('不能删除管理员', r.code === 403, r);
  r = await req('POST', '/api/admin/users/13455656547/ban', { reason: 'x' }, tokAdmin);
  chk('不能封禁管理员', r.code === 403, r);

  console.log('── 迁移导入（旧 localStorage 数据上云）──');
  /* 模拟前端导出格式：旧账号 hash 由纯 JS sha256 生成——用 node crypto 验证兼容 */
  r = await req('POST', '/api/login', { phone: '13900001001', pass: 'Aa1#bcdefg' });
  chk('迁移前置：正常账号登录 OK', r.code === 200, r);
  const crypto = require('crypto');
  const salt = 'migrateSalt01';
  const hash = crypto.createHash('sha256').update(salt + '::' + 'Dd4$qwererty', 'utf8').digest('hex');
  r = await req('POST', '/api/admin/import', { db: { users: [{ phone: '13700009001', role: 'user', name: '电脑端老账号', salt, hash, regAt: '2026-11-14 10:00:00', lastLogin: null }] } }, tokAdmin);
  chk('导入带 hash 账号成功', r.code === 200 && r.body.added === 1, r);
  r = await req('POST', '/api/login', { phone: '13700009001', pass: 'Dd4$qwererty' });
  chk('导入账号密码哈希兼容（可直接登录）', r.code === 200, r);
  r = await req('POST', '/api/admin/import', { db: { users: [{ phone: 'bad' }] } }, tokAdmin);
  chk('无效导入被拒', r.code === 400, r);

  console.log('── 双备份与重启恢复 ──');
  const uj = JSON.parse(fs.readFileSync(path.join(DATA, 'users.json'), 'utf8'));
  chk('users.json 带 rev 与 savedAt', typeof uj.rev === 'number' && uj.rev > 0 && !!uj.savedAt, uj.rev);
  chk('备份文件存在', fs.existsSync(path.join(DATA, 'users.json.bak1')), null);
  /* 损坏主表 → 重启应从备份恢复 */
  fs.writeFileSync(path.join(DATA, 'users.json'), '{broken');
  srv.kill();
  await new Promise(r => setTimeout(r, 300));
  const srv2 = spawn('node', [path.join(ROOT, 'server.js')], {
    env: Object.assign({}, process.env, { PORT: '8897', QD6_DATA: DATA }),
    stdio: ['ignore', 'pipe', 'pipe']
  });
  for (let i = 0; i < 40; i++) {
    try { await req('GET', '/api/ping'); break; } catch (e) { await new Promise(r => setTimeout(r, 150)); }
  }
  r = await req('POST', '/api/login', { phone: '13900001001', pass: 'Aa1#bcdefg' });
  chk('主表损坏重启后从备份恢复并登录 OK', r.code === 200, r);
  /* 会话落盘：重启后旧 token 仍有效 */
  r = await req('GET', '/api/state', undefined, tokXiao);
  chk('会话落盘重启不丢', r.code === 200 && r.body.rev === 2, r);
  srv2.kill();

  console.log('\n结果：' + passed + ' 通过 / ' + failed + ' 失败');
  try { fs.rmSync(DATA, { recursive: true, force: true }); } catch (e) { }
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('测试框架异常', e); process.exit(2); });
