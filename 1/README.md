# TaskFlow 项目任务管理系统 - 前端原型

科技风格的项目任务管理系统前端原型，基于 React + Vite 构建。

## 功能预览

- 📊 **控制台** - 数据统计卡片、项目概览、近期任务、团队动态
- 📁 **项目管理** - 项目卡片/列表视图、里程碑、进度追踪
- ✅ **任务中心** - 甘特图、任务筛选、优先级管理
- 🔔 **预警中心** - 智能预警、预警规则配置

## 环境要求

在运行此项目之前，请确保你的电脑已安装以下软件：

| 软件 | 最低版本 | 检查命令 |
|-----|---------|---------|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |

> 💡 **Node.js 下载地址**: https://nodejs.org/zh-cn/

## 快速开始

### 1. 进入项目目录

```bash
cd XU-hw-1/project-manager
```

### 2. 安装依赖

首次运行需要安装项目依赖包（只需执行一次）：

```bash
npm install
```

> ⏱️ 安装过程大约需要 1-2 分钟，请耐心等待。

### 3. 启动开发服务器

```bash
npm run dev
```

启动成功后，终端会显示类似如下信息：

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. 访问应用

打开浏览器，访问 **http://localhost:5173/**

## 常用命令

| 命令 | 说明 |
|-----|-----|
| `npm install` | 安装项目依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产版本 |
| `npm run lint` | 运行代码检查 |

## 项目结构

```
project-manager/
├── src/
│   ├── components/       # 组件目录
│   │   ├── Sidebar.jsx   # 侧边导航栏
│   │   ├── Dashboard.jsx # 控制台
│   │   ├── Projects.jsx  # 项目管理
│   │   ├── Tasks.jsx     # 任务中心
│   │   └── Alerts.jsx    # 预警中心
│   ├── App.jsx           # 主应用
│   ├── App.css           # 全局样式
│   └── main.jsx          # 入口文件
├── package.json          # 项目配置
└── vite.config.js        # Vite 配置
```

## 技术栈

- **React** 19.x - 前端框架
- **Vite** 7.x - 构建工具
- **CSS3** - 样式（CSS变量 + Flexbox + Grid）

## 响应式支持

本项目支持多种设备：
- 💻 PC 端（完整侧边栏布局）
- 📱 手机端（汉堡菜单 + 自适应布局）

## 常见问题

### Q: 运行 `npm install` 报错？
A: 请检查 Node.js 版本是否 >= 18.x，或尝试删除 `node_modules` 文件夹后重新安装。

### Q: 端口 5173 被占用？
A: Vite 会自动切换到下一个可用端口，或手动修改 `vite.config.js`。

### Q: 如何停止开发服务器？
A: 在终端按 `Ctrl + C` 即可停止。

## 相关文档

- [项目任务管理软件PRD.md](../项目任务管理软件PRD.md) - 产品需求文档
- [功能清单.md](../功能清单.md) - 功能清单与技术架构
- [竞品分析报告.md](../竞品分析报告.md) - 竞品分析报告
