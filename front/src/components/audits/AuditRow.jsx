import { Eye, Pencil, Trash2 } from 'lucide-react'
import ActionButton from '../ui/ActionButton'
import { fr } from '../../i18n/fr'

function getScoreBadgeClass(score) {
  if (!score) return 'badge badge-info'
  const numScore = Number(score)
  if (numScore >= 20) return 'badge badge-success'
  if (numScore >= 15) return 'badge badge-warning'
  return 'badge badge-danger'
}

export default function AuditRow({ audit, onView, onEdit, onDelete }) {
  const createdAtLabel = audit.created_at
    ? new Date(audit.created_at).toLocaleDateString()
    : '-'

  const zoneName = audit.zone?.name || `Zone #${audit.zone_id}`
  
  // Properly handle createdBy - ensure it's displaying a name, never an object
  let creatorName = fr.common.messages.noData || 'Utilisateur inconnu'
  
  if (typeof audit.createdBy === 'object' && audit.createdBy?.name) {
    creatorName = audit.createdBy.name
  } else if (typeof audit.created_by === 'number') {
    creatorName = `User #${audit.created_by}`
  }

  return (
    <tr>
      <td>
        <p style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{zoneName}</p>
      </td>
      <td>{creatorName}</td>
      <td>
        <span className={getScoreBadgeClass(audit.score)}>
          {audit.score ? `${audit.score}/25` : 'N/D'}
        </span>
      </td>
      <td>{createdAtLabel}</td>
      <td>
        <div className="table-action-row" style={{ gap: 8 }}>
          <ActionButton variant="ghost" icon={Eye} onClick={() => onView(audit)}>
            {fr.audits5s.buttons.view}
          </ActionButton>
          <ActionButton variant="ghost" icon={Pencil} onClick={() => onEdit(audit)}>
            {fr.common.buttons.edit}
          </ActionButton>
          <ActionButton variant="danger" icon={Trash2} onClick={() => onDelete(audit)}>
            {fr.common.buttons.delete}
          </ActionButton>
        </div>
      </td>
    </tr>
  )
}
