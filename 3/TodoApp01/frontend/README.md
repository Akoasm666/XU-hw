# 待办事项应用 - 前端

基于 React 和 Vite 的待办事项应用前端。

## 技术栈

- **React 18**: JavaScript UI 库
- **Vite**: 下一代前端构建工具
- **Axios**: HTTP 客户端
- **CSS3**: 现代样式设计

## 项目结构

```
frontend/
├── src/
│   ├── api/
│   │   └── todoApi.js    # API 接口封装
│   ├── components/
│   │   ├── TodoItem.jsx  # 待办事项组件
│   │   └── TodoItem.css  # 组件样式
│   ├── App.jsx           # 主组件
│   ├── App.css           # 主样式
│   ├── main.jsx          # 入口文件
│   └── index.css         # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端将在 http://localhost:5173 启动。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 功能特性

### 核心功能

1. **添加任务**: 在输入框输入内容，点击"添加"按钮或按回车键
2. **标记完成**: 点击任务右侧的"完成"按钮，已完成的任务会显示删除线
3. **撤销完成**: 点击"撤销"按钮恢复为未完成状态
4. **删除任务**: 点击"删除"按钮移除单个任务
5. **筛选显示**: 点击"全部"、"未完成"、"已完成"切换显示
6. **清除已完成**: 一键清除所有已完成的任务
7. **清除全部**: 清空所有任务（需确认）

### UI/UX 特性

- 现代简洁的设计风格
- 渐变色主题
- 流畅的动画过渡
- 鼠标悬停反馈效果
- 响应式布局，支持移动端
- 友好的空状态提示
- 任务统计信息显示

## API 配置

API 地址配置在 `src/api/todoApi.js` 文件中：

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

如需修改后端地址，请更新此配置。

## 注意事项

1. 确保后端服务已启动并运行在 http://localhost:8000
2. 如遇到跨域问题，请检查后端 CORS 配置
3. 开发时建议同时打开浏览器控制台查看网络请求

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
