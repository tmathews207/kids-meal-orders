import { toMillis } from './date'

// A menu's stored `status` is only ever draft / open / closed_manual / ready.
// "Closed by time elapsing" is derived on read (no server-side job flips it),
// so every screen must compute effective status the same way.
export function getEffectiveStatus(menu, now = Date.now()) {
  if (!menu) return null
  if (menu.status === 'draft') return 'draft'
  if (menu.status === 'ready') return 'ready'
  if (menu.status === 'closed_manual') return 'closed'
  // status === 'open'
  return now >= toMillis(menu.closeAt) ? 'closed' : 'open'
}

// Picks the menu a kid's app should currently show: the most recent menu
// that's open/closed/ready and that this kid hasn't already finished
// (submitted a tip for). Falls back to null ("no active meal").
export function pickActiveMenuForKid(menus, kidId, historyByMenuId) {
  const candidates = menus
    .map(menu => ({ menu, status: getEffectiveStatus(menu) }))
    .filter(({ status }) => status === 'open' || status === 'closed' || status === 'ready')
    .sort((a, b) => toMillis(b.menu.closeAt) - toMillis(a.menu.closeAt))

  for (const { menu, status } of candidates) {
    const history = historyByMenuId[menu.id]
    const finished = status === 'ready' && history?.tips?.[kidId]
    if (!finished) return menu
  }
  return null
}
