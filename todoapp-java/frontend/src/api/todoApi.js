/**
 * 待办事项 API 接口模块
 */
import axios from 'axios';

// API 基础 URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 获取待办事项列表
 * @param {string} status - 筛选状态 (all, completed, pending)
 * @returns {Promise} 待办事项列表
 */
export const getTodos = async (status = 'all') => {
  const response = await api.get(`/todos?status=${status}`);
  return response.data;
};

/**
 * 创建新的待办事项
 * @param {string} title - 任务标题
 * @param {string} description - 描述信息（可选）
 * @param {string} priority - 优先级 (low, medium, high)
 * @returns {Promise} 创建的待办事项
 */
export const createTodo = async (title, description = '', priority = 'low') => {
  const response = await api.post('/todos', { title, description, priority });
  return response.data;
};

/**
 * 更新待办事项
 * @param {number} id - 待办事项ID
 * @param {object} data - 更新数据 { title?, description?, priority?, completed? }
 * @returns {Promise} 更新后的待办事项
 */
export const updateTodo = async (id, data) => {
  const response = await api.put(`/todos/${id}`, data);
  return response.data;
};

/**
 * 删除单个待办事项
 * @param {number} id - 待办事项ID
 * @returns {Promise} 响应结果
 */
export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

/**
 * 删除所有已完成的待办事项
 * @returns {Promise} 响应结果
 */
export const deleteCompletedTodos = async () => {
  const response = await api.delete('/todos/completed');
  return response.data;
};

/**
 * 删除全部待办事项
 * @returns {Promise} 响应结果
 */
export const deleteAllTodos = async () => {
  const response = await api.delete('/todos/all');
  return response.data;
};

export default api;
