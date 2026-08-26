import SectionPicker from './SectionPicker'

// Renders one topping-pool picker per currently-selected item that has
// toppings configured on the menu (e.g. pick 2 toppings for the pizza you
// just chose). Nested under the relevant section in OrderScreen.
export default function ToppingsPicker({ selectedItemIds, toppingsByItem, itemsById, value, onChange }) {
  const applicable = selectedItemIds.filter(id => toppingsByItem[id]?.itemIds?.length)
  if (applicable.length === 0) return null

  return (
    <div className="toppings-picker">
      {applicable.map(itemId => {
        const config = toppingsByItem[itemId]
        const items = config.itemIds.map(id => itemsById[id]).filter(Boolean)
        const selected = value[itemId] || []
        return (
          <SectionPicker
            key={itemId}
            title={`Toppings for ${itemsById[itemId]?.name || 'item'}`}
            items={items}
            selectedIds={selected}
            maxSelect={config.maxSelect}
            showHint
            onChange={next => onChange({ ...value, [itemId]: next })}
          />
        )
      })}
    </div>
  )
}
