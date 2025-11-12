import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import VideoCard from '../components/VideoCard'
<<<<<<< HEAD
import { Plus, User, Search, Bell, Heart, Home as HomeIcon, TrendingUp, MessageCircle } from 'lucide-react'
=======
import { Plus, User, Search, Bell, Home as HomeIcon, TrendingUp, Radio, MessageCircle } from 'lucide-react'
>>>>>>> 8166a8e3144e2c6c65b445f31c219835f7dc834b
import SearchModal from '../components/SearchModal'
import NotificationsModal from '../components/NotificationsModal'

export default function Home() {
  const { userData } = useAuth()
  const { videos, users, notifications, loading } = useData()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = userData ? notifications.filter(n => !n.read && n.userId === userData.id).length : 0

  useEffect(() => {
    if (videos.length > 0) {
      setCurrentVideoIndex(0)
    }
  }, [videos.length])

  const handleScroll = (e) => {
    const container = e.target
    const scrollTop = container.scrollTop
    const videoHeight = container.clientHeight
    const newIndex = Math.round(scrollTop / videoHeight)
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      {/* Header */}
<<<<<<< HEAD
      <header className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-lg border-b border-pink-500/20 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">VibeTok</h1>
=======
      <header className="flex items-center justify-between p-2 md:p-4 bg-black/80 backdrop-blur-lg border-b border-pink-500/20 sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">VibeTok</h1>
>>>>>>> 8166a8e3144e2c6c65b445f31c219835f7dc834b
          <Link
            to="/coming-soon"
            className="hidden md:inline-block px-4 py-2 bg-green-700 font-semibold hover:from-purple-600 rounded-full transition-smooth text-sm"
          >
           VibeTube
          </Link>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/trending"
            className="p-2 md:p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group"
            title="Тренды"
          >
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-pink-400 transition-smooth" />
          </Link>
<<<<<<< HEAD
          {/* Live removed per request */}
=======
          <Link
            to="/live"
            className="hidden md:block p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group"
            title="Прямые трансляции"
          >
            <Radio className="w-5 h-5 text-white group-hover:text-pink-400 transition-smooth" />
          </Link>
>>>>>>> 8166a8e3144e2c6c65b445f31c219835f7dc834b
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 md:p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group"
            title="Поиск"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-pink-400 transition-smooth" />
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 md:p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group"
            title="Уведомления"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-pink-400 transition-smooth" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 md:w-4 md:h-4 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse-custom">
                {unreadCount}
              </span>
            )}
          </button>
          <Link
            to="/messages"
            className="p-2 md:p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group relative"
            title="Сообщения"
          >
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-pink-400 transition-smooth" />
          </Link>
          <Link
            to="/upload"
            className="p-2 md:p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group"
            title="Загрузить"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-pink-400 transition-smooth" />
          </Link>
          {userData && (
            <Link
              to={`/profile/${userData.id}`}
              className="p-2 md:p-2.5 hover:bg-pink-500/20 rounded-full transition-smooth group"
              title="Профиль"
            >
              <User className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-pink-400 transition-smooth" />
            </Link>
          )}
        </div>
      </header>

      {/* Video Feed */}
      <div
        className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth"
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Загрузка...</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center animate-fadeIn">
              <div className="mb-6">
                <HomeIcon className="w-20 h-20 text-pink-500 mx-auto opacity-50" />
              </div>
              <p className="text-gray-400 text-xl mb-4">Нет видео</p>
              <Link
                to="/upload"
                className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50"
              >
                Загрузить первое видео
              </Link>
            </div>
          </div>
        ) : (
          videos.map((video, index) => {
            const videoUser = users.find(u => u.id === video.userId) || {
              id: video.userId,
              username: video.username || 'Неизвестный',
              avatar: video.userAvatar || 'https://ui-avatars.com/api/?name=User&background=ff0051&color=fff',
              followers: []
            }
            return (
              <div
                key={video.id}
                className="h-screen snap-start flex items-center justify-center animate-fadeIn"
              >
                <VideoCard
                  video={video}
                  user={videoUser}
                  isActive={index === currentVideoIndex}
                />
              </div>
            )
          })
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <SearchModal onClose={() => setShowSearch(false)} />
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}
    </div>
  )
}
