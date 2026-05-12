import { LogOut, PanelTopOpen, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { fr } from '../i18n/fr'

export default function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Déconnecté avec succès')
      navigate('/login', { replace: true })
    } catch {
      toast.error('La déconnexion a échoué')
    }
  }

  return (
    <header className="topbar">
      <div>
        <div className="topbar-kicker">
          <PanelTopOpen size={16} style={{ display: 'inline', marginRight: 8 }} />
          {fr.dashboard.sections.overview}
        </div>
        <h1 className="topbar-title">Bienvenue {user?.name ? `${user.name}` : ''}</h1>
        <p className="topbar-copy">
          {fr.dashboard.subtitle}
        </p>
      </div>

      <div className="topbar-user">
        <div className="user-card">
          <ShieldCheck size={18} />
          <div>
            <div className="user-name">{user?.name || fr.dashboard.auth.authenticatedUser}</div>
            <div className="user-role">{user?.role || fr.dashboard.auth.sanctumSession}{user?.department ? ` • ${user.department}` : ''}</div>
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
          {fr.common.buttons.logout}
        </motion.button>
      </div>
    </header>
  )
}