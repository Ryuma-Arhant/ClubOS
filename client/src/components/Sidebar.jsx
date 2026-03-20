import Badge from './Badge';

const NAV_ICONS = {
  Overview: '◈', Home: '◈', Clubs: '⬡', 'My Clubs': '⬡', 'Discover Clubs': '⊕',
  Users: '◎', Members: '◎', Events: '◆', Chat: '◉', Gallery: '▣',
  Notifications: '◬', Settings: '⚙',
};

export default function Sidebar({ navItems, active, onNav, user }) {
  return (
    <div style={{
      width: 240, minWidth: 240,
      background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(22px)',
      borderRight: '1px solid rgba(245,197,24,0.09)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(245,197,24,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 19, color: '#000', flexShrink: 0 }}>C</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: 0.3 }}>ClubOS</div>
            <div style={{ fontSize: 11, color: '#555' }}>Campus Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = active === item;
          return (
            <div key={item} onClick={() => onNav(item)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 10, marginBottom: 3, cursor: 'pointer',
              background: isActive ? 'rgba(245,197,24,0.09)' : 'transparent',
              borderLeft: isActive ? '3px solid #F5C518' : '3px solid transparent',
              color: isActive ? '#F5C518' : '#A0A0A0',
              fontWeight: isActive ? 600 : 400, fontSize: 14, transition: 'all 0.18s',
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#ccc'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0A0A0'; } }}>
              <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.7 }}>{NAV_ICONS[item] || '◇'}</span>
              {item}
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(245,197,24,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000', flexShrink: 0 }}>
            {user.name[0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <Badge variant={user.roleVariant || 'gold'}>{user.role}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
