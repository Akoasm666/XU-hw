/**
 * 待办事项列表项组件
 */
import './TodoItem.css';

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

// 优先级映射
const priorityMap = {
  low: { label: '低', className: 'priority-low' },
  medium: { label: '中', className: 'priority-medium' },
  high: { label: '高', className: 'priority-high' },
};

function TodoItem({ todo, onToggle, onDelete }) {
  const priority = priorityMap[todo.priority] || priorityMap.low;
  
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <span className="todo-title">{todo.title}</span>
        </div>
        <div className="todo-meta">
          <span className={`priority-badge ${priority.className}`}>
            优先级: {priority.label}
          </span>
          <span className="todo-date">
            创建: {formatDate(todo.created_at)}
          </span>
          {todo.updated_at !== todo.created_at && (
            <span className="todo-date">
              更新: {formatDate(todo.updated_at)}
            </span>
          )}
        </div>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
      </div>
      <div className="todo-actions">
        <button 
          className={`btn ${todo.completed ? 'btn-undo' : 'btn-complete'}`}
          onClick={() => onToggle(todo.id, !todo.completed)}
        >
          {todo.completed ? '取消完成' : '完成'}
        </button>
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(todo.id)}
        >
          删除
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
