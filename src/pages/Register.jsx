import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    const result = await register(email, password, username)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Ошибка регистрации')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fadeIn">
        <h1 className="text-5xl font-bold text-center mb-8 gradient-text">TikTok</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl border border-pink-500/20 shadow-2xl shadow-pink-500/20">
          <h2 className="text-2xl font-bold mb-6 text-white">Регистрация</h2>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-full font-bold hover:from-pink-600 hover:to-pink-700 transition-smooth shadow-lg shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться ✨'}
          </button>

          <p className="mt-4 text-center text-gray-400">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-pink-500 hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

