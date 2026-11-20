/* ============================================================
   课本模块：青岛版（六三制）数学 · 一年级下册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd1b-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'20 以内的退位减法',theme:'逛公园',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd1b-1-1',name:'十几减 9、十几减 8',card:`破十法：15-9，把 15 拆成 10 和 5，10-9=1，1+5=6。也可以想加法：9+6=15，所以 15-9=6。`,gens:['g_sub20']},
   {id:'qd1b-1-2',name:'十几减几（综合）',card:`退位减法统一套路：破十法或想加算减。13-6：10-6=4，4+3=7。`,gens:['g_sub20']},
   {id:'qd1b-1-3',name:'退位减法应用',card:`还剩多少用减法：12 个气球，飞走 5 个，12-5=7 个。`,gens:['g_sub20'],app:true}
 ]},
 {id:'2',name:'100 以内数的认识',theme:'丰收了',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd1b-2-1',name:'数数与组成',card:`几个十和几个一合起来：45 是 4 个十和 5 个一。整十数：30 是 3 个十。`,gens:['g_compose100','g_nb100']},
   {id:'qd1b-2-2',name:'100 以内数的大小比较',card:`先比十位，十位大的大；十位相同比个位。68 > 63。`,gens:['g_cmp100']},
   {id:'qd1b-2-3',name:'整十数加減整十数',card:`3 个十加 2 个十是 5 个十：30+20=50。把十当单位更好算。`,gens:['g_add100_nc']}
 ]},
 {id:'3',name:'认识平面图形',theme:'玩转图形',color:'#C05C7E',board:'图形与几何',kps:[
   {id:'qd1b-3-1',name:'长方形、正方形、三角形、圆',card:`长方形对边一样长；正方形四条边都一样；三角形 3 条边 3 个角；圆是圆圆的曲线围成的。`,gens:['g_shape2d']},
   {id:'qd1b-3-2',name:'图形拼组',card:`两个一样的正方形拼一拼能成长方形；七巧板能拼出好多图案。图形之间可以互相转化。`,gens:['g_shape2d']}
 ]},
 {id:'4',name:'100 以内的加减法（一）',theme:'护绿行动',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd1b-4-1',name:'两位数加（减）一位数',card:`45+3：先算 5+3=8，得 48；45-3：先算 5-3=2，得 42。个位算个位。`,gens:['g_add100_nc']},
   {id:'qd1b-4-2',name:'两位数加（减）整十数',card:`45+30：十位加十位 40+30=70，得 75。十位管十位。`,gens:['g_add100_nc']},
   {id:'qd1b-4-3',name:'两位数加一位数（进位）',card:`37+5：7+5=12 满 10 进一，得 42。个位满十向十位进一。`,gens:['g_add100_cr']}
 ]},
 {id:'5',name:'100 以内的加减法（二）',theme:'海趣',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd1b-5-1',name:'两位数加减两位数（笔算）',card:`相同数位对齐，从个位算起；个位满十向十位进一，个位不够减向十位借一。`,gens:['g_add100_cr','g_add100_nc']},
   {id:'qd1b-5-2',name:'应用题',card:`求一共用加法、求剩下用减法、求相差用大减小：红花 35 朵、黄花 20 朵，红花比黄花多 15 朵。`,gens:['g_add100_cr'],app:true}
 ]},
 {id:'R',name:'总复习',theme:'儿童乐园',color:'#5A5346',board:'综合',kps:[
   {id:'qd1b-R-1',name:'全册综合闯关',card:`退位减法、100 以内数、平面图形、加减法一起练。`,gens:['g_sub20','g_cmp100','g_shape2d','g_add100_cr']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'退位减法 · 100 以内数与加减法',units:['1','2','4','5']},
 {name:'图形与几何',color:'#3A6EA5',desc:'平面图形',units:['3']}
];

var C=window.COMMON_GEN;
var GENS={
  g_sub20:function(u,k){return C.sub20()(u,k)},
  g_compose100:function(u,k){return C.compose(100)(u,k)},
  g_nb100:function(u,k){return C.neighbor(100)(u,k)},
  g_cmp100:function(u,k){return C.compare(100)(u,k)},
  g_shape2d:function(u,k){return C.shapeKnow(SHAPES2D)(u,k)},
  g_add100_nc:function(u,k){return C.add100('noCarry')(u,k)},
  g_add100_cr:function(u,k){return C.add100('carry')(u,k)}
};
var SHAPES2D=[
 {q:'四个角都是直角、四条边一样长的图形是？',ans:'正方形',ops:['正方形','长方形','三角形','圆'],why:'四边相等+四个直角 = 正方形。'},
 {q:'对边相等、四个角都是直角的图形是？',ans:'长方形',ops:['长方形','正方形','三角形','圆'],why:'长方形对边一样长，正方形四条边都一样。'},
 {q:'有三条边、三个角的图形是？',ans:'三角形',ops:['三角形','长方形','圆','正方形'],why:'三角形三条边围成，稳定不易变形。'},
 {q:'由一条曲线围成、没有角的图形是？',ans:'圆',ops:['圆','三角形','正方形','长方形'],why:'圆是一条封闭曲线，没有直直的边。'}
];
function sub20(){return window.COMMON_GEN.add20('sub')}
var GENLVL={ g_sub20:2, g_compose100:2, g_nb100:1, g_cmp100:1, g_shape2d:1, g_add100_nc:1, g_add100_cr:2};

var CHEAT=[
 ['破十法','十几减几：先 10 减，再加零头','15-9 → 10-9=1，1+5=6'],
 ['想加算减','想 9 加几等于 15，减法得几','15-9=6（因 9+6=15）'],
 ['100 以内组成','几个十和几个一','45 = 4 个十 + 5 个一'],
 ['比大小','先比十位，再比个位','68 > 63'],
 ['笔算加减','数位对齐，从个位起；满十进一、不够借一','37+5 = 42'],
 ['平面图形','长方形对边相等；正方形四边相等','课本封面是长方形']
];

regBook({
  id:'qd1b',
  name:'一年级下册',
  grade:1, semester:'下',
  color:'#2E8B8B',
  edition:'2022课标修订版',
  intro:'20 以内退位减法、100 以内数的认识与加减法、平面图形',
  mapFlow:'退位减法 → 认识更大的数（100 以内）→ 平面图形 → 100 以内加减法步步升',
  mapWhy:'先用破十法打通退位减法，再把数感扩展到 100；图形从立体转到平面；加减法从两位数加减一位数到两位数加减两位数，层层递进。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
