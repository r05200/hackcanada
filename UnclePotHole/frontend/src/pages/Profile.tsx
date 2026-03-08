import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import type { User, ReportItem, CategoryBreakdown } from '../types'

const CAT_COLORS: Record<string, string> = {
  pothole: 'bg-red-900/30 text-red-300',
  'road-defect': 'bg-orange-900/30 text-orange-300',
  flooding: 'bg-blue-900/30 text-blue-300',
  'fallen-trees': 'bg-green-900/30 text-green-300',
  'damaged-lights': 'bg-yellow-900/30 text-yellow-300',
}

const CAT_ICONS: Record<string, string> = {
  pothole: 'fa-road',
  'road-defect': 'fa-triangle-exclamation',
  flooding: 'fa-water',
  'fallen-trees': 'fa-tree',
  'damaged-lights': 'fa-lightbulb',
}

function fmtCat(c: string) {
  return c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString()
}

export default function Profile() {
  const { signOut } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([])
  const [reports, setReports] = useState<ReportItem[]>([])

  useEffect(() => {
    api
      .get('/users/me')
      .then(({ data }) => {
        setProfile(data.user)
        setBreakdown(data.categoryBreakdown || [])
      })
      .catch(() => {})

    api
      .get('/users/me/reports?limit=10')
      .then(({ data }) => setReports(data.data || []))
      .catch(() => {})
  }, [])

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="inline-block h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-500">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <i className="fas fa-user text-accent" />
          Profile
        </h2>
        <button
          onClick={signOut}
          className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition flex items-center gap-1.5"
        >
          <i className="fas fa-sign-out-alt" /> Sign Out
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Card */}
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-extrabold">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-bold">{profile.displayName}</h3>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-700 border border-dark-500 rounded-lg p-4 text-center">
            <div className="text-3xl font-extrabold text-accent">
              {profile.totalReports}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Reports
            </div>
          </div>
          <div className="bg-dark-700 border border-dark-500 rounded-lg p-4 text-center">
            <div className="text-3xl font-extrabold text-accent">
              {profile.totalPoints}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Points
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Category Breakdown
          </h3>
          {breakdown.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {breakdown.map((c) => (
                <span
                  key={c._id}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    CAT_COLORS[c._id] || 'bg-dark-600 text-gray-300'
                  }`}
                >
                  {fmtCat(c._id)}: {c.count}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No reports yet</p>
          )}
        </div>

        {/* Recent Reports */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Your Recent Reports
          </h3>
          {reports.length > 0 ? (
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center gap-3 p-3 bg-dark-700 border border-dark-500 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                      CAT_COLORS[r.category] || 'bg-dark-600 text-gray-300'
                    }`}
                  >
                    <i
                      className={`fas ${CAT_ICONS[r.category] || 'fa-exclamation'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm capitalize">
                      {fmtCat(r.category)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timeAgo(r.createdAt)}
                    </div>
                  </div>
                  <div className="text-accent font-semibold text-sm">
                    +{r.pointsAwarded} pt{r.pointsAwarded !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No reports yet. Go report an issue!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
