import ActionRow from './ActionRow'

export default function ActionTable({ actions, isLoading, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned To</th>
            <th>Deadline</th>
            <th>Quick Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                Loading actions...
              </td>
            </tr>
          ) : actions.length === 0 ? (
            <tr>
              <td colSpan={7} className="muted" style={{ textAlign: 'center' }}>
                No actions found.
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
