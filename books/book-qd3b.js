/* ============================================================
   课本模块：青岛版（六三制）数学 · 三年级下册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd3b-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'两位数乘两位数',theme:'乡村新面貌',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd3b-1-1',name:'口算与不进位笔算',card:`23×12：先算 23×2=46，再算 23×10=230，合起来 276。十位乘的部分要对齐十位。`,gens:['g_mul2x2']},
   {id:'qd3b-1-2',name:'进位笔算与应用',card:`每次进位别忘加。48×25=1200：先 48×5=240，再 48×20=960，240+960=1200。`,gens:['g_mul2x2','g_price'],app:true}
 ]},
 {id:'2',name:'线与角',theme:'繁忙的工地',color:'#2E8B8B',board:'图形与几何',kps:[
   {id:'qd3b-2-1',name:'线段、射线、直线与角',card:`线段有两个端点；射线一个端点无限长；直线没有端点。角有一个顶点两条边，从锐角、直角、钝角到平角周角。`,gens:['g_angleKnow']}
 ]},
 {id:'3',name:'混合运算',theme:'劳动最美丽',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd3b-3-1',name:'运算顺序',card:`先乘除后加减；有括号先算括号；(25+15)÷8=40÷8=5。`,gens:['g_opOrder','g_opOrderApp']}
 ]},
 {id:'4',name:'图形与周长',theme:'美丽的公园',color:'#3A6EA5',board:'图形与几何',kps:[
   {id:'qd3b-4-1',name:'周长的认识与长方形周长',card:`封闭图形一周的长度是周长。长方形周长 =（长+宽）×2。`,gens:['g_rectC']}
 ]},
 {id:'5',name:'分数的初步认识',theme:'今天我分餐',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd3b-5-1',name:'几分之一与几分之几',card:`平均分成 4 份每份是 1/4；取 3 份是 3/4。分母是分的份数，分子是取的份数。`,gens:['g_fracIntro']},
   {id:'qd3b-5-2',name:'简单分数加减与比较',card:`同分母分数：分子相加减，分母不变。2/5+1/5=3/5。`,gens:['g_fracIntro','g_fracSame']}
 ]},
 {id:'6',name:'数据的收集与整理',theme:'体育与健康',color:'#8E6FB8',board:'统计与概率',kps:[
   {id:'qd3b-6-1',name:'分类计数与简单统计表',card:`画正字计数、填统计表，从数据里看结论：全班最喜欢的运动是什么。`,gens:['g_chartBar']}
 ]},
 {id:'R',name:'总复习',theme:'全册串烧',color:'#5A5346',board:'综合',kps:[
   {id:'qd3b-R-1',name:'全册综合闯关',card:`两位数乘法、角、混合运算、周长、分数一起练。`,gens:['g_mul2x2','g_angleKnow','g_opOrder','g_rectC','g_fracIntro']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'两位数乘两位数 · 混合运算 · 分数初步',units:['1','3','5']},
 {name:'图形与几何',color:'#3A6EA5',desc:'线与角 · 周长',units:['2','4']},
 {name:'统计与概率',color:'#8E6FB8',desc:'数据的收集与整理',units:['6']}
];

var C=window.COMMON_GEN;
var GENS={
  g_mul2x2:function(u,k){return C.mul2x2()(u,k)},
  g_angleKnow:function(u,k){return C.angleKnow()(u,k)},
  g_opOrder:function(u,k){return C.opOrder()(u,k)},
  g_opOrderApp:function(u,k){return C.twoStep()(u,k)},
  g_rectC:function(u,k){return C.rectCS('C')(u,k)},
  g_fracIntro:function(u,k){return C.fracIntro()(u,k)},
  g_fracSame:function(u,k){return C.fracAddSub(true)(u,k)},
  g_chartBar:function(u,k){return C.chartKnow('bar')(u,k)},
  g_price:function(u,k){return C.price()(u,k)}
};

var GENLVL={ g_mul2x2:2, g_angleKnow:1, g_opOrder:2, g_opOrderApp:3, g_rectC:2, g_fracIntro:1, g_fracSame:2, g_chartBar:1, g_price:3};

var CHEAT=[
 ['两位数乘法','分开乘再相加：先个位后十位','23×12=276'],
 ['线段射线直线','线段 2 端点、射线 1 端点、直线无端点','手电筒光是射线'],
 ['角的分类','锐角<直角<钝角<平角<周角','1 平角=180°=2 直角'],
 ['运算顺序','先乘除后加减，括号最优先','(25+15)÷8=5'],
 ['长方形周长','（长+宽）×2','长5宽3 → 16'],
 ['分数初步','平均分：分母分、分子取','3/4 读作四分之三']
];

regBook({
  id:'qd3b',
  name:'三年级下册',
  grade:3, semester:'下',
  color:'#2E8B8B',
  edition:'2022课标修订版',
  intro:'两位数乘两位数、混合运算、图形周长、分数初步',
  mapFlow:'两位数乘两位数 → 线与角 → 混合运算 → 周长 → 分数初步认识',
  mapWhy:'乘法从表内扩展到两位数；认识线段射线角；混合运算讲顺序；周长是图形量感第一步；分数初步为高年级打地基。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
