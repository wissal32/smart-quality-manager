import ActionButton from '../ui/ActionButton'
import StatusBadge from '../ui/StatusBadge'
import { Pencil, Trash2 } from 'lucide-react'

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export default function ActionRow({ action, onEdit, onDelete, onStatusChange }) {
  const deadlineLabel = action.deadline
    ? new Date(action.deadline).toLocaleDateString()
    : 'No deadline'

  return (
    <tr>
      <td>
        <p style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{action.title}</p>
        <p className="muted" style={{ marginTop: 4 }}>{action.description || 'No description'}</p>
      </td>
      <td>
        <StatusBadge status={action.status} label={action.statusLabel} />
      </td>
      <td>
        <StatusBadge
          status={action.priority === 'high' ? 'critique' : action.priority === 'medium' ? 'maintenance' : 'working'}
          label={priorityLabels[action.priority] || action.priority}
        />
      </td>
    <td>{action.assignedToName || action.assigned_to?.name}</td>
      <td>{deadlineLabel}</td>
      <td>
        <select
          className="select"
          value={action.status}
          onChange={(event) => onStatusChange(action, event.target.value)}
          aria-label={`Change status for ${action.title}`}
          style={{ minWidth: 160 }}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>à
      </td>
      <td>
        <div className="table-action-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={Pencil} onClick={() => onEdit(action)}>
            Edit
          </ActionButton>
          <ActionButton variant="danger" icon={Trash2} onClick={() => onDelete(action)}>
            Delete
          </ActionButton>
        </div>
      </td>
    </tr>
  )
}
