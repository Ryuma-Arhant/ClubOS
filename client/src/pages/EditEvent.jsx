import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import { GoldButton } from '../components/Buttons';

const CATEGORIES = ['Workshop','Showcase','Networking','Social','Talk','Outing','Performance','Competition'];
const CLUBS_LIST  = ['CS Club','Photography Society','Environmental Club','Music Ensemble','Chess Club','Drama Society','Debate Union'];

const NAV_MAP = {
  'Super Admin': ['Overview','Clubs','Users','Events','Notifications'],
  'Club Admin':  ['Overview','Members','Events','Chat','Gallery','Settings'],
  'Co-Admin':    ['Overview','Members','Events','Chat','Gallery'],
};
const OVERVIEW_ROUTE = {
  'Super Admin': '/superadmin', 'Club Admin': '/clubadmin', 'Co-Admin': '/coadmin',
};

export default function EditEvent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form,    setForm]    = useState(null);
  const [errors,  setErrors]  = useState({});
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(r => {
      const ev = r.data.find(e => e._id === id);
      if (ev) {
        setForm({
          name:        ev.name        || '',
          club:        ev.club        || '',
          date:        ev.date        || '',
          time:        ev.time        || '',
          location:    ev.location    || '',
          category:    ev.category    || 'Workshop',
          capacity:    String(ev.capacity || ''),
          description: ev.description || '',
          status:      ev.status      || 'Draft',
        });
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: undefined })); }

  function validate() {
    const e = {};
    if (!form.name.trim())     e.name     = 'Event name is required.';
    if (!form.date)            e.date     = 'Date is required.';
    if (!form.time)            e.time     = 'Time is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) e.capacity = 'Enter a valid capacity.';
    if (user.role === 'Super Admin' && !form.club) e.club = 'Select a club.';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await api.put(`/events/${id}`, { ...form, capacity: Number(form.capacity) });
      setSaved(true);
      setTimeout(() => navigate('/events'), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleNav(item) {
    if (item === 'Events')   navigate('/events');
    if (item === 'Chat')     navigate('/chat');
    if (item === 'Gallery')  navigate('/gallery');
    if (item === 'Overview') navigate(OVERVIEW_ROUTE[user.role] || '/');
  }

  const navItems = NAV_MAP[user.role] || NAV_MAP['Club Admin'];
  const label = { display:'block', color:'#F5C518', fontSize:11, fontWeight:600, marginBottom:7, letterSpacing:0.6, textTransform:'uppercase' };
  const inp = hasErr => ({
    width:'100%', background:'rgba(255,255,255,0.06)',
    border:`1px solid ${hasErr ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`,
    borderRadius:10, padding:'11px 14px', color:'#fff', fontSize:13, outline:'none', transition:'border 0.2s',
  });
  const errStyle = { fontSize:11, color:'#f87171', marginTop:5 };

  if (saved) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a', fontFamily:"'Plus Jakarta Sans',sans-serif", flexDirection:'column', gap:16 }}>
      <div style={{ width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,#F5C518,#D97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 0 40px rgba(245,197,24,0.3)' }}>✓</div>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>Event Updated!</div>
      <div style={{ fontSize:13, color:'#A0A0A0' }}>Redirecting to Events…</div>
    </div>
  );

  if (loading || !form) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a', color:'#A0A0A0', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      Loading event…
    </div>
  );

  return (
    <AppShell navItems={navItems} active="Events" onNav={handleNav} user={user} onLogout={logout} title="Edit Event">
      <div style={{ maxWidth:780, margin:'0 auto' }}>
        <button onClick={() => navigate('/events')} style={{ background:'none', border:'1px solid rgba(245,197,24,0.18)', borderRadius:8, color:'#A0A0A0', cursor:'pointer', padding:'6px 14px', fontSize:12, fontWeight:500, marginBottom:22, display:'flex', alignItems:'center', gap:6 }}>
          ← Back to Events
        </button>

        <GlassCard style={{ padding:'32px 36px' }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6 }}>Edit Event</h2>
          <p style={{ fontSize:13, color:'#A0A0A0', marginBottom:28 }}>Update the event details below.</p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

            <div style={{ gridColumn:'1/-1' }}>
              <label style={label}>Event Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Spring Hackathon 2026"
                style={inp(errors.name)}
                onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
                onBlur={e => e.target.style.border = `1px solid ${errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`} />
              {errors.name && <div style={errStyle}>{errors.name}</div>}
            </div>

            {user.role === 'Super Admin' && (
              <div>
                <label style={label}>Club *</label>
                <select value={form.club} onChange={e => set('club', e.target.value)} style={{ ...inp(errors.club), cursor:'pointer' }}>
                  <option value="">Select a club…</option>
                  {CLUBS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.club && <div style={errStyle}>{errors.club}</div>}
              </div>
            )}

            <div>
              <label style={label}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inp(false), cursor:'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={label}>Date *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                style={{ ...inp(errors.date), colorScheme:'dark' }}
                onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
                onBlur={e => e.target.style.border = `1px solid ${errors.date ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`} />
              {errors.date && <div style={errStyle}>{errors.date}</div>}
            </div>

            <div>
              <label style={label}>Time *</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)}
                style={{ ...inp(errors.time), colorScheme:'dark' }}
                onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
                onBlur={e => e.target.style.border = `1px solid ${errors.time ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`} />
              {errors.time && <div style={errStyle}>{errors.time}</div>}
            </div>

            <div>
              <label style={label}>Location *</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Main Auditorium"
                style={inp(errors.location)}
                onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
                onBlur={e => e.target.style.border = `1px solid ${errors.location ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`} />
              {errors.location && <div style={errStyle}>{errors.location}</div>}
            </div>

            <div>
              <label style={label}>Capacity *</label>
              <input type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="e.g. 80"
                style={inp(errors.capacity)}
                onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
                onBlur={e => e.target.style.border = `1px solid ${errors.capacity ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`} />
              {errors.capacity && <div style={errStyle}>{errors.capacity}</div>}
            </div>

            <div style={{ gridColumn:'1/-1' }}>
              <label style={label}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe what attendees can expect…"
                rows={4}
                style={{ ...inp(false), resize:'vertical', lineHeight:1.6 }} />
            </div>

            <div style={{ gridColumn:'1/-1' }}>
              <label style={label}>Status</label>
              <div style={{ display:'flex', gap:10 }}>
                {['Draft','Published'].map(s => (
                  <div key={s} onClick={() => set('status', s)} style={{
                    display:'flex', alignItems:'center', gap:9, padding:'10px 16px', borderRadius:10, cursor:'pointer',
                    background: form.status === s ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.status === s ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    transition:'all 0.15s',
                  }}>
                    <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${form.status === s ? '#F5C518' : '#555'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {form.status === s && <div style={{ width:6, height:6, borderRadius:'50%', background:'#F5C518' }} />}
                    </div>
                    <span style={{ fontSize:13, color: form.status === s ? '#fff' : '#A0A0A0', fontWeight: form.status === s ? 600 : 400 }}>{s}</span>
                    <span style={{ fontSize:11, color:'#555' }}>{s === 'Draft' ? '— save privately' : '— visible to members'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:12, marginTop:28, paddingTop:22, borderTop:'1px solid rgba(245,197,24,0.08)' }}>
            <GoldButton size="lg" onClick={handleSave} style={{ opacity: saving ? 0.7 : 1 }}>
              {saving ? '···' : '💾 Save Changes'}
            </GoldButton>
            <GoldButton size="lg" variant="secondary" onClick={() => navigate('/events')}>Cancel</GoldButton>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
