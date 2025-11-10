import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ArrowLeft } from 'lucide-react'

export default function Upload() {
  const { userData } = useAuth()
  const { addVideo } = useData()
  const navigate = useNavigate()
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    } else {
      alert('Пожалуйста, выберите видео файл')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile) {
      setError('Пожалуйста, выберите видео')
      return
    }

    if (!userData) {
      setError('Вы не авторизованы')
      return
    }

    setUploading(true)
    setError('')

    const result = await addVideo(
      videoFile,
      caption,
      hashtags,
      userData.id,
      userData.username,
      userData.avatar
    )

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Ошибка загрузки видео')
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="flex items-center gap-4 p-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-lg">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold gradient-text">Загрузить видео</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Выберите видео
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {videoPreview && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Предпросмотр
              </label>
              <video
                src={videoPreview}
                controls
                className="w-full max-w-md rounded-lg bg-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Описание
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Добавьте описание к видео..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Хештеги (через пробел, начните с #)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#funny #viral #trending"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-gray-400 text-xs mt-1">
              Пример: #funny #viral #trending
            </p>
          </div>

          <button
            type="submit"
            disabled={!videoFile || uploading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-full font-bold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-pink-500 disabled:hover:to-pink-600"
          >
            {uploading ? 'Загрузка...' : 'Опубликовать ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}

