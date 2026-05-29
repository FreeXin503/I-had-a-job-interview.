@echo off
chcp 65001 >nul
echo ========================================
echo   后端服务测试脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js未安装！
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js已安装
node --version
echo.

echo [2/4] 检查npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm未安装！
    pause
    exit /b 1
)
echo ✅ npm已安装
npm --version
echo.

echo [3/4] 检查依赖...
if not exist "node_modules" (
    echo ⚠️  依赖未安装
    echo 请运行: npm install
    pause
    exit /b 1
)
echo ✅ 依赖已安装
echo.

echo [4/4] 检查配置文件...
if not exist ".env" (
    echo ❌ .env文件不存在！
    pause
    exit /b 1
)
echo ✅ .env文件存在
echo.

echo ========================================
echo ✅ 所有检查通过！
echo ========================================
echo.
echo 可以启动服务了：
echo   npm run start:dev
echo.

pause
