import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Sparkles } from 'lucide-react'

export default function ComingSoon() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b bg-white flex items-center justify-center">
      <div className="text-center animate-fadeIn px-4">
        <div className="mb-8">
          
          <h1 className="text-6xl font-bold text-green-700 mb-4">VibeTube</h1>
          <p className="text-2xl text-gray-400 mb-2">Скоро будет доступно</p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Clock className="w-5 h-5" />
            <span>Мы работаем над этим</span>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/20 max-w-md mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4">Что будет:</h2>
          <ul className="text-left space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
             
              <span>Новые возможности</span>
            </li>
            <li className="flex items-center gap-2">
            
              <span>Улучшенный интерфейс</span>
            </li>
            <li className="flex items-center gap-2">
          
              <span>Больше функций</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-gradient-to-r  rounded-full font-bold  hover:to-pink-700 transition-smooth shadow-lg text-white bg-green-800 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Вернуться на главную
        </button>
      </div>
    </div>
  )
}

