# Быстрое исправление правил Firestore

## Где вставить правила:

### Шаг 1: Откройте Firebase Console
1. Перейдите на https://console.firebase.google.com/
2. Выберите ваш проект **vibetok-2ece1**

### Шаг 2: Откройте Firestore Rules
1. В левом меню нажмите на **Firestore Database**
2. Перейдите на вкладку **Rules** (вверху страницы)
3. Вы увидите редактор с текущими правилами

### Шаг 3: Замените правила
**УДАЛИТЕ** все текущие правила (включая те, что вы показали) и **ВСТАВЬТЕ** эти:

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

### Шаг 4: Опубликуйте правила
1. Нажмите кнопку **Publish** (Опубликовать) вверху справа
2. Подождите несколько секунд

### Шаг 5: Проверьте Storage Rules
Также нужно обновить правила Storage:

1. В Firebase Console перейдите в **Storage**
2. Нажмите на вкладку **Rules**
3. Замените правила на (упрощенные для разработки):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Для разработки - разрешить все (удалите в продакшене!)
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

4. Нажмите **Publish**

⚠️ **ВНИМАНИЕ:** Эти правила открывают Storage для всех. Используйте только для разработки!

## Визуальная инструкция:

```
Firebase Console
  └─ Проект: vibetok-2ece1
      ├─ Firestore Database
      │   └─ Rules ← ЗДЕСЬ вставляете правила Firestore
      └─ Storage
          └─ Rules ← ЗДЕСЬ вставляете правила Storage
```

## После настройки:

1. Подождите 10-30 секунд
2. Перезагрузите страницу приложения (F5)
3. Попробуйте снова выполнить операцию

## Если все еще не работает:

Используйте временные открытые правила (ТОЛЬКО для разработки!):

**Firestore:**
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

**Storage:**
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

⚠️ **ВНИМАНИЕ:** Эти правила открывают доступ всем. Используйте только для тестирования!

