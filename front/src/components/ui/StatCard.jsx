import { motion } from 'framer-motion';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = '#38bdf8', 
  bgColor = 'rgba(56, 189, 248, 0.12)' 
}) {
  return (
    <motion.article 
      className="metric-card stat-card" 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      {Icon && (
        <div className="stat-icon" style={{ background: bgColor, color: color }}>
          <Icon size={18} />
        </div>
      )}
      <div>
        <div className="muted" style={{ fontSize: '0.9rem' }}>
          {title}
        </div>
        <div className="stat-value">{value}</div>
      </div>
    </motion.article>
  );
}
