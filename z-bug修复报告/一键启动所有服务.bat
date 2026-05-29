@echo off
chcp 65001 >nul
echo ========================================
echo   面了个试 - 一键启动所有服务
echo ========================================
echo.

echo 正在启动所有服务...
echo.

echo [1/2] 启动 Agent 服务 (端口 8000)...
start "Agent服务" cmd /k "cd /d "%~dp0agent" && venv\Scripts\activate && python main.py"
timeout /t 3 >nul

echo [2/2] 启动后端服务 (端口 3000)...
start "后端服务" cmd /k "cd /d "%~dp0backEnd" && npm run start:dev"
timeout /t 3 >nul

echo.
echo ========================================
echo ✅ 所有服务已启动！
echo ========================================
echo.
echo 服务地址：
echo   - Agent服务: http://localhost:8000
echo   - 后端服务: http://localhost:3000
echo   - API文档: http://localhost:8000/docs
echo.
echo 前端开发：
echo   使用微信开发者工具打开 frontEnd 目录
echo.
echo 关闭服务：
echo   关闭对应的命令行窗口即可
echo ========================================
echo.

pause
