# 待办事项应用 - 后端

基于 FastAPI 和 SQLite 的待办事项应用后端 API。

## 技术栈

- **FastAPI**: 现代、高性能的 Python Web 框架
- **SQLAlchemy**: Python SQL 工具包和 ORM
- **SQLite**: 轻量级数据库
- **Pydantic**: 数据验证库

## 项目结构

```
backend/
├── venv/            # Python 虚拟环境
├── main.py          # FastAPI 主应用入口
├── database.py      # 数据库配置
├── models.py        # SQLAlchemy 数据模型
├── schemas.py       # Pydantic 数据验证模式
├── crud.py          # CRUD 操作函数
├── todos.db         # SQLite 数据库文件（运行后生成）
├── requirements.txt # Python 依赖
└── README.md        # 说明文档
```

## 快速开始

### 1. 激活虚拟环境

虚拟环境已创建好，激活即可：

```bash
source venv/bin/activate  # macOS/Linux
# 或
.\venv\Scripts\activate  # Windows
```

如需重新创建虚拟环境：
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. 启动服务

```bash
uvicorn main:app --reload --port 8000
```

服务将在 http://localhost:8000 启动。

## API 文档

启动服务后，访问以下地址查看自动生成的 API 文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 接口

### 获取待办事项列表
```
GET /api/todos?status=all|completed|pending
```

### 创建待办事项
```
POST /api/todos
Content-Type: application/json

{
    "title": "任务名称",
    "description": "任务描述（可选）",
    "priority": "low|medium|high"
}
```

### 更新待办事项
```
PUT /api/todos/{id}
Content-Type: application/json

{
    "title": "新标题",          // 可选
    "description": "新描述",    // 可选
    "priority": "medium",       // 可选
    "completed": true           // 可选
}
```

### 删除单个待办事项
```
DELETE /api/todos/{id}
```

### 删除已完成的待办事项
```
DELETE /api/todos/completed
```

### 删除全部待办事项
```
DELETE /api/todos/all
```

## 响应格式

所有接口返回统一的 JSON 格式：

```json
{
    "code": 200,
    "message": "success",
    "data": { ... }
}
```

## 数据库

应用使用 SQLite 数据库，数据库文件 `todos.db` 会在首次运行时自动创建。

### 表结构

```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'low',
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键ID |
| title | VARCHAR(255) | 任务标题 |
| description | TEXT | 任务描述（可选） |
| priority | VARCHAR(20) | 优先级: low(低), medium(中), high(高) |
| completed | BOOLEAN | 完成状态 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 测试接口

使用 curl 测试：

```bash
# 获取所有待办事项
curl http://localhost:8000/api/todos

# 创建待办事项（带优先级和描述）
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "学习FastAPI", "description": "完成教程", "priority": "high"}'

# 标记完成
curl -X PUT http://localhost:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 修改优先级
curl -X PUT http://localhost:8000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"priority": "medium"}'

# 删除待办事项
curl -X DELETE http://localhost:8000/api/todos/1

# 清除已完成
curl -X DELETE http://localhost:8000/api/todos/completed

# 清空全部
curl -X DELETE http://localhost:8000/api/todos/all
```
