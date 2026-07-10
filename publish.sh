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
echo "完成。共 ${#MAP[@]} 件。"
