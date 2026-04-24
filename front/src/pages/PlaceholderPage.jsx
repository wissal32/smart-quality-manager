import { motion } from 'framer-motion'

export default function PlaceholderPage({ title, description }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="panel-card"
    >
      <div className="page-kicker">Module</div>
      <h2 className="page-title" style={{ marginTop: 10 }}>
        {title}
      </h2>
      <p className="page-copy">{description}</p>
    </motion.section>
  )
}