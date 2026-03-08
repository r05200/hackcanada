import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import MapView from './pages/MapView'
import Report from './pages/Report'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

export default function App() {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={ <Profile />} />
        <Route path="/report" element={<Report />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/map" element={<MapView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
