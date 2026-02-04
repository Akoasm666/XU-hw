# TaskFlow API 设计文档

**项目名称**: TaskFlow 项目任务管理系统  
**API版本**: v1.0  
**文档更新日期**: 2026年2月4日  
**协议**: RESTful API  
**数据格式**: JSON  

---

## 目录

1. [概述](#1-概述)
2. [通用规范](#2-通用规范)
3. [认证与授权](#3-认证与授权)
4. [项目管理 API](#4-项目管理-api)
5. [任务管理 API](#5-任务管理-api)
6. [预警管理 API](#6-预警管理-api)
7. [用户与团队 API](#7-用户与团队-api)
8. [统计与报表 API](#8-统计与报表-api)
9. [错误码定义](#9-错误码定义)
10. [数据模型](#10-数据模型)

---

## 1. 概述

### 1.1 API 基础信息

| 项目 | 说明 |
|-----|-----|
| Base URL | `https://api.taskflow.com/v1` |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 时间格式 | ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`) |

### 1.2 API 设计原则

- **RESTful 风格**: 使用标准 HTTP 方法（GET/POST/PUT/DELETE）
- **资源导向**: URL 表示资源，HTTP 方法表示操作
- **版本控制**: URL 中包含版本号 `/v1`
- **分页支持**: 列表接口统一支持分页
- **幂等性**: PUT/DELETE 操作保证幂等

---

## 2. 通用规范

### 2.1 请求头

| Header | 必填 | 说明 |
|--------|-----|-----|
| `Content-Type` | 是 | `application/json` |
| `Authorization` | 是 | `Bearer {access_token}` |
| `X-Request-ID` | 否 | 请求追踪ID，用于日志关联 |
| `Accept-Language` | 否 | 语言偏好，默认 `zh-CN` |

### 2.2 通用响应格式

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-02-04T10:30:00Z",
  "request_id": "req_abc123"
}
```

**错误响应**
```json
{
  "code": 40001,
  "message": "参数错误：项目名称不能为空",
  "data": null,
  "timestamp": "2026-02-04T10:30:00Z",
  "request_id": "req_abc123"
}
```

### 2.3 分页参数

| 参数 | 类型 | 默认值 | 说明 |
|-----|-----|-------|-----|
| `page` | int | 1 | 页码，从1开始 |
| `page_size` | int | 20 | 每页条数，最大100 |
| `sort_by` | string | `created_at` | 排序字段 |
| `sort_order` | string | `desc` | 排序方向：`asc`/`desc` |

**分页响应格式**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [ ... ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

---

## 3. 认证与授权

### 3.1 登录认证

#### POST `/auth/login`

用户登录获取访问令牌。

**请求参数**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| email | string | 是 | 用户邮箱 |
| password | string | 是 | 密码 |

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200,
    "token_type": "Bearer",
    "user": {
      "id": "user_001",
      "name": "张三",
      "email": "user@example.com",
      "avatar": "https://..."
    }
  }
}
```

### 3.2 刷新令牌

#### POST `/auth/refresh`

刷新访问令牌。

**请求参数**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200
  }
}
```

### 3.3 登出

#### POST `/auth/logout`

用户登出，使令牌失效。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 4. 项目管理 API

### 4.1 获取项目列表

#### GET `/projects`

获取当前用户可见的项目列表。

**请求参数（Query）**

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| status | string | 否 | 项目状态：`pending`/`progress`/`completed`/`delayed` |
| department_id | string | 否 | 部门ID筛选 |
| keyword | string | 否 | 关键词搜索（项目名称） |
| page | int | 否 | 页码 |
| page_size | int | 否 | 每页条数 |

**请求示例**
```
GET /v1/projects?status=progress&page=1&page_size=10
```

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "proj_001",
        "name": "客户管理系统升级",
        "description": "升级现有CRM系统",
        "department": {
          "id": "dept_001",
          "name": "技术部"
        },
        "status": "progress",
        "leader": {
          "id": "user_001",
          "name": "张经理",
          "avatar": "https://..."
        },
        "members": [
          { "id": "user_002", "name": "王小明", "avatar": "https://..." },
          { "id": "user_003", "name": "李小红", "avatar": "https://..." }
        ],
        "start_date": "2026-01-01",
        "end_date": "2026-03-15",
        "progress": 68,
        "milestones": [
          { "id": "ms_001", "name": "需求确认", "status": "completed" },
          { "id": "ms_002", "name": "设计完成", "status": "completed" },
          { "id": "ms_003", "name": "开发完成", "status": "progress" },
          { "id": "ms_004", "name": "测试通过", "status": "pending" }
        ],
        "created_at": "2026-01-01T08:00:00Z",
        "updated_at": "2026-02-04T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

### 4.2 获取项目详情

#### GET `/projects/{project_id}`

获取单个项目的详细信息。

**路径参数**

| 参数 | 类型 | 说明 |
|-----|-----|-----|
| project_id | string | 项目ID |

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "proj_001",
    "name": "客户管理系统升级",
    "description": "升级现有CRM系统，增加新功能模块",
    "department": {
      "id": "dept_001",
      "name": "技术部"
    },
    "status": "progress",
    "leader": {
      "id": "user_001",
      "name": "张经理",
      "avatar": "https://..."
    },
    "members": [
      { "id": "user_002", "name": "王小明", "role": "developer" },
      { "id": "user_003", "name": "李小红", "role": "designer" }
    ],
    "start_date": "2026-01-01",
    "end_date": "2026-03-15",
    "actual_end_date": null,
    "progress": 68,
    "milestones": [
      {
        "id": "ms_001",
        "name": "需求确认",
        "status": "completed",
        "due_date": "2026-01-15",
        "completed_at": "2026-01-14T16:00:00Z"
      }
    ],
    "dependencies": [
      { "id": "proj_002", "name": "数据迁移项目", "type": "blocks" }
    ],
    "tags": ["CRM", "升级", "Q1"],
    "remarks": "请注意与旧系统的兼容性",
    "statistics": {
      "total_tasks": 45,
      "completed_tasks": 30,
      "overdue_tasks": 2,
      "total_hours": 360,
      "used_hours": 245
    },
    "created_at": "2026-01-01T08:00:00Z",
    "updated_at": "2026-02-04T10:30:00Z"
  }
}
```

### 4.3 创建项目

#### POST `/projects`

创建新项目。

**请求参数**
```json
{
  "name": "新项目名称",
  "description": "项目描述",
  "department_id": "dept_001",
  "leader_id": "user_001",
  "member_ids": ["user_002", "user_003"],
  "start_date": "2026-02-01",
  "end_date": "2026-05-30",
  "milestones": [
    { "name": "需求确认", "due_date": "2026-02-15" },
    { "name": "设计完成", "due_date": "2026-03-01" }
  ],
  "tags": ["新项目", "Q1"]
}
```

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| name | string | 是 | 项目名称，最大100字符 |
| description | string | 否 | 项目描述 |
| department_id | string | 是 | 所属部门ID |
| leader_id | string | 是 | 负责人用户ID |
| member_ids | array | 否 | 成员用户ID列表 |
| start_date | string | 是 | 计划开始日期 |
| end_date | string | 是 | 计划结束日期 |
| milestones | array | 否 | 里程碑列表 |
| tags | array | 否 | 标签列表 |

**响应示例**
```json
{
  "code": 0,
  "message": "项目创建成功",
  "data": {
    "id": "proj_003",
    "name": "新项目名称",
    "status": "pending",
    "created_at": "2026-02-04T10:30:00Z"
  }
}
```

### 4.4 更新项目

#### PUT `/projects/{project_id}`

更新项目信息。

**请求参数**
```json
{
  "name": "更新后的项目名称",
  "description": "更新后的描述",
  "status": "progress",
  "end_date": "2026-06-15",
  "progress": 75
}
```

**响应示例**
```json
{
  "code": 0,
  "message": "项目更新成功",
  "data": {
    "id": "proj_001",
    "name": "更新后的项目名称",
    "updated_at": "2026-02-04T10:30:00Z"
  }
}
```

### 4.5 删除项目

#### DELETE `/projects/{project_id}`

删除项目（软删除）。

**响应示例**
```json
{
  "code": 0,
  "message": "项目删除成功",
  "data": null
}
```

### 4.6 更新项目成员

#### PUT `/projects/{project_id}/members`

更新项目成员列表。

**请求参数**
```json
{
  "member_ids": ["user_002", "user_003", "user_004"],
  "leader_id": "user_001"
}
```

**响应示例**
```json
{
  "code": 0,
  "message": "成员更新成功",
  "data": {
    "members": [
      { "id": "user_002", "name": "王小明" },
      { "id": "user_003", "name": "李小红" },
      { "id": "user_004", "name": "陈工" }
    ]
  }
}
```

---

## 5. 任务管理 API

### 5.1 获取任务列表

#### GET `/tasks`

获取任务列表，支持多维度筛选。

**请求参数（Query）**

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| project_id | string | 否 | 项目ID筛选 |
| assignee_id | string | 否 | 负责人ID筛选 |
| status | string | 否 | 状态：`pending`/`progress`/`completed`/`delayed` |
| priority | string | 否 | 优先级：`low`/`medium`/`high` |
| start_date | string | 否 | 开始日期范围起始 |
| end_date | string | 否 | 开始日期范围结束 |
| keyword | string | 否 | 关键词搜索 |

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "task_001",
        "name": "完成用户模块开发",
        "description": "开发用户注册、登录、权限管理功能",
        "project": {
          "id": "proj_001",
          "name": "客户管理系统升级"
        },
        "assignee": {
          "id": "user_002",
          "name": "王小明",
          "avatar": "https://..."
        },
        "status": "progress",
        "priority": "high",
        "progress": 80,
        "start_date": "2026-01-20",
        "end_date": "2026-02-06",
        "estimated_hours": 40,
        "actual_hours": 32,
        "created_at": "2026-01-20T08:00:00Z",
        "updated_at": "2026-02-04T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

### 5.2 获取任务详情

#### GET `/tasks/{task_id}`

获取单个任务的详细信息。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "task_001",
    "name": "完成用户模块开发",
    "description": "开发用户注册、登录、权限管理功能",
    "project": {
      "id": "proj_001",
      "name": "客户管理系统升级"
    },
    "assignee": {
      "id": "user_002",
      "name": "王小明",
      "avatar": "https://..."
    },
    "creator": {
      "id": "user_001",
      "name": "张经理"
    },
    "status": "progress",
    "priority": "high",
    "progress": 80,
    "start_date": "2026-01-20",
    "end_date": "2026-02-06",
    "actual_start_date": "2026-01-20",
    "actual_end_date": null,
    "estimated_hours": 40,
    "actual_hours": 32,
    "dependencies": [
      { "id": "task_002", "name": "数据库设计", "type": "finish_to_start" }
    ],
    "subtasks": [
      { "id": "subtask_001", "name": "用户注册功能", "status": "completed" },
      { "id": "subtask_002", "name": "用户登录功能", "status": "completed" },
      { "id": "subtask_003", "name": "权限管理功能", "status": "progress" }
    ],
    "comments": [
      {
        "id": "comment_001",
        "user": { "id": "user_001", "name": "张经理" },
        "content": "注意与现有系统的兼容性",
        "created_at": "2026-01-25T14:00:00Z"
      }
    ],
    "attachments": [
      {
        "id": "attach_001",
        "name": "需求文档.pdf",
        "url": "https://...",
        "size": 1024000
      }
    ],
    "activity_logs": [
      {
        "id": "log_001",
        "user": { "id": "user_002", "name": "王小明" },
        "action": "update_progress",
        "detail": "进度更新: 60% -> 80%",
        "created_at": "2026-02-04T10:30:00Z"
      }
    ],
    "created_at": "2026-01-20T08:00:00Z",
    "updated_at": "2026-02-04T10:30:00Z"
  }
}
```

### 5.3 创建任务

#### POST `/tasks`

创建新任务。

**请求参数**
```json
{
  "name": "新任务名称",
  "description": "任务描述",
  "project_id": "proj_001",
  "assignee_id": "user_002",
  "priority": "high",
  "start_date": "2026-02-05",
  "end_date": "2026-02-10",
  "estimated_hours": 20,
  "parent_task_id": null,
  "dependency_ids": ["task_001"]
}
```

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| name | string | 是 | 任务名称 |
| description | string | 否 | 任务描述 |
| project_id | string | 是 | 所属项目ID |
| assignee_id | string | 是 | 负责人ID |
| priority | string | 否 | 优先级，默认`medium` |
| start_date | string | 是 | 计划开始日期 |
| end_date | string | 是 | 计划结束日期 |
| estimated_hours | number | 否 | 预估工时 |
| parent_task_id | string | 否 | 父任务ID（创建子任务时） |
| dependency_ids | array | 否 | 依赖任务ID列表 |

**响应示例**
```json
{
  "code": 0,
  "message": "任务创建成功",
  "data": {
    "id": "task_010",
    "name": "新任务名称",
    "status": "pending",
    "created_at": "2026-02-04T10:30:00Z"
  }
}
```

### 5.4 更新任务

#### PUT `/tasks/{task_id}`

更新任务信息。

**请求参数**
```json
{
  "name": "更新后的任务名称",
  "status": "progress",
  "progress": 50,
  "assignee_id": "user_003"
}
```

### 5.5 更新任务进度

#### PATCH `/tasks/{task_id}/progress`

快捷更新任务进度。

**请求参数**
```json
{
  "progress": 80,
  "comment": "已完成用户登录功能",
  "actual_hours": 8
}
```

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| progress | int | 是 | 进度百分比 0-100 |
| comment | string | 否 | 进度备注 |
| actual_hours | number | 否 | 本次新增实际工时 |

**响应示例**
```json
{
  "code": 0,
  "message": "进度更新成功",
  "data": {
    "id": "task_001",
    "progress": 80,
    "status": "progress",
    "updated_at": "2026-02-04T10:30:00Z"
  }
}
```

### 5.6 删除任务

#### DELETE `/tasks/{task_id}`

删除任务。

### 5.7 获取甘特图数据

#### GET `/tasks/gantt`

获取甘特图展示所需的任务时间线数据。

**请求参数（Query）**

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| project_id | string | 否 | 项目ID |
| start_date | string | 是 | 时间范围开始 |
| end_date | string | 是 | 时间范围结束 |

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "tasks": [
      {
        "id": "task_001",
        "name": "完成用户模块开发",
        "start_date": "2026-01-20",
        "end_date": "2026-02-06",
        "progress": 80,
        "status": "progress",
        "assignee": { "id": "user_002", "name": "王小明" },
        "dependencies": ["task_002"]
      }
    ],
    "milestones": [
      {
        "id": "ms_001",
        "name": "需求确认",
        "date": "2026-01-15",
        "status": "completed"
      }
    ],
    "date_range": {
      "start": "2026-01-15",
      "end": "2026-02-28"
    }
  }
}
```

---

## 6. 预警管理 API

### 6.1 获取预警列表

#### GET `/alerts`

获取预警通知列表。

**请求参数（Query）**

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| level | string | 否 | 预警级别：`low`/`medium`/`high`/`critical` |
| type | string | 否 | 预警类型：`deadline`/`overdue`/`progress`/`milestone`/`resource` |
| is_read | boolean | 否 | 是否已读 |
| project_id | string | 否 | 项目ID筛选 |

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "alert_001",
        "type": "deadline",
        "level": "high",
        "title": "任务即将到期",
        "message": "任务\"完成用户模块开发\"将于2天后到期，当前进度80%",
        "project": {
          "id": "proj_001",
          "name": "客户管理系统升级"
        },
        "task": {
          "id": "task_001",
          "name": "完成用户模块开发"
        },
        "assignee": {
          "id": "user_002",
          "name": "王小明"
        },
        "is_read": false,
        "created_at": "2026-02-04T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 5,
      "total_pages": 1
    },
    "statistics": {
      "total": 5,
      "unread": 3,
      "critical": 1,
      "high": 2,
      "medium": 1,
      "low": 1
    }
  }
}
```

### 6.2 标记预警已读

#### PATCH `/alerts/{alert_id}/read`

标记单个预警为已读。

**响应示例**
```json
{
  "code": 0,
  "message": "标记成功",
  "data": {
    "id": "alert_001",
    "is_read": true
  }
}
```

### 6.3 批量标记已读

#### PATCH `/alerts/batch-read`

批量标记预警为已读。

**请求参数**
```json
{
  "alert_ids": ["alert_001", "alert_002", "alert_003"]
}
```

或标记全部：
```json
{
  "mark_all": true
}
```

### 6.4 获取预警规则配置

#### GET `/alerts/settings`

获取当前用户的预警规则配置。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "deadline_reminder_days": 3,
    "progress_warning_threshold": 20,
    "notification_channels": {
      "in_app": true,
      "email": true,
      "wechat_work": true
    },
    "quiet_hours": {
      "enabled": false,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

### 6.5 更新预警规则配置

#### PUT `/alerts/settings`

更新预警规则配置。

**请求参数**
```json
{
  "deadline_reminder_days": 5,
  "progress_warning_threshold": 30,
  "notification_channels": {
    "in_app": true,
    "email": true,
    "wechat_work": false
  }
}
```

| 参数 | 类型 | 说明 |
|-----|-----|-----|
| deadline_reminder_days | int | 到期提前提醒天数 |
| progress_warning_threshold | int | 进度预警阈值（%） |
| notification_channels | object | 通知渠道开关 |

---

## 7. 用户与团队 API

### 7.1 获取当前用户信息

#### GET `/users/me`

获取当前登录用户信息。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "user_001",
    "name": "张三",
    "email": "zhangsan@example.com",
    "avatar": "https://...",
    "phone": "138****1234",
    "department": {
      "id": "dept_001",
      "name": "技术部"
    },
    "role": "manager",
    "permissions": ["project:create", "project:edit", "task:assign"],
    "created_at": "2025-06-01T08:00:00Z"
  }
}
```

### 7.2 获取团队成员列表

#### GET `/users`

获取团队成员列表。

**请求参数（Query）**

| 参数 | 类型 | 必填 | 说明 |
|-----|-----|-----|-----|
| department_id | string | 否 | 部门ID筛选 |
| keyword | string | 否 | 姓名/邮箱搜索 |
| role | string | 否 | 角色筛选 |

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "user_001",
        "name": "张经理",
        "email": "zhang@example.com",
        "avatar": "https://...",
        "department": { "id": "dept_001", "name": "技术部" },
        "role": "manager"
      }
    ],
    "pagination": { ... }
  }
}
```

### 7.3 获取部门列表

#### GET `/departments`

获取部门列表。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "dept_001",
      "name": "技术部",
      "parent_id": null,
      "manager": { "id": "user_001", "name": "张经理" },
      "member_count": 15
    },
    {
      "id": "dept_002",
      "name": "产品部",
      "parent_id": null,
      "manager": { "id": "user_010", "name": "刘总监" },
      "member_count": 8
    }
  ]
}
```

---

## 8. 统计与报表 API

### 8.1 获取控制台统计数据

#### GET `/statistics/dashboard`

获取控制台概览统计数据。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "overview": {
      "projects_in_progress": 12,
      "pending_tasks": 28,
      "completed_tasks": 156,
      "alerts_count": 3
    },
    "recent_projects": [
      {
        "id": "proj_001",
        "name": "客户管理系统升级",
        "progress": 68,
        "status": "progress",
        "department": "技术部",
        "deadline": "2026-03-15"
      }
    ],
    "upcoming_tasks": [
      {
        "id": "task_001",
        "name": "完成用户模块开发",
        "project": "客户管理系统升级",
        "deadline": "2026-02-06",
        "priority": "high"
      }
    ],
    "weekly_progress": [
      { "day": "周一", "value": 65 },
      { "day": "周二", "value": 80 },
      { "day": "周三", "value": 45 },
      { "day": "周四", "value": 90 },
      { "day": "周五", "value": 70 },
      { "day": "周六", "value": 30 },
      { "day": "周日", "value": 50 }
    ],
    "team_activities": [
      {
        "user": { "id": "user_002", "name": "王小明" },
        "action": "完成任务",
        "target": "用户登录模块",
        "time": "10分钟前"
      }
    ]
  }
}
```

### 8.2 获取项目统计数据

#### GET `/statistics/projects/{project_id}`

获取单个项目的统计数据。

**响应示例**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "proj_001",
    "task_statistics": {
      "total": 45,
      "pending": 5,
      "in_progress": 10,
      "completed": 28,
      "delayed": 2
    },
    "progress_trend": [
      { "date": "2026-01-20", "progress": 10 },
      { "date": "2026-01-27", "progress": 25 },
      { "date": "2026-02-03", "progress": 68 }
    ],
    "workload_distribution": [
      { "user": "王小明", "hours": 80, "tasks": 12 },
      { "user": "李小红", "hours": 60, "tasks": 8 }
    ],
    "milestone_status": [
      { "name": "需求确认", "status": "completed", "on_time": true },
      { "name": "设计完成", "status": "completed", "on_time": true },
      { "name": "开发完成", "status": "progress", "on_time": false }
    ]
  }
}
```

---

## 9. 错误码定义

### 9.1 错误码分类

| 错误码范围 | 类别 | 说明 |
|-----------|-----|-----|
| 0 | 成功 | 请求成功 |
| 10000-19999 | 系统错误 | 服务器内部错误 |
| 20000-29999 | 认证错误 | 登录、权限相关 |
| 30000-39999 | 参数错误 | 请求参数校验失败 |
| 40000-49999 | 业务错误 | 业务逻辑错误 |
| 50000-59999 | 资源错误 | 资源不存在等 |

### 9.2 错误码明细

| 错误码 | HTTP状态码 | 说明 |
|-------|-----------|-----|
| 0 | 200 | 成功 |
| 10001 | 500 | 服务器内部错误 |
| 10002 | 503 | 服务暂时不可用 |
| 20001 | 401 | 未登录或令牌过期 |
| 20002 | 401 | 令牌无效 |
| 20003 | 403 | 无操作权限 |
| 30001 | 400 | 参数缺失 |
| 30002 | 400 | 参数格式错误 |
| 30003 | 400 | 参数值超出范围 |
| 40001 | 400 | 项目名称已存在 |
| 40002 | 400 | 任务依赖存在循环 |
| 40003 | 400 | 操作状态不允许 |
| 50001 | 404 | 项目不存在 |
| 50002 | 404 | 任务不存在 |
| 50003 | 404 | 用户不存在 |

---

## 10. 数据模型

### 10.1 项目模型 (Project)

```typescript
interface Project {
  id: string;                    // 项目ID
  name: string;                  // 项目名称
  description?: string;          // 项目描述
  department_id: string;         // 部门ID
  status: ProjectStatus;         // 状态
  leader_id: string;             // 负责人ID
  member_ids: string[];          // 成员ID列表
  start_date: string;            // 计划开始日期
  end_date: string;              // 计划结束日期
  actual_end_date?: string;      // 实际完成日期
  progress: number;              // 进度 0-100
  milestones: Milestone[];       // 里程碑列表
  dependency_ids?: string[];     // 依赖项目ID
  tags?: string[];               // 标签
  remarks?: string;              // 备注
  created_at: string;            // 创建时间
  updated_at: string;            // 更新时间
}

enum ProjectStatus {
  PENDING = 'pending',           // 待启动
  PROGRESS = 'progress',         // 进行中
  COMPLETED = 'completed',       // 已完成
  DELAYED = 'delayed'            // 已延期
}
```

### 10.2 任务模型 (Task)

```typescript
interface Task {
  id: string;                    // 任务ID
  name: string;                  // 任务名称
  description?: string;          // 任务描述
  project_id: string;            // 所属项目ID
  assignee_id: string;           // 负责人ID
  creator_id: string;            // 创建人ID
  status: TaskStatus;            // 状态
  priority: TaskPriority;        // 优先级
  progress: number;              // 进度 0-100
  start_date: string;            // 计划开始日期
  end_date: string;              // 计划结束日期
  actual_start_date?: string;    // 实际开始日期
  actual_end_date?: string;      // 实际完成日期
  estimated_hours?: number;      // 预估工时
  actual_hours?: number;         // 实际工时
  parent_task_id?: string;       // 父任务ID
  dependency_ids?: string[];     // 依赖任务ID
  created_at: string;            // 创建时间
  updated_at: string;            // 更新时间
}

enum TaskStatus {
  PENDING = 'pending',           // 待开始
  PROGRESS = 'progress',         // 进行中
  COMPLETED = 'completed',       // 已完成
  DELAYED = 'delayed'            // 已延期
}

enum TaskPriority {
  LOW = 'low',                   // 低
  MEDIUM = 'medium',             // 中
  HIGH = 'high'                  // 高
}
```

### 10.3 预警模型 (Alert)

```typescript
interface Alert {
  id: string;                    // 预警ID
  type: AlertType;               // 预警类型
  level: AlertLevel;             // 预警级别
  title: string;                 // 标题
  message: string;               // 消息内容
  project_id?: string;           // 关联项目ID
  task_id?: string;              // 关联任务ID
  assignee_id?: string;          // 相关负责人ID
  is_read: boolean;              // 是否已读
  created_at: string;            // 创建时间
}

enum AlertType {
  DEADLINE = 'deadline',         // 到期预警
  OVERDUE = 'overdue',           // 延期预警
  PROGRESS = 'progress',         // 进度预警
  MILESTONE = 'milestone',       // 里程碑预警
  RESOURCE = 'resource'          // 资源预警
}

enum AlertLevel {
  LOW = 'low',                   // 低
  MEDIUM = 'medium',             // 中
  HIGH = 'high',                 // 高
  CRITICAL = 'critical'          // 紧急
}
```

### 10.4 用户模型 (User)

```typescript
interface User {
  id: string;                    // 用户ID
  name: string;                  // 姓名
  email: string;                 // 邮箱
  avatar?: string;               // 头像URL
  phone?: string;                // 手机号
  department_id: string;         // 部门ID
  role: UserRole;                // 角色
  permissions: string[];         // 权限列表
  created_at: string;            // 创建时间
}

enum UserRole {
  ADMIN = 'admin',               // 管理员
  MANAGER = 'manager',           // 经理
  MEMBER = 'member'              // 成员
}
```

---

## 附录

### A. API 版本历史

| 版本 | 日期 | 变更说明 |
|-----|-----|---------|
| v1.0 | 2026-02-04 | 初始版本 |

### B. SDK 支持

计划提供以下语言的 SDK：
- JavaScript/TypeScript
- Python
- Java
- Go

### C. 接口调试

推荐使用以下工具进行接口调试：
- Postman
- Insomnia
- curl

---

**文档版本**: v1.0  
**最后更新**: 2026-02-04  
