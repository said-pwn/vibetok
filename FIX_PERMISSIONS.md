# Исправление ошибки "Missing or insufficient permissions"

## Быстрое решение

### Шаг 1: Настройте правила Firestore

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в **Firestore Database** > **Rules**
4. Скопируйте и вставьте следующие правила:

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

5. Нажмите **Publish** (Опубликовать)

### Шаг 2: Настройте правила Storage

1. В Firebase Console перейдите в **Storage** > **Rules**
2. Скопируйте и вставьте следующие правила:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Правила для видео
    match /videos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Правила для историй
    match /stories/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Правила для аватаров
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Для разработки - разрешить все остальное
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Нажмите **Publish** (Опубликовать)

### Шаг 3: Проверьте авторизацию

Убедитесь, что:
- ✅ Пользователь авторизован перед операциями записи
- ✅ Authentication включен в Firebase Console
- ✅ Email/Password провайдер активирован

### Шаг 4: Перезагрузите приложение

После изменения правил:
1. Подождите несколько секунд (правила применяются не мгновенно)
2. Перезагрузите страницу приложения
3. Попробуйте снова выполнить операцию

## Альтернативное решение (только для разработки)

Если нужно быстро протестировать, можно временно использовать более открытые правила:

### Firestore (только для разработки!):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Storage (только для разработки!):

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

**⚠️ ВНИМАНИЕ:** Эти правила разрешают ВСЕ операции БЕЗ авторизации. Используйте ТОЛЬКО для разработки и тестирования!

## Проверка правил

После настройки правил проверьте в консоли браузера:
- Нет ли ошибок "Permission denied"
- Работают ли операции чтения/записи
- Авторизован ли пользователь (`request.auth != null`)

## Частые проблемы

### Проблема: "Permission denied" при чтении
**Решение:** Убедитесь, что правило `allow read: if true;` присутствует

### Проблема: "Permission denied" при записи
**Решение:** 
1. Проверьте, что пользователь авторизован
2. Убедитесь, что правило содержит `request.auth != null`
3. Проверьте, что `userId` в данных совпадает с `request.auth.uid`

### Проблема: Правила не применяются
**Решение:**
1. Убедитесь, что нажали "Publish"
2. Подождите 10-30 секунд
3. Очистите кеш браузера
4. Перезагрузите страницу

## Дополнительная помощь

Если проблема сохраняется:
1. Проверьте консоль браузера на детали ошибки
2. Проверьте Firebase Console > Firestore > Rules на наличие синтаксических ошибок
3. Убедитесь, что используете правильный проект Firebase

