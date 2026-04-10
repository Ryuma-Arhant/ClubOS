import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Orbs    from '../components/Orbs';
import Sidebar from '../components/Sidebar';
import { GoldButton } from '../components/Buttons';

const CHAT_MEMBERS = [
  { name: 'Alex Rivera',  role: 'Admin',    online: true,  avatar: 'A' },
  { name: 'Jamie Park',   role: 'Co-Admin', online: true,  avatar: 'J' },
  { name: 'Maya Johnson', role: 'Student',  online: true,  avatar: 'M' },
  { name: 'Jordan Smith', role: 'Student',  online: true,  avatar: 'J' },
  { name: 'Priya Nair',   role: 'Student',  online: false, avatar: 'P' },
  { name: 'Luis Torres',  role: 'Student',  online: false, avatar: 'L' },
];

const NAV_MAP = {
  'Super Admin': ['Overview', 'Clubs', 'Users', 'Events', 'Notifications'],
  'Club Admin':  ['Overview', 'Members', 'Events', 'Chat', 'Gallery', 'Settings'],
  'Co-Admin':    ['Overview', 'Members', 'Events', 'Chat', 'Gallery'],
  'Student':     ['Home', 'My Clubs', 'Discover Clubs', 'Events', 'Notifications'],
};

const OVERVIEW_ROUTE = {
  'Super Admin': '/superadmin',
  'Club Admin':  '/clubadmin',
  'Co-Admin':    '/coadmin',
  'Student':     '/student',
};

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [messages,      setMessages]      = useState([]);
  const [dmMessages,    setDmMessages]    = useState([]);
  const [input,         setInput]         = useState('');
  const [clubId,        setClubId]        = useState(null);
  const [activeChannel, setActiveChannel] = useState('general');
  const [dmLoading,     setDmLoading]     = useState(false);
  const scrollRef  = useRef(null);
  const navItems   = NAV_MAP[user.role] || NAV_MAP['Student'];
  const onlineCount = CHAT_MEMBERS.filter(m => m.online).length;

  useEffect(() => {
    api.get('/clubs').then(r => {
      const cs = r.data.find(c => c.name === 'Computer Science Club');
      if (cs) {
        setClubId(cs._id);
        return api.get(`/messages/${cs._id}`);
      }
    }).then(r => {
      if (r) setMessages(r.data.map(m => ({ ...m, isMe: m.userId === user.id || m.sender === user.name })));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, dmMessages, activeChannel]);

  function getDmChannelId(otherName) {
    return [user.name, otherName].sort().join('__');
  }

  async function openDm(memberName) {
    if (activeChannel === memberName) return;
    setActiveChannel(memberName);
    setDmLoading(true);
    setDmMessages([]);
    try {
      const channelId = getDmChannelId(memberName);
      const { data } = await api.get(`/dm/${encodeURIComponent(channelId)}`);
      setDmMessages(data.map(m => ({ ...m, isMe: m.userId === user.id || m.sender === user.name })));
    } catch {
      setDmMessages([]);
    } finally {
      setDmLoading(false);
    }
  }

  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');

    if (activeChannel === 'general') {
      if (!clubId) return;
      try {
        const { data } = await api.post(`/messages/${clubId}`, {
          sender: user.name,
          avatar: user.name[0],
          text,
        });
        setMessages(m => [...m, { ...data, isMe: true }]);
      } catch {
        setMessages(m => [...m, { sender: user.name, avatar: user.name[0], text, time: 'Now', isMe: true, _id: Date.now() }]);
      }
    } else {
      const channelId = getDmChannelId(activeChannel);
      try {
        const { data } = await api.post(`/dm/${encodeURIComponent(channelId)}`, {
          sender: user.name,
          avatar: user.name[0],
          text,
        });
        setDmMessages(m => [...m, { ...data, isMe: true }]);
      } catch {
        setDmMessages(m => [...m, { sender: user.name, avatar: user.name[0], text, time: 'Now', isMe: true, _id: Date.now() }]);
      }
    }
  }

  function handleNav(item) {
    if (item === 'Gallery') { navigate('/gallery'); return; }
    if (item === 'Events')  { navigate('/events');  return; }
    if (item === 'Chat')    return;
    navigate(OVERVIEW_ROUTE[user.role] || '/');
  }

  const activeMessages = activeChannel === 'general' ? messages : dmMessages;
  const activeMember   = CHAT_MEMBERS.find(m => m.name === activeChannel);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'radial-gradient(ellipse at top left,rgba(245,197,24,0.08) 0%,#0a0a0a 52%,rgba(217,119,6,0.05) 100%)', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      <Orbs />
      <Sidebar navItems={navItems} active="Chat" onNav={handleNav} user={user} />

      <div style={{ flex: 1, marginLeft: 240, display: 'flex', height: '100vh', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* Channels + Members Panel */}
        <div style={{ width: 210, borderRight: '1px solid rgba(245,197,24,0.08)', background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

          {/* General channel */}
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(245,197,24,0.07)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>Channels</div>
            <div
              onClick={() => setActiveChannel('general')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                background: activeChannel === 'general' ? 'rgba(245,197,24,0.12)' : 'transparent',
                border: activeChannel === 'general' ? '1px solid rgba(245,197,24,0.2)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activeChannel !== 'general') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activeChannel !== 'general') e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ fontSize: 13, color: activeChannel === 'general' ? '#F5C518' : '#A0A0A0', fontWeight: activeChannel === 'general' ? 600 : 400 }}># general</span>
            </div>
          </div>

          {/* DMs header */}
          <div style={{ padding: '12px 16px 4px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 2 }}>Direct Messages</div>
            <div style={{ fontSize: 10, color: '#444', marginBottom: 4 }}>{onlineCount} online</div>
          </div>

          {/* Member list — click to open DM */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
            {CHAT_MEMBERS.map((m, i) => (
              <div key={i}
                onClick={() => openDm(m.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '8px', borderRadius: 8, marginBottom: 3,
                  cursor: 'pointer', transition: 'background 0.15s',
                  background: activeChannel === m.name ? 'rgba(245,197,24,0.08)' : 'transparent',
                  border: activeChannel === m.name ? '1px solid rgba(245,197,24,0.15)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (activeChannel !== m.name) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (activeChannel !== m.name) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(245,197,24,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#A0A0A0' }}>{m.avatar}</div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 7, height: 7, borderRadius: '50%', background: m.online ? '#4ade80' : '#333', border: '2px solid #0a0a0a' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: activeChannel === m.name ? 600 : 500, color: m.online ? (activeChannel === m.name ? '#F5C518' : '#fff') : '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: '#444' }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', borderBottom: '1px solid rgba(245,197,24,0.08)', background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
            <div>
              {activeChannel === 'general' ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>CS Club — General</div>
                  <div style={{ fontSize: 11, color: '#A0A0A0', marginTop: 1 }}>142 members · {onlineCount} online</div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>@ {activeChannel}</div>
                  <div style={{ fontSize: 11, color: '#A0A0A0', marginTop: 1 }}>
                    {activeMember?.role} ·{' '}
                    {activeMember?.online
                      ? <span style={{ color: '#4ade80' }}>Online</span>
                      : 'Offline'}
                  </div>
                </>
              )}
            </div>
            <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(245,197,24,0.18)', borderRadius: 8, color: '#A0A0A0', cursor: 'pointer', padding: '6px 13px', fontSize: 11, fontWeight: 500 }}>Sign Out</button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dmLoading ? (
              <div style={{ textAlign: 'center', color: '#555', marginTop: 40, fontSize: 13 }}>Loading messages…</div>
            ) : activeMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#444' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
                <div style={{ fontSize: 13, color: '#555' }}>
                  {activeChannel === 'general'
                    ? 'No messages yet. Say something!'
                    : `Start a conversation with ${activeChannel}.`}
                </div>
              </div>
            ) : (
              activeMessages.map((msg, i) => (
                <div key={msg._id || i} style={{ display: 'flex', flexDirection: msg.isMe ? 'row-reverse' : 'row', gap: 9, alignItems: 'flex-end' }}>
                  {!msg.isMe && (
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#888', flexShrink: 0 }}>{msg.avatar}</div>
                  )}
                  <div style={{ maxWidth: '62%' }}>
                    {!msg.isMe && <div style={{ fontSize: 10, color: '#A0A0A0', marginBottom: 4, fontWeight: 600 }}>{msg.sender}</div>}
                    <div style={{
                      background: msg.isMe ? 'linear-gradient(135deg,#F5C518,#D97706)' : 'rgba(255,255,255,0.06)',
                      border: msg.isMe ? 'none' : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: msg.isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      padding: '10px 14px', color: msg.isMe ? '#000' : '#fff',
                      fontSize: 13, lineHeight: 1.5,
                      boxShadow: msg.isMe ? '0 2px 12px rgba(245,197,24,0.18)' : 'none',
                    }}>{msg.text}</div>
                    <div style={{ fontSize: 10, color: '#444', marginTop: 3, textAlign: msg.isMe ? 'right' : 'left' }}>
                      {msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(245,197,24,0.08)', display: 'flex', gap: 10, flexShrink: 0, background: 'rgba(0,0,0,0.22)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={activeChannel === 'general' ? 'Message #general…' : `Message ${activeChannel}…`}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 10, padding: '11px 16px', color: '#fff', fontSize: 13, outline: 'none', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
              onBlur={e => e.target.style.border = '1px solid rgba(245,197,24,0.15)'} />
            <GoldButton size="md" onClick={send} style={{ paddingLeft: 22, paddingRight: 22 }}>Send ↑</GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
}
