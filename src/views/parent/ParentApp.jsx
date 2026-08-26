import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import DashboardView from './DashboardView'
import LibraryView from './LibraryView'
import MenuBuilderView from './MenuBuilderView'
import KidsView from './KidsView'
import HistoryEditView from './HistoryEditView'

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📋' },
  { key: 'menu', label: 'Menu', icon: '📝' },
  { key: 'library', label: 'Library', icon: '🍎' },
  { key: 'kids', label: 'Kids', icon: '🧒' },
  { key: 'history', label: 'History', icon: '📖' },
]

export default function ParentApp() {
  const [tab, setTab] = useState('dashboard')
  const { signOut } = useAuth()
  const { loading } = useData()

  if (loading) {
    return (
      <div className="app">
        <main className="app-content loading-screen">
          <div className="loading-spinner" />
          <p>Syncing data&hellip;</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{TABS.find(t => t.key === tab)?.label}</h1>
        <button className="header-signout" onClick={signOut} title="Sign out">⏻</button>
      </header>

      <main className="app-content">
        {tab === 'dashboard' && <DashboardView />}
        {tab === 'menu' && <MenuBuilderView />}
        {tab === 'library' && <LibraryView />}
        {tab === 'kids' && <KidsView />}
        {tab === 'history' && <HistoryEditView />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={tab === t.key ? 'active' : ''}>
            <span className="nav-emoji">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
