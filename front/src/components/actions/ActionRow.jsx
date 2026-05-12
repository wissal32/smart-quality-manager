import ActionButton from '../ui/ActionButton'
import StatusBadge from '../ui/StatusBadge'
import { Pencil, Trash2 } from 'lucide-react'
import { fr } from '../../i18n/fr'

const priorityLabels = {
  low: fr.actions.priorities.low,
  medium: fr.actions.priorities.medium,
  high: fr.actions.priorities.high,
}

export default function ActionRow({ action, onEdit, onDelete, onStatusChange }) {
  const deadlineLabel = action.deadline
    ? new Date(action.deadline).toLocaleDateString()
    : fr.actions.form.noDeadline

  return (
    <tr>
      <td>
        <p style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{action.title}</p>
        <p className="muted" style={{ marginTop: 4 }}>{action.description || fr.actions.noDescription}</p>
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
          <option value="pending">{fr.actions.filters.status.pending}</option>
          <option value="in_progress">{fr.actions.filters.status.inProgress}</option>
          <option value="completed">{fr.actions.filters.status.completed}</option>
        </select>
      </td>
      <td>
        <div className="table-action-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={Pencil} onClick={() => onEdit(action)}>
            {fr.common.buttons.edit}
          </ActionButton>
          <ActionButton variant="danger" icon={Trash2} onClick={() => onDelete(action)}>
            {fr.common.buttons.delete}
          </ActionButton>
        </div>
      </td>
    </tr>
  )
}
