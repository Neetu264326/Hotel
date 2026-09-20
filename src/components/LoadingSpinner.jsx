const LoadingSpinner = ({ label = 'Loading...', size = 'lg' }) => {
  return (
    <div
      className="loading-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: 16,
      }}
    >
      <div
        className="spinner"
        style={{ width: size === 'sm' ? 28 : 48, height: size === 'sm' ? 28 : 48, borderWidth: size === 'sm' ? 3 : 4 }}
        role="status"
        aria-label={label}
      />
      <p style={{ color: '#6B7280', fontSize: 14 }}>{label}</p>
    </div>
  )
}

export const Skeleton = ({ width = '100%', height = 14, radius = 8, style }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius: radius, ...style }}
    aria-hidden="true"
  />
)

export const SkeletonCard = ({ height = 260 }) => (
  <div className="card" style={{ padding: 16 }}>
    <Skeleton width="100%" height={height} radius={14} />
    <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
      <Skeleton width="70%" height={18} />
      <Skeleton width="50%" height={14} />
      <Skeleton width="90%" height={14} />
    </div>
  </div>
)

export default LoadingSpinner
