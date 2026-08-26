import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from '../firebase'

const STORAGE_KEY = 'mealOrders:kidId'
const KidAuthContext = createContext(null)

export function KidAuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [kidId, setKidId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setAuthUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // A signed-in, non-anonymous user means a parent is using this device
  // right now -- don't silently sign them out to log a kid in.
  const parentSessionActive = !!authUser && !authUser.isAnonymous

  async function ensureAnonymousSignIn() {
    if (parentSessionActive) throw new Error('A parent is signed in on this device.')
    if (!auth.currentUser) await signInAnonymously(auth)
  }

  function logInAsKid(id) {
    setKidId(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // ignore (e.g. private browsing storage restrictions)
    }
  }

  function logOutKid() {
    setKidId(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <KidAuthContext.Provider
      value={{
        authLoading,
        parentSessionActive,
        isAnonymousReady: !!authUser?.isAnonymous,
        kidId,
        ensureAnonymousSignIn,
        logInAsKid,
        logOutKid,
      }}
    >
      {children}
    </KidAuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook, colocated with its Provider on purpose
export const useKidAuth = () => useContext(KidAuthContext)
