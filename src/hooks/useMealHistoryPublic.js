import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

// The public history page has no auth (Firestore rules allow open read on
// mealHistory only), so it uses this standalone hook instead of DataContext.
export function useMealHistoryPublic() {
  const [mealHistory, setMealHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'mealHistory'),
      snap => {
        setMealHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      err => {
        console.error('mealHistory sync error:', err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  return { mealHistory, loading }
}
