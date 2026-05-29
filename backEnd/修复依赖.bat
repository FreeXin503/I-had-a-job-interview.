@echo off
chcp 65001 >nul
echo ========================================
echo   后端依赖修复脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 @nestjs/axios...
if not exist "node_modules\@nestjs\axios" (
    echo ⚠️  @nestjs/axios 未安装
    echo 正在安装...
    call npm install @nestjs/axios
    if errorlevel 1 (
        echo ❌ 安装失败！
        pause
        exit /b 1
    )
    echo ✅ @nestjs/axios 安装成功！
) else (
    echo ✅ @nestjs/axios 已安装
)

echo.
echo [2/3] 验证依赖...
call npm list @nestjs/axios
echo.

echo [3/3] 清理编译缓存...
if exist "dist" (
    rmdir /s /q dist
    echo ✅ 编译缓存已清理
)

echo.
echo ========================================
echo ✅ 依赖修复完成！
echo ========================================
echo.
echo 现在可以启动服务了：
echo   npm run start:dev
echo.
echo 或双击运行：
echo   启动后端.bat
echo.

pause
