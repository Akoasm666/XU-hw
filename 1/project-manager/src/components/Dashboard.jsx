import './Dashboard.css'

function Dashboard() {
  const stats = [
    { label: '进行中项目', value: 12, icon: '🚀', color: 'blue' },
    { label: '待处理任务', value: 28, icon: '📋', color: 'cyan' },
    { label: '已完成', value: 156, icon: '✅', color: 'green' },
    { label: '预警通知', value: 3, icon: '⚠️', color: 'red' },
  ]

  const recentProjects = [
    { id: 1, name: '客户管理系统升级', progress: 68, status: 'progress', department: '技术部', deadline: '2026-03-15' },
    { id: 2, name: '移动端APP开发', progress: 45, status: 'progress', department: '产品部', deadline: '2026-04-20' },
    { id: 3, name: '数据分析平台', progress: 100, status: 'completed', department: '数据部', deadline: '2026-02-01' },
    { id: 4, name: '官网改版', progress: 25, status: 'delayed', department: '市场部', deadline: '2026-02-10' },
  ]

  const upcomingTasks = [
    { id: 1, name: '完成用户模块开发', project: '客户管理系统升级', deadline: '2026-02-06', priority: 'high' },
    { id: 2, name: 'UI设计评审', project: '移动端APP开发', deadline: '2026-02-07', priority: 'medium' },
    { id: 3, name: '接口文档编写', project: '数据分析平台', deadline: '2026-02-08', priority: 'low' },
  ]

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-glow"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Projects Overview */}
        <div className="card projects-overview">
          <div className="card-header">
            <h2 className="card-title">项目概览</h2>
            <button className="btn btn-secondary">查看全部</button>
          </div>
          <div className="projects-list">
            {recentProjects.map(project => (
              <div key={project.id} className="project-item">
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-meta">
                    <span className="department">{project.department}</span>
                    <span className="deadline">截止: {project.deadline}</span>
                  </div>
                </div>
                <div className="project-progress">
                  <div className="progress-header">
                    <span className={`status-badge status-${project.status}`}>
                      {project.status === 'progress' && '进行中'}
                      {project.status === 'completed' && '已完成'}
                      {project.status === 'delayed' && '已延期'}
                    </span>
                    <span className="progress-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card upcoming-tasks">
          <div className="card-header">
            <h2 className="card-title">近期任务</h2>
            <button className="btn btn-secondary">查看全部</button>
          </div>
          <div className="tasks-list">
            {upcomingTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className={`task-priority priority-${task.priority}`}></div>
                <div className="task-info">
                  <h4 className="task-name">{task.name}</h4>
                  <p className="task-project">{task.project}</p>
                </div>
                <div className="task-deadline">{task.deadline}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="card progress-chart">
          <div className="card-header">
            <h2 className="card-title">本周进度</h2>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => (
                <div key={day} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${[65, 80, 45, 90, 70, 30, 50][i]}%` }}
                  >
                    <span className="bar-value">{[65, 80, 45, 90, 70, 30, 50][i]}</span>
                  </div>
                  <span className="bar-label">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="card team-activity">
          <div className="card-header">
            <h2 className="card-title">团队动态</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar">王</div>
              <div className="activity-content">
                <p><strong>王小明</strong> 完成了任务 <em>用户登录模块</em></p>
                <span className="activity-time">10分钟前</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar">李</div>
              <div className="activity-content">
                <p><strong>李小红</strong> 更新了 <em>UI设计</em> 进度至 80%</p>
                <span className="activity-time">30分钟前</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar">张</div>
              <div className="activity-content">
                <p><strong>张经理</strong> 创建了新项目 <em>智能推荐系统</em></p>
                <span className="activity-time">1小时前</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
