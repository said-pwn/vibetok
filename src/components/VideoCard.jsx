import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Heart, MessageCircle, Share2, MoreVertical, Bookmark, Eye, Repeat2, Users } from 'lucide-react'
import CommentSection from './CommentSection'

export default function VideoCard({ video, user, isActive }) {
  const { userData } = useAuth()
  const { toggleLike, toggleFollow, toggleFavorite, toggleRepost, incrementViews, comments, users } = useData()
  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isReposted, setIsReposted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const videoRef = useRef(null)
  
  const videoComments = comments.filter(c => c.videoId === video.id)
  const currentUser = users.find(u => u.id === userData?.id)
  const userFavorites = currentUser?.favorites || []

  useEffect(() => {
    if (video && userData) {
      setIsLiked(video.likes?.includes(userData.id) || false)
      setIsFollowing(user?.followers?.includes(userData.id) || false)
      setIsFavorited(userFavorites.includes(video.id))
      setIsReposted(video.reposts?.includes(userData.id) || false)
    }
  }, [video, userData?.id, user, userFavorites])

  useEffect(() => {
    if (isActive && video && videoRef.current) {
      incrementViews(video.id).catch(err => {
        console.error('Ошибка инкремента просмотров:', err)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, video?.id])

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isActive])

  const handleLike = async () => {
    if (!userData) return
    const result = await toggleLike(video.id, userData.id)
    if (result?.success !== false) {
      setIsLiked(!isLiked)
    }
  }

  const handleFollow = async () => {
    if (!userData || !user) return
    const result = await toggleFollow(user.id, userData.id)
    if (result?.success !== false) {
      setIsFollowing(!isFollowing)
    }
  }

  const handleFavorite = async () => {
    if (!userData) return
    const result = await toggleFavorite(video.id, userData.id)
    if (result?.success !== false) {
      setIsFavorited(!isFavorited)
    }
  }

  const handleRepost = async () => {
    if (!userData) return
    const result = await toggleRepost(video.id, userData.id)
    if (result?.success !== false) {
      setIsReposted(!isReposted)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.caption || 'TikTok видео',
          text: `Посмотри это видео от ${user?.username}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Ошибка шаринга:', err)
      }
    } else {
      // Fallback: копировать ссылку
      navigator.clipboard.writeText(window.location.href)
      setShowShare(true)
      setTimeout(() => setShowShare(false), 2000)
    }
  }

  if (!video || !user) return null

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }

  return (
    <div className="relative w-full h-full flex items-center">
      <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20">
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail || user?.avatar}
          className="w-full h-full object-cover cursor-pointer"
          loop
          muted
          playsInline
          autoPlay
          controls
          onClick={togglePlay}
        />

        {/* Video Info Overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="flex items-start gap-3 mb-3">
              <Link to={`/profile/${user.id}`} className="hover:scale-110 transition-smooth">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-pink-500 shadow-lg"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                  <Link to={`/profile/${user.id}`} className="hover:opacity-80 transition-smooth">
                  <span className="font-bold text-white text-sm md:text-base">@{user.username}</span>
                </Link>
                {user.id !== userData?.id && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-smooth ${
                      isFollowing
                        ? 'bg-gray-700/80 text-white hover:bg-gray-600'
                        : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-pink-500/50'
                    }`}
                  >
                    {isFollowing ? 'Подписки' : 'Подписаться'}
                  </button>
                )}
              </div>
              <p className="text-white text-xs md:text-sm mb-2 leading-relaxed">{video.caption}</p>
              {video.hashtags && video.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {video.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-pink-400 text-xs font-semibold hover:text-pink-300 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-gray-300 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.views || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
  <div className="absolute right-3 bottom-24 flex flex-col gap-4 sm:gap-5">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full sm:p-3.5 rounded-full transition-smooth shadow-lg ${
              isLiked 
                ? 'bg-gradient-to-br from-pink-500 to-pink-600 scale-110 animate-bounce-custom' 
                : 'bg-black/60 backdrop-blur-sm group-hover:bg-pink-500/30'
            }`}>
              <Heart
                className={`w-7 h-7 transition-smooth ${
                  isLiked ? 'fill-white text-white' : 'text-white group-hover:text-pink-400'
                }`}
              />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-lg">
              {video.likes?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full sm:p-3.5 rounded-full bg-black/60 backdrop-blur-sm group-hover:bg-blue-500/30 transition-smooth shadow-lg">
              <MessageCircle className="w-7 h-7 text-white group-hover:text-blue-400 transition-smooth" />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-lg">
              {videoComments.length}
            </span>
          </button>

          <button
            onClick={handleFavorite}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full sm:p-3.5 rounded-full transition-smooth shadow-lg ${
              isFavorited
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 scale-110'
                : 'bg-black/60 backdrop-blur-sm group-hover:bg-yellow-500/30'
            }`}>
              <Bookmark
                className={`w-7 h-7 transition-smooth ${
                  isFavorited ? 'fill-white text-white' : 'text-white group-hover:text-yellow-400'
                }`}
              />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-lg">
              Избранное
            </span>
          </button>

          <button
            onClick={handleRepost}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full sm:p-3.5 rounded-full transition-smooth shadow-lg ${
              isReposted
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 scale-110'
                : 'bg-black/60 backdrop-blur-sm group-hover:bg-purple-500/30'
            }`}>
              <Repeat2
                className={`w-7 h-7 transition-smooth ${
                  isReposted ? 'text-white' : 'text-white group-hover:text-purple-400'
                }`}
              />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-lg">
              {video.reposts?.length || 0}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full sm:p-3.5 rounded-full bg-black/60 backdrop-blur-sm group-hover:bg-green-500/30 transition-smooth shadow-lg">
              <Share2 className="w-7 h-7 text-white group-hover:text-green-400 transition-smooth" />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-lg">
              Поделиться
            </span>
          </button>

          <Link
            to={`/duet/${video.id}`}
            className="flex flex-col items-center gap-1 group"
            title="Создать дуэт"
          >
            <div className="p-3 rounded-full sm:p-3.5 rounded-full bg-black/60 backdrop-blur-sm group-hover:bg-purple-500/30 transition-smooth shadow-lg">
              <Users className="w-7 h-7 text-white group-hover:text-purple-400 transition-smooth" />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-lg">
              Дуэт
            </span>
          </Link>

          <button className="p-3 rounded-full sm:p-3.5 rounded-full bg-black/60 backdrop-blur-sm hover:bg-gray-700/50 transition-smooth shadow-lg">
            <MoreVertical className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Share Notification */}
        {showShare && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg animate-fadeIn">
            <span className="font-semibold">Ссылка скопирована! ✨</span>
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          video={video}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  )
}

