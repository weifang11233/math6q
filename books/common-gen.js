/* ============================================================
   通用出题生成器库（v3.0 多课本共享，参数化）
   ------------------------------------------------------------
   window.COMMON_GEN 提供跨年级可复用的参数化生成器：
   - 口算类：整数加减乘除、表内乘除、带余除法、小数/分数运算
   - 数与认识：数的比较、填空、单位换算、估算
   - 图形类：周长面积、图形认识（参数化）
   - 应用题模板：归一/归总、和差、倍数、行程、单价数量总价等
   - 通用概念判断：一定/可能/不可能、分类、比较大小
   每个生成器签名 function(u,k)，返回 makeQ 兼容对象。
   课本模块用 makeGen 包装绑定固定参数。
   ============================================================ */
(function(){
function g(n){return Math.floor(Math.random()*n)}
function pk(a){return a[g(a.length)]}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=g(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t}return a||1}
function frac(n,d){var G=gcd(n,d);n=n/G;d=d/G;return d===1?String(n):(n+'/'+d)}

var C={};

/* —— 20 以内加减法（mode: 'add'|'sub'|'mix'）—— */
C.add20=function(mode){
  return function(u,k){
    var a,b,ans,op;
    for(;;){
      if(mode==='add'){a=1+g(19);b=1+g(20-a);op='+';ans=a+b}
      else if(mode==='sub'){a=2+g(18);b=1+g(a-1);op='−';ans=a-b}
      else{if(g(2)){a=1+g(19);b=1+g(20-a);op='+';ans=a+b}else{a=2+g(18);b=1+g(a-1);op='−';ans=a-b}}
      if(ans>=0)break;
    }
    return{q:`口算：${a} ${op} ${b} = ？`,ans:String(ans),unit:u,kp:k,
      exp:`${a} ${op} ${b} = ${ans}。`+(mode!=='add'?`想加法：${b} + ${ans} = ${a}。`:`凑十法：先把 ${a} 凑成 10 再加。`)};
  };
};
/* —— 100 以内加减法（mode: 'noCarry'|'carry'|'mix'）—— */
C.add100=function(mode){
  return function(u,k){
    var a,b,ans,op,tries=0;
    do{
      tries++;
      if(mode==='noCarry'){
        if(g(2)){op='+';a=10+g(80);b=1+g(9);if(a%10+b>9)continue;ans=a+b}
        else{op='−';a=20+g(70);b=1+g(9);if(a%10-b<0)continue;ans=a-b}
      }else{
        if(g(2)){op='+';a=10+g(80);b=10+g(80);ans=a+b;if(ans>100)continue}
        else{op='−';a=30+g(60);b=10+g(30);ans=a-b;if(ans<0)continue}
      }
      break;
    }while(tries<40);
    return{q:`计算：${a} ${op} ${b} = ？`,ans:String(ans),unit:u,kp:k,
      exp:`${a} ${op} ${b} = ${ans}。`+(op==='+'?`个位对齐，从个位算起${(a%10+b%10)>9?'，满十进一':''}。`:`个位不够减要向十位借一。`)};
  };
};
/* —— 表内乘法 —— */
C.tableMul=function(){
  return function(u,k){
    var a=1+g(9),b=1+g(9);
    return{q:`口算：${a} × ${b} = ？`,ans:String(a*b),unit:u,kp:k,
      exp:`口诀：${a===1||b===1?'一几得'+(a*b):a<b?a+' '+b+' '+a*b+'（背 '+a+' 的乘法口诀）':b+' '+a+' '+a*b+'（背 '+b+' 的乘法口诀）'}。`};
  };
};
/* —— 表内除法 —— */
C.tableDiv=function(){
  return function(u,k){
    var b=1+g(9),ans=1+g(9),a=b*ans;
    return{q:`口算：${a} ÷ ${b} = ？`,ans:String(ans),unit:u,kp:k,
      exp:`想乘法：${b} × ${ans} = ${a}，所以 ${a} ÷ ${b} = ${ans}。`};
  };
};
/* —— 有余数除法 —— */
C.divRem=function(){
  return function(u,k){
    var b=2+g(8),ans=1+g(9),r=1+g(b-1),a=b*ans+r;
    return{q:`计算：${a} ÷ ${b} = ？（填"商 余 数"，如 3 余 2）`,
      ans:ans+' 余 '+r,unit:u,kp:k,
      exp:`${b} × ${ans} = ${b*ans}，${a} − ${b*ans} = ${r}，余数 ${r} < 除数 ${b} ✓。所以 ${a} ÷ ${b} = ${ans} 余 ${r}。`};
  };
};
/* —— 数的比较（范围参数化）—— */
C.compare=function(max){
  return function(u,k){
    var a=1+g(max-1),b=1+g(max-1);
    while(a===b){b=1+g(max-1)}
    var ans=a>b?'>':(a<b?'<':'=');
    return{q:`在○里填上 ">"、"<" 或 "="：${a} ○ ${b}`,
      ops:['>','<','='],ans:ans,unit:u,kp:k,
      exp:`比大小先看位数：${a} 和 ${b} ${a>b?a+' 更大':b+' 更大'}，所以填 "${ans}"。`};
  };
};
/* —— 相邻数/组成填空 —— */
C.neighbor=function(max){
  return function(u,k){
    var n=1+g(max-2),mode=g(3);
    if(mode===0)return{q:`${n} 的后面一个数是多少？`,ans:String(n+1),unit:u,kp:k,exp:`一个一个数：${n} 后面是 ${n+1}。`};
    if(mode===1)return{q:`${n+1} 的前面一个数是多少？`,ans:String(n),unit:u,kp:k,exp:`一个一个倒着数：${n+1} 前面是 ${n}。`};
    return{q:`${n}、○、${n+2}：中间missing的数是多少？`.replace('missing','缺'),
      ans:String(n+1),unit:u,kp:k,exp:`按顺序数：${n}、${n+1}、${n+2}，中间是 ${n+1}。`};
  };
};
/* —— 数的组成（十几/几十几）—— */
C.compose=function(max){
  return function(u,k){
    var n=10+g(Math.min(max,90)-10),shi=Math.floor(n/10),ge=n%10;
    var mode=g(2);
    if(mode===0)return{q:`${n} 里面有 ${shi} 个十和 ${ge} 个一。对吗？（对/不对）`,
      ops:['对','不对'],ans:ge===0?'不对':'对',unit:u,kp:k,
      exp:ge===0?`${n} 是整十数，只有 ${shi} 个十，没有单独的"一"。`:`${shi} 个十和 ${ge} 个一合起来是 ${n} ✓。`};
    return{q:`${shi} 个十和 ${ge} 个一合起来是多少？`,ans:String(n),unit:u,kp:k,
      exp:`${shi} 个十是 ${shi*10}，再加 ${ge} 个一：${shi*10} + ${ge} = ${n}。`};
  };
};
/* —— 认识图形（概念判断，图形集参数化）—— */
C.shapeKnow=function(items){
  return function(u,k){
    var t=pk(items);
    return{q:t.q,ops:sh(t.ops),ans:t.ans,unit:u,kp:k,exp:t.exp||t.why||t.ans+' 的判断要点见课本本单元知识卡。'};
  };
};
/* —— 单位换算（t=[数值,单位A,倍率,单位B,答案]）—— */
C.unitConv=function(pool){
  return function(u,k){
    var t=pk(pool);
    return{q:`${t[0]} ${t[1]} = （　）${t[3]}（填数）`,ans:String(t[4]),unit:u,kp:k,
      exp:`1 ${t[1]} = ${t[2]} ${t[3]}，所以 ${t[0]} ${t[1]} = ${t[0]} × ${t[2]} = ${t[4]} ${t[3]}。`};
  };
};
/* —— 长方形/正方形周长面积（mode 'C'|'S'）—— */
C.rectCS=function(mode){
  return function(u,k){
    var a=2+g(18),b=2+g(18);
    if(mode==='C'){var v=2*(a+b);
      return{q:`一个长方形长 ${a} 厘米、宽 ${b} 厘米，周长是多少厘米？（填数）`,ans:String(v),unit:u,kp:k,app:1,
        exp:`长方形周长 =（长 + 宽）× 2 =（${a} + ${b}）× 2 = ${v}（厘米）。`};}
    var v=a*b;
    return{q:`一个长方形长 ${a} 厘米、宽 ${b} 厘米，面积是多少平方厘米？（填数）`,ans:String(v),unit:u,kp:k,app:1,
      exp:`长方形面积 = 长 × 宽 = ${a} × ${b} = ${v}（平方厘米）。`};
  };
};
/* —— 和差问题 / 倍数应用 —— */
C.sumDiff=function(){
  return function(u,k){
    var ans=2+g(30),diff=1+g(20),small,large;
    small=g(2)?null:null;
    var total=ans*2+ (g(2)?diff:-diff);
    if(total<2*1)total=ans*2+diff;
    large=(total+diff)/2;small=total-large;
    if(large!==Math.floor(large)||small<1){large=ans+diff;small=ans;total=large+small}
    return{q:`两个数的和是 ${total}，差是 ${diff}。较大的数是多少？（填数）`,
      ans:String(Math.max(large,small)),unit:u,kp:k,app:1,
      exp:`和差问题：大数 =（和 + 差）÷ 2 =（${total} + ${diff}）÷ 2 = ${Math.max(large,small)}；小数 =（和 − 差）÷ 2 = ${Math.min(large,small)}。`};
  };
};
/* —— 归一问题 —— */
C.normalize=function(){
  return function(u,k){
    var per=2+g(8),n=2+g(6),total=per*n;
    return{q:`${n} 个同样的笔记本一共 ${total} 元。一本多少元？（填数，单位：元）`,
      ans:String(per),unit:u,kp:k,app:1,
      exp:`归一：先求 1 份。${total} ÷ ${n} = ${per}（元）。`};
  };
};
/* —— 归总问题 —— */
C.totalFirst=function(){
  return function(u,k){
    var per=2+g(8),n1=2+g(6),total=per*n1,n2=2+g(6);
    while(n2===n1)n2=2+g(6);
    var v=total/n2;
    if(v!==Math.floor(v)){n2=1;v=total}
    return{q:`一批零件，每个盒子装 ${per} 个，装了 ${n1} 盒。如果改成每盒装 ${n2} 个，能装多少盒？（填数）`,
      ans:String(v),unit:u,kp:k,app:1,
      exp:`归总：先求总数 ${per} × ${n1} = ${total}（个）；再算 ${total} ÷ ${n2} = ${v}（盒）。`};
  };
};
/* —— 倍数应用 —— */
C.timesApp=function(){
  return function(u,k){
    var a=2+g(20),n=2+g(5),mode=g(3);
    if(mode===0)return{q:`${'鸡'}有 ${a} 只，鸭的只数是鸡的 ${n} 倍。鸭有多少只？（填数）`,
      ans:String(a*n),unit:u,kp:k,app:1,
      exp:`求一个数的几倍用乘法：${a} × ${n} = ${a*n}（只）。`};
    if(mode===1){var big=a*n;
      return{q:`鸭有 ${big} 只，是鸡的 ${n} 倍。鸡有多少只？（填数）`,
      ans:String(a),unit:u,kp:k,app:1,
      exp:`已知一个数的几倍求这个数用除法：${big} ÷ ${n} = ${a}（只）。`};}
    var c=a*(n-1);
    return{q:`鸭有 ${a*n} 只，鸡有 ${a} 只。鸭比鸡多几倍？（就是鸭是鸡的几倍减 1）（填数）`,
      ans:String(n-1),unit:u,kp:k,app:1,
      exp:`${a*n} ÷ ${a} = ${n} 倍，多几倍 = ${n} − 1 = ${n-1}。`};
  };
};
/* —— 行程（速度×时间）—— */
C.travel=function(){
  return function(u,k){
    var v=30+g(70),t=2+g(5),mode=g(2);
    if(mode===0)return{q:`一辆汽车每小时行 ${v} 千米，行了 ${t} 小时。一共行了多少千米？（填数）`,
      ans:String(v*t),unit:u,kp:k,app:1,
      exp:`路程 = 速度 × 时间 = ${v} × ${t} = ${v*t}（千米）。`};
    return{q:`一辆汽车每小时行 ${v} 千米，行了 ${v*t} 千米。行了几小时？（填数）`,
      ans:String(t),unit:u,kp:k,app:1,
      exp:`时间 = 路程 ÷ 速度 = ${v*t} ÷ ${v} = ${t}（小时）。`};
  };
};
/* —— 单价数量总价 —— */
C.price=function(){
  return function(u,k){
    var p=2+g(20),n=2+g(9),mode=g(2);
    if(mode===0)return{q:`一支钢笔 ${p} 元，买 ${n} 支要多少元？（填数）`,
      ans:String(p*n),unit:u,kp:k,app:1,
      exp:`总价 = 单价 × 数量 = ${p} × ${n} = ${p*n}（元）。`};
    return{q:`买 ${n} 支同样的钢笔花了 ${p*n} 元。一支多少元？（填数）`,
      ans:String(p),unit:u,kp:k,app:1,
      exp:`单价 = 总价 ÷ 数量 = ${p*n} ÷ ${n} = ${p}（元）。`};
  };
};
/* —— 一定/可能/不可能 —— */
C.certain=function(){
  return function(u,k){
    var t=pk([
      {box:'盒子里全是红球',ask:'摸出一个红球',ans:'一定发生',why:'只有红球，摸出来一定是红球。'},
      {box:'盒子里有 5 个红球和 3 个黄球',ask:'摸出一个黄球',ans:'可能发生',why:'有黄球就可能摸到，但不是每次都摸到。'},
      {box:'盒子里全是蓝球',ask:'摸出一个黄球',ans:'不可能发生',why:'没有黄球，怎么摸都摸不到。'},
      {box:'盒子里有 1 个红球和 9 个黄球',ask:'摸出一个红球',ans:'可能发生',why:'红球少，可能性小，但只要大于 0 就有可能。'}]);
    return{q:`${t.box}。随便摸一个球，"摸出${t.ask.replace('一个','')}这件事"会怎样？`,
      ops:sh(['一定发生','可能发生','不可能发生']),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* —— 可能性大小 —— */
C.likely=function(){
  return function(u,k){
    var r=2+g(6),y=1+g(4);
    while(r===y)y=1+g(4);
    var ans=r>y?'红球':(r<y?'黄球':'一样大');
    return{q:`盒子里有 ${r} 个红球和 ${y} 个黄球，随便摸一个。摸到哪种颜色球的可能性大？`,
      ops:sh(['红球','黄球','一样大']),ans:ans,unit:u,kp:k,
      exp:`谁数量多谁可能性大：红球 ${r} 个、黄球 ${y} 个 → ${ans}。`};
  };
};
/* —— 乘法分配/结合简算（整数）—— */
C.distrib=function(){
  return function(u,k){
    var a=2+g(8),b=2+g(8),c=2+g(40),T=a+b;
    return{q:`简便计算：${T} × ${c} = ？（提示：把 ${T} 拆成 ${a}+${b}）（填数）`,
      ans:String(T*c),unit:u,kp:k,
      exp:`乘法分配律：(${a}+${b}) × ${c} = ${a}×${c} + ${b}×${c} = ${a*c} + ${b*c} = ${T*c}。`};
  };
};
/* —— 运算律填空（交换/结合/分配识别）—— */
C.lawName=function(){
  return function(u,k){
    var t=pk([
      {q:'34 + 65 = 65 + 34 用了什么运算律？',ans:'加法交换律',why:'两个数相加，交换位置和不变。'},
      {q:'(25 + 48) + 52 = 25 + (48 + 52) 用了什么运算律？',ans:'加法结合律',why:'三个数相加，先把后两个加起来，和不变。'},
      {q:'25 × 7 × 4 = 25 × 4 × 7 用了什么运算律？',ans:'乘法交换律',why:'交换因数位置，积不变——7×4 顺手凑整。'},
      {q:'(25 × 8) × 4 = 25 × (8 × 4) 用了什么运算律？',ans:'乘法结合律',why:'先把后两个因数结合，积不变。'},
      {q:'(40 + 8) × 25 = 40 × 25 + 8 × 25 用了什么运算律？',ans:'乘法分配律',why:'和乘一个数 = 分别相乘再相加。'}]);
    return{q:t.q,ops:sh(['加法交换律','加法结合律','乘法交换律','乘法结合律','乘法分配律']),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* —— 分数初步认识（几分之一/几分之几读写与比较）—— */
C.fracIntro=function(){
  return function(u,k){
    var d=pk([2,3,4,5,6,8]),n=1+g(d-1),mode=g(3);
    if(mode===0)return{q:`把一个蛋糕平均分成 ${d} 份，每份是这个蛋糕的几分之几？（填分数，如 1/4）`,
      ans:'1/'+d,unit:u,kp:k,
      exp:`平均分成 ${d} 份，每份就是它的 ${'1/'+d}。分母表示平均分的份数，分子表示取了几份。`};
    if(mode===1)return{q:`${n}/${d} 读作？（填"几分之几"的文字）`,
      ans:n+'分之'+d,unit:u,kp:k,
      exp:`先读分母 ${d}（${['','一','二','三','四','五','六','七','八','九','十'][d]||d}分之），再读分子 ${n}。分数线上面是分子，下面是分母。`};
    var d2=pk([2,3,4,5,6,8]);
    while(d2===d)d2=pk([2,3,4,5,6,8]);
    return{q:`比大小：1/${d} ○ 1/${d2}（填 ">"、"<" 或 "="）`,
      ops:['>','<','='],ans:d<d2?'>':'<',unit:u,kp:k,
      exp:`分的份数越多，每一份越小：${d<d2?d+' < '+d2+'，所以 1/'+d+' > 1/'+d2:d+' > '+d2+'，所以 1/'+d+' < 1/'+d2}。`};
  };
};
/* —— 小数读写与比较 —— */
C.decIntro=function(mode){
  return function(u,k){
    if(mode==='cmp'){
      var a=(1+g(90))/10,b=(1+g(90))/10;
      while(a===b)b=(1+g(90))/10;
      return{q:`比大小：${a} ○ ${b}（填 ">"、"<" 或 "="）`,
        ops:['>','<','='],ans:a>b?'>':'<',unit:u,kp:k,
        exp:`先比整数部分，再比十分位：${a>b?a+' 更大':b+' 更大'}。`};
    }
    var shi=1+g(9),ge=g(10);
    var v=shi+ge/10;
    return{q:`${shi} 元 ${ge} 角 = （　）元（填小数）`,
      ans:String(v),unit:u,kp:k,
      exp:`1 角 = 0.1 元，${ge} 角 = 0.${ge} 元，合起来 ${shi} + 0.${ge} = ${v}（元）。`};
  };
};
/* —— 混合运算顺序 —— */
C.opOrder=function(){
  return function(u,k){
    var a=2+g(9),b=2+g(9),c=2+g(9),mode=g(3);
    if(mode===0){var v=a+b*c;
      return{q:`计算：${a} + ${b} × ${c} = ？（填数）`,ans:String(v),unit:u,kp:k,
        exp:`先乘除后加减：先算 ${b}×${c}=${b*c}，再算 ${a}+${b*c}=${v}。`};}
    if(mode===1){var v2=(a+b)*c;
      return{q:`计算：（${a} + ${b}）× ${c} = ？（填数）`,ans:String(v2),unit:u,kp:k,
        exp:`有括号先算括号：(${a}+${b})=${a+b}，再 ${a+b}×${c}=${v2}。`};}
    var v3=a*b-c;
    if(v3<0){a=5+g(5);b=5+g(5);v3=a*b-c}
    return{q:`计算：${a} × ${b} − ${c} = ？（填数）`,ans:String(v3),unit:u,kp:k,
      exp:`先乘后减：${a}×${b}=${a*b}，再 ${a*b}−${c}=${v3}。`};
  };
};
/* —— 观察物体（简单三视图概念）—— */
C.viewObj=function(){
  return function(u,k){
    var t=pk([
      {q:'从正面看一个魔方（正方体），看到的是什么形状？',ans:'正方形',bad:['长方形','圆','三角形'],why:'正方体每个面都是正方形，从哪个面看都是正方形。'},
      {q:'从不同方向观察同一个物体，看到的形状（　）',ans:'可能不同',bad:['一定相同','一定不同','都是圆形'],why:'站在不同位置看到的面可能不一样，所以要换着方向观察。'},
      {q:'一个圆柱形易拉罐从上面往下看，看到的是（　）',ans:'圆',bad:['长方形','三角形','正方形'],why:'圆柱的底面是圆，从上面看看到的是顶面的圆。'}]);
    return{q:t.q,ops:sh([t.ans,t.bad[0],t.bad[1]]),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* —— 条形/折线/扇形统计图概念 —— */
C.chartKnow=function(type){
  return function(u,k){
    var t={
      bar:{q:'要直观比较四个小组收集矿泉水瓶的数量，用什么统计图最合适？',ans:'条形统计图',why:'条形统计图能清楚看出数量的多少，方便比较。'},
      line:{q:'要反映一周气温的变化趋势，用什么统计图最合适？',ans:'折线统计图',why:'折线统计图能清楚看出数量的增减变化趋势。'},
      fan:{q:'要看出各项支出占总支出的百分比，用什么统计图最合适？',ans:'扇形统计图',why:'扇形统计图能清楚表示部分与整体的关系（百分比）。'},
      double:{q:'要同时比较两个班各科的平均分，用什么统计图最合适？',ans:'复式条形统计图',why:'复式统计图把两组数据画在一起，方便对比。'}
    }[type];
    /* 修：旧写法 sh([t.ans,'折线统计图','条形统计图','扇形统计图']) 在 type=bar/line/fan 时，
       答案与干扰项列表中同名的那一项重复，导致选择题出现两个完全相同的选项。
       现改为从干扰池排除答案自身后补足 3 个，保证 4 个选项互不相同。 */
    var distract=['折线统计图','条形统计图','扇形统计图','复式条形统计图','统计表']
      .filter(function(x){return x!==t.ans}).slice(0,3);
    return{q:t.q,ops:sh([t.ans].concat(distract)),ans:t.ans,unit:u,kp:k,exp:t.why};
  };
};
/* —— 平均数 —— */
C.average=function(){
  return function(u,k){
    var n=2+g(3),arr=[],sum=0;
    for(var i=0;i<n;i++){var x=60+g(40);arr.push(x);sum+=x}
    while(sum%n){arr[0]++;sum++}
    return{q:`${n} 次跳绳成绩分别是 ${arr.join('、')} 下。平均每次跳多少下？（填数）`,
      ans:String(sum/n),unit:u,kp:k,app:1,
      exp:`平均数 = 总数 ÷ 个数 = ${sum} ÷ ${n} = ${sum/n}（下）。`};
  };
};
/* —— 负数初步 —— */
C.negative=function(){
  return function(u,k){
    var mode=g(2),t=10+g(20);
    if(mode===0)return{q:`零上 ${t}℃ 记作 +${t}℃，零下 ${t}℃ 记作？（填如 -5℃ 的形式）`,
      ans:'-'+t+'℃',unit:u,kp:k,
      exp:`零上为正，零下就为负：零下 ${t}℃ 记作 −${t}℃。0℃ 是分界点。`};
    var a=-(5+g(10)),b=-(1+g(4));
    return{q:`比大小：${a} ○ ${b}（填 ">"、"<" 或 "="）`,
      ops:['>','<','='],ans:a<b?'>':'<',unit:u,kp:k,
      exp:`负数比大小，绝对值大的反而小：${a} 离 0 更远，所以 ${a} < ${b}。`};
  };
};
/* —— 方程初步（用字母表示数）—— */
C.algebra=function(){
  return function(u,k){
    var a=2+g(9),b=2+g(9),mode=g(3);
    if(mode===0)return{q:`小明今年 ${a} 岁，比小红大 ${b} 岁。小红今年几岁？用含有字母的式子表示：小明 x 岁时，小红（　）岁。（填如 x-3 的式子）`,
      ans:'x-'+b,unit:u,kp:k,
      exp:`比 x 大 ${b} 岁的反过来就是少 ${b} 岁：x − ${b}。字母式子能表示任何一年的情况。`};
    if(mode===1)return{q:`每本练习本 ${a} 元，买 x 本需要多少元？（填如 5x 的式子）`,
      ans:a+'x',unit:u,kp:k,
      exp:`总价 = 单价 × 数量 = ${a} × x，乘号省略写成 ${a}x。`};
    return{q:`一辆汽车每小时行 ${a} 千米，t 小时行多少千米？（填式子，如 60t）`,
      ans:a+'t',unit:u,kp:k,
      exp:`路程 = 速度 × 时间 = ${a} × t = ${a}t。字母与数相乘，省略乘号、数在前。`};
  };
};
/* —— 分数加减（同分母/异分母，结果最简）—— */
C.fracAddSub=function(same){
  return function(u,k){
    var a,b,c,d;
    if(same){d=pk([4,6,8,9,10,12]);a=1+g(d-2);b=1+g(d-a);c=a+b;var plus=g(2);
      if(plus)return{q:`计算：${a}/${d} + ${b}/${d} = ？（填最简分数）`,ans:frac(c,d),unit:u,kp:k,
        exp:`同分母分数相加，分母不变分子相加：${a}+${b}=${c}，得 ${c}/${d}，约分得 ${frac(c,d)}。`};
      return{q:`计算：${c}/${d} − ${a}/${d} = ？（填最简分数）`,ans:frac(b,d),unit:u,kp:k,
        exp:`同分母分数相减，分母不变分子相减：${c}−${a}=${b}，得 ${b}/${d}，约分得 ${frac(b,d)}。`};}
    d=pk([3,4,5,6]);var d2=pk([4,6,8,10]);
    var n1=1+g(d-1),n2=1+g(d2-1);
    var num=n1*d2+n2*d,den=d*d2,G=gcd(num,den);
    return{q:`计算：${n1}/${d} + ${n2}/${d2} = ？（填最简分数）`,ans:frac(num,den),unit:u,kp:k,
      exp:`异分母先通分：${n1}/${d}=${n1*d2}/${den}，${n2}/${d2}=${n2*d}/${den}；分子相加 ${n1*d2}+${n2*d}=${num}，得 ${num}/${den}，约分得 ${frac(num,den)}。`};
  };
};
/* —— 分数乘除（真分数）—— */
C.fracMulDiv=function(div){
  return function(u,k){
    var a=1+g(5),b=2+g(6),c=1+g(4),d=2+g(6);
    if(div){var num=a*d,den=b*c;
      return{q:`计算：${a}/${b} ÷ ${c}/${d} = ？（填最简分数）`,ans:frac(num,den),unit:u,kp:k,
        exp:`除以一个数等于乘它的倒数：${a}/${b} × ${d}/${c} = ${num}/${den}，约分得 ${frac(num,den)}。`};}
    var num=a*c,den=b*d;
    return{q:`计算：${a}/${b} × ${c}/${d} = ？（填最简分数）`,ans:frac(num,den),unit:u,kp:k,
      exp:`分子乘分子 ${a}×${c}=${num}，分母乘分母 ${b}×${d}=${den}，约分得 ${frac(num,den)}。`};
  };
};
/* —— 百分数互化 —— */
C.pctConv=function(){
  return function(u,k){
    var t=pk([[0.25,'25%'],[0.4,'40%'],[0.75,'75%'],[0.08,'8%'],[1.2,'120%'],[3/4,'75%'],[1/5,'20%'],[3/5,'60%']]);
    var s=t[0],disp=(typeof s==='number'&&Math.abs(s-Math.round(s))>0)?s:(typeof s==='string'?s:s);
    var qtxt,ansTxt;
    if(typeof s==='number'){qtxt=`把 ${s} 化成百分数。（填如 35% 的形式）`;ansTxt=t[1]}
    else{qtxt=`把 ${s} 化成百分数。（填如 35% 的形式）`;ansTxt=t[1]}
    return{q:qtxt,ans:ansTxt,unit:u,kp:k,
      exp:`小数化百分数：小数点右移两位加 %；分数化百分数：先化小数再化百分。${disp} → ${ansTxt}。`};
  };
};
/* —— 比与比例 —— */
C.ratio=function(){
  return function(u,k){
    var G=2+g(6),a=G*(2+g(4)),b=G*(1+g(4));
    while(a===b)b=G*(1+g(4));
    var mode=g(2);
    if(mode===0)return{q:`化简比：${a} : ${b} = ？（按 a : b 的形式填）`,
      ans:(a/G)+':'+(b/G),ratio:1,unit:u,kp:k,
      exp:`前项后项同除以最大公因数 ${G}：${a}÷${G}=${a/G}，${b}÷${G}=${b/G} → ${a/G} : ${b/G}。`};
    return{q:`求比值：${a} : ${b} = ？（填分数或整数）`,
      ans:frac(a,b),unit:u,kp:k,
      exp:`比值 = 前项 ÷ 后项 = ${a} ÷ ${b} = ${frac(a,b)}。比值是一个数，不是比。`};
  };
};
/* —— 圆/圆柱公式应用（type: 'circleC'|'circleS'|'cylV'|'coneV'）—— */
C.geoCircle=function(type){
  return function(u,k){
    var r=2+g(10),pi=3.14;
    if(type==='circleC'){var Cc=2*pi*r;
      return{q:`一个圆的半径是 ${r} 厘米，周长是多少厘米？（π 取 3.14，填数）`,
        ans:String(Math.round(Cc*100)/100),unit:u,kp:k,app:1,
        exp:`C = 2πr = 2 × 3.14 × ${r} = ${Math.round(Cc*100)/100}（厘米）。`};}
    if(type==='circleS'){var S=pi*r*r;
      return{q:`一个圆的半径是 ${r} 厘米，面积是多少平方厘米？（π 取 3.14，填数）`,
        ans:String(Math.round(S*100)/100),unit:u,kp:k,app:1,
        exp:`S = πr² = 3.14 × ${r}² = 3.14 × ${r*r} = ${Math.round(S*100)/100}（平方厘米）。`};}
    if(type==='cylV'){var h=3+g(10),V=pi*r*r*h;
      return{q:`一个圆柱底面半径 ${r} 厘米，高 ${h} 厘米，体积是多少立方厘米？（π 取 3.14，填数）`,
        ans:String(Math.round(V*100)/100),unit:u,kp:k,app:1,
        exp:`V = πr²h = 3.14 × ${r*r} × ${h} = ${Math.round(V*100)/100}（立方厘米）。先求底面积再乘高。`};}
    var h2=3+g(9),Vc=pi*r*r*h2/3;
    return{q:`一个圆锥底面半径 ${r} 厘米，高 ${h2} 厘米，体积是多少立方厘米？（π 取 3.14，填数）`,
      ans:String(Math.round(Vc*100)/100),unit:u,kp:k,app:1,
      exp:`V = (1/3)πr²h = 3.14 × ${r*r} × ${h2} ÷ 3 = ${Math.round(Vc*100)/100}（立方厘米）。圆锥体积是等底等高圆柱的三分之一。`};
  };
};
/* —— 多边形面积（type: 'tri'|'para'|'trap'）—— */
C.geoArea=function(type){
  return function(u,k){
    if(type==='tri'){var a=2+g(15),h=2+g(12),S=a*h/2;
      return{q:`一个三角形底 ${a} 厘米、高 ${h} 厘米，面积是多少平方厘米？（填数）`,
        ans:String(S),unit:u,kp:k,app:1,
        exp:`三角形面积 = 底 × 高 ÷ 2 = ${a} × ${h} ÷ 2 = ${S}（平方厘米）。`};}
    if(type==='para'){var a2=3+g(15),h2=2+g(12),S2=a2*h2;
      return{q:`一个平行四边形底 ${a2} 厘米、高 ${h2} 厘米，面积是多少平方厘米？（填数）`,
        ans:String(S2),unit:u,kp:k,app:1,
        exp:`平行四边形面积 = 底 × 高 = ${a2} × ${h2} = ${S2}（平方厘米）。`};}
    var ua=2+g(8),lb=ua+2+g(8),h3=2+g(10),S3=(ua+lb)*h3/2;
    return{q:`一个梯形上底 ${ua} 厘米、下底 ${lb} 厘米、高 ${h3} 厘米，面积是多少平方厘米？（填数）`,
      ans:String(S3),unit:u,kp:k,app:1,
      exp:`梯形面积 =（上底 + 下底）× 高 ÷ 2 =（${ua} + ${lb}）× ${h3} ÷ 2 = ${S3}（平方厘米）。`};
  };
};
/* —— 方向与位置（数对）—— */
C.coord=function(){
  return function(u,k){
    var c=1+g(6),r=1+g(5),mode=g(2);
    if(mode===0)return{q:`队列中，小明的位置在第 ${c} 列第 ${r} 行。用数对表示是？（按 a,b 的形式填，如 3,2）`,
      ans:c+','+r,unit:u,kp:k,
      exp:`数对（列，行）：竖排叫列（从左往右数），横排叫行（从前往后数）→ (${c},${r})。列在前、行在后。`};
    return{q:`小红的位置用数对表示是（${c}，${r}）。她在第几列第几行？（按"第a列第b行"填）`,
      ans:`第${c}列第${r}行`,unit:u,kp:k,
      exp:`数对（${c}，${r}）：前面的数是列 → 第 ${c} 列；后面的数是行 → 第 ${r} 行。`};
  };
};
/* —— 估算 —— */
C.estimate=function(){
  return function(u,k){
    var a=20+g(70),b=2+g(7),ra=Math.round(a/10)*10;
    return{q:`估算：${a} × ${b} ≈ ？（把 ${a} 看作整十数，填估算结果）`,
      ans:String(ra*b),unit:u,kp:k,
      exp:`把 ${a} 看作 ${ra}，${ra} × ${b} = ${ra*b}。估算是把数看成接近的整十整百数再算。`};
  };
};
/* —— 小数乘除 —— */
C.decMulDiv=function(div){
  return function(u,k){
    if(div){var d=2+g(4),q=1+g(20),p=q*d/10;
      if(p!==Math.round(p*10)/10){q=10;d=2;q=1+g(4);p=q*d/10}
      return{q:`计算：${p} ÷ ${d} = ？（填小数）`,ans:String(q/10),unit:u,kp:k,
        exp:`小数除法：${p} ÷ ${d} = ${q/10}。商的小数点要和被除数的小数点对齐。`};}
    var a=(1+g(20))/10,b=2+g(5),v=Math.round(a*b*100)/100;
    return{q:`计算：${a} × ${b} = ？（填小数）`,ans:String(v),unit:u,kp:k,
      exp:`先按整数算 ${Math.round(a*10)} × ${b} = ${Math.round(a*10)*b}，再点上一位小数点 → ${v}。`};
  };
};
/* —— 小数加减 —— */
C.decAddSub=function(){
  return function(u,k){
    var a=(10+g(800))/10,b=(1+g(90))/10,plus=g(2);
    var v=plus?Math.round((a+b)*10)/10:Math.round((a-b)*10)/10;
    if(v<0){a=(30+g(60))/10;v=Math.round((a-b)*10)/10}
    return{q:`计算：${a} ${plus?'+':'−'} ${b} = ？（填小数）`,ans:String(v),unit:u,kp:k,
      exp:`小数点对齐再算：${a} ${plus?'+':'−'} ${b} = ${v}。`};
  };
};
/* —— 时间计算 —— */
C.timeCalc=function(){
  return function(u,k){
    var h1=8+g(9),m1=g(4)*15,dur=1+g(3)*2+(g(4))*0.25;
    var mins=30+g(60);
    var total=(h1*60+m1)+mins,h2=Math.floor(total/60),m2=total%60;
    return{q:`一场电影 ${h1}:${String(m1).padStart(2,'0')} 开始放映，放映了 ${mins} 分钟。结束时是几时几分？（填如 9:30 的形式）`,
      ans:h2+':'+String(m2).padStart(2,'0'),unit:u,kp:k,
      exp:`${h1}:${String(m1).padStart(2,'0')} + ${mins} 分钟 = ${h2}:${String(m2).padStart(2,'0')}。分钟满 60 进一时。`};
  };
};

window.COMMON_GEN=C;
})();
