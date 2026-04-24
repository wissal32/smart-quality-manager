import { LogOut, PanelTopOpen, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <header className="topbar">
      <div>
        <div className="topbar-kicker">
          <PanelTopOpen size={16} style={{ display: 'inline', marginRight: 8 }} />
          Operations dashboard
        </div>
        <h1 className="topbar-title">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="topbar-copy">
          Monitor quality actions, incidents, ideas, equipment, users and 5S audits from one place.
        </p>
      </div>

      <div className="topbar-user">
        <div className="user-card">
          <ShieldCheck size={18} />
          <div>
            <div className="user-name">{user?.name || 'Authenticated user'}</div>
            <div className="user-role">{user?.role || 'Sanctum session'}{user?.department ? ` • ${user.department}` : ''}</div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-ghost"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={16} />
          Logout
        </motion.button>
      </div>
    </header>
  )
}