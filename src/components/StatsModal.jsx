import { useData } from '../context/DataContext'
import { X, Eye, Heart, MessageCircle, Repeat2, TrendingUp, BarChart3 } from 'lucide-react'

export default function StatsModal({ user, videos, onClose }) {
  const { getVideoStats, comments } = useData()

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0)
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes?.length || 0), 0)
  const totalComments = videos.reduce((sum, v) => {
    return sum + comments.filter(c => c.videoId === v.id).length
  }, 0)
  const totalReposts = videos.reduce((sum, v) => sum + (v.reposts?.length || 0), 0)
  const avgEngagement = videos.length > 0 && totalViews > 0
    ? ((totalLikes + totalComments + totalReposts) / totalViews * 100).toFixed(2)
    : 0

  const topVideos = [...videos]
    .sort((a, b) => {
      const scoreA = (a.likes?.length || 0) * 2 + (a.views || 0) + (a.comments?.length || 0) * 3
      const scoreB = (b.likes?.length || 0) * 2 + (b.views || 0) + (b.comments?.length || 0) * 3
      return scoreB - scoreA
    })
    .slice(0, 5)

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-pink-500/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pink-500" />
            Статистика
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-smooth"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Просмотры</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalLikes.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Лайки</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalComments.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Комментарии</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <Repeat2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalReposts.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Репосты</div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Engagement Rate</p>
              <p className="text-3xl font-bold text-white">{avgEngagement}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-pink-500" />
          </div>
        </div>

        {/* Топ видео */}
        <div>
          <h3 className="text-xl font-bold mb-4">Топ видео</h3>
          <div className="space-y-3">
            {topVideos.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Нет видео</p>
            ) : (
              topVideos.map((video, index) => {
                const stats = getVideoStats(video.id)
                return (
                  <div
                    key={video.id}
                    className="bg-gray-800 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-bold text-pink-500">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1 line-clamp-1">{video.caption}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>👁️ {(stats?.views || 0).toLocaleString()}</span>
                        <span>❤️ {stats?.likes || 0}</span>
                        <span>💬 {stats?.comments || 0}</span>
                        <span>🔄 {stats?.reposts || 0}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <video
                        src={video.url}
                        className="w-20 h-28 object-cover rounded-lg"
                        muted
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

