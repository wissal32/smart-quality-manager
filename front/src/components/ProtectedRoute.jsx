import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { fr } from '../i18n/fr'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const isHydrating = useAuthStore((state) => state.isHydrating)
  const location = useLocation()

  if (isHydrating) {
    return (
      <div className="auth-page">
        <div className="auth-card glass" style={{ textAlign: 'center' }}>
          <div className="auth-kicker">{fr.common.messages.loading}</div>
          <h2 className="auth-title">{fr.common.messages.restoringSession}</h2>
          <p className="auth-copy">{fr.common.messages.checkingToken}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="auth-page">
        <div className="auth-card glass" style={{ textAlign: 'center' }}>
          <div className="auth-kicker">{fr.common.messages.accessDenied}</div>
          <h2 className="auth-title">{fr.common.messages.permissionDenied}</h2>
          <p className="auth-copy">
            {fr.common.messages.restrictedModule}
          </p>
          <div style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" to="/dashboard">
              {fr.common.buttons.goDashboard}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
