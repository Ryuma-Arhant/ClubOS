export function GoldButton({ children, onClick, style, size = 'md', variant = 'primary', fullWidth }) {
  const pad = size === 'sm' ? '5px 12px' : size === 'lg' ? '13px 26px' : '9px 18px';
  const fs  = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;
  return (
    <button onClick={onClick} style={{
      background: variant === 'primary' ? 'linear-gradient(135deg,#F5C518,#D97706)' : 'transparent',
      color:  variant === 'primary' ? '#000' : '#F5C518',
      border: variant === 'primary' ? 'none' : '1px solid rgba(245,197,24,0.45)',
      borderRadius: 10, fontWeight: 700, cursor: 'pointer',
      padding: pad, fontSize: fs, width: fullWidth ? '100%' : undefined,
      transition: 'opacity 0.18s,transform 0.18s', letterSpacing: 0.2,
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}>
      {children}
    </button>
  );
}

export function DangerButton({ children, onClick, size = 'sm' }) {
  const pad = size === 'sm' ? '5px 12px' : '9px 18px';
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: '#f87171',
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: 8, fontWeight: 600, cursor: 'pointer',
      padding: pad, fontSize: size === 'sm' ? 12 : 14,
      transition: 'opacity 0.18s',
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
      {children}
    </button>
  );
}
