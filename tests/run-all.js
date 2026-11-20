/* 全量回归入口：一次跑完前端冒烟 + 后端端到端 + v3 功能套件。
   用法：node tests/run-all.js
   说明：任一子套件失败则整体退出码非 0，可直接用于部署前守门。 */
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SUITES = [
  ['前端冒烟（DOM stub 真实执行首页/权限/AI 配置）', 'tests/smoke.js'],
  ['后端端到端（账号/存档/管理员/备份恢复）', 'server/_test.js'],
  ['四步法跨 12 册（选单元+难度/降级链/去重）', 'tests/v3/_test_four_lv.js'],
  ['注册策略端到端（v3.10 禁止开放注册）', 'tests/v3/_test_regpolicy.js'],
  ['注册策略前端（开关显隐/保存/离线）', 'tests/v3/_test_regpolicy_front.js'],
  ['凭证脱敏与冷启动管理员可登录', 'tests/v3/_test_desensitize.js'],
  ['全 12 册生成器自洽性体检', 'tests/v3/_audit_all_generators.js'],
  ['折扣题答案一致性专项', 'tests/v3/_verify_discount_bug.js'],
  ['四步法去重改善专项', 'tests/v3/_verify_redraw_gain.js'],
];

let failed = [];
console.log('════════════ 全量回归 ════════════\n');
for (const [name, file] of SUITES) {
  process.stdout.write('▶ ' + name + '\n');
  const r = spawnSync(process.execPath, [path.join(ROOT, file)], {
    cwd: ROOT, encoding: 'utf8', timeout: 300000,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  const tail = out.trim().split('\n').filter(l => /结果|PASS \d+ \/ FAIL|通过 \/|✓ 未发现|未发现问题|持平|表.{0,4}体/.test(l));
  tail.slice(-3).forEach(l => console.log('   ' + l.trim()));
  if (r.status !== 0) {
    failed.push(name);
    console.log('   ✗ 失败（退出码 ' + r.status + '）');
    out.trim().split('\n').filter(l => /FAIL|✗|Error/.test(l)).slice(0, 6).forEach(l => console.log('     ' + l.trim()));
  } else {
    console.log('   ✓ 通过');
  }
  console.log('');
}

console.log('════════════ 汇总 ════════════');
if (failed.length === 0) {
  console.log('全部 ' + SUITES.length + ' 个套件通过');
  process.exit(0);
} else {
  console.log('失败 ' + failed.length + ' / ' + SUITES.length + ' 个套件：');
  failed.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
