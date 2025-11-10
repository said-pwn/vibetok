import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ArrowLeft, Video, Upload } from 'lucide-react'

export default function Duet() {
  const { videoId } = useParams()
  const { userData } = useAuth()
  const { videos, addVideo } = useData()
  const navigate = useNavigate()
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const originalVideoRef = useRef(null)
  const duetVideoRef = useRef(null)

  const originalVideo = videos.find(v => v.id === videoId)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile || !userData) return

    setUploading(true)
    const result = await addVideo(
      videoFile,
      caption || `Дуэт с @${originalVideo?.username || 'пользователем'}`,
      '#duet',
      userData.id,
      userData.username,
      userData.avatar
    )

    if (result.success) {
      navigate('/')
    }
    setUploading(false)
  }

  if (!originalVideo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">Видео не найдено</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Вернуться
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-4 p-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-lg">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold gradient-text">Создать дуэт</h1>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Оригинальное видео */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-bold">Оригинальное видео</h3>
              <p className="text-sm text-gray-400">@{originalVideo.username}</p>
            </div>
            <video
              ref={originalVideoRef}
              src={originalVideo.url}
              className="w-full aspect-[9/16] object-cover"
              controls
              loop
            />
          </div>

          {/* Ваше видео */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-bold">Ваш ответ</h3>
            </div>
            {videoPreview ? (
              <video
                ref={duetVideoRef}
                src={videoPreview}
                className="w-full aspect-[9/16] object-cover"
                controls
              />
            ) : (
              <div className="w-full aspect-[9/16] flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Загрузите ваше видео</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Загрузить видео
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Описание
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Добавьте описание к дуэту..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={!videoFile || uploading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-full font-bold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Загрузка...' : 'Опубликовать дуэт ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}

