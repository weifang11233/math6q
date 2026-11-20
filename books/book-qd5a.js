/* ============================================================
   课本模块：青岛版（六三制）数学 · 五年级上册（2022课标修订版）
   目录依据：2022 课标修订版课本目录（curriculum/TOC.md）。
   出题：COMMON_GEN 参数化生成器 + 本册专属生成器，数字随机、答案现算。
   知识点 id 前缀 qd5a-，与其它课本互不冲突。
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
   {id:'qd5a-3-1',name:'小数加减混合运算',card:`小数点对齐；得数末尾的 0 可以去掉。12.5-3.68+0.2 从左往右算。`,gens:['g_decAddSub']}
 ]},
 {id:'4',name:'用字母表示数',theme:'节能减排',color:'#3A6EA5',board:'数与运算',kps:[
   {id:'qd5a-4-1',name:'字母式与含字母式子的值',card:`a×4+5 写成 4a+5。a=3 时 4a+5=17。代入求值别忘先算乘。`,gens:['g_algebra']}
 ]},
 {id:'5',name:'三角形',theme:'创意手工坊',color:'#B8860B',board:'图形与几何',kps:[
   {id:'qd5a-5-1',name:'三角形内角和与分类',card:`任意三角形内角和都是 180°。撕角拼一拼能验证。`,gens:['g_triKnow']}
 ]},
 {id:'6',name:'小数乘法',theme:'今天我当家',color:'#8E6FB8',board:'数与运算',kps:[
   {id:'qd5a-6-1',name:'小数乘整数与小数乘小数',card:`先按整数算，再看因数一共几位小数，点上几位。0.25×4=1。`,gens:['g_decMul']},
   {id:'qd5a-6-2',name:'小数乘法应用',card:`单价 2.5 元 × 8 千克 = 20 元。积的近似数按需求四舍五入。`,gens:['g_decMul','g_price'],app:true}
 ]},
 {id:'7',name:'多边形的面积',theme:'生活中的多边形',color:'#2E6B4F',board:'图形与几何',kps:[
   {id:'qd5a-7-1',name:'平行四边形与三角形面积',card:`平行四边形 = 底×高（割补成长方形）；三角形 = 底×高÷2（两个全等拼平行四边形）。`,gens:['g_areaPara','g_areaTri']},
   {id:'qd5a-7-2',name:'梯形面积',card:`梯形 =（上底+下底）×高÷2。`,gens:['g_areaTrap']}
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
  g_price:function(u,k){return C.price()(u,k)}
};

var GENLVL={ g_decIntro:1, g_decCmp:1, g_decShift:2, g_decRound:2, g_motion:1, g_decAddSub:2, g_algebra:2, g_triKnow:2, g_decMul:2, g_areaPara:2, g_areaTri:2, g_areaTrap:3, g_chartLine:1, g_price:3};

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
