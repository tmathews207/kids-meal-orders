import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { useKidAuth } from '../../context/KidAuthContext'
import { getEffectiveStatus, pickActiveMenuForKid } from '../../utils/mealStatus'
import OrderScreen from './OrderScreen'
import StatusScreen from './StatusScreen'
import PhotoTipScreen from './PhotoTipScreen'
import KidHistoryView from './KidHistoryView'

export default function KidApp() {
  const { kids, menus, orders, loading } = useData()
  const { kidId, logOutKid } = useKidAuth()

  const kid = kids.find(k => k.id === kidId)
  const ordersByMenuId = useMemo(
    () => Object.fromEntries(orders.filter(o => o.kidId === kidId).map(o => [o.menuId, o])),
    [orders, kidId]
  )
  const menu = kid ? pickActiveMenuForKid(menus, kid.id, ordersByMenuId) : null

  if (loading) {
    return (
      <div className="app">
        <main className="app-content loading-screen">
          <div className="loading-spinner" />
          <p>Syncing data&hellip;</p>
        </main>
      </div>
    )
  }

  if (!kid) {
    logOutKid()
    return null
  }

  let screen
  if (!menu) {
    screen = <KidHistoryView kid={kid} />
  } else {
    const status = getEffectiveStatus(menu)
    const order = orders.find(o => o.menuId === menu.id && o.kidId === kid.id)
    if (status === 'open') {
      screen = <OrderScreen menu={menu} kid={kid} />
    } else if (status === 'closed') {
      screen = <StatusScreen menu={menu} kid={kid} order={order} ready={false} />
    } else if (!order?.doneEatingAt) {
      screen = <StatusScreen menu={menu} kid={kid} order={order} ready />
    } else {
      screen = <PhotoTipScreen menu={menu} kid={kid} />
    }
  }

  return (
    <>
      {screen}
      <button type="button" className="kid-logout-btn" onClick={logOutKid} title="Log out">⏻</button>
    </>
  )
}
