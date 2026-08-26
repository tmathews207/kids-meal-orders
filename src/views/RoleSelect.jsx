import { Link } from 'react-router-dom'

export default function RoleSelect() {
  return (
    <div className="app">
      <div className="role-select">
        <h1>🍽️ Meal Orders</h1>
        <p className="role-select-sub">Who&apos;s using the app?</p>
        <Link to="/kid" className="role-card role-card-kid">
          <span className="role-card-emoji">🧒</span>
          <span>I&apos;m a Kid</span>
        </Link>
        <Link to="/parent" className="role-card role-card-parent">
          <span className="role-card-emoji">👨‍👩‍👧</span>
          <span>I&apos;m a Parent</span>
        </Link>
        <Link to="/history" className="role-card role-card-history">
          <span className="role-card-emoji">📖</span>
          <span>Meal History</span>
        </Link>
      </div>
    </div>
  )
}
