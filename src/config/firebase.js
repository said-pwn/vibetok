import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Замените на ваши Firebase конфигурационные данные
// Получите их в Firebase Console: Project Settings > Your apps > Config
const firebaseConfig = {
  apiKey: "AIzaSyC3zwbNc4M4KBEHT9G2KG0MTAh55UVZ4ts",
  authDomain: "vibetok-2ece1.firebaseapp.com",
  projectId: "vibetok-2ece1",
  storageBucket: "vibetok-2ece1.appspot.com",
  messagingSenderId: "170740171489",
  appId: "1:170740171489:web:6ec05870e0761c291f2da0",
  measurementId: "G-YJN3G52HJX"
}

// Инициализация Firebase
const app = initializeApp(firebaseConfig)

// Инициализация сервисов
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
