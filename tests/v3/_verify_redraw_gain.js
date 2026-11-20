/* 验证 redraw 对小池课本（qd4a/qd5a/qd3b 等唯一生成器 < 8）的实际去重改善效果
   对比：旧写法 dedupPick(...).map(makeQ) vs 新写法 redraw(dedupPick(...)) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const HTML = fs.readFileSync(path.resolve(__dirname, '..', '..', 'index.html'), 'utf8');
const blocks = (HTML.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g) || [])
  .map(s => s.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''));
const registryCode = blocks.filter(b => /function regBook/.test(b)).join('\n');
let code = ''; blocks.forEach(b => { if (b.length > code.length && !/function regBook/.test(b)) code = b });

function makeEl() { return { value: '', textContent: '', style: {}, checked: false, innerHTML: '', addEventListener() {}, appendChild() {}, focus() {}, classList: { add() {}, remove() {} } } }
const els = {};
const sandbox = {
  console: { log() {}, info() {}, warn() {}, error() {} },
  document: { getElementById: id => (els[id] = els[id] || makeEl()), querySelector: () => makeEl(), querySelectorAll: () => [], createElement: () => makeEl(), addEventListener() {}, body: makeEl(), documentElement: makeEl(), title: '' },
  window: { scrollTo() {}, addEventListener() {}, location: { protocol: 'http:', host: 'x' } },
  location: { protocol: 'http:', host: 'x', href: 'http://x/' },
  localStorage: (() => { const d = {}; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v) }, removeItem: k => { delete d[k] }, clear() {} } })(),
  navigator: { userAgent: 't' }, fetch: () => Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: 1 }) }),
  alert() {}, confirm: () => true, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  Image: function () {}, FileReader: function () {}, Blob: function () {}, URL: { createObjectURL: () => '' },
  JSON, Math, Date, RegExp, Object, Array, String, Number, Boolean, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent, Promise, Error
};
sandbox.window.document = sandbox.document; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(registryCode, sandbox, { filename: 'registry' });
try { vm.runInContext(code, sandbox, { timeout: 8000 }) } catch (e) { }
const bdir = path.resolve(__dirname, '..', '..', 'books');
['common-gen.js', 'common-gen2.js'].concat(fs.readdirSync(bdir).filter(f => /^book-/.test(f)))
  .forEach(f => { try { vm.runInContext(fs.readFileSync(path.join(bdir, f), 'utf8'), sandbox, { filename: f }) } catch (e) { } });

sandbox.permGate = () => true;
sandbox.go = () => { };
let cap = null;
sandbox.startQuiz = (qs) => { cap = qs };

console.log('课本      唯一生成器  单组不同题面(旧写法)  单组不同题面(新写法redraw)  改善');
console.log('--------------------------------------------------------------------------------');
sandbox.BOOKS.forEach(b => {
  sandbox.BOOK_DEF = b; sandbox.UNITS = b.UNITS; sandbox.GENS = b.GENS; sandbox.GENLVL = b.GENLVL;
  sandbox.FOUR_PICK = { u: 0, lv: 0 }; sandbox.APPGEN_CACHE = { bookId: null, list: [] };
  sandbox.S = { recent: [] };
  const list = sandbox.appGenList();
  if (!list.length) { console.log(b.id.padEnd(10) + '  无应用题（空态，不适用）'); return }
  const uniq = Object.keys(list.reduce((a, x) => (a[x.g] = 1, a), {})).length;

  /* 旧写法：dedupPick(...).map(makeQ) */
  let oldU = 0;
  for (let r = 0; r < 60; r++) {
    const specs = sandbox.dedupPick(() => sandbox.fourMixPool(0, 8), 8);
    const qs = specs.map(s => sandbox.makeQ(s));
    oldU += Object.keys(qs.reduce((a, q) => (a[q.q] = 1, a), {})).length;
  }
  /* 新写法：redraw 包一层（走真实 startFourDrill 路径） */
  let newU = 0;
  for (let r = 0; r < 60; r++) {
    sandbox.APPGEN_CACHE = { bookId: b.id, list: list };
    cap = null; sandbox.startFourDrill();
    if (cap) newU += Object.keys(cap.reduce((a, q) => (a[q.q] = 1, a), {})).length;
  }
  const o = (oldU / 60).toFixed(2), n = (newU / 60).toFixed(2);
  const delta = (newU - oldU) / 60;
  console.log(b.id.padEnd(10) + String(uniq).padStart(6) + String(o).padStart(18) + String(n).padStart(24) +
    (delta > 0.005 ? ('  +' + delta.toFixed(2) + ' ✓').padStart(10) : (Math.abs(delta) <= 0.005 ? '  持平'.padStart(8) : ('  ' + delta.toFixed(2)).padStart(9))));
});
