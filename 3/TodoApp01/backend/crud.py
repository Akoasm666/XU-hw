"""
CRUD 操作模块
"""
from sqlalchemy.orm import Session
from models import Todo
from schemas import TodoCreate, TodoUpdate


def get_todos(db: Session, status: str = "all"):
    """
    获取待办事项列表
    :param db: 数据库会话
    :param status: 筛选状态 (all, completed, pending)
    :return: 待办事项列表
    """
    query = db.query(Todo)
    
    if status == "completed":
        query = query.filter(Todo.completed == True)
    elif status == "pending":
        query = query.filter(Todo.completed == False)
    
    return query.order_by(Todo.created_at.desc()).all()


def get_todo(db: Session, todo_id: int):
    """
    获取单个待办事项
    :param db: 数据库会话
    :param todo_id: 待办事项ID
    :return: 待办事项对象或None
    """
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoCreate):
    """
    创建待办事项
    :param db: 数据库会话
    :param todo: 待办事项数据
    :return: 创建的待办事项对象
    """
    db_todo = Todo(title=todo.title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_todo(db: Session, todo_id: int, todo: TodoUpdate):
    """
    更新待办事项
    :param db: 数据库会话
    :param todo_id: 待办事项ID
    :param todo: 更新数据
    :return: 更新后的待办事项对象或None
    """
    db_todo = get_todo(db, todo_id)
    if db_todo is None:
        return None
    
    update_data = todo.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_todo, key, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int):
    """
    删除单个待办事项
    :param db: 数据库会话
    :param todo_id: 待办事项ID
    :return: 是否删除成功
    """
    db_todo = get_todo(db, todo_id)
    if db_todo is None:
        return False
    
    db.delete(db_todo)
    db.commit()
    return True


def delete_completed_todos(db: Session):
    """
    删除所有已完成的待办事项
    :param db: 数据库会话
    :return: 删除的数量
    """
    result = db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return result


def delete_all_todos(db: Session):
    """
    删除全部待办事项
    :param db: 数据库会话
    :return: 删除的数量
    """
    result = db.query(Todo).delete()
    db.commit()
    return result
