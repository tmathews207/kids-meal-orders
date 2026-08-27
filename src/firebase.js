import { initializeApp } from 'firebase/app'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBTo9dy9krR3NnB5YcZeF-Pt4H-b-tbGX4',
  authDomain: 'kids-meal-orders.firebaseapp.com',
  projectId: 'kids-meal-orders',
  storageBucket: 'kids-meal-orders.firebasestorage.app',
  messagingSenderId: '170580551119',
  appId: '1:170580551119:web:6bf489aebf8c6308cedeba',
}

const app = initializeApp(firebaseConfig)

// Persistent cache means the app works offline and syncs when back online
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
})

export const auth = getAuth(app)
