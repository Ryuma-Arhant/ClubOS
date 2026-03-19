export default function CapBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#F5C518,#D97706)', borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: '#A0A0A0', whiteSpace: 'nowrap' }}>{value}/{max}</span>
    </div>
  );
}
