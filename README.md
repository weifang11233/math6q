# 数学乐园 · 青岛版（全 12 册 · 童趣版）

家庭自用的青岛版（六三制）小学数学练习应用。覆盖 **1~6 年级上下册共 12 册**，题目由生成器现场编造（数字随机、答案现算），做到做不完、不重复、可无限练。

前端是**零依赖单文件** `index.html`（约 200KB，含童趣皮肤），课本题库外置为 `books/*.js`（按册加载）；配套零依赖 Node 服务端提供账号同步、学习存档与模型健康巡检。断网可用、无追踪、无第三方统计。

> 当前线上版本：**v3.11.0-fourlv-1**

---

## 一、目录结构

```
math6q/
├── index.html              # 前端主程序（单文件，含全部视图/判分/容灾逻辑）
├── books/                  # 课本题库：12 册 + 2 个公共生成器库（按年级顺序引入）
│   ├── common-gen.js       #   通用生成器库（数与运算、统计图、折扣等）
│   ├── common-gen2.js      #   通用生成器库（几何、比例、百分数等）
│   └── book-qd1a.js … qd6b.js   # 一年级上 … 六年级下
├── server/
│   ├── server.js           # 云端同步 API（零依赖 Node，账号/存档/会话/巡检）
│   └── _test.js            # 服务端端到端测试（46 项）
├── deploy/
│   ├── nginx.conf          # 反向代理模板（占位符，真实 Key 不入库）
│   └── docker-compose.yml  # 站点 + API 两个容器
├── tests/
│   ├── smoke.js            # 前端冒烟（DOM stub 真实执行，95 项）
│   ├── run-all.js          # 全量回归入口
│   └── v3/                 # v3 功能套件（四步法/注册策略/脱敏/体检）
└── README.md
```

---

## 二、功能

| 模块 | 说明 |
|---|---|
| 📚 按单元学 | 按当前课本逐单元知识卡，过关检验**连对 5 题点亮** |
| 🎲 智能出题器 | 按单元 + 三档难度（基础/提高/挑战）现场出题，答案现算 |
| 📝 应用题特训 | 每单元应用题连刷，支持完整过程作答与拍照上传 |
| 🪜 应用题四步法 | **v3.11 新增**：可选单元 + 选难度出题，含降级链与去重 |
| 🤖 AI 智能判分 | 过程/照片由家庭 LLM 网关判分；**20 个候选模型自动故障转移** |
| 📕 错题本 | 答错自动收录，隔日到期重考；支持拍照收题并入 |
| 📋 摸底测试 / 🗺 一图看全册 / 🧩 按板块攻 / 📖 速查大表 | 诊断与速查 |
| 📊 学习报告 | 各单元正确率、薄弱预警、按日/按单元统计 |
| 👥 多用户 | 手机号注册，密码加盐 SHA-256；**数据存 NAS，多设备同步** |
| 🛡 管理员后台 | 账号管理、封禁、11 个模块逐项授权、**禁止开放注册开关** |

---

## 三、部署

### 3.1 NAS（飞牛 fnOS，当前生产环境）

线上目录 `vol3/1000/docker/shuxueleyuan/`，由 nginx 容器挂载：

```
shuxueleyuan/
├── nginx.conf          # 用 deploy/nginx.conf 替换占位符后放这里
├── docker-compose.yml
├── site/
│   ├── index.html
│   └── books/*.js
└── api-server/
    ├── server.js
    └── data/           # 运行时数据（账号/存档/会话），升级不要覆盖
```

启动：

```bash
docker compose up -d
```

升级前端（只覆盖程序文件，**不动 data/**）：

```bash
cp index.html  <站点目录>/site/index.html
cp books/*.js  <站点目录>/site/books/
```

升级服务端（需重启容器才生效）：

```bash
cp server/server.js <站点目录>/api-server/server.js
docker restart shuxue-api
```

改 nginx 配置后 reload：

```bash
docker exec shuxueleyuan nginx -s reload
```

### 3.2 凭证配置（重要）

仓库内所有凭证均为**示例值**，真实凭证不入库：

| 项 | 仓库内 | 线上如何提供 |
|---|---|---|
| AI 网关 API Key | `deploy/nginx.conf` 里的 `__LLM_API_KEY__` | 替换占位符后写入 NAS 的 `nginx.conf`（该成品文件已被 `.gitignore` 排除） |
| AI 网关地址 | `__LLM_GATEWAY_HOST__` | 同上，例 `192.168.31.88:3065` |
| API 服务地址 | `__API_SERVER_HOST__` | 同上，例 `192.168.31.88:8877` |
| 管理员账号 | `13455656547`，密码 `Change@Me2026`（示例） | 生产环境用环境变量覆盖，见下 |

生成自己的管理员凭证：

```bash
node -e "const c=require('crypto');const s='你的salt';const p='你的密码';console.log('SALT='+s);console.log('HASH='+c.createHash('sha256').update(s+'::'+p).digest('hex'))"
```

然后通过环境变量注入（不改代码、不进仓库）：

```yaml
environment:
  - QD6_ADMIN_SALT=xxxxxxxxxxxxxxxx
  - QD6_ADMIN_HASH=<上一步算出的 hash>
```

> `server.js` 仅在**用户表里还没有该管理员**时才用这组常量建号；一旦建好，登录校验走 `users.json` 里各账号自己的 salt/hash，改常量不影响已有账号。

### 3.3 纯前端单机使用

把 `index.html` 与 `books/` 整个目录一起拷到设备，用系统浏览器打开 `index.html` 即可（`books/` 必须同级同目录，否则题目加载不出来）。数据存浏览器 localStorage；隐私模式/IDE 预览面板会禁用存储，此时自动降级内存模式并在顶部提示。

---

## 四、技术要点

- **零依赖零构建**：前端单文件 + 原生 JS；服务端仅用 Node 内置模块（`http`/`crypto`/`fs`）。
- **课本外置**：`index.html` 先执行注册表脚本，再按顺序引入 `books/*.js`，最后执行主逻辑。**加载顺序不能改**，否则生成器为空。
- **账号与存档**：服务端 JSON 原子写 + 双备份（`users.json.bak1/bak2`）+ 乐观锁 `rev`（冲突 409，前端字段级合并重试）。token 30 天。
- **AI 容灾链**：`aiRequest()` 统一出口，超时（文本 8s / 视觉 15s）、错误分类、每模型重试 1 次、退避 400ms→2s、连续失败 3 次熔断、冷却 60s→10min，20 个候选模型失效即切下一个；服务端每天 8/12/17 巡检并把坏模型写进 `data/model_health.json`，前端据此跳过。
- **判分正确性优先**：AI 挂掉不等于答错——先走本地判分兜底（数值/比值题可精确判定），AI 仅做复核与错因点评，不得另算标准答案。
- **权限**：`go()` 统一导航网关 + 各功能入口 `permGate()` 双重守卫；管理员端点全部在 `/api/admin/` 前缀下强制校验 `role==='admin'`。
- **分数渲染**：分子在上分母在下（`rich()`），答案判定同时接受 `3/4` 与 `0.75`。

---

## 五、回归测试

```bash
node tests/run-all.js          # 全量（9 个套件，约 2 分钟）
node tests/smoke.js            # 只跑前端冒烟
node server/_test.js           # 只跑后端端到端
```

覆盖范围：

| 套件 | 断言数 | 覆盖 |
|---|---|---|
| `tests/smoke.js` | 95 | 启动/首页渲染/注册登录/权限门/封禁/AI 配置/存储降级 |
| `server/_test.js` | 46 | 账号/存档乐观锁/管理员/双备份恢复/重启不丢 |
| `tests/v3/_test_four_lv.js` | 79 | 12 册四步法出题/降级链/去重/空态/权限 |
| `tests/v3/_test_regpolicy.js` | 19 | 禁止开放注册端到端（含持久化） |
| `tests/v3/_test_regpolicy_front.js` | 19 | 注册开关显隐/保存/离线分支 |
| `tests/v3/_test_desensitize.js` | 26 | 仓库零真实凭证/冷启动管理员可登录 |
| `tests/v3/_audit_all_generators.js` | 8340 样本 | 答案缺失/选项重复/模板残留 |
| `tests/v3/_verify_discount_bug.js` | 400 样本 | 折扣题题面与答案一致性 |
| `tests/v3/_verify_redraw_gain.js` | 12 册 | 四步法题面去重效果 |

改动或部署前建议跑 `node tests/run-all.js`。

---

## 六、升级与回滚纪律

线上曾出现「本地基准过期、直接覆盖会回退线上加固」的事故苗头，因此固定为：

1. **改前先从线上拉当前文件**作唯一基准，不要用本地旧副本覆盖；
2. **部署前**备份线上旧程序文件 + 数据目录全量快照；
3. **只覆盖程序文件**（`index.html` / `books/*.js` / `server.js`），**绝不触碰 `data/`**；
4. **部署后**逐文件哈希比对数据与基线一致，并跑一遍 `tests/run-all.js`；
5. 比对文件差异时加 `--strip-trailing-cr`（线上是 CRLF，否则整文件被判全变）。

---

## 七、未入库内容说明

以下内容按隐私与体积考虑**故意不入库**（见 `.gitignore`）：

- `server/data/`、`api-server/data/`：真实账号表、学习存档、会话、学生姓名 —— 隐私数据；
- `deploy/nginx.conf.live`：含真实 API Key 的部署成品；
- 部署备份目录与线上快照：仅作本地回滚用。

---

## License

MIT
