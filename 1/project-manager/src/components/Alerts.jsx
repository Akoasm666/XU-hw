import { useState } from 'react'
import './Alerts.css'

function Alerts() {
  const [filter, setFilter] = useState('all')
  
  const alerts = [
    {
      id: 1,
      type: 'deadline',
      level: 'high',
      title: '任务即将到期',
      message: '任务"完成用户模块开发"将于2天后到期，当前进度80%',
      project: '客户管理系统升级',
      assignee: '王小明',
      time: '10分钟前',
      read: false,
    },
    {
      id: 2,
      type: 'overdue',
      level: 'critical',
      title: '任务已延期',
      message: '任务"首页设计稿"已延期5天，请尽快处理',
      project: '官网改版',
      assignee: '冯设计',
      time: '30分钟前',
      read: false,
    },
    {
      id: 3,
      type: 'progress',
      level: 'medium',
      title: '进度预警',
      message: '项目"官网改版"进度仅25%，距离截止日期还有6天',
      project: '官网改版',
      assignee: '马主管',
      time: '1小时前',
      read: false,
    },
    {
      id: 4,
      type: 'milestone',
      level: 'medium',
      title: '里程碑延误',
      message: '项目"移动端APP开发"的"UI设计"里程碑已延期',
      project: '移动端APP开发',
      assignee: '刘总监',
      time: '2小时前',
      read: true,
    },
    {
      id: 5,
      type: 'resource',
      level: 'low',
      title: '资源冲突提醒',
      message: '成员"陈工"同时参与3个高优先级任务',
      project: '多项目',
      assignee: '系统',
      time: '3小时前',
      read: true,
    },
  ]

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : filter === 'unread'
    ? alerts.filter(alert => !alert.read)
    : alerts.filter(alert => alert.level === filter)

  const getLevelLabel = (level) => {
    const labels = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    }
    return labels[level] || level
  }

  const getTypeIcon = (type) => {
    const icons = {
      deadline: '⏰',
      overdue: '🚨',
      progress: '📊',
      milestone: '🎯',
      resource: '👥'
    }
    return icons[type] || '⚠️'
  }

  const getTypeLabel = (type) => {
    const labels = {
      deadline: '到期预警',
      overdue: '延期预警',
      progress: '进度预警',
      milestone: '里程碑预警',
      resource: '资源预警'
    }
    return labels[type] || type
  }

  const stats = [
    { label: '待处理预警', value: alerts.filter(a => !a.read).length, color: 'red' },
    { label: '紧急预警', value: alerts.filter(a => a.level === 'critical').length, color: 'red' },
    { label: '高优先级', value: alerts.filter(a => a.level === 'high').length, color: 'yellow' },
    { label: '今日新增', value: 3, color: 'blue' },
  ]

  return (
    <div className="alerts">
      {/* Stats */}
      <div className="alerts-stats">
        {stats.map((stat, index) => (
          <div key={index} className={`alert-stat stat-${stat.color}`}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="alerts-header">
        <div className="filter-tabs">
          {[
            { key: 'all', label: '全部' },
            { key: 'unread', label: '未读' },
            { key: 'critical', label: '紧急' },
            { key: 'high', label: '高优先级' },
          ].map(tab => (
            <button 
              key={tab.key}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              {tab.key === 'unread' && (
                <span className="tab-badge">{alerts.filter(a => !a.read).length}</span>
              )}
            </button>
          ))}
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">全部标为已读</button>
          <button className="btn btn-secondary">预警设置</button>
        </div>
      </div>

      {/* Alert List */}
      <div className="alerts-list">
        {filteredAlerts.map(alert => (
          <div 
            key={alert.id} 
            className={`alert-card card ${!alert.read ? 'unread' : ''} level-${alert.level}`}
          >
            <div className="alert-icon">
              {getTypeIcon(alert.type)}
            </div>
            <div className="alert-content">
              <div className="alert-header">
                <div className="alert-title-row">
                  <span className={`level-badge level-${alert.level}`}>
                    {getLevelLabel(alert.level)}
                  </span>
                  <span className="type-badge">{getTypeLabel(alert.type)}</span>
                  {!alert.read && <span className="unread-dot"></span>}
                </div>
                <span className="alert-time">{alert.time}</span>
              </div>
              <h3 className="alert-title">{alert.title}</h3>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-meta">
                <span className="meta-item">
                  <span className="meta-icon">📁</span>
                  {alert.project}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">👤</span>
                  {alert.assignee}
                </span>
              </div>
            </div>
            <div className="alert-actions">
              <button className="action-btn primary">查看详情</button>
              <button className="action-btn">标为已读</button>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Settings Preview */}
      <div className="card notification-settings">
        <div className="card-header">
          <h2 className="card-title">预警规则配置</h2>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-icon">⏰</span>
              <div className="setting-text">
                <h4>到期提醒</h4>
                <p>任务到期前N天发送提醒</p>
              </div>
            </div>
            <div className="setting-control">
              <input type="number" defaultValue="3" min="1" max="7" /> 天
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-icon">📊</span>
              <div className="setting-text">
                <h4>进度预警</h4>
                <p>进度低于预期百分比时预警</p>
              </div>
            </div>
            <div className="setting-control">
              <input type="number" defaultValue="20" min="10" max="50" /> %
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-icon">📧</span>
              <div className="setting-text">
                <h4>邮件通知</h4>
                <p>发送邮件通知到负责人</p>
              </div>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-icon">💬</span>
              <div className="setting-text">
                <h4>企业微信通知</h4>
                <p>推送预警到企业微信</p>
              </div>
            </div>
            <div className="setting-control">
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts
