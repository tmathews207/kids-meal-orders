import { useState } from 'react'
import { useData } from '../../context/DataContext'
import Stepper from '../../components/Stepper'
import ItemCard from '../../components/ItemCard'
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../../utils/constants'
import { todayISO } from '../../utils/date'

function emptyDraft() {
  return {
    mealType: 'dinner',
    date: todayISO(),
    entrees: { itemIds: [], maxSelect: 1 },
    sides: { itemIds: [], maxSelect: 1 },
    drinks: { itemIds: [], maxSelect: 1 },
    condiments: { itemIds: [] },
    toppingsByItem: {},
  }
}

function PickSection({ title, items, config, onChange, withMax = true }) {
  function toggleItem(id) {
    const itemIds = config.itemIds.includes(id)
      ? config.itemIds.filter(x => x !== id)
      : [...config.itemIds, id]
    onChange({ ...config, itemIds })
  }
  return (
    <section className="builder-section">
      <div className="section-picker-head">
        <h3>{title}</h3>
        {withMax && (
          <div className="max-select-control">
            <span>Max select</span>
            <Stepper value={config.maxSelect} min={0} onChange={v => onChange({ ...config, maxSelect: v })} compact />
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <p className="empty-note">No items in this category yet — add some in Library.</p>
      ) : (
        <div className="item-grid">
          {items.map(item => (
            <ItemCard key={item.id} item={item} selected={config.itemIds.includes(item.id)} onToggle={() => toggleItem(item.id)} />
          ))}
        </div>
      )}
    </section>
  )
}

function ToppingsBuilder({ toppableItems, toppingItems, toppingsByItem, onChange }) {
  if (toppableItems.length === 0) return null
  return (
    <section className="builder-section">
      <h3>Toppings</h3>
      <p className="empty-note">Choose which toppings are available for each entree/side you selected above.</p>
      {toppableItems.map(item => {
        const config = toppingsByItem[item.id] || { itemIds: [], maxSelect: 1 }
        function updateConfig(next) {
          onChange({ ...toppingsByItem, [item.id]: next })
        }
        function toggleTopping(id) {
          const itemIds = config.itemIds.includes(id)
            ? config.itemIds.filter(x => x !== id)
            : [...config.itemIds, id]
          updateConfig({ ...config, itemIds })
        }
        return (
          <div key={item.id} className="topping-builder-row">
            <div className="section-picker-head">
              <h4>{item.name}</h4>
              <div className="max-select-control">
                <span>Max select</span>
                <Stepper value={config.maxSelect} min={0} onChange={v => updateConfig({ ...config, maxSelect: v })} compact />
              </div>
            </div>
            <div className="item-grid">
              {toppingItems.map(t => (
                <ItemCard key={t.id} item={t} selected={config.itemIds.includes(t.id)} onToggle={() => toggleTopping(t.id)} compact />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default function MenuBuilderView() {
  const { libraryItems, menus, createMenu, updateMenu, openMenu } = useData()
  const [draft, setDraft] = useState(emptyDraft())
  const [editingId, setEditingId] = useState(null)
  const [closeAtLocal, setCloseAtLocal] = useState('')

  const byCategory = cat => libraryItems.filter(i => i.category === cat)
  const toppableItems = libraryItems.filter(
    i => (i.category === 'entree' || i.category === 'side') &&
      (draft.entrees.itemIds.includes(i.id) || draft.sides.itemIds.includes(i.id))
  )

  function update(key, value) {
    setDraft(d => ({ ...d, [key]: value }))
  }

  async function saveDraft() {
    if (editingId) {
      await updateMenu(editingId, draft)
    } else {
      const ref = await createMenu(draft)
      setEditingId(ref.id)
    }
  }

  async function handleOpen() {
    if (!closeAtLocal) {
      alert('Set a time for orders to close first.')
      return
    }
    await saveDraft()
    const id = editingId
    if (id) await openMenu(id, new Date(closeAtLocal).toISOString())
    setDraft(emptyDraft())
    setEditingId(null)
    setCloseAtLocal('')
  }

  function editDraftMenu(menu) {
    setEditingId(menu.id)
    setDraft({
      mealType: menu.mealType,
      date: menu.date,
      entrees: menu.entrees,
      sides: menu.sides,
      drinks: menu.drinks,
      condiments: menu.condiments,
      toppingsByItem: menu.toppingsByItem || {},
    })
  }

  const draftMenus = menus.filter(m => m.status === 'draft')

  return (
    <div className="view-padded">
      <div className="card form-card">
        <h2>{editingId ? 'Edit Menu' : 'New Menu'}</h2>
        <label className="field">
          <span>Meal</span>
          <select value={draft.mealType} onChange={e => update('mealType', e.target.value)}>
            {MEAL_TYPES.map(t => (
              <option key={t} value={t}>{MEAL_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Date</span>
          <input type="date" value={draft.date} onChange={e => update('date', e.target.value)} />
        </label>

        <PickSection title="Entrees" items={byCategory('entree')} config={draft.entrees} onChange={v => update('entrees', v)} />
        <PickSection title="Sides" items={byCategory('side')} config={draft.sides} onChange={v => update('sides', v)} />
        <PickSection title="Drinks" items={byCategory('drink')} config={draft.drinks} onChange={v => update('drinks', v)} />
        <PickSection title="Condiments" items={byCategory('condiment')} config={draft.condiments} onChange={v => update('condiments', v)} withMax={false} />
        <ToppingsBuilder
          toppableItems={toppableItems}
          toppingItems={byCategory('topping')}
          toppingsByItem={draft.toppingsByItem}
          onChange={v => update('toppingsByItem', v)}
        />

        <label className="field">
          <span>Orders close at</span>
          <input type="datetime-local" value={closeAtLocal} onChange={e => setCloseAtLocal(e.target.value)} />
        </label>

        <div className="builder-actions">
          <button type="button" className="btn-ghost" onClick={saveDraft}>Save Draft</button>
          <button type="button" className="btn-primary" onClick={handleOpen}>Open Menu to Kids</button>
        </div>
      </div>

      {draftMenus.length > 0 && (
        <div className="library-group">
          <h3>Draft Menus</h3>
          <div className="library-list">
            {draftMenus.map(m => (
              <div key={m.id} className="library-row card">
                <span>{MEAL_TYPE_LABELS[m.mealType]} — {m.date}</span>
                <button type="button" className="btn-ghost btn-sm" onClick={() => editDraftMenu(m)}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
