import { useState, useEffect } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import type { Riding, LeaderboardEntry } from '../types'

export default function Leaderboard() {
  const { user } = useAuth()
  const [ridings, setRidings] = useState<Riding[]>([])
  const [ridingId, setRidingId] = useState('')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [ridingName, setRidingName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/ridings').then(({ data }) => setRidings(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!ridingId) {
      setEntries([])
      return
    }
    setLoading(true)
    api
      .get(`/leaderboard/${ridingId}`)
      .then(({ data }) => {
        setEntries(data.rankings || [])
        setRidingName(data.riding?.name || '')
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }, [ridingId])

  const medals = ['🥇', '🥈', '🥉']
  const rankColors = ['bg-yellow-400 text-gray-900', 'bg-gray-300 text-gray-900', 'bg-amber-700 text-white']

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-800 border-b border-dark-500">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <i className="fas fa-trophy text-accent" />
          Leaderboard
        </h2>
        <select
          value={ridingId}
          onChange={(e) => setRidingId(e.target.value)}
          className="px-3 py-1.5 bg-dark-600 border border-dark-500 rounded-lg text-sm text-gray-100 outline-none focus:border-accent"
        >
          <option value="">Select a Riding</option>
          {ridings.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!ridingId && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
            <i className="fas fa-trophy text-4xl" />
            <p>Select a riding to view the leaderboard</p>
          </div>
        )}

        {ridingId && loading && (
          <div className="flex items-center justify-center h-full">
            <span className="inline-block h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {ridingId && !loading && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
            <i className="fas fa-trophy text-4xl" />
            <p>No participants in {ridingName} yet</p>
            <p className="text-sm">Be the first to report!</p>
          </div>
        )}

        {ridingId && !loading && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((e) => {
              const isYou = user?._id === e._id
              return (
                <div
                  key={e._id}
                  className={`flex items-center gap-3 p-3 bg-dark-700 rounded-lg border ${
                    isYou
                      ? 'border-accent shadow-[0_0_0_1px_rgba(108,92,231,0.3)]'
                      : 'border-dark-500'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      e.rank <= 3
                        ? rankColors[e.rank - 1]
                        : 'bg-dark-600 text-gray-500'
                    }`}
                  >
                    {e.rank <= 3 ? medals[e.rank - 1] : e.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {e.displayName}
                      {isYou && (
                        <span className="ml-1.5 text-xs text-accent">(You)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {e.totalReports} report
                      {e.totalReports !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-accent font-extrabold text-lg">
                    {e.totalPoints}
                    <span className="text-xs font-normal ml-0.5">pts</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
