import { useState } from 'react';

export default function TopBar({ title, onLogout }) {
  const [pulse, setPulse] = useState(true);
  return (
    <div style={{
      height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 30px', borderBottom: '1px solid rgba(245,197,24,0.07)',
      background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setPulse(false)} style={{ background: 'none', border: '1px solid rgba(245,197,24,0.18)', borderRadius: 9, color: '#A0A0A0', cursor: 'pointer', padding: '7px 11px', fontSize: 15, position: 'relative' }}>
          🔔
          {pulse && <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, background: '#F5C518', borderRadius: '50%', boxShadow: '0 0 6px #F5C518' }} />}
        </button>
        <button onClick={onLogout} style={{ background: 'none', border: '1px solid rgba(245,197,24,0.18)', borderRadius: 9, color: '#A0A0A0', cursor: 'pointer', padding: '7px 14px', fontSize: 12, fontWeight: 500, letterSpacing: 0.2 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
