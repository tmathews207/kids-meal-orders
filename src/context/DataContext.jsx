import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// Data layer for everything the *authenticated* app needs (parent or kid
// session) -- kids, the item library, menus, and live orders. The public
// history page uses its own lightweight hook (useMealHistoryPublic) since
// it has no auth and only needs the mealHistory collection.

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [kids, setKids] = useState([])
  const [libraryItems, setLibraryItems] = useState([])
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [mealHistory, setMealHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let pending = 5
    const done = () => {
      pending -= 1
      if (pending <= 0) setLoading(false)
    }

    const unsubs = [
      onSnapshot(collection(db, 'kids'), snap => {
        setKids(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        done()
      }, () => done()),
      onSnapshot(collection(db, 'libraryItems'), snap => {
        setLibraryItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        done()
      }, () => done()),
      onSnapshot(query(collection(db, 'menus'), orderBy('createdAt', 'desc')), snap => {
        setMenus(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        done()
      }, () => done()),
      onSnapshot(collection(db, 'orders'), snap => {
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        done()
      }, () => done()),
      onSnapshot(collection(db, 'mealHistory'), snap => {
        setMealHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        done()
      }, () => done()),
    ]

    return () => unsubs.forEach(u => u())
  }, [])

  // Keep a ref mirror so action functions below always read current data
  // without needing to be redefined every render.
  const stateRef = useRef({})
  useEffect(() => {
    stateRef.current = { kids, libraryItems, menus, orders, mealHistory }
  })

  // ---- kids ----
  function addKid(data) {
    return addDoc(collection(db, 'kids'), { ...data, createdAt: serverTimestamp() })
  }
  function updateKid(id, updates) {
    return updateDoc(doc(db, 'kids', id), updates)
  }
  function removeKid(id) {
    return deleteDoc(doc(db, 'kids', id))
  }

  // ---- library items ----
  function addLibraryItem(data) {
    return addDoc(collection(db, 'libraryItems'), { ...data, createdAt: serverTimestamp() })
  }
  function updateLibraryItem(id, updates) {
    return updateDoc(doc(db, 'libraryItems', id), updates)
  }
  function removeLibraryItem(id) {
    return deleteDoc(doc(db, 'libraryItems', id))
  }

  // ---- menus ----
  function createMenu(data) {
    return addDoc(collection(db, 'menus'), {
      ...data,
      status: 'draft',
      createdAt: serverTimestamp(),
    })
  }
  function updateMenu(id, updates) {
    return updateDoc(doc(db, 'menus', id), updates)
  }
  function openMenu(id, closeAt) {
    return updateMenu(id, { status: 'open', closeAt })
  }
  function closeMenuManually(id) {
    return updateMenu(id, { status: 'closed_manual' })
  }
  async function markMenuReady(id) {
    const menu = stateRef.current.menus.find(m => m.id === id)
    if (!menu) return
    // Resolve item ids to names now, so the permanent history record reads
    // correctly even if a library item is later renamed or deleted -- and
    // so the (unauthenticated) public history page never needs to read the
    // libraryItems collection.
    const itemName = itemId => stateRef.current.libraryItems.find(i => i.id === itemId)?.name || '(removed item)'
    const menuOrders = stateRef.current.orders
      .filter(o => o.menuId === id)
      .map(o => ({
        kidId: o.kidId,
        kidName: o.kidName,
        entrees: (o.entrees || []).map(itemName),
        sides: (o.sides || []).map(itemName),
        drinks: (o.drinks || []).map(itemName),
        condiments: (o.condiments || []).map(itemName),
        toppings: Object.entries(o.toppingsByItem || {}).map(([itemId, toppingIds]) => ({
          forItem: itemName(itemId),
          toppings: (toppingIds || []).map(itemName),
        })),
      }))
    await setDoc(
      doc(db, 'mealHistory', id),
      {
        menuId: id,
        date: menu.date,
        mealType: menu.mealType,
        orders: menuOrders,
        photos: {},
        tips: {},
        parentNotes: '',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
    await updateMenu(id, { status: 'ready' })
  }

  // ---- orders ----
  function upsertOrder(menuId, kidId, kidName, selections) {
    const id = `${menuId}_${kidId}`
    return setDoc(
      doc(db, 'orders', id),
      {
        menuId,
        kidId,
        kidName,
        ...selections,
        updatedAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }
  function markDoneEating(menuId, kidId) {
    return updateDoc(doc(db, 'orders', `${menuId}_${kidId}`), {
      doneEatingAt: serverTimestamp(),
    })
  }
  // Marks this order as rated (photo/tip submitted) so it's permanently
  // "finished" for pickActiveMenuForKid, independent of the mealHistory
  // archive -- deleting a history entry must not un-finish a meal.
  function markOrderRated(menuId, kidId) {
    return updateDoc(doc(db, 'orders', `${menuId}_${kidId}`), {
      ratedAt: serverTimestamp(),
    })
  }

  // ---- meal history ----
  function saveMealPhoto(menuId, kidId, photo) {
    return setDoc(
      doc(db, 'mealHistory', menuId),
      { photos: { [kidId]: photo } },
      { merge: true }
    )
  }
  function saveMealTip(menuId, kidId, tip) {
    return setDoc(
      doc(db, 'mealHistory', menuId),
      { tips: { [kidId]: tip } },
      { merge: true }
    )
  }
  function saveParentNotes(menuId, notes) {
    return setDoc(doc(db, 'mealHistory', menuId), { parentNotes: notes }, { merge: true })
  }
  function deleteMealHistoryEntry(menuId) {
    return deleteDoc(doc(db, 'mealHistory', menuId))
  }

  return (
    <DataContext.Provider
      value={{
        kids,
        libraryItems,
        menus,
        orders,
        mealHistory,
        loading,
        addKid,
        updateKid,
        removeKid,
        addLibraryItem,
        updateLibraryItem,
        removeLibraryItem,
        createMenu,
        updateMenu,
        openMenu,
        closeMenuManually,
        markMenuReady,
        upsertOrder,
        markDoneEating,
        markOrderRated,
        saveMealPhoto,
        saveMealTip,
        saveParentNotes,
        deleteMealHistoryEntry,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook, colocated with its Provider on purpose
export const useData = () => useContext(DataContext)
