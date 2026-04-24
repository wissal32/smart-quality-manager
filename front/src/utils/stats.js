export function getStatusBadgeClass(status) {
  const normalized = String(status || '').toLowerCase()

  if (['working', 'approved', 'done', 'resolved'].includes(normalized)) {
    return 'badge badge-success'
  }

  if (['maintenance', 'pending', 'todo', 'investigating'].includes(normalized)) {
    return 'badge badge-warning'
  }

  if (['broken', 'rejected', 'open'].includes(normalized)) {
    return 'badge badge-danger'
  }

  return 'badge'
}