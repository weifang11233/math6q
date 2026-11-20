/* ============================================================
   课本模块：青岛版（六三制）数学 · 一年级上册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd1a-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'1~5 数的认识和加减法',theme:'快乐的课堂',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd1a-1-1',name:'1~5 的认识',card:`会数、会认、会写 1~5；用小棒、点子图表示数；比大小用 >、<、=。`,gens:['g_1to5_cmp','g_1to5_nb']},
   {id:'qd1a-1-2',name:'几和几（1~5 的组成）',card:`4 可以分成 1 和 3、2 和 2……分与合是加减法的基础。`,gens:['g_1to5_nb']},
   {id:'qd1a-1-3',name:'1~5 的加减法',card:`把两部分合起来用加法；去掉一部分用减法。看图列式，再说一说算式的意思。`,gens:['g_add20_mix']}
 ]},
 {id:'2',name:'6~10 数的认识和加减法',theme:'走进花果山',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd1a-2-1',name:'6~10 的认识',card:`数数、比大小、数的组成：10 里有 1 个十；相邻数差 1。`,gens:['g_6to10_cmp','g_6to10_nb','g_compose10']},
   {id:'qd1a-2-2',name:'6~10 的加减法',card:`用组成算加减：想 8 可以分成 5 和 3，就能算 8-5=3。`,gens:['g_add20_mix']},
   {id:'qd1a-2-3',name:'连加连减',card:`从左往右一步步算：4+3+2 先算 4+3=7，再算 7+2=9。`,gens:['g_add20_mix']}
 ]},
 {id:'3',name:'认识立体图形',theme:'创意拼搭',color:'#C05C7E',board:'图形与几何',kps:[
   {id:'qd1a-3-1',name:'长方体、正方体、圆柱、球',card:`长方体方方正正有 6 个面；正方体每个面都一样；圆柱上下是圆、能滚动；球圆圆的、到处滚。`,gens:['g_shape1a']}
 ]},
 {id:'4',name:'11~20 各数的认识',theme:'漂亮的粘贴画',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd1a-4-1',name:'11~20 的认识与组成',card:`十几 = 1 个十和几个一：11 是 1 个十和 1 个一。20 是 2 个十。`,gens:['g_compose20']},
   {id:'qd1a-4-2',name:'十几减几（不退位）与数序',card:`10 加几就是十几：10+3=13。数序：12 前面是 11，后面是 13。`,gens:['g_add20_mix','g_nb20']}
 ]},
 {id:'5',name:'20 以内的进位加法',theme:'我爱读书',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd1a-5-1',name:'凑十法',card:`9+4：把 4 拆成 1 和 3，9+1=10，10+3=13。口诀：看大数、拆小数、凑成十、加剩数。`,gens:['g_add20_add']},
   {id:'qd1a-5-2',name:'20 以内加法应用',card:`一共多少用加法：原来 8 只小鸟，又飞来 5 只，8+5=13 只。`,gens:['g_add20_add','g_price'],app:true}
 ]},
 {id:'R',name:'总复习',theme:'我爱冰雪运动',color:'#5A5346',board:'综合',kps:[
   {id:'qd1a-R-1',name:'全册综合闯关',card:`把 20 以内数的认识、加减法、立体图形串起来练，专治学了后面忘了前面。`,gens:['g_add20_mix','g_compose20','g_shape1a','g_1to5_cmp']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'数的认识 · 20 以内加减法',units:['1','2','4','5']},
 {name:'图形与几何',color:'#3A6EA5',desc:'立体图形',units:['3']}
];

var C=window.COMMON_GEN;
var GENS={
  g_add20_add:function(u,k){return C.add20('add')(u,k)},
  g_add20_mix:function(u,k){return C.add20('mix')(u,k)},
  g_1to5_cmp:function(u,k){return C.compare(5)(u,k)},
  g_1to5_nb:function(u,k){return C.neighbor(5)(u,k)},
  g_6to10_cmp:function(u,k){return C.compare(10)(u,k)},
  g_6to10_nb:function(u,k){return C.neighbor(10)(u,k)},
  g_compose10:function(u,k){return C.compose(10)(u,k)},
  g_compose20:function(u,k){return C.compose(20)(u,k)},
  g_nb20:function(u,k){return C.neighbor(20)(u,k)},
  g_shape1a:function(u,k){return C.shapeKnow(SHAPES1A)(u,k)},
  g_price:function(u,k){return C.price()(u,k)}
};
var SHAPES1A=[{q:'冰冰凉凉、能到处滚动、没有平面的是哪种图形？',ans:'球',ops:['球','圆柱','正方体','长方体'],why:'球圆圆的，怎么滚都行，没有平平的面。'},{q:'上下两个面是圆圆的、像罐头一样立着的是？',ans:'圆柱',ops:['圆柱','球','长方体','正方体'],why:'圆柱两头是圆形，立着很稳，躺着会滚。'},{q:'每个面都是正方形、像骰子一样的是？',ans:'正方体',ops:['正方体','长方体','圆柱','球'],why:'正方体 6 个面都一样大，方方正正。'}];
var GENLVL={ g_add20_add:2, g_add20_mix:1, g_1to5_cmp:1, g_1to5_nb:1, g_6to10_cmp:1, g_6to10_nb:1, g_compose10:2, g_compose20:2, g_nb20:1, g_shape1a:1, g_price:3};

var CHEAT=[
 ['1~5 认数','数数、比大小（>、<、=）','3 > 2'],
 ['数的组成','几可以分成几和几','5 = 2 + 3'],
 ['凑十法','看大数、拆小数、凑成十、加剩数','9+4 → 9+1+3 = 13'],
 ['十几的组成','十几 = 1 个十 + 几个一','14 = 10 + 4'],
 ['立体图形','球会滚；圆柱立着稳；正方体方方正正','骰子是正方体'],
 ['比大小','先比十位，再比个位','18 > 15']
];

regBook({
  id:'qd1a',
  name:'一年级上册',
  grade:1, semester:'上',
  color:'#E8833A',
  edition:'2022课标修订版',
  intro:'1~20 数的认识与加减法、认识立体图形',
  mapFlow:'先认识 10 以内的数 → 再学 20 以内的数 → 边认数边学加减 → 认识图形',
  mapWhy:'先建立数感（数数、比大小、组成），再在数感上学加减法；图形认识穿插进行，动手拼搭帮助空间观念生长。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
