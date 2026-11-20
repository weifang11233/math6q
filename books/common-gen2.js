/* ============================================================
   通用生成器库 · 第二批（v3.0.1，common-gen.js 之后加载）
   各年级课本模块引用的补充生成器。
   ============================================================ */
(function(){
function g(n){return Math.floor(Math.random()*n)}
function pk(a){return a[g(a.length)]}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=g(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t}return a||1}
function frac(n,d){var G=gcd(n,d);n=n/G;d=d/G;return d===1?String(n):(n+'/'+d)}
var C=window.COMMON_GEN;

/* 十几减几（退位减法） */
C.sub20=function(){
  return function(u,k){
    var a=11+g(9),b=2+g(8);
    while(a-b<1||a<=10){b=2+g(8);if(a-b>=1&&a>10)break}
    return{q:'计算：'+a+' − '+b+' = ？（20 以内退位减法）',ans:String(a-b),unit:u,kp:k,
      exp:'破十法：把 '+a+' 拆成 10 和 '+(a-10)+'，10−'+b+'='+(10-b)+'，'+(10-b)+'+'+(a-10)+'='+(a-b)+'。也可以想加法：'+b+'+'+(a-b)+'='+a+'。'};
  };
};
/* 进一法租船类 */
C.ceilDiv=function(){
  return function(u,k){
    var b=4+g(4),ans=3+g(5),r=1+g(b-1),a=b*ans+r;
    return{q:a+' 名同学去划船，每条船最多坐 '+b+' 人。全部坐下至少要几条船？（填数）',
      ans:String(ans+1),unit:u,kp:k,app:1,
      exp:a+' ÷ '+b+' = '+ans+' 余 '+r+'。余下的 '+r+' 人也要坐船，所以要 '+ans+'+1='+(ans+1)+' 条船（进一法）。'};
  };
};
/* 三位数加减法 */
C.add3digit=function(){
  return function(u,k){
    var a=100+g(800),b=100+g(700),plus=g(2);
    var v=plus?a+b:a-b;
    while(v<0){a=300+g(600);v=a-b}
    return{q:'计算：'+a+' '+(plus?'+':'−')+' '+b+' = ？（填数）',ans:String(v),unit:u,kp:k,
      exp:'数位对齐从个位算起：'+a+' '+(plus?'+':'−')+' '+b+' = '+v+'。'+(plus?'哪一位满十向前一位进一。':'哪一位不够减向前一位借一。')};
  };
};
/* 两步计算应用题 */
C.twoStep=function(){
  return function(u,k){
    var per=3+g(8),n=2+g(6),pay=per*n+10+g(40);
    return{q:'买了 '+n+' 盒彩笔，每盒 '+per+' 元，付了 '+pay+' 元。应找回多少元？（填数）',
      ans:String(pay-per*n),unit:u,kp:k,app:1,
      exp:'先算花了多少：'+per+' × '+n+' = '+(per*n)+'（元）；再算找回：'+pay+' − '+(per*n)+' = '+(pay-per*n)+'（元）。'};
  };
};
/* 多位数乘一位数 */
C.mul1digit=function(){
  return function(u,k){
    var a=100+g(800),b=2+g(8),v=a*b;
    return{q:'计算：'+a+' × '+b+' = ？（填数）',ans:String(v),unit:u,kp:k,
      exp:'从个位乘起，满几十向前一位进几：'+a+' × '+b+' = '+v+'。'};
  };
};
/* 多位数除以一位数 */
C.div1digit=function(){
  return function(u,k){
    var b=2+g(7),q=100+g(300),a=b*q;
    return{q:'计算：'+a+' ÷ '+b+' = ？（填数）',ans:String(q),unit:u,kp:k,
      exp:'从最高位除起，每次余数要比除数小：'+a+' ÷ '+b+' = '+q+'。验算：'+q+' × '+b+' = '+a+' ✓。'};
  };
};
/* 两位数乘两位数 */
C.mul2x2=function(){
  return function(u,k){
    var a=11+g(80),b=11+g(80),v=a*b;
    return{q:'计算：'+a+' × '+b+' = ？（填数）',ans:String(v),unit:u,kp:k,
      exp:'先算 '+a+'×'+(b%10)+'='+(a*(b%10))+'，再算 '+a+'×'+(Math.floor(b/10)*10)+'='+(a*Math.floor(b/10)*10)+'，错位相加 = '+v+'。'};
  };
};
/* 三位数乘两位数 */
C.mul3x2=function(){
  return function(u,k){
    var a=100+g(800),b=11+g(80),v=a*b;
    return{q:'计算：'+a+' × '+b+' = ？（填数）',ans:String(v),unit:u,kp:k,
      exp:'先算 '+a+'×'+(b%10)+'='+(a*(b%10))+'，再算 '+a+'×'+(Math.floor(b/10)*10)+'='+(a*Math.floor(b/10)*10)+'，错位相加 = '+v+'。'};
  };
};
/* 大数读写改写 */
C.bigNum=function(){
  return function(u,k){
    var wan=1+g(9000),mode=g(2);
    var num=wan*10000;
    if(mode===0)return{q:num+' 改写成用「万」作单位的数是多少？（填如 12 万）',
      ans:wan+' 万',unit:u,kp:k,
      exp:'个级去掉 4 个 0，写上「万」字：'+num+' = '+wan+' 万。'};
    return{q:wan+' 万写成原来的数是多少？（填数字）',
      ans:String(num),unit:u,kp:k,
      exp:'万级 × 10000：'+wan+' 万 = '+wan+' × 10000 = '+num+'。'};
  };
};
/* 角的认识 */
C.angleKnow=function(){
  return function(u,k){
    var t=pk([
      {q:'直角是多少度？',ans:'90°',bad:['180°','360°','45°'],why:'方方正正 90°，三角板上那个最大的角。'},
      {q:'比直角小、尖尖的角叫？',ans:'锐角',bad:['钝角','平角','周角'],why:'比直角小是锐角，比直角大比平角小是钝角。'},
      {q:'一条射线绕端点转半圈（180°）形成的角叫？',ans:'平角',bad:['周角','直角','锐角'],why:'180° 是平角，转满一圈 360° 是周角。'},
      {q:'角的大小与边的长短（　）',ans:'无关',bad:['有关','成正比','成反比'],why:'角的大小只看两边张开的程度，边画多长都行。'}]);
    return{q:t.q,ops:sh([t.ans,t.bad[0],t.bad[1],t.bad[2]]),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* 三角形知识 */
C.triKnow=function(){
  return function(u,k){
    var t=pk([
      {q:'三角形内角和是多少度？',ans:'180°',bad:['90°','360°','270°'],why:'任意三角形撕下三个角拼一拼，正好拼成一个平角 180°。'},
      {q:'三条边 3、4、9 能围成三角形吗？',ans:'不能',bad:['能','不确定','刚好能'],why:'3+4=7 < 9，两边之和小于第三边，围不起来。'},
      {q:'两条边一样长的三角形叫？',ans:'等腰三角形',bad:['等边三角形','直角三角形','锐角三角形'],why:'两条边相等是等腰；三条都相等是等边（特殊的等腰）。'},
      {q:'三角形具有什么特性？',ans:'稳定性',bad:['不稳定性','对称性','灵活性'],why:'三角形三边确定形状就定了——自行车架、屋顶架都利用它。'}]);
    return{q:t.q,ops:sh([t.ans,t.bad[0],t.bad[1],t.bad[2]]),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* 小数点移动 */
C.decShift=function(){
  return function(u,k){
    var a=(1+g(900))/10,dir=g(2);
    if(dir===0)return{q:'把 '+a+' 的小数点向右移动一位，结果是多少？（填数）',
      ans:String(a*10),unit:u,kp:k,
      exp:'右移一位扩大 10 倍：'+a+' × 10 = '+(a*10)+'。'};
    return{q:'把 '+a+' 的小数点向左移动一位，结果是多少？（填数）',
      ans:String(a/10),unit:u,kp:k,
      exp:'左移一位缩小 10 倍：'+a+' ÷ 10 = '+(a/10)+'。'};
  };
};
/* 小数近似数 */
C.decRound=function(){
  return function(u,k){
    var a=(100+g(890))/100;
    var r1=Math.round(a*10)/10;
    return{q:'把 '+a+' 四舍五入保留一位小数是多少？（填数）',
      ans:String(r1),unit:u,kp:k,
      exp:'看百分位：'+a+' 的百分位是 '+(Math.floor(a*100)%10)+'，'+((Math.floor(a*100)%10>=5)?'满 5 进一':'不满 5 舍去')+' → '+r1+'。'};
  };
};
/* 运动现象 */
C.motionKnow=function(){
  return function(u,k){
    var t=pk([
      {q:'推拉窗左右滑动，属于什么运动现象？',ans:'平移',bad:['旋转','轴对称','折叠'],why:'物体沿直线移动、方向不变叫平移。'},
      {q:'风车叶片绕中心转动，属于什么现象？',ans:'旋转',bad:['平移','轴对称','折叠'],why:'绕一个点或轴转动叫旋转。'},
      {q:'蝴蝶翅膀左右对折能完全重合，它是？',ans:'轴对称图形',bad:['平移图形','旋转图形','圆柱'],why:'对折后两边完全重合的图形是轴对称图形，折痕是对称轴。'}]);
    return{q:t.q,ops:sh([t.ans,t.bad[0],t.bad[1],t.bad[2]]),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* 垂直平行 */
C.paraKnow=function(){
  return function(u,k){
    var t=pk([
      {q:'同一平面内，永不相交的两条直线互相（　）',ans:'平行',bad:['垂直','相交','重合'],why:'不相交 = 平行。铁轨、直尺的对边都是平行的。'},
      {q:'两条直线相交成直角，就说它们互相（　）',ans:'垂直',bad:['平行','重合','对称'],why:'相交成 90° 叫垂直，交点是垂足。'},
      {q:'从直线外一点到这条直线，画的所有线段里最短的是？',ans:'垂直线段',bad:['斜线段','平行线段','任意线段'],why:'点到直线的距离 = 垂直线段的长度，垂线段最短。'}]);
    return{q:t.q,ops:sh([t.ans,t.bad[0],t.bad[1],t.bad[2]]),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* 分数的意义 */
C.fracMean=function(){
  return function(u,k){
    var d=pk([4,5,6,8]),n=1+g(d-1);
    return{q:n+'/'+d+' 里有几个 1/'+d+'？（填数）',
      ans:String(n),unit:u,kp:k,
      exp:'1/'+d+' 是分数单位，'+n+'/'+d+' 就是 '+n+' 个 1/'+d+'。分子是几就有几个分数单位。'};
  };
};
/* 分数比较 */
C.fracCmp=function(){
  return function(u,k){
    var d=pk([4,6,8,10]),n1=1+g(d-1),n2=1+g(d-1);
    while(n1===n2)n2=1+g(d-1);
    return{q:'比大小：'+n1+'/'+d+' ○ '+n2+'/'+d+'（填 ">"、"<" 或 "="）',
      ops:['>','<','='],ans:n1>n2?'>':'<',unit:u,kp:k,
      exp:'分母相同，分子大的分数大：'+n1+' '+(n1>n2?'>':'<')+' '+n2+'。'};
  };
};
/* 长方体正方体 */
C.cuboid=function(){
  return function(u,k){
    var a=2+g(8),b=2+g(8),h=2+g(8),V=a*b*h;
    return{q:'一个长方体长 '+a+' 厘米、宽 '+b+' 厘米、高 '+h+' 厘米，体积是多少立方厘米？（填数）',
      ans:String(V),unit:u,kp:k,app:1,
      exp:'长方体体积 = 长 × 宽 × 高 = '+a+' × '+b+' × '+h+' = '+V+'（立方厘米）。'};
  };
};
/* 折扣 */
C.discount=function(){
  return function(u,k){
    var orig=(10+g(40))*10,off=pk([7,8,9]),now=orig*off/10;
    /* 修：折扣中文名必须与计算比例一致。now=orig*off/10 即现价是原价的 off*10%（打 off 折），
       旧代码 cn[10-off] 把「打七折」写成「打三折」，题面与标准答案 100% 矛盾，学生按题意作答必被判错。 */
    var cn=['','一','二','三','四','五','六','七','八','九'][off];
    return{q:'一件外套原价 '+orig+' 元，现在打'+cn+'折。现价多少元？（填数）',
      ans:String(now),unit:u,kp:k,app:1,
      exp:'打'+cn+'折 = 现价是原价的 '+(off*10)+'%：'+orig+' × '+(off*10)+'% = '+now+'（元）。'};
  };
};
/* 利息 */
C.interest=function(){
  return function(u,k){
    var P=pk([10000,20000,50000]),rate=pk([2,3]),t=2+g(2);
    var I=P*rate/100*t;
    return{q:'把 '+P+' 元存入银行，年利率 '+rate+'%，存 '+t+' 年。到期利息多少元？（填数）',
      ans:String(I),unit:u,kp:k,app:1,
      exp:'利息 = 本金 × 利率 × 存期 = '+P+' × '+rate+'% × '+t+' = '+I+'（元）。'};
  };
};
/* 圆柱表面积 */
C.cylSA=function(){
  return function(u,k){
    var r=1+g(5),h=3+g(10),pi=3.14;
    var side=2*pi*r*h,two=2*pi*r*r,S=side+two;
    return{q:'一个圆柱底面半径 '+r+' 厘米，高 '+h+' 厘米，表面积是多少平方厘米？（π 取 3.14，填数）',
      ans:String(Math.round(S*100)/100),unit:u,kp:k,app:1,
      exp:'侧面积 = 2πrh = '+(Math.round(side*100)/100)+'；两个底面 = 2πr² = '+(Math.round(two*100)/100)+'；表面积 = '+(Math.round(S*100)/100)+'（平方厘米）。'};
  };
};
/* 比例的意义与解比例 */
C.proportion=function(){
  return function(u,k){
    var a=1+g(6),b=2+g(6),k2=2+g(3),c=a*k2,d=b*k2;
    var mode=g(2);
    if(mode===0)return{q:'判断：'+a+' : '+b+' 和 '+c+' : '+d+' 能组成比例吗？（能/不能）',
      ops:['能','不能'],ans:'能',unit:u,kp:k,
      exp:a+'/'+b+' = '+frac(a,b)+'，'+c+'/'+d+' = '+frac(c,d)+'，比值相等 → 能组成比例：'+a+':'+b+'='+c+':'+d+'。'};
    var num=a*d,den=b;
    var ans=den!==0&&num%den===0?String(num/den):frac(num,den);
    return{q:'解比例：'+a+' : '+b+' = x : '+d+'。x = ？（填数或最简分数）',
      ans:ans,unit:u,kp:k,
      exp:'比例的基本性质：内项积 = 外项积 → '+b+' × x = '+a+' × '+d+' → x = '+(a*d)+' ÷ '+b+' = '+ans+'。'};
  };
};
/* 正反比例判断 */
C.propRel=function(){
  return function(u,k){
    var t=pk([
      {q:'速度一定，路程和时间成什么比例？',ans:'正比例',bad:['反比例','不成比例','无关'],why:'路程÷时间=速度（一定），比值一定 → 正比例。'},
      {q:'路程一定，速度和时间成什么比例？',ans:'反比例',bad:['正比例','不成比例','无关'],why:'速度×时间=路程（一定），乘积一定 → 反比例。'},
      {q:'单价一定，总价和数量成什么比例？',ans:'正比例',bad:['反比例','不成比例','无关'],why:'总价÷数量=单价（一定），比值一定 → 正比例。'},
      {q:'一个人的年龄和身高成比例吗？',ans:'不成比例',bad:['正比例','反比例','既是正也是反'],why:'年龄和身高的比值、乘积都不一定，所以不成比例。'}]);
    return{q:t.q,ops:sh([t.ans,t.bad[0],t.bad[1],t.bad[2]]),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* 比例尺 */
C.scaleMap=function(){
  return function(u,k){
    var cm=pk([2,3,4,5]),scale=pk([100,1000,50000]);
    var real=cm*scale;
    if(scale>=1000){
      var m=real/100;
      return{q:'一幅地图的比例尺是 1:'+scale+'，图上 '+cm+' 厘米表示实际多少米？（填数）',
        ans:String(m),unit:u,kp:k,app:1,
        exp:'实际距离 = 图上距离 × 比例尺分母：'+cm+' × '+scale+' = '+real+' 厘米 = '+m+' 米。'};
    }
    return{q:'一幅图的比例尺是 1:'+scale+'，图上 '+cm+' 厘米表示实际多少厘米？（填数）',
      ans:String(real),unit:u,kp:k,app:1,
      exp:'实际距离 = 图上距离 × 比例尺分母：'+cm+' × '+scale+' = '+real+'（厘米）。'};
  };
};

window.COMMON_GEN=C;
})();
