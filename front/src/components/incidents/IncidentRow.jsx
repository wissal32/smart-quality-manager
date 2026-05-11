import { Pencil, Trash2 } from 'lucide-react'
import ActionButton from '../ui/ActionButton'

function badgeClassForSeverity(severity) {
  if (severity === 'low') return 'badge badge-success'
  if (severity === 'medium') return 'badge badge-warning'
  return 'badge badge-danger'
}

function badgeClassForStatus(status) {
  if (status === 'resolved') return 'badge badge-success'
  if (status === 'in_progress') return 'badge badge-info'
  return 'badge badge-danger'
}

export default function IncidentRow({ incident, onEdit, onDelete }) {
  const createdAtLabel = incident.created_at
    ? new Date(incident.created_at).toLocaleDateString()
    : '-'

  // Properly handle assigned user - ensure it's a name string or "Unassigned"
  let assignedUserDisplay = 'Unassigned'
  
  if (incident.assignedUserName) {
    assignedUserDisplay = incident.assignedUserName
  } else if (typeof incident.assigned_to === 'object' && incident.assigned_to?.name) {
    assignedUserDisplay = incident.assigned_to.name
  } else if (typeof incident.assigned_to === 'number') {
    assignedUserDisplay = `User #${incident.assigned_to}`
  }

  return (
    <tr>
      <td>
        <p style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{incident.title}</p>
        <p className="muted" style={{ marginTop: 4 }}>{incident.description || 'No description'}</p>
      </td>
      <td>{incident.category}</td>
      <td>
        <span className={badgeClassForSeverity(incident.severity)}>{incident.severity}</span>
      </td>
      <td>{assignedUserDisplay}</td>
      <td>
        <span className={badgeClassForStatus(incident.status)}>{incident.status}</span>
      </td>
      <td>{createdAtLabel}</td>
      <td>
        <div className="table-action-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={Pencil} onClick={() => onEdit(incident)}>
            Edit
          </ActionButton>
          <ActionButton variant="danger" icon={Trash2} onClick={() => onDelete(incident)}>
            Delete
          </ActionButton>
        </div>
      </td>
    </tr>
  )
}
