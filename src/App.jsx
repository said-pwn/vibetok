import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Upload from './pages/Upload'
// Live page removed from routes (kept file for now)
import Duet from './pages/Duet'
import Messages from './pages/Messages'
import Trending from './pages/Trending'
import ComingSoon from './pages/ComingSoon'
import './App.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
  {/* Live route removed */}
      <Route path="/duet/:videoId" element={<PrivateRoute><Duet /></PrivateRoute>} />
      <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
      <Route path="/trending" element={<PrivateRoute><Trending /></PrivateRoute>} />
      <Route path="/coming-soon" element={<PrivateRoute><ComingSoon /></PrivateRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

