import { forwardRef } from 'react';

const DataTable = forwardRef(({ 
  columns, 
  data, 
  isLoading, 
  loadingText = 'Loading data...',
  emptyText = 'No data found.'
}, ref) => {
  return (
    <div className="table-wrap" ref={ref}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="muted" style={{ textAlign: 'center' }}>
                {loadingText}
              </td>
            </tr>
          ) : data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="muted" style={{ textAlign: 'center' }}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
