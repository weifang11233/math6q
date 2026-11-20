/* ============================================================
   课本模块：青岛版（六三制）数学 · 三年级上册（2026年7月第2版（2022课标修订））
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd3a-，与其它课本互不冲突。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'毫米、分米、千米的认识',theme:'校园中的测量',color:'#E8833A',board:'图形与几何',kps:[
   {id:'qd3a-1-1',name:'毫米与分米',card:`1 厘米 = 10 毫米；1 分米 = 10 厘米。数学书厚约 8 毫米，手掌宽约 1 分米。`,gens:['g_unitLen3a']},
   {id:'qd3a-1-2',name:'千米与吨',card:`1 千米 = 1000 米，操场跑 2 圈半；1 吨 = 1000 千克，是大象、卡车的单位。`,gens:['g_unitLen3a','g_unitTon']}
 ]},
 {id:'2',name:'解决问题（总量与分量）',theme:'传承中医药文化',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd3a-2-1',name:'总量 = 分量 + 分量',card:`把总量分成几份来想：一包药 60 克，每袋 20 克，能装几袋？60÷20=3 袋。`,gens:['g_normalize']}
 ]},
 {id:'3',name:'观察物体（一）',theme:'谁的眼睛亮',color:'#C05C7E',board:'图形与几何',kps:[
   {id:'qd3a-3-1',name:'从不同方向观察物体',card:`从前面、侧面、上面看同一个物体，看到的形状可能不同。数一数看到了几个面。`,gens:['g_viewObj']}
 ]},
 {id:'4',name:'解决问题',theme:'非遗文化进校园',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd3a-4-1',name:'用估算与尝试解决问题',card:`不确定就先估算：把数看成整十整百再算，判断大约多少。`,gens:['g_estimate']}
 ]},
 {id:'5',name:'多位数乘一位数',theme:'富饶的大海',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd3a-5-1',name:'口算与笔算乘法',card:`213×3：从个位乘起，满几十向前一位进几。笔算别忘进位标记。`,gens:['g_mul1digit']},
   {id:'qd3a-5-2',name:'乘法应用',card:`每箱 24 瓶、5 箱一共几瓶：24×5=120 瓶。`,gens:['g_mul1digit','g_price'],app:true}
 ]},
 {id:'6',name:'生活中的运动现象',theme:'美丽乡村',color:'#8E6FB8',board:'图形与几何',kps:[
   {id:'qd3a-6-1',name:'平移、旋转与轴对称',card:`平移：直线滑过去（推拉窗）；旋转：绕一个点转（风车）；对折能重合的图形是轴对称（蝴蝶）。`,gens:['g_motion']}
 ]},
 {id:'7',name:'多位数除以一位数',theme:'探访果蔬博览会',color:'#2E6B4F',board:'数与运算',kps:[
   {id:'qd3a-7-1',name:'口算与笔算除法',card:`846÷2：从最高位除起，每次除得的余数要比除数小。商中间有 0 别漏写。`,gens:['g_div1digit']},
   {id:'qd3a-7-2',name:'除法应用',card:`把总数平均分用除法：368 个橘子分给 4 个班，每班 92 个。`,gens:['g_div1digit'],app:true}
 ]},
 {id:'R',name:'总复习',theme:'全册串烧',color:'#5A5346',board:'综合',kps:[
   {id:'qd3a-R-1',name:'全册综合闯关',card:`长度单位、乘除法、观察物体、运动现象一起练。`,gens:['g_unitLen3a','g_mul1digit','g_div1digit','g_viewObj','g_motion']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'多位数乘除一位数 · 解决问题',units:['2','4','5','7']},
 {name:'图形与几何',color:'#3A6EA5',desc:'长度单位 · 观察物体 · 运动现象',units:['1','3','6']}
];

var C=window.COMMON_GEN;
var GENS={
  g_unitLen3a:function(u,k){return C.unitConv(LEN3A)(u,k)},
  g_unitTon:function(u,k){return C.unitConv(TON3A)(u,k)},
  g_viewObj:function(u,k){return C.viewObj()(u,k)},
  g_estimate:function(u,k){return C.estimate()(u,k)},
  g_mul1digit:function(u,k){return C.mul1digit()(u,k)},
  g_div1digit:function(u,k){return C.div1digit()(u,k)},
  g_motion:function(u,k){return C.motionKnow()(u,k)},
  g_normalize:function(u,k){return C.normalize()(u,k)},
  g_price:function(u,k){return C.price()(u,k)}
};
var LEN3A=[[8,'厘米',10,'毫米',80],[5,'分米',10,'厘米',50],[3,'厘米',10,'毫米',30],[70,'分米',10,'厘米',700],[2,'千米',1000,'米',2000],[4000,'米',1,'千米',4],[7,'米',10,'分米',70]];
var TON3A=[[2,'吨',1000,'千克',2000],[5,'吨',1000,'千克',5000],[8000,'千克',1,'吨',8],[3000,'千克',1,'吨',3]];
var GENLVL={ g_unitLen3a:1, g_unitTon:1, g_viewObj:1, g_estimate:2, g_mul1digit:2, g_div1digit:3, g_motion:1, g_normalize:2, g_price:2};

var CHEAT=[
 ['毫米/分米','1 厘米=10 毫米；1 分米=10 厘米','橡皮厚约 8 毫米'],
 ['千米/吨','1 千米=1000 米；1 吨=1000 千克','卡车载重 5 吨'],
 ['乘法笔算','从个位乘起，满几十进几','213×3=639'],
 ['除法笔算','从最高位除起，余数比除数小','846÷2=423'],
 ['平移旋转','平移直线滑、旋转绕点转','推拉窗平移，风车旋转'],
 ['轴对称','对折两边完全重合','蝴蝶、天平都是对称的']
];

regBook({
  id:'qd3a',
  name:'三年级上册',
  grade:3, semester:'上',
  color:'#E8833A',
  edition:'2026年7月第2版（2022课标修订）',
  intro:'长度单位、多位数乘除一位数、观察物体、运动现象',
  mapFlow:'毫米分米千米 → 乘一位数 → 除一位数 → 观察物体与运动现象',
  mapWhy:'先把长度量感建全（毫米到千米）；乘除法从口算到笔算步步进阶；图形部分培养空间观察与运动眼光。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
