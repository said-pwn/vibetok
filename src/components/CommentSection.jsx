import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { X, Heart, ThumbsUp, Smile, Flame } from 'lucide-react'

export default function CommentSection({ video, onClose }) {
  const { userData } = useAuth()
  const { comments, addComment, toggleCommentReaction } = useData()
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const videoComments = comments.filter(c => c.videoId === video.id)

  const handleReaction = async (commentId, reactionType) => {
    if (!userData) return
    await toggleCommentReaction(commentId, userData.id, reactionType)
  }

  const getReactionCount = (comment, type) => {
    return comment.reactions?.[type]?.length || 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newComment.trim() && userData) {
      setLoading(true)
      await addComment(
        video.id,
        userData.id,
        userData.username,
        userData.avatar,
        newComment
      )
      setNewComment('')
      setLoading(false)
    }
  }

  return (
    <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col animate-slideIn">
      <div className="p-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-lg flex items-center justify-between">
        <h3 className="text-white font-bold text-lg gradient-text">Комментарии</h3>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {videoComments.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">Нет комментариев</p>
        ) : (
          videoComments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.avatar}
                alt={comment.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-semibold text-white text-sm mb-1">
                    @{comment.username}
                  </p>
                  <p className="text-white text-sm mb-2">{comment.text}</p>
                  
                  {/* Реакции */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleReaction(comment.id, 'like')}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-400 transition-smooth"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      {getReactionCount(comment, 'like')}
                    </button>
                    <button
                      onClick={() => handleReaction(comment.id, 'heart')}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-400 transition-smooth"
                    >
                      <Heart className="w-3 h-3" />
                      {getReactionCount(comment, 'heart')}
                    </button>
                    <button
                      onClick={() => handleReaction(comment.id, 'fire')}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition-smooth"
                    >
                      <Flame className="w-3 h-3" />
                      {getReactionCount(comment, 'fire')}
                    </button>
                    <button
                      onClick={() => handleReaction(comment.id, 'smile')}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-400 transition-smooth"
                    >
                      <Smile className="w-3 h-3" />
                      {getReactionCount(comment, 'smile')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-pink-500/20 bg-black/80 backdrop-blur-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Добавить комментарий..."
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            disabled={loading || !userData}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-bold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  )
}

