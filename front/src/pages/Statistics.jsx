import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Clock3, Archive, TrendingUp } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function Statistics() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Assuming GET /api/dashboard/stats returns the necessary stats
      const { data } = await api.get('/dashboard/stats')
      return data
    },
  })

  const summary = useMemo(() => {
    return {
      actions: data?.total_actions || 0,
      incidents: data?.open_incidents || 0,
      equipments: data?.total_equipments || 0,
      ideas: data?.ideas_submitted || 0,
      averageScore: data?.average_5s_score || 0,
      // For charts, we use mock distribution if API doesn't provide them directly
      // In a real app, the API should return these distributions
      actionsByStatus: data?.actions_by_status || { pending: 10, in_progress: 5, completed: 15 },
      incidentsByCategory: data?.incidents_by_category || { IT: 8, Safety: 3, Facility: 5 },
      equipmentsByStatus: data?.equipments_by_status || { working: 40, broken: 2, maintenance: 5 },
      scoreEvolution: data?.score_evolution || [12, 15, 18, 14, 20, 22, 23],
    }
  }, [data])

  const statCards = [
    { label: 'Total Actions', value: summary.actions, icon: Activity, tone: '#38bdf8' },
    { label: 'Total Incidents', value: summary.incidents, icon: Clock3, tone: '#f43f5e' },
    { label: 'Total Equipments', value: summary.equipments, icon: ShieldCheck, tone: '#a78bfa' },
    { label: 'Total Ideas', value: summary.ideas, icon: Archive, tone: '#22c55e' },
    { label: 'Avg 5S Score', value: summary.averageScore.toFixed(1), icon: TrendingUp, tone: '#f59e0b' },
  ]

  const pieData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [summary.actionsByStatus.pending, summary.actionsByStatus.in_progress, summary.actionsByStatus.completed],
      backgroundColor: ['#f59e0b', '#38bdf8', '#22c55e'],
      borderWidth: 0,
    }]
  }

  const barData = {
    labels: Object.keys(summary.incidentsByCategory),
    datasets: [{
      label: 'Incidents',
      data: Object.values(summary.incidentsByCategory),
      backgroundColor: '#f43f5e',
      borderRadius: 6,
    }]
  }

  const doughnutData = {
    labels: ['Working', 'Broken', 'Maintenance'],
    datasets: [{
      data: [summary.equipmentsByStatus.working, summary.equipmentsByStatus.broken, summary.equipmentsByStatus.maintenance],
      backgroundColor: ['#22c55e', '#f43f5e', '#f59e0b'],
      borderWidth: 0,
    }]
  }

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Avg 5S Score',
      data: summary.scoreEvolution,
      borderColor: '#a78bfa',
      backgroundColor: 'rgba(167, 139, 250, 0.2)',
      fill: true,
      tension: 0.4,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#cbd5e1' } }
    }
  }

  const scaleOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
      y: { grid: { color: 'rgba(148,163,184,0.12)' }, ticks: { color: '#cbd5e1' } },
    }
  }

  return (
    <div className="page-grid">
      <div className="section-title">
        <div>
          <h2 className="page-title">Statistics Dashboard</h2>
        </div>
      </div>

      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {statCards.map(({ label, value, icon: Icon, tone }, index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="metric-card stat-card"
          >
            <div className="stat-icon" style={{ background: `${tone}18`, color: tone }}>
              <Icon size={18} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.85rem' }}>{label}</div>
              <div className="stat-value">{isLoading ? '...' : value}</div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="charts-grid">
        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Actions</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Actions by Status</h3>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </motion.article>

        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Incidents</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Incidents by Category</h3>
          <div>
            <Bar data={barData} options={scaleOptions} />
          </div>
        </motion.article>

        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Equipments</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Equipment Status</h3>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </motion.article>

        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Audits</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>5S Score Evolution</h3>
          <div>
            <Line data={lineData} options={{ ...scaleOptions, plugins: { legend: { display: false } } }} />
          </div>
        </motion.article>
      </section>

      <section className="charts-grid" style={{ gridTemplateColumns: '1fr' }}>
        <motion.article className="panel-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-kicker">Performance Insights</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px' }}>Key Highlights</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Best Performing Zone</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>Atelier de production A</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-strong)', marginTop: '4px' }}>Avg Score: 24/25</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Most Frequent Incident</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f43f5e' }}>IT Issues</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-strong)', marginTop: '4px' }}>8 recent reports</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Team Performance</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#22c55e' }}>Improving</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-strong)', marginTop: '4px' }}>+12% completed actions</div>
            </div>
          </div>
        </motion.article>
      </section>
    </div>
  )
}
