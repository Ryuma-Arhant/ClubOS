import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import Badge     from '../components/Badge';
import StatCard  from '../components/StatCard';
import { GoldButton, DangerButton } from '../components/Buttons';

const CHAT_MSGS = [
  { sender: 'Alex R.', text: 'Can everyone confirm attendance for Saturday?', time: '10:24', isMe: false },
  { sender: 'Maya J.', text: "Yes! I'll be there 👍",                          time: '10:26', isMe: false },
  { sender: 'You',     text: 'Confirmed. Also sending the slides tonight.',    time: '10:28', isMe: true },
];

export default function CoAdminDash() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [apps,   setApps]   = useState([]);
  const [clubs,  setClubs]  = useState([]);
  const [nav,    setNav]    = useState('Overview');
  const navItems = ['Overview', 'Members', 'Events', 'Chat', 'Gallery'];

  useEffect(() => {
    Promise.all([api.get('/events'), api.get('/clubs')]).then(([evRes, clRes]) => {
      setEvents(evRes.data.slice(0, 2));
      const csClub = clRes.data.find(c => c.name === 'Computer Science Club');
      if (csClub) {
        setApps(csClub.applications?.filter(a => a.status === 'pending').slice(0, 2) || []);
        setClubs([csClub]);
      }
    }).catch(console.error);
  }, []);

  async function handleApp(appId, status) {
    const csClub = clubs[0];
    if (!csClub) return;
    await api.put(`/clubs/${csClub._id}/applications/${appId}`, { status });
    setApps(p => p.filter(a => a._id !== appId));
  }

  function handleNav(item) {
    if (item === 'Chat')    { navigate('/chat');    return; }
    if (item === 'Gallery') { navigate('/gallery'); return; }
    if (item === 'Events')  { navigate('/events');  return; }
    setNav(item);
  }

  const csClub = clubs[0];

  return (
    <AppShell navItems={navItems} active={nav} onNav={handleNav} user={user} onLogout={logout} title="Co-Admin Overview">

      <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
        <StatCard label="My Events Created"    value="4" sub="2 this month" />
        <StatCard label="Pending Applications" value={String(apps.length)} sub="Action required" accent="top" />
        <StatCard label="Club Members"         value={String(csClub?.members?.length || 142)} />
        <StatCard label="Open RSVPs"           value={String(events.reduce((a, e) => a + (e.rsvps?.length || 0), 0))} sub="Across 2 events" />
      </div>

      {/* ── OVERVIEW ── */}
      {nav === 'Overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

            <GlassCard style={{ padding: '20px 22px' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Events I Manage</h2>
              {events.map(ev => (
                <div key={ev._id} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 10, marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginRight: 8 }}>{ev.name}</div>
                    <Badge variant={ev.status === 'Published' ? 'green' : 'gray'}>{ev.status}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: '#A0A0A0', marginBottom: 9 }}>{ev.date} · {ev.rsvps?.length || 0}/{ev.capacity} RSVPs</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <GoldButton size="sm" variant="secondary" onClick={() => navigate('/events/create')}>✏ Edit</GoldButton>
                    {ev.status === 'Draft' && <GoldButton size="sm">Publish</GoldButton>}
                  </div>
                </div>
              ))}
            </GlassCard>

            <GlassCard style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Member Applications</h2>
                <Badge variant="amber">{apps.length} pending</Badge>
              </div>
              {apps.length === 0 && <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>All caught up ✓</div>}
              {apps.map(m => (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', fontSize: 14, flexShrink: 0 }}>
                    {(m.name || '?')[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#A0A0A0' }}>{m.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <GoldButton size="sm" onClick={() => handleApp(m._id, 'approved')}>Accept</GoldButton>
                    <DangerButton size="sm" onClick={() => handleApp(m._id, 'rejected')}>Reject</DangerButton>
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>

          <GlassCard style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Club Chat</h2>
                <div style={{ fontSize: 11, color: '#A0A0A0', marginTop: 2 }}>CS Club · 4 members online now</div>
              </div>
              <GoldButton size="sm" onClick={() => navigate('/chat')}>Open Chat →</GoldButton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CHAT_MSGS.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: m.isMe ? 'row-reverse' : 'row', gap: 9, alignItems: 'flex-end' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.isMe ? 'linear-gradient(135deg,#F5C518,#D97706)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: m.isMe ? '#000' : '#888', flexShrink: 0 }}>
                    {m.sender[0]}
                  </div>
                  <div style={{ maxWidth: '65%', background: m.isMe ? 'linear-gradient(135deg,rgba(245,197,24,0.18),rgba(217,119,6,0.14))' : 'rgba(255,255,255,0.05)', border: m.isMe ? '1px solid rgba(245,197,24,0.28)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 12px' }}>
                    {!m.isMe && <div style={{ fontSize: 10, color: '#F5C518', fontWeight: 600, marginBottom: 2 }}>{m.sender}</div>}
                    <div style={{ fontSize: 12, color: '#fff' }}>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}

      {/* ── MEMBERS ── */}
      {nav === 'Members' && (
        <GlassCard style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Club Members ({csClub?.members?.length || 0})</h2>
          </div>

          {(csClub?.members || []).length === 0 && (
            <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No members yet</div>
          )}
          {(csClub?.members || []).map((m, i) => {
            const name  = typeof m === 'object' ? m.name  : 'Member';
            const email = typeof m === 'object' ? m.email : '';
            const id    = typeof m === 'object' ? m._id   : m;
            return (
              <div key={id || i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', fontSize: 14, flexShrink: 0 }}>
                  {name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#A0A0A0' }}>{email}</div>
                </div>
                <Badge variant="green">Member</Badge>
              </div>
            );
          })}
        </GlassCard>
      )}
    </AppShell>
  );
}
