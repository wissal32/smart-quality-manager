import IncidentRow from './IncidentRow'
import { fr } from '../../i18n/fr'

export default function IncidentTable({ incidents, isLoading, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{fr.incidents.table.title}</th>
            <th>{fr.incidents.table.category}</th>
            <th>{fr.incidents.table.severity}</th>
            <th>{fr.incidents.table.assignedUser}</th>
            <th>{fr.incidents.table.status}</th>
            <th>{fr.incidents.table.createdDate}</th>
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
          ) : incidents.length === 0 ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                {fr.common.messages.noData}
              </td>
            </tr>
          ) : (
            incidents.map((incident) => (
              <IncidentRow
                key={incident.id}
                incident={incident}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
