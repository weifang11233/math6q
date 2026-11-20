/* 全 12 册生成器自洽性体检：找出「题面与答案矛盾」「答案缺失」类 BUG
   检查项：
   1. 选择题 ops 必须包含 ans（否则学生无法选对）
   2. ans 不得为空/undefined/null/NaN
   3. 题面不得残留未替换的模板占位符（undefined / NaN / ${）
   4. 填空题若题面给了单位，ans 应为纯数值（避免"28厘米"vs"28"判分歧义）
   5. 应用题必须带 exp 解析（四步法讲解依赖）
   6. ratio 题 ans 必须是 a:b 形式 */
var fs = require('fs'), path = require('path'), vm = require('vm');
var UTILS = [
  'function R(n){return Math.floor(Math.random()*n)}',
  'function pick(a){return a[R(a.length)]}',
  'function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=R(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}',
  'function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t}return a||1}',
  'function frac(n,d){var g=gcd(n,d);n=n/g;d=d/g;return d===1?String(n):(n+"/"+d)}',
  'function fracHTML(n,d){return frac(n,d)}',
  'function rich(s){return String(s)}',
  'function val(s){s=String(s).trim();if(!s)return null;var f=parseFloat(s);return isNaN(f)?null:f}'
].join('\n');
var BOOKS = [];
var sb = { regBook: function (d) { BOOKS.push(d) }, BOOKS: BOOKS, Math: Math, Date: Date, JSON: JSON, String: String, Number: Number, Array: Array, Object: Object, parseInt: parseInt, parseFloat: parseFloat, isNaN: isNaN, console: console };
sb.window = sb; sb.globalThis = sb; vm.createContext(sb); vm.runInContext(UTILS, sb, { filename: 'u' });
var dir = path.resolve(__dirname, '..', '..', 'books');
['common-gen.js', 'common-gen2.js'].concat(fs.readdirSync(dir).filter(function (f) { return /^book-/.test(f) })).forEach(function (f) {
  var p = path.join(dir, f); if (!fs.existsSync(p)) return;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: f }) } catch (e) { console.log('LOAD FAIL', f, e.message) }
});
var strip = function (s) { return String(s).replace(/<[^>]+>/g, '') };
var RUNS = 30;

var issues = [];   /* {book,gen,kp,type,detail,sample} */
function add(book, gen, kp, type, detail, sample) {
  var key = book + '|' + gen + '|' + type;
  var e = issues.find(function (x) { return x.key === key });
  if (e) { e.count++; if (e.samples.length < 2) e.samples.push(sample) }
  else issues.push({ key: key, book: book, gen: gen, kp: kp, type: type, detail: detail, count: 1, samples: [sample] });
}

var totalRun = 0;
BOOKS.forEach(function (b) {
  var G = b.GENS || {}, L = b.GENLVL || {}, U = b.UNITS || [];
  U.forEach(function (u) {
    (u.kps || []).forEach(function (kp) {
      (kp.gens || []).forEach(function (g) {
        if (!G[g]) { add(b.id, g, kp.name, '缺失生成器', 'kp.gens 引用的生成器不存在', ''); return }
        for (var i = 0; i < RUNS; i++) {
          var q = null;
          try { q = G[g](u.id, kp.id) } catch (e) { add(b.id, g, kp.name, '运行异常', e.message, ''); continue }
          if (!q) { add(b.id, g, kp.name, '返回空', '返回 ' + q, ''); continue }
          totalRun++;
          var qs = strip(q.q || ''), ans = q.ans;

          /* 2. ans 缺失 */
          if (ans === undefined || ans === null || String(ans).trim() === '') {
            add(b.id, g, kp.name, '答案缺失', 'ans=' + ans, qs.slice(0, 50)); continue;
          }
          var ansS = strip(String(ans));

          /* 3. 模板残留 */
          ['undefined', 'NaN', '${', '[object'].forEach(function (bad) {
            if (qs.indexOf(bad) >= 0) add(b.id, g, kp.name, '题面残留' + bad, '题面含 ' + bad, qs.slice(0, 70));
            if (ansS.indexOf(bad) >= 0) add(b.id, g, kp.name, '答案残留' + bad, 'ans=' + ansS, qs.slice(0, 50));
          });

          /* 1. 选择题 ops 必须含 ans */
          if (q.ops && Array.isArray(q.ops)) {
            var opts = q.ops.map(function (o) { return strip(String(o)).trim() });
            if (!opts.some(function (o) { return o === ansS.trim() })) {
              add(b.id, g, kp.name, '选项不含答案', 'ops=' + JSON.stringify(opts) + ' ans=' + ansS, qs.slice(0, 50));
            }
            if (opts.length < 2) add(b.id, g, kp.name, '选项过少', 'ops.length=' + opts.length, qs.slice(0, 50));
            var uniq = {}; opts.forEach(function (o) { uniq[o] = (uniq[o] || 0) + 1 });
            var dup = Object.keys(uniq).filter(function (k) { return uniq[k] > 1 });
            if (dup.length) add(b.id, g, kp.name, '选项重复', '重复项=' + dup.join('/'), qs.slice(0, 50));
          }

          /* 6. ratio 题格式 */
          if (q.ratio && !/^[\d.]+\s*[:：]\s*[\d.]+$/.test(ansS.trim())) {
            add(b.id, g, kp.name, '比值答案格式异常', 'ratio题 ans=' + ansS, qs.slice(0, 50));
          }

          /* 5. 应用题缺解析 */
          if (q.app && !q.exp) add(b.id, g, kp.name, '应用题缺解析', 'app=1 但无 exp', qs.slice(0, 50));

          /* 4. 题面写了单位但答案带单位（判分歧义） */
          if (/（填数/.test(qs) && /[一二三四五六七八九十百千万厘米平方立方元只个棵人份条张]/.test(ansS) === false) { /* 纯数值 OK */ }
          if (/（填数/.test(qs) && /厘米|平方|立方|元|千克|米\b/.test(ansS)) {
            add(b.id, g, kp.name, '填数题答案带单位', '题面要求填数但 ans=' + ansS, qs.slice(0, 50));
          }
        }
      });
    });
  });
});

console.log('══════ 全 12 册生成器自洽性体检 ══════');
console.log('课本数:', BOOKS.length, ' 实跑题目样本:', totalRun, '（每生成器 ' + RUNS + ' 次）');
console.log('发现问题类型数:', issues.length);
if (!issues.length) { console.log('\n✓ 未发现题面/答案矛盾类问题'); }
else {
  console.log('');
  /* 按严重度排序：答案类 > 选项类 > 其他 */
  var sev = function (t) { return /答案缺失|选项不含答案|运行异常|残留|比值答案|答案带单位/.test(t) ? 0 : 1 };
  issues.sort(function (a, b) { return sev(a.type) - sev(b.type) || b.count - a.count });
  issues.forEach(function (x) {
    console.log('[' + x.type + '] ' + x.book + ' / ' + x.gen + '（' + x.kp + '） 命中 ' + x.count + '/' + RUNS + ' 次');
    console.log('    ' + x.detail.slice(0, 150));
    x.samples.slice(0, 2).forEach(function (s) { if (s) console.log('    例: ' + s) });
  });
}
