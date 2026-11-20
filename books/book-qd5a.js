/* ============================================================
   课本模块：青岛版（六三制）数学 · 五年级上册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd5a-，与其它课本互不冲突。
   v3.12：新增 a5_ 专属应用题生成器 10 个（四步法用），情境贴合课本主题。
   ============================================================ */
(function(){
var UNITS=[
 {id:'1',name:'小数的意义与性质',theme:'校园小农场',color:'#E8833A',board:'数与运算',kps:[
   {id:'qd5a-1-1',name:'小数的意义与计数单位',card:`0.01 是 1/100。小数末尾添 0 去 0 大小不变（小数的基本性质）：0.3 = 0.30。`,gens:['g_decIntro','g_decCmp']},
   {id:'qd5a-1-2',name:'小数点移动与近似数',card:`右移扩大、左移缩小。四舍五入取近似数：3.47≈3.5（保留一位小数）。`,gens:['g_decShift','g_decRound']}
 ]},
 {id:'2',name:'图形的运动',theme:'图案美',color:'#2E8B8B',board:'图形与几何',kps:[
   {id:'qd5a-2-1',name:'轴对称、平移、旋转',card:`轴对称图形对折重合；平移只挪位置不转向；旋转绕点转角度。风车转 90° 是旋转。`,gens:['g_motion']}
 ]},
 {id:'3',name:'小数加减法',theme:'校园体育节',color:'#C05C7E',board:'数与运算',kps:[
   {id:'qd5a-3-1',name:'小数加减混合运算',card:`小数点对齐；得数末尾的 0 可以去掉。12.5-3.68+0.2 从左往右算。`,gens:['g_decAddSub','a5_change','a5_add']}
 ]},
 {id:'4',name:'用字母表示数',theme:'节能减排',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd5a-4-1',name:'字母式与含字母式子的值',card:`a×4+5 写成 4a+5。a=3 时 4a+5=17。代入求值别忘先算乘。`,gens:['g_algebra','a5_algApp']}
 ]},
 {id:'5',name:'三角形',theme:'创意手工坊',color:'#B8860B',board:'图形与几何',kps:[
   {id:'qd5a-5-1',name:'三角形内角和与分类',card:`任意三角形内角和都是 180°。撕角拼一拼能验证。`,gens:['g_triKnow','a5_triAngle']}
 ]},
 {id:'6',name:'小数乘法',theme:'今天我当家',color:'#8E6FB8',board:'数与运算',kps:[
   {id:'qd5a-6-1',name:'小数乘整数与小数乘小数',card:`先按整数算，再看因数一共几位小数，点上几位。0.25×4=1。`,gens:['g_decMul']},
   {id:'qd5a-6-2',name:'小数乘法应用',card:`单价 2.5 元 × 8 千克 = 20 元。积的近似数按需求四舍五入。`,gens:['g_decMul','g_price','a5_buy','a5_step2']}
 ]},
 {id:'7',name:'多边形的面积',theme:'生活中的多边形',color:'#2E6B4F',board:'图形与几何',kps:[
   {id:'qd5a-7-1',name:'平行四边形与三角形面积',card:`平行四边形 = 底×高（割补成长方形）；三角形 = 底×高÷2（两个全等拼平行四边形）。`,gens:['g_areaPara','g_areaTri','a5_paraArea','a5_triArea']},
   {id:'qd5a-7-2',name:'梯形面积',card:`梯形 =（上底+下底）×高÷2。`,gens:['g_areaTrap','a5_trapArea','a5_comb']}
 ]},
 {id:'8',name:'折线统计图',theme:'绿色家园',color:'#5C5346',board:'统计与概率',kps:[
   {id:'qd5a-8-1',name:'折线统计图',card:`点表示数量，线表示变化：升=变多、降=变少、陡=变化大。看趋势用它。`,gens:['g_chartLine']}
 ]},
 {id:'R',name:'总复习',theme:'全册串烧',color:'#5A5346',board:'综合',kps:[
   {id:'qd5a-R-1',name:'全册综合闯关',card:`小数四则、字母式、三角形、多边形面积、折线图一起练。`,gens:['g_decMul','g_decAddSub','g_areaTri','g_areaTrap','g_chartLine']}
 ]}
];

var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'小数意义与四则 · 字母表示数',units:['1','3','4','6']},
 {name:'图形与几何',color:'#3A6EA5',desc:'图形运动 · 三角形 · 多边形面积',units:['2','5','7']},
 {name:'统计与概率',color:'#8E6FB8',desc:'折线统计图',units:['8']}
];

var C=window.COMMON_GEN;
var GENS={
  g_decIntro:function(u,k){return C.decIntro()(u,k)},
  g_decCmp:function(u,k){return C.decIntro('cmp')(u,k)},
  g_decShift:function(u,k){return C.decShift()(u,k)},
  g_decRound:function(u,k){return C.decRound()(u,k)},
  g_motion:function(u,k){return C.motionKnow()(u,k)},
  g_decAddSub:function(u,k){return C.decAddSub()(u,k)},
  g_algebra:function(u,k){return C.algebra()(u,k)},
  g_triKnow:function(u,k){return C.triKnow()(u,k)},
  g_decMul:function(u,k){return C.decMulDiv(false)(u,k)},
  g_areaPara:function(u,k){return C.geoArea('para')(u,k)},
  g_areaTri:function(u,k){return C.geoArea('tri')(u,k)},
  g_areaTrap:function(u,k){return C.geoArea('trap')(u,k)},
  g_chartLine:function(u,k){return C.chartKnow('line')(u,k)},
  g_price:function(u,k){return C.price()(u,k)},
  /* —— v3.12 本册专属应用题（四步法）—— */
  a5_buy:function(u,k){
    var p=pick([15,25,35,45,55]),n=2+R(9),jiao=p*n,yuan=Math.floor(jiao/10),jr=jiao%10;
    var ans=jr===0?String(yuan):(yuan+'.'+jr);
    return{q:`今天我当家：苹果每千克 ${p/10} 元，买 ${n} 千克一共多少元？（填小数）`,
      ans:ans,unit:u,kp:k,app:1,
      exp:`小数乘整数：先按整数算 ${p} × ${n} = ${jiao}（角），再化成元 = ${ans}（元）。`};
  },
  a5_change:function(u,k){
    var cost=pick([125,238,356,425]),pay=500,back=pay-cost,yuan=Math.floor(back/10),jr=back%10;
    var ans=jr===0?String(yuan):(yuan+'.'+jr);
    return{q:`体育节买运动饮料花了 ${cost/10} 元，付了 50 元，应找回多少元？（填小数）`,
      ans:ans,unit:u,kp:k,app:1,
      exp:`付的钱 − 花的钱 = ${pay/10} − ${cost/10} = ${ans}（元）。小数点对齐再相减。`};
  },
  a5_add:function(u,k){
    var a=pick([125,238,356]),b=pick([45,68,125]),v=a+b,yuan=Math.floor(v/10),jr=v%10;
    var ans=jr===0?String(yuan):(yuan+'.'+jr);
    return{q:`小农场买菜苗用了 ${a/10} 元，买肥料用了 ${b/10} 元，一共用了多少元？（填小数）`,
      ans:ans,unit:u,kp:k,app:1,
      exp:`${a/10} + ${b/10} = ${ans}（元）。把角先加起来 ${a} + ${b} = ${v} 角，再化成元。`};
  },
  a5_algApp:function(u,k){
    var a=pick([3,4,5,6,8]),per=pick([4,5,6,8]),v=a*per;
    return{q:`教室里有 a 排桌子，每排 ${per} 张，一共 ${per}a 张。当 a=${a} 时，一共有多少张桌子？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`把 a=${a} 代入 ${per}a：${per} × ${a} = ${v}（张）。字母式求值先算乘。`};
  },
  a5_triAngle:function(u,k){
    var a=pick([30,40,50,60,70,80]),b=pick([30,40,50,60]);
    if(a+b>=170)b=30;
    var c=180-a-b;
    return{q:`手工课做一个三角形，已量得两个角分别是 ${a}° 和 ${b}°，第三个角是多少度？（填数）`,
      ans:String(c),unit:u,kp:k,app:1,
      exp:`三角形内角和 180°：180 − ${a} − ${b} = ${c}（度）。`};
  },
  a5_paraArea:function(u,k){
    var a=pick([6,8,10,12,15]),h=pick([4,5,6,8]),v=a*h;
    return{q:`一块平行四边形花坛，底 ${a} 米、高 ${h} 米，面积是多少平方米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`平行四边形面积 = 底 × 高 = ${a} × ${h} = ${v}（平方米）。`};
  },
  a5_triArea:function(u,k){
    var a=pick([6,8,10,12,16]),h=pick([4,5,6,8]),v=a*h/2;
    return{q:`一块三角形菜地，底 ${a} 米、高 ${h} 米，面积是多少平方米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`三角形面积 = 底 × 高 ÷ 2 = ${a} × ${h} ÷ 2 = ${v}（平方米）。两个全等三角形才拼成平行四边形，所以要 ÷2。`};
  },
  a5_trapArea:function(u,k){
    var up=pick([3,4,5,6]),down=pick([7,8,9,10]),h=pick([4,6,8]),v=(up+down)*h/2;
    return{q:`一个梯形水塘，上底 ${up} 米、下底 ${down} 米、高 ${h} 米，面积是多少平方米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`梯形面积 =（上底 + 下底）× 高 ÷ 2 =（${up} + ${down}）× ${h} ÷ 2 = ${v}（平方米）。`};
  },
  a5_step2:function(u,k){
    var p=pick([25,35,45]),n=pick([2,3,4,5]),jiao=p*n,gift=200,total=jiao+gift,yuan=Math.floor(total/10),jr=total%10;
    var ans=jr===0?String(yuan):(yuan+'.'+jr);
    return{q:`买 ${n} 千克排骨，每千克 ${p/10} 元，又买了一盒 20 元的鸡蛋。一共多少元？（填小数）`,
      ans:ans,unit:u,kp:k,app:1,
      exp:`排骨 ${p/10} × ${n} = ${jiao/10}（元），加鸡蛋 20 元 = ${ans}（元）。先乘后加。`};
  },
  a5_comb:function(u,k){
    var a=pick([8,10,12]),b=pick([5,6,8]),h=pick([4,6]),tri=a*h/2,v=a*b+tri;
    return{q:`一个组合图形：下面长方形长 ${a} 米、宽 ${b} 米，上面接一个底 ${a} 米、高 ${h} 米的三角形。总面积是多少平方米？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`长方形 ${a}×${b}=${a*b}，三角形 ${a}×${h}÷2=${tri}，合计 ${a*b}+${tri}=${v}（平方米）。拆成两个基本图形算。`};
  }
};
var GENLVL={ g_decIntro:1, g_decCmp:1, g_decShift:2, g_decRound:2, g_motion:1, g_decAddSub:2, g_algebra:2, g_triKnow:2, g_decMul:2, g_areaPara:2, g_areaTri:2, g_areaTrap:3, g_chartLine:1, g_price:3,
  a5_buy:1, a5_change:1, a5_add:1, a5_algApp:2, a5_triAngle:2, a5_paraArea:1, a5_triArea:2, a5_trapArea:2, a5_step2:2, a5_comb:3};

var CHEAT=[
 ['小数性质','末尾添 0 去 0 大小不变','0.3 = 0.30'],
 ['小数点移动','右移一位扩 10 倍','3.5 → 35'],
 ['近似数','四舍五入看下一位','3.47 ≈ 3.5'],
 ['小数乘法','整数算完点小数点（位数=因数小数位和）','0.25×4=1'],
 ['平行四边形面积','底 × 高','底6高4 → 24'],
 ['三角形面积','底 × 高 ÷ 2','底6高4 → 12'],
 ['梯形面积','（上底+下底）×高 ÷ 2','(3+5)×4÷2=16'],
 ['折线统计图','看变化趋势','气温走势图']
];

regBook({
  id:'qd5a',
  name:'五年级上册',
  grade:5, semester:'上',
  color:'#E8833A',
  edition:'2022课标修订版',
  intro:'小数意义性质、小数乘除、字母表示数、三角形、多边形面积',
  mapFlow:'小数意义 → 图形运动 → 小数加减 → 字母 → 三角形 → 小数乘法 → 多边形面积 → 折线统计',
  mapWhy:'小数体系全面展开；图形从认识走向面积计算；字母表示数衔接方程；折线统计图看变化趋势。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
