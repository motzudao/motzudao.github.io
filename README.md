# 默孜.道 · 官网

> 知行子按对 motzu 的了解起草 · v1 2026-07-06 · v2 2026-07-11 · 咖啡区+SEO 2026-07-11 · v3「织机」2026-10-06 · **v6「鲲」2026-10-08（分支 v6-kun，本地 :8768，未上线）**
> 纯静态、零构建。首页自写 JS 多（天上织鲲 / 两面湖 / 卦 / 赛道 / 复制），外加 GA4 匿名统计 + Google Fonts（挂了有系统字兜底）。

## v6「鲲」（2026-10-08 · 分支 v6-kun · 本地预览 :8768）

motzu 的话：「用 8769 织机版的正文，上面白天的湖，下面 8767 的夜湖。」（他说的「8747」一直指织机版——它 10-06 晚在 main 工作区做出来、22:46 才存进 v3-loom 分支。）

- **正文**＝v3「织机」原样：名·道·事·器·观·则·门·☕、子夜丝底金纬、64 卦格、每件工具配一卦、则＝第 30 公里那面墙、右侧 42.195 公里赛道。日志页、404、llms.txt、sitemap 也用织机版。
- **上端**＝白天的湖（取自「徐」）：天上整片是阴阳爻织机（每六爻一卦，鲲的图样与抖动取自织机），墨色的鲲在右岸贴水面跃出，倒影由 WebGL 折进水里、越往近岸越淡；左岸站「默孜.道」（朱砂「.道」）和「默孜」印。进站一根朱砂纬线从水面往上织、浑水沉清；指上去读卦，点天上或按「化」→ 鹏（变爻闪朱砂、离水溅涟漪）。
- **湖→正文**：湖的近岸往下一层层暗，沉进北冥——接织机的子夜丝底。导航在湖面上是墨字，沉下去后换回织机的样子。
- **下端**＝「融」的夜湖原样（月亮、保此道者不欲盈、每 4.2195 秒一滴、知行子那一条旁注），替换了织机原来的终点（42.195 里程表、千里之行、道生一）。赛道走到底就是夜湖。
- 调试：`index.html?debug` 挂 `window.__kun`（`weave._jump('peng'|'kun')`、`day._step(n)`）。

## v3「织机」设计（2026-10-06）

- 世界：子夜丝底 + 金纬 + 打孔卡米白，朱砂只给「默」印和「则」那面墙。全站同一套 token（index / notes / 404 各自内联一份）。
- 首屏织机（canvas）：图里没有像素，全是阴阳爻——阳爻整、阴爻断，**每六爻一卦**（初爻在下，阳=1，按二进制可逐格读卦）。开场先织「鲲」，再一爻一爻「化」成「鹏」（变爻会闪）；点图或按「化」再变一次。带 `#锚点` 进站或系统开了「减少动态」则不演开场，直接是鹏。
- 64 卦表：`index.html` 里 `const GUA`，按二进制值索引 → [文王序, 卦名]。由八卦上下卦生成、三路校验（文王序两两非覆即变 / 伏羲序 = 63→0 / Unicode 卦名抽查）。**别手改**；要改先跑校验。
- 器区每件工具配一卦当印（升/节/屯/井/复/中孚/艮/恒），事区 学=蒙、造=大畜、跑=乾，名=谦，缠=咸，穿=坎——纯设计取意，换卦只改 `data-g="卦名"`。
- 右侧赛道（≥1360px 宽才显示，窄屏是右下角里程小牌）：一页 = 42.195 公里，各段落在固定公里数（则 = 30km 撞墙）。离开时把公里数存本机 localStorage，回来插一面朱砂小旗。
- 「跑」格的上海马拉松倒数按 2026-12-06 自动算；过了日子自动改成「跑过了，记录写在『穿』」。

## 待 motzu 补（v3 换皮时标出，未代写）

- 穿：开篇写「2026-10-04 KLSCM……十二周后，这一页见分晓」——日子已过，等你的 KLSCM 结果写新一篇。
- 缠：路标里「下单一台 128GB MacBook Pro——它未来的家」已被现实改写（家的硬件后来换了）。日志按日期是当时的真话，没改；等你写新一篇时更新。首页「缠」卡片与「造」格里的「家里一台机器」已改成「家里」。
- 器区没上架「第一块钱 · 价目表」：它会把表交进你的老师表格，还列着学校名——公开挂首页等于对全网开放提交入口。要上再说。

## 结构

```
index.html   织机首屏 → 名（鸣谦贞吉）→ 道（0→63 卦格）→ 事（学·造·跑）→ 器（8 件工具）→ 观（缠/穿日志入口）
             → 则（六条）→ 门（其他站点，陆续增加）→ ☕（BTC/ETH 已上线）
apps/        单文件 app 镜像（源头在 ~/Projects/*，勿直接改这里）
  snowball / qianjin / rabbithole / luozi / jianxi / sub5
notes/       观测日志
  chan.html  缠 The Entanglement —— 我和一个 AI（知行子搬家线）
  chuan.html 穿 The Tunneling —— 马拉松线（破五挂这里）
publish.sh   手动同步 apps/ 镜像（改了源头 app 就跑一次；不自动化）
deploy.sh    一键发布：publish.sh → commit → push（手动跑，发布必须人手触发）
后台.html     本地后台（gitignore，不发布）：站点心跳 + 看板外链 + 更新流程 + 接入清单
favicon.svg  默字朱砂印（纯 SVG）｜404.html 自定义 404（「无」）
robots.txt   全站可抓 + 明确欢迎 AI 爬虫（GPTBot/ClaudeBot/Perplexity 等）
sitemap.xml  11 个 URL
llms.txt     给 AI 引擎读的站点说明（llmstxt.org 格式，AEO 核心件）
CNAME        motzu.io（Pages 自定义域名）
```

## SEO / AEO 已配置（2026-07-11）

- 每页：`<title>` + description + **canonical** + Open Graph + Twitter card
- 结构化数据（JSON-LD）：首页 = WebSite + Person + ItemList(5 工具 SoftwareApplication)；日志页 = Article
- robots.txt + sitemap.xml + llms.txt
- ⚠️ **canonical 域名按 `https://motzu.io` 预填**（motzu 已选定、尚未购买）。若最终域名不同：全站搜替 `https://motzu.io` 一次即可（index/notes/robots/sitemap/llms 共 5 处文件）
- 未做（文字先落地，图片是后话）：og:image 社交卡图、favicon。有图之后补
- 部署后建议：Google Search Console 提交 sitemap（要 motzu 的 Google 账号，他自己来）

## ☕ 咖啡区（已上线）

- BTC `bc1qelc50qkpjkwuw4t7cyq05frhy3twct0au8zvf4`（bech32 校验和已验证 + 链上零历史全新地址）
- ETH `0x8DF3aEC6D9eDa4863f23460a8CF7FfaAA6684B2C`（格式已验证 + 链上零历史全新地址）
- 2026-07-11 由 motzu 提供；页面带一键复制 + 「核对首尾四位」提醒

## 本地预览

```bash
python3 -m http.server 8747 --directory ~/Projects/motzudao-site
# 或 preview 面板：launch.json 配置名 motzudao-site
```

## 部署（motzu 点头后）

```bash
cd ~/Projects/motzudao-site
git init && git add -A && git commit -m "官网 v2"
gh repo create motzudao/motzudao.github.io --public --source=. --push
# Settings → Pages → Deploy from branch main
# 域名到手后：repo 根加 CNAME 文件（内容一行 motzu.io）+ DNS 配 A/CNAME 指向 GitHub Pages
```

## 部署状态（2026-07-11）

- ✅ motzu.io 已购（Porkbun，2026-07-10，续费 2027-07-10 前）
- ✅ repo `motzudao/motzudao.github.io` 已推送，Pages 已构建，CNAME=motzu.io 已登记
- ⏳ DNS：等 motzu 在 Porkbun 开域名 API Access → 知行子 API 配 A×4 + www CNAME (+AAAA×4)
- ⏳ DNS 生效后：GitHub 自动签 HTTPS 证书 → 开 https_enforced → 终验

## Google Analytics 4（✅ 已接 2026-07-11）

- Measurement ID：`G-W48G77EE6Y`，广告信号已关。覆盖：官网四页直装 + **工具镜像由 publish.sh 注入**（2026-07-11 motzu 拍板装工具页，为看各工具打开量）
- **~/Projects 源头保持零联网纯净**——AirDrop 给学生的文件版无任何统计；只有 motzu.io 网页版计数
- 器区/llms.txt 措辞已同步改诚实：「输入的内容只留你浏览器；只统计打开次数，不看内容」
- 看哪个工具用得多：GA → 报告 → 互动度 → 网页和屏幕，按路径筛 `/apps/`
- 看板：analytics.google.com（Realtime 验证过站点有心跳）
- 下一步（motzu 手动，2 分钟）：search.google.com/search-console → 添加资源 `https://motzu.io` → 用同一 Google 账号选「Google Analytics」方式一键验证 → 提交 sitemap `https://motzu.io/sitemap.xml`

## 待 motzu 定

- Porkbun 域名 API Access 开关（DNS 卡在这）
- GA4 的 G- ID
- 「门」板块的第一批外链
