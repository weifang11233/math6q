/* ============================================================
   课本模块：青岛版（六三制）数学 · 二年级上册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd2a-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'分类',theme:'妈妈的小帮手',color:'#E8833A',board:'统计与概率',kps:[
   {id:'qd2a-1-1',name:'按一个标准分类',card:`把东西按用途、颜色、形状分开摆放：水果放一起、文具放一起。标准不同分法不同，但每样只在一类。`,gens:['g_classify']}
 ]},
 {id:'2',name:'表内乘法（一）',theme:'中国戏法和杂技',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd2a-2-1',name:'乘法的初步认识（1~5 的乘法口诀）',card:`3+3+3+3 可以写成 3×4。几的口诀表示几个几相加。一二得二、二二得四……`,gens:['g_tableMul']},
   {id:'qd2a-2-2',name:'2~5 的乘法口诀应用',card:`每盘 4 个苹果、3 盘一共几个：4×3=12。口诀三四十二。`,gens:['g_tableMul','g_timesApp'],app:true}
 ]},
 {id:'3',name:'表内乘法（二）',theme:'多彩的社团',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd2a-3-1',name:'6~9 的乘法口诀',card:`六七四十二、七八五十六……大数口诀用拆分记：7×8 想 7×4+7×4=28+28=56。`,gens:['g_tableMul']},
   {id:'qd2a-3-2',name:'乘加乘减',card:`像 3×4+2 这样先乘后加：12+2=14。先乘除后加减从这就开始了。`,gens:['g_opOrder']}
 ]},
 {id:'4',name:'除法的初步认识',theme:'传统节日',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd2a-4-1',name:'平均分',card:`每份分得同样多叫平均分。12 个橘子平均分给 3 人，每人 4 个。`,gens:['g_tableDiv']},
   {id:'qd2a-4-2',name:'除法算式与口诀求商',card:`把 12 平均分成 3 份，每份 4：12÷3=4。求商用乘法口诀：三四十二。`,gens:['g_tableDiv']}
 ]},
 {id:'5',name:'厘米、米的认识',theme:'教室里的测量',color:'#B8860B',board:'图形与几何',kps:[
   {id:'qd2a-5-1',name:'厘米与米',card:`1 厘米约指甲盖宽；量短的用厘米，量长的用米。1 米 = 100 厘米。`,gens:['g_unitLen']},
   {id:'qd2a-5-2',name:'线段与估测',card:`线段有两个端点、直直的可以量长度。先估一估再量一量。`,gens:['g_unitLen']}
 ]},
 {id:'6',name:'表内除法',theme:'变废为宝',color:'#8E6FB8',board:'数与运算',kps:[
   {id:'qd2a-6-1',name:'用口诀求商与倍数关系',card:`24÷6 想四六二十四。求一个数是另一个数的几倍用除法。`,gens:['g_tableDiv','g_timesApp'],app:true}
 ]},
 {id:'R',name:'总复习',theme:'过年',color:'#5A5346',board:'综合',kps:[
   {id:'qd2a-R-1',name:'全册综合闯关',card:`乘除法口诀、分类、长度单位大串烧。`,gens:['g_tableMul','g_tableDiv','g_unitLen','g_classify']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'表内乘除法',units:['2','3','4','6']},
 {name:'图形与几何',color:'#3A6EA5',desc:'厘米、米的认识',units:['5']},
 {name:'统计与概率',color:'#8E6FB8',desc:'分类',units:['1']}
];

var C=window.COMMON_GEN;
var GENS={
  g_tableMul:function(u,k){return C.tableMul()(u,k)},
  g_tableDiv:function(u,k){return C.tableDiv()(u,k)},
  g_opOrder:function(u,k){return C.opOrder()(u,k)},
  g_unitLen:function(u,k){return C.unitConv(LEN2A)(u,k)},
  g_classify:function(u,k){return C.certain()(u,k)},
  g_timesApp:function(u,k){return C.timesApp()(u,k)}
};
var LEN2A=[[3,'米',100,'厘米',300],[5,'米',100,'厘米',500],[2,'米',100,'厘米',200],[300,'厘米',1,'米',3],[500,'厘米',1,'米',5],[700,'厘米',1,'米',7]];
var GENLVL={ g_tableMul:1, g_tableDiv:2, g_opOrder:3, g_unitLen:1, g_classify:1, g_timesApp:3};

var CHEAT=[
 ['乘法意义','几个相同加数相加写成乘法','3+3+3+3 = 3×4'],
 ['口诀求商','想乘法算除法','24÷6=4（四六二十四）'],
 ['平均分','每份分得同样多','12÷3=4，每人 4 个'],
 ['倍数关系','求几倍用乘，求一倍用除','6 的 3 倍 = 18'],
 ['米与厘米','1 米 = 100 厘米','身高约 130 厘米 = 1 米 30'],
 ['分类','一个标准分一类，不重不漏','按颜色/形状/用途分']
];

regBook({
  id:'qd2a',
  name:'二年级上册',
  grade:2, semester:'上',
  color:'#E8833A',
  edition:'2022课标修订版',
  intro:'表内乘除法、除法初步、厘米米、分类',
  mapFlow:'乘法口诀 1~9 步步背 → 除法是乘法的逆 → 用长度单位量世界',
  mapWhy:'乘法是相同加数的快捷方式，先把口诀背熟；除法从平均分来；长度单位从身边物体建立量感。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
