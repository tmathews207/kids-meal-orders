export default function ItemCard({ item, selected, onToggle, compact }) {
  return (
    <button
      type="button"
      className={`item-card${selected ? ' selected' : ''}${compact ? ' item-card-compact' : ''}`}
      onClick={onToggle}
    >
      {item.photoUrl ? (
        <img src={item.photoUrl} alt="" className="item-card-photo" />
      ) : (
        <div className="item-card-photo item-card-photo-empty" aria-hidden="true" />
      )}
      <span className="item-card-name">{item.name}</span>
      {selected && <span className="item-card-check">✓</span>}
    </button>
  )
}
