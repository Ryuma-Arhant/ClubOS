export const BADGE_MAP = {
  gold:   { bg:'rgba(245,197,24,0.15)',  color:'#F5C518', br:'rgba(245,197,24,0.3)' },
  amber:  { bg:'rgba(217,119,6,0.15)',   color:'#D97706', br:'rgba(217,119,6,0.3)' },
  green:  { bg:'rgba(34,197,94,0.15)',   color:'#4ade80', br:'rgba(34,197,94,0.3)' },
  red:    { bg:'rgba(239,68,68,0.15)',   color:'#f87171', br:'rgba(239,68,68,0.3)' },
  gray:   { bg:'rgba(160,160,160,0.12)', color:'#888',    br:'rgba(160,160,160,0.2)' },
  blue:   { bg:'rgba(59,130,246,0.15)',  color:'#60a5fa', br:'rgba(59,130,246,0.3)' },
  purple: { bg:'rgba(168,85,247,0.15)',  color:'#c084fc', br:'rgba(168,85,247,0.3)' },
};

export default function Badge({ children, variant = 'gold' }) {
  const c = BADGE_MAP[variant] || BADGE_MAP.gold;
  return (
    <span style={{
      background: c.bg, color: c.color,
      border: `1px solid ${c.br}`,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
