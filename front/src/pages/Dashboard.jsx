import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, Archive, Clock3, ShieldCheck, Wrench, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../services/dashboardService'
import { useAuthStore } from '../store/authStore'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const summary = useMemo(() => {
    return {
      actions: data?.totalActions || 0,
      incidents: data?.openIncidents || 0,
      ideas: data?.totalIdeas || 0,
      equipments: data?.totalEquipments || 0,
      averageScore: data?.averageScore || 0,
      actionsByStatus: data?.actionsByStatus || { todo: 0, in_progress: 0, done: 0 },
      incidentsBySeverity: data?.incidentsBySeverity || { low: 0, medium: 0, high: 0 },
      recentActions: data?.recentActions || [],
      recentIncidents: data?.recentIncidents || [],
      recentIdeas: data?.recentIdeas || [],
    }
  }, [data])

  // Chart: Actions by Status
  const actionsStatusChart = useMemo(
    () => ({
      labels: ['To Do', 'In Progress', 'Completed'],
      datasets: [
        {
          label: 'Actions',
          data: [summary.actionsByStatus.todo, summary.actionsByStatus.in_progress, summary.actionsByStatus.done],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    [summary.actionsByStatus],
  )

  // Chart: Incidents by Severity
  const incidentsSeverityChart = useMemo(
    () => ({
      labels: ['Low', 'Medium', 'High'],
      datasets: [
        {
          label: 'Incidents',
          data: [summary.incidentsBySeverity.low, summary.incidentsBySeverity.medium, summary.incidentsBySeverity.high],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    [summary.incidentsBySeverity],
  )

  const statCards = [
    { label: 'Total Actions', value: summary.actions, icon: Activity, tone: '#38bdf8' },
    { label: 'Open Incidents', value: summary.incidents, icon: AlertTriangle, tone: '#f59e0b' },
    { label: 'Ideas Submitted', value: summary.ideas, icon: TrendingUp, tone: '#22c55e' },
    { label: 'Equipments', value: summary.equipments, icon: Wrench, tone: '#a78bfa' },
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'done':
      case 'completed':
        return 'badge badge-success'
      case 'in_progress':
        return 'badge badge-info'
      case 'pending':
      case 'todo':
        return 'badge badge-warning'
      default:
        return 'badge badge-info'
    }
  }

  const getSeverityBadgeClass = (severity) => {
    if (severity === 'low') return 'badge badge-success'
    if (severity === 'medium') return 'badge badge-warning'
    return 'badge badge-danger'
  }

  if (error) {
    return (
      <div className="page-grid">
        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Error</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Failed to load dashboard data
          </h2>
          <p className="panel-copy">
            There was an error fetching data from the backend. Please check your connection and try refreshing the page.
          </p>
        </motion.article>
      </div>
    )
  }

  return (
    <div className="page-grid">
      <section className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, tone }, index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="metric-card stat-card"
          >
            <div className="stat-icon" style={{ background: `${tone}18`, color: tone }}>
              <Icon size={18} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.9rem' }}>
                {label}
              </div>
              <div className="stat-value">{isLoading ? '...' : value}</div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="charts-grid">
        <motion.article className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Overview</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Actions by Status
          </h2>
          <div style={{ marginTop: 20 }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading chart...</div>
            ) : (
              <Bar
                data={actionsStatusChart}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
                    y: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
                  },
                }}
              />
            )}
          </div>
        </motion.article>

        <motion.article className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Risk Assessment</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Incidents by Severity
          </h2>
          <div style={{ marginTop: 20 }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading chart...</div>
            ) : (
              <Bar
                data={incidentsSeverityChart}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
                    y: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
                  },
                }}
              />
            )}
          </div>
        </motion.article>

        <motion.article className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Quality score</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Average 5S Score
          </h2>
          <div className="chart-center">
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1 }}>
              {isLoading ? '...' : summary.averageScore.toFixed(2)}
            </div>
            <p className="muted" style={{ textAlign: 'center', maxWidth: '28ch', marginTop: 8 }}>
              Out of 25 points
            </p>
          </div>
        </motion.article>
      </section>

      <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card-kicker">Recent Activity</div>
        <h2 className="page-title" style={{ marginTop: 8 }}>
          Latest Items Across System
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
          {/* Recent Actions */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Latest Actions
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {isLoading ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>Loading...</p>
              ) : summary.recentActions.length > 0 ? (
                summary.recentActions.map((action, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: '8px',
                      borderLeft: '3px solid #38bdf8',
                    }}
                  >
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)', marginBottom: '4px' }}>
                      {action.title}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span className={getStatusBadgeClass(action.status)} style={{ fontSize: '0.75rem' }}>
                        {action.status}
                      </span>
                      <span className="muted" style={{ fontSize: '0.75rem' }}>
                        {formatDate(action.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted" style={{ fontSize: '0.85rem' }}>No actions yet</p>
              )}
            </div>
          </div>

          {/* Recent Incidents */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Latest Incidents
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {isLoading ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>Loading...</p>
              ) : summary.recentIncidents.length > 0 ? (
                summary.recentIncidents.map((incident, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: '8px',
                      borderLeft: '3px solid #f59e0b',
                    }}
                  >
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)', marginBottom: '4px' }}>
                      {incident.title}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span className={getSeverityBadgeClass(incident.severity)} style={{ fontSize: '0.75rem' }}>
                        {incident.severity}
                      </span>
                      <span className="muted" style={{ fontSize: '0.75rem' }}>
                        {formatDate(incident.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted" style={{ fontSize: '0.85rem' }}>No incidents yet</p>
              )}
            </div>
          </div>

          {/* Recent Ideas */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Latest Ideas
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {isLoading ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>Loading...</p>
              ) : summary.recentIdeas.length > 0 ? (
                summary.recentIdeas.map((idea, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: '8px',
                      borderLeft: '3px solid #22c55e',
                    }}
                  >
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)', marginBottom: '4px' }}>
                      {idea.title}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {idea.votes || 0} votes
                      </span>
                      <span className="muted" style={{ fontSize: '0.75rem' }}>
                        {formatDate(idea.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="muted" style={{ fontSize: '0.85rem' }}>No ideas yet</p>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card-kicker">System</div>
        <h2 className="page-title" style={{ marginTop: 8 }}>
          Production-ready API integration
        </h2>
        <p className="panel-copy">
          This dashboard is connected to the Laravel Sanctum backend and fetches real-time data from multiple endpoints. Data refreshes automatically every 30 seconds.
        </p>
        <div className="feature-row">
          <div className="feature-pill">React Query</div>
          <div className="feature-pill">Zustand</div>
          <div className="feature-pill">Axios</div>
          <div className="feature-pill">Chart.js</div>
          <div className="feature-pill">Real-time Data</div>
        </div>
      </motion.article>

      {user?.role === 'admin' && (
        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Admin tools</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Users management
          </h2>
          <p className="panel-copy">
            Create new accounts, assign roles, and review all users from a dedicated admin screen.
          </p>
          <div className="button-row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/users')}>
              <ShieldCheck size={16} />
              Open Users
            </button>
          </div>
        </motion.article>
      )}
    </div>
  )
}