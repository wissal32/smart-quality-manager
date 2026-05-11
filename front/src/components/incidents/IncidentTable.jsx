import IncidentRow from './IncidentRow'

export default function IncidentTable({ incidents, isLoading, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Assigned User</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                Loading incidents...
              </td>
            </tr>
          ) : incidents.length === 0 ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                No incidents found.
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
