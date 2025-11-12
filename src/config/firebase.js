import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
<<<<<<< HEAD
// Storage используется для загрузки видео (постоянные URL)
=======
>>>>>>> 8166a8e3144e2c6c65b445f31c219835f7dc834b

// TODO: Замените на ваши Firebase конфигурационные данные
// Получите их в Firebase Console: Project Settings > Your apps > Config
const firebaseConfig = {
  apiKey: "AIzaSyC3zwbNc4M4KBEHT9G2KG0MTAh55UVZ4ts",
  authDomain: "vibetok-2ece1.firebaseapp.com",
  projectId: "vibetok-2ece1",
<<<<<<< HEAD
  // NOTE: storageBucket должен указывать на ваш bucket в формате '<project-id>.appspot.com'
=======
>>>>>>> 8166a8e3144e2c6c65b445f31c219835f7dc834b
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
<<<<<<< HEAD
// Storage не используется - видео хранятся локально через URL.createObjectURL
=======
>>>>>>> 8166a8e3144e2c6c65b445f31c219835f7dc834b

export default app
