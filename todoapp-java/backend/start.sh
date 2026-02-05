#!/bin/bash

# TodoApp Backend 快速启动脚本
# 此脚本用于自动检查环境、初始化数据库并启动应用

echo "=========================================="
echo "  TodoApp Backend 快速启动脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Java
echo -n "检查 Java 环境... "
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F '.' '{print $1}')
    if [ "$JAVA_VERSION" -ge 17 ]; then
        echo -e "${GREEN}✓ Java $JAVA_VERSION 已安装${NC}"
    else
        echo -e "${RED}✗ Java 版本过低，需要 Java 17+${NC}"
        echo "请运行: brew install openjdk@17"
        exit 1
    fi
else
    echo -e "${RED}✗ 未安装 Java${NC}"
    echo "请运行: brew install openjdk@17"
    exit 1
fi

# 检查 Maven
echo -n "检查 Maven 环境... "
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn -version | head -n 1 | awk '{print $3}')
    echo -e "${GREEN}✓ Maven $MVN_VERSION 已安装${NC}"
else
    echo -e "${RED}✗ 未安装 Maven${NC}"
    echo "请运行: brew install maven"
    exit 1
fi

# 检查 MySQL
echo -n "检查 MySQL 环境... "
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL 已安装${NC}"
else
    echo -e "${RED}✗ 未安装 MySQL${NC}"
    echo "请运行: brew install mysql && brew services start mysql"
    exit 1
fi

echo ""
echo "=========================================="
echo "  初始化数据库"
echo "=========================================="
echo ""

# 检查数据库是否存在
echo "检查数据库 todoapp..."
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'todoapp';" 2>/dev/null | grep todoapp)

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}数据库不存在，正在创建...${NC}"
    mysql -u root -e "CREATE DATABASE todoapp;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 数据库创建成功${NC}"
    else
        echo -e "${RED}✗ 数据库创建失败，请检查 MySQL 是否正常运行${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ 数据库已存在${NC}"
fi

# 导入建表脚本
echo "导入建表脚本..."
mysql -u root todoapp < db/todoapp.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 建表脚本导入成功${NC}"
else
    echo -e "${RED}✗ 建表脚本导入失败${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "  编译项目"
echo "=========================================="
echo ""

# 检查是否需要重新编译
if [ ! -d "target" ]; then
    echo "首次编译，这可能需要几分钟下载依赖..."
    mvn clean compile
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ 编译失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ 编译成功${NC}"
else
    echo "项目已编译，跳过编译步骤"
fi

echo ""
echo "=========================================="
echo "  运行测试"
echo "=========================================="
echo ""

read -p "是否运行单元测试？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mvn test
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠ 测试失败，但可以继续运行应用${NC}"
    else
        echo -e "${GREEN}✓ 所有测试通过${NC}"
    fi
fi

echo ""
echo "=========================================="
echo "  启动应用"
echo "=========================================="
echo ""

echo -e "${GREEN}正在启动 TodoApp Backend...${NC}"
echo ""
echo "应用将运行在: http://localhost:8000"
echo "Swagger 文档: http://localhost:8000/swagger-ui.html"
echo ""
echo "按 Ctrl+C 停止应用"
echo ""

# 启动应用
mvn spring-boot:run
