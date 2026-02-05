-- 创建todoapp数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS todoapp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用todoapp数据库
USE todoapp;

-- 创建todos表
DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(255) NOT NULL COMMENT '待办事项标题',
    description TEXT COMMENT '待办事项描述',
    completed BOOLEAN NOT NULL DEFAULT FALSE COMMENT '完成状态',
    priority INT DEFAULT 0 COMMENT '优先级（0-低, 1-中, 2-高）',
    due_date DATETIME COMMENT '截止日期',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_completed (completed),
    INDEX idx_created_at (created_at),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办事项表';

-- 插入测试数据
INSERT INTO todos (title, description, completed, priority, due_date) VALUES
('学习React', '完成React基础教程', FALSE, 1, NULL),
('学习Spring Boot', '完成Spring Boot项目实战', FALSE, 2, '2024-12-31 23:59:59'),
('完成作业', '完成第四次课程作业', FALSE, 2, '2024-06-30 23:59:59');
