/* ============================================================
   课本模块：青岛版（六三制）数学 · 六年级上册（qd6a）
   由 v2.4.6 单书版完整迁入，题目生成器与知识卡保持原样；
   单元 id 转为字符串以适配多课本架构。知识点 id（1-1…8-1）
   与旧版完全一致——老用户的点亮/错题/统计进度无缝保留。
   ============================================================ */
(function(){
/* ───────── 教材结构（青岛版六三制六上 · 2026 年 7 月第 1 版课本目录逐字对齐）───────── */
var UNITS=[
 {id:'1',name:'分数乘法',theme:'小手艺展示',color:'#E8833A',board:'数与运算',kps:[
   {id:'1-1',name:'分数乘整数',card:`<p><b>意思</b>：分数乘整数，就是求<b>几个相同加数的和</b>（课本信息窗 1：编中国结）。</p>
     <div class="exbox">例：编一个小中国结用 2/3 小时，编 4 个要几小时？<br>2/3 × 4 = 2×4/3 = <b>8/3（小时）</b></div>
     <p><b>怎么算</b>：分子乘整数，分母不变；能约分的先约分再乘，更省力。</p>
     <div class="exambox">⚠ 易错：只乘分子、忘约分。口诀：<b>"乘分子、不变母，先约分、再相乘"</b>。</div>`,gens:['f1_int','f1_int_app','f1_int_money','f1_unit_conv','f1_compare_size']},
   {id:'1-2',name:'一个数乘分数（求一个数的几分之几）',card:`<p><b>意思</b>：求一个数的几分之几是多少，用<b>乘法</b>（课本信息窗 2：做拉花，求 8 米的 1/2、3/4）。</p>
     <div class="exbox">例：每小时做 8 米拉花，1/2 小时做多少？就是求 8 的 1/2：<br>8 × 1/2 = <b>4（米）</b></div>
     <p><b>算法</b>：分子乘分子，分母乘分母；先约分再乘不容易错。乘真分数会<b>越乘越小</b>。</p>`,gens:['f1_ff','f1_ff_err','f1_milk_half','f1_of','f1_class_boys','f1_school_hours']},
   {id:'1-3',name:'连续求一个数的几分之几',card:`<p><b>意思</b>：连续求"一个数的几分之几的几分之几"，用<b>连乘</b>（课本信息窗 3：陶艺大赛三组连乘）。</p>
     <div class="exbox">例：一共 96 件作品，二组做总数的 1/3，三组做二组的 5/8，三组做多少件？<br>96 × 1/3 × 5/8 = <b>20（件）</b></div>
     <p><b>关键</b>：画线段图理清"谁是谁的几分之几"，一步一算。</p>`,gens:['f1_of_chain','f1_triple_chain','f1_more_less','f1_steel_left','f1_rect_diff'],app:true}
 ]},
 {id:'2',name:'分数除法',theme:'走进乡村看小康',color:'#2E8B8B',board:'数与运算',kps:[
   {id:'2-1',name:'倒数',card:`<p><b>定义</b>：乘积是 1 的两个数互为倒数（课本：2/3 和 3/2 互为倒数）。</p>
     <div class="exbox">3/5 的倒数是 <b>5/3</b>；7 的倒数是 <b>1/7</b>。</div>
     <div class="exambox">⚠ 两个易错点：1 的倒数是它自己（1）；<b>0 没有倒数</b>。</div>`,gens:['f3_recip']},
   {id:'2-2',name:'分数除以整数 · 一个数除以分数',card:`<p><b>一句话</b>：甲数除以乙数（0 除外），等于甲数乘乙数的<b>倒数</b>（课本信息窗：收割机 2/3 小时收割 5/8 公顷）。</p>
     <div class="exbox">例：5/8 ÷ 2/3 = 5/8 × 3/2 = <b>15/16</b></div>
     <p><b>道理</b>：把被除数、除数同乘除数的倒数，商不变——和商不变的规律一脉相承。</p>`,gens:['f3_div','f3_paper_share','f3_milk_cups','f3_solve_equation','f3_div_err']},
   {id:'2-3',name:'已知一个数的几分之几是多少，求这个数',card:`<p><b>意思</b>：单位 1 未知，用<b>除法</b>或列方程（课本：双休日游客 280 人，占总人数的 2/5，求总人数）。</p>
     <div class="exbox">例：280 ÷ 2/5 = 280 × 5/2 = <b>700（人）</b></div>
     <p><b>检验</b>：用乘法代回去——700 × 2/5 = 280 ✓（课本就是这样教检验的）</p>`,gens:['f3_find_whole','f3_daily_read','f3_print_time','f3_rope_total','f3_bucket','f3_read_remain','f3_price_drop','f3_train_trip','f3_tunnel_two','f3_paper_stack','f3_swim_run'],app:true}
 ]},
 {id:'3',name:'比',theme:'劳动实践长学问',color:'#C05C7E',board:'数与运算',kps:[
   {id:'3-1',name:'比的意义与比值',card:`<p><b>比</b>：两个数量的倍数关系可以用比来表示（课本信息窗：氮肥兑水 1:500、走路 320:4）。</p>
     <div class="exbox">例：320 米走了 4 分钟，路程与时间的比 320 : 4，比值 = 320÷4 = <b>80（米/分）</b></div>
     <p><b>比值</b> = 前项 ÷ 后项，可以是分数或小数。比的后项不能是 0。</p>`,gens:['f4_value']},
   {id:'3-2',name:'比的基本性质与化简比',card:`<p><b>性质</b>：比的前项和后项同时乘或除以相同的数（0 除外），比值不变。</p>
     <div class="exbox">12 : 18 → 同除以 6 → <b>2 : 3</b>；化简 1.25 : 0.4 → 同乘 100 → 125:40 → <b>25 : 8</b></div>
     <div class="exambox">⚠ 化简比结果是<b>比</b>，求比值结果是<b>数</b>。别混！</div>`,gens:['f4_simplify','f4_prop_err','f4_work_ratio','f4_speed_time_ratio','f4_granary_ratio','f4_move_equal','f4_alcohol_mix']},
   {id:'3-3',name:'按比例分配',card:`<p><b>方法</b>：先求总份数，再算每份是多少，最后乘各自的份数（课本：菜园 50 平方米按 2:3 种黄瓜茄子）。</p>
     <div class="exbox">例：总面积 50 平方米按 2 : 3，总份数 5，每份 10，黄瓜 <b>20</b>、茄子 <b>30</b> 平方米。</div>`,gens:['f4_share','f4_share_app','f4_sugar_water','f4_salt_water','f4_class_ratio','f4_concrete'],app:true}
 ]},
 {id:'4',name:'圆',theme:'完美的图形',color:'#3A6EA5',board:'图形与几何',kps:[
   {id:'4-1',name:'圆的认识 · 扇形',card:`<p><b>三兄弟</b>：圆心 O（定位置）、半径 r、直径 d。同一个圆里 d = 2r，半径直径都有无数条且相等。</p>
     <p><b>墨子说</b>："圆，一中同长也。"圆是轴对称图形，有<b>无数条</b>对称轴（每条直径所在直线）。</p>
     <p><b>扇形</b>：一条弧和经过这条弧两端的两条半径围成的图形；顶点在圆心的角叫圆心角。</p>`,gens:['f5_rd','f5_concept']},
   {id:'4-2',name:'圆的周长',card:`<p><b>圆周率</b>：圆的周长与直径的比值是固定的数，叫圆周率 π = 3.1415926…，计算取 3.14（课本：祈年殿底层周长）。</p>
     <div class="exbox">C = πd = 2πr。例：直径 32 米，周长 = 32 × 3.14 = <b>100.48（米）</b></div>
     <div class="exambox">⚠ 半圆周长 = πr + 2r（一条弧 + 一条直径），别只算弧！</div>`,gens:['f5_c','f5_halfc','f5_fountain','f5_roll','f5_compass','f5_rope_wrap','f5_max_circle_sq','f5_bike_ride','f5_tree_interval'],app:true},
   {id:'4-3',name:'圆的面积 · 环形',card:`<p><b>公式</b>：S = πr²。把圆平均分成若干小扇形，拼成近似长方形推出来的（课本：神舟返回舱降落范围）。</p>
     <div class="exbox">例：r = 10 km，S = 3.14 × 10² = <b>314（平方千米）</b></div>
     <p><b>环形</b>：求环形的面积，用<b>外圆面积减内圆面积</b>：π(R² − r²)（课本：环形桌面）。</p>`,gens:['f5_s','f5_ring','f5_grass','f5_ring_path'],app:true}
 ]},
 {id:'5',name:'解决问题',theme:'中国的世界遗产',color:'#B8860B',board:'数与运算',kps:[
   {id:'5-1',name:'稍复杂的分数乘法问题',card:`<p><b>意思</b>：求<b>比一个数多（少）几分之几</b>的数是多少（课本信息窗：现代女子比"北京人"女子高 1/8）。</p>
     <div class="exbox">例："北京人"女子身高 144 cm，现代女子比她高 1/8：<br>144 × (1 + 1/8) = 144 × 9/8 = <b>162（cm）</b></div>
     <p><b>两法</b>：先求多的部分再加（144+144×1/8）；或先算分率再乘（144×9/8）。</p>`,gens:['f6_order','f6_remain_frac','f6_multi','f6_two_days']},
   {id:'5-2',name:'较复杂的分数除法问题',card:`<p><b>意思</b>：已知"比一个数多（少）几分之几"的数，求这个数——单位 1 未知，除法或方程（课本：颐和园、布达拉宫）。</p>
     <div class="exbox">例：昆明湖 225 公顷，万寿山是颐和园的 1/4：<br>225 ÷ (1 − 1/4) = 225 ÷ 3/4 = <b>300（公顷）</b></div>
     <div class="exambox">⚠ 布达拉宫型："东西长 360 m，比南北长多 1/5" → 南北 = 360 ÷ (1 + 1/5) = <b>300（m）</b>。多 1/5 是分率 +1。</div>`,gens:['f6_price_mix','f6_budget','f6_return_trip','f6_cargo_three','f6_duck_chicken','f6_class_move'],app:true}
 ]},
 {id:'6',name:'可能性',theme:'抽奖转盘',color:'#8E6FB8',board:'统计与概率',kps:[
   {id:'6-1',name:'确定事件与不确定事件',card:`<p><b>判断三句话</b>（课本：商场抽奖转盘——每个区域都有奖，"一定会中奖"是确定事件，中几等奖是不确定事件）：</p>
     <p>🟢 全是红球 → 摸出红球<b>一定</b>发生；🟡 有红有黄 → <b>可能</b>发生；🔴 没有黄球 → <b>不可能</b>发生。</p>
     <div class="exambox">⚠ "可能性小"不等于"不可能"，只要数量大于 0 就有可能！</div>`,gens:['f2_certain','f2_coin_fair','f2_two_draw','f2_paint_design']},
   {id:'6-2',name:'可能性的大小',card:`<p><b>规律</b>：区域（数量）越大，可能性越大；相等就一样大。可以根据可能性的大小<b>做决策</b>（课本：三等奖区域占 4/8 最大）。</p>
     <div class="exbox">转盘 8 份：三等奖 4 份、二等奖 3 份、一等奖 1 份 → 抽到三等奖可能性最大。</div>
     <p>可能性还能用分数表示：份数 ÷ 总份数。设计转盘/放球就调比例。</p>`,gens:['f2_size','f2_score','f2_turntable','f2_dice','f2_cards','f2_expect','f2_experiment','f2_spinner_mini'],app:true}
 ]},
 {id:'7',name:'方向与位置',theme:'走进军营',color:'#2E6B4F',board:'图形与几何',kps:[
   {id:'7-1',name:'用数对确定位置',card:`<p><b>数对</b>（列，行）：竖排叫<b>列</b>（从左向右数），横排叫<b>行</b>（从前往后数）。课本：王强在第 3 列第 2 行 → 数对（3，2）。</p>
     <div class="exbox">（3，2）= 第 3 列第 2 行。<b>前面的数表示列，后面的数表示行</b>，别写反！</div>
     <div class="exambox">⚠ 笛卡儿发明坐标系的故事在课本"文化广角"里。</div>`,gens:['f7_coord','f7_coord_move']},
   {id:'7-2',name:'方向与距离确定位置',card:`<p><b>两要素</b>：方向 + 距离。课本：红军阵地在指挥部的<b>北偏西 40° 方向 10 千米</b>处。</p>
     <p><b>三步</b>：①定观测点 ②量角度（以南北为基准说"北偏X/南偏X"）③量图上距离按比例尺换算。</p>
     <div class="exambox">⚠ 只说方向（无数个点）或只说距离（一圈的点）都不能定位置，缺一不可。</div>`,gens:['f7_direction','f7_direction_read']},
   {id:'7-3',name:'描述并绘制行走路线',card:`<p><b>怎么走</b>：从起点出发，按"方向 + 距离"一段一段说（课本：从指挥部先向北偏东 50° 方向走 20 千米到达蓝军阵地，再……）。</p>
     <div class="exbox">每段都要说清：从哪出发、往什么方向（偏多少度）、走多远、到了哪。</div>`,gens:['f7_route']}
 ]},
 {id:'8',name:'回顾整理 · 总复习',theme:'全册串烧',color:'#5A5346',board:'综合',kps:[
   {id:'8-1',name:'全册综合闯关',card:`<p>把课本七个单元的知识串起来练：分数乘除、比、圆、解决问题、可能性、方向与位置一起上，专治"学后面忘前面"。</p>`,gens:['rev_mix']}
 ]}
];


/* 板块视图 */
var BOARDS=[
 {name:'数与运算',color:'#E8833A',desc:'分数乘除 · 比 · 解决问题',units:[1,2,3,5]},
 {name:'图形与几何',color:'#3A6EA5',desc:'圆 · 方向与位置',units:[4,7]},
 {name:'统计与概率',color:'#8E6FB8',desc:'可能性 · 可能性的大小',units:[6]}
];


/* ───────── 出题生成器（全部原创）─────────────────────────
   每个生成器返回：
   {q:题干, ops:[选项](选择题) 或 ans:答案(填空), exp:解析,
    ratio?:按比作答, pct?:按百分数作答, app?:应用题, unit:单元id, kp:知识点id} */
var GENS={

/* —— 第一单元 分数乘法 —— */
f1_int:function(u,k){
  var d=pick([2,3,4,6,8]),n=1+R(d-1),c=pick([2,3,4,5,6]);
  return{q:`计算：${n}/${d} × ${c} = ？（填最简分数）`,ans:frac(n*c,d),unit:u,kp:k,
    exp:`分子乘整数：${n}×${c}=${n*c}，分母 ${d} 不变 → ${n*c}/${d}，约分得 ${frac(n*c,d)}。口诀：乘分子、不变母，先约分再相乘。`};
},
f1_int_app:function(u,k){
  var d=pick([4,5,8]),n=1+R(d-1),c=pick([3,4,6]);
  var v=frac(n*c,d);
  return{q:`一根彩绳每段长 ${n}/${d} 米，剪这样的 ${c} 段，一共多少米？（填数，单位已给）`,
    ans:v,unit:u,kp:k,app:1,
    exp:`求 ${c} 个 ${n}/${d} 米是多少，用乘法：${n}/${d}×${c}=${v}（米）。`};
},
f1_ff:function(u,k){
  var a=pick([1,2,3]),b=pick([2,3,4,5]),c=pick([1,2]),dd=pick([3,4,5,6,7,9]);
  if(gcd(a*c,b*dd)===a*c&&a*c!==1&&b*dd!==1){c=c}
  return{q:`计算：${a}/${b} × ${c}/${dd} = ？（填最简分数）`,ans:frac(a*c,b*dd),unit:u,kp:k,
    exp:`分子乘分子 ${a}×${c}=${a*c}，分母乘分母 ${b}×${dd}=${b*dd} → ${a*c}/${b*dd}，约分得 ${frac(a*c,b*dd)}。`};
},
f1_ff_err:function(u,k){
  var dd=pick([2,4,8]);
  var good='1/'+(dd*dd),bad='1/'+(dd*dd*dd);
  return{q:`易错提醒题：1/${dd} × 1/${dd} = ？（填最简分数）`,ans:good,unit:u,kp:k,
    ops:shuffle([good,bad,'1/'+(dd*dd+dd)]),
    exp:`分子乘分子 1×1=1，分母乘分母 ${dd}×${dd}=${dd*dd}，得 ${good}。分母是乘出来的，别再翻倍！`};
},
f1_of:function(u,k){
  var d=pick([3,4,6]),n=1,parts=[[84,3],[60,4],[90,6],[120,6],[72,3]];
  var p=pick(parts),W=p[0],dd=p[1],nn=pick([1,2,5]);
  var v=W*nn/dd;
  return{q:`果园里有 ${W} 棵苹果树，梨树的棵数是苹果树的 ${nn}/${dd}。梨树有多少棵？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`求一个数的几分之几用乘法：${W}×${nn}/${dd}=${v}（棵）。先找准单位 1——"苹果树"是单位 1。`};
},
f1_of_chain:function(u,k){
  /* v3.3.3：答案一律最简分数（原来 2/3×1/3 组合会产生 53.33… 小数） */
  var W=pick([240,360,480]),a=pick([2,3]),b=pick([3,4,5]),c=1,dd=pick([2,3]);
  var v=frac(W*a*c,b*dd);
  return{q:`一本书共 ${W} 页，第一周读了全书的 ${a}/${b}，第二周读的页数是第一周的 ${c}/${dd}。第二周读了多少页？（填最简分数或整数）`,
    ans:v,unit:u,kp:k,app:1,
    exp:`先求第一周：${W}×${a}/${b}=${W*a/b}（页）；再求第二周：${W*a/b}×${c}/${dd}=${W*a*c}/${b*dd}，约分得 ${v}（页）。连续求几分之几，一步一算。`};
},
f1_int_money:function(u,k){
  var d=pick([2,5]),n=1+R(d-1);
  var c=(d===2)?pick([4,6,8,10]):pick([5,10]);
  return{q:`一本手工册 ${n}/${d} 元，买 ${c} 本一共多少元？（填数）`,
    ans:String(n*c/d),unit:u,kp:k,app:1,
    exp:`单价×数量：${n}/${d}×${c}=${n*c/d}（元）。分数乘整数，分子乘 c，分母不变。`};
},
f1_milk_half:function(u,k){
  var d=pick([4,5]),n=1+R(d-1),q=pick([2,4]),p=1;
  return{q:`一盒牛奶 ${n}/${d} 升，喝了它的 ${p}/${q}，喝了多少升？（填最简分数，单位：升）`,
    ans:frac(n*p,d*q),unit:u,kp:k,app:1,
    exp:`求一个数的几分之几用乘法：${n}/${d}×${p}/${q}=${frac(n*p,d*q)}（升）。`};
},
f1_class_boys:function(u,k){
  var pairs=[[20,3,5],[20,2,5],[30,3,5],[30,4,5],[36,3,4],[40,3,5],[40,3,4],[30,5,6]];
  var t=pick(pairs),total=t[0],p=t[1],q=t[2],boys=total*p/q;
  return{q:`六（1）班共有 ${total} 人，男生占全班人数的 ${p}/${q}。男生有多少人？（填数）`,
    ans:String(boys),unit:u,kp:k,app:1,
    exp:`求一个数的几分之几用乘法：${total}×${p}/${q}=${boys}（人）。女生则有 ${total}−${boys}=${total-boys}（人）。`};
},
f1_school_hours:function(u,k){
  var t=pick([[1,3,8],[3,8,9],[1,4,6],[5,8,15],[1,2,12]]);
  return{q:`一天有 24 小时，小星在校时间占全天的 ${t[0]}/${t[1]}。小星在校多少小时？（填数）`,
    ans:String(t[2]),unit:u,kp:k,app:1,
    exp:`24×${t[0]}/${t[1]}=${t[2]}（小时）。找准单位 1——"全天 24 小时"是单位 1。`};
},
f1_road2:function(u,k){
  var c=pick([4,5]),a=c*pick([40,60,80]),b=pick([2,3]),day2=a*b/c;
  return{q:`修路队第一天修了 ${a} 米，第二天修的是第一天的 ${b}/${c}。两天一共修了多少米？（填数）`,
    ans:String(a+day2),unit:u,kp:k,app:1,
    exp:`先求第二天：${a}×${b}/${c}=${day2}（米）；再相加：${a}+${day2}=${a+day2}（米）。`};
},

/* —— 第二单元 可能性 —— */
f2_certain:function(u,k){
  var t=pick([
    {box:'盒子里全是红球',ask:'摸出一个红球',ans:'一定发生',why:'盒子里只有红球，闭着眼也肯定是红球。'},
    {box:'盒子里有 5 个红球和 3 个黄球',ask:'摸出一个黄球',ans:'可能发生',why:'有黄球就可能摸到，但红球多，不一定会摸到黄球。'},
    {box:'盒子里全是蓝球',ask:'摸出一个黄球',ans:'不可能发生',why:'根本没有黄球，怎么摸都摸不到。'},
    {box:'盒子里有 1 个红球和 9 个黄球',ask:'摸出一个红球',ans:'可能发生',why:'只有 1 个红球，可能性很小，但不是 0！小 ≠ 不可能。'}]);
  return{q:`${t.box}。随便摸一个球，"摸出${t.ask.replace('一个','')}这件事"会怎样？`,
    ops:shuffle(['一定发生','可能发生','不可能发生']),ans:t.ans,unit:u,kp:k,
    exp:t.why};
},
f2_size:function(u,k){
  var r=2+R(6),y=1+R(4),max=r===y?null:(r>y?'红球':'黄球');
  return{q:`盒子里有 ${r} 个红球和 ${y} 个黄球，随便摸一个。摸到哪种颜色球的可能性大？`,
    ops:shuffle(['红球','黄球','一样大']),ans:max||'一样大',unit:u,kp:k,
    exp:`谁数量多谁可能性大：红球 ${r} 个、黄球 ${y} 个，所以摸到${max||'两种球的可能性一样大'}${max?'的可能性大':''}。`};
},
f2_score:function(u,k){
  var total=pick([6,8,10]),red=0,yel=0;
  red=pick([2,3,4]);yel=total-red;
  var v=frac(red,total);
  return{q:`盒子里有 ${red} 个红球和 ${yel} 个黄球，随便摸一个。摸到红球的可能性是几分之几？（填最简分数）`,
    ans:v,unit:u,kp:k,app:1,
    exp:`可能性 = 红球数 ÷ 总球数 = ${red}/${total}，约分得 ${v}。`};
},
f2_turntable:function(u,k){
  var n=pick([4,6,8,10]),a=1+R(n-1);
  return{q:`一个转盘平均分成 ${n} 份，其中红色占 ${a} 份。转到红色的可能性是几分之几？（填最简分数）`,
    ans:frac(a,n),unit:u,kp:k,app:1,
    exp:`可能性 = 红色份数 ÷ 总份数 = ${a}/${n}，约分得 ${frac(a,n)}。`};
},
f2_dice:function(u,k){
  var t=pick([['大于 4 的点数',2,'1/3'],['单数（1、3、5）',3,'1/2'],['小于 3 的点数',2,'1/3'],['恰好是 6 点',1,'1/6'],['双数（2、4、6）',3,'1/2']]);
  return{q:`掷一个骰子（六个面分别是 1～6 点）。掷出"${t[0]}"的可能性是几分之几？（填最简分数）`,
    ans:t[2],unit:u,kp:k,app:1,
    exp:`骰子共有 6 种等可能结果，满足"${t[0]}"的有 ${t[1]} 种 → ${t[1]}/6，约分得 ${t[2]}。`};
},
f2_cards:function(u,k){
  var t=pick([['2 的倍数',10,'1/2'],['5 的倍数',4,'1/5'],['3 的倍数',6,'3/10'],['4 的倍数',5,'1/4']]);
  return{q:`写着 1～20 的 20 张卡片背面朝上，随便抽一张。抽到"${t[0]}"的卡片的可能性是几分之几？（填最简分数）`,
    ans:t[2],unit:u,kp:k,app:1,
    exp:`1～20 中"${t[0]}"有 ${t[1]} 张 → ${t[1]}/20，约分得 ${t[2]}。`};
},
f2_expect:function(u,k){
  var t=pick([[1,2,3,30,10],[2,1,3,60,40],[1,3,4,40,10],[3,1,4,40,30],[1,5,6,60,10],[5,1,6,30,25]]);
  return{q:`盒子里有 ${t[0]} 个红球和 ${t[1]} 个黄球（除颜色外都相同），搅匀后每次摸出一个、放回再摸。像这样摸 ${t[3]} 次，大约能摸到红球多少次？（填数）`,
    ans:String(t[4]),unit:u,kp:k,app:1,
    exp:`摸到红球的可能性是 ${t[0]}/${t[0]+t[1]}（约分），${t[3]}×${t[0]}/${t[0]+t[1]}=${t[4]}（次）。"大约"是估算，实际次数会上下浮动。`};
},
f2_experiment:function(u,k){
  var t=pick([[1,3,20,5],[1,4,40,8],[3,5,20,12],[2,3,30,12],[1,2,50,25],[3,7,20,6]]);
  return{q:`盒子里有 ${t[0]} 个红球和 ${t[1]} 个黄球（除颜色外都相同）。小明每次摸出一个球，记录颜色后放回搅匀，共摸了 ${t[2]} 次，摸到红球大约多少次？（填数）`,
    ans:String(t[3]),unit:u,kp:k,app:1,
    exp:`摸到红球的可能性 = ${t[0]}/${t[0]+t[1]}，${t[2]} × ${t[0]}/${t[0]+t[1]} = ${t[3]}（次）。实验次数越多，实际统计结果越接近这个数。`};
},

/* —— 第三单元 分数除法 —— */
f3_recip:function(u,k){
  var a=pick([2,3,4,5]),b=pick([3,4,5,7,8]);
  return{q:`${a}/${b} 的倒数是多少？（填分数）`,ans:frac(b,a),unit:u,kp:k,
    exp:`互为倒数的两个数乘积是 1：${a}/${b} × ${b}/${a} = 1，所以倒数是 ${b}/${a}。分子分母换位置就行。`};
},
f3_div:function(u,k){
  var b=pick([2,3,4,5]),a=1+R(b-1),cc=pick([1,2,3]),dd=pick([2,3,4,5]);
  var v=frac(a*dd,b*cc);
  return{q:`计算：${a}/${b} ÷ ${cc}/${dd} = ？（填最简分数或整数）`,ans:v,unit:u,kp:k,
    exp:`除以一个数等于乘它的倒数：${a}/${b} ÷ ${cc}/${dd} = ${a}/${b} × ${dd}/${cc} = ${a*dd}/${b*cc}，约分得 ${v}。`};
},
f3_find_whole:function(u,k){
  /* v3.3.2 修复：n=d 时分数约分成 1（截图 bug"纪录片的 1。"），n 必须 < d 且 n≥2，保证真分数且有意义 */
  var d=pick([3,4,5]),n=pick([2,3]);
  if(n>=d){n=d-1}
  var whole=d*n*pick([2,3,4,5]);
  var part=whole*n/d;
  return{q:`一部儿童电影长 ${part} 分钟，正好是另一部纪录片的 ${n}/${d}。纪录片长多少分钟？（填数）`,
    ans:String(whole),unit:u,kp:k,app:1,
    exp:`单位 1（纪录片）未知，用除法：${part} ÷ ${n}/${d} = ${part} × ${d}/${n} = ${whole}（分钟）。对应关系：${part} 分钟 ↔ ${n}/${d}。`};
},
f3_div_err:function(u,k){
  var b=pick([2,3]),dd=pick([2,3,4]),a=1+R(3),cc=1+R(2);
  var good=frac(a*dd,b*cc);
  /* 候选干扰项：忘颠倒、多乘分母、分子加一等，去重保底 */
  var cands=[good,frac(a*cc,b*dd),frac(a*dd,b*cc*2),frac(a*dd+1,b*cc),frac(a*dd,b*cc+1)];
  var uniq=[];
  cands.forEach(function(x){if(uniq.length<4&&uniq.indexOf(x)<0)uniq.push(x)});
  while(uniq.length<3){var t2=frac(a*dd+uniq.length+1,b*cc);if(uniq.indexOf(t2)<0)uniq.push(t2)}
  return{q:`易错选择题：${a}/${b} ÷ ${cc}/${dd} = ？`,
    ops:shuffle(uniq),ans:good,unit:u,kp:k,
    exp:`正确：除号变乘号、除数翻跟头 → ${a}/${b} × ${dd}/${cc} = ${good}。常见错误是忘了把除数颠倒，或除号变了乘数没翻。`};
},

f3_daily_read:function(u,k){
  var t=pick([[4,2,3],[6,1,2],[5,1,3],[8,2,5]]);
  return{q:`小浩 ${t[0]} 天看了这本书的 ${t[1]}/${t[2]}。平均每天看这本书的几分之几？（填最简分数）`,
    ans:frac(t[1],t[2]*t[0]),unit:u,kp:k,app:1,
    exp:`每天看的 = 总分率 ÷ 天数：${t[1]}/${t[2]} ÷ ${t[0]} = ${t[1]}/${t[2]*t[0]}，约分得 ${frac(t[1],t[2]*t[0])}。`};
},
f3_paper_share:function(u,k){
  var a=pick([3,5]),b=pick([4,6,8]),c=pick([3,4]);
  return{q:`把 ${a}/${b} 米长的彩带平均剪成 ${c} 段，每段多少米？（填最简分数，单位：米）`,
    ans:frac(a,b*c),unit:u,kp:k,app:1,
    exp:`平均分用除法：${a}/${b} ÷ ${c} = ${a}/${b*c}，约分得 ${frac(a,b*c)}（米）。`};
},
f3_milk_cups:function(u,k){
  var a=pick([2,3]),b=pick([3,4]),c=pick([4,6]);
  return{q:`把 ${a}/${b} 升牛奶平均倒进 ${c} 个杯子里，每个杯子倒多少升？（填最简分数，单位：升）`,
    ans:frac(a,b*c),unit:u,kp:k,app:1,
    exp:`${a}/${b} ÷ ${c} = ${a}/${b*c}，约分得 ${frac(a,b*c)}（升）。除以整数等于乘 1/${c}。`};
},
f3_print_time:function(u,k){
  var t=pick([[3,3,17],[4,4,21],[6,6,25],[2,1,7],[5,5,16]]);
  return{q:`王阿姨打印一份文件，${t[0]} 分钟打印了这份文件的 ${t[1]}/${t[2]}。照这样计算，打完这份文件一共要多少分钟？（填数）`,
    ans:String(t[0]*t[2]/t[1]),unit:u,kp:k,app:1,
    exp:`打完全文时间 = ${t[0]} ÷ ${t[1]}/${t[2]} = ${t[0]} × ${t[2]}/${t[1]} = ${t[0]*t[2]/t[1]}（分钟）。"照这样计算"就是效率不变。`};
},
f3_rope_total:function(u,k){
  var t=pick([[15,5,8],[12,3,4],[18,3,8],[20,4,5],[16,2,5]]);
  var whole=t[0]*t[2]/t[1];
  return{q:`一根绳子用去了 ${t[1]}/${t[2]}，用去的部分长 ${t[0]} 米。这根绳子全长多少米？（填数）`,
    ans:String(whole),unit:u,kp:k,app:1,
    exp:`单位 1（全长）未知用除法：${t[0]} ÷ ${t[1]}/${t[2]} = ${t[0]} × ${t[2]}/${t[1]} = ${whole}（米）。`};
},
f3_bucket:function(u,k){
  var t=pick([[4,2,5],[6,3,5],[8,2,3],[9,3,4],[5,1,4]]);
  var whole=t[0]*t[2]/t[1];
  return{q:`一桶油，倒出了 ${t[1]}/${t[2]}，正好倒了 ${t[0]} 千克。这桶油原来重多少千克？（填数）`,
    ans:String(whole),unit:u,kp:k,app:1,
    exp:`倒出的 ${t[0]} 千克对应 ${t[1]}/${t[2]}，求单位 1：${t[0]} ÷ ${t[1]}/${t[2]} = ${whole}（千克）。`};
},

/* —— 第四单元 比 —— */
f4_simplify:function(u,k){
  var g=pick([2,3,4,6,12]),a=g*(2+R(4)),b=g*(1+R(3));
  if(a===b){b=b+g}
  return{q:`化简比：${a} : ${b} = ？（按 a : b 的形式填）`,ans:frac(a,g)+':'+frac(b,g),ratio:1,unit:u,kp:k,
    exp:`前项后项同除以最大公因数 ${g}：${a}÷${g}=${a/g}，${b}÷${g}=${b/g} → ${a/g} : ${b/g}。`};
},
f4_value:function(u,k){
  var t=pick([[6,4],[8,6],[10,4],[9,6],[15,9]]);
  var v=frac(t[0],t[1]);
  return{q:`求比值：${t[0]} : ${t[1]} = ？（填分数、小数或整数）`,ans:v,unit:u,kp:k,
    exp:`比值 = 前项 ÷ 后项 = ${t[0]} ÷ ${t[1]} = ${v}。注意：求比值结果是数，不带单位、不写成比的形式。`};
},
f4_share:function(u,k){
  var r1=pick([3,5]),r2=pick([2,4]),per=pick([4,5,6,8]),T=(r1+r2)*per;
  return{q:`把 ${T} 颗糖果按 ${r1} : ${r2} 分给哥哥和妹妹，哥哥分到多少颗？（填数）`,
    ans:String(r1*per),unit:u,kp:k,app:1,
    exp:`总份数 ${r1}+${r2}=${r1+r2}，每份 ${T}÷${r1+r2}=${per} 颗，哥哥拿 ${r1} 份：${per}×${r1}=${r1*per}（颗）。`};
},
f4_share_app:function(u,k){
  var r1=5,r2=3,T=pick([32,40,48]),per=T/(r1+r2),red=r1*per;
  return{q:`盒子里红球和黄球共 ${T} 个，红球与黄球个数比是 5 : 3。红球有多少个？（填数）`,
    ans:String(red),unit:u,kp:k,app:1,
    exp:`总份数 5+3=8，每份 ${T}÷8=${per} 个，红球 5 份：${per}×5=${red}（个）。`};
},
f4_share_app:function(u,k){
  var r1=5,r2=3,T=pick([32,40,48]),per=T/(r1+r2),red=r1*per;
  return{q:`盒子里红球和黄球共 ${T} 个，红球与黄球个数比是 5 : 3。红球有多少个？（填数）`,
    ans:String(red),unit:u,kp:k,app:1,
    exp:`总份数 5+3=8，每份 ${T}÷8=${per} 个，红球 5 份：${per}×5=${red}（个）。`};
},
f4_sugar_water:function(u,k){
  var t=pick([[1,10,440],[1,10,550],[1,11,480],[2,9,330]]);
  var per=t[2]/(t[0]+t[1]);
  return{q:`按糖和水 ${t[0]} : ${t[1]} 的质量比，调制一杯 ${t[2]} g 的糖水。需要糖多少克？（填数）`,
    ans:String(per*t[0]),unit:u,kp:k,app:1,
    exp:`总份数 ${t[0]}+${t[1]}=${t[0]+t[1]}，每份 ${t[2]}÷${t[0]+t[1]}=${per} g，糖 ${t[0]} 份：${per}×${t[0]}=${per*t[0]}（g）。`};
},
f4_salt_water:function(u,k){
  var t=pick([[3,17,500],[1,24,500],[2,13,450],[5,15,400]]);
  var per=t[2]/(t[0]+t[1]);
  return{q:`一杯 ${t[2]} g 盐水，盐和水的质量比是 ${t[0]} : ${t[1]}。盐有多少克？（填数）`,
    ans:String(per*t[0]),unit:u,kp:k,app:1,
    exp:`总份数 ${t[0]}+${t[1]}=${t[0]+t[1]}，每份 ${t[2]}÷${t[0]+t[1]}=${per} g，盐 ${t[0]} 份：${per}×${t[0]}=${per*t[0]}（g）。`};
},
f4_class_ratio:function(u,k){
  var t=pick([[5,4,45],[4,5,45],[3,2,35],[5,3,40],[7,5,48]]);
  var per=t[2]/(t[0]+t[1]);
  return{q:`六（1）班共有 ${t[2]} 人，男生和女生人数比是 ${t[0]} : ${t[1]}。男生有多少人？（填数）`,
    ans:String(per*t[0]),unit:u,kp:k,app:1,
    exp:`总份数 ${t[0]}+${t[1]}=${t[0]+t[1]}，每份 ${t[2]}÷${t[0]+t[1]}=${per} 人，男生 ${t[0]} 份：${per}×${t[0]}=${per*t[0]}（人）。`};
},
f4_triangle_sides:function(u,k){
  var t=pick([[3,5,2],[2,3,1],[4,7,3],[5,8,3]]);
  return{q:`一个等腰三角形，周长是 ${t[1]*2+t[2]*1===t[1]*2+t[2]?t[1]*2+t[2]:0} 厘米，其中两条边的比是 ${t[0]} : ${t[0]}（腰），底边与腰的比是 ${t[2]} : ${t[0]}。腰长多少厘米？（填数）`,
    ans:String(t[1]),unit:u,kp:k,app:1,
    exp:`三边比 = 腰 : 腰 : 底 = ${t[0]} : ${t[0]} : ${t[2]}，总份数 ${t[0]*2+t[2]}，每份 = 周长 ÷ 总份数，腰占 ${t[0]} 份 = ${t[1]}（厘米）。按比例分配照旧适用。`};
},
f4_concrete:function(u,k){
  var t=pick([[2,3,1,20],[1,2,3,30],[2,3,5,40],[1,3,4,16]]);
  var per=t[3]/(t[0]+t[1]+t[2]);
  return{q:`混凝土按水泥、沙、石子 ${t[0]} : ${t[1]} : ${t[2]} 的比配制。现在有 ${t[3]} 吨这样的混凝土，水泥用了多少吨？（填数）`,
    ans:String(per*t[0]),unit:u,kp:k,app:1,
    exp:`总份数 ${t[0]}+${t[1]}+${t[2]}=${t[0]+t[1]+t[2]}，每份 ${t[3]}÷${t[0]+t[1]+t[2]}=${per} 吨，水泥 ${t[0]} 份：${per}×${t[0]}=${per*t[0]}（吨）。三项比照比例分配一样算。`};
},
f4_prop_err:function(u,k){
  return{q:`易错选择题：比的前项乘 2，要使比值不变，后项应该（　）`,
    ops:shuffle(['乘 2','加 2','不变','除以 2']),ans:'乘 2',unit:u,kp:k,
    exp:`比的基本性质：前项和后项要"同乘或同除以同一个数"（0 除外）。前项乘 2，后项也要乘 2。`};
},

/* —— 第五单元 圆 —— */
f5_rd:function(u,k){
  var r=2+R(15),dir=R(2);
  if(dir===0)return{q:`一个圆的半径是 ${r} 厘米，它的直径是多少厘米？（填数）`,
    ans:String(2*r),unit:u,kp:k,
    exp:`同圆里 d = 2r：${r}×2=${2*r}（厘米）。`};
  return{q:`一个圆的直径是 ${2*r} 厘米，它的半径是多少厘米？（填数）`,
    ans:String(r),unit:u,kp:k,
    exp:`同圆里 r = d ÷ 2：${2*r}÷2=${r}（厘米）。`};
},
f5_concept:function(u,k){
  var t=pick([
    {q:'决定圆的位置的是（　）',ans:'圆心',bad:['半径','直径','周长'],why:'圆心定位置，半径定大小。'},
    {q:'决定圆的大小的是（　）',ans:'半径（或直径）',bad:['圆心','周长','圆周率'],why:'半径越长圆越大，圆心只管圆画在哪儿。'},
    {q:'在同一个圆里，直径与半径的关系是（　）',ans:'直径是半径的 2 倍',bad:['半径是直径的 2 倍','直径是半径的 3 倍','一样长'],why:'d = 2r，永远成立（同一个圆里）。'}]);
  return{q:t.q,ops:shuffle([t.ans,t.bad[0],t.bad[1]]),ans:t.ans,unit:u,kp:k,
    exp:t.why};
},
f5_c:function(u,k){
  var r=pick([3,5,10,15,20]),C=2*3.14*r;
  return{q:`一个圆的半径是 ${r} 厘米，它的周长是多少厘米？（π 取 3.14，填数）`,
    ans:String(Math.round(C*100)/100),unit:u,kp:k,app:1,
    exp:`C = 2πr = 2 × 3.14 × ${r} = ${C}（厘米）。`};
},
f5_halfc:function(u,k){
  var r=pick([4,6,10]),C=3.14*r+2*r;
  return{q:`一个半圆的半径是 ${r} 厘米，这个半圆的周长是多少厘米？（π 取 3.14，填数）`,
    ans:String(Math.round(C*100)/100),unit:u,kp:k,app:1,
    exp:`半圆周长 = 弧 + 直径 = πr + 2r = ${3.14*r} + ${2*r} = ${C}（厘米）。半圆的"边"有一条弧和一条直径！`};
},
f5_s:function(u,k){
  var r=pick([2,4,5,10]),A=3.14*r*r;
  return{q:`一个圆的半径是 ${r} 米，它的面积是多少平方米？（π 取 3.14，填数）`,
    ans:String(Math.round(A*100)/100),unit:u,kp:k,app:1,
    exp:`S = πr² = 3.14 × ${r}² = 3.14 × ${r*r} = ${A}（平方米）。注意先平方再乘 3.14。`};
},
f5_ring:function(u,k){
  var Rr=pick([5,6,8]),rr=pick([2,3,4]);
  if(rr>=Rr)rr=Rr-2;
  var A=3.14*(Rr*Rr-rr*rr);
  return{q:`一个环形，外圆半径 ${Rr} 厘米，内圆半径 ${rr} 厘米。环形面积是多少平方厘米？（π 取 3.14，填数）`,
    ans:String(Math.round(A*100)/100),unit:u,kp:k,app:1,
    exp:`环形面积 = π(R² − r²) = 3.14 × (${Rr*Rr} − ${rr*rr}) = ${A}（平方厘米）。大减小，最后乘 3.14 最省力。`};
},

f5_ring:function(u,k){
  var Rr=pick([5,6,8]),rr=pick([2,3,4]);
  if(rr>=Rr)rr=Rr-2;
  var A=3.14*(Rr*Rr-rr*rr);
  return{q:`一个环形，外圆半径 ${Rr} 厘米，内圆半径 ${rr} 厘米。环形面积是多少平方厘米？（π 取 3.14，填数）`,
    ans:String(Math.round(A*100)/100),unit:u,kp:k,app:1,
    exp:`环形面积 = π(R² − r²) = 3.14 × (${Rr*Rr} − ${rr*rr}) = ${A}（平方厘米）。大减小，最后乘 3.14 最省力。`};
},
f5_fountain:function(u,k){
  var r=pick([3,5,10]),C=2*3.14*r;
  return{q:`一个圆形喷水池的半径是 ${r} 米，绕它走一圈是多少米？（π 取 3.14，填数）`,
    ans:String(C),unit:u,kp:k,app:1,
    exp:`绕一圈 = 求周长：C = 2πr = 2 × 3.14 × ${r} = ${C}（米）。`};
},
f5_roll:function(u,k){
  var t=pick([[6,15],[4,25],[5,20]]);
  var C=3.14*t[0],dist=Math.round(C*t[1]*10)/10;
  return{q:`一个底面直径 ${t[0]} 分米的圆筒，掉在地上向前滚了 ${t[1]} 圈。它滚了多少分米？（π 取 3.14，填数）`,
    ans:String(dist),unit:u,kp:k,app:1,
    exp:`滚一圈 = 一个周长：3.14 × ${t[0]} = ${C}（分米），${t[1]} 圈：${C} × ${t[1]} = ${dist}（分米）。`};
},
f5_compass:function(u,k){
  var t=pick([[6.28,1],[12.56,2],[18.84,3],[9.42,1.5]]);
  return{q:`小雅用圆规画了一个周长 ${t[0]} 厘米的圆。圆规两脚间的距离是多少厘米？（π 取 3.14，填数）`,
    ans:String(t[1]),unit:u,kp:k,app:1,
    exp:`圆规两脚间距离 = 半径。C = 2πr → r = ${t[0]} ÷ (2 × 3.14) = ${t[1]}（厘米）。周长反求半径要除以 2π。`};
},
f5_grass:function(u,k){
  var t=pick([[10,18],[8,18],[12,18],[20,10]]);
  var A=Math.round(3.14*(t[0]/2)*(t[0]/2)*100)/100;
  return{q:`一块圆形草坪的直径是 ${t[0]} 米，每平方米草皮 ${t[1]} 元。铺满这块草坪要多少元？（π 取 3.14，填数）`,
    ans:String(Math.round(A*t[1])),unit:u,kp:k,app:1,
    exp:`先求面积：半径 ${t[0]/2} 米，S = 3.14 × ${(t[0]/2)}² = ${A}（平方米）；再算钱：${A} × ${t[1]} = ${Math.round(A*t[1])}（元）。两步应用。`};
},

f6_order:function(u,k){
  var d=pick([4,5,6,8]),n=1+R(d-1),a=pick([20,36,50,100]),b=1+R(5);
  var v=a+b*n/d;
  return{q:`计算：${a} + ${b} × ${n}/${d} = ？（填数，能约分填分数）`,
    ans:frac(a*d+b*n,d),unit:u,kp:k,
    exp:`先乘除后加减：先算 ${b}×${n}/${d}=${frac(b*n,d)}，再算 ${a}+${frac(b*n,d)}=${frac(a*d+b*n,d)}。`};
},
f6_dist:function(u,k){
  var T=pick([12,18,24,36]),a=pick([2,3,5]),b=pick([1,2]),da=pick([2,3,4,6]),db=pick([3,4,6,8]);
  var s1=frac(T*a,da),s2=frac(T*b,db),v=frac(T*a*db+T*b*da,da*db);
  return{q:`简便运算：( ${a}/${da} + ${b}/${db} ) × ${T} = ？（填数）`,
    ans:v,unit:u,kp:k,
    exp:`用乘法分配律：${T}×${a}/${da} + ${T}×${b}/${db} = ${s1} + ${s2} = ${v}。括号外有整数，先想分配！`};
},
f6_multi:function(u,k){
  var W=pick([120,160,200]),n=pick([2,3]),d=pick([4,5]);
  var v=W*(1-n/d);
  return{q:`一批水果共 ${W} 千克，第一天卖掉总数的 ${n}/${d}，还剩多少千克？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`先算剩下的分率：1 − ${n}/${d} = ${frac(d-n,d)}，再乘总量：${W} × ${frac(d-n,d)} = ${v}（千克）。`};
},

f6_multi:function(u,k){
  var W=pick([120,160,200]),n=pick([2,3]),d=pick([4,5]);
  var v=W*(1-n/d);
  return{q:`一批水果共 ${W} 千克，第一天卖掉总数的 ${n}/${d}，还剩多少千克？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`先算剩下的分率：1 − ${n}/${d} = ${frac(d-n,d)}，再乘总量：${W} × ${frac(d-n,d)} = ${v}（千克）。`};
},
f6_two_days:function(u,k){
  /* v3.3.3：剩下页数答案最简分数（原来 44.800000000000004 浮点误差 + 小数）。
     数据约束改为保证整数结果：W 必须是 d1*d2 的倍数且剩率分母整除 W */
  var n1=1,d1=pick([3,4]),n2=1,d2=pick([4,5,6]);
  var den=d1*d2,restDen=den-n1*d2-n2*d1;   /* 剩余分率分母 */
  var W=pick([den*1,den*2,den*3,den*4]);   /* W 是 den 的倍数 → 结果必为整数 */
  var v=frac(W*restDen,den);
  return{q:`一本书 ${W} 页，第一天读了全书的 ${n1}/${d1}，第二天读了全书的 ${n2}/${d2}。还剩多少页没读？（填最简分数或整数）`,
    ans:v,unit:u,kp:k,app:1,
    exp:`剩下分率：1 − ${n1}/${d1} − ${n2}/${d2} = ${frac(restDen,den)}；页数：${W} × ${frac(restDen,den)} = ${v}（页）。两个分率的单位 1 都是"全书"，直接减。`};
},
f6_price_mix:function(u,k){
  var W=pick([80,100,120]),n=pick([2,3]),d=pick([4,5]),inc=pick([10,20]);
  var v=Math.round((W*(1-n/d)+inc)*100)/100;
  return{q:`仓库有 ${W} 吨货，运走 ${n}/${d} 后，又运来 ${inc} 吨。现在仓库有货多少吨？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`运走后剩 ${W}×(1−${n}/${d})=${Math.round(W*(1-n/d)*100)/100} 吨，再来 ${inc} 吨：${Math.round(W*(1-n/d)*100)/100}+${inc}=${v}（吨）。混合运算按顺序：先乘除后加减。`};
},
f6_budget:function(u,k){
  var t=pick([[1000,3,8],[1200,1,4],[900,2,5],[1500,3,10]]);
  var v=Math.round(t[0]*(1-t[1]/t[2])*100)/100;
  return{q:`爸爸带 ${t[0]} 元去买家电，买洗衣机用去了总钱数的 ${t[1]}/${t[2]}。还剩多少元？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`剩下分率 1−${t[1]}/${t[2]}=${frac(t[2]-t[1],t[2])}，${t[0]}×${frac(t[2]-t[1],t[2])}=${v}（元）。先算分率再乘总量。`};
},
f6_remain_frac:function(u,k){
  /* v2.4.5 修复：原实现把「一共吃了」算成「还剩」(v=总量×(1-分率和))，
     例 5/12+1/3、720kg 时给出 180（恰为剩余量），孩子答 540 反被判错。
     现按问法正确计算：一共=总量×(a/b+c/d)，并加健全性断言。 */
  var t=pick([[2,5,3,5,480],[1,4,3,8,320],[3,10,1,2,600],[5,12,1,3,720]]);
  var eaten=t[4]*(t[0]/t[1]+t[2]/t[3]);
  var remain=t[4]-eaten;
  var v=Math.round(eaten*100)/100;
  return{q:`食堂运来 ${t[4]} 千克大米，第一周吃了它的 ${t[0]}/${t[1]}，第二周吃了它的 ${t[2]}/${t[3]}。两周一共吃了多少千克？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`先算两周一共的分率：${t[0]}/${t[1]}+${t[2]}/${t[3]}=${frac(t[0]*t[3]+t[2]*t[1],t[1]*t[3])}，再用总量乘：${t[4]}×两周一共的分率=${v}（千克）。也可以分别算每周再相加。（核对：还剩 ${Math.round(remain*100)/100} 千克）`};
},


f7_conv:function(u,k){
  var t=pick([[0.35,'35%'],[0.08,'8%'],[1.2,'120%'],[0.75,'75%'],[0.5,'50%'],[2.5,'250%']]);
  return{q:`把 ${t[0]} 化成百分数。（填如 35% 的形式）`,ans:t[1],unit:u,kp:k,
    exp:`小数化百分数：小数点向右移两位，再添 %。${t[0]} → ${t[1]}。`};
},
f7_conv2:function(u,k){
  /* v3.3.3：剔除 1/8（12.5% 含小数），只用能化整数百分数的分数 */
  var t=pick([[3,4,'75%'],[1,4,'25%'],[1,5,'20%'],[3,5,'60%'],[7,10,'70%']]);
  return{q:`把 ${t[0]}/${t[1]} 化成百分数。（填如 75% 的形式）`,ans:t[2],unit:u,kp:k,
    exp:`分数化百分数：先化成小数再化百分数（或化成分母是 100 的分数）。${t[0]}/${t[1]} = ${t[2]}。`};
},
f7_rate:function(u,k){
  var total=pick([20,40,50,80]),bad=pick([2,4,5,8]),good=total-bad;
  var v=good/total*100;
  return{q:`小测 ${total} 道题，做对了 ${good} 道。正确率是百分之几？（填如 90% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`正确率 = 做对数 ÷ 总数 × 100% = ${good} ÷ ${total} = ${v}%。`};
},
f7_of:function(u,k){
  var W=pick([200,300,400,500]),p=pick([10,20,30,40]),v=W*p/100;
  return{q:`学校图书馆有 ${W} 本故事书，科技书的本数是故事书的 ${p}%。科技书有多少本？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`求一个数的百分之几用乘法：${W} × ${p}% = ${W} × ${p/100} = ${v}（本）。`};
},
f7_more:function(u,k){
  var base=pick([40,50,80]),more=base+pick([10,20,40]);
  var v=(more-base)/base*100;
  return{q:`${more} 比 ${base} 多百分之几？（填如 25% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`多的部分 ÷ 单位 1："比"字后面是 ${base}，所以 ( ${more}−${base} ) ÷ ${base} = ${more-base} ÷ ${base} = ${v}%。`};
},
f7_less:function(u,k){
  var base=pick([50,80,100]),less=base-pick([10,20,40]);
  var v=(base-less)/base*100;
  return{q:`${less} 比 ${base} 少百分之几？（填如 20% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`少的部分 ÷ 单位 1：( ${base}−${less} ) ÷ ${base} = ${base-less} ÷ ${base} = ${v}%。注意单位 1 是 ${base}！`};
},

f7_less:function(u,k){
  var base=pick([50,80,100]),less=base-pick([10,20,40]);
  var v=(base-less)/base*100;
  return{q:`${less} 比 ${base} 少百分之几？（填如 20% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`少的部分 ÷ 单位 1：( ${base}−${less} ) ÷ ${base} = ${base-less} ÷ ${base} = ${v}%。注意单位 1 是 ${base}！`};
},
f7_survival:function(u,k){
  var t=pick([[300,270],[200,194],[500,475],[400,388],[250,235]]);
  var v=t[1]/t[0]*100;
  return{q:`李阿姨种了 ${t[0]} 棵向日葵，存活了 ${t[1]} 棵。存活率是多少？（填如 90% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`存活率 = 存活 ÷ 总数 × 100% = ${t[1]} ÷ ${t[0]} = ${v}%。求百分率就是"部分÷整体"。`};
},
f7_pass_rate:function(u,k){
  var t=pick([[2000,90],[2400,95],[1500,98],[800,96]]);
  var good=Math.round(t[0]*t[1]/100);
  return{q:`工厂生产了 ${t[0]} 个零件，合格率是 ${t[1]}%。合格的零件有多少个？（填数）`,
    ans:String(good),unit:u,kp:k,app:1,
    exp:`求一个数的百分之几用乘法：${t[0]} × ${t[1]}% = ${t[0]} × ${t[1]/100} = ${good}（个）。`};
},
f7_fail_rate:function(u,k){
  var t=pick([[45,9],[50,5],[60,12],[80,16]]);
  var v=t[1]/t[0]*100;
  return{q:`六（2）班共 ${t[0]} 个学生，跳远测试中 ${t[1]} 人没有及格。不及格率是多少？（填如 20% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`不及格率 = 不及格人数 ÷ 总人数 × 100% = ${t[1]} ÷ ${t[0]} = ${v}%。分母是全班人数（单位 1）。`};
},
f7_oil_rate:function(u,k){
  var t=pick([[38,2500],[42,2000],[35,1000],[40,3000]]);
  var v=Math.round(t[0]/100*t[1]);
  return{q:`某工厂油菜籽的出油率是 ${t[0]}%。${t[1]} kg 油菜籽可榨油多少千克？（填数）`,
    ans:String(v),unit:u,kp:k,app:1,
    exp:`出油率 = 油的质量 ÷ 油菜籽质量。反求油：${t[1]} × ${t[0]}% = ${t[1]} × ${t[0]/100} = ${v}（kg）。`};
},
f7_shoes_pass:function(u,k){
  var t=pick([[2400,96],[1800,72],[3000,90],[1500,60]]);
  var v=Math.round((t[0]-t[1])/t[0]*100*10)/10;
  return{q:`某鞋厂生产了 ${t[0]} 双鞋，检验出 ${t[1]} 双不合格。这批鞋的合格率是多少？（填如 96% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`合格率 = 合格数 ÷ 总数 × 100%。合格双数 = ${t[0]}−${t[1]}=${t[0]-t[1]}，${t[0]-t[1]} ÷ ${t[0]} = ${v}%。注意先算合格的，别拿不合格数除！`};
},

/* ═══ 参照《培优课堂》(青岛版同步·基础/提升/拓展三段)与《周计划》应用题体系新增题型 ═══ */

/* —— 第一单元补充：单位换算 / 比大小 / 连乘传递 / 比多比少 / 剩料 / 面积差 —— */
f1_unit_conv:function(u,k){
  var t=pick([[1,4,60,'时','分',15],[1,2,24,'日','时',12],[9,10,1000,'吨','千克',900],
    [2,5,10,'米','分米',4],[7,8,10000,'公顷','平方米',8750],[1,4,100,'平方分米','平方厘米',25],
    [3,5,60,'分','秒',36],[3,4,1000,'千克','克',750]]);
  return{q:`${t[0]}/${t[1]} ${t[3]} = （　）${t[4]}（填数）`,ans:String(t[5]),unit:u,kp:k,
    exp:`单位换算用乘法：1 ${t[3]} = ${t[2]} ${t[4]}，所以 ${t[0]}/${t[1]} × ${t[2]} = ${t[5]}（${t[4]}）。分数乘整数也能解决单位换算。`};
},
f1_compare_size:function(u,k){
  var b=pick([4,5,8,10]),a=1+R(b-1),mode=R(3),leftTxt,ans;
  if(mode===0){var c=2+R(4);leftTxt=a+'/'+b+' × '+c;ans='>'}
  else if(mode===1){var cc=1,d2=2+R(3);leftTxt=a+'/'+b+' × '+cc+'/'+d2;ans='<'}
  else{leftTxt=a+'/'+b+' × 1';ans='='}
  return{q:`在○里填上">"、"<"或"="：${leftTxt} ○ ${a}/${b}`,
    ops:shuffle(['>','<','=']),ans:ans,unit:u,kp:k,
    exp:`不用硬算：一个数乘大于 1 的数，积变大；乘 1，积不变；乘真分数（小于 1 的数），积变小。先看乘的数和 1 比大小。`};
},
f1_triple_chain:function(u,k){
  var t=pick([[240,5,8,2,3],[360,5,6,2,3],[480,3,8,2,3],[240,2,3,3,4],[360,2,3,1,2],[400,5,8,3,5]]);
  var second=t[0]*t[1]/t[2],third=second*t[3]/t[4];
  return{q:`三名同学跳绳，小芳跳了 ${t[0]} 下，小红跳的是小芳的 ${t[1]}/${t[2]}，小凡跳的是小红的 ${t[3]}/${t[4]}。小凡跳了多少下？（填数）`,
    ans:String(third),unit:u,kp:k,app:1,
    exp:`连续求一个数的几分之几：先求小红 ${t[0]}×${t[1]}/${t[2]}=${second}（下），再求小凡 ${second}×${t[3]}/${t[4]}=${third}（下）。也可以列综合算式一步连乘。`};
},
f1_more_less:function(u,k){
  /* [总量,n,d,偏移,题干,单位] —— v3.3.2 修复：原代码误取 t[5] 当题干、t[6] 当单位（下标越界），题干只剩"千克（填数）" */
  var t=pick([
    [2500,1,5,-65,'一头大象重 2500 千克，一头奶牛的体重比大象体重的 1/5 还少 65 千克。这头奶牛重多少千克？','千克'],
    [1200,4,5,43,'植物园花展摆了 1200 盆郁金香，摆的月季数量比郁金香的 4/5 多 43 盆。月季摆了多少盆？','盆'],
    [2384,3,8,-77,'图书馆有文学书 2384 本，科普书的数量比文学书的 3/8 少 77 本。科普书有多少本？','本'],
    [3600,5,9,45,'玩具厂计划生产 3600 件玩具，实际比计划的 5/9 多 45 件。实际生产了多少件？','件']]);
  var part=t[0]*t[1]/t[2],ans=part+t[3];
  return{q:t[4]+'（填数）',ans:String(ans),unit:u,kp:k,app:1,
    exp:`两步走：先求"一个数的几分之几"：${t[0]}×${t[1]}/${t[2]}=${part}；再${t[3]>=0?'加上':'减去'} ${Math.abs(t[3])}：${part}${t[3]>=0?'+':'−'}${Math.abs(t[3])}=${ans}（${t[5]}）。"比一个数的几分之几多/少几"就是先乘再加减。`};
},
f1_steel_left:function(u,k){
  /* v3.3.3：剩余=整数−分数，答案最简分数（原来 8.33/3.67 这类循环小数四舍五入） */
  var t=pick([[6,2,5,10],[8,3,4,10],[12,5,6,10],[4,3,20,15]]);
  var usedNum=t[1]*t[3],usedDen=t[2];
  var leftNum=t[0]*usedDen-usedNum,leftDen=usedDen;
  var left=frac(leftNum,leftDen);
  var used=frac(usedNum,usedDen);
  return{q:`一段钢材长 ${t[0]} 米，做一个零件用钢材 ${t[1]}/${t[2]} 米，已经做了 ${t[3]} 个这样的零件。这段钢材还剩多少米？（填最简分数或整数）`,
    ans:left,unit:u,kp:k,app:1,
    exp:`先用去：${t[1]}/${t[2]} × ${t[3]} = ${usedNum}/${usedDen} = ${used}（米）；还剩：${t[0]} − ${used} = ${frac(leftNum,leftDen)}（米）。`};
},
f1_rect_diff:function(u,k){
  /* v3.3.3：答案最简分数（原来 0.54/0.96 这类小数） */
  var t=pick([[6,5,9,10],[9,10,3,5],[8,5,4,5]]);
  var rectNum=t[0]*t[3]*t[3],rectDen=t[1]*t[3]*t[3];
  var sqNum=t[2]*t[2]*t[1],sqDen=t[1]*t[3]*t[3];
  var dNum=rectNum-sqNum,dDen=rectDen;
  var d=frac(dNum,dDen);
  var sq=frac(sqNum,sqDen),rect=frac(rectNum,rectDen);
  return{q:`一块长方形木板的面积是 ${t[0]}/${t[1]} 平方米，一块正方形木板的边长是 ${t[2]}/${t[3]} 米。长方形木板的面积比正方形木板多多少平方米？（填最简分数或整数）`,
    ans:d,unit:u,kp:k,app:1,
    exp:`正方形面积 = ${t[2]}/${t[3]} × ${t[2]}/${t[3]} = ${t[2]*t[2]}/${t[3]*t[3]}（平方米）；长方形 ${rect} − ${sq} = ${d}（平方米）。`};
},

/* —— 第二单元补充：公平性 / 转盘 / 双球判断 / 放球设计（培优课堂题型）—— */
f2_coin_fair:function(u,k){
  return{q:`用抛硬币的方法决定谁先入场参加比赛：正面朝上甲先入场，反面朝上乙先入场。这个方法公平吗？`,
    ops:shuffle(['公平，正面和反面的可能性一样大','不公平，正面朝上的可能性大','不公平，反面朝上的可能性大']),
    ans:'公平，正面和反面的可能性一样大',unit:u,kp:k,
    exp:`硬币只有正面、反面两种等可能的结果，各占 1/2，对双方一样公平。判断规则公不公平，就看双方的可能性是否一样大。`};
},
f2_spinner_mini:function(u,k){
  var n=pick([6,8]),a=1+R(n-2),b=n-a;
  var ans=a>b?'红色':(a<b?'黄色':'两个区域一样大');
  return{q:`一个转盘平均分成 ${n} 份，红色占 ${a} 份，黄色占 ${b} 份。转盘停止后，指针指在哪个区域的可能性大？`,
    ops:shuffle(['红色','黄色','两个区域一样大']),ans:ans,unit:u,kp:k,
    exp:`谁的份数多，指针停在谁那里的可能性就大：红色 ${a} 份、黄色 ${b} 份。份数一样多时，可能性就一样大。`};
},
f2_two_draw:function(u,k){
  var t=pick([[3,1,'可能'],[4,0,'一定'],[0,3,'不可能'],[2,2,'可能']]);
  return{q:`口袋里有 ${t[0]} 个红球和 ${t[1]} 个白球（除颜色外都相同），红红一次摸出两个球。"摸出的两个球都是红球"这件事会怎样发生？`,
    ops:shuffle(['一定发生','可能发生','不可能发生']),ans:t[2]+'发生',unit:u,kp:k,
    exp:`${t[0]>0?'袋里有红球，一次摸两个就完全可能都是红球'+(t[1]>0?'（也可能摸到白球）':''):'袋里没有红球，怎么摸都不可能摸出红球'}。判断"一定/可能/不可能"就看条件够不够。`};
},
f2_paint_design:function(u,k){
  var t=pick([
    ['摸到红球的可能性大',['放 5 个红球和 1 个白球','放 1 个红球和 5 个白球','放 3 个红球和 3 个白球'],'放 5 个红球和 1 个白球'],
    ['不可能摸到白球',['放 4 个红球','放 2 个红球和 2 个白球','放 1 个红球和 3 个白球'],'放 4 个红球'],
    ['摸到红球、白球的可能性一样大',['放 3 个红球和 3 个白球','放 4 个红球和 1 个白球','放 1 个红球和 4 个白球'],'放 3 个红球和 3 个白球']]);
  return{q:`往口袋里放球（除颜色外都相同），要使摸球的结果是"${t[0]}"，应该怎么放？`,
    ops:shuffle(t[1]),ans:t[2],unit:u,kp:k,
    exp:`设计诀窍：可能性大 → 这种球多放；可能性一样大 → 两种球数量相等；不可能 → 这种球一个都不放。`};
},

/* —— 第三单元补充：方程 / 剩余分率 / 降价 / 行程 / 双单位1 / 叠纸 / 速度比 —— */
f3_solve_equation:function(u,k){
  var t=pick([[12,1,2,4,7],[9,2,3,1,2],[15,5,6,3,5],[8,3,4,1,2]]);
  return{q:`解方程：${t[0]}x = ${t[1]}/${t[2]} × ${t[3]}/${t[4]}。x = ？（填最简分数）`,
    ans:frac(t[1]*t[3],t[2]*t[4]*t[0]),unit:u,kp:k,
    exp:`先算右边：${t[1]}/${t[2]} × ${t[3]}/${t[4]} = ${frac(t[1]*t[3],t[2]*t[4])}；方程变成 ${t[0]}x = ${frac(t[1]*t[3],t[2]*t[4])}，两边同除 ${t[0]}：x = ${frac(t[1]*t[3],t[2]*t[4]*t[0])}。`};
},
f3_read_remain:function(u,k){
  var t=pick([[3,5,30],[2,7,40],[4,9,45],[3,8,35],[5,12,28]]);
  var total=t[2]*t[1]/(t[1]-t[0]);
  return{q:`一本书已经看了它的 ${t[0]}/${t[1]}，还剩 ${t[2]} 页没看。这本书一共多少页？（填数）`,
    ans:String(total),unit:u,kp:k,app:1,
    exp:`已看 ${t[0]}/${t[1]} → 还剩全书的 ${t[1]-t[0]}/${t[1]}，正好是 ${t[2]} 页。单位 1（总页数）未知用除法：${t[2]} ÷ ${t[1]-t[0]}/${t[1]} = ${total}（页）。`};
},
f3_price_drop:function(u,k){
  var t=pick([[3,20,51],[2,5,24],[1,4,30],[3,8,35]]);
  var orig=t[2]*t[1]/(t[1]-t[0]);
  return{q:`一件毛衣现在的售价是 ${t[2]} 元，比原来降价 ${t[0]}/${t[1]}。这件毛衣原来售价多少元？（填数）`,
    ans:String(orig),unit:u,kp:k,app:1,
    exp:`"降价 ${t[0]}/${t[1]}"的单位 1 是原价 → 现价是原价的 ${t[1]-t[0]}/${t[1]}。${t[2]} ÷ ${t[1]-t[0]}/${t[1]} = ${orig}（元）。`};
},
f3_train_trip:function(u,k){
  /* v3.3.3：时间答案最简分数（原来 2.5/3.75 这类小数） */
  var t=pick([[6,5,120,260],[3,2,90,225],[4,3,80,180],[5,4,150,300]]);
  var hoursNum=t[3]*t[0],hoursDen=t[2]*t[1];
  var hours=frac(hoursNum,hoursDen),sp=frac(t[2]*t[1],t[0]);
  return{q:`一列火车 ${t[0]}/${t[1]} 小时行驶 ${t[2]} 千米，照这样计算，行驶完全程 ${t[3]} 千米需要多少小时？（填最简分数或整数）`,
    ans:hours,unit:u,kp:k,app:1,
    exp:`先归一求速度：${t[2]} ÷ ${t[0]}/${t[1]} = ${t[2]} × ${t[1]}/${t[0]} = ${sp}（千米/时）；再算全程时间：${t[3]} ÷ ${sp} = ${hoursNum}/${hoursDen}，约分得 ${hours}（小时）。`};
},
f3_tunnel_two:function(u,k){
  var t=pick([[6,120,5],[8,90,3],[5,150,3]]);
  var day1=t[1]*t[2],whole=day1*t[0];
  return{q:`工程队修一条隧道，第一天修了全长的 1/${t[0]}，第二天修了 ${t[1]} 米，第二天修的正好是第一天的 1/${t[2]}。这条隧道全长多少米？（填数）`,
    ans:String(whole),unit:u,kp:k,app:1,
    exp:`两个"单位 1"逐个击破：先求第一天——第二天是它的 1/${t[2]}，所以第一天 = ${t[1]}×${t[2]} = ${day1}（米）；再求全长——第一天占 1/${t[0]}，全长 = ${day1}×${t[0]} = ${whole}（米）。`};
},
f3_paper_stack:function(u,k){
  var t=pick([[300,18,5,54],[250,1,2,60],[400,3,4,60],[200,2,5,56]]);
  var sheets=t[3]*t[2]*t[0]/t[1];
  return{q:`将 ${t[0]} 张同样的纸叠在一起，厚度是 ${t[1]}/${t[2]} 厘米。要叠成 ${t[3]} 厘米厚的纸层，需要这样的纸多少张？（填数）`,
    ans:String(sheets),unit:u,kp:k,app:1,
    exp:`归一思路：每张纸厚 ${t[1]}/${t[2]} ÷ ${t[0]} = ${t[1]}/${t[2]*t[0]}（厘米）；${t[3]} 厘米需要 ${t[3]} ÷ ${t[1]}/${t[2]*t[0]} = ${sheets}（张）。`};
},
f3_swim_run:function(u,k){
  var t=pick([[5,6,45,3,4,81],[3,4,24,2,5,100],[2,3,30,3,5,90]]);
  var sq=t[2]*t[1]/t[0],cb=t[5]*t[4]/t[3];
  return{q:`无脊椎动物中墨鱼游得最快，${t[0]}/${t[1]} 小时可以游 ${t[2]} 千米；脊椎动物中猎豹跑得最快，${t[3]}/${t[4]} 小时可以跑 ${t[5]} 千米。墨鱼游动的速度是猎豹奔跑速度的几分之几？（填最简分数）`,
    ans:frac(sq,cb),unit:u,kp:k,app:1,
    exp:`墨鱼速度：${t[2]} ÷ ${t[0]}/${t[1]} = ${sq}（千米/时）；猎豹速度：${t[5]} ÷ ${t[3]}/${t[4]} = ${cb}（千米/时）；再比：${sq} ÷ ${cb} = ${frac(sq,cb)}。`};
},

/* —— 第四单元补充：效率比 / 速度比 / 存粮比 / 调人相等 / 溶液混合（周计划经典）—— */
f4_work_ratio:function(u,k){
  var t=pick([[8,10],[6,10],[12,8],[10,6]]);
  var g=gcd(t[0],t[1]);
  return{q:`甲 ${t[0]} 天的工作量正好与乙 ${t[1]} 天的工作量相等，甲、乙的工作效率之比是多少？（按 a : b 的形式填）`,
    ans:(t[1]/g)+':'+(t[0]/g),ratio:1,unit:u,kp:k,
    exp:`把总工作量看作 1：甲每天做 1/${t[0]}，乙每天做 1/${t[1]}。效率比 = 1/${t[0]} : 1/${t[1]} = ${t[1]} : ${t[0]}，化简得 ${t[1]/g} : ${t[0]/g}。工作量相同时，效率和天数成反比。`};
},
f4_speed_time_ratio:function(u,k){
  var t=pick([[6,4],[8,6],[10,8],[9,6]]);
  var g=gcd(t[0],t[1]);
  return{q:`一辆客车沿同一条路线行驶，原来需要 ${t[0]} 小时，提速后现在只要 ${t[1]} 小时。现在的速度与原来的速度之比是多少？（按 a : b 的形式填）`,
    ans:(t[0]/g)+':'+(t[1]/g),ratio:1,unit:u,kp:k,
    exp:`路程相同，速度与时间成反比：速度比 = 原时间 : 现时间 = ${t[0]} : ${t[1]}，化简得 ${t[0]/g} : ${t[1]/g}。时间越短，速度越快。`};
},
f4_granary_ratio:function(u,k){
  var t=pick([[3,4,2,3],[2,5,3,4],[3,5,2,3],[4,7,3,5]]);
  var num=t[2]*t[1],den=t[3]*t[0],g=gcd(num,den);
  return{q:`甲仓库存粮的 ${t[0]}/${t[1]} 和乙仓库存粮的 ${t[2]}/${t[3]} 相等，甲、乙两仓库存粮数量之比是多少？（按 a : b 的形式填）`,
    ans:(num/g)+':'+(den/g),ratio:1,unit:u,kp:k,
    exp:`设相等的量都是 1，则甲 = ${t[1]}/${t[0]}，乙 = ${t[3]}/${t[2]}。甲 : 乙 = ${t[1]}/${t[0]} : ${t[3]}/${t[2]} = ${num} : ${den}，化简得 ${num/g} : ${den/g}。`};
},
f4_move_equal:function(u,k){
  var d=pick([6,8,5]);
  return{q:`把甲班人数的 1/${d} 调到乙班，则两班人数相等。原来甲班与乙班的人数之比是多少？（按 a : b 的形式填）`,
    ans:d+':'+(d-2),ratio:1,unit:u,kp:k,
    exp:`甲班调出 1/${d} 后两队相等 → 乙班原来比甲班少 2×1/${d} = 2/${d} → 乙 = 甲的 ${frac(d-2,d)}。所以甲 : 乙 = ${d} : ${d-2}。`};
},
f4_alcohol_mix:function(u,k){
  var t=pick([[3,1,2,1],[5,1,3,1],[4,1,1,1],[7,1,5,2]]);
  var s1=t[0]+t[1],s2=t[2]+t[3],V=s1*s2/gcd(s1,s2);
  var alc=t[0]*V/s1+t[2]*V/s2,wat=t[1]*V/s1+t[3]*V/s2,g=gcd(alc,wat);
  return{q:`两个容积相同的瓶中装满了酒精溶液，一个瓶中酒精与水的体积之比是 ${t[0]} : ${t[1]}，另一个瓶中是 ${t[2]} : ${t[3]}。把两瓶溶液混合，混合溶液中酒精与水的体积之比是多少？（按 a : b 的形式填）`,
    ans:(alc/g)+':'+(wat/g),ratio:1,unit:u,kp:k,
    exp:`设每瓶容积为 ${V}：第一瓶酒精 ${t[0]*V/s1}、水 ${t[1]*V/s1}；第二瓶酒精 ${t[2]*V/s2}、水 ${t[3]*V/s2}。混合后酒精共 ${alc}、水共 ${wat} → ${alc} : ${wat}，化简得 ${alc/g} : ${wat/g}。`};
},

/* —— 第五单元补充：绕树绳 / 剪最大圆 / 骑车 / 栽树 / 石子路 / 起跑线 —— */
f5_rope_wrap:function(u,k){
  var t=pick([[6,1.16,20],[5,1.3,32.7],[10,0.6,32]]);
  var C=Math.round((t[2]-t[1])/t[0]*100)/100,d=Math.round((t[2]-t[1])/t[0]/3.14*100)/100;
  return{q:`用一条长 ${t[2]} 米的绳子在一棵树的树干上绕 ${t[0]} 圈，还余 ${t[1]} 米。这棵树的树干直径大约是多少米？（π 取 3.14，填数）`,
    ans:String(d),unit:u,kp:k,app:1,
    exp:`绕 ${t[0]} 圈用了 ${t[2]}−${t[1]}=${Math.round((t[2]-t[1])*100)/100} 米 → 一圈（周长）= ${C} 米 → 直径 = ${C} ÷ 3.14 = ${d}（米）。`};
},
f5_max_circle_sq:function(u,k){
  var t=pick([[64,8,25.12],[36,6,18.84],[100,10,31.4],[49,7,21.98]]);
  return{q:`一块正方形钢板的面积是 ${t[0]} 平方分米。要把它剪成一个最大的圆形钢板，得到的圆形钢板的周长是多少分米？（π 取 3.14，填数）`,
    ans:String(t[2]),unit:u,kp:k,app:1,
    exp:`正方形面积 ${t[0]} → 边长 ${t[1]} 分米（${t[1]}×${t[1]}=${t[0]}）。最大圆的直径 = 正方形边长 → 周长 = 3.14×${t[1]} = ${t[2]}（分米）。`};
},
f5_bike_ride:function(u,k){
  var t=pick([[60,200,3768],[70,100,2198],[50,200,3140]]);
  var mins=Math.round(t[2]/(3.14*t[0]/100*t[1])*10)/10;
  return{q:`小明的自行车轮胎的外直径约 ${t[0]} 厘米。若轮胎平均每分钟转 ${t[1]} 圈，小明家离学校约 ${t[2]} 米，他从学校骑车回家大约需要多少分钟？（π 取 3.14，填数）`,
    ans:String(mins),unit:u,kp:k,app:1,
    exp:`轮胎周长 = 3.14×${t[0]} = ${Math.round(3.14*t[0])} 厘米 = ${3.14*t[0]/100} 米；每分钟走 ${3.14*t[0]/100}×${t[1]} = ${Math.round(3.14*t[0]/100*t[1]*100)/100} 米；时间 = ${t[2]} ÷ 每分钟走的 ≈ ${mins}（分钟）。厘米换米要除以 100。`};
},
f5_tree_interval:function(u,k){
  var t=pick([[18.84,6.28],[12.56,3.14],[25.12,6.28],[15.7,3.14]]);
  var n=Math.round(t[0]/t[1]);
  return{q:`一个圆形花坛的周长是 ${t[0]} 米，在它周围每隔 ${t[1]} 米栽一棵树，一共可以栽多少棵？（填数）`,
    ans:String(n),unit:u,kp:k,app:1,
    exp:`封闭图形（圆）上栽树：棵数 = 间隔数 = 周长 ÷ 间隔 = ${t[0]} ÷ ${t[1]} = ${n}（棵）。圆是封闭的，首尾相接，不需要加 1。`};
},
f5_ring_path:function(u,k){
  var t=pick([[18,1],[12,2],[20,1]]);
  var r=t[0]/2,A=Math.round(3.14*((r+t[1])*(r+t[1])-r*r)*100)/100;
  return{q:`公园里有一个圆形花坛，直径 ${t[0]} 米，在它的周围建一条 ${t[1]} 米宽的环形石子路。这条石子路的面积是多少平方米？（π 取 3.14，填数）`,
    ans:String(A),unit:u,kp:k,app:1,
    exp:`内半径 ${r} 米，外半径 ${r+t[1]} 米 → 石子路是环形：3.14×(${r+t[1]}²−${r}²) = 3.14×(${(r+t[1])*(r+t[1])}−${r*r}) = ${A}（平方米）。`};
},
f5_track_start:function(u,k){
  var w=pick([1.2,1.25]),n=pick([6,8]);
  var step=Math.round(2*3.14*w*100)/100,adv=Math.round(step*(n-1)*100)/100;
  return{q:`一条跑道每条赛道宽 ${w} 米。进行长跑比赛时运动员沿各自赛道跑一整圈，第 ${n} 道运动员的起跑线应比第 1 道提前多少米？（相邻赛道半径差 = 道宽；π 取 3.14，填数）`,
    ans:String(adv),unit:u,kp:k,app:1,
    exp:`每往外一道，直径大 ${2*w} 米 → 周长大 3.14×${2*w} = ${step} 米 → 第 ${n} 道比第 1 道多 ${n-1} 个间隔：${step}×${n-1} = ${adv}（米）。`};
},

/* —— 第六单元补充：返程 / 分次运货 / 比几分之几多求整体 / 调人相等求人数 —— */
f6_return_trip:function(u,k){
  var t=pick([[120,2,3,5,6],[100,3,4,5,6],[90,2,5,3,5]]);
  var dist=t[0]*t[1]/t[2],back=Math.round(dist*t[4]/t[3]*100)/100;
  return{q:`一辆汽车从甲地开往乙地，每小时行 ${t[0]} 千米，${t[1]}/${t[2]} 小时到达。原路返回时用了 ${t[3]}/${t[4]} 小时，返回时平均每小时行多少千米？（填数）`,
    ans:String(back),unit:u,kp:k,app:1,
    exp:`先求路程：${t[0]} × ${t[1]}/${t[2]} = ${dist}（千米）；再求返回速度：${dist} ÷ ${t[3]}/${t[4]} = ${dist} × ${t[4]}/${t[3]} = ${back}（千米/时）。`};
},
f6_cargo_three:function(u,k){
  /* v3.3.3：答案最简分数（原来 8.43/26.666… 这类小数与浮点误差） */
  var t=pick([[91,2,3,5,9],[60,1,4,2,15],[80,3,4,3,20]]);
  var movedNum=t[0]*t[3],movedDen=t[1]*t[4];
  var eachNum=movedNum,eachDen=movedDen*t[2];
  var moved=frac(movedNum,movedDen),each=frac(eachNum,eachDen);
  var W=frac(t[0],t[1]);
  return{q:`一堆货物共 ${W} 吨，一辆货车 ${t[2]} 次运了它的 ${t[3]}/${t[4]}。这辆货车平均每次运多少吨？（填最简分数或整数）`,
    ans:each,unit:u,kp:k,app:1,
    exp:`先求 ${t[2]} 次一共运的：${W} × ${t[3]}/${t[4]} = ${movedNum}/${movedDen} = ${moved}（吨）；再求平均每次：${moved} ÷ ${t[2]} = ${each}（吨）。`};
},
f6_duck_chicken:function(u,k){
  var t=pick([[240,2,5,40],[180,3,4,30],[150,2,3,20],[96,3,8,12]]);
  var chick=(t[0]-t[3])*t[2]/t[1];
  return{q:`养殖场有鸭 ${t[0]} 只，比鸡的只数的 ${t[1]}/${t[2]} 多 ${t[3]} 只。鸡有多少只？（填数）`,
    ans:String(chick),unit:u,kp:k,app:1,
    exp:`鸭比鸡的 ${t[1]}/${t[2]} 多 ${t[3]} 只 → 先减掉多出的：${t[0]}−${t[3]}=${t[0]-t[3]}（只），正好是鸡的 ${t[1]}/${t[2]}。鸡 = ${t[0]-t[3]} ÷ ${t[1]}/${t[2]} = ${t[0]-t[3]} × ${t[2]}/${t[1]} = ${chick}（只）。`};
},
f6_class_move:function(u,k){
  var d=pick([8,6,5]),diff=pick([10,12,8]);
  var per=diff/2,cls1=d*per;
  return{q:`某校六年级一班人数的 1/${d} 调入二班后，两班人数正好相等。已知原来一班比二班多 ${diff} 人，原来一班有多少人？（填数）`,
    ans:String(cls1),unit:u,kp:k,app:1,
    exp:`一班调出 1/${d} 后两班相等 → 原来一班比二班多 2 份，每份是全班的 1/${d} → 一班 : 二班 = ${d} : ${d-2}。相差 ${d-(d-2)} 份 = ${diff} 人 → 每份 ${per} 人 → 一班 = ${d}×${per} = ${cls1}（人）。`};
},

/* —— 第七单元补充：出席率 / 发芽率 / 补种成活 / 合打书稿 / 折扣 / 超产 / 涨价 / 读书计划 —— */
f7_attend_rate:function(u,k){
  var t=pick([[200,10,95],[160,4,97.5],[80,2,97.5],[120,12,90],[90,9,90]]);
  return{q:`六年级有 ${t[0]} 名学生，今天缺席 ${t[1]} 人。六年级学生今天的出席率是多少？（填如 95% 的形式）`,
    ans:t[2]+'%',unit:u,kp:k,app:1,
    exp:`出席率 = 出席人数 ÷ 总人数 × 100% = (${t[0]}−${t[1]}) ÷ ${t[0]} = ${t[0]-t[1]} ÷ ${t[0]} = ${t[2]}%。先算实际出席的人数。`};
},
f7_sprout_rate:function(u,k){
  var t=pick([[100,10],[200,20],[150,30],[300,25],[180,20]]);
  var rate=Math.round(t[0]/(t[0]+t[1])*100);
  return{q:`将一包种子做发芽试验，其中发芽的有 ${t[0]} 粒，没有发芽的有 ${t[1]} 粒。这包种子的发芽率是多少？（填如 90% 的形式）`,
    ans:rate+'%',unit:u,kp:k,app:1,
    exp:`发芽率 = 发芽粒数 ÷ 总粒数 × 100% = ${t[0]} ÷ (${t[0]}+${t[1]}) = ${t[0]} ÷ ${t[0]+t[1]} = ${rate}%。分母是"发芽 + 没发芽"的总数。`};
},
f7_survive_replant:function(u,k){
  var t=pick([[100,5],[200,10],[150,6],[80,4]]);
  var rate=Math.round(t[0]/(t[0]+t[1])*1000)/10;
  return{q:`园林工人种了 ${t[0]} 棵树苗，其中 ${t[1]} 棵没有成活，又补种了 ${t[1]} 棵，全部成活。这批树苗的成活率是多少？（百分号前保留一位小数，填如 95.2% 的形式）`,
    ans:rate+'%',unit:u,kp:k,app:1,
    exp:`成活棵数 = (${t[0]}−${t[1]})+${t[1]} = ${t[0]} 棵；总棵数 = ${t[0]}+${t[1]} = ${t[0]+t[1]} 棵。成活率 = ${t[0]} ÷ ${t[0]+t[1]} × 100% ≈ ${rate}%。分母要把补种的也算进去！`};
},
f7_share_work:function(u,k){
  var t=pick([[240,160],[300,100],[210,140],[180,220]]);
  var total=t[0]+t[1],p1=t[0]/total*100,p2=100-p1;
  return{q:`小明和小亮合打一本书稿，小明打了 ${t[0]} 页、小亮打了 ${t[1]} 页后书稿全部完成。小明打了这本书稿的百分之几？（填如 60% 的形式）`,
    ans:p1+'%',unit:u,kp:k,app:1,
    exp:`总页数 = ${t[0]}+${t[1]} = ${total}（页）。小明：${t[0]} ÷ ${total} × 100% = ${p1}%（小亮打了 ${p2}%）。两人的分率合起来正好是 100%。`};
},
f7_discount_pct:function(u,k){
  var t=pick([[3600,3060,85],[2800,2520,90],[4500,4050,90],[3200,2880,90],[5000,4250,85]]);
  return{q:`一台空调原价 ${t[0]} 元，现在的优惠价是 ${t[1]} 元。现价是原价的百分之几？（填如 85% 的形式）`,
    ans:t[2]+'%',unit:u,kp:k,app:1,
    exp:`现价 ÷ 原价 × 100% = ${t[1]} ÷ ${t[0]} = ${t[2]}%。"是谁的百分之几"就除以谁——这里的单位 1 是原价。`};
},
f7_plan_extra:function(u,k){
  var t=pick([[3600,900,125],[2400,600,125],[5000,1000,120],[4500,900,120]]);
  return{q:`某公司计划首批生产 ${t[0]} 支点读笔，实际比计划多生产了 ${t[1]} 支。实际产量是计划产量的百分之几？（填如 125% 的形式）`,
    ans:t[2]+'%',unit:u,kp:k,app:1,
    exp:`实际产量 = ${t[0]}+${t[1]} = ${t[0]+t[1]} 支。实际 ÷ 计划 = ${t[0]+t[1]} ÷ ${t[0]} = ${t[2]}%。百分数可以大于 100%，表示超过单位 1。`};
},
f7_price_rise:function(u,k){
  var t=pick([[23.5,17.5],[12.8,11.2],[9.6,8.4],[15.4,14]]);
  var v=Math.round((t[0]-t[1])/t[1]*1000)/10;
  return{q:`某地今年的猪肉零售价为 ${t[0]} 元/千克，去年为 ${t[1]} 元/千克。猪肉零售价今年比去年涨了百分之几？（结果保留一位小数，填如 34.3% 的形式）`,
    ans:v+'%',unit:u,kp:k,app:1,
    exp:`涨的部分 ÷ 去年价格（单位 1）：(${t[0]}−${t[1]}) ÷ ${t[1]} = ${t[0]-t[1]} ÷ ${t[1]} ≈ ${v}%。除不尽时百分号前保留一位小数。`};
},
f7_read_two_days:function(u,k){
  var t=pick([[320,64,60],[200,40,50],[400,80,55],[250,50,52]]);
  var d2=Math.round(t[1]/t[0]*100),first=t[2]-d2;
  return{q:`小强看了一本 ${t[0]} 页的故事书。第一天看了若干页，第二天看了 ${t[1]} 页，两天共看了这本书的 ${t[2]}%。第一天看了这本书的百分之几？（填如 40% 的形式）`,
    ans:first+'%',unit:u,kp:k,app:1,
    exp:`第二天占的：${t[1]} ÷ ${t[0]} = ${d2}%；第一天占的 = 两天合计 − 第二天 = ${t[2]}% − ${d2}% = ${first}%。单位 1 相同时，百分率可以直接相加减。`};
},

/* —— 第七单元 方向与位置（2026 新版课本）—— */
f7_coord:function(u,k){
  var t=pick([[3,2],[1,4],[5,2],[6,5],[2,3],[4,1],[5,6],[2,5]]);
  var mode=R(2);
  if(mode===0)return{q:`军训队列中，王强的位置在第 ${t[0]} 列第 ${t[1]} 行。用数对表示他的位置是？（按 a,b 的形式填，如 3,2）`,
    ans:t[0]+','+t[1],unit:u,kp:k,
    exp:`数对（列，行）：竖排叫列（从左往右数），横排叫行（从前往后数）。第 ${t[0]} 列第 ${t[1]} 行 → (${t[0]},${t[1]})。前面的数表示列，后面的数表示行。`};
  return{q:`张亮的位置用数对表示是（${t[0]}，${t[1]}）。他在第几列第几行？（按"第a列第b行"的形式填）`,
    ans:`第${t[0]}列第${t[1]}行`,unit:u,kp:k,
    exp:`数对（${t[0]}，${t[1]}）：前面的数表示列 → 第 ${t[0]} 列；后面的数表示行 → 第 ${t[1]} 行。`};
},
f7_coord_move:function(u,k){
  var c=1+R(5),r=1+R(4);
  return{q:`赵军用数对（${c}，${r}）表示自己的位置。他向后移动 2 行（还在同一列），新的位置用数对表示是？（按 a,b 的形式填）`,
    ans:c+','+(r+2),unit:u,kp:k,
    exp:`"向后移动"是行数增加：列不变 ${c}，行 ${r}+2=${r+2} → (${c},${r+2})。数对里列在前、行在后，移动时只变对应的那个数。`};
},
f7_direction:function(u,k){
  var t=pick([[40,10,'北偏西'],[30,20,'北偏东'],[60,15,'南偏东'],[35,25,'南偏西'],[50,30,'北偏东']]);
  return{q:`以指挥部为观测点，红军阵地在${t[2]} ${t[0]}°方向 ${t[1]} 千米处。要准确确定红军阵地的位置，必须知道哪两个要素？`,
    ops:shuffle(['方向和距离','只说方向就行','只说距离就行','时间和速度']),ans:'方向和距离',unit:u,kp:k,
    exp:`确定平面内一个物体的准确位置：先确定观测点，还需要知道物体相对于观测点的<b>方向</b>和<b>距离</b>。只说方向有无数个点，只说距离是一个圆，都不能定位置。`};
},
f7_direction_read:function(u,k){
  var t=pick([[40,10,'北偏西','红军阵地'],[50,20,'北偏东','蓝军阵地'],[65,15,'南偏东','雷达站'],[45,12,'南偏西','巡洋舰']]);
  return{q:`以雷达站为观测点，某舰艇在${t[2]} ${t[0]}°方向 ${t[1]} 千米处。下面哪种说法是准确的？`,
    ops:shuffle([`${t[3]}在${t[2]} ${t[0]}°方向 ${t[1]} 千米处`,`${t[3]}在${t[2]}方向 ${t[1]} 千米处（没说角度）`,`${t[3]}在${t[2]} ${t[0]}°方向（没说距离）`,`${t[3]}在雷达站${t[1]} 千米处（没说方向）`]),
    ans:`${t[3]}在${t[2]} ${t[0]}°方向 ${t[1]} 千米处`,unit:u,kp:k,
    exp:`准确描述位置三件套：观测点 + 方向（含角度，以南北为基准说"北偏X/南偏X"）+ 距离。三缺一都不准确。`};
},
f7_route:function(u,k){
  var t=pick([['蓝军阵地',50,'北偏东',20],['大沙河',35,'南偏西',15],['宿营地',60,'北偏西',25]]);
  return{q:`从指挥部出发去${t[0]}：先向北偏东 40° 方向走 10 千米到达中转站，再向${t[2]} ${t[1]}° 方向走 ${t[3]} 千米就到了。去程一共走了多少千米？（填数）`,
    ans:String(10+t[3]),unit:u,kp:k,app:1,
    exp:`描述行走路线要一段一段说清"方向 + 距离"。总路程 = 各段相加：10 + ${t[3]} = ${10+t[3]}（千米）。`};
},

rev_mix:function(u,k){
  var pool=[];
  UNITS.slice(0,7).forEach(function(un){un.kps.forEach(function(kp){kp.gens.forEach(function(g){if(!GENS[g])return;pool.push({g:g,u:un.id,k:kp.id})})})});
  var t=pick(pool);
  var q=GENS[t.g](t.u,t.k);
  q.unit='8';q.kp=k;
  return q;
}
};


/* 生成器分级表（1 易 / 2 中 / 3 挑战）——出题器按难度调配 */
var GENLVL={
 f1_int:1,f1_int_app:2,f1_ff:1,f1_ff_err:2,f1_of:2,f1_of_chain:3,f1_int_money:1,f1_milk_half:2,f1_class_boys:2,f1_school_hours:1,f1_road2:3,f1_unit_conv:1,f1_compare_size:1,f1_triple_chain:2,f1_more_less:3,f1_steel_left:2,f1_rect_diff:3,
 f2_certain:1,f2_size:2,f2_score:3,f2_turntable:1,f2_dice:2,f2_cards:2,f2_expect:3,f2_experiment:2,f2_coin_fair:1,f2_spinner_mini:1,f2_two_draw:2,f2_paint_design:2,
 f3_recip:1,f3_div:1,f3_find_whole:2,f3_div_err:3,f3_daily_read:2,f3_paper_share:1,f3_milk_cups:1,f3_print_time:3,f3_rope_total:2,f3_bucket:2,f3_solve_equation:2,f3_read_remain:2,f3_price_drop:3,f3_train_trip:2,f3_tunnel_two:3,f3_paper_stack:2,f3_swim_run:3,
 f4_simplify:1,f4_value:1,f4_share:2,f4_share_app:2,f4_prop_err:3,f4_sugar_water:2,f4_salt_water:2,f4_class_ratio:1,f4_concrete:3,f4_work_ratio:3,f4_speed_time_ratio:2,f4_granary_ratio:3,f4_move_equal:3,f4_alcohol_mix:3,
 f5_rd:1,f5_concept:1,f5_c:2,f5_halfc:3,f5_s:2,f5_ring:3,f5_fountain:1,f5_roll:2,f5_compass:2,f5_grass:3,f5_rope_wrap:2,f5_max_circle_sq:2,f5_bike_ride:3,f5_tree_interval:1,f5_ring_path:3,f5_track_start:3,
 f6_order:1,f6_dist:2,f6_multi:3,f6_two_days:2,f6_price_mix:2,f6_budget:1,f6_remain_frac:2,f6_return_trip:2,f6_cargo_three:3,f6_duck_chicken:2,f6_class_move:3,
 f7_coord:1,f7_coord_move:2,f7_direction:1,f7_direction_read:1,f7_route:2,
 rev_mix:2
};

var CHEAT=[
 ['分数乘整数','分子乘整数，分母不变（课本：编中国结 2/3×4）','3/8 × 4 = 3/2'],
 ['一个数乘分数','求一个数的几分之几，用乘法','3/4 × 2/5 = 3/10'],
 ['连续求几分之几','连乘；画线段图理清谁是谁的几分之几','96 × 1/3 × 5/8 = 20'],
 ['倒数','乘积是 1；分子分母换位；0 没有倒数','3/5 ↔ 5/3'],
 ['分数除法','甲÷乙（0除外）= 甲乘乙的倒数','4/5 ÷ 2/5 = 2'],
 ['已知部分求整体','单位 1 未知 → 除法或方程；用乘法检验','280 ÷ 2/5 = 700'],
 ['比与比值','a:b = a÷b，比值是一个数；后项不能为 0','6:4 比值 3/2'],
 ['化简比','前项后项同乘同除同一个数（0除外）','12:18 = 2:3；1.25:0.4 = 25:8'],
 ['按比例分配','总份数→每份→乘份数','50 按 2:3 → 20 和 30'],
 ['圆心 / 半径 / 直径','圆心定位置，半径定大小，d=2r；一中同长','r=5 则 d=10'],
 ['圆的周长','C = πd = 2πr（π=3.14）','d=32 → C=100.48'],
 ['半圆周长','πr + 2r（弧+直径）','r=6 → 18.84+12=30.84'],
 ['圆的面积','S = πr²（切扇形拼长方形推出来）','r=10 → 314'],
 ['环形面积','外圆面积 − 内圆面积：π(R² − r²)','R=5,r=3 → 50.24'],
 ['稍复杂的分数乘法','求比一个数多/少几分之几的数：先算分率再乘','144×(1+1/8)=162'],
 ['较复杂的分数除法','已知比一个数多/少几分之几的数求这个数','225÷(1−1/4)=300'],
 ['用数对确定位置','（列，行）竖排列从左数，横行从前往后','(3,2)=第3列第2行'],
 ['方向与距离定位置','观测点+方向（北偏X/南偏X含角度）+距离','北偏西40°方向10千米'],
 ['描述行走路线','一段一段说：起点→方向→距离→到达','先北偏东50°走20千米，再…'],
 ['可能性','数量多→可能性大；可能性=数量÷总数','6球2红 → 摸红 = 1/3']
];
;

regBook({
  id:'qd6a',
  name:'六年级上册',
  grade:6, semester:'上',
  color:'#E8833A',
  edition:'2026年7月第1版（2022课标修订）',
  intro:'分数乘除、比、圆、解决问题、可能性、方向与位置',
  mapFlow:'学习顺序：分数乘法 → 分数除法 → 比 → 圆 → 解决问题 → 可能性 → 方向与位置 → 总复习',
  mapWhy:'分数乘法是地基 → 除法是乘法的逆运算 → 比（除法关系的一种表达）→ 圆是独立的图形线（周长面积要用小数乘法）→ 解决问题把分数乘除串起来（比一个数多/少几分之几）→ 可能性用分数表达大小 → 方向与位置用数对和角度定位置。',
  UNITS:UNITS,
  BOARDS:BOARDS,
  GENS:GENS,
  GENLVL:GENLVL,
  CHEAT:CHEAT
});
})();
