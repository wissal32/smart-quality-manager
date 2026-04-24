import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const isHydrating = useAuthStore((state) => state.isHydrating)
  const location = useLocation()

  if (isHydrating) {
    return (
      <div className="auth-page">
        <div className="auth-card glass" style={{ textAlign: 'center' }}>
          <div className="auth-kicker">Loading</div>
          <h2 className="auth-title">Restoring session</h2>
          <p className="auth-copy">Checking your Sanctum token before opening the dashboard.</p>
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
          <div className="auth-kicker">Access denied</div>
          <h2 className="auth-title">You do not have permission</h2>
          <p className="auth-copy">
            This module is restricted to specific roles in Smart Quality Manager.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link className="btn btn-primary" to="/dashboard">
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
