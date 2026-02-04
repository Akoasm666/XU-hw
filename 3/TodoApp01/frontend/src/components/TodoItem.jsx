/**
 * 待办事项列表项组件
 */
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <span className="todo-title">{todo.title}</span>
      <div className="todo-actions">
        <button 
          className={`btn btn-complete ${todo.completed ? 'btn-undo' : ''}`}
          onClick={() => onToggle(todo.id, !todo.completed)}
        >
          {todo.completed ? '撤销' : '完成'}
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
