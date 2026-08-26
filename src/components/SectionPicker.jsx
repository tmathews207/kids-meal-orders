import ItemCard from './ItemCard'

// A group of selectable items ("Entrees", "Sides", "Drinks", "Condiments").
// maxSelect of 0/undefined means unlimited (used for condiments). Selection
// is never hard-blocked -- going over the limit shows an inline error so
// the parent screen can disable Submit, matching the "pick too many ->
// error + disabled submit" requirement.
export default function SectionPicker({ title, items, selectedIds, maxSelect, onChange, showHint }) {
  if (items.length === 0) return null
  const overLimit = maxSelect > 0 && selectedIds.length > maxSelect

  function toggle(itemId) {
    const next = selectedIds.includes(itemId)
      ? selectedIds.filter(id => id !== itemId)
      : [...selectedIds, itemId]
    onChange(next)
  }

  return (
    <section className="section-picker">
      <div className="section-picker-head">
        <h3>{title}</h3>
        {showHint && maxSelect > 0 && (
          <span className="section-hint">Pick up to {maxSelect}</span>
        )}
      </div>
      <div className="item-grid">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            selected={selectedIds.includes(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>
      {overLimit && (
        <p className="field-error">
          You picked {selectedIds.length} — only {maxSelect} allowed. Remove some to submit.
        </p>
      )}
    </section>
  )
}
