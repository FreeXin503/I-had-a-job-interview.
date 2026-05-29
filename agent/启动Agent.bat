@echo off
chcp 65001 >nul
echo ========================================
echo   面了个试 - AI Agent 服务启动
echo ========================================
echo.

cd /d %~dp0

echo [1/2] 激活虚拟环境...
call venv\Scripts\activate.bat

echo [2/2] 启动Agent服务...
echo.
echo 服务地址: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo 按 Ctrl+C 停止服务
echo ========================================
echo.

python main.py

pause
