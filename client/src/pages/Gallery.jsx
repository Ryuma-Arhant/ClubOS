import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AppShell  from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import Badge     from '../components/Badge';
import { GoldButton, DangerButton } from '../components/Buttons';

const NAV_MAP = {
  'Super Admin': ['Overview', 'Clubs', 'Users', 'Events', 'Notifications'],
  'Club Admin':  ['Overview', 'Members', 'Events', 'Chat', 'Gallery', 'Settings'],
  'Co-Admin':    ['Overview', 'Members', 'Events', 'Chat', 'Gallery'],
  'Student':     ['Home', 'My Clubs', 'Discover Clubs', 'Events', 'Notifications'],
};
const OVERVIEW_ROUTE = {
  'Super Admin': '/superadmin', 'Club Admin': '/clubadmin',
  'Co-Admin': '/coadmin', 'Student': '/student',
};

const FALLBACK_SEEDS = [11,77,22,88,33,99,44,55,66,17,28,39,45,56,67,78];

function photoSrc(photo, w = 280, h = 200) {
  if (photo?.url)  return photo.url;
  if (photo?.seed) return `https://picsum.photos/seed/${photo.seed * 3}/${w}/${h}`;
  return `https://picsum.photos/seed/1/${w}/${h}`;
}

export default function Gallery() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [albums,        setAlbums]        = useState([]);
  const [clubId,        setClubId]        = useState(null);
  const [view,          setView]          = useState('albums');
  const [activeAlbum,   setActiveAlbum]   = useState(null);
  const [lightbox,      setLightbox]      = useState(null);
  const [liked,         setLiked]         = useState({});

  // New album modal
  const [showNewAlbum,  setShowNewAlbum]  = useState(false);
  const [albumForm,     setAlbumForm]     = useState({ name: '', visibility: 'Members Only' });
  const [albumErrors,   setAlbumErrors]   = useState({});
  const [creating,      setCreating]      = useState(false);

  // Upload
  const [uploading,     setUploading]     = useState(false);

  const navItems   = NAV_MAP[user.role] || NAV_MAP['Student'];
  const canManage  = ['Super Admin', 'Club Admin', 'Co-Admin'].includes(user.role);

  useEffect(() => {
    api.get('/clubs').then(r => {
      const cs = r.data.find(c => c.name === 'Computer Science Club');
      if (cs) {
        setClubId(cs._id);
        return api.get(`/gallery/${cs._id}`);
      }
    }).then(r => { if (r) setAlbums(r.data); }).catch(console.error);
  }, []);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const photos = activeAlbum?.photos || [];
    const total  = photos.length || FALLBACK_SEEDS.length;
    function onKey(e) {
      if (e.key === 'Escape')      setLightbox(null);
      if (e.key === 'ArrowLeft')   setLightbox(l => (l - 1 + total) % total);
      if (e.key === 'ArrowRight')  setLightbox(l => (l + 1) % total);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, activeAlbum]);

  function handleNav(item) {
    if (item === 'Chat')    { navigate('/chat');    return; }
    if (item === 'Events')  { navigate('/events');  return; }
    if (item === 'Gallery') { setView('albums'); setActiveAlbum(null); return; }
    navigate(OVERVIEW_ROUTE[user.role] || '/');
  }

  async function handleCreateAlbum() {
    if (!albumForm.name.trim()) { setAlbumErrors({ name: 'Album name is required.' }); return; }
    if (!clubId) return;
    setCreating(true);
    try {
      const { data } = await api.post(`/gallery/${clubId}`, albumForm);
      setAlbums(a => [data, ...a]);
      setActiveAlbum(data);
      setView('grid');
      setShowNewAlbum(false);
      setAlbumForm({ name: '', visibility: 'Members Only' });
      setAlbumErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length || !activeAlbum) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach(f => formData.append('photos', f));
    try {
      const { data } = await api.post(`/gallery/album/${activeAlbum._id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setActiveAlbum(data);
      setAlbums(prev => prev.map(a => a._id === data._id ? data : a));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  // Fallback albums if DB is empty
  const displayAlbums = albums.length ? albums : [
    { _id: '1', name: 'Tech Showcase 2026',   visibility: 'Members Only', seed: 10,
      photos: Array(8).fill(0).map((_,i) => ({ seed: 10 + i })) },
    { _id: '2', name: 'Club Orientation Day', visibility: 'Public',       seed: 20,
      photos: Array(6).fill(0).map((_,i) => ({ seed: 20 + i })) },
    { _id: '3', name: 'Hackathon 2025',       visibility: 'Members Only', seed: 30,
      photos: Array(10).fill(0).map((_,i) => ({ seed: 30 + i })) },
    { _id: '4', name: 'Holiday Social',       visibility: 'Public',       seed: 40,
      photos: Array(7).fill(0).map((_,i) => ({ seed: 40 + i })) },
    { _id: '5', name: 'Workshop Series',      visibility: 'Members Only', seed: 50,
      photos: Array(5).fill(0).map((_,i) => ({ seed: 50 + i })) },
    { _id: '6', name: 'Welcome Picnic',       visibility: 'Public',       seed: 60,
      photos: Array(9).fill(0).map((_,i) => ({ seed: 60 + i })) },
  ];

  const albumPhotos = activeAlbum?.photos || [];
  const lbPhoto     = lightbox !== null ? albumPhotos[lightbox] : null;

  const label   = { display: 'block', color: '#F5C518', fontSize: 11, fontWeight: 600, marginBottom: 7, letterSpacing: 0.6, textTransform: 'uppercase' };
  const inp     = hasErr => ({ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${hasErr ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`, borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 13, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' });
  const errStyle = { fontSize: 11, color: '#f87171', marginTop: 5 };

  return (
    <AppShell navItems={navItems} active="Gallery" onNav={handleNav} user={user} onLogout={logout} title="Gallery">

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />

      {/* New Album Modal */}
      {showNewAlbum && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => { setShowNewAlbum(false); setAlbumErrors({}); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(245,197,24,0.22)', borderRadius: 18, padding: '28px 32px', width: 420, maxWidth: '92vw' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 22 }}>New Album</h3>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>Album Name *</label>
              <input
                value={albumForm.name}
                onChange={e => { setAlbumForm(f => ({ ...f, name: e.target.value })); setAlbumErrors({}); }}
                placeholder="e.g. Annual Tech Fest 2026"
                style={inp(albumErrors.name)}
                onFocus={e => e.target.style.border = '1px solid rgba(245,197,24,0.45)'}
                onBlur={e => e.target.style.border = `1px solid ${albumErrors.name ? 'rgba(239,68,68,0.5)' : 'rgba(245,197,24,0.15)'}`}
                autoFocus />
              {albumErrors.name && <div style={errStyle}>{albumErrors.name}</div>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={label}>Visibility</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Public', 'Members Only'].map(v => (
                  <div key={v} onClick={() => setAlbumForm(f => ({ ...f, visibility: v }))} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                    background: albumForm.visibility === v ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${albumForm.visibility === v ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${albumForm.visibility === v ? '#F5C518' : '#555'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {albumForm.visibility === v && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F5C518' }} />}
                    </div>
                    <span style={{ fontSize: 12, color: albumForm.visibility === v ? '#fff' : '#A0A0A0', fontWeight: albumForm.visibility === v ? 600 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <GoldButton size="md" onClick={handleCreateAlbum} style={{ opacity: creating ? 0.7 : 1 }}>
                {creating ? '···' : 'Create Album'}
              </GoldButton>
              <GoldButton size="md" variant="secondary" onClick={() => { setShowNewAlbum(false); setAlbumErrors({}); }}>Cancel</GoldButton>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && lbPhoto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          onClick={() => setLightbox(null)}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 720, width: '90%' }}>
            <img src={photoSrc(lbPhoto, 720, 480)} alt=""
              style={{ width: '100%', borderRadius: 14, display: 'block', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}
              onError={e => { e.target.style.height = '320px'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
            {albumPhotos.length > 1 && <>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => (l - 1 + albumPhotos.length) % albumPhotos.length); }} style={{ position: 'absolute', left: -52, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={e => { e.stopPropagation(); setLightbox(l => (l + 1) % albumPhotos.length); }} style={{ position: 'absolute', right: -52, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18 }}>
              <GoldButton size="sm" variant={liked[lightbox] ? 'primary' : 'secondary'} onClick={() => setLiked(l => ({ ...l, [lightbox]: !l[lightbox] }))}>
                {liked[lightbox] ? '♥ Liked' : '♡ Like'}
              </GoldButton>
              {lbPhoto.url && (
                <a href={lbPhoto.url} download style={{ textDecoration: 'none' }}>
                  <GoldButton size="sm" variant="secondary">↓ Download</GoldButton>
                </a>
              )}
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#555' }}>{lightbox + 1} / {albumPhotos.length} · Press ← → or Esc</div>
          </div>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {view === 'grid' && (
            <button onClick={() => { setView('albums'); setActiveAlbum(null); }} style={{ background: 'none', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 8, color: '#A0A0A0', cursor: 'pointer', padding: '6px 13px', fontSize: 12, fontWeight: 500 }}>← Albums</button>
          )}
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{view === 'albums' ? 'All Albums' : activeAlbum?.name}</h2>
          {activeAlbum && <Badge variant={activeAlbum.visibility === 'Public' ? 'green' : 'amber'}>{activeAlbum.visibility}</Badge>}
        </div>

        {canManage && (
          view === 'albums' ? (
            <GoldButton onClick={() => setShowNewAlbum(true)}>+ New Album</GoldButton>
          ) : (
            <GoldButton onClick={() => fileInputRef.current?.click()} style={{ opacity: uploading ? 0.6 : 1 }}>
              {uploading ? 'Uploading…' : '↑ Upload Photos'}
            </GoldButton>
          )
        )}
      </div>

      {/* Albums Grid */}
      {view === 'albums' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {displayAlbums.map((album, idx) => {
            const coverPhoto = album.photos?.[0];
            const coverSrc   = coverPhoto
              ? photoSrc(coverPhoto, 360, 160)
              : `https://picsum.photos/seed/${(album.seed || idx * 10 + 10)}/360/160`;
            const count = album.photos?.length || 0;
            return (
              <GlassCard key={album._id} onClick={() => { setActiveAlbum(album); setView('grid'); }} style={{ cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(245,197,24,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(245,197,24,0.06)'; }}>
                <div style={{ height: 148, background: 'rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
                  <img src={coverSrc} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onError={e => e.target.style.display = 'none'}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', top: 9, right: 9 }}>
                    <Badge variant={album.visibility === 'Public' ? 'green' : 'amber'}>{album.visibility}</Badge>
                  </div>
                </div>
                <div style={{ padding: '13px 15px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{album.name}</div>
                  <div style={{ fontSize: 11, color: '#A0A0A0' }}>{count} {count === 1 ? 'photo' : 'photos'}</div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Photo Grid */}
      {view === 'grid' && (
        <>
          {albumPhotos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🖼</div>
              <div style={{ fontSize: 15, color: '#555', marginBottom: 16 }}>No photos in this album yet.</div>
              {canManage && (
                <GoldButton onClick={() => fileInputRef.current?.click()}>↑ Upload First Photos</GoldButton>
              )}
            </div>
          ) : (
            <div style={{ columns: 4, columnGap: 12 }}>
              {albumPhotos.map((photo, i) => (
                <div key={photo._id || i} onClick={() => setLightbox(i)}
                  style={{ marginBottom: 12, cursor: 'pointer', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(245,197,24,0.1)', breakInside: 'avoid', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.4)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,197,24,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,197,24,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <img src={photoSrc(photo)} alt={photo.name || ''}
                    style={{ width: '100%', display: 'block' }}
                    onError={e => { e.target.style.height = '100px'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
