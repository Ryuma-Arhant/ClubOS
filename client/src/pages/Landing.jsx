import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BADGE_MAP } from '../components/Badge';

/* ── Icons ─────────────────────────────────────────── */
const Icon = ({ d, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  clubs:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  chat:     ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  image:    ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M21 15l-5-5L5 21'],
  shield:   ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  check:    ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4L12 14.01l-3-3'],
  arrow:    ['M5 12h14', 'M12 5l7 7-7 7'],
  tick:     ['M20 6L9 17l-5-5'],
  plus:     ['M12 5v14', 'M5 12h14'],
};

/* ── Content ───────────────────────────────────────── */
const CATEGORIES = ['Tech', 'Robotics', 'Debate', 'Photography', 'Music', 'Drama', 'Sports', 'Literature', 'Entrepreneurship', 'Design', 'Dance', 'Coding', 'Film', 'Astronomy'];

const FEATURES = [
  { icon: I.clubs,    title: 'Club management',    text: 'Register clubs, review applications and keep every member roster organised in one place.', wide: true },
  { icon: I.calendar, title: 'Events & capacity',  text: 'Publish events with seat limits and let students RSVP in a click.' },
  { icon: I.chat,     title: 'Chat & direct messages', text: 'Club channels and DMs keep leaders and members in sync.' },
  { icon: I.image,    title: 'Shared galleries',   text: 'Albums from every meetup, workshop and fest, for the whole campus.' },
  { icon: I.check,    title: 'Approval workflows', text: 'New clubs and join requests move through a clear review queue.' },
  { icon: I.shield,   title: 'Role-based access',  text: 'Four purpose-built dashboards with permissions handled for you, so everyone sees exactly what they need.', full: true },
];

const ROLES = [
  { label: 'Super Admin', variant: 'gold',   title: 'Govern the whole campus',
    points: ['Approve or reject new club registrations', 'Manage users and assign roles', 'Oversee every club, event and gallery'] },
  { label: 'Club Admin',  variant: 'amber',  title: 'Run your club, end to end',
    points: ['Accept member applications', 'Create and edit events with seat limits', 'Post albums and chat with members'] },
  { label: 'Co-Admin',    variant: 'blue',   title: 'Share the load',
    points: ['Schedule and update club events', 'Coordinate members in club chat', 'Keep galleries up to date'] },
  { label: 'Student',     variant: 'purple', title: 'Find your people',
    points: ['Browse clubs and apply to join', 'RSVP to events across campus', 'Message clubs and relive moments in galleries'] },
];

const STEPS = [
  { title: 'Sign in',        text: 'Log in with your university account. ClubOS opens the dashboard for your role.' },
  { title: 'Join or create', text: 'Apply to clubs you love, or register a new one for admin approval.' },
  { title: 'Get involved',   text: 'Attend events, chat with members and share photos from every meetup.' },
];

const FAQ = [
  { q: 'Who can use ClubOS?', a: 'Everyone on campus: students, club leaders and university administrators. Each person gets a dashboard tailored to their role.' },
  { q: 'How does a new club get listed?', a: 'Submit a registration with the club details. A Super Admin reviews it, and once approved the club goes live for students to join.' },
  { q: 'Can I be part of more than one club?', a: 'Yes. Apply to as many clubs as you like and follow all of their events and galleries from one account.' },
  { q: 'Do event seat limits update automatically?', a: 'Yes. Capacity updates as students RSVP, so organisers always know how many seats are left.' },
];

/* ── Styles ────────────────────────────────────────── */
const CSS = `
  .lp { height: 100vh; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; background: #08080a; color: #fff; }
  .lp-c { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
  .lp-grad { background: linear-gradient(120deg,#FDE68A 0%,#F5C518 35%,#D97706 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }

  .lp-nav { position: sticky; top: 16px; z-index: 20; margin: 16px auto 0; max-width: 1080px; width: calc(100% - 32px);
    display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 10px 20px; border-radius: 999px;
    background: rgba(18,18,20,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 40px rgba(0,0,0,0.35); }
  .lp-links { display: flex; gap: 6px; }
  .lp-links a { color: #a1a1aa; font-size: 14px; font-weight: 500; padding: 8px 14px; border-radius: 999px; transition: color .2s, background .2s; }
  .lp-links a:hover { color: #fff; background: rgba(255,255,255,0.06); }

  .lp-btn { display: inline-flex; align-items: center; gap: 8px; border: none; cursor: pointer; font-weight: 700; font-size: 15px;
    border-radius: 999px; padding: 14px 26px; transition: transform .2s, box-shadow .2s, background .2s; }
  .lp-btn svg { transition: transform .2s; }
  .lp-btn:hover svg { transform: translateX(3px); }
  .lp-btn-p { background: linear-gradient(135deg,#F5C518,#D97706); color: #0a0a0a; box-shadow: 0 8px 30px rgba(245,197,24,0.25), inset 0 1px 0 rgba(255,255,255,0.35); }
  .lp-btn-p:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(245,197,24,0.35), inset 0 1px 0 rgba(255,255,255,0.35); }
  .lp-btn-g { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.12); }
  .lp-btn-g:hover { background: rgba(255,255,255,0.09); transform: translateY(-2px); }
  .lp-btn-sm { padding: 10px 18px; font-size: 14px; }

  .lp-hero { position: relative; text-align: center; padding: 120px 0 80px; }
  .lp-gridbg { position: absolute; inset: -80px 0 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 56px 56px; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%);
    mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%); }
  .lp-glow { position: absolute; left: 50%; top: -120px; transform: translateX(-50%); width: 900px; height: 520px; pointer-events: none;
    background: radial-gradient(closest-side, rgba(245,197,24,0.22), rgba(217,119,6,0.08) 55%, transparent); filter: blur(20px); }
  .lp-h1 { font-size: 80px; line-height: 1.02; font-weight: 800; letter-spacing: -2.8px; margin: 0 auto 24px; max-width: 960px; }
  .lp-sub { color: #a1a1aa; font-size: 19px; line-height: 1.65; max-width: 640px; margin: 0 auto 40px; }
  .lp-pill { display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px; border-radius: 999px; margin-bottom: 30px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); font-size: 13px; color: #d4d4d8; }
  .lp-pill b { background: linear-gradient(135deg,#F5C518,#D97706); color: #000; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 999px; }

  .lp-marquee { position: relative; overflow: hidden; margin-top: 80px;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent); }
  .lp-track { display: flex; gap: 12px; width: max-content; animation: lp-scroll 40s linear infinite; }
  .lp-chip { padding: 10px 20px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.025); color: #a1a1aa; font-size: 14px; font-weight: 500; white-space: nowrap; }
  @keyframes lp-scroll { to { transform: translateX(-50%); } }

  .lp-sec { padding: 120px 0; position: relative; }
  .lp-eyebrow { display: inline-block; color: #F5C518; font-size: 13px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; margin-bottom: 16px; }
  .lp-h2 { font-size: 48px; font-weight: 800; letter-spacing: -1.4px; line-height: 1.1; margin-bottom: 18px; }
  .lp-lead { color: #a1a1aa; font-size: 17px; line-height: 1.7; max-width: 580px; }

  .lp-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 64px; }
  .lp-tile { position: relative; overflow: hidden; padding: 32px; border-radius: 24px; min-height: 240px;
    background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015)); border: 1px solid rgba(255,255,255,0.08);
    transition: border-color .3s, transform .3s; display: flex; flex-direction: column; justify-content: flex-end; }
  .lp-tile::before { content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity .4s;
    background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 0%), rgba(245,197,24,0.12), transparent 45%); }
  .lp-tile:hover { border-color: rgba(245,197,24,0.3); transform: translateY(-3px); }
  .lp-tile:hover::before { opacity: 1; }
  .lp-tile.wide { grid-column: span 2; }
  .lp-tile.full { grid-column: 1 / -1; min-height: 200px; }
  .lp-ico { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: auto;
    color: #F5C518; background: rgba(245,197,24,0.1); border: 1px solid rgba(245,197,24,0.22); box-shadow: 0 0 30px rgba(245,197,24,0.12); }
  .lp-tile h3 { font-size: 20px; font-weight: 700; margin: 40px 0 8px; letter-spacing: -0.3px; }
  .lp-tile p { color: #a1a1aa; font-size: 15px; line-height: 1.6; max-width: 440px; }

  .lp-roles { display: grid; grid-template-columns: 340px 1fr; gap: 24px; margin-top: 56px; }
  .lp-rtab { width: 100%; text-align: left; display: flex; align-items: center; gap: 14px; padding: 18px 20px; border-radius: 16px; cursor: pointer;
    background: transparent; border: 1px solid transparent; color: #a1a1aa; font-size: 16px; font-weight: 600; transition: all .2s; margin-bottom: 6px; }
  .lp-rtab:hover { color: #fff; background: rgba(255,255,255,0.03); }
  .lp-rtab.on { color: #fff; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
  .lp-rpanel { border-radius: 24px; padding: 48px; background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); animation: lp-fade .35s ease; }
  .lp-rpanel li { list-style: none; display: flex; gap: 14px; align-items: flex-start; color: #d4d4d8; font-size: 17px; line-height: 1.5; padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.06); }
  @keyframes lp-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .lp-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 64px; counter-reset: s; }
  .lp-step { padding: 32px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); position: relative; }
  .lp-step-n { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px;
    background: linear-gradient(135deg,#F5C518,#D97706); color: #000; margin-bottom: 28px; }
  .lp-step h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .lp-step p { color: #a1a1aa; font-size: 15px; line-height: 1.6; }

  .lp-faq { max-width: 760px; margin: 56px auto 0; }
  .lp-q { border-bottom: 1px solid rgba(255,255,255,0.08); }
  .lp-q button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px 0; background: none; border: none;
    color: #fff; font-size: 17px; font-weight: 600; cursor: pointer; text-align: left; }
  .lp-q button svg { flex-shrink: 0; color: #F5C518; transition: transform .25s; }
  .lp-q.open button svg { transform: rotate(45deg); }
  .lp-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
  .lp-q.open .lp-a { grid-template-rows: 1fr; }
  .lp-a > div { overflow: hidden; color: #a1a1aa; font-size: 15px; line-height: 1.7; }
  .lp-q.open .lp-a > div { padding-bottom: 24px; }

  .lp-cta { position: relative; overflow: hidden; text-align: center; padding: 96px 32px; border-radius: 32px;
    background: radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.25), transparent 60%), #111113; border: 1px solid rgba(245,197,24,0.2); }

  .lp-foot { border-top: 1px solid rgba(255,255,255,0.06); padding: 56px 0 40px; }
  .lp-foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
  .lp-foot h4 { font-size: 13px; color: #fff; font-weight: 700; margin-bottom: 16px; }
  .lp-foot a { display: block; color: #71717a; font-size: 14px; margin-bottom: 10px; transition: color .2s; cursor: pointer; }
  .lp-foot a:hover { color: #F5C518; }

  .lp-reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
  .lp-reveal.in { opacity: 1; transform: none; }

  @media (max-width: 960px) {
    .lp-h1 { font-size: 56px; letter-spacing: -1.8px; }
    .lp-h2 { font-size: 38px; }
    .lp-bento, .lp-steps { grid-template-columns: 1fr 1fr; }
    .lp-roles { grid-template-columns: 1fr; }
    .lp-rtabs { display: flex; gap: 8px; overflow-x: auto; }
    .lp-rtab { width: auto; white-space: nowrap; margin: 0; }
  }
  @media (max-width: 640px) {
    .lp-c { padding: 0 16px; }
    .lp-links { display: none; }
    .lp-hero { padding: 80px 0 56px; }
    .lp-h1 { font-size: 42px; letter-spacing: -1.2px; }
    .lp-sub { font-size: 16px; }
    .lp-sec { padding: 80px 0; }
    .lp-h2 { font-size: 32px; }
    .lp-bento, .lp-steps, .lp-foot-grid { grid-template-columns: 1fr; }
    .lp-tile.wide, .lp-tile.full { grid-column: auto; }
    .lp-rpanel { padding: 28px; }
    .lp-cta { padding: 64px 20px; border-radius: 24px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lp-track { animation: none; }
    .lp-reveal { opacity: 1; transform: none; transition: none; }
  }
`;

/* ── Helpers ───────────────────────────────────────── */
function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#F5C518,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17, color: '#000' }}>C</div>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.2 }}>ClubOS</span>
    </div>
  );
}

function useReveal(root) {
  useEffect(() => {
    const els = root.current?.querySelectorAll('.lp-reveal') || [];
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { root: root.current, threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [root]);
}

function trackMouse(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/* ── Page ──────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const rootRef  = useRef(null);
  const [role, setRole] = useState(0);
  const [open, setOpen] = useState(0);
  useReveal(rootRef);

  const toLogin = () => navigate('/login');
  const jump = id => e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const active = ROLES[role];

  return (
    <div className="lp" ref={rootRef}>
      <style>{CSS}</style>

      {/* Nav */}
      <header className="lp-nav">
        <Logo />
        <nav className="lp-links">
          <a href="#features" onClick={jump('features')}>Features</a>
          <a href="#roles"    onClick={jump('roles')}>Roles</a>
          <a href="#how"      onClick={jump('how')}>How it works</a>
          <a href="#faq"      onClick={jump('faq')}>FAQ</a>
        </nav>
        <button className="lp-btn lp-btn-p lp-btn-sm" onClick={toLogin}>Sign in</button>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-gridbg" />
        <div className="lp-glow" />
        <div className="lp-c" style={{ position: 'relative' }}>
          <div className="lp-pill"><b>NEW</b> Club chat, events and galleries in one portal</div>
          <h1 className="lp-h1">
            Where campus clubs <span className="lp-grad">come alive.</span>
          </h1>
          <p className="lp-sub">
            ClubOS is the all-in-one platform to run student clubs: registrations, events, messaging and memories, all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="lp-btn lp-btn-p" onClick={toLogin}>Get started <Icon d={I.arrow} size={18} /></button>
            <button className="lp-btn lp-btn-g" onClick={jump('features')}>See how it works</button>
          </div>
        </div>

        <div className="lp-marquee">
          <div className="lp-track">
            {[...CATEGORIES, ...CATEGORIES].map((c, i) => <span key={i} className="lp-chip">{c}</span>)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="lp-sec" style={{ paddingTop: 72 }}>
        <div className="lp-c">
          <div className="lp-reveal" style={{ textAlign: 'center' }}>
            <span className="lp-eyebrow">Features</span>
            <h2 className="lp-h2">Everything your clubs need.<br /><span style={{ color: '#71717a' }}>Nothing they don't.</span></h2>
          </div>
          <div className="lp-bento">
            {FEATURES.map(f => (
              <div key={f.title} className={`lp-tile lp-reveal${f.wide ? ' wide' : ''}${f.full ? ' full' : ''}`} onMouseMove={trackMouse}>
                <div className="lp-ico"><Icon d={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="lp-sec" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.02), transparent)' }}>
        <div className="lp-c">
          <div className="lp-reveal">
            <span className="lp-eyebrow">Built for every role</span>
            <h2 className="lp-h2">One platform, four perspectives.</h2>
            <p className="lp-lead">Everyone gets a dashboard designed around what they actually do.</p>
          </div>
          <div className="lp-roles lp-reveal">
            <div className="lp-rtabs">
              {ROLES.map((r, i) => (
                <button key={r.label} className={`lp-rtab${i === role ? ' on' : ''}`} onClick={() => setRole(i)}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: BADGE_MAP[r.variant].color, boxShadow: i === role ? `0 0 12px ${BADGE_MAP[r.variant].color}` : 'none' }} />
                  {r.label}
                </button>
              ))}
            </div>
            <div key={role} className="lp-rpanel">
              <span style={{ color: BADGE_MAP[active.variant].color, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{active.label}</span>
              <h3 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, margin: '12px 0 28px' }}>{active.title}</h3>
              <ul>
                {active.points.map(p => (
                  <li key={p}>
                    <span style={{ color: BADGE_MAP[active.variant].color, marginTop: 2 }}><Icon d={I.tick} size={20} /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="lp-sec">
        <div className="lp-c">
          <div className="lp-reveal" style={{ textAlign: 'center' }}>
            <span className="lp-eyebrow">How it works</span>
            <h2 className="lp-h2">Up and running in minutes.</h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="lp-step lp-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="lp-step-n">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="lp-sec" style={{ paddingTop: 40 }}>
        <div className="lp-c">
          <div className="lp-reveal" style={{ textAlign: 'center' }}>
            <span className="lp-eyebrow">FAQ</span>
            <h2 className="lp-h2">Questions, answered.</h2>
          </div>
          <div className="lp-faq lp-reveal">
            {FAQ.map((f, i) => (
              <div key={f.q} className={`lp-q${open === i ? ' open' : ''}`}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {f.q}<Icon d={I.plus} size={20} />
                </button>
                <div className="lp-a"><div>{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-sec" style={{ paddingTop: 40 }}>
        <div className="lp-c">
          <div className="lp-cta lp-reveal">
            <div className="lp-gridbg" style={{ inset: 0 }} />
            <div style={{ position: 'relative' }}>
              <h2 className="lp-h2" style={{ maxWidth: 720, margin: '0 auto 18px' }}>Ready to bring your campus <span className="lp-grad">together?</span></h2>
              <p className="lp-lead" style={{ margin: '0 auto 36px' }}>Sign in to manage your clubs, plan your next event and connect with your community.</p>
              <button className="lp-btn lp-btn-p" onClick={toLogin}>Get started now <Icon d={I.arrow} size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-foot">
        <div className="lp-c">
          <div className="lp-foot-grid">
            <div>
              <Logo />
              <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.7, marginTop: 16, maxWidth: 320 }}>The campus club operating system. Run clubs, events and communities from one place.</p>
            </div>
            <div>
              <h4>Product</h4>
              <a onClick={jump('features')}>Features</a>
              <a onClick={jump('roles')}>Roles</a>
              <a onClick={jump('how')}>How it works</a>
            </div>
            <div>
              <h4>Account</h4>
              <a onClick={toLogin}>Sign in</a>
              <a onClick={jump('faq')}>FAQ</a>
            </div>
          </div>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', color: '#52525b', fontSize: 13 }}>
            © {new Date().getFullYear()} ClubOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
