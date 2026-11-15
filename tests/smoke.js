/* 部署前冒烟测试：真实执行 index.html 内的脚本（DOM stub），验证童趣皮肤 + v2.2/v2.3 功能 + 权限门 */
/* 用法：node tests/smoke.js （在仓库任意目录运行均可） */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];

let pass = 0, fail = 0;
function chk(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra ? ' -> ' + extra : '')); }
}

/* ---------- DOM / BOM stub ---------- */
const els = {};
function mkEl(id) {
  return {
    id, innerHTML: '', value: '', checked: false, textContent: '', files: [], type: 'text',
    style: {}, dataset: {}, children: [],
    classList: { _s: new Set(), add(x){this._s.add(x)}, remove(x){this._s.delete(x)}, toggle(x){this._s.has(x)?this._s.delete(x):this._s.add(x)}, contains(x){return this._s.has(x)} },
    addEventListener(){}, removeEventListener(){}, focus(){}, blur(){}, click(){},
    appendChild(c){this.children.push(c)}, setAttribute(){}, getAttribute(){return null},
    querySelector(){return null}, querySelectorAll(){return []},
    getContext(){return {drawImage(){}, fillRect(){}, getImageData(){return {data:[]}}}},
    toDataURL(){return 'data:image/jpeg;base64,AAAA'}, scrollIntoView(){}, remove(){}
  };
}
const store = new Map();
const localStorage = {
  getItem(k){ return store.has(k) ? store.get(k) : null; },
  setItem(k,v){ store.set(k, String(v)); },
  removeItem(k){ store.delete(k); },
  clear(){ store.clear(); },
  key(i){ return Array.from(store.keys())[i] ?? null; },
  get length(){ return store.size; }
};
const document = {
  getElementById(id){ return els[id] || (els[id] = mkEl(id)); },
  querySelector(){ return null }, querySelectorAll(){ return [] },
  createElement(t){ return mkEl('_' + t) },
  body: mkEl('body'), head: mkEl('head'), addEventListener(){}
};
const sandbox = {
  console, localStorage, document,
  setTimeout: () => 0, clearTimeout(){}, setInterval: () => 1, clearInterval: () => {},
  Date, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Error, Promise,
  parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
  Uint8Array, Uint32Array, ArrayBuffer, Blob: function(){},
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) }),
  alert(){}, confirm(){ return true }, prompt(){ return '' },
  scrollTo(){}, location: { href: '', reload(){} },
  navigator: { clipboard: { writeText(){} }, userAgent: 'node-smoke' },
  FileReader: function(){ this.readAsDataURL = function(){ this.result = 'data:image/jpeg;base64,AAAA'; if(this.onload) this.onload({target:this}); }; },
  Image: function(){ this.onload = null; },
  btoa: s => Buffer.from(s, 'binary').toString('base64'),
  atob: s => Buffer.from(s, 'base64').toString('binary')
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* ---------- 1. 顶层启动 ---------- */
let bootErr = null;
try { vm.runInContext(code, sandbox, { filename: 'index.html<script>' }); }
catch (e) { bootErr = e; }
chk('脚本顶层真实执行无异常', !bootErr, bootErr && bootErr.stack);
if (bootErr) { console.log('\n结果: ' + pass + ' 通过 / ' + fail + ' 失败'); process.exit(1); }

const E = id => document.getElementById(id);
const app = E('app');
chk('首页渲染非空', app.innerHTML.length > 500, 'len=' + app.innerHTML.length);
chk('童趣插画在首页真实渲染', app.innerHTML.includes('小狗阿黄和小猫咪咪') && app.innerHTML.includes('<svg'));
chk('未登录显示登录/注册入口', app.innerHTML.includes('注册新用户') && app.innerHTML.includes('🔑 登录'));

/* ---------- 2. 皮肤与版本静态检查 ---------- */
chk('皮肤 CSS 覆盖层存在且位于 </style> 前',
  html.includes('童趣设计系统 · 全局覆盖层') && html.indexOf('童趣设计系统') < html.indexOf('</style>'));
chk('皮肤关键动画/配色生效声明', html.includes('@keyframes floaty') && html.includes('--bg:#DFF3FF'));
chk('版本标记 v2.4.7-childlike-cloud', html.includes('content="v2.4.7-childlike-cloud"'));
chk('存量本地账号升级上云逻辑存在', html.includes('升级为云端账号') && html.includes('检测到本机存量账号'));
chk('v2.4 云端同步层存在', ['CLOUD','cloudProbe','cloudLogin','cloudRegister','cloudSaveState','mergeState','cloudMaybeMigrate','adminAddUser','adminResetPass','adminDoDel','aiMigrateToProxy']
  .every(k => html.includes(k)));
chk('全景图学习顺序已换两行', (html.match(/font-size="11\.5"/g) || []).length === 2);
chk('v2.2/v2.3 功能代码完整', ['gradePhoto','gradeAnswer','PERM_LIST','doBan','doUnban','savePerms','grantAllPerms','lsProbe','AI_MODELS']
  .every(k => html.includes(k)));

/* ---------- 3. 生成器全量压测 ---------- */
const genIds = Object.keys(sandbox.GENS || {});
chk('出题生成器数量 >= 113', genIds.length >= 113, 'n=' + genIds.length);
const genErr = [];
genIds.forEach(id => {
  for (let i = 0; i < 30; i++) {
    try {
      const q = sandbox.GENS[id]();
      if (!q || typeof q.q !== 'string' || (!q.a && q.ans === undefined)) genErr.push(id + ':结构');
    } catch (e) { genErr.push(id + ':' + e.message); break; }
  }
});
chk(genIds.length + ' 个生成器 × 30 次无异常', genErr.length === 0, genErr.slice(0, 5).join(' | '));

/* ---------- 4. 用户系统 / 权限（v2.3） ---------- */
const db = () => sandbox.USERS;
const users = () => sandbox.USERS.users;
const commit = () => sandbox.saveUsers(sandbox.USERS);
chk('预置管理员已建立', users().some(u => u.phone === '13455656547' && u.role === 'admin'));
chk('v2.4.7 权限模块清单 12 项', sandbox.PERM_LIST && sandbox.PERM_LIST.length === 12, 'n=' + (sandbox.PERM_LIST || []).length);

/* 真实走注册函数（含手机号/密码规则校验），密码恰好 10 位 */
E('regName').value = '测试小孩';
E('regPhone').value = '13900001111';
E('regPass').value = 'Aa1#bcdefg';
E('regPass2').value = 'Aa1#bcdefg';
let regErr = null;
try { sandbox.doRegister(); } catch (e) { regErr = e; }
const normal = users().find(u => u.phone === '13900001111');
chk('真实注册普通用户成功', !!normal, regErr && (regErr.message + ' / ' + E('regMsg').textContent));
chk('密码加盐哈希、无明文落盘', !!normal && !JSON.stringify(normal).includes('Aa1#bcdefg') && !!normal.salt && !!normal.hash);
chk('密码规则函数可用（10位四要素）', sandbox.passIssue('Aa1#bcdefg') === null && sandbox.passIssue('abc') !== null);
chk('手机号规则函数可用', sandbox.validPhone('13900001111') && !sandbox.validPhone('23900001111') && !sandbox.validPhone('1390000111'));

/* 权限边界 */
sandbox.CUR = { phone: '13900001111', role: 'user', name: '测试小孩' };
chk('未设置 perms 时默认全功能', sandbox.hasPerm('ai') === true && sandbox.hasPerm('daily') === true);
const u = users().find(x => x.phone === '13900001111');
u.perms = { ai: false, report: false, daily: false };
commit();
chk('限权用户 AI / daily 被禁', sandbox.hasPerm('ai') === false && sandbox.hasPerm('daily') === false);
chk('限权用户未禁模块仍可用', sandbox.hasPerm('gen') === true);
sandbox.go('report');
chk('go(report) 越权拦截到无权访问页', app.innerHTML.includes('无权访问'), app.innerHTML.slice(0, 100));
sandbox.go('gen');
chk('go(gen) 允许访问', !app.innerHTML.includes('无权访问'));

/* 首页按钮与函数级权限门（本次审核修复点） */
sandbox.go('home');
chk('首页今日任务按钮按权限显示未授权', app.innerHTML.includes('今日任务（未授权）'), app.innerHTML.slice(0, 150));
chk('首页未授权模块卡片显示🔒', app.innerHTML.includes('🔒 未授权'));
sandbox.startDaily();
chk('绕过 UI 直接调 startDaily 仍被拦', app.innerHTML.includes('无权访问'), app.innerHTML.slice(0, 100));
sandbox.startDailyQuiz();
chk('绕过 UI 直接调 startDailyQuiz 仍被拦', app.innerHTML.includes('无权访问'));
sandbox.startGen();
chk('未限权模块 startGen 正常进入出题', !app.innerHTML.includes('无权访问'));
u.perms.daily = true; commit();
sandbox.go('home');
chk('放开 daily 后首页按钮恢复', app.innerHTML.includes('▶ 今天的任务'), app.innerHTML.slice(0, 150));
let dErr = null;
try { sandbox.startDaily(); } catch (e) { dErr = e; }
chk('放开 daily 后 startDaily 真执行成功', !dErr && app.innerHTML.includes('今天的任务'), dErr && dErr.message);

/* 封禁 / 管理员 */
u.banned = true; u.banReason = '冒烟测试'; commit();
sandbox.go('home');
chk('封禁用户被踢到封禁页', app.innerHTML.includes('账号已被封禁'), app.innerHTML.slice(0, 100));
u.banned = false; delete u.banReason; commit();
sandbox.CUR = { phone: '13455656547', role: 'admin', name: '管理员' };
chk('管理员豁免所有模块', sandbox.hasPerm('ai') === true && sandbox.hasPerm('report') === true && sandbox.hasPerm('daily') === true);
sandbox.go('admin');
chk('管理员后台可打开（含 AI 判分设置）', app.innerHTML.includes('AI 判分设置'), app.innerHTML.slice(0, 120));
sandbox.go('userAdmin', '13900001111');
chk('权限管理页可打开（12 个勾选框）', (app.innerHTML.match(/id="perm_/g) || []).length === 12, 'n=' + (app.innerHTML.match(/id="perm_/g) || []).length);

/* 边界：用户不存在 / CUR=null / perms 空对象 */
sandbox.CUR = null;
chk('未登录 hasPerm 全部 false', sandbox.hasPerm('ai') === false && sandbox.hasPerm('units') === false);
sandbox.CUR = { phone: '10000000000', role: 'user' };
chk('不存在的用户 hasPerm 不抛异常', sandbox.hasPerm('ai') === false);
u.perms = {}; commit();
sandbox.CUR = { phone: '13900001111', role: 'user' };
chk('空 perms 对象不崩溃且默认放行', sandbox.hasPerm('ai') === true);

/* ---------- 5. AI 判分 + 密钥安全（v2.2 / v2.3.2） ---------- */
const EP = '/ai/chat/completions';
const TEST_KEY = 'sk-smoke-test-0123456789abcdef';
chk('页面源码零明文 Key（无 freellmapi / 无 DEFAULT_AI.key）',
  !html.includes('freellmapi-') && !html.includes('DEFAULT_AI.key') && !/key\s*:\s*['"][A-Za-z0-9_-]{24,}['"]/.test(html));
chk('页面源码不含网关内网地址', !html.includes('192.168.31.88:3201'));
chk('推荐默认配置不含 key 字段且走同源代理', sandbox.DEFAULT_AI && !('key' in sandbox.DEFAULT_AI) && sandbox.DEFAULT_AI.endpoint === EP);
chk('默认代理配置即可判分就绪（无需填 Key）', sandbox.isAIReady({ endpoint: EP, model: 'qwen2.5-vl-72b', key: '' }) === true);
chk('备用模型列表 10 个（含视觉模型）', sandbox.AI_MODELS.length === 10 && sandbox.AI_MODELS.filter(m => m.d.includes('👁')).length >= 5);

sandbox.lsRm('qd6_ai');
chk('未配置时 getAIcfg 返回内置代理默认（开箱即用）', sandbox.getAIcfg().endpoint === EP && sandbox.getAIcfg().key === '');
sandbox.lsSet('qd6_ai', '{坏JSON');
chk('AI 配置损坏时不抛异常、回退代理默认', sandbox.getAIcfg().endpoint === EP);
sandbox.lsRm('qd6_ai');
chk('AI 配置清空后回退代理默认', sandbox.getAIcfg().endpoint === EP);
/* v2.4.3 地址归一化自愈 */
sandbox.lsSet('qd6_ai', JSON.stringify({ endpoint: 'http://192.168.31.88:3201/ai/chat/completions', model: 'm', key: 'k' }));
const healed = sandbox.getAIcfg();
chk('误拼网关地址被自愈为同源代理并落盘', healed.endpoint === EP && (JSON.parse(sandbox.lsGet('qd6_ai'))).endpoint === EP);
sandbox.lsSet('qd6_ai', JSON.stringify({ endpoint: '/ai/chat/completions', model: 'm', key: '' }));
chk('相对地址保持不变', sandbox.getAIcfg().endpoint === EP);
sandbox.lsRm('qd6_ai');   /* 复位：面板区从「未保存配置」状态开始 */

/* isAIReady / aiHeaders 边界 */
chk('isAIReady 空值边界全 false', [null, undefined, {}, { endpoint: EP }, { model: 'm' }]
  .every(c => sandbox.isAIReady(c) === false));
chk('直连模式（带 Key）判定就绪', sandbox.isAIReady({ endpoint: EP, model: 'm', key: TEST_KEY }) === true);
chk('服务端代理模式（Key 留空）判定就绪', sandbox.isAIReady({ endpoint: EP, model: 'm', key: '' }) === true);
chk('aiHeaders 代理模式不带 Authorization', !('Authorization' in sandbox.aiHeaders({ endpoint: EP, model: 'm', key: '' })));
chk('aiHeaders 直连模式带 Bearer', sandbox.aiHeaders({ key: TEST_KEY }).Authorization === 'Bearer ' + TEST_KEY);
chk('aiHeaders 空配置不抛异常', Object.keys(sandbox.aiHeaders(null)).length === 1);

/* 管理员面板：代理模式提示 + Key 绝不回显明文 */
sandbox.CUR = { phone: '13455656547', role: 'admin', name: '管理员' };
sandbox.go('admin');
chk('打开面板含 AI 判分设置区', app.innerHTML.includes('AI 判分设置') && app.innerHTML.includes('/ai/chat/completions'));
chk('面板不含任何 Key 明文', !app.innerHTML.includes(TEST_KEY) && E('aiKey').value === '');
chk('预填推荐接口与模型', E('aiEndpoint').value === EP && E('aiModel').value === 'qwen2.5-vl-72b');

/* 真实走保存函数 */
E('aiEndpoint').value = EP;
E('aiModel').value = 'qwen2.5-vl-72b';
E('aiKey').value = TEST_KEY;
sandbox.saveAIcfg();
chk('保存后 Key 只进 localStorage', (JSON.parse(sandbox.lsGet('qd6_ai')) || {}).key === TEST_KEY);
chk('保存后输入框明文被清空（不回显）', E('aiKey').value === '');
chk('保存后 placeholder 只露尾号', E('aiKey').placeholder.includes('ef') && !E('aiKey').placeholder.includes(TEST_KEY));
chk('保存提示说明密钥不下发', E('aiMsg').textContent.includes('页面源码不含密钥'));
sandbox.go('admin');
chk('二次打开面板不含完整 Key', app.innerHTML.includes('已配置') && !app.innerHTML.includes(TEST_KEY) && E('aiKey').value === '');
chk('二次打开面板只显示尾号', app.innerHTML.includes('cdef'));

/* 留空输入框保存 = 沿用旧 Key（掩码不影响配置） */
E('aiEndpoint').value = EP;
E('aiModel').value = 'qwen-3-vl-30b-a3b-instruct';
E('aiKey').value = '';
sandbox.saveAIcfg();
chk('留空保存沿用旧 Key 且模型可更新', (JSON.parse(sandbox.lsGet('qd6_ai')) || {}).key === TEST_KEY
  && (JSON.parse(sandbox.lsGet('qd6_ai')) || {}).model === 'qwen-3-vl-30b-a3b-instruct');

/* 清除 Key → 服务端代理模式 */
sandbox.clearAIKey();
chk('clearAIKey 清空 Key 但保留接口/模型', sandbox.isAIReady(sandbox.getAIcfg()) === true && sandbox.getAIcfg().key === '');
chk('代理模式请求头无 Authorization', !('Authorization' in sandbox.aiHeaders(sandbox.getAIcfg())));
sandbox.go('admin');
chk('代理模式面板标注正确', app.innerHTML.includes('服务端代理模式'));

/* 清空全部配置 → getAIcfg 回退代理默认（v2.4.3 起永有默认配置） */
sandbox.resetAIcfg();
chk('resetAIcfg 清空存储', sandbox.lsGet('qd6_ai') === null);
chk('清空后判分仍可用（代理默认）', sandbox.getAIcfg().endpoint === EP);

/* 判分走默认代理配置（gradeAnswer/gradePhoto 回调是异步 promise 链，先收集、延后断言） */
sandbox.CUR = { phone: '13455656547', role: 'admin', name: '管理员' };  /* admin 全权限，越过 hasPerm */
const gradeResults = { answer: null, photo: null };
sandbox.gradeAnswer({ q: '应用题', ans: '42', app: true }, '先算每份，再相乘，思路是对的', r => { gradeResults.answer = r; });
sandbox.gradePhoto({ q: '应用题', ans: '42' }, '', 'data:image/jpeg;base64,AAA', r => { gradeResults.photo = r; });
sandbox.testAI();
chk('testAI 默认代理配置直接可测', E('aiMsg').textContent.length > 0);
chk('导出用户备份不含 AI 配置', sandbox.exportUsers.toString().indexOf('qd6_ai') === -1
  && sandbox.exportUsers.toString().indexOf('AIKEY') === -1);

chk('拍照识别 / 过程作答入口存在', typeof sandbox.gradePhoto === 'function' && typeof sandbox.handlePhoto === 'function'
  && typeof sandbox.procLocalGrade === 'function' && typeof sandbox.extractFinal === 'function');
const ex = sandbox.extractFinal('3×5=15，所以一共 15 个，答：15 个');
chk('最终答案提取可用', String(ex).includes('15'), String(ex));

/* ---------- 6. 全视图空状态回归 ---------- */
sandbox.CUR = { phone: '13455656547', role: 'admin', name: '管理员' };
['home','units','gen','wrong','place','map','board','cheat','four','report','about','admin','auth'].forEach(v => {
  try { sandbox.go(v); chk('视图 ' + v + ' 空状态渲染', app.innerHTML.length > 100, 'len=' + app.innerHTML.length); }
  catch (e) { chk('视图 ' + v + ' 空状态渲染', false, e.message); }
});
sandbox.go('map');
chk('全景图含童趣换行文字', app.innerHTML.includes('font-size="11.5"'));
chk('连续模式 / 存储降级包装存在', typeof sandbox.quizDone === 'function' && typeof sandbox.lsProbe === 'function' && typeof sandbox.lsWarn === 'function');
store.clear();
let degErr = null;
try { sandbox.LS_OK = false; sandbox.go('home'); } catch (e) { degErr = e; }
chk('localStorage 清空后降级不崩溃', !degErr, degErr && degErr.message);

/* v2.4.3：异步判分断言（gradeAnswer/gradePhoto 回调走 promise 链，等 microtask 完成后统一收尾） */
setTimeout(() => {
  chk('gradeAnswer 未保存配置也尝试 AI 判分（默认代理）',
    !!gradeResults.answer && String(gradeResults.answer.feedback || '').indexOf('未配置') === -1,
    JSON.stringify(gradeResults.answer));
  chk('gradePhoto 未保存配置也走 AI（默认代理）',
    !!gradeResults.photo && String(gradeResults.photo.feedback || '').indexOf('未配置') === -1,
    JSON.stringify(gradeResults.photo));
  console.log('\n结果: ' + pass + ' 通过 / ' + fail + ' 失败');
  process.exit(fail ? 1 : 0);
}, 150);
