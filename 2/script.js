/**
 * =============================================
 * 待办事项应用 - JavaScript 功能实现
 * 
 * 功能清单：
 * 1. 添加待办事项
 * 2. 标记完成/取消完成
 * 3. 删除待办事项
 * 4. LocalStorage 数据持久化
 * 5. 筛选功能（全部/未完成/已完成）
 * 6. 清除已完成/清除全部
 * =============================================
 */

// =============================================
// 全局变量和DOM元素获取
// =============================================

/** 待办事项数据数组 */
let todos = [];

/** 当前筛选条件 */
let currentFilter = 'all';

/** LocalStorage 存储键名 */
const STORAGE_KEY = 'todo-app-data';

// 获取DOM元素
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

// =============================================
// LocalStorage 数据持久化相关函数
// =============================================

/**
 * 从LocalStorage读取待办事项数据
 * @returns {Array} 待办事项数组
 */
function loadTodosFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('读取LocalStorage数据失败:', error);
        return [];
    }
}

/**
 * 将待办事项数据保存到LocalStorage
 */
function saveTodosToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('保存到LocalStorage失败:', error);
    }
}

// =============================================
// 待办事项渲染相关函数
// =============================================

/**
 * 根据当前筛选条件获取要显示的待办事项
 * @returns {Array} 筛选后的待办事项数组
 */
function getFilteredTodos() {
    switch (currentFilter) {
        case 'pending':
            // 筛选未完成的待办事项
            return todos.filter(todo => !todo.completed);
        case 'completed':
            // 筛选已完成的待办事项
            return todos.filter(todo => todo.completed);
        case 'all':
        default:
            // 返回全部待办事项
            return todos;
    }
}

/**
 * 创建单个待办事项的HTML元素
 * @param {Object} todo - 待办事项对象
 * @returns {HTMLLIElement} 列表项元素
 */
function createTodoElement(todo) {
    // 创建列表项元素
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;
    
    // 如果已完成，添加completed类
    if (todo.completed) {
        li.classList.add('completed');
    }

    // 创建待办事项文本
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    // 创建操作按钮容器
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';

    // 创建完成按钮
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = todo.completed ? '取消' : '完成';
    completeBtn.addEventListener('click', () => toggleComplete(todo.id));

    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    // 组装元素
    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);

    return li;
}

/**
 * 渲染待办事项列表
 * 根据当前筛选条件显示相应的待办事项
 */
function renderTodos() {
    // 获取筛选后的待办事项
    const filteredTodos = getFilteredTodos();
    
    // 清空列表
    todoList.innerHTML = '';

    // 渲染每个待办事项
    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });

    // 更新空状态显示
    updateEmptyState(filteredTodos.length);
    
    // 更新任务计数
    updateTaskCount();
}

/**
 * 更新空状态提示的显示
 * @param {number} count - 当前显示的待办事项数量
 */
function updateEmptyState(count) {
    if (count === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }
}

/**
 * 更新任务计数显示
 */
function updateTaskCount() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    taskCount.textContent = `共 ${total} 个任务，${pending} 个未完成，${completed} 个已完成`;
}

// =============================================
// 待办事项操作函数
// =============================================

/**
 * 添加新的待办事项
 * @param {string} text - 待办事项内容
 */
function addTodo(text) {
    // 创建新的待办事项对象
    const newTodo = {
        id: Date.now().toString(), // 使用时间戳作为唯一ID
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    // 添加到数组开头（最新的显示在最前面）
    todos.unshift(newTodo);
    
    // 保存到LocalStorage
    saveTodosToStorage();
    
    // 重新渲染列表
    renderTodos();
}

/**
 * 切换待办事项的完成状态
 * @param {string} id - 待办事项ID
 */
function toggleComplete(id) {
    // 找到对应的待办事项并切换完成状态
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        
        // 保存到LocalStorage
        saveTodosToStorage();
        
        // 重新渲染列表
        renderTodos();
    }
}

/**
 * 删除待办事项
 * @param {string} id - 待办事项ID
 */
function deleteTodo(id) {
    // 从数组中移除该待办事项
    todos = todos.filter(todo => todo.id !== id);
    
    // 保存到LocalStorage
    saveTodosToStorage();
    
    // 重新渲染列表
    renderTodos();
}

/**
 * 清除所有已完成的待办事项
 */
function clearCompleted() {
    // 过滤掉已完成的待办事项
    todos = todos.filter(todo => !todo.completed);
    
    // 保存到LocalStorage
    saveTodosToStorage();
    
    // 重新渲染列表
    renderTodos();
}

/**
 * 清除全部待办事项
 */
function clearAll() {
    // 确认对话框
    if (todos.length === 0) {
        return;
    }
    
    const confirmed = confirm('确定要清除全部待办事项吗？此操作不可恢复。');
    if (confirmed) {
        // 清空数组
        todos = [];
        
        // 保存到LocalStorage
        saveTodosToStorage();
        
        // 重新渲染列表
        renderTodos();
    }
}

/**
 * 设置筛选条件
 * @param {string} filter - 筛选条件 ('all' | 'pending' | 'completed')
 */
function setFilter(filter) {
    currentFilter = filter;
    
    // 更新筛选按钮的激活状态
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 重新渲染列表
    renderTodos();
}

// =============================================
// 事件监听器绑定
// =============================================

/**
 * 初始化事件监听器
 */
function initEventListeners() {
    // 表单提交事件 - 添加待办事项
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = ''; // 清空输入框
            todoInput.focus(); // 保持输入框焦点
        }
    });

    // 筛选按钮点击事件
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });

    // 清除已完成按钮点击事件
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // 清除全部按钮点击事件
    clearAllBtn.addEventListener('click', clearAll);

    // 键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter 快速添加
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (document.activeElement === todoInput) {
                todoForm.dispatchEvent(new Event('submit'));
            }
        }
    });
}

// =============================================
// 应用初始化
// =============================================

/**
 * 初始化应用
 * 页面加载时执行
 */
function initApp() {
    // 从LocalStorage读取数据
    todos = loadTodosFromStorage();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 渲染待办事项列表
    renderTodos();
    
    console.log('待办事项应用已初始化');
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);
