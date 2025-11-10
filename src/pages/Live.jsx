import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ArrowLeft, Video, Radio, Users, MessageCircle } from 'lucide-react'

export default function Live() {
  const { userData } = useAuth()
  const { users } = useData()
  const navigate = useNavigate()
  const [isLive, setIsLive] = useState(false)
  const [viewers, setViewers] = useState(0)
  const [liveTitle, setLiveTitle] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsLive(true)
        setViewers(Math.floor(Math.random() * 100) + 10) // Симуляция зрителей
      }
    } catch (error) {
      console.error('Ошибка запуска трансляции:', error)
      alert('Не удалось получить доступ к камере/микрофону')
    }
  }

  const stopLive = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsLive(false)
    setViewers(0)
  }

  useEffect(() => {
    return () => {
      stopLive()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center gap-4 p-4 border-b border-pink-500/20 bg-black/80 backdrop-blur-lg">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-pink-500/20 rounded-full transition-smooth"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold gradient-text">Прямые трансляции</h1>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {!isLive ? (
          <div className="space-y-6">
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Radio className="w-6 h-6 text-pink-500" />
                Начать трансляцию
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Название трансляции
                </label>
                <input
                  type="text"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  placeholder="Введите название трансляции..."
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                onClick={startLive}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-smooth shadow-lg shadow-red-500/50 flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Начать трансляцию
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Активные трансляции</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Здесь будут активные трансляции других пользователей */}
                <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-800">
                  <p className="text-gray-400 text-center">Нет активных трансляций</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full aspect-video object-cover"
              />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold">LIVE</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-4">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{viewers}</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">{liveTitle || 'Прямая трансляция'}</h3>
                  <p className="text-sm text-gray-300">@{userData?.username}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={stopLive}
                className="flex-1 bg-red-500 text-white py-3 rounded-full font-bold hover:bg-red-600 transition-smooth"
              >
                Завершить трансляцию
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

