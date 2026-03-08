import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: 'fa-user', label: 'Dashboard' },
  { to: '/report', icon: 'fa-camera', label: 'Report' },
  { to: '/leaderboard', icon: 'fa-trophy', label: 'Leaders' },
  { to: '/map', icon: 'fa-map', label: 'Map' },
]

export default function BottomNav() {
  return (
    <nav className="flex bg-dark-800 border-t border-dark-500">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
              isActive ? 'text-accent' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <i className={`fas ${t.icon} text-lg`} />
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
