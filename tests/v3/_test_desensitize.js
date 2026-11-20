/* 脱敏改动专项验证：确认示例凭证配对正确、冷启动管理员可登录、env 注入生效。
   这是本次「线上全量入库」唯一改动了运行逻辑的地方，必须单独验。
   用法：node tests/v3/_test_desensitize.js */
const fs = require('fs'), path = require('path'), cp = require('child_process'),
      crypto = require('crypto'), os = require('os');

const ROOT = path.resolve(__dirname, '..', '..');
let pass = 0, fail = 0;
function chk(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? ' → ' + extra : '')); }
}
function hashPass(salt, p) {
  return crypto.createHash('sha256').update(salt + '::' + p, 'utf8').digest('hex');
}

/* ---------- 1. 静态检查：仓库内只能出现示例凭证 ---------- */
console.log('── 1. 仓库内凭证必须是示例值 ──');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const srv = fs.readFileSync(path.join(ROOT, 'server', 'server.js'), 'utf8');
const ngx = fs.readFileSync(path.join(ROOT, 'deploy', 'nginx.conf'), 'utf8');
const ig = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');

/* 示例凭证（仓库允许出现的唯一值） */
const EX_SALT = 'e9d4c1a7b3f08256';
const EX_PASS = 'Change@Me2026';
const EX_HASH = '780afbeb46dfdba13c7e28be373e6003de70cef817bcc947ac6da26f4bed436a';

/* 结构性断言：不引用任何真实凭证值，避免测试自身成为泄露点。
   思路——提取代码里实际写着的 salt/hash 字面量，要求它「只能是示例值」。 */
function pickLiterals(src, re) {
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}
const htmlSalts = pickLiterals(html, /ADMIN_SALT\s*=\s*'([^']*)'/g);
const htmlHashes = pickLiterals(html, /ADMIN_HASH\s*=\s*'([^']*)'/g);
const srvSalts = pickLiterals(srv, /ADMIN_SALT\s*=\s*(?:process\.env[^|]*\|\|\s*)?'([^']*)'/g);
const srvHashes = pickLiterals(srv, /ADMIN_HASH\s*=\s*(?:process\.env[^|]*\|\|\s*)?'([^']*)'/g);

chk('index.html 的 ADMIN_SALT 只能是示例值', htmlSalts.length === 1 && htmlSalts[0] === EX_SALT, htmlSalts);
chk('index.html 的 ADMIN_HASH 只能是示例值', htmlHashes.length === 1 && htmlHashes[0] === EX_HASH, htmlHashes);
chk('server.js 的 ADMIN_SALT 只能是示例值', srvSalts.length === 1 && srvSalts[0] === EX_SALT, srvSalts);
chk('server.js 的 ADMIN_HASH 只能是示例值', srvHashes.length === 1 && srvHashes[0] === EX_HASH, srvHashes);
chk('index.html 无明文密码常量（已改用 salt+hash）', !/ADMIN_PASS\s*=\s*'/.test(html));
chk('nginx.conf 无任何 sk- 字面量密钥', !/Bearer\s+sk-[A-Za-z0-9]/.test(ngx));
chk('nginx.conf 保留占位符',
  ngx.includes('__LLM_API_KEY__') && ngx.includes('__LLM_GATEWAY_HOST__') && ngx.includes('__API_SERVER_HOST__'));
chk('.gitignore 排除部署成品与数据目录',
  /deploy\/nginx\.conf\.live/.test(ig) && /server\/data\//.test(ig) && /users\.json/.test(ig));

/* ---------- 2. 示例凭证配对正确 ---------- */
console.log('── 2. 示例凭证可自洽校验 ──');
chk('示例 salt/hash 配对（hashPass(salt,pass)===hash）', hashPass(EX_SALT, EX_PASS) === EX_HASH);
chk('index.html 使用示例凭证', html.includes(EX_SALT) && html.includes(EX_HASH));
chk('server.js 使用示例凭证', srv.includes(EX_SALT) && srv.includes(EX_HASH));
chk('示例密码符合密码规则（10-32位/四类字符）',
  EX_PASS.length >= 10 && EX_PASS.length <= 32 && /[0-9]/.test(EX_PASS) &&
  /[A-Z]/.test(EX_PASS) && /[a-z]/.test(EX_PASS) && /[^A-Za-z0-9]/.test(EX_PASS));

/* ---------- 3. 冷启动：ensureAdmin 用 ADMIN_SALT，管理员真能登录 ---------- */
console.log('── 3. 冷启动管理员可登录（原 bug 修复验证）──');
chk('server.js ensureAdmin 用 ADMIN_SALT 而非随机 salt',
  /push\(\{\s*phone:\s*ADMIN_PHONE[\s\S]{0,120}salt:\s*ADMIN_SALT/.test(srv),
  '未找到 salt: ADMIN_SALT');
chk('server.js 不再用 crypto.randomBytes 配 ADMIN_HASH',
  !/randomBytes\(8\)[\s\S]{0,200}hash:\s*ADMIN_HASH/.test(srv));
chk('index.html ensureAdmin 用 ADMIN_SALT',
  /push\(\{phone:ADMIN_PHONE[\s\S]{0,120}salt:ADMIN_SALT/.test(html));
chk('index.html 不再用 Math.random salt 配 ADMIN_HASH',
  !/Math\.random\(\)[\s\S]{0,120}hash:ADMIN_HASH/.test(html));

/* 真实起服务端冷启动，验证预置管理员能用示例密码登录 */
const tmpData = fs.mkdtempSync(path.join(os.tmpdir(), 'qd6-desens-'));
const PORT = 18931;
const srvProc = cp.spawn(process.execPath, [path.join(ROOT, 'server', 'server.js')], {
  env: Object.assign({}, process.env, { PORT: String(PORT), QD6_DATA: tmpData, QD6_HC_ENDPOINT: '' }),
  stdio: ['ignore', 'pipe', 'pipe'],
});
let srvOut = '';
srvProc.stdout.on('data', d => srvOut += d);
srvProc.stderr.on('data', d => srvOut += d);

function req(p, method, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const r = require('http').request({
      host: '127.0.0.1', port: PORT, path: p, method: method || 'GET',
      headers: Object.assign({ 'Content-Type': 'application/json' },
        token ? { Authorization: 'Bearer ' + token } : {},
        data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      timeout: 6000,
    }, res => {
      let s = ''; res.on('data', d => s += d);
      res.on('end', () => { let j = null; try { j = JSON.parse(s) } catch (e) {} resolve({ code: res.statusCode, body: j, raw: s }); });
    });
    r.on('error', e => resolve({ code: 0, body: null, raw: 'ERR ' + e.message }));
    r.on('timeout', () => { r.destroy(); resolve({ code: 0, body: null, raw: 'TIMEOUT' }) });
    if (data) r.write(data);
    r.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async function () {
  await sleep(1500);
  /* users.json 应已预置管理员，且 salt/hash 为示例值（配对） */
  const uf = path.join(tmpData, 'users.json');
  let db = null;
  try { db = JSON.parse(fs.readFileSync(uf, 'utf8')) } catch (e) {}
  chk('冷启动 users.json 已生成', !!db);
  const adm = db && db.users.find(u => u.role === 'admin');
  chk('已预置管理员账号', !!adm);
  chk('管理员 salt === ADMIN_SALT（配对，非随机）', adm && adm.salt === EX_SALT, adm ? 'salt=' + adm.salt : '');
  chk('管理员 hash === ADMIN_HASH', adm && adm.hash === EX_HASH);
  chk('hashPass(存库salt, 示例密码) === 存库hash（可登录）',
    adm && hashPass(adm.salt, EX_PASS) === adm.hash);

  const lg = await req('/api/login', 'POST', { phone: '13455656547', pass: EX_PASS });
  chk('示例密码真能登录成功', lg.code === 200 && lg.body && lg.body.ok === 1, 'code=' + lg.code + ' raw=' + String(lg.raw).slice(0, 120));
  chk('登录返回 admin 角色', lg.body && lg.body.user && lg.body.user.role === 'admin');

  /* env 注入：确认代码读 process.env.QD6_ADMIN_SALT/HASH */
  chk('server.js 支持 QD6_ADMIN_SALT env 注入', /process\.env\.QD6_ADMIN_SALT/.test(srv));
  chk('server.js 支持 QD6_ADMIN_HASH env 注入', /process\.env\.QD6_ADMIN_HASH/.test(srv));

  /* 注册策略开关（v3.10 功能）在脱敏后仍正常 */
  const st = await req('/api/settings');
  chk('公开 /api/settings 可读（v3.10 功能未破坏）', st.code === 200 && st.body && typeof st.body.closeReg !== 'undefined');

  srvProc.kill();
  fs.rmSync(tmpData, { recursive: true, force: true });

  console.log('\n结果：' + pass + ' 通过 / ' + fail + ' 失败');
  process.exit(fail ? 1 : 0);
})();
