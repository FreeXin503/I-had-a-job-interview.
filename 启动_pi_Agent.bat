@echo off
title pi Agent 启动器
echo ===================================================
echo             pi Agent 极速启动服务
echo ===================================================
echo 正在通过国内腾讯云 NPM 镜像加速通道为您初始化并启动 pi Agent...
echo 服务启动后，请在浏览器中访问: http://localhost:30141
echo ===================================================
npx --registry=https://mirrors.cloud.tencent.com/npm/ @agegr/pi-web@latest
pause
