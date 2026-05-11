export default function AuditScoreDisplay({ tri, ranger, nettoyer, standardiser, maintenir }) {
  const scores = {
    tri: Number(tri) || 0,
    ranger: Number(ranger) || 0,
    nettoyer: Number(nettoyer) || 0,
    standardiser: Number(standardiser) || 0,
    maintenir: Number(maintenir) || 0,
  }

  const total = scores.tri + scores.ranger + scores.nettoyer + scores.standardiser + scores.maintenir
  const maxScore = 25
  const percentage = maxScore > 0 ? ((total / maxScore) * 100).toFixed(1) : 0

  const scoreColor = total >= 20 ? '#10b981' : total >= 15 ? '#f59e0b' : '#ef4444'

  return (
    <div
      style={{
        background: 'rgba(56, 189, 248, 0.05)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '24px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Tri (Sort)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-strong)' }}>
            {scores.tri || '-'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Ranger (Order)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-strong)' }}>
            {scores.ranger || '-'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Nettoyer (Shine)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-strong)' }}>
            {scores.nettoyer || '-'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Standardiser
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-strong)' }}>
            {scores.standardiser || '-'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Maintenir (Sustain)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-strong)' }}>
            {scores.maintenir || '-'}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(56, 189, 248, 0.2)',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Score
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: 900, color: scoreColor }}>
            {total} / {maxScore}
          </p>
        </div>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `conic-gradient(${scoreColor} 0deg ${(percentage / 100) * 360}deg, rgba(56, 189, 248, 0.1) ${(percentage / 100) * 360}deg)`,
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'var(--surface)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: scoreColor }}>
                {percentage}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '2px' }}>
                Progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
