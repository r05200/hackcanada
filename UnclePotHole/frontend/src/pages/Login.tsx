import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email.trim(), password)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <i className="fas fa-bolt text-5xl text-accent mb-3 drop-shadow-[0_0_20px_rgba(108,92,231,0.4)]" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            Civic Pulse
          </h1>
          <p className="text-gray-400 mt-1">Report. Track. Impact.</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-dark-800 p-6 rounded-xl border border-dark-500 space-y-4"
        >
          <h2 className="text-xl font-bold">Sign In</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-accent hover:underline">
              Register
            </Link>
          </p>
        </form>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-dark-700 rounded-lg text-center text-xs text-gray-500">
          <p className="font-semibold text-gray-400 mb-0.5">Demo account</p>
          <p>alice@example.com &nbsp;/&nbsp; password123</p>
        </div>
      </div>
    </div>
  )
}
