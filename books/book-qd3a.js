/* ============================================================
   课本模块：青岛版（六三制）数学 · 三年级上册（2026年7月第2版（2022课标修订））
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd3a-，与其它课本互不冲突。
   v3.12：新增 a3_ 专属应用题生成器 10 个（四步法用），情境贴合课本主题。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'毫米、分米、千米的认识',theme:'校园中的测量',color:'#E8833A',board:'图形与几何',kps:[
   {id:'qd3a-1-1',name:'毫米与分米',card:`1 厘米 = 10 毫米；1 分米 = 10 厘米。数学书厚约 8 毫米，手掌宽约 1 分米。`,gens:['g_unitLen3a']},
   {id:'qd3a-1-2',name:'千米与吨',card:`1 千米 = 1000 米，操场跑 2 圈半；1 吨 = 1000 千克，是大象、卡车的单位。`,gens:['g_unitLen3a','g_unitTon','a3_lenApp','a3_tonApp']}
 ]},
 {id:'2',name:'解决问题（总量与分量）',theme:'传承中医药文化',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'qd3a-2-1',name:'总量 = 分量 + 分量',card:`把总量分成几份来想：一包药 60 克，每袋 20 克，能装几袋？60÷20=3 袋。`,gens:['g_normalize','a3_totalPart']}
 ]},
 {id:'3',name:'观察物体（一）',theme:'谁的眼睛亮',color:'#C05C7E',board:'图形与几何',kps:[
   {id:'qd3a-3-1',name:'从不同方向观察物体',card:`从前面、侧面、上面看同一个物体，看到的形状可能不同。数一数看到了几个面。`,gens:['g_viewObj']}
 ]},
 {id:'4',name:'解决问题',theme:'非遗文化进校园',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd3a-4-1',name:'用估算与尝试解决问题',card:`不确定就先估算：把数看成整十整百再算，判断大约多少。`,gens:['g_estimate','a3_estApp','a3_step2']}
 ]},
 {id:'5',name:'多位数乘一位数',theme:'富饶的大海',color:'#B8860B',board:'数与运算',kps:[
   {id:'qd3a-5-1',name:'口算与笔算乘法',card:`213×3：从个位乘起，满几十向前一位进几。笔算别忘进位标记。`,gens:['g_mul1digit']},
   {id:'qd3a-5-2',name:'乘法应用',card:`每箱 24 瓶、5 箱一共几瓶：24×5=120 瓶。`,gens:['g_mul1digit','g_price','a3_mulPack','a3_mulMoney']}
 ]},
 {id:'6',name:'生活中的运动现象',theme:'美丽乡村',color:'#8E6FB8',board:'图形与几何',kps:[
   {id:'qd3a-6-1',name:'平移、旋转与轴对称',card:`平移：直线滑过去（推拉窗）；旋转：绕一个点转（风车）；对折能重合的图形是轴对称（蝴蝶）。`,gens:['g_motion']}
 ]},
 {id:'7',name:'多位数除以一位数',theme:'探访果蔬博览会',color:'#2E6B4F',board:'数与运算',kps:[
   {id:'qd3a-7-1',name:'口算与笔算除法',card:`846÷2：从最高位除起，每次除得的余数要比除数小。商中间有 0 别漏写。`,gens:['g_div1digit']},
   {id:'qd3a-7-2',name:'除法应用',card:`把总数平均分用除法：368 个橘子分给 4 个班，每班 92 个。`,gens:['g_div1digit','a3_divShare','a3_divGroup','a3_times']}
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
  g_price:function(u,k){return C.price()(u,k)},
  /* —— v3.12 本册专属应用题（四步法）—— */
  a3_totalPart:function(u,k){
    var a=pick([20,30,40,50,60]),b=pick([10,15,20,25]),v=a+b;
    return{q:`中药房有蒲公英 ${a} 克，金银花 ${b} 克，一共多少克？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`总量 = 分量 + 分量：${a} + ${b} = ${v}（克）。（课本"传承中医药文化"主题）`};
  },
  a3_mulPack:function(u,k){
    var a=pick([12,24,36,48,15,25,32]),b=2+R(8),v=a*b;
    return{q:`每盒装 ${a} 支毛笔，${b} 盒一共装多少支？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`求几个相同加数的和用乘法：${a} × ${b} = ${v}（支）。`};
  },
  a3_divShare:function(u,k){
    var b=pick([2,3,4,5,6,8]),q=pick([12,15,20,24,30,36,40]),v=b*q;
    return{q:`把 ${v} 个苹果平均分给 ${b} 个班，每班分到多少个？（填数）`,
      ans:String(q),unit:u,kp:k,app:1,
      exp:`平均分用除法：${v} ÷ ${b} = ${q}（个）。`};
  },
  a3_mulMoney:function(u,k){
    var p=pick([6,8,12,15,18,24]),n=2+R(7),v=p*n;
    return{q:`一本非遗画册 ${p} 元，买 ${n} 本要花多少元？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`单价 × 数量 = 总价：${p} × ${n} = ${v}（元）。`};
  },
  a3_times:function(u,k){
    var a=pick([8,12,15,20,24]),n=pick([2,3,4,5]),v=a*n;
    if(R(2)===0)return{q:`果园有梨树 ${a} 棵，苹果树的棵数是梨树的 ${n} 倍。苹果树有多少棵？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`求一个数的几倍用乘法：${a} × ${n} = ${v}（棵）。`};
    return{q:`灯笼有 ${v} 个，是福字的 ${n} 倍。福字有多少个？（填数）`,
      ans:String(a),unit:u,kp:k,app:1,
      exp:`已知几倍求原数用除法：${v} ÷ ${n} = ${a}（个）。`};
  },
  a3_lenApp:function(u,k){
    var m=pick([2,3,4,5,6]),cm=pick([20,30,40,50]),v=m*100+cm;
    return{q:`一根彩带长 ${m} 米 ${cm} 厘米，合多少厘米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`1 米 = 100 厘米：${m} 米 = ${m*100} 厘米，再加 ${cm} 厘米 = ${v} 厘米。`};
  },
  a3_tonApp:function(u,k){
    var t=pick([2,3,4,5,8]),kg=pick([100,200,300,500]),v=t*1000+kg;
    return{q:`一辆货车载重 ${t} 吨 ${kg} 千克，合多少千克？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`1 吨 = 1000 千克：${t} 吨 = ${t*1000} 千克，再加 ${kg} 千克 = ${v} 千克。`};
  },
  a3_estApp:function(u,k){
    var p=pick([48,52,39,61,71]),n=pick([4,5,6]),r=Math.round(p/10)*10;
    return{q:`每箱草莓 ${p} 元，估算时把 ${p} 看成整十数 ${r}，买 ${n} 箱大约需要多少元？（填整十数估算结果）`,
      ans:String(r*n),unit:u,kp:k,app:1,
      exp:`估算：把 ${p} 看成 ${r}，${r} × ${n} = ${r*n}（元）。实际是 ${p*n} 元，估算用来快速判断够不够。`};
  },
  a3_divGroup:function(u,k){
    var per=pick([4,5,6,8]),n=2+R(6),extra=1+R(per-1),v=per*n+extra;
    return{q:`${v} 名同学去研学，每 ${per} 人分一组，最多能分满几组？（填数）`,
      ans:String(n),unit:u,kp:k,app:1,
      exp:`${v} ÷ ${per} = ${n}（组）…… ${extra}（人）。问"分满几组"，商就是 ${n}。`};
  },
  a3_step2:function(u,k){
    var p=pick([12,15,18,24]),n=2+R(4),add=pick([10,20,30]),v=p*n+add;
    return{q:`买 ${n} 个风筝，每个 ${p} 元，另外付运费 ${add} 元。一共要付多少元？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`先算风筝钱：${p} × ${n} = ${p*n}（元）；再加运费：${p*n} + ${add} = ${v}（元）。`};
  }
};
var LEN3A=[[8,'厘米',10,'毫米',80],[5,'分米',10,'厘米',50],[3,'厘米',10,'毫米',30],[70,'分米',10,'厘米',700],[2,'千米',1000,'米',2000],[4000,'米',1,'千米',4],[7,'米',10,'分米',70]];
var TON3A=[[2,'吨',1000,'千克',2000],[5,'吨',1000,'千克',5000],[8000,'千克',1,'吨',8],[3000,'千克',1,'吨',3]];
var GENLVL={ g_unitLen3a:1, g_unitTon:1, g_viewObj:1, g_estimate:2, g_mul1digit:2, g_div1digit:3, g_motion:1, g_normalize:2, g_price:2,
  a3_totalPart:1, a3_mulPack:1, a3_divShare:1, a3_mulMoney:2, a3_times:2, a3_lenApp:2, a3_tonApp:2, a3_estApp:3, a3_divGroup:3, a3_step2:3};

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
