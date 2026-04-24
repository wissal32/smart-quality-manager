import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, Archive, Clock3, ShieldCheck, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
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
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardStats,
  })

  const summary = useMemo(() => {
    return {
      actions: data?.total_actions || 0,
      incidents: data?.open_incidents || 0,
      ideas: data?.ideas_submitted || 0,
      equipments: data?.total_equipments || 0,
      averageScore: data?.average_5s_score || 0,
    }
  }, [data])

  const barData = useMemo(
    () => ({
      labels: ['Actions', 'Incidents', 'Ideas', 'Equipments'],
      datasets: [
        {
          label: 'Items',
          data: [summary.actions, summary.incidents, summary.ideas, summary.equipments],
          backgroundColor: ['#38bdf8', '#f59e0b', '#22c55e', '#a78bfa'],
          borderRadius: 12,
        },
      ],
    }),
    [summary.actions, summary.incidents, summary.ideas, summary.equipments],
  )

  const doughnutData = useMemo(
    () => ({
      labels: ['Actions', 'Open incidents', 'Equipments', 'Ideas'],
      datasets: [
        {
          data: [summary.actions, summary.incidents, summary.equipments, summary.ideas],
          backgroundColor: ['#38bdf8', '#f59e0b', '#22c55e', '#a78bfa'],
          borderWidth: 0,
        },
      ],
    }),
    [summary.actions, summary.incidents, summary.equipments, summary.ideas],
  )

  const statCards = [
    { label: 'Total actions', value: summary.actions, icon: Activity, tone: '#38bdf8' },
    { label: 'Open incidents', value: summary.incidents, icon: Clock3, tone: '#f59e0b' },
    { label: 'Ideas submitted', value: summary.ideas, icon: Archive, tone: '#22c55e' },
    { label: 'Equipments', value: summary.equipments, icon: ShieldCheck, tone: '#a78bfa' },
  ]

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
            Operations activity
          </h2>
          <div style={{ marginTop: 20 }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
                  y: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
                },
              }}
            />
          </div>
        </motion.article>

        <motion.article className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Quality score</div>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            Average 5S score
          </h2>
          <div className="chart-center">
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1 }}>
              {isLoading ? '...' : summary.averageScore.toFixed(2)}
            </div>
            <p className="muted" style={{ textAlign: 'center', maxWidth: '28ch' }}>
              Live stats are fetched from the Sanctum-protected Laravel API.
            </p>
          </div>
        </motion.article>
      </section>

      <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card-kicker">System</div>
        <h2 className="page-title" style={{ marginTop: 8 }}>
          Production-ready API integration
        </h2>
        <p className="panel-copy">
          This dashboard is connected to the Laravel Sanctum backend and uses bearer token authentication from localStorage.
        </p>
        <div className="feature-row">
          <div className="feature-pill">React Query</div>
          <div className="feature-pill">Zustand</div>
          <div className="feature-pill">Axios</div>
          <div className="feature-pill">Framer Motion</div>
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