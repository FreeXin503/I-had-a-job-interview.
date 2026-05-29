# Agent安装问题 - 快速解决

## 🐛 问题
```
ERROR: Failed building wheel for pydantic-core
TypeError: ForwardRef._evaluate() missing 1 required keyword-only argument
```

**原因**：Python 3.13太新，pydantic 2.5.0不兼容

---

## ✅ 快速解决（3个方案）

### 方案1：自动修复脚本（最简单）

```bash
双击运行：agent\重新安装Agent.bat
```

这会自动：
- 清理旧环境
- 创建新环境
- 安装更新的依赖（pydantic 2.6+）

---

### 方案2：手动重装（推荐）

```bash
cd agent

# 删除旧环境
rmdir /s /q venv

# 创建新环境
python -m venv venv
venv\Scripts\activate

# 安装依赖（使用无版本限制）
pip install -r requirements-no-compile.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 启动服务
python main.py
```

---

### 方案3：使用Python 3.11（最稳定）

```bash
# 1. 下载Python 3.11
https://www.python.org/downloads/release/python-3119/

# 2. 安装后，重新创建环境
cd agent
rmdir /s /q venv
py -3.11 -m venv venv
venv\Scripts\activate

# 3. 安装依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 4. 启动服务
python main.py
```

---

## 📝 已修改的文件

1. ✅ `requirements.txt` - 升级pydantic到2.6+
2. ✅ `requirements-no-compile.txt` - 无版本限制版本
3. ✅ `重新安装Agent.bat` - 自动修复脚本
4. ✅ 多个说明文档

---

## 🎯 推荐方案

**如果你想快速解决**：使用方案1（自动脚本）

**如果你想最稳定**：使用方案3（Python 3.11）

---

## ✅ 验证成功

启动后看到：
```
🚀 AI Agent 服务启动在端口 8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

访问：http://localhost:8000

---

## 📚 详细文档

- [Agent安装问题完全解决方案.md](./agent/Agent安装问题完全解决方案.md)
- [Python3.13兼容性修复.md](./agent/Python3.13兼容性修复.md)

---

**选择一个方案，立即开始修复！🚀**
