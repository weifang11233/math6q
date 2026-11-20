/* ============================================================
   课本模块：青岛版（六三制）数学 · 四年级下册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd4b-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'计算器',theme:'泰山古树',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd4b-1-1',name:'认识与使用计算器',card:`会用计算器算大数：先按数字再按运算符号，最后按等号。算完要估算验证合不合理。`,gens:['g_estimate']}
 ]},
 {id:'2',name:'用字母表示数',theme:'节能减排',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd4b-2-1',name:'含字母的式子',card:`爸爸比小明大 25 岁：小明 a 岁时爸爸 a+25 岁。数与字母相乘省略乘号：4×a 写成 4a。`,gens:['g_algebra']}
 ]},
 {id:'3',name:'运算律',theme:'快乐农场',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd4b-3-1',name:'加法交换律与结合律',card:`a+b=b+a；(a+b)+c=a+(b+c)。凑整先行：73+28+72=73+(28+72)=173。`,gens:['g_lawName','g_add100_cr']},
   {id:'qd4b-3-2',name:'乘法交换律结合律分配律',card:`a×b=b×a；(a×b)×c=a×(b×c)；(a+b)×c=a×c+b×c。25×4=100 是万能凑整搭档。`,gens:['g_lawName','g_distrib']}
 ]},
 {id:'4',name:'认识多边形',theme:'巧手小工匠',color:'#3A6EA5',board:'图形与几何',kps:[
   {id:'qd4b-4-1',name:'三角形三边关系与内角和',card:`两边之和大于第三边；内角和 180°。3+4>5 ✓ 能围成三角形。`,gens:['g_triKnow']},
   {id:'qd4b-4-2',name:'三角形分类与稳定性',card:`按角分锐角/直角/钝角三角形；按边分等腰/等边。三角形最稳定，自行车架就是。`,gens:['g_triKnow']}
 ]},
 {id:'5',name:'小数的意义和性质',theme:'动物世界',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd4b-5-1',name:'小数的意义与计数单位',card:`0.3 = 3 个 0.1；0.35 = 35 个 0.01。十分位、百分位、千分位……`,gens:['g_decIntro','g_decCmp']},
   {id:'qd4b-5-2',name:'小数点移动规律',card:`小数点右移一位扩大 10 倍、左移一位缩小 10 倍。3.5→35 是扩大 10 倍。`,gens:['g_decShift']}
 ]},
 {id:'6',name:'观察物体',theme:'趣味拼搭',color:'#8E6FB8',board:'图形与几何',kps:[
   {id:'qd4b-6-1',name:'从三个方向观察立体',card:`从前面、上面、侧面观察拼搭体，画出看到的形状。`,gens:['g_viewObj']}
 ]},
 {id:'7',name:'小数加减法',theme:'小牛崽成长记',color:'#2E6B4F',board:'数与运算',kps:[
   {id:'qd4b-7-1',name:'小数加减笔算',card:`小数点对齐（就是数位对齐），再按整数加减算。3.5+2.47=5.97。`,gens:['g_decAddSub']}
 ]},
 {id:'8',name:'平均数',theme:'我锻炼 我健康',color:'#5C5346',board:'统计与概率',kps:[
   {id:'qd4b-8-1',name:'平均数的意义与计算',card:`平均数 = 总数 ÷ 个数。它代表整体水平，不是每个人都刚好那么多。`,gens:['g_average']}
 ]},
 {id:'R',name:'总复习',theme:'回顾整理',color:'#5A5346',board:'综合',kps:[
   {id:'qd4b-R-1',name:'全册综合闯关',card:`字母式、运算律、三角形、小数、平均数一起练。`,gens:['g_algebra','g_distrib','g_triKnow','g_decAddSub','g_average']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'字母表示数 · 运算律 · 小数',units:['1','2','3','5','7']},
 {name:'图形与几何',color:'#3A6EA5',desc:'多边形 · 观察物体',units:['4','6']},
 {name:'统计与概率',color:'#8E6FB8',desc:'平均数',units:['8']}
];

var C=window.COMMON_GEN;
var GENS={
  g_algebra:function(u,k){return C.algebra()(u,k)},
  g_lawName:function(u,k){return C.lawName()(u,k)},
  g_distrib:function(u,k){return C.distrib()(u,k)},
  g_triKnow:function(u,k){return C.triKnow()(u,k)},
  g_decIntro:function(u,k){return C.decIntro()(u,k)},
  g_decCmp:function(u,k){return C.decIntro('cmp')(u,k)},
  g_decShift:function(u,k){return C.decShift()(u,k)},
  g_viewObj:function(u,k){return C.viewObj()(u,k)},
  g_decAddSub:function(u,k){return C.decAddSub()(u,k)},
  g_average:function(u,k){return C.average()(u,k)},
  g_estimate:function(u,k){return C.estimate()(u,k)},
  g_add100_cr:function(u,k){return C.add100('carry')(u,k)}
};

var GENLVL={ g_algebra:2, g_lawName:1, g_distrib:2, g_triKnow:2, g_decIntro:1, g_decCmp:1, g_decShift:2, g_viewObj:1, g_decAddSub:2, g_average:2, g_estimate:2, g_add100_cr:1};

var CHEAT=[
 ['字母表示数','数与字母相乘省略乘号','4×a 写成 4a'],
 ['加法运算律','交换律 a+b=b+a；结合律凑整先行','73+28+72=173'],
 ['乘法分配律','(a+b)×c=a×c+b×c','25×(40+4)=1000+100'],
 ['三角形','两边之和>第三边；内角和 180°','3、4、5 能围成三角形'],
 ['小数点移动','右移一位扩 10 倍，左移一位缩 10 倍','3.5 → 0.35'],
 ['小数加减','小数点对齐再算','3.5+2.47=5.97'],
 ['平均数','总数 ÷ 个数','(80+90+70)÷3=80']
];

regBook({
  id:'qd4b',
  name:'四年级下册',
  grade:4, semester:'下',
  color:'#2E8B8B',
  edition:'2022课标修订版',
  intro:'用字母表示数、运算律、三角形、小数意义与加减法、平均数',
  mapFlow:'计算器 → 字母表示数 → 运算律 → 三角形 → 小数意义性质 → 小数加减 → 平均数',
  mapWhy:'字母表示数是从算术走向代数的第一步；运算律让计算更灵活；三角形是最基本的多边形；小数体系在四年级全面建立。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
