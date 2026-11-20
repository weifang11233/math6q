/* 验证 g_discount（折扣题）中文折扣与答案是否一致
   源码: off=pk([7,8,9]); now=orig*off/10; cn=['','一',...,'九'][10-off]
   疑点: off=9 -> 现价=90%原价，但 cn[10-9]=cn[1]='一' -> 题面写"打一折"
   "打一折"应为原价的10%，与答案90%矛盾 => 学生按题面答对会被判错 */
var fs=require('fs'),path=require('path'),vm=require('vm');
var UTILS=['function R(n){return Math.floor(Math.random()*n)}','function pick(a){return a[R(a.length)]}',
'function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t}return a||1}',
'function frac(n,d){var G=gcd(n,d);n=n/G;d=d/G;return d===1?String(n):(n+"/"+d)}',
'function fracHTML(n,d){return frac(n,d)}','function rich(s){return String(s)}',
'function val(s){s=String(s).trim();if(!s)return null;var f=parseFloat(s);return isNaN(f)?null:f}',
'function shuffle(a){return a}'].join('\n');
var BOOKS=[];var sb={regBook:function(d){BOOKS.push(d)},BOOKS:BOOKS,Math:Math,Date:Date,JSON:JSON,String:String,Number:Number,Array:Array,Object:Object,parseInt:parseInt,parseFloat:parseFloat,isNaN:isNaN,console:console};
sb.window=sb;sb.globalThis=sb;vm.createContext(sb);vm.runInContext(UTILS,sb,{filename:'u'});
var dir=path.resolve(__dirname,'..','..','books');
['common-gen.js','common-gen2.js'].concat(fs.readdirSync(dir).filter(f=>/^book-/.test(f))).forEach(function(f){
  var p=path.join(dir,f);if(!fs.existsSync(p))return;try{vm.runInContext(fs.readFileSync(p,'utf8'),sb,{filename:f})}catch(e){}});

/* 折扣中文 -> 应付比例（小学数学定义：打n折 = 原价 × n/10） */
var CN2NUM={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10};

var booksWithDiscount=[];
BOOKS.forEach(function(b){
  var G=b.GENS||{},U=b.UNITS||[];
  var loc=null;
  U.forEach(function(u){(u.kps||[]).forEach(function(kp){(kp.gens||[]).forEach(function(g){
    if(!loc&&G[g]&&/discount/.test(g))loc={g:g,u:u.id,k:kp.id,kpName:kp.name};})})});
  if(loc)booksWithDiscount.push({book:b,loc:loc});
});
console.log('含折扣生成器的课本:',booksWithDiscount.map(x=>x.book.id+'/'+x.loc.g).join(', ')||'无');

var bad=0,total=0,samples=[];
booksWithDiscount.forEach(function(x){
  for(var i=0;i<400;i++){
    var q;try{q=x.book.GENS[x.loc.g](x.loc.u,x.loc.k)}catch(e){continue}
    var m=String(q.q).match(/打([一二三四五六七八九十])折/);
    var om=String(q.q).match(/原价\s*([\d.]+)\s*元/);
    if(!m||!om)continue;
    total++;
    var zhe=CN2NUM[m[1]],orig=parseFloat(om[1]);
    var expect=orig*zhe/10;          /* 按题面"打X折"学生应答的值 */
    var given=parseFloat(q.ans);      /* 系统标准答案 */
    var ok=Math.abs(expect-given)<1e-9;
    if(!ok){bad++;if(samples.length<8)samples.push({q:String(q.q).replace(/<[^>]+>/g,''),ans:given,expect:expect,zhe:m[1]});}
  }
});
console.log('\n=== 折扣题一致性检测 ===');
console.log('样本总数:',total,' 题面与答案矛盾:',bad,' 矛盾率:',total?Math.round(bad/total*100)+'%':'n/a');
samples.forEach(function(s){
  console.log('  ✗ '+s.q);
  console.log('     系统答案='+s.ans+'  但"打'+s.zhe+'折"按题意应为 '+s.expect+'  -> 学生答对会被判错');
});
console.log('\n结论:',bad>0?'【确认为 BUG】中文折扣名与计算比例错位（cn[10-off] 应为 cn[off]）':'未发现问题');
