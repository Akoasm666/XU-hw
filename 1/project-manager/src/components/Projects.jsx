import { useState } from 'react'
import './Projects.css'

function Projects() {
  const [viewMode, setViewMode] = useState('grid')
  
  const projects = [
    {
      id: 1,
      name: '客户管理系统升级',
      department: '技术部',
      status: 'progress',
      leader: '张经理',
      members: ['王小明', '李小红', '陈工'],
      startDate: '2026-01-01',
      endDate: '2026-03-15',
      progress: 68,
      milestones: ['需求确认', '设计完成', '开发完成', '测试通过'],
      currentMilestone: 2,
    },
    {
      id: 2,
      name: '移动端APP开发',
      department: '产品部',
      status: 'progress',
      leader: '刘总监',
      members: ['赵设计', '钱开发', '孙测试'],
      startDate: '2026-01-15',
      endDate: '2026-04-20',
      progress: 45,
      milestones: ['原型设计', 'UI设计', '前端开发', '后端开发', '测试上线'],
      currentMilestone: 1,
    },
    {
      id: 3,
      name: '数据分析平台',
      department: '数据部',
      status: 'completed',
      leader: '周经理',
      members: ['吴分析师', '郑工程师'],
      startDate: '2025-11-01',
      endDate: '2026-02-01',
      progress: 100,
      milestones: ['需求分析', '架构设计', '开发实现', '部署上线'],
      currentMilestone: 4,
    },
    {
      id: 4,
      name: '官网改版',
      department: '市场部',
      status: 'delayed',
      leader: '马主管',
      members: ['冯设计', '陈前端'],
      startDate: '2026-01-10',
      endDate: '2026-02-10',
      progress: 25,
      milestones: ['设计稿', '前端开发', '内容填充', '上线'],
      currentMilestone: 0,
    },
    {
      id: 5,
      name: '智能推荐系统',
      department: '算法部',
      status: 'pending',
      leader: '杨博士',
      members: ['算法工程师A', '算法工程师B'],
      startDate: '2026-02-15',
      endDate: '2026-05-30',
      progress: 0,
      milestones: ['数据准备', '模型设计', '模型训练', '系统集成', '上线优化'],
      currentMilestone: 0,
    },
  ]

  const getStatusLabel = (status) => {
    const labels = {
      progress: '进行中',
      completed: '已完成',
      delayed: '已延期',
      pending: '待启动'
    }
    return labels[status] || status
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <div className="header-left">
          <button className="btn btn-primary">
            <span>+</span> 新建项目
          </button>
        </div>
        <div className="header-right">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="搜索项目..." />
          </div>
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="4" rx="1" />
                <rect x="3" y="10" width="18" height="4" rx="1" />
                <rect x="3" y="16" width="18" height="4" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card card">
              <div className="project-card-header">
                <span className={`status-badge status-${project.status}`}>
                  {getStatusLabel(project.status)}
                </span>
                <button className="more-btn">⋮</button>
              </div>
              <h3 className="project-title">{project.name}</h3>
              <p className="project-dept">{project.department}</p>
              
              <div className="project-dates">
                <div className="date-item">
                  <span className="date-label">开始</span>
                  <span className="date-value">{project.startDate}</span>
                </div>
                <div className="date-divider">→</div>
                <div className="date-item">
                  <span className="date-label">结束</span>
                  <span className="date-value">{project.endDate}</span>
                </div>
              </div>

              <div className="project-team">
                <span className="team-label">负责人: {project.leader}</span>
                <div className="team-avatars">
                  {project.members.slice(0, 3).map((member, i) => (
                    <div key={i} className="team-avatar" title={member}>
                      {member[0]}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="team-avatar more">+{project.members.length - 3}</div>
                  )}
                </div>
              </div>

              <div className="project-milestones">
                <span className="milestone-label">里程碑</span>
                <div className="milestone-dots">
                  {project.milestones.map((_, i) => (
                    <div 
                      key={i} 
                      className={`milestone-dot ${i < project.currentMilestone ? 'completed' : ''} ${i === project.currentMilestone ? 'current' : ''}`}
                      title={project.milestones[i]}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="project-progress-section">
                <div className="progress-label">
                  <span>完成进度</span>
                  <span className="progress-percentage">{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="projects-table card">
          <table className="data-table">
            <thead>
              <tr>
                <th>项目名称</th>
                <th>部门</th>
                <th>负责人</th>
                <th>状态</th>
                <th>进度</th>
                <th>截止日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td className="project-name-cell">{project.name}</td>
                  <td>{project.department}</td>
                  <td>{project.leader}</td>
                  <td>
                    <span className={`status-badge status-${project.status}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td>
                    <div className="table-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span>{project.progress}%</span>
                    </div>
                  </td>
                  <td>{project.endDate}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">查看</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Projects
