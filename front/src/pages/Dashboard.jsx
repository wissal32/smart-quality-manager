import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, Archive, Clock3, ShieldCheck, Wrench, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import { fr } from '../i18n/fr'
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
      labels: [fr.dashboard.statuses.toDo, fr.dashboard.statuses.inProgress, fr.dashboard.statuses.completed],
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
      labels: [fr.dashboard.severity.low, fr.dashboard.severity.medium, fr.dashboard.severity.high],
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
    { label: fr.dashboard.stats.totalActions, value: summary.actions, icon: Activity, tone: '#38bdf8' },
    { label: fr.dashboard.stats.openIncidents, value: summary.incidents, icon: AlertTriangle, tone: '#f59e0b' },
    { label: fr.dashboard.stats.ideasSubmitted, value: summary.ideas, icon: TrendingUp, tone: '#22c55e' },
    { label: fr.dashboard.stats.equipments, value: summary.equipments, icon: Wrench, tone: '#a78bfa' },
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
          <div className="card-kicker">Erreur</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Impossible de charger les données du tableau de bord
          </h2>
          <p className="panel-copy">
            Une erreur s'est produite lors de la récupération des données du backend. Veuillez vérifier votre connexion et actualiser la page.
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
          <div className="card-kicker">{fr.dashboard.sections.overview}</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            {fr.dashboard.sections.actionsByStatus}
          </h2>
          <div style={{ marginTop: 20 }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{fr.dashboard.charts.loadingChart}</div>
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
          <div className="card-kicker">{fr.dashboard.sections.riskAssessment}</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            {fr.dashboard.sections.incidentsBySeverity}
          </h2>
          <div style={{ marginTop: 20 }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{fr.dashboard.charts.loadingChart}</div>
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
          <div className="card-kicker">{fr.dashboard.sections.qualityScore}</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            {fr.dashboard.sections.average5sScore}
          </h2>
          <div className="chart-center">
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1 }}>
              {isLoading ? '...' : summary.averageScore.toFixed(2)}
            </div>
            <p className="muted" style={{ textAlign: 'center', maxWidth: '28ch', marginTop: 8 }}>
              {fr.dashboard.sections.outOf25}
            </p>
          </div>
        </motion.article>
      </section>

      <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card-kicker">{fr.dashboard.recentActivity.title}</div>
        <h2 className="page-title" style={{ marginTop: 8 }}>
          {fr.dashboard.recentActivity.subtitle}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
          {/* Recent Actions */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {fr.dashboard.recentActivity.latestActions}
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {isLoading ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>{fr.dashboard.recentActivity.loading}</p>
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
                <p className="muted" style={{ fontSize: '0.85rem' }}>{fr.dashboard.recentActivity.noActions}</p>
              )}
            </div>
          </div>

          {/* Recent Incidents */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {fr.dashboard.recentActivity.latestIncidents}
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {isLoading ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>{fr.dashboard.recentActivity.loading}</p>
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
                <p className="muted" style={{ fontSize: '0.85rem' }}>{fr.dashboard.recentActivity.noIncidents}</p>
              )}
            </div>
          </div>

          {/* Recent Ideas */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {fr.dashboard.recentActivity.latestIdeas}
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {isLoading ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>{fr.dashboard.recentActivity.loading}</p>
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
                <p className="muted" style={{ fontSize: '0.85rem' }}>{fr.dashboard.recentActivity.noIdeas}</p>
              )}
            </div>
          </div>
        </div>
      </motion.article>


    </div>
  )
}