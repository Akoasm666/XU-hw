#!/bin/bash

# TodoApp API 测试脚本
# 用于测试所有 API 接口

BASE_URL="http://localhost:8000/api/v1"

echo "=========================================="
echo "  TodoApp API 接口测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}测试 1: 获取所有待办事项${NC}"
echo "GET $BASE_URL/todos"
curl -s "$BASE_URL/todos" | python3 -m json.tool
echo ""
echo ""

echo -e "${YELLOW}测试 2: 创建新的待办事项${NC}"
echo "POST $BASE_URL/todos"
RESPONSE=$(curl -s -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "学习Spring Boot",
    "description": "完成TodoApp项目",
    "priority": 2,
    "due_date": "2024-12-31T23:59:59"
  }')
echo "$RESPONSE" | python3 -m json.tool

# 提取创建的 ID
TODO_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
echo ""
echo -e "${GREEN}创建成功，ID: $TODO_ID${NC}"
echo ""
echo ""

if [ ! -z "$TODO_ID" ]; then
    echo -e "${YELLOW}测试 3: 更新待办事项${NC}"
    echo "PUT $BASE_URL/todos/$TODO_ID"
    curl -s -X PUT "$BASE_URL/todos/$TODO_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "学习Spring Boot（已更新）",
        "description": "完成TodoApp项目开发",
        "priority": 2,
        "completed": false
      }' | python3 -m json.tool
    echo ""
    echo ""
    
    echo -e "${YELLOW}测试 4: 切换完成状态${NC}"
    echo "PATCH $BASE_URL/todos/$TODO_ID/toggle"
    curl -s -X PATCH "$BASE_URL/todos/$TODO_ID/toggle" | python3 -m json.tool
    echo ""
    echo ""
    
    echo -e "${YELLOW}测试 5: 再次切换完成状态${NC}"
    echo "PATCH $BASE_URL/todos/$TODO_ID/toggle"
    curl -s -X PATCH "$BASE_URL/todos/$TODO_ID/toggle" | python3 -m json.tool
    echo ""
    echo ""
fi

echo -e "${YELLOW}测试 6: 过滤已完成的待办事项${NC}"
echo "GET $BASE_URL/todos?completed=true"
curl -s "$BASE_URL/todos?completed=true" | python3 -m json.tool
echo ""
echo ""

echo -e "${YELLOW}测试 7: 过滤未完成的待办事项${NC}"
echo "GET $BASE_URL/todos?completed=false"
curl -s "$BASE_URL/todos?completed=false" | python3 -m json.tool
echo ""
echo ""

echo -e "${YELLOW}测试 8: 分页获取（limit=2, offset=0）${NC}"
echo "GET $BASE_URL/todos?limit=2&offset=0"
curl -s "$BASE_URL/todos?limit=2&offset=0" | python3 -m json.tool
echo ""
echo ""

# 创建几个已完成的待办事项用于测试删除
echo -e "${YELLOW}准备测试数据：创建几个已完成的待办事项${NC}"
for i in {1..3}; do
    RESPONSE=$(curl -s -X POST "$BASE_URL/todos" \
      -H "Content-Type: application/json" \
      -d "{\"title\": \"测试待办$i\", \"description\": \"用于测试删除\", \"priority\": 0}")
    TEMP_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
    if [ ! -z "$TEMP_ID" ]; then
        curl -s -X PATCH "$BASE_URL/todos/$TEMP_ID/toggle" > /dev/null
        echo "创建并标记完成: ID=$TEMP_ID"
    fi
done
echo ""
echo ""

echo -e "${YELLOW}测试 9: 批量删除已完成的待办事项${NC}"
echo "DELETE $BASE_URL/todos/completed"
curl -s -X DELETE "$BASE_URL/todos/completed" | python3 -m json.tool
echo ""
echo ""

echo -e "${YELLOW}测试 10: 查看剩余的待办事项${NC}"
echo "GET $BASE_URL/todos"
curl -s "$BASE_URL/todos" | python3 -m json.tool
echo ""
echo ""

if [ ! -z "$TODO_ID" ]; then
    echo -e "${YELLOW}测试 11: 删除单个待办事项${NC}"
    echo "DELETE $BASE_URL/todos/$TODO_ID"
    curl -s -X DELETE "$BASE_URL/todos/$TODO_ID" | python3 -m json.tool
    echo ""
    echo ""
fi

echo -e "${YELLOW}测试 12: 尝试获取不存在的待办事项（应返回404）${NC}"
echo "GET $BASE_URL/todos/99999"
curl -s "$BASE_URL/todos/99999" | python3 -m json.tool
echo ""
echo ""

echo -e "${YELLOW}测试 13: 创建不合法的待办事项（标题为空，应返回400）${NC}"
echo "POST $BASE_URL/todos"
curl -s -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "空标题测试"
  }' | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo -e "${GREEN}  所有测试完成！${NC}"
echo "=========================================="
echo ""
echo "提示："
echo "- 可以访问 http://localhost:8000/swagger-ui.html 查看完整的 API 文档"
echo "- 可以使用 Postman 或其他工具进行更复杂的测试"
echo ""
