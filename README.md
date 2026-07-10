# 默孜.道 · 官网

> 知行子按对 motzu 的了解起草 · v1 2026-07-06 · v2 2026-07-11 · 咖啡区+SEO 2026-07-11
> 纯静态、零构建；全站唯一一段 JS 是咖啡区的复制按钮。

## 结构

```
index.html   名（鸣谦贞吉）→ 道 → 事（学·造·跑）→ 器（5 件工具）→ 观（缠/穿日志入口）
             → 则（六条）→ 门（其他站点，陆续增加）→ ☕（BTC/ETH 已上线）
apps/        单文件 app 镜像（源头在 ~/Projects/*，勿直接改这里）
  snowball / qianjin / rabbithole / luozi / jianxi / sub5
notes/       观测日志
  chan.html  缠 The Entanglement —— 我和一个 AI（知行子搬家线）
  chuan.html 穿 The Tunneling —— 马拉松线（破五挂这里）
publish.sh   手动同步 apps/ 镜像（改了源头 app 就跑一次；不自动化）
robots.txt   全站可抓 + 明确欢迎 AI 爬虫（GPTBot/ClaudeBot/Perplexity 等）
sitemap.xml  9 个 URL
llms.txt     给 AI 引擎读的站点说明（llmstxt.org 格式，AEO 核心件）
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

## 待 motzu 定

- motzu.io 下单（Cloudflare $50/年 或 Porkbun 首年 $28.12，2026-07-11 已侦察，motzu.io 当时可注册）
- 部署时机
- 「门」板块的第一批外链
