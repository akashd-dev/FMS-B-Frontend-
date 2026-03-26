import { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);

  const fields = [
    { icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0114 0"/></svg>, label: 'Full Name',    value: user?.name },
    { icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>, label: 'Email Address', value: user?.email },
    { icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17z"/></svg>, label: 'Phone Number', value: user?.phone || 'Not provided' },
    { icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>, label: 'Location',     value: user?.location },
    { icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Role',         value: 'Buyer' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        .profile-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .profile-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(ellipse 60% 50% at 60% 0%, rgba(20,180,120,0.11) 0%, transparent 60%),
                      radial-gradient(ellipse 40% 50% at 20% 80%, rgba(124,106,247,0.07) 0%, transparent 60%); }
        .profile-grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:60px 60px; }
        .profile-main { margin-left:240px; flex:1; display:flex; flex-direction:column; position:relative; z-index:1; }
        .profile-body { padding:36px; flex:1; max-width:740px; }
        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a;
          font-weight:500; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .page-eyebrow::before { content:''; width:6px; height:6px; border-radius:50%; background:#14b47a; animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700;
          color:#fff; letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        /* Avatar card */
        .avatar-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:20px; padding:32px; display:flex; align-items:center; gap:24px;
          margin-bottom:20px; animation:fadeUp .5s ease both; flex-wrap:wrap; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .big-avatar { width:72px; height:72px; border-radius:20px; flex-shrink:0;
          background:linear-gradient(135deg,#14b47a,#0e9464);
          display:flex; align-items:center; justify-content:center;
          font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:#fff;
          box-shadow:0 0 32px rgba(20,180,120,.3); }
        .avatar-info { flex:1; }
        .avatar-name { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff;
          letter-spacing:-.01em; margin-bottom:4px; }
        .avatar-email { font-size:13px; color:rgba(255,255,255,.35); }
        .avatar-badge { margin-top:10px; display:inline-flex; align-items:center; gap:6px;
          background:rgba(20,180,120,.1); border:1px solid rgba(20,180,120,.25);
          border-radius:100px; padding:4px 14px; font-size:11.5px; color:#14b47a; font-weight:500; }
        .avatar-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:#14b47a; }

        /* Fields card */
        .fields-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:20px; overflow:hidden; animation:fadeUp .5s .08s ease both; }
        .fields-card-head { padding:16px 22px; border-bottom:1px solid rgba(255,255,255,.06);
          font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.25);
          font-weight:500; display:flex; align-items:center; gap:8px; }
        .field-row { display:flex; align-items:center; gap:16px; padding:16px 22px;
          border-bottom:1px solid rgba(255,255,255,.04); transition:background .15s; }
        .field-row:last-child { border-bottom:none; }
        .field-row:hover { background:rgba(255,255,255,.02); }
        .field-icon-wrap { width:34px; height:34px; border-radius:9px; flex-shrink:0;
          background:rgba(20,180,120,.07); border:1px solid rgba(20,180,120,.12);
          display:flex; align-items:center; justify-content:center; color:#14b47a; }
        .field-label { font-size:11px; letter-spacing:.07em; text-transform:uppercase;
          color:rgba(255,255,255,.22); font-weight:500; margin-bottom:3px; }
        .field-value { font-size:14px; color:rgba(255,255,255,.72); }
        .field-value.empty { color:rgba(255,255,255,.22); font-style:italic; }

        /* Coming soon */
        .coming-soon { background:rgba(124,106,247,.07); border:1px solid rgba(124,106,247,.2);
          border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:12px;
          margin-top:16px; animation:fadeUp .5s .16s ease both; }
        .cs-icon { font-size:18px; }
        .cs-text { font-size:13px; color:rgba(124,106,247,.8); }
        .cs-text strong { color:#a090ff; display:block; font-weight:500; margin-bottom:2px; }
      `}</style>

      <div className="profile-root">
        <div className="profile-bg" />
        <div className="profile-grid-bg" />
        <Sidebar />
        <div className="profile-main">
          <Navbar />
          <div className="profile-body">
            <div className="page-eyebrow">Account</div>
            <h1 className="page-title">Your <span>Profile</span></h1>
            <p className="page-sub">View and manage your buyer account details.</p>

            {/* Avatar */}
            <div className="avatar-card">
              <div className="big-avatar">{user?.name?.[0]?.toUpperCase() || 'B'}</div>
              <div className="avatar-info">
                <div className="avatar-name">{user?.name}</div>
                <div className="avatar-email">{user?.email}</div>
                <div className="avatar-badge">Verified Buyer</div>
              </div>
            </div>

            {/* Fields */}
            <div className="fields-card">
              <div className="fields-card-head">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0114 0"/>
                </svg>
                Personal Information
              </div>
              {fields.map((f, i) => (
                <div className="field-row" key={i}>
                  <div className="field-icon-wrap">{f.icon}</div>
                  <div>
                    <div className="field-label">{f.label}</div>
                    <div className={`field-value${!f.value || f.value === 'Not provided' ? ' empty' : ''}`}>
                      {f.value || 'Not provided'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coming soon */}
            <div className="coming-soon">
              <div className="cs-icon">🚧</div>
              <div className="cs-text">
                <strong>Profile Editing Coming Soon</strong>
                Full profile management will be available in the next update.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}