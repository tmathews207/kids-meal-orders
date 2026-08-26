import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import OrderSummary from '../../components/OrderSummary'
import { MEAL_TYPE_LABELS } from '../../utils/constants'

export default function StatusScreen({ menu, kid, order, ready }) {
  const { libraryItems, markDoneEating } = useData()
  const itemsById = useMemo(() => Object.fromEntries(libraryItems.map(i => [i.id, i])), [libraryItems])

  return (
    <div className="app">
      <header className="app-header kid-header" style={{ background: kid.color }}>
        <h1>{MEAL_TYPE_LABELS[menu.mealType]}</h1>
      </header>
      <main className="app-content view-padded status-screen">
        {ready ? (
          <>
            <div className="status-emoji">🎉</div>
            <h2>Your meal is ready!</h2>
            <button type="button" className="btn-primary" onClick={() => markDoneEating(menu.id, kid.id)}>
              I&apos;m done eating →
            </button>
          </>
        ) : (
          <>
            <div className="status-emoji">👩‍🍳</div>
            <h2>Orders are closed</h2>
            <p>Your meal is being prepared.</p>
          </>
        )}
        {order ? (
          <div className="card">
            <h3>Your order</h3>
            <OrderSummary order={order} itemsById={itemsById} />
          </div>
        ) : (
          <p className="empty-note">You didn&apos;t submit an order for this meal.</p>
        )}
      </main>
    </div>
  )
}
