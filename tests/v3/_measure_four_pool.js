/* 实测：四步法各范围实际能生成多少种不同题面（决定多久遇到重复）
   加载线上 index.html + 14 个课本，跑 appGenList/fourPool/fourMixPool

   修复记录（v3.12）：
   ① ROOT 原来用 path.resolve('tests/v3','..','..') —— 相对 cwd，换个启动目录就找不到
      index.html，且加载循环的空 catch 吞掉错误，表现为"已加载课本 0 册"的沉默失败。
      改用 __dirname，与启动目录无关；加载失败改为打印错误，不再沉默。
   ② countPool 原来调 setCurrentBook()（内部 applyBookPointers 在 DOM stub 下易失败），
      改为直接同步 BOOK_DEF/UNITS/GENS/GENLVL 四个模块级变量——appGenList 读的就是这几个。*/
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');   /* 与 cwd 无关，始终指向 math6q/ */

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
/* 按序收集 script（注册表 → books → 主逻辑） */
const SEQ = [];
{ const re = /<script(?:\s+src="([^"]+)")?\s*>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(html))) SEQ.push({ src: m[1] || null, code: m[2] }); }

const els = {};
function mkEl(id){ return { id, innerHTML:'', value:'', checked:false, textContent:'', files:[], type:'text',
  style:{}, dataset:{}, children:[], placeholder:'',
  classList:{_s:new Set(),add(x){this._s.add(x)},remove(x){this._s.delete(x)},toggle(x){this._s.has(x)?this._s.delete(x):this._s.add(x)},contains(x){return this._s.has(x)}},
  addEventListener(){}, removeEventListener(){}, focus(){}, blur(){}, click(){},
  appendChild(c){this.children.push(c)}, setAttribute(){}, getAttribute(){return null},
  querySelector(){return null}, querySelectorAll(){return []},
  getContext(){return{drawImage(){},fillRect(){},getImageData(){return{data:[]}}}},
  toDataURL(){return'data:image/jpeg;base64,AAAA'}, scrollIntoView(){}, remove(){}, insertBefore(){} }; }
const store = new Map();
const localStorage = { getItem:k=>store.has(k)?store.get(k):null, setItem:(k,v)=>store.set(k,String(v)),
  removeItem:k=>store.delete(k), clear:()=>store.clear(), key(i){return Array.from(store.keys())[i]??null}, get length(){return store.size} };
const document = { getElementById:id=>els[id]||(els[id]=mkEl(id)), querySelector:()=>null, querySelectorAll:()=>[],
  createElement:t=>mkEl('_'+t), body:mkEl('body'), head:mkEl('head'), addEventListener(){}, documentElement:mkEl('html') };
const sandbox = { console, localStorage, document,
  setTimeout:(fn,d)=>setTimeout(fn,Math.min(d||0,20)), clearTimeout:t=>clearTimeout(t),
  setInterval:()=>1, clearInterval:()=>{}, Date, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Error, Promise,
  parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent,
  Uint8Array, Uint32Array, Uint8ClampedArray, ArrayBuffer, Blob:function(){},
  fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve({data:[]})}),
  alert(){}, confirm:()=>true, prompt:()=>'', scrollTo(){}, location:{href:'',reload(){}},
  navigator:{clipboard:{writeText(){}},userAgent:'node'},
  FileReader:function(){this.readAsDataURL=function(){this.result='data:image/jpeg;base64,AAAA';if(this.onload)this.onload({target:this})}},
  Image:function(){this.onload=null}, btoa:s=>Buffer.from(s,'binary').toString('base64'), atob:s=>Buffer.from(s,'base64').toString('binary') };
sandbox.window=sandbox; sandbox.globalThis=sandbox; vm.createContext(sandbox);

for (const p of SEQ) {
  let src=p.code;
  if (p.src){ const fp=path.join(ROOT,p.src);
    if(fs.existsSync(fp)) src=fs.readFileSync(fp,'utf8');
    else { console.error('跳过缺失脚本:',p.src); continue; } }
  try { vm.runInContext(src, sandbox, { filename:p.src||'inline', timeout:15000 }); }
  catch(e){ console.error('脚本执行失败:',p.src||'inline',e.message); }  /* 不再沉默吞错 */
}

/* 修复③：原来 `const g = k => sandbox[k]` 在 vm contextify 的 sandbox 上读属性有惰性同步问题，
   脚本执行完后 g.BOOKS 仍读到 0（而 sandbox.BOOKS 已是 12），导致沉默输出 0 册。
   改用 Proxy 直接透传读写，确保读到 context 里的真实值。 */
const g = new Proxy(sandbox, {
  get:(t,k)=>t[k],
  set:(t,k,v)=>{ t[k]=v; return true; }
});
console.log('已加载课本:', (g.BOOKS||[]).length, '册');

/* 切换课本：直接同步 appGenList 依赖的四个模块级变量（不调 setCurrentBook，避免 stub 下的 DOM 副作用） */
function countPool(bookId){
  const def = g.bookById(bookId);
  if(!def) return null;
  g.BOOK_DEF = def;
  g.UNITS = def.UNITS;
  g.GENS = def.GENS;
  g.GENLVL = def.GENLVL || {};
  if (g.APPGEN_CACHE) g.APPGEN_CACHE = { bookId:null, list:[] };  /* 清缓存，否则沿用上一册清单 */
  return { def, gens:Object.keys(g.GENS||{}).length };
}

/* 直接调 appGenList 拿应用题清单，再统计四步法不同题面数 */
function sampleFaces(poolFn, tries){
  const seen=new Set(); const specKey=s=>s.g+'|'+s.u+'|'+s.k;
  const cache={};
  for(let i=0;i<tries;i++){
    const pool=poolFn();
    if(!pool||!pool.length) continue;
    for(const spec of pool){
      const key=specKey(spec);
      if(!(key in cache)){ try{cache[key]=g.makeQ(spec).q}catch(e){cache[key]=null} }
      if(cache[key]) seen.add(cache[key]);
    }
  }
  return seen.size;
}

const targets = (g.BOOKS||[]).map(b=>b.id);
console.log('\n课本    册名          单元  应用题规格  池规模(题面抽样)');
console.log('─'.repeat(70));
for(const bid of targets){
  const info=countPool(bid);
  if(!info) continue;
  const def=info.def;
  const list=g.appGenList ? g.appGenList() : [];
  const uniIds=(def.UNITS||[]).map(u=>String(u.id));
  const specCount=list.length;
  const faces=sampleFaces(()=>list.slice(),1);
  console.log((bid+'').padEnd(8)+(def.name||'').padEnd(14)+String(uniIds.length).padStart(3)+String(specCount).padStart(10)+String(faces).padStart(14));
}
