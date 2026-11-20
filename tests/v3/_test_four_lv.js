/* v3.11 四步法「按单元+难度出题」跨 12 册课本 DOM stub 真执行测试
   审核要点（硬规则）：真执行新函数 + 所有边界分支（空应用题册 / 单元难度空缺 / 缓存失效 / 切课本校正） */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const HTML = fs.readFileSync(path.resolve(__dirname, '..', '..', 'index.html'), 'utf8');
/* 按页面出现顺序收集内联 script 块：注册表块（BOOKS/regBook/bookById/isRevId）必须先于主脚本执行 */
const blocks = (HTML.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g) || [])
  .map(s => s.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''));
const registryCode = blocks.filter(b => /function regBook/.test(b)).join('\n');
let code = '';
blocks.forEach(b => { if (b.length > code.length && !/function regBook/.test(b)) code = b; });

let passed = 0, failed = 0;
function chk(name, cond, extra) {
  if (cond) { passed++; console.log('  PASS ' + name); }
  else { failed++; console.log('  FAIL ' + name + (extra !== undefined ? ' → ' + String(extra).slice(0, 260) : '')); }
}

function makeEl() {
  return { value: '', textContent: '', style: {}, checked: false, disabled: false, innerHTML: '', placeholder: '', type: '',
    addEventListener() {}, appendChild() {}, focus() {}, classList: { add() {}, remove() {} }, getContext: () => ({}) };
}
const els = {};
const document = {
  getElementById: id => (els[id] = els[id] || makeEl()),
  querySelector: () => makeEl(), querySelectorAll: () => [],
  createElement: () => makeEl(), addEventListener() {},
  body: makeEl(), documentElement: makeEl(), title: ''
};
function LS() { const d = {}; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v) }, removeItem: k => { delete d[k] }, clear() {} } }

let permGateCalls = [], startQuizCalls = [];
const sandbox = {
  console: { log() {}, info() {}, warn() {}, error() {} },
  document, window: { scrollTo() {}, addEventListener() {}, location: { protocol: 'http:', host: 'x' } },
  location: { protocol: 'http:', host: 'x', href: 'http://x/' },
  localStorage: LS(), navigator: { userAgent: 'test' },
  fetch: () => Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: 1 }) }),
  alert() {}, confirm: () => true,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  Image: function () {}, FileReader: function () {}, Blob: function () {}, URL: { createObjectURL: () => '' },
  JSON, Math, Date, RegExp, Object, Array, String, Number, Boolean, parseInt, parseFloat, isNaN,
  encodeURIComponent, decodeURIComponent, Promise, Error
};
sandbox.window.document = document;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

try { vm.runInContext(registryCode, sandbox, { filename: 'registry' }) } catch (e) { console.log('注册表注入失败:', e.message) }
try { vm.runInContext(code, sandbox, { timeout: 8000 }) } catch (e) { console.log('（启动脚本抛出，忽略）:', e.message.slice(0, 100)) }

/* 加载全部课本文件（含已修复的 common-gen / common-gen2） */
const bdir = path.resolve(__dirname, '..', '..', 'books');
const files = ['common-gen.js', 'common-gen2.js'].concat(fs.readdirSync(bdir).filter(f => /^book-/.test(f)));
files.forEach(f => { try { vm.runInContext(fs.readFileSync(path.join(bdir, f), 'utf8'), sandbox, { filename: f }) } catch (e) { console.log('课本加载失败', f, e.message) } });

const BOOKS = sandbox.BOOKS || [];
console.log('\n═══ 环境检查 ═══');
chk('主脚本已注入 startFourDrill', typeof sandbox.startFourDrill === 'function');
chk('主脚本已注入 VIEWS.four', typeof sandbox.VIEWS.four === 'function');
chk('appGenList 缓存函数存在', typeof sandbox.appGenList === 'function');
chk('降级链 fourPool 存在', typeof sandbox.fourPool === 'function');
chk('难度混合 fourMixPool 存在', typeof sandbox.fourMixPool === 'function');
chk('课本注册成功 12 册', BOOKS.length === 12, '实得 ' + BOOKS.length + ': ' + BOOKS.map(b => b.id).join(','));
chk('permGate 存在', typeof sandbox.permGate === 'function');

/* 用可控桩替换副作用函数，记录调用 */
sandbox.permGate = function (p) { permGateCalls.push(p); return true };
sandbox.startQuiz = function (qs, mode, title, refill) { startQuizCalls.push({ qs, mode, title, refill }); };
sandbox.VIEWS.noPerm = function () {};
sandbox.go = function () {};

console.log('\n═══ 跨 12 册课本：四步法出题真执行 ═══');
const summary = [];
BOOKS.forEach(b => {
  /* 切到该课本（复刻 chooseBook → setCurrentBook 的指针切换） */
  sandbox.BOOK_DEF = b;
  sandbox.UNITS = b.UNITS; sandbox.GENS = b.GENS; sandbox.GENLVL = b.GENLVL;
  sandbox.BOARDS = b.BOARDS || []; sandbox.CHEAT = b.CHEAT || [];
  sandbox.APPGEN_CACHE = { bookId: null, list: [] };   /* 强制缓存失效，验证按课本重建 */
  sandbox.FOUR_PICK = { u: 0, lv: 0 };
  sandbox.S = sandbox.S || {}; sandbox.S.recent = sandbox.S.recent || [];

  let list = [];
  try { list = sandbox.appGenList() } catch (e) { chk(b.id + ' appGenList 不抛错', false, e.message); return }

  const n = list.length;
  summary.push({ id: b.id, name: b.name, n });

  if (n === 0) {
    /* 空态分支：qd1b 一年级下册无应用题 */
    let html = '';
    try { sandbox.VIEWS.four(); html = els['app'].innerHTML } catch (e) { chk(b.id + ' VIEWS.four 空态不抛错', false, e.message); return }
    chk(b.id + '（' + b.name + '）空态渲染', /暂时还没有收录应用题/.test(html), html.slice(0, 120));
    chk(b.id + ' 空态提供换课本入口', /go\('booksel'\)/.test(html));
    startQuizCalls = [];
    try { sandbox.startFourDrill() } catch (e) { }
    chk(b.id + ' 空态点击不崩溃且不出题', startQuizCalls.length === 0);
    return;
  }

  /* 正常分支：渲染 + 各难度组合出题 */
  let html = '';
  try { sandbox.VIEWS.four(); html = els['app'].innerHTML } catch (e) { chk(b.id + ' VIEWS.four 渲染不抛错', false, e.message); return }
  chk(b.id + '（' + b.name + '）渲染含选择器', /fourUnitPick/.test(html) && /fourLvPick/.test(html));
  chk(b.id + ' 渲染含 8 题按钮', /startFourDrill\(\)/.test(html));
  const grade = b.grade || 0;
  if (grade >= 6) chk(b.id + ' 高年级用单位1口诀', /单位 1/.test(html));
  else chk(b.id + ' 低年级用通用四步口诀', /读一读/.test(html) && /查一查/.test(html));

  /* 全册混合 + 合理搭配 */
  const combos = [[0, 0]];
  [1, 2, 3].forEach(lv => { if (list.some(x => x.lvl === lv)) combos.push([0, lv]) });
  /* 逐个单元 × 难度（含空缺组合，验证降级） */
  const unitIds = [];
  list.forEach(x => { if (unitIds.indexOf(x.u) < 0) unitIds.push(x.u) });
  unitIds.slice(0, 3).forEach(u => { [1, 2, 3, 0].forEach(lv => combos.push([u, lv])) });

  let badTitle = null, badCount = null, badSrc = null;
  combos.forEach(([u, lv]) => {
    sandbox.FOUR_PICK = { u, lv };
    startQuizCalls = [];
    try { sandbox.startFourDrill() } catch (e) { badSrc = 'u=' + u + ',lv=' + lv + ' 抛错: ' + e.message; return }
    const c = startQuizCalls[0];
    if (!c) { badSrc = 'u=' + u + ',lv=' + lv + ' 未调用 startQuiz'; return }
    if (c.qs.length !== 8) { badCount = 'u=' + u + ',lv=' + lv + ' 出了 ' + c.qs.length + ' 题（应为 8）'; return }
    if (c.qs.some(q => !q || !q.q)) { badSrc = 'u=' + u + ',lv=' + lv + ' 含空题'; return }
    if (!/四步法/.test(c.title)) { badTitle = c.title; return }
    /* 选了具体单元时，题目应主要来自该单元（降级到全册属预期，但需确认非空） */
    if (u && lv) {
      const inUnit = c.qs.filter(q => String(q.unit) === String(u)).length;
      const poolHas = list.some(x => String(x.u) === String(u) && x.lvl === lv);
      if (poolHas && inUnit !== 8) { badSrc = 'u=' + u + ',lv=' + lv + ' 池内有题但出了跨单元题(' + inUnit + '/8)'; }
    }
    /* refill 补题也必须能出 8 题 */
    if (typeof c.refill === 'function') {
      try { const r = c.refill(); if (!r || r.length !== 8) badSrc = 'u=' + u + ',lv=' + lv + ' refill 返回 ' + (r ? r.length : 'null') } catch (e) { badSrc = 'refill 抛错 ' + e.message }
    }
  });
  chk(b.id + ' 全部 ' + combos.length + ' 种范围×难度组合出满 8 题', !badSrc && !badCount && !badTitle, badSrc || badCount || badTitle);

  /* 题面去重验证（修：旧代码 pick 纯随机会撞重复题面） */
  sandbox.FOUR_PICK = { u: 0, lv: 0 };
  startQuizCalls = [];
  let dupHit = 0;
  try {
    for (let r = 0; r < 12; r++) {
      sandbox.startFourDrill();
      const qs = startQuizCalls[r] && startQuizCalls[r].qs;
      if (!qs) continue;
      const faces = {}; qs.forEach(q => { faces[q.q] = (faces[q.q] || 0) + 1 });
      const poolFaces = list.length;
      /* 仅当池足够大时才要求组内不重复（小池允许重复补满，属 dedupPick 既定兜底） */
      if (poolFaces >= 8 && Object.keys(faces).length !== qs.length) dupHit++;
    }
  } catch (e) { dupHit = -1 }
  if (list.length >= 8) chk(b.id + ' 组内题面去重（池≥8 时应无重复）', dupHit === 0, '重复组数=' + dupHit);
  else chk(b.id + ' 小池（' + list.length + '）允许重复补满，不崩溃', dupHit >= 0);
});

console.log('\n═══ 课本切换与缓存失效 ═══');
/* 连续切课本，验证 APPGEN_CACHE 按 bookId 失效（不会把上一册的题带到下一册） */
let leak = null;
[['qd1a', 'qd6a'], ['qd6a', 'qd3b'], ['qd3b', 'qd6b'], ['qd6b', 'qd2a']].forEach(([from, to]) => {
  const bFrom = BOOKS.find(x => x.id === from), bTo = BOOKS.find(x => x.id === to);
  if (!bFrom || !bTo) { leak = '课本缺失 ' + from + '/' + to; return }
  function load(b) {
    sandbox.BOOK_DEF = b; sandbox.UNITS = b.UNITS; sandbox.GENS = b.GENS; sandbox.GENLVL = b.GENLVL;
    sandbox.FOUR_PICK = { u: 0, lv: 0 };
    return sandbox.appGenList();
  }
  const l1 = load(bFrom);
  const l2 = load(bTo);
  /* 切到 to 后，若缓存未失效会拿到 from 的生成器 id */
  const fromIds = l1.map(x => x.g), toIds = l2.map(x => x.g);
  const onlyFrom = l2.filter(x => fromIds.indexOf(x.g) >= 0 && toIds.indexOf(x.g) >= 0 && !bTo.UNITS.some(u => (u.kps || []).some(kp => (kp.gens || []).indexOf(x.g) >= 0)));
  if (onlyFrom.length) leak = from + '→' + to + ' 残留 ' + onlyFrom.map(x => x.g).join(',');
  /* 第二次调用应命中缓存（同 bookId） */
  const l2b = sandbox.appGenList();
  if (l2b !== l2 && !(l2b.length === l2.length)) leak = from + '→' + to + ' 缓存未命中';
});
chk('课本切换缓存正确失效，无跨册残留', !leak, leak);

/* 缓存命中：同一课本连续两次调用返回同一数组引用 */
const b6a = BOOKS.find(x => x.id === 'qd6a');
sandbox.BOOK_DEF = b6a; sandbox.UNITS = b6a.UNITS; sandbox.GENS = b6a.GENS; sandbox.GENLVL = b6a.GENLVL;
sandbox.APPGEN_CACHE = { bookId: null, list: [] };
const c1 = sandbox.appGenList(), c2 = sandbox.appGenList();
chk('同课本二次调用命中缓存（引用相同）', c1 === c2);

console.log('\n═══ 六上(qd6a) 单元×难度降级链专项 ═══');
sandbox.BOOK_DEF = b6a; sandbox.UNITS = b6a.UNITS; sandbox.GENS = b6a.GENS; sandbox.GENLVL = b6a.GENLVL;
sandbox.APPGEN_CACHE = { bookId: null, list: [] };
const list6a = sandbox.appGenList();
/* 单元7 方向与位置：L1/L3 实测空缺 → 应降级 */
const u7 = list6a.find(x => String(x.u) === '7');
if (u7) {
  const p71 = sandbox.fourPool('7', 1);
  chk('单元7 选 L1（空缺）→ 降级为该单元全部应用题', p71.length > 0 && p71.every(x => String(x.u) === '7'), '得到 ' + p71.length);
  const p73 = sandbox.fourPool('7', 3);
  chk('单元7 选 L3（空缺）→ 降级为该单元全部应用题', p73.length > 0 && p73.every(x => String(x.u) === '7'));
  const p72 = sandbox.fourPool('7', 2);
  chk('单元7 选 L2（有题）→ 精确匹配', p72.length > 0 && p72.every(x => String(x.u) === '7' && x.lvl === 2));
} else chk('六上单元7 存在应用题', false, '未找到单元7');

/* 全册各难度精确匹配 */
[1, 2, 3].forEach(lv => {
  const p = sandbox.fourPool(0, lv);
  chk('六上全册 L' + lv + ' 精确匹配', p.length > 0 && p.every(x => x.lvl === lv), '得到 ' + p.length);
});
/* 合理搭配比例：8 题里应混合多难度 */
sandbox.FOUR_PICK = { u: 0, lv: 0 };
startQuizCalls = [];
sandbox.startFourDrill();
const mixQs = startQuizCalls[0] ? startQuizCalls[0].qs : [];
const mixLvls = {};
mixQs.forEach(q => { const l = q.lvl || 0; mixLvls[l] = (mixLvls[l] || 0) + 1 });
chk('六上合理搭配 8 题跨多难度', Object.keys(mixLvls).length >= 2, JSON.stringify(mixLvls));
chk('六上合理搭配 q.lvl 已标注', mixQs.length === 8 && mixQs.every(q => q.lvl >= 1 && q.lvl <= 3));

/* rev_mix 随机 app 标记修复验证：多次探测应稳定收录总复习 */
let revHits = 0;
for (let i = 0; i < 15; i++) {
  sandbox.APPGEN_CACHE = { bookId: null, list: [] };
  const l = sandbox.appGenList();
  if (l.some(x => x.g === 'rev_mix')) revHits++;
}
chk('rev_mix（总复习）稳定收录（修随机 app 标记）', revHits === 15, revHits + '/15');

console.log('\n═══ 折扣题与统计图题修复回归（线上代码路径）═══');
const b6b = BOOKS.find(x => x.id === 'qd6b');
sandbox.BOOK_DEF = b6b; sandbox.UNITS = b6b.UNITS; sandbox.GENS = b6b.GENS; sandbox.GENLVL = b6b.GENLVL;
const CN = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
let dBad = 0, dTot = 0;
for (let i = 0; i < 300; i++) {
  let q = null;
  try { q = b6b.GENS.g_discount('1', 'qd6b-1-1') } catch (e) { }
  if (!q) continue;
  const m = String(q.q).match(/打([一二三四五六七八九])折/), om = String(q.q).match(/原价\s*([\d.]+)\s*元/);
  if (!m || !om) continue;
  dTot++;
  if (Math.abs(parseFloat(om[1]) * CN[m[1]] / 10 - parseFloat(q.ans)) > 1e-9) dBad++;
}
chk('六下折扣题：题面与答案一致（' + dTot + ' 样本）', dTot > 0 && dBad === 0, '矛盾 ' + dBad + '/' + dTot);

/* 统计图选项重复回归 */
let chartBad = 0, chartTot = 0, chartSample = '';
[['qd3b', 'g_chartBar'], ['qd4a', 'g_chartBar'], ['qd5a', 'g_chartLine'], ['qd6b', 'g_chartFan']].forEach(([bid, gen]) => {
  const bb = BOOKS.find(x => x.id === bid); if (!bb || !bb.GENS[gen]) return;
  let loc = null;
  bb.UNITS.forEach(u => (u.kps || []).forEach(kp => { if ((kp.gens || []).indexOf(gen) >= 0 && !loc) loc = { u: u.id, k: kp.id } }));
  if (!loc) return;
  for (let i = 0; i < 40; i++) {
    let q = null; try { q = bb.GENS[gen](loc.u, loc.k) } catch (e) { continue }
    if (!q || !q.ops) continue;
    chartTot++;
    const opts = q.ops.map(o => String(o).replace(/<[^>]+>/g, '').trim());
    const uniq = {}; opts.forEach(o => uniq[o] = 1);
    if (Object.keys(uniq).length !== opts.length) { chartBad++; if (!chartSample) chartSample = bid + '/' + gen + ' ops=' + opts.join('|') }
    if (opts.indexOf(String(q.ans).replace(/<[^>]+>/g, '').trim()) < 0) { chartBad++; if (!chartSample) chartSample = bid + ' 选项不含答案' }
  }
});
chk('统计图选择题：4 选项互异且含答案（' + chartTot + ' 样本）', chartTot > 0 && chartBad === 0, chartSample || ('bad=' + chartBad));

console.log('\n═══ 权限守卫 ═══');
permGateCalls = [];
sandbox.permGate = function (p) { permGateCalls.push(p); return false };
sandbox.BOOK_DEF = b6a; sandbox.UNITS = b6a.UNITS; sandbox.GENS = b6a.GENS; sandbox.GENLVL = b6a.GENLVL;
sandbox.APPGEN_CACHE = { bookId: null, list: [] };
sandbox.FOUR_PICK = { u: 0, lv: 0 };
startQuizCalls = [];
sandbox.startFourDrill();
chk('未授权 four 时被 permGate 拦截且不出题', permGateCalls.indexOf('four') >= 0 && startQuizCalls.length === 0);

console.log('\n═══════ 结果汇总 ═══════');
console.log('课本应用题数：' + summary.map(s => s.id + '=' + s.n).join(' '));
console.log('PASS ' + passed + ' / FAIL ' + failed);
process.exit(failed ? 1 : 0);
