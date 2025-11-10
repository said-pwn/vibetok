import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ArrowLeft, Plus, Edit2, Eye, Heart, MessageCircle, BarChart3, Ban } from 'lucide-react'
import EditProfileModal from '../components/EditProfileModal'
import StatsModal from '../components/StatsModal'

export default function Profile() {
  const { userId } = useParams()
  const { userData, logout } = useAuth()
  const { users, videos, toggleFollow, blockUser, getVideoStats } = useData()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const profileUser = users.find(u => u.id === userId) || userData
  const userVideos = videos.filter(v => v.userId === userId)
  const isOwnProfile = userData?.id === userId
  const isFollowing = profileUser?.followers?.includes(userData?.id) || false
  const userFavorites = profileUser?.favorites || []
  const favoriteVideos = videos.filter(v => userFavorites.includes(v.id))
  const isBlocked = userData?.blocked?.includes(userId) || false

  const handleFollow = async () => {
    if (!userData) return
    await toggleFollow(profileUser.id, userData.id)
  }

  const handleBlock = async () => {
    if (!userData || !profileUser) return
    await blockUser(userData.id, profileUser.id)
  }

  const totalViews = userVideos.reduce((sum, v) => sum + (v.views || 0), 0)
  const totalLikes = userVideos.reduce((sum, v) => sum + (v.likes?.length || 0), 0)
  const totalComments = userVideos.reduce((sum, v) => {
    return sum + (v.comments?.length || 0)
  }, 0)
  const totalReposts = userVideos.reduce((sum, v) => sum + (v.reposts?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="flex items-center gap-4 p-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold gradient-text">@{profileUser?.username}</h1>
        {isOwnProfile && (
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowStats(true)}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-smooth flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Статистика
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-smooth flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Редактировать
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-smooth"
            >
              Выйти
            </button>
          </div>
        )}
        {!isOwnProfile && (
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleBlock}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-smooth flex items-center gap-2"
            >
              <Ban className="w-4 h-4" />
              {isBlocked ? 'Разблокировать' : 'Заблокировать'}
            </button>
          </div>
        )}
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Info */}
        <div className="flex items-start gap-6 mb-8 animate-fadeIn">
          <div className="relative">
            <img
              src={profileUser?.avatar}
              alt={profileUser?.username}
              className="w-32 h-32 rounded-full border-4 border-pink-500 shadow-lg shadow-pink-500/50"
            />
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-0 right-0 p-2 bg-pink-500 rounded-full hover:bg-pink-600 transition-smooth shadow-lg"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 gradient-text">@{profileUser?.username}</h2>
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{userVideos.length}</div>
                <div className="text-gray-400 text-sm">видео</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{profileUser?.followers?.length || 0}</div>
                <div className="text-gray-400 text-sm">подписчиков</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalLikes}</div>
                <div className="text-gray-400 text-sm">лайков</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalViews}</div>
                <div className="text-gray-400 text-sm">просмотров</div>
              </div>
              {isOwnProfile && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalComments}</div>
                    <div className="text-gray-400 text-sm">комментариев</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalReposts}</div>
                    <div className="text-gray-400 text-sm">репостов</div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2.5 rounded-full font-bold transition-smooth ${
                    isFollowing
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-pink-500/50'
                  }`}
                >
                  {isFollowing ? 'Подписки' : 'Подписаться'}
                </button>
              )}
              {isOwnProfile && (
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-bold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50"
                >
                  <Plus className="w-5 h-5" />
                  Загрузить видео
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        {isOwnProfile && (
          <div className="flex gap-4 mb-6 border-b border-gray-800">
            <button className="px-4 py-2 border-b-2 border-pink-500 text-pink-500 font-semibold">
              Мои видео
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-white transition-smooth">
              Избранное ({favoriteVideos.length})
            </button>
          </div>
        )}

        {/* Videos Grid */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            {isOwnProfile ? 'Мои видео' : 'Видео'}
          </h3>
          {userVideos.length === 0 ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="mb-6">
                <Eye className="w-20 h-20 text-pink-500 mx-auto opacity-50" />
              </div>
              <p className="text-gray-400 text-lg mb-4">
                {isOwnProfile ? 'У вас пока нет видео' : 'У пользователя пока нет видео'}
              </p>
              {isOwnProfile && (
                <Link
                  to="/upload"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-bold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50"
                >
                  Загрузить первое видео
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userVideos.map(video => (
                <Link
                  key={video.id}
                  to="/"
                  className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden group shadow-lg hover:shadow-pink-500/50 transition-smooth"
                >
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold mb-2 line-clamp-2 text-sm">
                        {video.caption}
                      </p>
                      <div className="flex items-center gap-4 text-white text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-pink-400" />
                          {video.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          {video.comments?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-green-400" />
                          {video.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={userData}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            setShowEditModal(false)
            window.location.reload() // Перезагрузить для обновления данных
          }}
        />
      )}

      {/* Stats Modal */}
      {showStats && (
        <StatsModal
          user={userData}
          videos={userVideos}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  )
}

