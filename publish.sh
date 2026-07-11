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

# 注入 GA（只进网页镜像；~/Projects 源头保持零联网，AirDrop 分发版无统计）
echo "-- GA 注入 --"
python3 - "$APPS"/*.html <<'PY'
import sys

GA_ID = "G-W48G77EE6Y"
SNIPPET = (
    '<script async src="https://www.googletagmanager.com/gtag/js?id=' + GA_ID + '"></script>\n'
    '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}'
    "gtag('js',new Date());gtag('config','" + GA_ID + "',"
    '{allow_google_signals:false,allow_ad_personalization_signals:false});</script>\n'
)

fail = False
for p in sys.argv[1:]:
    s = open(p, encoding="utf-8").read()
    if GA_ID in s:
        print(f"  = 已有，跳过  {p}")
        continue
    if "</head>" not in s:
        print(f"  ✗ 找不到 </head>，未注入  {p}")
        fail = True
        continue
    s = s.replace("</head>", SNIPPET + "</head>", 1)
    open(p, "w", encoding="utf-8").write(s)
    print(f"  + 注入完成  {p}")
sys.exit(1 if fail else 0)
PY

echo "完成。共 ${#MAP[@]} 件。"
