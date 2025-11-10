import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { X, Bell, Heart, User, MessageCircle } from 'lucide-react'

export default function NotificationsModal({ onClose }) {
  const { userData } = useAuth()
  const { notifications, markNotificationAsRead, users } = useData()

  const userNotifications = userData ? notifications.filter(n => n.userId === userData.id) : []

  useEffect(() => {
    // Пометить все уведомления как прочитанные при открытии
    userNotifications.forEach(notif => {
      if (!notif.read) {
        markNotificationAsRead(notif.id)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-pink-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'follow':
        return <User className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-slideIn">
      <div className="h-full flex flex-col max-w-md mx-auto bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-pink-500" />
            Уведомления
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-smooth"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Нет уведомлений</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {userNotifications.map(notif => {
                const notifUser = users.find(u => u.id === notif.fromUserId)
                return (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-800 transition-smooth ${
                      !notif.read ? 'bg-pink-500/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-800 rounded-full">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          {notif.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {notif.timestamp?.toDate 
                            ? new Date(notif.timestamp.toDate()).toLocaleString('ru-RU')
                            : notif.createdAt 
                            ? new Date(notif.createdAt).toLocaleString('ru-RU')
                            : 'Недавно'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

