import Orbs    from './Orbs';
import Sidebar  from './Sidebar';
import TopBar   from './TopBar';

export default function AppShell({ navItems, active, onNav, user, onLogout, title, children }) {
  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(ellipse at top left,rgba(245,197,24,0.08) 0%,#0a0a0a 52%,rgba(217,119,6,0.05) 100%)',
      position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <Orbs />
      <Sidebar navItems={navItems} active={active} onNav={onNav} user={user} />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <TopBar title={title} onLogout={onLogout} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
