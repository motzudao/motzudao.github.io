#!/bin/bash
# publish.sh — 把 ~/Projects 里的单文件 app 同步进官网 apps/（手动跑，不自动化）
# 源头永远在 ~/Projects/<app>/，这里只是镜像。改源头，跑这个脚本刷新。
set -euo pipefail

SITE="$HOME/Projects/motzudao-site"
APPS="$SITE/apps"
mkdir -p "$APPS"

# 格式：源文件|目标文件名（ascii，URL 友好）
MAP=(
  "$HOME/Projects/snowball/index.html|snowball.html"
  "$HOME/Projects/qianjin/index.html|qianjin.html"
  "$HOME/Projects/rabbithole/兔子洞.html|rabbithole.html"
  "$HOME/Projects/luozi/落子.html|luozi.html"
  "$HOME/Projects/jianxi/间隙.html|jianxi.html"
  "$HOME/Projects/sub5/破五.html|sub5.html"
)

echo "== publish $(date '+%Y-%m-%d %H:%M') =="
for pair in "${MAP[@]}"; do
  src="${pair%%|*}"; dst="${pair##*|}"
  if [[ ! -f "$src" ]]; then
    echo "✗ 缺源文件: $src" >&2; exit 1
  fi
  cp "$src" "$APPS/$dst"
  echo "✓ $dst  ←  $src ($(du -h "$APPS/$dst" | cut -f1))"
done

# 注入 GA + 回首页链接（只进网页镜像；~/Projects 源头保持零联网/离线纯净）
echo "-- 注入 GA + 回链 --"
python3 - "$APPS"/*.html <<'PY'
import sys

GA_ID = "G-W48G77EE6Y"
GA = (
    '<script async src="https://www.googletagmanager.com/gtag/js?id=' + GA_ID + '"></script>\n'
    '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}'
    "gtag('js',new Date());gtag('config','" + GA_ID + "',"
    '{allow_google_signals:false,allow_ad_personalization_signals:false});</script>\n'
)
# 回首页小印：固定左上，朱砂配色（跟 favicon/印章/导航同一个红），深浅底都压得住
BACK = (
    '<a id="motzu-home" href="../index.html#qi" title="回默孜.道 · 器" '
    'style="position:fixed;top:14px;left:14px;z-index:2147483647;'
    'display:inline-flex;align-items:center;gap:.4em;padding:.34em .8em;border-radius:6px;'
    "background:#a63a2b;color:#f6f2e9;font-family:'Songti SC','Noto Serif SC',serif;"
    'font-size:13px;line-height:1;letter-spacing:.12em;text-decoration:none;'
    'box-shadow:0 2px 12px rgba(0,0,0,.28);opacity:.9">&#8592; 默孜.道</a>\n'
)

fail = False
for p in sys.argv[1:]:
    s = open(p, encoding="utf-8").read()
    orig = s
    if GA_ID not in s:
        if "</head>" in s:
            s = s.replace("</head>", GA + "</head>", 1)
        else:
            print(f"  ✗ 找不到 </head>，GA 未注入  {p}"); fail = True
    if 'id="motzu-home"' not in s:
        if "</body>" in s:
            s = s.replace("</body>", BACK + "</body>", 1)
        else:
            print(f"  ✗ 找不到 </body>，回链未注入  {p}"); fail = True
    if s != orig:
        open(p, "w", encoding="utf-8").write(s)
        print(f"  + 注入完成  {p}")
    else:
        print(f"  = 已齐全，跳过  {p}")
sys.exit(1 if fail else 0)
PY

echo "完成。共 ${#MAP[@]} 件。"
