export default function FilterBar({ children, actions }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '16px', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
        {children}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
