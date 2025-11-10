import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser)
          // Загрузить дополнительные данные пользователя из Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
            if (userDoc.exists()) {
              setUserData({ id: firebaseUser.uid, ...userDoc.data() })
            } else {
              // Создать профиль пользователя если его нет
              const newUserData = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
                avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email?.split('@')[0]}&background=ff0051&color=fff`,
                followers: [],
                following: [],
                favorites: [],
                bio: '',
                createdAt: new Date().toISOString()
              }
              await setDoc(doc(db, 'users', firebaseUser.uid), newUserData)
              setUserData(newUserData)
            }
          } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error)
            // Fallback данные
            setUserData({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email?.split('@')[0]}&background=ff0051&color=fff`,
              followers: [],
              following: [],
              favorites: [],
              bio: ''
            })
          }
        } else {
          setUser(null)
          setUserData(null)
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const register = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: username })
      
      const userData = {
        id: userCredential.user.uid,
        email,
        username,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=ff0051&color=fff`,
        followers: [],
        following: [],
        favorites: [],
        bio: '',
        createdAt: new Date().toISOString()
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    userData,
    register,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
