import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import Badge     from '../components/Badge';
import StatCard  from '../components/StatCard';
import { GoldButton, DangerButton } from '../components/Buttons';

const SA_ACTIVITY = [
  { icon: '✓', text: 'CS Club published Tech Showcase event',    time: '2 min ago',  color: '#4ade80' },
  { icon: '✦', text: 'New member joined Drama Society',           time: '18 min ago', color: '#F5C518' },
  { icon: '⊕', text: 'Photography Society submitted application', time: '1 hr ago',   color: '#60a5fa' },
  { icon: '✓', text: 'Blockchain Club approved by admin',         time: '3 hrs ago',  color: '#4ade80' },
  { icon: '✗', text: '"Spam Fan Club" application rejected',      time: '5 hrs ago',  color: '#f87171' },
  { icon: '✦', text: '140 RSVPs recorded for Tech Fair',          time: '6 hrs ago',  color: '#F5C518' },
  { icon: '⊕', text: 'New Co-Admin promoted in CS Club',          time: '8 hrs ago',  color: '#60a5fa' },
  { icon: '✦', text: 'Gallery album uploaded by Photo Society',   time: '1 day ago',  color: '#F5C518' },
];

const ROLE_V  = { 'Super Admin': 'gold', 'Club Admin': 'amber', 'Co-Admin': 'blue', Student: 'purple' };
const sVariant = s => s === 'Active' ? 'green' : s === 'Pending' ? 'amber' : 'gray';

const TH = ({ children }) => (
  <th style={{ textAlign: 'left', padding: '6px 12px 12px', color: '#F5C518', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</th>
);

export default function SuperAdminDash() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [clubs,   setCLubs]  = useState([]);
  const [pending, setPending] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [nav,     setNav]     = useState('Overview');
  const navItems = ['Overview', 'Clubs', 'Users', 'Events', 'Notifications'];

  useEffect(() => {
    Promise.all([api.get('/clubs'), api.get('/users')]).then(([clRes, usRes]) => {
      setCLubs(clRes.data);
      setPending(clRes.data.filter(c => c.status === 'Pending'));
      setUsers(usRes.data);
    }).catch(console.error);
  }, []);

  async function approveClub(id) {
    await api.put(`/clubs/${id}`, { status: 'Active' });
    setCLubs(p => p.map(c => c._id === id ? { ...c, status: 'Active' } : c));
    setPending(p => p.filter(c => c._id !== id));
  }

  async function rejectClub(id) {
    await api.put(`/clubs/${id}`, { status: 'Archived' });
    setCLubs(p => p.map(c => c._id === id ? { ...c, status: 'Archived' } : c));
    setPending(p => p.filter(c => c._id !== id));
  }

  async function deleteClub(id) {
    await api.delete(`/clubs/${id}`);
    setCLubs(p => p.filter(c => c._id !== id));
    setPending(p => p.filter(c => c._id !== id));
  }

  async function deleteUser(id) {
    await api.delete(`/users/${id}`);
    setUsers(p => p.filter(u => u._id !== id));
  }

  function handleNav(item) {
    if (item === 'Events') { navigate('/events'); return; }
    setNav(item);
  }

  const active  = clubs.filter(c => c.status === 'Active');
  const members = clubs.reduce((a, c) => a + (c.members?.length || 0), 0);

  return (
    <AppShell navItems={navItems} active={nav} onNav={handleNav} user={user} onLogout={logout} title="Platform Overview">

      <div style={{ display: 'flex', gap: 14, marginBottom: 26 }}>
        <StatCard label="Total Clubs"       value={String(clubs.length)}  sub="+3 this month" />
        <StatCard label="Active Clubs"      value={String(active.length)} sub={`${clubs.length ? Math.round(active.length / clubs.length * 100) : 0}% of total`} />
        <StatCard label="Pending Approvals" value={String(pending.length)} sub="Awaiting review" accent="top" />
        <StatCard label="Total Users"       value={String(users.length || members + 4)} sub="+28 this week" />
      </div>

      {/* ── OVERVIEW ── */}
      {nav === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 22 }}>
          <div>
            {pending.length > 0 && (
              <GlassCard style={{ padding: '20px 24px', marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Pending Club Approvals</h2>
                  <Badge variant="amber">{pending.length} pending</Badge>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(245,197,24,0.1)' }}>
                      {['Club Name', 'Submitted By', 'Dept', 'Actions'].map(h => <TH key={h}>{h}</TH>)}
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map(club => (
                      <tr key={club._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,197,24,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 10px', color: '#fff', fontSize: 13, fontWeight: 500 }}>{club.name}</td>
                        <td style={{ padding: '12px 10px', color: '#A0A0A0', fontSize: 12 }}>{club.submittedBy || '—'}</td>
                        <td style={{ padding: '12px 10px' }}><Badge variant="blue">{club.department || club.category}</Badge></td>
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', gap: 7 }}>
                            <GoldButton size="sm" onClick={() => approveClub(club._id)}>Approve</GoldButton>
                            <DangerButton size="sm" onClick={() => rejectClub(club._id)}>Reject</DangerButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            )}

            <GlassCard style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>All Clubs</h2>
                <GoldButton size="sm" variant="secondary" onClick={() => setNav('Clubs')}>Manage →</GoldButton>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11 }}>
                {clubs.map(club => (
                  <div key={club._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 12, padding: '14px', cursor: 'pointer', transition: 'all 0.18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,197,24,0.05)'; e.currentTarget.style.borderColor = 'rgba(245,197,24,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(245,197,24,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginRight: 6 }}>{club.name}</div>
                      <Badge variant={sVariant(club.status)}>{club.status}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{club.category}</div>
                    <div style={{ fontSize: 12, color: '#A0A0A0' }}>{club.status === 'Active' ? `${club.members?.length || 0} members` : 'Not yet active'}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard style={{ padding: '20px 22px', height: 'fit-content' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Recent Activity</h2>
            {SA_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, marginBottom: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${a.color}14`, border: `1px solid ${a.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: a.color, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: '#ddd', lineHeight: 1.45 }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: '#444', marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      )}

      {/* ── CLUBS ── */}
      {nav === 'Clubs' && (
        <GlassCard style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>All Clubs ({clubs.length})</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(245,197,24,0.1)' }}>
                {['Name', 'Category', 'Department', 'Status', 'Members', 'Actions'].map(h => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {clubs.map(club => (
                <tr key={club._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,197,24,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px', color: '#fff', fontSize: 13, fontWeight: 500 }}>{club.name}</td>
                  <td style={{ padding: '12px', color: '#A0A0A0', fontSize: 12 }}>{club.category}</td>
                  <td style={{ padding: '12px', color: '#A0A0A0', fontSize: 12 }}>{club.department || '—'}</td>
                  <td style={{ padding: '12px' }}><Badge variant={sVariant(club.status)}>{club.status}</Badge></td>
                  <td style={{ padding: '12px', color: '#A0A0A0', fontSize: 12 }}>{club.members?.length || 0}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 7 }}>
                      {club.status === 'Pending' && (
                        <>
                          <GoldButton size="sm" onClick={() => approveClub(club._id)}>Approve</GoldButton>
                          <DangerButton size="sm" onClick={() => rejectClub(club._id)}>Reject</DangerButton>
                        </>
                      )}
                      {club.status !== 'Pending' && (
                        <DangerButton size="sm" onClick={() => deleteClub(club._id)}>Delete</DangerButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* ── USERS ── */}
      {nav === 'Users' && (
        <GlassCard style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>All Users ({users.length})</h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(245,197,24,0.1)' }}>
                {['Name', 'Email', 'Role', 'Actions'].map(h => <TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,197,24,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#000', flexShrink: 0 }}>{u.name[0]}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#A0A0A0', fontSize: 12 }}>{u.email}</td>
                  <td style={{ padding: '12px' }}><Badge variant={ROLE_V[u.role] || 'gray'}>{u.role}</Badge></td>
                  <td style={{ padding: '12px' }}>
                    {u._id !== user.id && (
                      <DangerButton size="sm" onClick={() => deleteUser(u._id)}>Remove</DangerButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* ── NOTIFICATIONS ── */}
      {nav === 'Notifications' && (
        <GlassCard style={{ padding: '24px 28px', maxWidth: 640 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 22 }}>Platform Notifications</h2>
          {SA_ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${a.color}14`, border: `1px solid ${a.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: a.color, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#ddd', lineHeight: 1.5 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </GlassCard>
      )}
    </AppShell>
  );
}
