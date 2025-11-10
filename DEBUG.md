# Отладка приложения

## Проверка основных проблем

### 1. Проверьте консоль браузера
Откройте DevTools (F12) и проверьте:
- Нет ли ошибок JavaScript
- Нет ли ошибок Firebase (Permission denied, etc.)

### 2. Проверьте Firebase правила

#### Firestore правила должны быть:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... ваши правила
    // Для разработки - разрешить все остальное
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage правила должны быть:
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

### 3. Проверьте индексы Firestore

Если видите ошибку `failed-precondition`, нужно создать индексы:

1. Откройте Firebase Console
2. Перейдите в Firestore Database → Indexes
3. Создайте индексы для:
   - `conversations`: `participants` (Array) + `lastMessageTime` (Descending)
   - `messages`: `conversationId` (Ascending) + `timestamp` (Ascending)

Или используйте fallback без сортировки (уже реализовано в коде).

### 4. Проверьте авторизацию

Убедитесь, что:
- Пользователь авторизован
- `userData` не `null`
- Firebase Authentication включен

### 5. Проверьте коллекции Firestore

Убедитесь, что созданы коллекции:
- `users`
- `videos`
- `comments`
- `notifications`
- `stories`
- `playlists`
- `conversations` (для сообщений)
- `messages` (для сообщений)

### 6. Частые проблемы

#### Проблема: "Cannot read property 'id' of undefined"
**Решение:** Проверьте, что `userData` существует перед использованием

#### Проблема: "Permission denied"
**Решение:** Обновите правила Firestore/Storage (см. выше)

#### Проблема: Сообщения не загружаются
**Решение:** 
1. Проверьте, что создана коллекция `conversations`
2. Проверьте правила Firestore для `conversations` и `messages`
3. Создайте индекс для `conversations` или используйте fallback

#### Проблема: Реакции на комментарии не работают
**Решение:** 
1. Проверьте, что комментарии имеют поле `reactions`
2. Проверьте правила Firestore для `comments`

### 7. Тестирование функций

#### Тест сообщений:
1. Откройте `/messages`
2. Найдите пользователя
3. Отправьте сообщение
4. Проверьте консоль на ошибки

#### Тест реакций:
1. Откройте видео
2. Откройте комментарии
3. Нажмите на реакцию
4. Проверьте консоль на ошибки

#### Тест дуэтов:
1. Откройте видео
2. Нажмите "Дуэт"
3. Загрузите видео
4. Проверьте консоль на ошибки

### 8. Логирование

Добавьте логи в консоль для отладки:
```javascript
console.log('userData:', userData)
console.log('videos:', videos)
console.log('conversations:', conversations)
```

### 9. Проверка сетевых запросов

В DevTools → Network проверьте:
- Запросы к Firestore работают
- Нет ли ошибок 403 (Permission denied)
- Нет ли ошибок 400 (Bad request)

### 10. Перезагрузка

После изменений:
1. Очистите кеш браузера (Ctrl+Shift+Delete)
2. Перезагрузите страницу (Ctrl+F5)
3. Проверьте снова

## Быстрое решение

Если ничего не помогает, временно используйте открытые правила:

### Firestore:
```javascript
match /{document=**} {
  allow read, write: if true;
}
```

### Storage:
```javascript
match /{allPaths=**} {
  allow read, write: if true;
}
```

**⚠️ ВНИМАНИЕ:** Только для разработки!

