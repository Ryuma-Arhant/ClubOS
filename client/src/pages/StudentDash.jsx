import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import Badge     from '../components/Badge';
import StatCard  from '../components/StatCard';
import { GoldButton } from '../components/Buttons';

const ST_NOTIFS = [
  { icon: '✓', text: 'Tech Showcase RSVP confirmed',       time: 'Just now',   color: '#4ade80' },
  { icon: '◆', text: 'CS Club posted a new event',          time: '1 hr ago',   color: '#F5C518' },
  { icon: '✦', text: 'Your club application was accepted',  time: '3 hrs ago',  color: '#F5C518' },
  { icon: '◬', text: 'Photo Walk starts in 2 days',         time: 'Yesterday',  color: '#60a5fa' },
  { icon: '✦', text: 'New album uploaded in CS Club',       time: '2 days ago', color: '#c084fc' },
];

const rsvpV = s => s === 'Going' ? 'green' : s === 'Maybe' ? 'amber' : 'gray';

export default function StudentDash() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [clubs,    setClubs]    = useState([]);
  const [events,   setEvents]   = useState([]);
  const [discover, setDiscover] = useState([]);
  const [applied,  setApplied]  = useState({});
  const [nav,      setNav]      = useState('Home');
  const navItems = ['Home', 'My Clubs', 'Discover Clubs', 'Events', 'Notifications'];

  useEffect(() => {
    Promise.all([api.get('/clubs'), api.get('/events')]).then(([clRes, evRes]) => {
      const active = clRes.data.filter(c => c.status === 'Active');
      setClubs(active.slice(0, 3));
      setDiscover(active.slice(3, 7));
      setEvents(evRes.data.filter(e => e.status === 'Published').slice(0, 3));
    }).catch(console.error);
  }, []);

  async function applyToClub(club) {
    try {
      await api.post(`/clubs/${club._id}/apply`, { name: user.name, email: user.email });
      setApplied(a => ({ ...a, [club._id]: true }));
    } catch (err) {
      setApplied(a => ({ ...a, [club._id]: true }));
    }
  }

  function handleNav(item) {
    setNav(item);
    if (item === 'Events') navigate('/events');
  }

  const myEvents = events.map((e, i) => ({
    ...e,
    status: i === 0 ? 'Going' : i === 1 ? 'Maybe' : 'Waitlisted',
  }));

  return (
    <AppShell navItems={navItems} active={nav} onNav={handleNav} user={user} onLogout={logout} title="Home">

      <GlassCard style={{ padding: '22px 26px', marginBottom: 22, background: 'linear-gradient(135deg,rgba(245,197,24,0.08) 0%,rgba(0,0,0,0.2) 100%)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Hello, {user.name.split(' ')[0]} 👋</div>
        <div style={{ fontSize: 13, color: '#A0A0A0', marginTop: 5 }}>
          You're in <span style={{ color: '#F5C518', fontWeight: 600 }}>{clubs.length} clubs</span> and have{' '}
          <span style={{ color: '#F5C518', fontWeight: 600 }}>{myEvents.length} events</span> coming up this week.
        </div>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 20 }}>
        <div>

          {/* My Clubs */}
          <GlassCard style={{ padding: '20px 22px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>My Clubs</h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 2 }}>
              {clubs.map(club => (
                <div key={club._id} style={{ minWidth: 160, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 13, padding: '16px', flexShrink: 0, transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#000', marginBottom: 11 }}>
                    {club.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3, lineHeight: 1.3 }}>{club.name}</div>
                  <div style={{ fontSize: 11, color: '#A0A0A0', marginBottom: 12 }}>{club.members?.length || 0} members</div>
                  <GoldButton size="sm" style={{ width: '100%', textAlign: 'center' }}>Go to Club →</GoldButton>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* My Upcoming Events */}
          <GlassCard style={{ padding: '20px 22px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>My Upcoming Events</h2>
            {myEvents.map(ev => {
              const parts = ev.date.split('-');
              const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(parts[1])-1];
              return (
                <div key={ev._id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 9, background: 'rgba(245,197,24,0.09)', border: '1px solid rgba(245,197,24,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 8, color: '#F5C518', fontWeight: 700, letterSpacing: 0.5 }}>{month}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{parts[2]}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ev.name}</div>
                    <div style={{ fontSize: 11, color: '#A0A0A0' }}>{ev.club} · {ev.time}</div>
                  </div>
                  <Badge variant={rsvpV(ev.status)}>{ev.status}</Badge>
                </div>
              );
            })}
          </GlassCard>

          {/* Discover Clubs */}
          <GlassCard style={{ padding: '20px 22px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Discover Clubs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
              {discover.map(club => (
                <div key={club._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 12, padding: '14px', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.28)'; e.currentTarget.style.background = 'rgba(245,197,24,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginRight: 6 }}>{club.name}</div>
                    <Badge variant="blue">{club.category}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: '#A0A0A0', marginBottom: 11, lineHeight: 1.5 }}>{club.description || 'Join and explore activities!'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#555' }}>{club.members?.length || 0} members</span>
                    {applied[club._id]
                      ? <Badge variant="green">Applied ✓</Badge>
                      : <GoldButton size="sm" onClick={() => applyToClub(club)}>Apply →</GoldButton>
                    }
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Notifications */}
        <GlassCard style={{ padding: '20px 20px', height: 'fit-content' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Notifications</h2>
          {ST_NOTIFS.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 11, marginBottom: 15, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${n.color}14`, border: `1px solid ${n.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: n.color, flexShrink: 0 }}>{n.icon}</div>
              <div>
                <div style={{ fontSize: 12, color: '#ddd', lineHeight: 1.45 }}>{n.text}</div>
                <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </AppShell>
  );
}
