import { NavLink } from 'react-router-dom'
import { Activity, ClipboardList, Gauge, Inbox, Layers3, LifeBuoy, Users, Wrench } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { fr } from '../i18n/fr'
import logo from '../assets/wii.svg'

const navItems = [
  { to: '/dashboard', label: fr.navigation.dashboard, icon: Gauge },
  { to: '/equipments', label: fr.navigation.equipments, icon: Wrench },
  { to: '/actions', label: fr.navigation.actions, icon: ClipboardList },
  { to: '/incidents', label: fr.navigation.incidents, icon: Activity },
  { to: '/ideas', label: fr.navigation.ideas, icon: Inbox },
  { to: '/audits', label: fr.navigation.audits5s, icon: Layers3 },
]

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)

  return (
    <aside className="sidebar-panel">
      <div className="sidebar-brand">
        <div className="sidebar-badge">
          <img src={logo} alt="Smart Quality Manager Logo" className="sidebar-logo" />
        </div>
        <div>
          <div className="sidebar-title">{fr.app.title}</div>
          <div className="muted" style={{ fontSize: '0.88rem', marginTop: 2 }}>
            {fr.app.subtitle}
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
            <span>{fr.navigation.users}</span>
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