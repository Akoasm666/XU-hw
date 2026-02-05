"""
Pydantic 数据验证模式
"""
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel


class TodoBase(BaseModel):
    """待办事项基础模式"""
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "low"  # low, medium, high


class TodoCreate(TodoBase):
    """创建待办事项的模式"""
    pass


class TodoUpdate(BaseModel):
    """更新待办事项的模式"""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(TodoBase):
    """待办事项响应模式"""
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApiResponse(BaseModel):
    """统一API响应格式"""
    code: int
    message: str
    data: Any = None
