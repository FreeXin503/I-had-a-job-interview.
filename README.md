# 面了个试 - AI模拟面试小程序

## 项目简介

"面了个试"是一个基于AI的模拟面试小程序，通过真实的语音互动，帮助求职者提升面试技能。

## 🎯 项目状态

- ✅ **前端**：100% 完成（微信小程序）
- ✅ **Agent端**：100% 完成（Python + FastAPI）
- ⏳ **后端**：90% 完成（NestJS）
- 📊 **总体进度**：85%

详细状态请查看：[项目完成状态.md](./项目完成状态.md)

## 技术栈

### 前端
- **框架**: 微信小程序原生框架
- **语言**: JavaScript（已移除TypeScript）
- **样式**: WXSS
- **状态**: ✅ 已完成

### 后端
- **框架**: NestJS (Node.js)
- **数据库**: MySQL 8.0
- **语言**: TypeScript
- **状态**: ⏳ 90%完成

### AI Agent
- **框架**: FastAPI（已简化，移除LangGraph）
- **大模型**: DeepSeek V3
- **语言**: Python 3.10+
- **SDK**: OpenAI SDK
- **状态**: ✅ 已完成并运行

## 项目结构

```
AIInterview/
├── frontEnd/          # 微信小程序前端
│   ├── pages/         # 页面
│   ├── components/    # 组件
│   ├── utils/         # 工具函数
│   ├── assets/        # 静态资源
│   └── styles/        # 样式文件
├── backEnd/           # NestJS后端
│   ├── src/
│   │   ├── modules/   # 功能模块
│   │   ├── common/    # 公共模块
│   │   └── main.ts    # 入口文件
│   └── package.json
├── agent/             # AI Agent
│   ├── agent/         # Agent核心代码
│   ├── main.py        # 入口文件
│   └── requirements.txt
└── README.md
```

## 功能特性

### 1. 面试准备
- 选择面试官风格（随机、温和、标准、压力）
- 选择面试岗位
- 上传个人简历（PDF格式）
- 设置面试时长

### 2. 面试阶段
- AI面试官实时提问
- 语音录制回答
- 语音转文字
- 智能追问

### 3. 评分阶段
- 综合评分（1-100分）
- 详细评价报告
- 问题解析
- 优秀回答示例

## 🚀 快速开始

### 方式一：一键启动（推荐）

双击运行项目根目录下的批处理文件：

```
一键启动所有服务.bat
```

这将自动启动：
- ✅ Agent服务（端口8000）
- ✅ 后端服务（端口3000）

### 方式二：分别启动

#### 1. 启动Agent服务（已完成✅）

```bash
# 双击运行
agent\启动Agent.bat

# 或手动启动
cd agent
venv\Scripts\activate
python main.py
```

**验证：** 访问 http://localhost:8000

#### 2. 启动后端服务

```bash
# 双击运行
启动后端.bat

# 或手动启动
cd backEnd
npm install  # 首次需要安装依赖
npm run start:dev
```

**验证：** 访问 http://localhost:3000

#### 3. 启动前端

1. 打开**微信开发者工具**
2. 导入项目：选择 `frontEnd` 目录
3. 点击**编译**运行

**验证：** 小程序正常显示首页

---

## 📚 详细文档

- [项目启动指南](./项目启动指南.md) - 完整的启动说明
- [项目完成状态](./项目完成状态.md) - 当前开发进度
- [后端安装说明](./backEnd/后端安装说明.md) - 后端详细安装步骤
- [Agent安装成功](./agent/安装成功.md) - Agent端配置说明
- [前端修复说明](./frontEnd/修复说明.md) - 前端问题修复记录
- [录音功能说明](./frontEnd/录音功能说明.md) - 录音功能使用说明

### 数据库配置

```sql
-- 创建数据库
CREATE DATABASE ai_interview CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE ai_interview;

-- 数据表会自动创建（TypeORM synchronize: true）
```

## 环境变量配置

### 后端 (.env)

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123456
DB_DATABASE=ai_interview

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# Agent服务地址
AGENT_API_URL=http://localhost:8000
```

### Agent (.env)

```env
# DeepSeek API配置
DEEPSEEK_API_KEY=sk-12117c0cd5154356a3518f50a28137d7
DEEPSEEK_BASE_URL=https://api.deepseek.com

# TTS配置
TTS_PROVIDER=volcengine
TTS_API_KEY=your_tts_api_key
TTS_API_URL=your_tts_api_url

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API文档

### 后端API

- `POST /api/auth/login` - 用户登录
- `POST /api/interview/create` - 创建面试会话
- `POST /api/interview/:id/start` - 开始面试
- `GET /api/interview/:id/next-question` - 获取下一个问题
- `POST /api/interview/:id/submit-answer` - 提交答案
- `POST /api/interview/:id/end` - 结束面试
- `GET /api/interview/:id/report` - 获取面试报告

### Agent API

- `POST /api/agent/generate-first-question` - 生成第一个问题
- `POST /api/agent/generate-next-question` - 生成下一个问题
- `POST /api/agent/analyze-answer` - 分析答案
- `POST /api/agent/generate-report` - 生成报告
- `POST /api/agent/speech-to-text` - 语音转文字

## 开发计划

- [x] 项目架构搭建
- [x] 前端页面开发
- [x] 后端API开发
- [x] AI Agent开发
- [ ] 语音识别集成
- [ ] TTS语音合成集成
- [ ] 简历解析优化
- [ ] 面试报告PDF导出
- [ ] 积分充值系统
- [ ] 用户数据统计

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请联系开发团队。
