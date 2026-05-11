import AuditRow from './AuditRow'

export default function AuditTable({ audits, isLoading, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Zone</th>
            <th>Created By</th>
            <th>Score</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="muted" style={{ textAlign: 'center' }}>
                Loading audits...
              </td>
            </tr>
          ) : audits.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted" style={{ textAlign: 'center' }}>
                No audits found.
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
