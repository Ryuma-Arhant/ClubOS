import GlassCard from './GlassCard';

export default function StatCard({ label, value, sub, accent = 'left' }) {
  return (
    <GlassCard style={{
      padding: '20px 22px', flex: 1, minWidth: 0,
      borderLeft: accent === 'left' ? '3px solid #F5C518' : undefined,
      borderTop:  accent === 'top'  ? '3px solid #F5C518' : undefined,
    }}>
      <div style={{ color: '#A0A0A0', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#F5C518', marginTop: 4 }}>{sub}</div>}
    </GlassCard>
  );
}
