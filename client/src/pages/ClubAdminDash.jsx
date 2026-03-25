import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import Badge     from '../components/Badge';
import StatCard  from '../components/StatCard';
import CapBar    from '../components/CapBar';
import { GoldButton, DangerButton } from '../components/Buttons';

const evVariant = s => s === 'Published' ? 'green' : s === 'Draft' ? 'gray' : 'amber';

function ClubBanner({ name }) {
  return (
    <div style={{ height: 148, borderRadius: 16, marginBottom: 22, background: 'linear-gradient(135deg,rgba(245,197,24,0.12) 0%,rgba(0,0,0,0.7) 100%)', border: '1px solid rgba(245,197,24,0.18)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(245,197,24,0.04) 0,rgba(245,197,24,0.04) 1px,transparent 0,transparent 50%)', backgroundSize: '14px 14px' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px 24px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#A0A0A0', marginTop: 3 }}>Computer Science Department · Founded 2019</div>
      </div>
    </div>
  );
}

export default function ClubAdminDash() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [clubs,  setClubs]  = useState([]);
  const [apps,   setApps]   = useState([]);
  const [nav,    setNav]    = useState('Overview');
  const navItems = ['Overview', 'Members', 'Events', 'Chat', 'Gallery', 'Settings'];

  useEffect(() => {
    Promise.all([api.get('/events'), api.get('/clubs')]).then(([evRes, clRes]) => {
      setEvents(evRes.data.slice(0, 3));
      const csClub = clRes.data.find(c => c.name === 'Computer Science Club');
      if (csClub) setApps(csClub.applications?.filter(a => a.status === 'pending') || []);
      setClubs(clRes.data);
    }).catch(console.error);
  }, []);

  async function handleApp(clubId, appId, status) {
    await api.put(`/clubs/${clubId}/applications/${appId}`, { status });
    setApps(p => p.filter(a => a._id !== appId));
  }

  function handleNav(item) {
    if (item === 'Chat')    { navigate('/chat');    return; }
    if (item === 'Gallery') { navigate('/gallery'); return; }
    if (item === 'Events')  { navigate('/events');  return; }
    setNav(item);
  }

  const csClub = clubs.find(c => c.name === 'Computer Science Club');

  return (
    <AppShell navItems={navItems} active={nav} onNav={handleNav} user={user} onLogout={logout} title="Club Overview">
      <ClubBanner name="CS Club — Computer Science Society" />

      <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
        <StatCard label="Total Members"        value={String(csClub?.members?.length || 142)} sub="+12 this month" />
        <StatCard label="Pending Applications" value={String(apps.length)} sub="Review required" accent="top" />
        <StatCard label="Active Events"        value={String(events.filter(e => e.status !== 'Draft').length)} sub="2 upcoming" />
        <StatCard label="Gallery Photos"       value="234" sub="8 albums" />
      </div>

      {/* ── OVERVIEW ── */}
      {nav === 'Overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

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
                    <div style={{ fontSize: 11, color: '#A0A0A0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <GoldButton size="sm" onClick={() => csClub && handleApp(csClub._id, m._id, 'approved')}>Accept</GoldButton>
                    <DangerButton size="sm" onClick={() => csClub && handleApp(csClub._id, m._id, 'rejected')}>Reject</DangerButton>
                  </div>
                </div>
              ))}
            </GlassCard>

            <GlassCard style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Upcoming Events</h2>
                <GoldButton size="sm" onClick={() => navigate('/events/create')}>+ Create</GoldButton>
              </div>
              {events.map(ev => (
                <div key={ev._id} style={{ padding: '13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginRight: 8 }}>{ev.name}</div>
                    <Badge variant={evVariant(ev.status)}>{ev.status}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: '#A0A0A0', marginBottom: 9 }}>{ev.date}</div>
                  <CapBar value={ev.rsvps?.length || 0} max={ev.capacity} />
                </div>
              ))}
            </GlassCard>
          </div>

          <GlassCard style={{ padding: '18px 22px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
              <GoldButton size="lg" onClick={() => navigate('/events/create')}>⚡ Create Event</GoldButton>
              <GoldButton size="lg">✉ Invite Members</GoldButton>
              <GoldButton size="lg" onClick={() => navigate('/gallery')}>🖼 Upload Photos</GoldButton>
              <GoldButton size="lg" variant="secondary" onClick={() => navigate('/chat')}>💬 Open Club Chat</GoldButton>
            </div>
          </GlassCard>
        </>
      )}

      {/* ── MEMBERS ── */}
      {nav === 'Members' && (
        <GlassCard style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
              Club Members ({csClub?.members?.length || 0})
            </h2>
            <Badge variant="amber">{apps.length} pending applications</Badge>
          </div>

          {apps.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: '#F5C518', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Pending Applications</div>
              {apps.map(m => (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#F5C518', fontSize: 14, flexShrink: 0 }}>
                    {(m.name || '?')[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#A0A0A0' }}>{m.email} · <span style={{ color: '#D97706' }}>Pending</span></div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <GoldButton size="sm" onClick={() => csClub && handleApp(csClub._id, m._id, 'approved')}>Accept</GoldButton>
                    <DangerButton size="sm" onClick={() => csClub && handleApp(csClub._id, m._id, 'rejected')}>Reject</DangerButton>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 18, marginBottom: 10, borderTop: '1px solid rgba(245,197,24,0.08)', paddingTop: 18 }} />
            </>
          )}

          <div style={{ fontSize: 11, color: '#F5C518', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Active Members</div>
          {(csClub?.members || []).length === 0 && (
            <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No members yet</div>
          )}
          {(csClub?.members || []).map((m, i) => {
            const name  = typeof m === 'object' ? m.name  : 'Member';
            const email = typeof m === 'object' ? m.email : '';
            const id    = typeof m === 'object' ? m._id   : m;
            return (
              <div key={id || i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
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

      {/* ── SETTINGS ── */}
      {nav === 'Settings' && (
        <GlassCard style={{ padding: '28px 32px', maxWidth: 560 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 22 }}>Club Settings</h2>
          {[
            { label: 'Club Name',        value: 'Computer Science Club',     type: 'text' },
            { label: 'Department',       value: 'Computer Science',           type: 'text' },
            { label: 'Founded Year',     value: '2019',                       type: 'number' },
          ].map(({ label, value, type }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#F5C518', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 7 }}>{label}</label>
              <input defaultValue={value} type={type} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 13, outline: 'none' }} />
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <GoldButton size="lg">Save Changes</GoldButton>
          </div>
        </GlassCard>
      )}
    </AppShell>
  );
}
