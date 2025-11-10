# Настройка Firebase

## Шаг 1: Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Добавить проект"
3. Введите название проекта
4. Следуйте инструкциям для создания проекта

## Шаг 2: Настройка Authentication

1. В Firebase Console перейдите в **Authentication**
2. Нажмите "Начать"
3. Включите **Email/Password** провайдер
4. Сохраните настройки

## Шаг 3: Настройка Firestore Database

1. Перейдите в **Firestore Database**
2. Нажмите "Создать базу данных"
3. Выберите режим: **Начать в тестовом режиме** (для разработки)
4. Выберите регион (например, `us-central1`)
5. Нажмите "Готово"

### Правила Firestore (для разработки):

**ВАЖНО:** Скопируйте эти правила в Firebase Console > Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Правила для пользователей
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Правила для видео
    match /videos/{videoId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Правила для комментариев
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Правила для уведомлений
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Правила для историй
    match /stories/{storyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Правила для плейлистов
    match /playlists/{playlistId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Для разработки - разрешить все остальное
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Для продакшена используйте более строгие правила!**

## Шаг 4: Настройка Storage (ОПЦИОНАЛЬНО)

⚠️ **Примечание:** Приложение настроено для работы БЕЗ Firebase Storage. Видео хранятся локально в браузере через `URL.createObjectURL()`. Это означает:
- ✅ Не нужно настраивать Storage
- ✅ Не нужно настраивать правила Storage
- ✅ Видео работают только в текущей сессии браузера
- ⚠️ Видео не сохраняются между сессиями

Если вы хотите использовать Firebase Storage для постоянного хранения видео, раскомментируйте код в `src/context/DataContext.jsx` и настройте Storage:

1. Перейдите в **Storage**
2. Нажмите "Начать"
3. Примите правила по умолчанию
4. Выберите регион (желательно тот же, что и Firestore)

### Правила Storage (если используете):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Шаг 5: Получение конфигурации

1. В Firebase Console перейдите в **Project Settings** (⚙️)
2. Прокрутите вниз до "Ваши приложения"
3. Нажмите на иконку Web (</>)
4. Зарегистрируйте приложение (введите название)
5. Скопируйте конфигурацию

## Шаг 6: Добавление конфигурации в проект

Откройте `src/config/firebase.js` и замените:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

На ваши реальные значения из Firebase Console.

## Шаг 7: Установка зависимостей

```bash
npm install
```

## Шаг 8: Запуск приложения

```bash
npm run dev
```

## Структура Firestore Collections

Приложение автоматически создаст следующие коллекции:

- `users` - Пользователи
- `videos` - Видео
- `comments` - Комментарии
- `notifications` - Уведомления
- `stories` - Истории (24 часа)
- `playlists` - Плейлисты

## Важные замечания

1. **Безопасность**: Правила по умолчанию подходят только для разработки. Для продакшена настройте более строгие правила.

2. **Квоты**: Firebase имеет бесплатный план с ограничениями. Следите за использованием.

3. **Регион**: Выберите регион, ближайший к вашим пользователям, для лучшей производительности.

4. **Индексы**: Firestore может потребовать создание индексов для сложных запросов. Следуйте инструкциям в консоли.

## Решение проблем

### Ошибка "Firebase: Error (auth/email-already-in-use)"
- Email уже зарегистрирован. Используйте другой email или войдите.

### Ошибка "Firebase: Error (auth/weak-password)"
- Пароль должен содержать минимум 6 символов.

### Ошибка "Permission denied"
- Проверьте правила Firestore и Storage. Убедитесь, что пользователь авторизован.

### Видео не загружаются
- Проверьте правила Storage
- Убедитесь, что файл не слишком большой
- Проверьте консоль браузера на ошибки

