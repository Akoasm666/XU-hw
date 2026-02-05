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
  const [allTodos, setAllTodos] = useState([]);  // 所有待办事项（用于统计）
  const [inputValue, setInputValue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 加载所有待办事项
  const loadTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTodos('all');
      if (response.code === 200) {
        setAllTodos(response.data);
      }
    } catch (err) {
      setError('加载待办事项失败，请确保后端服务已启动');
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadTodos();
  }, []);

  // 优先级权重（高 > 中 > 低）
  const priorityWeight = { high: 3, medium: 2, low: 1 };

  // 根据筛选条件过滤并排序显示的待办事项
  const filteredTodos = allTodos
    .filter((todo) => {
      if (filter === 'pending') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .sort((a, b) => {
      // 先按优先级排序（高优先级在前）
      const priorityDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      // 优先级相同时，按创建时间排序（新的在前）
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // 添加待办事项
  const handleAdd = async () => {
    const title = inputValue.trim();
    if (!title) {
      setError('请输入任务内容');
      return;
    }

    setError('');
    try {
      const response = await createTodo(title, description.trim(), priority);
      if (response.code === 201) {
        setInputValue('');
        setDescription('');
        setPriority('low');
        loadTodos();
      }
    } catch (err) {
      setError('添加失败，请重试');
      console.error('添加失败:', err);
    }
  };

  // 按回车键添加
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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
    if (window.confirm('确定要清空所有待办事项吗？')) {
      try {
        await deleteAllTodos();
        loadTodos();
      } catch (err) {
        setError('清除失败，请重试');
        console.error('清除失败:', err);
      }
    }
  };

  // 计算统计信息（始终基于全部数据）
  const completedCount = allTodos.filter((t) => t.completed).length;
  const pendingCount = allTodos.filter((t) => !t.completed).length;
  const totalCount = allTodos.length;

  // 优先级选项
  const priorityOptions = [
    { value: 'low', label: '低优先级' },
    { value: 'medium', label: '中优先级' },
    { value: 'high', label: '高优先级' },
  ];

  return (
    <div className="app">
      {/* 头部 */}
      <header className="header">
        <h1 className="header-title">待办事项管理</h1>
        <p className="header-subtitle">高效管理您的日常任务</p>
      </header>

      <div className="container">
        {/* 输入区域 */}
        <div className="input-section">
          <div className="input-row">
            <input
              type="text"
              className="input"
              placeholder="输入新的待办事项..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <select
              className="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button className="btn-add" onClick={handleAdd}>
              添加
            </button>
          </div>
          <textarea
            className="description-input"
            placeholder="描述信息（可选）..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* 错误提示 */}
        {error && <div className="error-message">{error}</div>}

        {/* 统计信息 */}
        <div className="stats-section">
          <span>总计: <strong>{totalCount}</strong></span>
          <span>未完成: <strong>{pendingCount}</strong></span>
          <span>已完成: <strong>{completedCount}</strong></span>
        </div>

        {/* 筛选区域 */}
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部 ({totalCount})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            未完成 ({pendingCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            已完成 ({completedCount})
          </button>
        </div>

        {/* 待办事项列表 */}
        <div className="todo-list-section">
          {loading ? (
            <div className="loading">加载中...</div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-message">
              {filter === 'all'
                ? '暂无待办事项，添加一个吧！'
                : filter === 'pending'
                ? '没有未完成的任务'
                : '没有已完成的任务'}
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
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
          <button className="btn-clear btn-warning" onClick={handleClearCompleted}>
            清除已完成 ({completedCount})
          </button>
          <button className="btn-clear btn-danger" onClick={handleClearAll}>
            清空所有 ({totalCount})
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
