import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { X, Search, Video, User } from 'lucide-react'

export default function SearchModal({ onClose }) {
  const { searchVideos, searchUsers } = useData()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('videos') // 'videos' or 'users'

  const videos = searchVideos(query)
  const users = searchUsers(query)

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск видео и пользователей..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-smooth"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-4 text-center font-semibold transition-smooth ${
              activeTab === 'videos'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Video className="w-5 h-5" />
              Видео ({videos.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 text-center font-semibold transition-smooth ${
              activeTab === 'users'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Пользователи ({users.length})
            </div>
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="text-center text-gray-400 mt-20">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Введите запрос для поиска</p>
            </div>
          ) : activeTab === 'videos' ? (
            videos.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Видео не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map(video => (
                  <Link
                    key={video.id}
                    to="/"
                    className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden group"
                  >
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-semibold line-clamp-2">
                          {video.caption}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-white text-xs">
                          <span>❤️ {video.likes?.length || 0}</span>
                          <span>💬 {video.comments?.length || 0}</span>
                          <span>👁️ {video.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            users.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Пользователи не найдены</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map(user => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-smooth"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full border-2 border-pink-500"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">@{user.username}</h3>
                      <p className="text-gray-400 text-sm">
                        {user.followers?.length || 0} подписчиков
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

