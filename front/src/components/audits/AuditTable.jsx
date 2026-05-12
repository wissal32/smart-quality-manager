import AuditRow from './AuditRow'
import { fr } from '../../i18n/fr'

export default function AuditTable({ audits, isLoading, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{fr.audits5s.table.zone}</th>
            <th>{fr.audits5s.table.createdBy}</th>
            <th>{fr.audits5s.table.score}</th>
            <th>{fr.audits5s.table.createdDate}</th>
            <th>{fr.common.buttons.edit}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="muted" style={{ textAlign: 'center' }}>
                {fr.common.messages.loading}
              </td>
            </tr>
          ) : audits.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted" style={{ textAlign: 'center' }}>
                {fr.common.messages.noData}
              </td>
            </tr>
          ) : (
            audits.map((audit) => (
              <AuditRow
                key={audit.id}
                audit={audit}
                onView={onView}
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
