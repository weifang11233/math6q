/* ============================================================
   课本模块：青岛版（六三制）数学 · 五年级下册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd5b-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'认识负数',theme:'中国的热极',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd5b-1-1',name:'正负数与温度',card:`零上为正零下为负：+13℃ 和 -13℃。0 既不是正数也不是负数，是分界点。`,gens:['g_negative']}
 ]},
 {id:'2',name:'分数的意义和性质',theme:'校园艺术节',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd5b-2-1',name:'分数的意义与单位',card:`把单位「1」平均分成几份，表示一份或几份的数。1/4 就是分数单位，3/4 有 3 个 1/4。`,gens:['g_fracMean']},
   {id:'qd5b-2-2',name:'约分与通分、分数比较',card:`分子分母同除公因数是约分；同乘通分。比较先通分或与 1/2 比。`,gens:['g_fracCmp']}
 ]},
 {id:'3',name:'分数加减法（一）',theme:'剪纸中的数学',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd5b-3-1',name:'同分母分数加减',card:`分母不变分子加减：3/8+2/8=5/8。结果要约成最简分数。`,gens:['g_fracSame']}
 ]},
 {id:'4',name:'方向与位置',theme:'走进军营',color:'#3A6EA5',board:'图形与几何',kps:[
   {id:'qd5b-4-1',name:'用数对确定位置',card:`数对（列，行）：竖排列从左数，横行从前往后。（3,2）= 第 3 列第 2 行。`,gens:['g_coord']}
 ]},
 {id:'5',name:'分数加减法（二）',theme:'关注环境',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd5b-5-1',name:'异分母分数加减',card:`先通分再加减：1/2+1/3=3/6+2/6=5/6。分母不同就是分数单位不同，必须通分。`,gens:['g_fracDiff']}
 ]},
 {id:'6',name:'复式统计图',theme:'爱护眼睛',color:'#8E6FB8',board:'统计与概率',kps:[
   {id:'qd5b-6-1',name:'复式条形/折线统计图',card:`两组数据画在同一张图里（图例区分颜色），方便对比：两个班视力情况。`,gens:['g_chartDouble']}
 ]},
 {id:'7',name:'长方体和正方体',theme:'包装盒',color:'#2E6B4F',board:'图形与几何',kps:[
   {id:'qd5b-7-1',name:'体积与容积单位',card:`1 立方米=1000 立方分米；1 升=1000 毫升；1 立方分米=1 升。`,gens:['g_volUnit']},
   {id:'qd5b-7-2',name:'长方体正方体表面积体积',card:`表面积=六个面之和；体积=长×宽×高；正方体体积=棱长³。`,gens:['g_cuboid']}
 ]},
 {id:'R',name:'总复习',theme:'回顾整理',color:'#5A5346',board:'综合',kps:[
   {id:'qd5b-R-1',name:'全册综合闯关',card:`负数、分数、数对、统计图、立体图形一起练。`,gens:['g_negative','g_fracDiff','g_coord','g_cuboid','g_chartDouble']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'负数 · 分数意义与加减',units:['1','2','3','5']},
 {name:'图形与几何',color:'#3A6EA5',desc:'方向与位置 · 长方体正方体',units:['4','7']},
 {name:'统计与概率',color:'#8E6FB8',desc:'复式统计图',units:['6']}
];

var C=window.COMMON_GEN;
var GENS={
  g_negative:function(u,k){return C.negative()(u,k)},
  g_fracMean:function(u,k){return C.fracMean()(u,k)},
  g_fracCmp:function(u,k){return C.fracCmp()(u,k)},
  g_fracSame:function(u,k){return C.fracAddSub(true)(u,k)},
  g_fracDiff:function(u,k){return C.fracAddSub(false)(u,k)},
  g_coord:function(u,k){return C.coord()(u,k)},
  g_chartDouble:function(u,k){return C.chartKnow('double')(u,k)},
  g_volUnit:function(u,k){return C.unitConv(VOL5B)(u,k)},
  g_cuboid:function(u,k){return C.cuboid()(u,k)}
};
var VOL5B=[[3,'立方米',1000,'立方分米',3000],[2,'立方分米',1000,'立方厘米',2000],[4,'升',1000,'毫升',4000],[5000,'毫升',1,'升',5],[7000,'立方厘米',1,'立方分米',7]];
var GENLVL={ g_negative:1, g_fracMean:1, g_fracCmp:2, g_fracSame:1, g_fracDiff:3, g_coord:1, g_chartDouble:1, g_volUnit:1, g_cuboid:3};

var CHEAT=[
 ['负数','零下用负数；0 是分界','-13℃ < 0℃'],
 ['分数单位','把单位 1 平均分成几份，1/n 是分数单位','3/4 有 3 个 1/4'],
 ['约分通分','同除公因数约分；同乘通分','6/8 = 3/4'],
 ['异分母加减','先通分再算，结果化最简','1/2+1/3=5/6'],
 ['数对','（列，行）列在前','(3,2)=第3列第2行'],
 ['体积单位','1 立方米=1000 立方分米；1 升=1000 毫升','1 立方分米=1 升'],
 ['长方体体积','长 × 宽 × 高','5×3×2=30']
];

regBook({
  id:'qd5b',
  name:'五年级下册',
  grade:5, semester:'下',
  color:'#2E8B8B',
  edition:'2022课标修订版',
  intro:'负数、分数意义性质、分数加减、方向与位置、长方体正方体',
  mapFlow:'认识负数 → 分数意义性质 → 分数加减 → 方向与位置 → 长方体正方体',
  mapWhy:'负数把数系扩到 0 以下；分数从「量」走向「率」全面认识；加减法打通运算；立体图形开启三维空间。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
