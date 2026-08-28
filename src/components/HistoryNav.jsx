import { NavLink } from 'react-router-dom'

export default function HistoryNav() {
  return (
    <div className="history-nav">
      <NavLink to="/history" end className={({ isActive }) => (isActive ? 'active' : '')}>
        Recent
      </NavLink>
      <NavLink to="/history/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
        Calendar
      </NavLink>
      <NavLink to="/" className="history-nav-home">Home</NavLink>
    </div>
  )
}
