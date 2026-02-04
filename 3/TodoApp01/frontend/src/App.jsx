/**
 * 待办事项应用主组件
 */
import { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompletedTodos,
  deleteAllTodos,
} from './api/todoApi';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 加载待办事项列表
  const loadTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTodos(filter);
      if (response.code === 200) {
        setTodos(response.data);
      }
    } catch (err) {
      setError('加载待办事项失败，请确保后端服务已启动');
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选变化时重新加载
  useEffect(() => {
    loadTodos();
  }, [filter]);

  // 添加待办事项
  const handleAdd = async () => {
    const title = inputValue.trim();
    if (!title) {
      setError('请输入任务内容');
      return;
    }

    setError('');
    try {
      const response = await createTodo(title);
      if (response.code === 201) {
        setInputValue('');
        loadTodos();
      }
    } catch (err) {
      setError('添加失败，请重试');
      console.error('添加失败:', err);
    }
  };

  // 按回车键添加
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  // 切换完成状态
  const handleToggle = async (id, completed) => {
    try {
      await updateTodo(id, { completed });
      loadTodos();
    } catch (err) {
      setError('更新失败，请重试');
      console.error('更新失败:', err);
    }
  };

  // 删除单个待办事项
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (err) {
      setError('删除失败，请重试');
      console.error('删除失败:', err);
    }
  };

  // 清除已完成
  const handleClearCompleted = async () => {
    try {
      await deleteCompletedTodos();
      loadTodos();
    } catch (err) {
      setError('清除失败，请重试');
      console.error('清除失败:', err);
    }
  };

  // 清除全部
  const handleClearAll = async () => {
    if (window.confirm('确定要清除全部待办事项吗？')) {
      try {
        await deleteAllTodos();
        loadTodos();
      } catch (err) {
        setError('清除失败，请重试');
        console.error('清除失败:', err);
      }
    }
  };

  // 计算统计信息
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="app">
      <div className="container">
        {/* 标题 */}
        <h1 className="title">待办事项</h1>

        {/* 输入区域 */}
        <div className="input-section">
          <input
            type="text"
            className="input"
            placeholder="输入新任务..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn-add" onClick={handleAdd}>
            添加
          </button>
        </div>

        {/* 错误提示 */}
        {error && <div className="error-message">{error}</div>}

        {/* 筛选区域 */}
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部 ({filter === 'all' ? totalCount : '-'})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            未完成 ({filter === 'pending' ? totalCount : '-'})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            已完成 ({filter === 'completed' ? totalCount : '-'})
          </button>
        </div>

        {/* 待办事项列表 */}
        <div className="todo-list-section">
          {loading ? (
            <div className="loading">加载中...</div>
          ) : todos.length === 0 ? (
            <div className="empty-message">
              {filter === 'all'
                ? '暂无待办事项，添加一个吧！'
                : filter === 'pending'
                ? '没有未完成的任务'
                : '没有已完成的任务'}
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>

        {/* 底部操作区域 */}
        <div className="footer-section">
          <div className="stats">
            共 {totalCount} 项，已完成 {completedCount} 项，未完成 {pendingCount} 项
          </div>
          <div className="footer-actions">
            <button className="btn-clear" onClick={handleClearCompleted}>
              清除已完成
            </button>
            <button className="btn-clear btn-danger" onClick={handleClearAll}>
              清除全部
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
