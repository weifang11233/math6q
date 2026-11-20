/* ============================================================
   课本模块：青岛版（六三制）数学 · 二年级下册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd2b-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'有余数的除法',theme:'休闲假日',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd2b-1-1',name:'有余数除法的意义',card:`13 个苹果每盘放 4 个，放 3 盘还剩 1 个：13÷4=3 余 1。余数一定比除数小！`,gens:['g_divRem']},
   {id:'qd2b-1-2',name:'用余数解决实际问题',card:`租船问题：32 人每船坐 6 人，32÷6=5 余 2，剩下的 2 人也要坐船，所以要 6 条船（进一法）。`,gens:['g_divRem','g_ceilDiv'],app:true}
 ]},
 {id:'2',name:'万以内数的认识',theme:'游览北京',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd2b-2-1',name:'千以内数与万以内数',card:`10 个一百是一千，10 个一千是一万。数位顺序：个、十、百、千、万。`,gens:['g_cmp10000','g_nb10000']},
   {id:'qd2b-2-2',name:'万以内数的大小比较与组成',card:`先比数位：四位数比三位数大；位数相同从最高位比起。`,gens:['g_cmp10000']}
 ]},
 {id:'3',name:'多位数的加减法',theme:'红色教育进校园',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd2b-3-1',name:'三位数加减法（口算与笔算）',card:`数位对齐从个位算起；进位借位别忘标记。350+240=590。`,gens:['g_add3digit']},
   {id:'qd2b-3-2',name:'加减法验算',card:`验算：和减一个加数等于另一个加数；差加减数等于被减数。`,gens:['g_add3digit']}
 ]},
 {id:'4',name:'解决问题',theme:'巧手编织致富路',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd2b-4-1',name:'两步计算应用题',card:`先想中间问题：买了 4 盒彩笔每盒 8 元，付 50 元找回多少？先算 4×8=32，再算 50-32=18。`,gens:['g_twoStep'],app:true}
 ]},
 {id:'5',name:'分类（二）与时间',theme:'漂亮的花朵 / 时间与生活',color:'#B8860B',board:'统计与概率',kps:[
   {id:'qd2b-5-1',name:'按两个标准分类与时间',card:`同样的纽扣可以按形状分、按颜色分，结果不同。时、分、秒：1 时=60 分，1 分=60 秒。`,gens:['g_timeCalc']}
 ]},
 {id:'R',name:'总复习',theme:'我的奥运梦',color:'#5A5346',board:'综合',kps:[
   {id:'qd2b-R-1',name:'全册综合闯关',card:`有余数除法、万以内数、加减法、两步应用题一起练。`,gens:['g_divRem','g_cmp10000','g_add3digit','g_twoStep']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'有余数除法 · 万以内数 · 加减法',units:['1','2','3','4']},
 {name:'统计与概率',color:'#8E6FB8',desc:'分类 · 时间',units:['5']}
];

var C=window.COMMON_GEN;
var GENS={
  g_divRem:function(u,k){return C.divRem()(u,k)},
  g_ceilDiv:function(u,k){return C.ceilDiv()(u,k)},
  g_cmp10000:function(u,k){return C.compare(10000)(u,k)},
  g_nb10000:function(u,k){return C.neighbor(10000)(u,k)},
  g_add3digit:function(u,k){return C.add3digit()(u,k)},
  g_twoStep:function(u,k){return C.twoStep()(u,k)},
  g_timeCalc:function(u,k){return C.timeCalc()(u,k)}
};

var GENLVL={ g_divRem:2, g_ceilDiv:3, g_cmp10000:1, g_nb10000:1, g_add3digit:2, g_twoStep:3, g_timeCalc:2};

var CHEAT=[
 ['余数','余数必须比除数小','13÷4=3 余 1'],
 ['进一法','余下的人也要租船','32÷6=5 余 2 → 要 6 条船'],
 ['万以内数','从最高位比起','999 < 1000'],
 ['三位数加减','数位对齐，从个位算起','350+240=590'],
 ['两步应用题','先求中间量，再求问题','4×8=32，50-32=18'],
 ['时间','1 时=60 分，1 分=60 秒','8:30 + 40 分 = 9:10']
];

regBook({
  id:'qd2b',
  name:'二年级下册',
  grade:2, semester:'下',
  color:'#2E8B8B',
  edition:'2022课标修订版',
  intro:'有余数除法、万以内数、多位数加减法、解决问题',
  mapFlow:'有余数除法 → 万以内数 → 两三位数加减 → 分步解决问题',
  mapWhy:'先在除法里认识余数；再把数感扩到万；加减法位数变多；最后学用两步算式解决实际问题。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
