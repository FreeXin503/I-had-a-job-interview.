@echo off
chcp 65001 >nul
echo ========================================
echo   面了个试 - 后端服务启动脚本
echo ========================================
echo.

cd /d "%~dp0backEnd"

echo [1/4] 检查依赖...
if not exist "node_modules" (
    echo 未检测到依赖，开始安装...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
    echo.
    echo ✅ 依赖安装成功！
) else (
    echo ✅ 依赖已存在
)

echo.
echo [2/4] 检查关键依赖...
if not exist "node_modules\@nestjs\axios" (
    echo ⚠️  缺少 @nestjs/axios，正在安装...
    call npm install @nestjs/axios
    echo ✅ @nestjs/axios 安装完成
)

echo.
echo [3/4] 检查数据库连接...
echo 数据库配置：
echo   - 主机: localhost:3306
echo   - 数据库: ai_interview
echo   - 用户: root
echo.
echo ⚠️  请确保MySQL服务已启动，数据库已创建！
echo.

echo [4/4] 启动后端服务...
echo 服务地址: http://localhost:3000
echo API文档: http://localhost:3000/api
echo.
echo 按 Ctrl+C 停止服务
echo ========================================
echo.

call npm run start:dev

pause
