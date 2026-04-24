import { NavLink } from 'react-router-dom'
import { Activity, ClipboardList, Gauge, Inbox, Layers3, LifeBuoy, Users, Wrench } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/equipments', label: 'Equipments', icon: Wrench },
  { to: '/actions', label: 'Actions', icon: ClipboardList },
  { to: '/incidents', label: 'Incidents', icon: Activity },
  { to: '/ideas', label: 'Ideas', icon: Inbox },
  { to: '/audits', label: '5S Audits', icon: Layers3 },
]

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)

  return (
    <aside className="sidebar-panel">
      <div className="sidebar-brand">
        <div className="sidebar-badge">SQM</div>
        <div>
          <div className="sidebar-title">Smart Quality Manager</div>
          <div className="muted" style={{ fontSize: '0.88rem', marginTop: 2 }}>
            Quality operations console
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
            }
          >
            <Users size={18} />
            <span>Users</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <LifeBuoy size={18} />
        <span>Protected by Sanctum</span>
      </div>
    </aside>
  )
}