import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import CountdownTimer from '../../components/CountdownTimer'
import OrderSummary from '../../components/OrderSummary'
import { getEffectiveStatus } from '../../utils/mealStatus'
import { MEAL_TYPE_LABELS } from '../../utils/constants'
import { formatDateShort } from '../../utils/date'

const STATUS_LABEL = {
  open: 'Open for orders',
  closed: 'Orders closed — preparing',
  ready: 'Meal ready',
}

function MenuCard({ menu }) {
  const { kids, orders, libraryItems, closeMenuManually, markMenuReady, deleteMenu } = useData()
  const itemsById = useMemo(() => Object.fromEntries(libraryItems.map(i => [i.id, i])), [libraryItems])
  const status = getEffectiveStatus(menu)
  const menuOrders = orders.filter(o => o.menuId === menu.id)

  function handleDelete() {
    if (confirm(`Remove this ${MEAL_TYPE_LABELS[menu.mealType] || menu.mealType} menu from the dashboard? This can't be undone.`)) {
      deleteMenu(menu.id)
    }
  }

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
          const rated = !!order?.ratedAt
          return (
            <li key={kid.id}>
              <div className="kid-status-row">
                <span className="kid-avatar kid-avatar-sm" style={{ background: kid.color }}>
                  {kid.name.slice(0, 1).toUpperCase()}
                </span>
                <span>{kid.name}</span>
                {status === 'open' && <span className={order ? 'tag-ok' : 'tag-pending'}>{order ? 'Order in' : 'Waiting…'}</span>}
                {status === 'closed' && <span className={order ? 'tag-ok' : 'tag-pending'}>{order ? 'Submitted' : 'No order'}</span>}
                {status === 'ready' && (
                  <span className={rated ? 'tag-ok' : 'tag-pending'}>
                    {rated ? 'Rated meal' : doneEating ? 'Eating done — rating…' : 'Eating'}
                  </span>
                )}
              </div>
              {order && (
                <div className="kid-order-detail">
                  <OrderSummary order={order} itemsById={itemsById} />
                </div>
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
      <button type="button" className="btn-ghost btn-sm btn-danger" onClick={handleDelete}>
        Remove from Dashboard
      </button>
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
