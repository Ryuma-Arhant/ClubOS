import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Orbs      from '../components/Orbs';
import GlassCard from '../components/GlassCard';
import { BADGE_MAP } from '../components/Badge';

const DEMO = [
  { label: 'Super Admin', email: 'superadmin@uni.edu', variant: 'gold' },
  { label: 'Club Admin',  email: 'clubadmin@uni.edu',  variant: 'amber' },
  { label: 'Co-Admin',    email: 'coadmin@uni.edu',    variant: 'blue' },
  { label: 'Student',     email: 'student@uni.edu',    variant: 'purple' },
];

const SCREEN_ROUTE = {
  superadmin: '/superadmin',
  clubadmin:  '/clubadmin',
  coadmin:    '/coadmin',
  student:    '/student',
};

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [epFocus,  setEpFocus]  = useState(false);
  const [pwFocus,  setPwFocus]  = useState(false);

  const inp = focused => ({
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${focused ? 'rgba(245,197,24,0.5)' : 'rgba(245,197,24,0.15)'}`,
    borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', transition: 'border 0.2s',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(SCREEN_ROUTE[user.screen] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top left,rgba(245,197,24,0.09) 0%,#0a0a0a 55%,rgba(217,119,6,0.06) 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      <Orbs />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, margin: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 13, marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24, color: '#000', boxShadow: '0 0 28px rgba(245,197,24,0.3)' }}>C</div>
            <span style={{ fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: 0.3 }}>ClubOS</span>
          </div>
          <div style={{ fontSize: 11, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase' }}>Campus Management Portal</div>
        </div>

        <GlassCard style={{ padding: '36px 32px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 5 }}>Welcome Back</h1>
          <p style={{ color: '#A0A0A0', fontSize: 13, marginBottom: 26 }}>Sign in to your university portal</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 9, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#F5C518', fontSize: 11, fontWeight: 600, marginBottom: 7, letterSpacing: 0.7, textTransform: 'uppercase' }}>Email Address</label>
              <input type="email" placeholder="you@university.edu"
                value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                onFocus={() => setEpFocus(true)} onBlur={() => setEpFocus(false)}
                style={inp(epFocus)} />
            </div>
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: 'block', color: '#F5C518', fontSize: 11, fontWeight: 600, marginBottom: 7, letterSpacing: 0.7, textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  onFocus={() => setPwFocus(true)} onBlur={() => setPwFocus(false)}
                  style={{ ...inp(pwFocus), paddingRight: 46 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 15, padding: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F5C518'}
                  onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                  {showPw ? '○' : '●'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 11, fontWeight: 700, fontSize: 15, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg,#F5C518,#D97706)', color: '#000',
              boxShadow: '0 4px 20px rgba(245,197,24,0.25)', transition: 'opacity 0.18s,transform 0.18s', letterSpacing: 0.3,
              opacity: loading ? 0.7 : 1,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              {loading ? '···' : 'Sign In →'}
            </button>
          </form>
        </GlassCard>

        <div style={{ marginTop: 20 }}>
          <div style={{ textAlign: 'center', color: '#444', fontSize: 11, marginBottom: 12, letterSpacing: 0.5 }}>QUICK DEMO — click to autofill</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {DEMO.map(r => (
              <button key={r.label} onClick={() => { setEmail(r.email); setPassword('password123'); setError(''); }} style={{
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${BADGE_MAP[r.variant].br}`,
                borderRadius: 8, padding: '5px 12px', fontSize: 11, color: BADGE_MAP[r.variant].color, cursor: 'pointer',
                fontWeight: 600, transition: 'all 0.18s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                {r.label}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, color: '#3a3a3a', fontSize: 11, lineHeight: 1.7 }}>
            Password for all demo accounts: <span style={{ color: 'rgba(245,197,24,0.5)' }}>password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
