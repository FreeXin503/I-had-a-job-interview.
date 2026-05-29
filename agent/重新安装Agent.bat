@echo off
chcp 65001 >nul
echo ========================================
echo   Agent环境重新安装脚本
echo   修复Python 3.13兼容性问题
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 清理旧环境...
if exist venv (
    echo 删除旧的虚拟环境...
    rmdir /s /q venv
    echo ✅ 虚拟环境已删除
) else (
    echo ✅ 无需清理
)

if exist __pycache__ (
    rmdir /s /q __pycache__
)

echo.
echo [2/5] 检查Python版本...
python --version
echo.
echo ⚠️  注意：如果是Python 3.13，可能需要降级到3.11或3.12
echo.

echo [3/5] 创建新虚拟环境...
python -m venv venv
if errorlevel 1 (
    echo ❌ 虚拟环境创建失败！
    pause
    exit /b 1
)
echo ✅ 虚拟环境创建成功
echo.

echo [4/5] 激活虚拟环境...
call venv\Scripts\activate
echo ✅ 虚拟环境已激活
echo.

echo [5/5] 安装依赖（使用清华镜像）...
echo 这可能需要几分钟，请耐心等待...
echo.
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
if errorlevel 1 (
    echo.
    echo ❌ 依赖安装失败！
    echo.
    echo 可能的原因：
    echo 1. Python版本不兼容（建议使用3.11或3.12）
    echo 2. 网络连接问题
    echo 3. 缺少编译工具
    echo.
    echo 请查看 Python3.13兼容性修复.md 获取详细解决方案
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 安装完成！
echo ========================================
echo.
echo 验证安装：
pip show pydantic
echo.
echo 现在可以启动服务了：
echo   python main.py
echo.
echo 或双击运行：
echo   启动Agent.bat
echo.

pause
