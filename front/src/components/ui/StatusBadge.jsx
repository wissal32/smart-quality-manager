export default function StatusBadge({ status, label }) {
  const getStatusClass = (statusString) => {
    const s = String(statusString).toLowerCase();
    
    // Success mapping
    if (['working', 'operational', 'terminé', 'succès', 'acceptée', 'transformée', 'completed', 'done'].includes(s)) {
      return 'badge badge-success';
    }
    // In-progress mapping
    if (['in_progress', 'in progress', 'en cours'].includes(s)) {
      return 'badge badge-info';
    }
    // Pending mapping
    if (['pending', 'todo'].includes(s)) {
      return 'badge badge-warning';
    }
    // Danger mapping
    if (['broken', 'out of order', 'en panne', 'critique', 'haute'].includes(s)) {
      return 'badge badge-danger';
    }
    // Warning mapping
    if (['maintenance', 'en maintenance', 'moyenne', 'en revue'].includes(s)) {
      return 'badge badge-warning';
    }
    
    return 'badge'; // default
  };

  return (
    <span className={getStatusClass(status)}>
      {label || status}
    </span>
  );
}
