import './Sidebar.css'

function Sidebar({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: '控制台' },
    { id: 'projects', icon: '📁', label: '项目管理' },
    { id: 'tasks', icon: '✅', label: '任务中心' },
    { id: 'alerts', icon: '🔔', label: '预警中心' },
  ]

  const handleMenuClick = (id) => {
    setActiveMenu(id)
    setSidebarOpen(false)
  }

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#grad1)" />
              <path d="M2 17l10 5 10-5" stroke="url(#grad1)" strokeWidth="2" />
              <path d="M2 12l10 5 10-5" stroke="url(#grad1)" strokeWidth="2" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">TaskFlow</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {activeMenu === item.id && <span className="nav-indicator"></span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-dot"></div>
          <span>系统运行正常</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
