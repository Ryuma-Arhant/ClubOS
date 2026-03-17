export default function GlassCard({ children, style, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(245,197,24,0.15)',
      backdropFilter: 'blur(12px)',
      borderRadius: 'var(--card-radius, 16px)',
      boxShadow: '0 4px 24px rgba(245,197,24,0.06)',
      ...style,
    }}>
      {children}
    </div>
  );
}
