import { useMemo, useState } from 'react'
import { useData } from '../../context/DataContext'
import CountdownTimer from '../../components/CountdownTimer'
import SectionPicker from '../../components/SectionPicker'
import ToppingsPicker from '../../components/ToppingsPicker'
import { MEAL_TYPE_LABELS } from '../../utils/constants'

function emptySelections() {
  return { entrees: [], sides: [], drinks: [], condiments: [], toppingsByItem: {} }
}

export default function OrderScreen({ menu, kid }) {
  const { libraryItems, orders, upsertOrder } = useData()
  const itemsById = useMemo(() => Object.fromEntries(libraryItems.map(i => [i.id, i])), [libraryItems])

  const existing = orders.find(o => o.menuId === menu.id && o.kidId === kid.id)
  const [sel, setSel] = useState(() =>
    existing
      ? {
          entrees: existing.entrees || [],
          sides: existing.sides || [],
          drinks: existing.drinks || [],
          condiments: existing.condiments || [],
          toppingsByItem: existing.toppingsByItem || {},
        }
      : emptySelections()
  )
  const [saving, setSaving] = useState(false)

  const resolve = (config) => (config?.itemIds || []).map(id => itemsById[id]).filter(Boolean)

  const overLimit =
    (menu.entrees?.maxSelect > 0 && sel.entrees.length > menu.entrees.maxSelect) ||
    (menu.sides?.maxSelect > 0 && sel.sides.length > menu.sides.maxSelect) ||
    (menu.drinks?.maxSelect > 0 && sel.drinks.length > menu.drinks.maxSelect) ||
    Object.entries(menu.toppingsByItem || {}).some(([itemId, cfg]) => {
      const chosen = sel.toppingsByItem[itemId] || []
      return cfg.maxSelect > 0 && chosen.length > cfg.maxSelect
    })

  const hasSelection =
    sel.entrees.length + sel.sides.length + sel.drinks.length + sel.condiments.length > 0

  const canSubmit = hasSelection && !overLimit && !saving

  const selectedEntreeAndSideIds = [...sel.entrees, ...sel.sides]

  async function handleSubmit() {
    setSaving(true)
    try {
      await upsertOrder(menu.id, kid.id, kid.name, sel)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header kid-header" style={{ background: kid.color }}>
        <h1>{MEAL_TYPE_LABELS[menu.mealType]}</h1>
      </header>
      <main className="app-content view-padded">
        <CountdownTimer closeAt={menu.closeAt} size="large" />

        <SectionPicker
          title="Entrees"
          items={resolve(menu.entrees)}
          selectedIds={sel.entrees}
          maxSelect={menu.entrees?.maxSelect}
          showHint={menu.entrees?.maxSelect > 1}
          onChange={v => setSel(s => ({ ...s, entrees: v }))}
        />
        <SectionPicker
          title="Sides"
          items={resolve(menu.sides)}
          selectedIds={sel.sides}
          maxSelect={menu.sides?.maxSelect}
          showHint
          onChange={v => setSel(s => ({ ...s, sides: v }))}
        />
        <ToppingsPicker
          selectedItemIds={selectedEntreeAndSideIds}
          toppingsByItem={menu.toppingsByItem || {}}
          itemsById={itemsById}
          value={sel.toppingsByItem}
          onChange={v => setSel(s => ({ ...s, toppingsByItem: v }))}
        />
        <SectionPicker
          title="Drinks"
          items={resolve(menu.drinks)}
          selectedIds={sel.drinks}
          maxSelect={menu.drinks?.maxSelect}
          showHint={menu.drinks?.maxSelect > 1}
          onChange={v => setSel(s => ({ ...s, drinks: v }))}
        />
        <SectionPicker
          title="Condiments"
          items={resolve(menu.condiments)}
          selectedIds={sel.condiments}
          maxSelect={0}
          showHint={false}
          onChange={v => setSel(s => ({ ...s, condiments: v }))}
        />

        <button type="button" className="btn-primary btn-submit" disabled={!canSubmit} onClick={handleSubmit}>
          {existing ? 'Update Order' : 'Submit Order'}
        </button>
        {existing && <p className="empty-note">You can change your order until time runs out.</p>}
      </main>
    </div>
  )
}
