import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { KidAuthProvider, useKidAuth } from './context/KidAuthContext'
import { DataProvider } from './context/DataContext'
import { ParentLoginScreen, UnauthorizedScreen } from './components/AuthScreens'
import ErrorBoundary from './components/ErrorBoundary'
import RoleSelect from './views/RoleSelect'
import ParentApp from './views/parent/ParentApp'
import KidLoginScreen from './views/kid/KidLoginScreen'
import KidApp from './views/kid/KidApp'
import MonthListView from './views/public/MonthListView'
import CalendarView from './views/public/CalendarView'
import DayView from './views/public/DayView'
import MonthDetailView from './views/public/MonthDetailView'
import MealDetailView from './views/public/MealDetailView'

function Spinner() {
  return (
    <div className="app">
      <main className="app-content loading-screen">
        <div className="loading-spinner" />
        <p>Loading&hellip;</p>
      </main>
    </div>
  )
}

function ParentRoute() {
  const { user, loading, authorized } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <ParentLoginScreen />
  if (!authorized) return <UnauthorizedScreen />
  return (
    <DataProvider>
      <ParentApp />
    </DataProvider>
  )
}

function KidRoute() {
  const { authLoading, parentSessionActive, isAnonymousReady, kidId, ensureAnonymousSignIn } = useKidAuth()
  const { signOut } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !parentSessionActive && !isAnonymousReady) {
      ensureAnonymousSignIn().catch(err => setError(err.message))
    }
  }, [authLoading, parentSessionActive, isAnonymousReady, ensureAnonymousSignIn])

  if (authLoading) return <Spinner />

  if (parentSessionActive) {
    return (
      <div className="app">
        <div className="login-screen">
          <h1>A parent is signed in</h1>
          <p>Sign the parent out on this device before a kid logs in.</p>
          <button className="btn-ghost" onClick={signOut}>Sign Out Parent</button>
        </div>
      </div>
    )
  }

  if (!isAnonymousReady) {
    return error ? (
      <div className="app">
        <div className="login-screen">
          <h1>Couldn&apos;t sign in</h1>
          <p className="login-error">{error}</p>
        </div>
      </div>
    ) : <Spinner />
  }

  return (
    <DataProvider>
      {kidId ? <KidApp /> : <KidLoginScreen />}
    </DataProvider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <KidAuthProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<RoleSelect />} />
              <Route path="/parent" element={<ParentRoute />} />
              <Route path="/kid" element={<KidRoute />} />
              <Route path="/history" element={<MonthListView />} />
              <Route path="/history/calendar" element={<CalendarView />} />
              <Route path="/history/calendar/:year" element={<CalendarView />} />
              <Route path="/history/month/:year/:month" element={<MonthDetailView />} />
              <Route path="/history/day/:date" element={<DayView />} />
              <Route path="/history/meal/:menuId" element={<MealDetailView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </KidAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
