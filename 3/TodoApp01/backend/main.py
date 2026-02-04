"""
FastAPI 主应用模块
待办事项(Todo)应用后端 API
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

from database import engine, get_db, Base
from schemas import TodoCreate, TodoUpdate, TodoResponse, ApiResponse
import crud

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建 FastAPI 应用
app = FastAPI(
    title="待办事项 API",
    description="一个简单的待办事项应用后端 API",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，生产环境应该限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def read_root():
    """根路径，返回 API 信息"""
    return ApiResponse(
        code=200,
        message="待办事项 API 服务运行中",
        data={"version": "1.0.0"}
    )


@app.get("/api/todos", response_model=ApiResponse, tags=["Todos"])
def get_todos(status: Optional[str] = "all", db: Session = Depends(get_db)):
    """
    获取待办事项列表
    
    - **status**: 筛选状态 (all: 全部, completed: 已完成, pending: 未完成)
    """
    if status not in ["all", "completed", "pending"]:
        raise HTTPException(status_code=400, detail="无效的状态参数")
    
    todos = crud.get_todos(db, status=status)
    return ApiResponse(
        code=200,
        message="success",
        data=[TodoResponse.model_validate(todo) for todo in todos]
    )


@app.post("/api/todos", response_model=ApiResponse, tags=["Todos"])
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """
    创建新的待办事项
    
    - **title**: 任务标题 (必填)
    """
    if not todo.title.strip():
        raise HTTPException(status_code=400, detail="任务标题不能为空")
    
    db_todo = crud.create_todo(db, todo)
    return ApiResponse(
        code=201,
        message="创建成功",
        data=TodoResponse.model_validate(db_todo)
    )


@app.put("/api/todos/{todo_id}", response_model=ApiResponse, tags=["Todos"])
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    """
    更新待办事项
    
    - **todo_id**: 待办事项ID
    - **title**: 新的任务标题 (可选)
    - **completed**: 完成状态 (可选)
    """
    db_todo = crud.update_todo(db, todo_id, todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="待办事项不存在")
    
    return ApiResponse(
        code=200,
        message="更新成功",
        data=TodoResponse.model_validate(db_todo)
    )


@app.delete("/api/todos/completed", response_model=ApiResponse, tags=["Todos"])
def delete_completed_todos(db: Session = Depends(get_db)):
    """
    删除所有已完成的待办事项
    """
    deleted_count = crud.delete_completed_todos(db)
    return ApiResponse(
        code=200,
        message="已清除所有已完成的待办事项",
        data={"deleted_count": deleted_count}
    )


@app.delete("/api/todos/all", response_model=ApiResponse, tags=["Todos"])
def delete_all_todos(db: Session = Depends(get_db)):
    """
    删除全部待办事项
    """
    deleted_count = crud.delete_all_todos(db)
    return ApiResponse(
        code=200,
        message="已清除全部待办事项",
        data={"deleted_count": deleted_count}
    )


@app.delete("/api/todos/{todo_id}", response_model=ApiResponse, tags=["Todos"])
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    删除单个待办事项
    
    - **todo_id**: 待办事项ID
    """
    success = crud.delete_todo(db, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="待办事项不存在")
    
    return ApiResponse(
        code=200,
        message="删除成功",
        data=None
    )


# 错误处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return ApiResponse(
        code=exc.status_code,
        message=exc.detail,
        data=None
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
