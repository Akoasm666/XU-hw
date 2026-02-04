# 待办事项应用 - 技术架构文档

## 1. 项目概述

本项目是一个全栈待办事项(Todo)应用，采用前后端分离架构，提供任务的增删改查、状态管理和筛选功能。

## 2. 技术栈

### 2.1 前端
- **框架**: React 18+
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **样式**: CSS3 (现代简洁风格)

### 2.2 后端
- **框架**: FastAPI (Python)
- **数据库**: SQLite
- **ORM**: SQLAlchemy
- **数据验证**: Pydantic

### 2.3 项目结构
```
TodoApp01/
├── backend/           # 后端代码
│   ├── main.py        # FastAPI 主应用
│   ├── database.py    # 数据库配置
│   ├── models.py      # 数据模型
│   ├── schemas.py     # Pydantic 模式
│   ├── crud.py        # CRUD 操作
│   ├── requirements.txt
│   └── README.md
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
├── req.md
└── TECH_ARCHITECTURE.md
```

## 3. 数据库设计

### 3.1 表结构

#### todos 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 主键ID |
| title | VARCHAR(255) | NOT NULL | 任务标题 |
| completed | BOOLEAN | DEFAULT FALSE | 完成状态 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

### 3.2 SQL 语句

```sql
-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- 创建触发器，自动更新 updated_at 字段
CREATE TRIGGER IF NOT EXISTS update_todos_timestamp 
AFTER UPDATE ON todos
BEGIN
    UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

## 4. API 接口设计

### 4.1 基础信息
- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`
- **跨域**: 启用 CORS，允许前端访问

### 4.2 接口列表

#### 4.2.1 获取待办事项列表
```
GET /api/todos
```

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 筛选状态: all(全部), completed(已完成), pending(未完成) |

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "title": "学习React",
            "completed": false,
            "created_at": "2026-02-04T10:00:00",
            "updated_at": "2026-02-04T10:00:00"
        }
    ]
}
```

#### 4.2.2 创建待办事项
```
POST /api/todos
```

**请求体**:
```json
{
    "title": "新任务名称"
}
```

**响应示例**:
```json
{
    "code": 201,
    "message": "创建成功",
    "data": {
        "id": 2,
        "title": "新任务名称",
        "completed": false,
        "created_at": "2026-02-04T10:30:00",
        "updated_at": "2026-02-04T10:30:00"
    }
}
```

#### 4.2.3 更新待办事项状态
```
PUT /api/todos/{id}
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 待办事项ID |

**请求体**:
```json
{
    "title": "更新后的标题",      // 可选
    "completed": true            // 可选
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "更新成功",
    "data": {
        "id": 1,
        "title": "更新后的标题",
        "completed": true,
        "created_at": "2026-02-04T10:00:00",
        "updated_at": "2026-02-04T11:00:00"
    }
}
```

#### 4.2.4 删除单个待办事项
```
DELETE /api/todos/{id}
```

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | integer | 待办事项ID |

**响应示例**:
```json
{
    "code": 200,
    "message": "删除成功",
    "data": null
}
```

#### 4.2.5 批量删除已完成的待办事项
```
DELETE /api/todos/completed
```

**响应示例**:
```json
{
    "code": 200,
    "message": "已清除所有已完成的待办事项",
    "data": {
        "deleted_count": 5
    }
}
```

#### 4.2.6 清除全部待办事项
```
DELETE /api/todos/all
```

**响应示例**:
```json
{
    "code": 200,
    "message": "已清除全部待办事项",
    "data": {
        "deleted_count": 10
    }
}
```

### 4.3 错误响应格式
```json
{
    "code": 404,
    "message": "待办事项不存在",
    "data": null
}
```

### 4.4 HTTP 状态码
| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 5. 前端功能设计

### 5.1 页面布局
- 标题区域：显示应用名称
- 输入区域：包含输入框和添加按钮
- 筛选区域：全部、未完成、已完成三个筛选选项
- 列表区域：显示待办事项列表
- 操作区域：清除已完成、清除全部按钮

### 5.2 功能点
1. **添加任务**: 输入内容后点击添加按钮或按回车键添加
2. **标记完成**: 点击完成按钮切换任务状态
3. **删除任务**: 点击删除按钮移除任务
4. **筛选显示**: 根据状态筛选显示任务
5. **批量清除**: 清除已完成或全部任务

### 5.3 UI/UX 设计要求
- 主体居中，最大宽度 800px
- 现代简洁的设计风格
- 输入框和按钮样式美观
- 列表项之间有适当间距
- 鼠标悬停时有视觉反馈
- 已完成任务显示删除线

## 6. 开发规范

### 6.1 后端
- 使用类型注解
- 遵循 PEP8 代码规范
- 统一响应格式
- 完善的错误处理

### 6.2 前端
- 组件化开发
- 状态集中管理
- CSS 模块化
- 语义化 HTML

## 7. 部署说明

### 7.1 后端启动
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 7.2 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 7.3 访问地址
- 前端: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs
