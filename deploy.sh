#!/bin/bash
# deploy.sh — 一键发布：同步 app 镜像 → 提交 → 推上 GitHub Pages
# 用法：bash ~/Projects/motzudao-site/deploy.sh ["提交说明"]
# 手动跑，不进任何定时任务（对外发布必须人手触发）。
set -euo pipefail

SITE="$HOME/Projects/motzudao-site"
cd "$SITE"

echo "① 同步 app 镜像（源头 ~/Projects/* → apps/）"
bash "$SITE/publish.sh"

echo
echo "② 变更清单"
git add -A
if git diff --cached --quiet; then
  echo "没有任何变更，不发布。"
  exit 0
fi
git -c core.quotepath=false diff --cached --stat

MSG="${1:-更新 $(date '+%Y-%m-%d %H:%M')}"
echo
echo "③ 提交并推送：$MSG"
git commit -q -m "$MSG"
git push -q origin main

echo
echo "④ 完成。GitHub Pages 约 1 分钟后生效 → https://motzu.io"
echo "   构建状态：gh api repos/motzudao/motzudao.github.io/pages --jq '.status'"
