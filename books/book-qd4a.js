/* ============================================================
   课本模块：青岛版（六三制）数学 · 四年级上册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd4a-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'小数的初步认识',theme:'乘车中的学问',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd4a-1-1',name:'小数的意义与读写',card:`用元角分认识小数：3 元 5 角 = 3.5 元。小数点左边是整数部分，右边是十分位。`,gens:['g_decIntro']},
   {id:'qd4a-1-2',name:'小数比较大小',card:`先比整数部分，整数部分相同比十分位。0.8 > 0.7。`,gens:['g_decCmp']}
 ]},
 {id:'2',name:'长方形、正方形的面积',theme:'我家买了安居梦',color:'#2E8B8B',board:'图形与几何',kps:[
   {id:'qd4a-2-1',name:'面积与面积单位',card:`物体表面的大小是面积。1 平方厘米=指甲盖，1 平方米=4 块地砖。1 平方分米=100 平方厘米。`,gens:['g_rectS','g_areaUnit']},
   {id:'qd4a-2-2',name:'长方形正方形面积公式',card:`长方形面积 = 长×宽；正方形面积 = 边长×边长。`,gens:['g_rectS']}
 ]},
 {id:'3',name:'解决问题',theme:'绿色生态园',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd4a-3-1',name:'归一归总综合',card:`3 头牛一天吃 36 千克草，5 头牛一天吃多少？先归一 36÷3=12，再归总 12×5=60。`,gens:['g_normalize','g_totalFirst']}
 ]},
 {id:'4',name:'万以上数的认识',theme:'大数知多少',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd4a-4-1',name:'亿以内数的读写',card:`四位一级：个级、万级、亿级。读数先读万级再加「万」。3080000 读作三百零八万。`,gens:['g_bigNum']},
   {id:'qd4a-4-2',name:'大数比较与改写',card:`位数多的大；位数相同从最高位比。用「万」「亿」作单位改写：120000=12 万。`,gens:['g_bigNum']}
 ]},
 {id:'5',name:'相交与平行',theme:'交通中的线',color:'#B8860B',board:'图形与几何',kps:[
   {id:'qd4a-5-1',name:'垂直与平行',card:`同一平面内不相交的两条直线互相平行；相交成直角时互相垂直。平行线间距离处处相等。`,gens:['g_paraKnow']}
 ]},
 {id:'6',name:'三位数乘两位数',theme:'保护大天鹅',color:'#8E6FB8',board:'数与运算',kps:[
   {id:'qd4a-6-1',name:'笔算与常见积的变化',card:`234×21：先算 234×1，再算 234×20，错位相加。一个因数不变，另一个扩大几倍积也扩大几倍。`,gens:['g_mul3x2']},
   {id:'qd4a-6-2',name:'速度时间路程',card:`速度×时间=路程；路程÷速度=时间。120 千米/时 行 3 小时 = 360 千米。`,gens:['g_travel']}
 ]},
 {id:'7',name:'条形统计图',theme:'订校服',color:'#2E6B4F',board:'统计与概率',kps:[
   {id:'qd4a-7-1',name:'条形统计图',card:`一格代表一个或几个单位，条越长数量越多。能直观比较多少。`,gens:['g_chartBar']}
 ]},
 {id:'R',name:'总复习',theme:'全册串烧',color:'#5A5346',board:'综合',kps:[
   {id:'qd4a-R-1',name:'全册综合闯关',card:`小数、面积、大数、平行、乘法、统计图一起练。`,gens:['g_decIntro','g_rectS','g_bigNum','g_mul3x2','g_chartBar']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'小数初步 · 大数 · 三位数乘两位数',units:['1','3','4','6']},
 {name:'图形与几何',color:'#3A6EA5',desc:'面积 · 相交与平行',units:['2','5']},
 {name:'统计与概率',color:'#8E6FB8',desc:'条形统计图',units:['7']}
];

var C=window.COMMON_GEN;
var GENS={
  g_decIntro:function(u,k){return C.decIntro()(u,k)},
  g_decCmp:function(u,k){return C.decIntro('cmp')(u,k)},
  g_rectS:function(u,k){return C.rectCS('S')(u,k)},
  g_areaUnit:function(u,k){return C.unitConv(AREA4A)(u,k)},
  g_bigNum:function(u,k){return C.bigNum()(u,k)},
  g_paraKnow:function(u,k){return C.paraKnow()(u,k)},
  g_mul3x2:function(u,k){return C.mul3x2()(u,k)},
  g_travel:function(u,k){return C.travel()(u,k)},
  g_normalize:function(u,k){return C.normalize()(u,k)},
  g_totalFirst:function(u,k){return C.totalFirst()(u,k)},
  g_chartBar:function(u,k){return C.chartKnow('bar')(u,k)}
};
var AREA4A=[[3,'平方米',100,'平方分米',300],[5,'平方分米',100,'平方厘米',500],[2,'平方米',100,'平方分米',200],[700,'平方分米',1,'平方米',7],[900,'平方厘米',1,'平方分米',9]];
var GENLVL={ g_decIntro:1, g_decCmp:1, g_rectS:2, g_areaUnit:1, g_bigNum:2, g_paraKnow:1, g_mul3x2:3, g_travel:2, g_normalize:2, g_totalFirst:3, g_chartBar:1};

var CHEAT=[
 ['小数意义','元角分引入：5 角 = 0.5 元','3 元 5 角 = 3.5 元'],
 ['面积单位','1 平方分米 = 100 平方厘米','课本封面约 600 平方厘米'],
 ['面积公式','长×宽 / 边长×边长','长5宽3 → 15 平方'],
 ['大数分级','四位一级，从右起每四位一级','3080000 = 308 万'],
 ['垂直平行','相交成直角是垂直；永不相交是平行','铁轨互相平行'],
 ['乘法算路','速度 × 时间 = 路程','120 千米/时 × 3 时 = 360 千米']
];

regBook({
  id:'qd4a',
  name:'四年级上册',
  grade:4, semester:'上',
  color:'#E8833A',
  edition:'2022课标修订版',
  intro:'小数初步、大数认识、面积、三位数乘两位数、平行相交',
  mapFlow:'小数初步 → 长方形正方形面积 → 万以上大数 → 平行与相交 → 三位数乘两位数',
  mapWhy:'先认识小数（元角分引入）；面积是二维量感的起点；大数认识建立位值观；图形关系从垂直平行开始；乘法收尾到三位数。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
