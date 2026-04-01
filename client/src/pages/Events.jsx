import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import Badge     from '../components/Badge';
import { GoldButton } from '../components/Buttons';

const CATEGORIES = ['Workshop','Showcase','Networking','Social','Talk','Outing','Performance','Competition'];
const CAT_V = { Workshop:'blue', Showcase:'gold', Networking:'purple', Social:'green', Talk:'amber', Outing:'green', Performance:'purple', Competition:'red' };
const STA_V = { Published:'green', Draft:'gray', Ongoing:'amber' };

const NAV_MAP = {
  'Super Admin': ['Overview','Clubs','Users','Events','Notifications'],
  'Club Admin':  ['Overview','Members','Events','Chat','Gallery','Settings'],
  'Co-Admin':    ['Overview','Members','Events','Chat','Gallery'],
  'Student':     ['Home','My Clubs','Discover Clubs','Events','Notifications'],
};
const OVERVIEW_ROUTE = {
  'Super Admin': '/superadmin', 'Club Admin': '/clubadmin',
  'Co-Admin': '/coadmin', 'Student': '/student',
};

function EventCard({ ev, canManage, onPublish, onEdit, onRsvp, rsvpState }) {
  const [hover, setHover] = useState(false);
  const pct = Math.min(100, Math.round(((ev.rsvps?.length || 0) / ev.capacity) * 100));

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: hover ? 'rgba(245,197,24,0.05)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${hover ? 'rgba(245,197,24,0.28)' : 'rgba(245,197,24,0.13)'}`,
      borderRadius: 14, padding: '18px 20px',
      transition: 'all 0.18s', transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: hover ? '0 6px 24px rgba(245,197,24,0.08)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 5 }}>{ev.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <Badge variant={STA_V[ev.status] || 'gray'}>{ev.status}</Badge>
            <Badge variant={CAT_V[ev.category] || 'blue'}>{ev.category}</Badge>
            <span style={{ fontSize: 11, color: '#555' }}>· {ev.club}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#A0A0A0' }}>📅 {ev.date} · {ev.time}</div>
        <div style={{ fontSize: 12, color: '#A0A0A0' }}>📍 {ev.location}</div>
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 12, lineHeight: 1.5 }}>{ev.description}</div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: '#A0A0A0' }}>{ev.rsvps?.length || 0} / {ev.capacity} RSVPs</span>
          <span style={{ fontSize: 11, color: pct >= 90 ? '#f87171' : pct >= 70 ? '#D97706' : '#4ade80' }}>{pct}% full</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#F5C518,#D97706)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {canManage ? (
          <>
            <GoldButton size="sm" variant="secondary" onClick={onEdit}>✏ Edit</GoldButton>
            {ev.status === 'Draft' && <GoldButton size="sm" onClick={onPublish}>Publish</GoldButton>}
          </>
        ) : (
          rsvpState === 'going'
            ? <Badge variant="green">✓ Going</Badge>
            : <GoldButton size="sm" onClick={onRsvp}>RSVP →</GoldButton>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [events,    setEvents]    = useState([]);
  const [filter,    setFilter]    = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [search,    setSearch]    = useState('');
  const [rsvps,     setRsvps]     = useState({});
  const [view,      setView]      = useState('grid');

  const canManage = ['Super Admin','Club Admin','Co-Admin'].includes(user.role);
  const navItems  = NAV_MAP[user.role] || NAV_MAP['Student'];

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).catch(console.error);
  }, []);

  async function publishEvent(id) {
    await api.put(`/events/${id}`, { status: 'Published' });
    setEvents(evs => evs.map(e => e._id === id ? { ...e, status: 'Published' } : e));
  }

  async function rsvpEvent(id) {
    try {
      await api.post(`/events/${id}/rsvp`);
      setRsvps(r => ({ ...r, [id]: 'going' }));
      setEvents(evs => evs.map(e => e._id === id ? { ...e, rsvps: [...(e.rsvps || []), user.id] } : e));
    } catch {
      setRsvps(r => ({ ...r, [id]: 'going' }));
    }
  }

  function handleNav(item) {
    if (item === 'Chat')    { navigate('/chat');    return; }
    if (item === 'Gallery') { navigate('/gallery'); return; }
    if (item === 'Events')  return;
    navigate(OVERVIEW_ROUTE[user.role] || '/');
  }

  const filtered = events.filter(ev => {
    const ms = filter === 'All' || ev.status === filter;
    const mc = catFilter === 'All' || ev.category === catFilter;
    const mq = !search || ev.name.toLowerCase().includes(search.toLowerCase()) || ev.club.toLowerCase().includes(search.toLowerCase());
    return ms && mc && mq;
  });

  const statusOpts = ['All','Published','Draft','Ongoing'];

  return (
    <AppShell navItems={navItems} active="Events" onNav={handleNav} user={user} onLogout={logout} title="Events">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 9, padding: '8px 14px 8px 34px', color: '#fff', fontSize: 13, outline: 'none', width: 220 }}
              onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.4)'}
              onBlur={e => e.target.style.border = '1px solid rgba(245,197,24,0.15)'} />
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#555' }}>⌕</span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {statusOpts.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                background: filter === s ? 'rgba(245,197,24,0.14)' : 'rgba(255,255,255,0.04)',
                border: filter === s ? '1px solid rgba(245,197,24,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: filter === s ? '#F5C518' : '#A0A0A0',
                padding: '6px 13px', fontSize: 12, cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
              }}>{s}</button>
            ))}
          </div>

          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 9, padding: '7px 12px', color: catFilter === 'All' ? '#A0A0A0' : '#F5C518', fontSize: 12, outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 9, overflow: 'hidden' }}>
            {['grid','list'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ background: view === v ? 'rgba(245,197,24,0.12)' : 'transparent', border: 'none', color: view === v ? '#F5C518' : '#555', padding: '7px 13px', cursor: 'pointer', fontSize: 13 }}>{v === 'grid' ? '⊞' : '≡'}</button>
            ))}
          </div>
          {canManage && <GoldButton onClick={() => navigate('/events/create')}>+ Create Event</GoldButton>}
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#555', marginBottom: 18 }}>
        Showing <span style={{ color: '#F5C518', fontWeight: 600 }}>{filtered.length}</span> of {events.length} events
      </div>

      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map(ev => (
            <EventCard key={ev._id} ev={ev}
              canManage={canManage}
              onPublish={() => publishEvent(ev._id)}
              onEdit={() => navigate(`/events/${ev._id}/edit`)}
              onRsvp={() => rsvpEvent(ev._id)}
              rsvpState={rsvps[ev._id]} />
          ))}
        </div>
      )}

      {view === 'list' && (
        <GlassCard style={{ padding: '0 0 4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(245,197,24,0.1)' }}>
                {['Event','Club','Date & Time','Location','Category','Status','RSVPs',''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: '#F5C518', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,197,24,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px', color: '#fff', fontSize: 13, fontWeight: 600, maxWidth: 200 }}>{ev.name}</td>
                  <td style={{ padding: '13px 16px', color: '#A0A0A0', fontSize: 12 }}>{ev.club}</td>
                  <td style={{ padding: '13px 16px', color: '#A0A0A0', fontSize: 12, whiteSpace: 'nowrap' }}>{ev.date} · {ev.time}</td>
                  <td style={{ padding: '13px 16px', color: '#A0A0A0', fontSize: 12 }}>{ev.location}</td>
                  <td style={{ padding: '13px 16px' }}><Badge variant={CAT_V[ev.category] || 'blue'}>{ev.category}</Badge></td>
                  <td style={{ padding: '13px 16px' }}><Badge variant={STA_V[ev.status] || 'gray'}>{ev.status}</Badge></td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${Math.min(100,Math.round((ev.rsvps?.length||0)/ev.capacity*100))}%`, background: 'linear-gradient(90deg,#F5C518,#D97706)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#A0A0A0' }}>{ev.rsvps?.length||0}/{ev.capacity}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {canManage ? (
                      <div style={{ display: 'flex', gap: 7 }}>
                        <GoldButton size="sm" variant="secondary" onClick={() => navigate(`/events/${ev._id}/edit`)}>Edit</GoldButton>
                        {ev.status === 'Draft' && <GoldButton size="sm" onClick={() => publishEvent(ev._id)}>Publish</GoldButton>}
                      </div>
                    ) : (
                      rsvps[ev._id] === 'going'
                        ? <Badge variant="green">Going ✓</Badge>
                        : <GoldButton size="sm" onClick={() => rsvpEvent(ev._id)}>RSVP</GoldButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◆</div>
          <div style={{ fontSize: 15, color: '#555' }}>No events match your filters.</div>
        </div>
      )}
    </AppShell>
  );
}
