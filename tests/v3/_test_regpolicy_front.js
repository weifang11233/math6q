/* v3.10 前端注册策略 DOM stub 真执行测试。
   做法：从仓库 index.html 提取主 script，注入 vm 沙箱，stub 掉 document/fetch/localStorage 等，
   实跑 doRegister / VIEWS.home / VIEWS.auth / saveRegPolicy / fetchRegPolicy 的 REG_CLOSE 分支，
   覆盖硬规则要求的「真执行 + 边界分支」审核。 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML = fs.readFileSync(path.resolve(__dirname, '..', '..', 'index.html'), 'utf8');
const m = HTML.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g) || [];
// 取最长的内联块（主逻辑）
let code = '';
m.forEach(s => { const b = s.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''); if (b.length > code.length) code = b; });

let passed = 0, failed = 0;
function chk(name, cond, extra) {
  if (cond) { passed++; console.log('  PASS ' + name); }
  else { failed++; console.log('  FAIL ' + name, extra !== undefined ? '→ ' + String(extra).slice(0, 300) : ''); }
}

// ---- DOM/环境 stub ----
function makeEl() {
  return { value: '', textContent: '', style: {}, checked: false, disabled: false,
    innerHTML: '', placeholder: '', type: '',
    addEventListener: function () {}, appendChild: function () {}, focus: function () {},
    classList: { add: function () {}, remove: function () {} },
    getContext: function () { return {}; } };
}
const els = {};
const document = {
  getElementById: function (id) { if (!els[id]) els[id] = makeEl(); return els[id]; },
  querySelector: function () { return makeEl(); },
  querySelectorAll: function () { return []; },
  createElement: function () { return makeEl(); },
  addEventListener: function () {},
  body: makeEl(), documentElement: makeEl(), title: ''
};
function LS() {
  const d = {};
  return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); },
    removeItem: k => { delete d[k]; }, clear: () => { for (const k in d) delete d[k]; } };
}
let fetchCalls = [];
function fakeFetch(url, opt) {
  fetchCalls.push({ url: String(url), opt: opt || {} });
  // 默认所有请求成功；body 依路径返回
  let body = { ok: 1 };
  if (/\/api\/settings$/.test(url)) body = { ok: 1, closeReg: true };
  if (/\/api\/admin\/settings$/.test(url)) body = { ok: 1, closeReg: true };
  if (/\/api\/whoami$/.test(url)) body = { ok: 1, user: { phone: '13455656547', role: 'admin', name: '管理员', perms: null, banned: false } };
  if (/\/api\/ping$/.test(url)) body = { ok: 1, cloud: 1 };
  return Promise.resolve({ status: 200, json: () => Promise.resolve(body) });
}

const sandbox = {
  console: { log: function () {}, info: function () {}, warn: function () {}, error: function () {} },
  document, window: { scrollTo: function () {}, addEventListener: function () {}, location: { protocol: 'http:', host: 'x' } },
  location: { protocol: 'http:', host: 'x', href: 'http://x/' },
  localStorage: LS(), navigator: { userAgent: 'test' },
  fetch: fakeFetch, Alert: function () {}, alert: function () {}, confirm: function () { return true; },
  setTimeout: function (fn) { return 0; }, clearTimeout: function () {}, setInterval: function () { return 0; }, clearInterval: function () {},
  Image: function () {}, FileReader: function () {}, Blob: function () {}, URL: { createObjectURL: function () { return ''; } },
  JSON, Math, Date, RegExp, Object, Array, String, Number, Boolean, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, Promise, Error
};
sandbox.window.document = document;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

(async () => {
  try { vm.runInContext(code, sandbox, { timeout: 5000 }); }
  catch (e) {
    // 启动代码里 go('home') 等可能因 stub 不全抛错；只要函数定义已注入即可继续
    console.log('（启动脚本抛出，已忽略以测试函数定义）:', e.message.slice(0, 120));
  }

  console.log('=== 1) 函数与状态存在 ===');
  chk('REG_CLOSE 已定义', typeof sandbox.REG_CLOSE === 'boolean');
  chk('doRegister 可调用', typeof sandbox.doRegister === 'function');
  chk('saveRegPolicy 可调用', typeof sandbox.saveRegPolicy === 'function');
  chk('fetchRegPolicy 可调用', typeof sandbox.fetchRegPolicy === 'function');
  chk('VIEWS.home 可调用', typeof sandbox.VIEWS === 'object' && typeof sandbox.VIEWS.home === 'function');

  console.log('=== 2) REG_CLOSE=true 时 doRegister 前端拦截（不发起注册请求） ===');
  sandbox.REG_CLOSE = true; sandbox.CLOUD = { on: true };
  const before = fetchCalls.length;
  // 准备假输入
  els['regPhone'] = makeEl(); els['regPhone'].value = '13900000009';
  els['regName'] = makeEl(); els['regName'].value = 'X';
  els['regPass'] = makeEl(); els['regPass'].value = 'Aa1!aaaaaa';
  els['regPass2'] = makeEl(); els['regPass2'].value = 'Aa1!aaaaaa';
  els['regMsg'] = makeEl();
  sandbox.doRegister();
  chk('doRegister 未发起注册请求', fetchCalls.length === before, { before, after: fetchCalls.length });
  chk('doRegister 给出关闭提示', /关闭开放注册/.test(els['regMsg'].textContent), els['regMsg'].textContent);

  console.log('=== 3) VIEWS.home 登录墙隐藏自助注册入口 ===');
  sandbox.CUR = null; sandbox.LS_OK = true; sandbox.BOOKS = [{ id: 'qd6a', name: 'mock' }]; sandbox.BOOK_DEF = null;
  sandbox.REG_CLOSE = true;
  sandbox.VIEWS.home();
  const homeHtml = sandbox.app ? sandbox.app.innerHTML : (els['app'] ? els['app'].innerHTML : '');
  // app 可能是全局变量，检查其 innerHTML
  const appHtml = (typeof sandbox.app === 'object' && sandbox.app) ? sandbox.app.innerHTML : homeHtml;
  chk('登录墙隐藏「注册新用户」按钮', !/注册新用户/.test(appHtml), appHtml.slice(0, 120));
  chk('登录墙显示关闭提示', /关闭开放注册|账号由管理员/.test(appHtml));

  console.log('=== 4) VIEWS.home 开放状态显示注册入口 ===');
  sandbox.REG_CLOSE = false;
  sandbox.VIEWS.home();
  const appHtml2 = (typeof sandbox.app === 'object' && sandbox.app) ? sandbox.app.innerHTML : '';
  chk('开放时显示「注册新用户」按钮', /注册新用户/.test(appHtml2), appHtml2.slice(0, 120));

  console.log('=== 5) VIEWS.auth 关闭注册时强制回登录态 ===');
  sandbox.REG_CLOSE = true; sandbox.CLOUD = { on: true }; sandbox.AUTH_MODE = 'reg';
  sandbox.VIEWS.auth();
  chk('AUTH_MODE 被强制为 login', sandbox.AUTH_MODE === 'login', sandbox.AUTH_MODE);

  console.log('=== 6) fetchRegPolicy 读取云端开关 ===');
  sandbox.REG_CLOSE = false; sandbox.CLOUD = { on: true };
  fetchCalls.length = 0;
  sandbox.fetchRegPolicy().then(function () {
    chk('请求了 /api/settings', fetchCalls.some(c => /\/api\/settings$/.test(c.url)), fetchCalls.map(c => c.url));
    chk('REG_CLOSE 更新为 true', sandbox.REG_CLOSE === true, sandbox.REG_CLOSE);

    console.log('=== 7) saveRegPolicy 写云端且本地状态同步 ===');
    els['regCloseChk'] = makeEl(); els['regCloseChk'].checked = true;
    els['regPolicyMsg'] = makeEl();
    sandbox.CLOUD = { on: true }; sandbox.REG_CLOSE = false;
    fetchCalls.length = 0;
    sandbox.saveRegPolicy();
    return new Promise(r => setTimeout(r, 0));
  }).then(function () {
    chk('保存请求指向 /api/admin/settings', fetchCalls.some(c => /\/api\/admin\/settings$/.test(c.url) && /POST/.test((c.opt.method || ''))), fetchCalls);
    chk('POST body 含 closeReg:true', fetchCalls.some(c => { try { return JSON.parse(c.opt.body).closeReg === true; } catch (e) { return false; } }), fetchCalls.map(c => c.opt.body));
    chk('保存后 REG_CLOSE 同步为 true', sandbox.REG_CLOSE === true, sandbox.REG_CLOSE);
    chk('保存成功提示', /已禁止开放注册/.test(els['regPolicyMsg'].textContent), els['regPolicyMsg'].textContent);

    console.log('=== 8) saveRegPolicy 离线模式拒绝 ===');
    sandbox.CLOUD = { on: false };
    els['regPolicyMsg'] = makeEl();
    const b = fetchCalls.length;
    sandbox.saveRegPolicy();
    chk('离线不发起请求', fetchCalls.length === b);
    chk('离线提示', /离线模式无法保存/.test(els['regPolicyMsg'].textContent), els['regPolicyMsg'].textContent);

    console.log('\n=== 结果：PASS ' + passed + ' / FAIL ' + failed + ' ===');
    process.exit(failed ? 1 : 0);
  }).catch(e => { console.error('测试异常:', e); process.exit(2); });
})();
