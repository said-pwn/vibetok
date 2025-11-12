import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ArrowLeft, TrendingUp, Eye, Heart, MessageCircle, Repeat2 } from 'lucide-react'

export default function Trending() {
  const { userData } = useAuth()
  const { videos, users } = useData()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // 'all', 'today', 'week', 'month'

  // Сортировка видео по популярности
  const getTrendingVideos = () => {
    const now = Date.now()
    let filteredVideos = [...videos]

    if (filter === 'today') {
      const today = now - 24 * 60 * 60 * 1000
      filteredVideos = filteredVideos.filter(v => {
        const videoTime = v.timestamp?.toDate?.()?.getTime() || new Date(v.createdAt || 0).getTime()
        return videoTime > today
      })
    } else if (filter === 'week') {
      const week = now - 7 * 24 * 60 * 60 * 1000
      filteredVideos = filteredVideos.filter(v => {
        const videoTime = v.timestamp?.toDate?.()?.getTime() || new Date(v.createdAt || 0).getTime()
        return videoTime > week
      })
    } else if (filter === 'month') {
      const month = now - 30 * 24 * 60 * 60 * 1000
      filteredVideos = filteredVideos.filter(v => {
        const videoTime = v.timestamp?.toDate?.()?.getTime() || new Date(v.createdAt || 0).getTime()
        return videoTime > month
      })
    }

    // Сортировка по популярности (лайки + просмотры + комментарии)
    return filteredVideos.sort((a, b) => {
      const scoreA = (a.likes?.length || 0) * 2 + (a.views || 0) + (a.comments?.length || 0) * 3
      const scoreB = (b.likes?.length || 0) * 2 + (b.views || 0) + (b.comments?.length || 0) * 3
      return scoreB - scoreA
    })
  }

  const trendingVideos = getTrendingVideos()

  // Получить популярные хештеги
  const getTrendingHashtags = () => {
    const hashtagCounts = {}
    videos.forEach(video => {
      video.hashtags?.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))
  }

  const trendingHashtags = getTrendingHashtags()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="flex items-center gap-4 p-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-pink-500" />
          Тренды
        </h1>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Фильтры */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-smooth ${
              filter === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Все время
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-smooth ${
              filter === 'today'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-smooth ${
              filter === 'week'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-smooth ${
              filter === 'month'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Месяц
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Популярные видео */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Популярные видео</h2>
            <div className="space-y-4">
              {trendingVideos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Нет популярных видео</p>
                </div>
              ) : (
                trendingVideos.map((video, index) => {
                  const videoUser = users.find(u => u.id === video.userId)
                  return (
                    <Link
                      key={video.id}
                      to="/"
                      className="block bg-gray-900/80 backdrop-blur-lg rounded-xl overflow-hidden hover:bg-gray-800 transition-smooth border border-gray-800"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="flex-shrink-0">
                          <span className="text-2xl font-bold text-pink-500">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={videoUser?.avatar}
                              alt={videoUser?.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-semibold">@{videoUser?.username}</span>
                          </div>
                          <p className="text-sm mb-2 line-clamp-2">{video.caption}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {video.likes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {video.comments?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Repeat2 className="w-3 h-3" />
                              {video.reposts?.length || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <video
                            src={video.url}
                            className="w-24 h-32 object-cover rounded-lg"
                            muted
                            playsInline
                            loop
                          />
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* Популярные хештеги */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Популярные хештеги</h2>
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 border border-gray-800">
              {trendingHashtags.length === 0 ? (
                <p className="text-gray-400 text-center">Нет популярных хештегов</p>
              ) : (
                <div className="space-y-3">
                  {trendingHashtags.map((item, index) => (
                    <div
                      key={item.tag}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-smooth cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-pink-500 font-bold">#{index + 1}</span>
                        <span className="text-pink-400 font-semibold">#{item.tag}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{item.count} видео</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

