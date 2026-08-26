import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../firebase'
import { ALLOWED_PARENT_EMAILS } from '../authConfig'

const provider = new GoogleAuthProvider()

// Popups don't work in every context (e.g. an installed iOS PWA), so fall
// back to a full-page redirect when the popup itself can't be opened.
const POPUP_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
])

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRedirectResult(auth).catch(err => setError(err.message))
    const unsub = onAuthStateChanged(auth, u => {
      // Ignore anonymous (kid) sessions here -- this context is parent-only.
      setUser(u && !u.isAnonymous ? u : null)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn() {
    setError('')
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      if (POPUP_FALLBACK_CODES.has(err.code)) {
        try {
          await signInWithRedirect(auth, provider)
        } catch (err2) {
          setError(err2.message)
        }
      } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message)
      }
    }
  }

  function signOut() {
    return firebaseSignOut(auth)
  }

  const email = (user?.email || '').toLowerCase()
  const authorized = !!user && ALLOWED_PARENT_EMAILS.includes(email)

  return (
    <AuthContext.Provider value={{ user, loading, error, authorized, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook, colocated with its Provider on purpose
export const useAuth = () => useContext(AuthContext)
