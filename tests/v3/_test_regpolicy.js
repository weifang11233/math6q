/* v3.10 禁止开放注册 端到端测试：起仓库 server/server.js（隔离数据目录），验证：
   1) 默认开放注册；2) 管理员开关可读写且持久化；3) 非管理员写被 403 拒；
   4) 关闭后 /api/register 被拦、已有账号登录正常、管理员创建账号仍可用；
   5) 重启后设置仍在（读盘）。 */
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'qd6-regpolicy-')), 'data');
const API_PORT = 8907;
const SRV = path.join(ROOT, 'server', 'server.js');
const ADMIN_PHONE = '13455656547';
/* 仓库内示例管理员密码（与 index.html / server.js 的示例 ADMIN_SALT+ADMIN_HASH 配对）；
   线上真实凭证不入库，由部署时经 QD6_ADMIN_SALT / QD6_ADMIN_HASH 环境变量注入。 */
const ADMIN_PASS = 'Change@Me2026';

let passed = 0, failed = 0;
function chk(name, cond, extra) {
  if (cond) { passed++; console.log('  PASS ' + name); }
  else { failed++; console.log('  FAIL ' + name, extra !== undefined ? '→ ' + JSON.stringify(extra).slice(0, 400) : ''); }
}
function req(method, p, body, token) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : JSON.stringify(body);
    const r = http.request({ host: '127.0.0.1', port: API_PORT, path: p, method,
      headers: Object.assign({ 'Content-Type': 'application/json' },
        data ? { 'Content-Length': Buffer.byteLength(data) } : {},
        token ? { Authorization: 'Bearer ' + token } : {}) }, res => {
      let s = ''; res.on('data', c => s += c);
      res.on('end', () => { try { resolve({ code: res.statusCode, body: JSON.parse(s) }); } catch (e) { resolve({ code: res.statusCode, body: s }); } });
    });
    r.on('error', reject); if (data) r.write(data); r.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
function start() {
  return spawn('node', [SRV], {
    env: Object.assign({}, process.env, { PORT: String(API_PORT), QD6_DATA: DATA,
      QD6_HC_ENDPOINT: 'http://127.0.0.1:1/v1/chat/completions' }),
    stdio: ['ignore', 'pipe', 'pipe']
  });
}
const PASS10 = 'Aa1!aaaaaa'; // 10 位：数字/大写/小写/特殊

(async () => {
  let srv = start();
  let srvErr = ''; srv.stderr.on('data', c => srvErr += c);
  await sleep(700);

  console.log('=== 1) 默认状态：开放注册 ===');
  let g = await req('GET', '/api/settings');
  chk('GET /api/settings 公开可读', g.code === 200 && g.body.ok === 1, g);
  chk('默认 closeReg=false', g.body.closeReg === false, g.body);

  console.log('=== 2) 管理员登录 ===');
  let lg = await req('POST', '/api/login', { phone: ADMIN_PHONE, pass: ADMIN_PASS });
  chk('管理员登录成功', lg.code === 200 && lg.body.ok === 1 && lg.body.user.role === 'admin', lg.body);
  const adminTok = lg.body.token;

  console.log('=== 3) 开放状态下注册可用 ===');
  let reg1 = await req('POST', '/api/register', { phone: '13900000001', name: '测试A', pass: PASS10 });
  chk('未禁止时可注册', reg1.code === 200 && reg1.body.ok === 1, reg1.body);

  console.log('=== 4) 非管理员不能改注册策略 ===');
  let ul = await req('POST', '/api/login', { phone: '13900000001', pass: PASS10 });
  const userTok = ul.body.token;
  let badSet = await req('POST', '/api/admin/settings', { closeReg: true }, userTok);
  chk('普通用户写 /api/admin/settings 被拒(403)', badSet.code === 403, badSet);
  let badGet = await req('GET', '/api/admin/settings', undefined, userTok);
  chk('普通用户读 /api/admin/settings 被拒(403)', badGet.code === 403, badGet);
  let noAuthSet = await req('POST', '/api/admin/settings', { closeReg: true });
  chk('未登录写被拒(401)', noAuthSet.code === 401, noAuthSet);

  console.log('=== 5) 管理员开启禁止开放注册 ===');
  let set1 = await req('POST', '/api/admin/settings', { closeReg: true }, adminTok);
  chk('管理员设置成功', set1.code === 200 && set1.body.ok === 1 && set1.body.closeReg === true, set1.body);
  g = await req('GET', '/api/settings');
  chk('公开读取到已禁止', g.body.closeReg === true, g.body);
  let admg = await req('GET', '/api/admin/settings', undefined, adminTok);
  chk('管理员读回一致', admg.body.closeReg === true, admg.body);

  console.log('=== 6) 禁止后：开放注册被拦 ===');
  let reg2 = await req('POST', '/api/register', { phone: '13900000002', name: '测试B', pass: PASS10 });
  chk('新注册被拒(403)', reg2.code === 403 && /关闭开放注册/.test(reg2.body.err || ''), reg2);
  chk('被拒账号未写入用户表', (await req('POST', '/api/login', { phone: '13900000002', pass: PASS10 })).code === 400, '应仍提示未注册');

  console.log('=== 7) 禁止后：已有账号登录不受影响 ===');
  let lgA = await req('POST', '/api/login', { phone: '13900000001', pass: PASS10 });
  chk('已注册用户仍可登录', lgA.code === 200 && lgA.body.ok === 1, lgA.body);
  let lgAdmin = await req('POST', '/api/login', { phone: ADMIN_PHONE, pass: ADMIN_PASS });
  chk('管理员仍可登录', lgAdmin.code === 200 && lgAdmin.body.ok === 1, lgAdmin.body);

  console.log('=== 8) 禁止后：管理员创建账号仍可用 ===');
  let add = await req('POST', '/api/admin/users', { phone: '13900000003', name: '管理员建的', pass: PASS10 }, adminTok);
  chk('管理员建号成功', add.code === 200 && add.body.ok === 1, add.body);
  let lgC = await req('POST', '/api/login', { phone: '13900000003', pass: PASS10 });
  chk('新建账号可登录', lgC.code === 200 && lgC.body.ok === 1, lgC.body);

  console.log('=== 9) 持久化：重启后仍禁止 ===');
  srv.kill('SIGTERM'); await sleep(400);
  srv = start(); srv.stderr.on('data', c => srvErr += c);
  await sleep(700);
  g = await req('GET', '/api/settings');
  chk('重启后 closeReg 仍为 true', g.body.closeReg === true, g.body);

  console.log('=== 10) 管理员可再恢复开放 ===');
  let lg2 = await req('POST', '/api/login', { phone: ADMIN_PHONE, pass: ADMIN_PASS });
  let un = await req('POST', '/api/admin/settings', { closeReg: false }, lg2.body.token);
  chk('管理员关闭开关成功', un.code === 200 && un.body.closeReg === false, un.body);
  let reg3 = await req('POST', '/api/register', { phone: '13900000004', name: '恢复后', pass: PASS10 });
  chk('恢复开放后注册可用', reg3.code === 200 && reg3.body.ok === 1, reg3.body);

  srv.kill('SIGTERM');
  try { fs.rmSync(path.dirname(DATA), { recursive: true, force: true }); } catch (e) { }
  console.log('\n=== 结果：PASS ' + passed + ' / FAIL ' + failed + ' ===');
  if (srvErr && /Error|throw|未捕获/.test(srvErr)) console.log('服务端 stderr 摘要:', srvErr.slice(0, 500));
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('测试异常:', e); process.exit(2); });
