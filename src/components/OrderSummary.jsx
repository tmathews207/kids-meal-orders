// Renders an order's selected item ids as readable names. `itemsById` maps
// libraryItem id -> item (name etc). Works for both live orders and the
// frozen order snapshots stored in mealHistory.
export default function OrderSummary({ order, itemsById }) {
  const name = id => itemsById[id]?.name || '(removed item)'
  const lines = []

  if (order.entrees?.length) lines.push(['Entrees', order.entrees.map(name).join(', ')])
  if (order.sides?.length) lines.push(['Sides', order.sides.map(name).join(', ')])
  if (order.drinks?.length) lines.push(['Drinks', order.drinks.map(name).join(', ')])
  if (order.condiments?.length) lines.push(['Condiments', order.condiments.map(name).join(', ')])

  Object.entries(order.toppingsByItem || {}).forEach(([itemId, toppingIds]) => {
    if (toppingIds?.length) {
      lines.push([`Toppings (${name(itemId)})`, toppingIds.map(name).join(', ')])
    }
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
