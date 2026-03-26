import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000', { withCredentials: true });

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setFarmers([
      { _id: '69c4fc60effb9e7ba2303663', name: 'Ramesh Kumar', location: 'Jamshedpur', online: true },
      { _id: '69c4f5a89e610db262b4430c', name: 'Sita Devi',    location: 'Ranchi',      online: false },
    ]);
  }, []);

  useEffect(() => {
    if (!selectedFarmer || !user) return;
    socket.emit('joinChat', { senderId: user.id, receiverId: selectedFarmer._id });
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/chat/${selectedFarmer._id}`, { withCredentials: true });
        setMessages(res.data.messages || []);
      } catch (err) { console.error('Failed to load chat history', err); }
    };
    fetchHistory();
    socket.on('receiveMessage', msg => setMessages(prev => [...prev, msg]));
    return () => socket.off('receiveMessage');
  }, [selectedFarmer, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedFarmer || !user) return;
    const messageData = { senderId: user.id, receiverId: selectedFarmer._id, message: newMessage.trim() };
    socket.emit('sendMessage', messageData);
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date() }]);
    setNewMessage('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        .chat-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .chat-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(ellipse 60% 50% at 90% 10%, rgba(124,106,247,0.10) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 50% at 10% 80%, rgba(20,180,120,0.07) 0%, transparent 60%); }
        .chat-grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:60px 60px; }
        .chat-main { margin-left:240px; flex:1; display:flex; flex-direction:column; position:relative; z-index:1; }
        .chat-body { padding:36px; flex:1; display:flex; flex-direction:column; }
        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a;
          font-weight:500; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .page-eyebrow::before { content:''; width:6px; height:6px; border-radius:50%; background:#14b47a; animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700;
          color:#fff; letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        /* Chat layout */
        .chat-layout { display:grid; grid-template-columns:280px 1fr; gap:16px; flex:1; min-height:0; height:calc(100vh - 240px); }
        @media(max-width:900px){ .chat-layout { grid-template-columns:1fr; } }

        /* Farmers panel */
        .farmers-panel { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; overflow:hidden; display:flex; flex-direction:column; }
        .panel-head { padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.06);
          font-size:12px; letter-spacing:.08em; text-transform:uppercase;
          color:rgba(255,255,255,.3); font-weight:500; display:flex; align-items:center; gap:7px; }
        .panel-head svg { color:rgba(255,255,255,.2); }
        .farmers-list { overflow-y:auto; flex:1; padding:8px; display:flex; flex-direction:column; gap:4px; }

        .farmer-item { display:flex; align-items:center; gap:12px; padding:12px 12px; border-radius:11px;
          cursor:pointer; transition:background .15s; border:1px solid transparent; }
        .farmer-item:hover { background:rgba(255,255,255,.04); }
        .farmer-item.active { background:rgba(20,180,120,.09); border-color:rgba(20,180,120,.2); }

        .farmer-av { width:38px; height:38px; border-radius:50%; flex-shrink:0; position:relative;
          background:linear-gradient(135deg,#14b47a,#0e9464);
          display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:600; color:#fff; }
        .online-dot { position:absolute; bottom:1px; right:1px; width:9px; height:9px; border-radius:50%;
          border:2px solid #0a0a0f; }
        .farmer-info { flex:1; min-width:0; }
        .farmer-name { font-size:13.5px; font-weight:500; color:rgba(255,255,255,.75); white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis; }
        .farmer-item.active .farmer-name { color:#1de9b6; }
        .farmer-loc { font-size:11.5px; color:rgba(255,255,255,.28); margin-top:2px; }

        /* Chat window */
        .chat-window { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; overflow:hidden; display:flex; flex-direction:column; }

        .chat-header { padding:16px 20px; border-bottom:1px solid rgba(255,255,255,.06);
          display:flex; align-items:center; gap:12px; }
        .chat-header-av { width:38px; height:38px; border-radius:50%;
          background:linear-gradient(135deg,#14b47a,#0e9464);
          display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:600; color:#fff; flex-shrink:0; }
        .chat-header-info { flex:1; }
        .chat-header-name { font-size:14px; font-weight:500; color:rgba(255,255,255,.8); }
        .chat-header-status { font-size:11.5px; color:#14b47a; display:flex; align-items:center; gap:5px; }
        .chat-header-status::before { content:''; width:5px; height:5px; border-radius:50%; background:#14b47a; animation:blink 2s infinite; }

        /* Messages */
        .messages-area { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px;
          scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.08) transparent; }
        .messages-area::-webkit-scrollbar { width:4px; }
        .messages-area::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:10px; }

        .msg-wrap { display:flex; flex-direction:column; max-width:70%; }
        .msg-wrap.mine { align-self:flex-end; align-items:flex-end; }
        .msg-wrap.theirs { align-self:flex-start; align-items:flex-start; }

        .msg-bubble { padding:12px 16px; border-radius:16px; font-size:13.5px; line-height:1.5; }
        .msg-wrap.mine .msg-bubble { background:linear-gradient(135deg,#14b47a,#0e9464); color:#fff;
          border-bottom-right-radius:4px; }
        .msg-wrap.theirs .msg-bubble { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.08);
          color:rgba(255,255,255,.75); border-bottom-left-radius:4px; }

        .msg-time { font-size:10.5px; color:rgba(255,255,255,.2); margin-top:4px; }

        .empty-chat { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; }
        .empty-chat-icon { font-size:36px; opacity:.25; }
        .empty-chat-text { font-size:13px; color:rgba(255,255,255,.2); }

        /* No selection */
        .no-selection { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:14px; padding:40px; }
        .no-sel-icon { width:56px; height:56px; border-radius:16px; background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.07); display:flex; align-items:center; justify-content:center;
          font-size:24px; }
        .no-sel-text { font-size:14px; color:rgba(255,255,255,.25); text-align:center; }

        /* Input bar */
        .chat-input-bar { padding:14px 16px; border-top:1px solid rgba(255,255,255,.06);
          display:flex; gap:10px; align-items:center; }
        .chat-input { flex:1; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
          border-radius:12px; padding:12px 16px; font-family:'DM Sans',sans-serif; font-size:13.5px;
          color:#fff; outline:none; transition:border-color .2s,box-shadow .2s; }
        .chat-input::placeholder { color:rgba(255,255,255,.2); }
        .chat-input:focus { border-color:rgba(20,180,122,.45); box-shadow:0 0 0 4px rgba(20,180,122,.07); }
        .send-btn { width:44px; height:44px; border-radius:12px; border:none; flex-shrink:0;
          background:linear-gradient(135deg,#14b47a,#0e9464); color:#fff; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:transform .15s,box-shadow .2s; box-shadow:0 3px 12px rgba(20,180,120,.3); }
        .send-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(20,180,120,.4); }
        .send-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; }
      `}</style>

      <div className="chat-root">
        <div className="chat-bg" />
        <div className="chat-grid-bg" />
        <Sidebar />
        <div className="chat-main">
          <Navbar />
          <div className="chat-body">
            <div className="page-eyebrow">Messaging</div>
            <h1 className="page-title">Chat with <span>Farmers</span></h1>
            <p className="page-sub">Ask questions, negotiate, and connect directly with local growers.</p>

            <div className="chat-layout">
              {/* Farmers list */}
              <div className="farmers-panel">
                <div className="panel-head">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  Farmers ({farmers.length})
                </div>
                <div className="farmers-list">
                  {farmers.map(f => (
                    <div key={f._id} className={`farmer-item${selectedFarmer?._id === f._id ? ' active' : ''}`}
                      onClick={() => setSelectedFarmer(f)}>
                      <div className="farmer-av">
                        {f.name[0]}
                        <span className="online-dot" style={{ background: f.online ? '#14b47a' : 'rgba(255,255,255,.2)' }} />
                      </div>
                      <div className="farmer-info">
                        <div className="farmer-name">{f.name}</div>
                        <div className="farmer-loc">{f.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat window */}
              <div className="chat-window">
                {selectedFarmer ? (
                  <>
                    <div className="chat-header">
                      <div className="chat-header-av">{selectedFarmer.name[0]}</div>
                      <div className="chat-header-info">
                        <div className="chat-header-name">{selectedFarmer.name}</div>
                        <div className="chat-header-status">Online · {selectedFarmer.location}</div>
                      </div>
                    </div>

                    <div className="messages-area">
                      {messages.length === 0 ? (
                        <div className="empty-chat">
                          <div className="empty-chat-icon">👋</div>
                          <div className="empty-chat-text">No messages yet. Start the conversation!</div>
                        </div>
                      ) : (
                        messages.map((msg, i) => (
                          <div key={i} className={`msg-wrap ${msg.senderId === user.id ? 'mine' : 'theirs'}`}>
                            <div className="msg-bubble">{msg.message}</div>
                            <div className="msg-time">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-bar">
                      <input className="chat-input" type="text" placeholder="Type your message..."
                        value={newMessage} onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && sendMessage()} />
                      <button className="send-btn" onClick={sendMessage} disabled={!newMessage.trim()}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="no-selection">
                    <div className="no-sel-icon">💬</div>
                    <div className="no-sel-text">Select a farmer from the list<br />to start chatting</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}