/* ============================================================
   课本模块：青岛版（六三制）数学 · 四年级上册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd4a-，与其它课本互不冲突。
   v3.12：新增 a4_ 专属应用题生成器 9 个（四步法用），情境贴合课本主题。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'小数的初步认识',theme:'乘车中的学问',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd4a-1-1',name:'小数的意义与读写',card:`用元角分认识小数：3 元 5 角 = 3.5 元。小数点左边是整数部分，右边是十分位。`,gens:['g_decIntro','a4_pocket']},
   {id:'qd4a-1-2',name:'小数比较大小',card:`先比整数部分，整数部分相同比十分位。0.8 > 0.7。`,gens:['g_decCmp']}
 ]},
 {id:'2',name:'长方形、正方形的面积',theme:'我家买了安居梦',color:'#2E8B8B',board:'图形与几何',kps:[
   {id:'qd4a-2-1',name:'面积与面积单位',card:`物体表面的大小是面积。1 平方厘米=指甲盖，1 平方米=4 块地砖。1 平方分米=100 平方厘米。`,gens:['g_rectS','g_areaUnit','a4_floor']},
   {id:'qd4a-2-2',name:'长方形正方形面积公式',card:`长方形面积 = 长×宽；正方形面积 = 边长×边长。`,gens:['g_rectS','a4_floor','a4_fence']}
 ]},
 {id:'3',name:'解决问题',theme:'绿色生态园',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd4a-3-1',name:'归一归总综合',card:`3 头牛一天吃 36 千克草，5 头牛一天吃多少？先归一 36÷3=12，再归总 12×5=60。`,gens:['g_normalize','g_totalFirst','a4_norm','a4_total','a4_step2']}
 ]},
 {id:'4',name:'万以上数的认识',theme:'大数知多少',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd4a-4-1',name:'亿以内数的读写',card:`四位一级：个级、万级、亿级。读数先读万级再加「万」。3080000 读作三百零八万。`,gens:['g_bigNum']},
   {id:'qd4a-4-2',name:'大数比较与改写',card:`位数多的大；位数相同从最高位比。用「万」「亿」作单位改写：120000=12 万。`,gens:['g_bigNum']}
 ]},
 {id:'5',name:'相交与平行',theme:'交通中的线',color:'#B8860B',board:'图形与几何',kps:[
   {id:'qd4a-5-1',name:'垂直与平行',card:`同一平面内不相交的两条直线互相平行；相交成直角时互相垂直。平行线间距离处处相等。`,gens:['g_paraKnow']}
 ]},
 {id:'6',name:'三位数乘两位数',theme:'保护大天鹅',color:'#8E6FB8',board:'数与运算',kps:[
   {id:'qd4a-6-1',name:'笔算与常见积的变化',card:`234×21：先算 234×1，再算 234×20，错位相加。一个因数不变，另一个扩大几倍积也扩大几倍。`,gens:['g_mul3x2','a4_mulApp']},
   {id:'qd4a-6-2',name:'速度时间路程',card:`速度×时间=路程；路程÷速度=时间。120 千米/时 行 3 小时 = 360 千米。`,gens:['g_travel','a4_speed']}
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
  g_chartBar:function(u,k){return C.chartKnow('bar')(u,k)},
  /* —— v3.12 本册专属应用题（四步法）—— */
  a4_pocket:function(u,k){
    var y=1+R(9),j=pick([1,2,5,8]),n=2+R(6),v=y*n+Math.floor(j*n/10),rest=(j*n)%10;
    return{q:`一支铅笔 ${y} 元 ${j} 角，买 ${n} 支一共多少钱？（填"X元Y角"中的 X，即整数元）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`${y} 元 ${j} 角 × ${n}：元的部分 ${y}×${n}=${y*n}，角的部分 ${j}×${n}=${j*n} 角=${Math.floor(j*n/10)} 元 ${rest} 角，合 ${v} 元 ${rest} 角。`};
  },
  a4_floor:function(u,k){
    var a=pick([4,5,6,8,9]),b=pick([3,4,5,6]),v=a*b;
    return{q:`给我家客厅铺地砖，客厅长 ${a} 米、宽 ${b} 米，面积是多少平方米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`长方形面积 = 长 × 宽 = ${a} × ${b} = ${v}（平方米）。`};
  },
  a4_fence:function(u,k){
    var a=pick([6,8,10,12,15]),b=pick([4,5,6,8]),v=(a+b)*2;
    return{q:`一块长方形菜地长 ${a} 米、宽 ${b} 米，四周围上篱笆，篱笆长多少米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`围一圈是周长 =（长 + 宽）× 2 =（${a} + ${b}）× 2 = ${v}（米）。别和面积混了！`};
  },
  a4_norm:function(u,k){
    var n=pick([3,4,5,6]),unitv=pick([8,12,15,20]),per=n*unitv,m=pick([7,8,9,10]),v=unitv*m;
    return{q:`${n} 台机器一天加工 ${per} 个零件，照这样计算，${m} 台机器一天加工多少个？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`先归一：1 台一天 ${per} ÷ ${n} = ${unitv}（个）；再求 ${m} 台：${unitv} × ${m} = ${v}（个）。`};
  },
  a4_total:function(u,k){
    var per=pick([4,6,8,10]),n1=pick([3,4,5,6]),total=per*n1,n2=pick([2,5,8]),v=total/n2;
    if(v!==Math.floor(v)){n2=per;v=n1}
    return{q:`一批树苗，每行栽 ${per} 棵，栽了 ${n1} 行。如果改成每行栽 ${n2} 棵，能栽多少行？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`先求总数：${per} × ${n1} = ${total}（棵）；再算 ${total} ÷ ${n2} = ${v}（行）。`};
  },
  a4_step2:function(u,k){
    var p=pick([12,15,18,24]),n=pick([11,12,15]),add=pick([20,30,50]),v=p*n+add;
    return{q:`生态园买了 ${n} 盆花，每盆 ${p} 元，运费 ${add} 元。一共花多少元？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`先算花的钱：${p} × ${n} = ${p*n}（元）；再加运费：${p*n} + ${add} = ${v}（元）。`};
  },
  a4_mulApp:function(u,k){
    var a=pick([112,125,148,236]),b=pick([12,15,24]),v=a*b;
    return{q:`天鹅保护区每天飞来 ${a} 只候鸟，${b} 天一共飞来多少只？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`三位数乘两位数：${a} × ${b} = ${v}（只）。先算 ${a}×${b%10}，再算 ${a}×${Math.floor(b/10)*10}，错位相加。`};
  },
  a4_speed:function(u,k){
    var v=pick([60,80,100,120]),t=pick([3,4,5,6]),s=v*t;
    if(R(2)===0)return{q:`一辆汽车每小时行 ${v} 千米，${t} 小时行了多少千米？（填数）`,
      ans:String(s),unit:u,kp:k,app:1,
      exp:`路程 = 速度 × 时间 = ${v} × ${t} = ${s}（千米）。`};
    return{q:`一辆汽车每小时行 ${v} 千米，要行 ${s} 千米，需要几小时？（填数）`,
      ans:String(t),unit:u,kp:k,app:1,
      exp:`时间 = 路程 ÷ 速度 = ${s} ÷ ${v} = ${t}（小时）。`};
  }
};
var AREA4A=[[3,'平方米',100,'平方分米',300],[5,'平方分米',100,'平方厘米',500],[2,'平方米',100,'平方分米',200],[700,'平方分米',1,'平方米',7],[900,'平方厘米',1,'平方分米',9]];
var GENLVL={ g_decIntro:1, g_decCmp:1, g_rectS:2, g_areaUnit:1, g_bigNum:2, g_paraKnow:1, g_mul3x2:3, g_travel:2, g_normalize:2, g_totalFirst:3, g_chartBar:1,
  a4_pocket:2, a4_floor:1, a4_fence:2, a4_norm:2, a4_total:3, a4_step2:3, a4_mulApp:3, a4_speed:2};

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
