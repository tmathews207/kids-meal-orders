// Renders an order snapshot from mealHistory, where item ids were already
// resolved to names at "meal ready" time (see DataContext.markMenuReady) --
// no itemsById lookup needed, so this also works on the unauthenticated
// public history page.
export default function HistoryOrderSummary({ order }) {
  const lines = []
  if (order.entrees?.length) lines.push(['Entrees', order.entrees.join(', ')])
  if (order.sides?.length) lines.push(['Sides', order.sides.join(', ')])
  if (order.drinks?.length) lines.push(['Drinks', order.drinks.join(', ')])
  if (order.condiments?.length) lines.push(['Condiments', order.condiments.join(', ')])
  ;(order.toppings || []).forEach(t => {
    if (t.toppings?.length) lines.push([`Toppings (${t.forItem})`, t.toppings.join(', ')])
  })

  if (lines.length === 0) return <p className="empty-note">No items selected.</p>

  return (
    <dl className="order-summary">
      {lines.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
