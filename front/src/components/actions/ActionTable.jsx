import ActionRow from './ActionRow'
import { fr } from '../../i18n/fr'

export default function ActionTable({ actions, isLoading, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{fr.actions.table.title}</th>
            <th>{fr.actions.table.status}</th>
            <th>{fr.actions.table.priority}</th>
            <th>{fr.actions.table.assignedTo}</th>
            <th>{fr.actions.table.deadline}</th>
            <th>{fr.actions.table.quickStatus}</th>
            <th>{fr.common.buttons.edit}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                {fr.common.messages.loading}
              </td>
            </tr>
          ) : actions.length === 0 ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                {fr.common.messages.noData}
              </td>
            </tr>
          ) : (
            actions.map((action) => (
              <ActionRow
                key={action.id}
                action={action}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
