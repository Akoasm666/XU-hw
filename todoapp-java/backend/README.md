# TodoApp Backend

基于 Spring Boot 3.0 的 RESTful 待办事项管理 API

## 技术栈

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL 5.7+**
- **Lombok**
- **Swagger/OpenAPI 3.0**
- **Maven**

## 项目结构

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/todoapp/
│   │   │   ├── TodoAppApplication.java      # 主启动类
│   │   │   ├── config/                      # 配置类
│   │   │   │   ├── CorsConfig.java         # CORS跨域配置
│   │   │   │   └── SwaggerConfig.java      # Swagger文档配置
│   │   │   ├── controller/                  # 控制器层
│   │   │   │   └── TodoController.java
│   │   │   ├── dto/                         # 数据传输对象
│   │   │   │   ├── ApiResponse.java
│   │   │   │   ├── DeleteResponse.java
│   │   │   │   ├── TodoDTO.java
│   │   │   │   ├── TodoResponse.java
│   │   │   │   ├── TodoToggleResponse.java
│   │   │   │   └── TodoUpdateDTO.java
│   │   │   ├── entity/                      # 实体类
│   │   │   │   └── Todo.java
│   │   │   ├── exception/                   # 异常处理
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   ├── repository/                  # 数据访问层
│   │   │   │   └── TodoRepository.java
│   │   │   └── service/                     # 业务逻辑层
│   │   │       └── TodoService.java
│   │   └── resources/
│   │       └── application.yml              # 应用配置
│   └── test/                                # 测试代码
│       ├── java/com/todoapp/
│       │   ├── controller/
│       │   │   └── TodoControllerTest.java
│       │   └── service/
│       │       └── TodoServiceTest.java
│       └── resources/
│           └── application.yml
├── db/
│   └── todoapp.sql                          # 数据库建表脚本
├── pom.xml                                  # Maven配置
└── README.md

```

## 快速开始

### 1. 环境要求

- JDK 17 或更高版本
- Maven 3.6+
- MySQL 5.7+ 或 8.0+

### 2. 数据库配置

创建数据库并导入表结构：

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE todoapp;

# 导入表结构
mysql -u root -p todoapp < db/todoapp.sql
```

或者直接执行 `db/todoapp.sql` 文件中的SQL语句。

### 3. 配置文件

编辑 `src/main/resources/application.yml`，确认数据库连接配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/todoapp
    username: root
    password:        # 如果有密码，请填写
```

### 4. 构建和运行

```bash
# 安装依赖并编译
mvn clean install

# 运行应用
mvn spring-boot:run
```

或者使用打包后的 JAR 文件：

```bash
# 打包
mvn clean package

# 运行
java -jar target/todoapp-backend-1.0.0.jar
```

应用启动后，访问 http://localhost:8000

### 5. API 文档

启动应用后，访问 Swagger UI：

- **Swagger UI**: http://localhost:8000/swagger-ui.html
- **API Docs**: http://localhost:8000/api-docs

## API 接口

### 基础信息

- **基础URL**: `http://localhost:8000`
- **API前缀**: `/api/v1`
- **数据格式**: JSON

### 接口列表

#### 1. 获取所有待办事项

```http
GET /api/v1/todos?completed={boolean}&limit={int}&offset={int}
```

**参数**:
- `completed` (可选): 过滤完成状态
- `limit` (可选): 返回数量限制，默认100
- `offset` (可选): 偏移量，默认0

#### 2. 创建待办事项

```http
POST /api/v1/todos
Content-Type: application/json

{
  "title": "待办事项标题",
  "description": "描述信息",
  "priority": 1,
  "due_date": "2024-12-31T23:59:59"
}
```

#### 3. 更新待办事项

```http
PUT /api/v1/todos/{todo_id}
Content-Type: application/json

{
  "title": "更新后的标题",
  "description": "更新后的描述",
  "completed": true,
  "priority": 2
}
```

#### 4. 删除待办事项

```http
DELETE /api/v1/todos/{todo_id}
```

#### 5. 切换完成状态

```http
PATCH /api/v1/todos/{todo_id}/toggle
```

#### 6. 批量删除已完成项

```http
DELETE /api/v1/todos/completed
```

#### 7. 清空所有待办事项

```http
DELETE /api/v1/todos/all
```

## 测试

运行所有测试：

```bash
mvn test
```

运行特定测试类：

```bash
mvn test -Dtest=TodoServiceTest
mvn test -Dtest=TodoControllerTest
```

查看测试覆盖率：

```bash
mvn clean test jacoco:report
```

## 数据库表结构

### todos 表

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | BIGINT | 主键ID | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | 待办事项标题 | NOT NULL |
| description | TEXT | 待办事项描述 | - |
| completed | BOOLEAN | 完成状态 | NOT NULL, DEFAULT FALSE |
| priority | INT | 优先级 | DEFAULT 0 |
| due_date | DATETIME | 截止日期 | - |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

## 开发说明

### CORS 配置

应用已配置 CORS，允许跨域访问。生产环境建议修改 `CorsConfig.java` 限制允许的域名。

### 日志配置

应用使用 Logback 进行日志管理，日志级别在 `application.yml` 中配置：

```yaml
logging:
  level:
    com.todoapp: DEBUG
    org.springframework.web: INFO
```

### 异常处理

全局异常处理器 `GlobalExceptionHandler` 统一处理以下异常：

- `ResourceNotFoundException`: 404 资源不存在
- `MethodArgumentNotValidException`: 400 参数校验失败
- `Exception`: 500 服务器内部错误

## 部署

### 生产环境配置

1. 修改 `application.yml` 中的数据库配置
2. 设置合适的日志级别
3. 配置 CORS 允许的域名
4. 使用环境变量管理敏感信息

```bash
# 使用环境变量
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-host:3306/todoapp
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password

# 运行
java -jar todoapp-backend-1.0.0.jar
```

## 常见问题

### 1. 启动失败，提示数据库连接错误

- 检查 MySQL 是否正常运行
- 确认数据库名、用户名、密码是否正确
- 检查数据库是否已创建

### 2. 端口 8000 已被占用

修改 `application.yml` 中的端口配置：

```yaml
server:
  port: 8080
```

### 3. 测试失败

确保测试数据库配置正确，测试使用 H2 内存数据库，无需额外配置。
