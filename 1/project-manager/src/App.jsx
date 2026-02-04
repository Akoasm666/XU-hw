import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Projects from './components/Projects'
import Tasks from './components/Tasks'
import Alerts from './components/Alerts'

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />
      case 'projects':
        return <Projects />
      case 'tasks':
        return <Tasks />
      case 'alerts':
        return <Alerts />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <header className="top-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="page-title">
            {activeMenu === 'dashboard' && '控制台'}
            {activeMenu === 'projects' && '项目管理'}
            {activeMenu === 'tasks' && '任务中心'}
            {activeMenu === 'alerts' && '预警中心'}
          </h1>
          <div className="header-actions">
            <div className="notification-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="badge">3</span>
            </div>
            <div className="user-avatar">管</div>
          </div>
        </header>
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  )
}

export default App
