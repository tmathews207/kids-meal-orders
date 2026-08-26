import { useData } from '../../context/DataContext'
import CountdownTimer from '../../components/CountdownTimer'
import { getEffectiveStatus } from '../../utils/mealStatus'
import { MEAL_TYPE_LABELS } from '../../utils/constants'
import { formatDateShort } from '../../utils/date'

const STATUS_LABEL = {
  open: 'Open for orders',
  closed: 'Orders closed — preparing',
  ready: 'Meal ready',
}

function MenuCard({ menu }) {
  const { kids, orders, mealHistory, closeMenuManually, markMenuReady } = useData()
  const status = getEffectiveStatus(menu)
  const menuOrders = orders.filter(o => o.menuId === menu.id)
  const history = mealHistory.find(h => h.id === menu.id)

  return (
    <div className="card menu-dash-card">
      <div className="menu-dash-head">
        <h3>{MEAL_TYPE_LABELS[menu.mealType]} — {formatDateShort(menu.date)}</h3>
        <span className={`status-badge status-${status}`}>{STATUS_LABEL[status]}</span>
      </div>

      {status === 'open' && <CountdownTimer closeAt={menu.closeAt} />}

      <ul className="kid-status-list">
        {kids.map(kid => {
          const order = menuOrders.find(o => o.kidId === kid.id)
          const doneEating = !!order?.doneEatingAt
          const tipDone = !!history?.tips?.[kid.id]
          return (
            <li key={kid.id}>
              <span className="kid-avatar kid-avatar-sm" style={{ background: kid.color }}>
                {kid.name.slice(0, 1).toUpperCase()}
              </span>
              <span>{kid.name}</span>
              {status === 'open' && <span className={order ? 'tag-ok' : 'tag-pending'}>{order ? 'Order in' : 'Waiting…'}</span>}
              {status === 'closed' && <span className={order ? 'tag-ok' : 'tag-pending'}>{order ? 'Submitted' : 'No order'}</span>}
              {status === 'ready' && (
                <span className={tipDone ? 'tag-ok' : doneEating ? 'tag-pending' : 'tag-pending'}>
                  {tipDone ? 'Rated meal' : doneEating ? 'Eating done — rating…' : 'Eating'}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {status === 'open' && (
        <button type="button" className="btn-primary" onClick={() => closeMenuManually(menu.id)}>
          Close Orders Now
        </button>
      )}
      {status === 'closed' && (
        <button type="button" className="btn-primary" onClick={() => markMenuReady(menu.id)}>
          Meal Ready 🍽️
        </button>
      )}
    </div>
  )
}

export default function DashboardView() {
  const { menus } = useData()
  const live = menus.filter(m => m.status !== 'draft').slice(0, 10)

  if (live.length === 0) {
    return (
      <div className="view-padded">
        <p className="empty-note">No menus yet. Create one in the Menu tab.</p>
      </div>
    )
  }

  return (
    <div className="view-padded">
      {live.map(menu => <MenuCard key={menu.id} menu={menu} />)}
    </div>
  )
}
