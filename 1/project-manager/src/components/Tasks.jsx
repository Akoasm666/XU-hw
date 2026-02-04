import { useState } from 'react'
import './Tasks.css'

function Tasks() {
  const [filter, setFilter] = useState('all')
  
  const tasks = [
    {
      id: 1,
      name: '完成用户模块开发',
      project: '客户管理系统升级',
      assignee: '王小明',
      status: 'progress',
      priority: 'high',
      progress: 80,
      startDate: '2026-01-20',
      endDate: '2026-02-06',
      description: '开发用户注册、登录、权限管理功能',
    },
    {
      id: 2,
      name: 'UI设计评审',
      project: '移动端APP开发',
      assignee: '赵设计',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      startDate: '2026-02-05',
      endDate: '2026-02-07',
      description: '组织团队对UI设计稿进行评审',
    },
    {
      id: 3,
      name: '接口文档编写',
      project: '数据分析平台',
      assignee: '郑工程师',
      status: 'completed',
      priority: 'low',
      progress: 100,
      startDate: '2026-01-25',
      endDate: '2026-02-01',
      description: '编写API接口文档',
    },
    {
      id: 4,
      name: '首页设计稿',
      project: '官网改版',
      assignee: '冯设计',
      status: 'delayed',
      priority: 'high',
      progress: 60,
      startDate: '2026-01-15',
      endDate: '2026-01-30',
      description: '设计官网首页视觉稿',
    },
    {
      id: 5,
      name: '数据库设计',
      project: '客户管理系统升级',
      assignee: '陈工',
      status: 'progress',
      priority: 'high',
      progress: 90,
      startDate: '2026-01-15',
      endDate: '2026-02-05',
      description: '设计并优化数据库结构',
    },
    {
      id: 6,
      name: '测试用例编写',
      project: '移动端APP开发',
      assignee: '孙测试',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      startDate: '2026-02-10',
      endDate: '2026-02-20',
      description: '编写功能测试用例',
    },
  ]

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter)

  const getStatusLabel = (status) => {
    const labels = {
      progress: '进行中',
      completed: '已完成',
      delayed: '已延期',
      pending: '待开始'
    }
    return labels[status] || status
  }

  const getPriorityLabel = (priority) => {
    const labels = {
      high: '高',
      medium: '中',
      low: '低'
    }
    return labels[priority] || priority
  }

  // Calculate Gantt chart dates
  const today = new Date()
  const startOfTimeline = new Date('2026-01-15')
  const endOfTimeline = new Date('2026-02-28')
  const totalDays = Math.ceil((endOfTimeline - startOfTimeline) / (1000 * 60 * 60 * 24))

  const getTaskPosition = (task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    const startOffset = Math.max(0, Math.ceil((taskStart - startOfTimeline) / (1000 * 60 * 60 * 24)))
    const duration = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24)) + 1
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    }
  }

  return (
    <div className="tasks">
      <div className="tasks-header">
        <div className="header-left">
          <button className="btn btn-primary">
            <span>+</span> 新建任务
          </button>
        </div>
        <div className="header-right">
          <div className="filter-tabs">
            {[
              { key: 'all', label: '全部' },
              { key: 'progress', label: '进行中' },
              { key: 'pending', label: '待开始' },
              { key: 'completed', label: '已完成' },
              { key: 'delayed', label: '已延期' },
            ].map(tab => (
              <button 
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="card gantt-section">
        <div className="card-header">
          <h2 className="card-title">甘特图</h2>
        </div>
        <div className="gantt-chart">
          <div className="gantt-timeline">
            <div className="timeline-header">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(startOfTimeline)
                date.setDate(date.getDate() + i * 7)
                return (
                  <div key={i} className="timeline-week">
                    {date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>
                )
              })}
            </div>
            <div className="gantt-rows">
              {filteredTasks.map(task => (
                <div key={task.id} className="gantt-row">
                  <div className="gantt-task-name">{task.name}</div>
                  <div className="gantt-bar-container">
                    <div 
                      className={`gantt-bar status-${task.status}`}
                      style={getTaskPosition(task)}
                    >
                      <div 
                        className="gantt-bar-progress"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                      <span className="gantt-bar-label">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="tasks-grid">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card card">
            <div className="task-card-header">
              <span className={`priority-badge priority-${task.priority}`}>
                {getPriorityLabel(task.priority)}优先级
              </span>
              <span className={`status-badge status-${task.status}`}>
                {getStatusLabel(task.status)}
              </span>
            </div>
            <h3 className="task-title">{task.name}</h3>
            <p className="task-description">{task.description}</p>
            <div className="task-meta">
              <div className="meta-item">
                <span className="meta-label">所属项目</span>
                <span className="meta-value">{task.project}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">负责人</span>
                <div className="assignee">
                  <span className="assignee-avatar">{task.assignee[0]}</span>
                  <span>{task.assignee}</span>
                </div>
              </div>
            </div>
            <div className="task-dates">
              <span>{task.startDate}</span>
              <span className="date-arrow">→</span>
              <span>{task.endDate}</span>
            </div>
            <div className="task-progress-section">
              <div className="progress-label">
                <span>完成进度</span>
                <span className="progress-percentage">{task.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
              </div>
            </div>
            <div className="task-actions">
              <button className="btn btn-secondary btn-sm">更新进度</button>
              <button className="btn btn-secondary btn-sm">查看详情</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks
