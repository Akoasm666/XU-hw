# 待办事项应用 - 前端（复用第三次作业的前端）

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

前端将在 http://localhost:5173 启动（如端口被占用则使用 5174）。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 功能特性

### 核心功能

1. **添加任务**: 输入标题，选择优先级，填写描述（可选），点击添加按钮
2. **优先级设置**: 支持低、中、高三个优先级
3. **描述信息**: 可为任务添加详细描述
4. **标记完成**: 点击"完成"按钮标记任务完成，点击"取消完成"恢复
5. **删除任务**: 点击"删除"按钮移除单个任务
6. **筛选显示**: 点击"全部"、"未完成"、"已完成"切换显示
7. **智能排序**: 任务按优先级（高→中→低）和创建时间自动排序
8. **清除已完成**: 一键清除所有已完成的任务
9. **清空所有**: 清空所有任务（需确认）

### UI/UX 特性

- 蓝色渐变头部设计
- 现代简洁的卡片式布局
- 优先级颜色标识
  - 低优先级：蓝色标签
  - 中优先级：橙色标签
  - 高优先级：红色标签
- 统计信息实时显示（总计、未完成、已完成）
- 流畅的动画过渡
- 鼠标悬停反馈效果
- 响应式布局，支持移动端
- 友好的空状态提示

## API 配置

API 地址配置在 `src/api/todoApi.js` 文件中：

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

如需修改后端地址，请更新此配置。

## 数据结构

### 待办事项对象

```javascript
{
  id: 1,
  title: "任务标题",
  description: "任务描述",
  priority: "low" | "medium" | "high",
  completed: false,
  created_at: "2026-02-05T10:00:00",
  updated_at: "2026-02-05T10:00:00"
}
```

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
