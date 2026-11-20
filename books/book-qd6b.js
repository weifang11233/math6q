/* ============================================================
   课本模块：青岛版（六三制）数学 · 六年级下册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd6b-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'百分数（二）',theme:'欢乐农家游',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd6b-1-1',name:'折扣与成数',card:`打八折 = 现价是原价的 80%。原价 200 元打八折：200×80%=160 元。成数：增产二成 = 20%。`,gens:['g_discount']},
   {id:'qd6b-1-2',name:'税率与利率',card:`利息 = 本金 × 利率 × 存期。10000 元存 2 年年利率 2.25%：利息 10000×2.25%×2=450 元。`,gens:['g_interest'],app:true}
 ]},
 {id:'2',name:'圆柱和圆锥',theme:'冰淇淋盒有多大',color:'#2E8B8B',board:'图形与几何',kps:[
   {id:'qd6b-2-1',name:'圆柱表面积',card:`侧面展开是长方形：侧面积 = 底面周长 × 高 = 2πrh。表面积 = 侧面积 + 2 个底面积。`,gens:['g_cylSA']},
   {id:'qd6b-2-2',name:'圆柱圆锥体积',card:`圆柱 V=πr²h；圆锥 V=1/3 πr²h。圆锥体积是等底等高圆柱的三分之一。`,gens:['g_cylV','g_coneV']}
 ]},
 {id:'3',name:'比例',theme:'啤酒生产中的数学',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd6b-3-1',name:'比例的意义与基本性质',card:`比值相等的两个比组成比例 3:4=6:8。内项积 = 外项积：3×8=4×6。`,gens:['g_proportion']},
   {id:'qd6b-3-2',name:'正比例与反比例',card:`比值一定成正比例（速度不变，路程与时间）；乘积一定成反比例（路程不变，速度与时间）。`,gens:['g_propRel']}
 ]},
 {id:'4',name:'比例尺',theme:'快乐足球',color:'#3A6EA5',board:'图形与几何',kps:[
   {id:'qd6b-4-1',name:'比例尺与图上距离',card:`比例尺 = 图上距离 : 实际距离。1:50000 的地图，图上 2 厘米实际 1 千米。`,gens:['g_scale']}
 ]},
 {id:'5',name:'扇形统计图',theme:'奥运奖牌',color:'#B8860B',board:'统计与概率',kps:[
   {id:'qd6b-5-1',name:'扇形统计图与选择',card:`扇形统计图表示部分占整体的百分比。要看出占比用它；要看变化用折线。`,gens:['g_chartFan']}
 ]},
 {id:'R',name:'总复习',theme:'回顾整理 · 小升初',color:'#5A5346',board:'综合',kps:[
   {id:'qd6b-R-1',name:'六年知识大闯关',card:`数与运算、图形几何、统计概率全部混出，小升初查漏补缺。`,gens:['g_discount','g_cylV','g_proportion','g_scale','g_fracMul','g_pctConv']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'百分数 · 比例',units:['1','3']},
 {name:'图形与几何',color:'#3A6EA5',desc:'圆柱圆锥 · 比例尺',units:['2','4']},
 {name:'统计与概率',color:'#8E6FB8',desc:'扇形统计图',units:['5']}
];

var C=window.COMMON_GEN;
var GENS={
  g_discount:function(u,k){return C.discount()(u,k)},
  g_interest:function(u,k){return C.interest()(u,k)},
  g_cylSA:function(u,k){return C.cylSA()(u,k)},
  g_cylV:function(u,k){return C.geoCircle('cylV')(u,k)},
  g_coneV:function(u,k){return C.geoCircle('coneV')(u,k)},
  g_proportion:function(u,k){return C.proportion()(u,k)},
  g_propRel:function(u,k){return C.propRel()(u,k)},
  g_scale:function(u,k){return C.scaleMap()(u,k)},
  g_chartFan:function(u,k){return C.chartKnow('fan')(u,k)},
  g_fracMul:function(u,k){return C.fracMulDiv(false)(u,k)},
  g_pctConv:function(u,k){return C.pctConv()(u,k)}
};

var GENLVL={ g_discount:2, g_interest:3, g_cylSA:3, g_cylV:2, g_coneV:2, g_proportion:2, g_propRel:2, g_scale:2, g_chartFan:1, g_fracMul:2, g_pctConv:1};

var CHEAT=[
 ['折扣','打八折 = 现价是原价 80%','200 元打八折 = 160 元'],
 ['利息','本金 × 利率 × 存期','10000×2.25%×2=450'],
 ['圆柱表面积','侧面积 2πrh + 2 个底面','r=2,h=5 → 侧 62.8'],
 ['圆柱圆锥体积','圆柱 πr²h；圆锥 = 1/3 πr²h','等底等高圆锥 = 圆柱/3'],
 ['比例性质','内项积 = 外项积','3:4=6:8 → 3×8=4×6'],
 ['正反比例','比值一定正比例；乘积一定反比例','速度不变路程与时间正比'],
 ['比例尺','图上 : 实际','1:50000 图上 2cm = 实际 1km'],
 ['扇形统计图','看部分占整体百分比','占比大扇形大']
];

regBook({
  id:'qd6b',
  name:'六年级下册',
  grade:6, semester:'下',
  color:'#E8833A',
  edition:'2022课标修订版',
  intro:'百分数（二）、圆柱圆锥、比例、比例尺、扇形统计图',
  mapFlow:'百分数应用 → 圆柱圆锥 → 比例 → 比例尺 → 扇形统计图 → 小升初总复习',
  mapWhy:'百分数收尾分数应用；圆柱圆锥用上圆的知识；比例统一比与分数；最后扇形统计图看占比，全册为小升初兜底。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
