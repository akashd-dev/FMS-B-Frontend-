import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inquiries/buyer', { withCredentials: true });
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const replyToInquiry = async (inquiryId) => {
    if (!replyText.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/inquiries/reply', {
        inquiryId,
        message: replyText
      }, { withCredentials: true });
      setReplyingId(null);
      setReplyText('');
      fetchInquiries();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .inq-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .inq-main { margin-left:240px; flex:1; display:flex; flex-direction:column; }
        .inq-body { padding:36px; flex:1; }

        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a; font-weight:500; margin-bottom:8px; }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700; color:#fff; letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        /* Card */
        .inq-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:22px 24px; margin-bottom:16px; transition:transform .2s, box-shadow .2s; }
        .inq-card:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(0,0,0,.3); }

        .inq-crop-name { font-size:16px; font-weight:600; color:#fff; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
        .inq-crop-name::before { content:''; display:inline-block; width:8px; height:8px; border-radius:50%; background:#14b47a; flex-shrink:0; }

        .inq-meta { display:flex; flex-wrap:wrap; gap:18px; margin-bottom:14px; }
        .inq-meta-item { display:flex; flex-direction:column; gap:2px; }
        .inq-meta-label { font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.3); }
        .inq-meta-value { font-size:13.5px; color:rgba(255,255,255,.75); }

        .inq-message-box { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); border-radius:10px; padding:12px 14px; font-size:13.5px; color:rgba(255,255,255,.6); line-height:1.6; margin-bottom:14px; }

        /* Replies */
        .replies-section { margin-bottom:14px; }
        .replies-label { font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:8px; }
        .reply-bubble { background:rgba(20,180,122,.07); border:1px solid rgba(20,180,122,.15); border-radius:10px; padding:10px 14px; font-size:13px; color:rgba(255,255,255,.65); margin-bottom:6px; line-height:1.5; position:relative; padding-left:20px; }
        .reply-bubble::before { content:''; position:absolute; left:8px; top:50%; transform:translateY(-50%); width:4px; height:4px; border-radius:50%; background:#14b47a; }

        /* Reply input area */
        .reply-area { display:flex; flex-direction:column; gap:8px; margin-top:4px; }
        .reply-textarea { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:11px 14px; color:#fff; font-size:13.5px; font-family:'DM Sans',sans-serif; resize:none; width:100%; }
        .reply-textarea:focus { border-color:#14b47a; outline:none; }
        .reply-textarea::placeholder { color:rgba(255,255,255,.25); }
        .reply-actions { display:flex; gap:8px; }

        /* Buttons */
        .btn-reply-open { background:rgba(20,180,122,.12); border:1px solid rgba(20,180,122,.25); border-radius:8px; padding:8px 16px; color:#14b47a; font-size:13px; font-weight:500; cursor:pointer; transition:background .2s; display:flex; align-items:center; gap:6px; }
        .btn-reply-open:hover { background:rgba(20,180,122,.22); }
        .btn-send { background:linear-gradient(135deg,#14b47a,#0e9464); border:none; border-radius:8px; padding:8px 18px; color:#fff; font-size:13px; font-weight:500; cursor:pointer; transition:opacity .2s; }
        .btn-send:hover { opacity:.88; }
        .btn-cancel { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:8px; padding:8px 14px; color:rgba(255,255,255,.4); font-size:13px; cursor:pointer; transition:background .2s; }
        .btn-cancel:hover { background:rgba(255,255,255,.09); }

        /* Empty */
        .empty-state { text-align:center; padding:64px 24px; color:rgba(255,255,255,.25); font-size:14px; }
        .empty-icon { font-size:40px; margin-bottom:12px; }

        /* Loading */
        .loading-text { color:rgba(255,255,255,.3); font-size:14px; }
      `}</style>

      <div className="inq-root">
        <Sidebar />
        <div className="inq-main">
          <Navbar />
          <div className="inq-body">

            <div className="page-eyebrow">Communications</div>
            <h1 className="page-title">My <span>Inquiries</span></h1>
            <p className="page-sub">Track your messages and replies from farmers.</p>

            {loading ? (
              <p className="loading-text">Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No inquiries sent yet.</p>
              </div>
            ) : (
              inquiries.map(inq => (
                <div className="inq-card" key={inq._id}>

                  <div className="inq-crop-name">{inq.cropId?.name}</div>

                  <div className="inq-meta">
                    <div className="inq-meta-item">
                      <span className="inq-meta-label">Farmer</span>
                      <span className="inq-meta-value">{inq.farmerId?.name}</span>
                    </div>
                  </div>

                  <div className="inq-message-box">{inq.message}</div>

                  {inq.replies && inq.replies.length > 0 && (
                    <div className="replies-section">
                      <div className="replies-label">Replies</div>
                      {inq.replies.map((reply, i) => (
                        <div key={i} className="reply-bubble">{reply.message}</div>
                      ))}
                    </div>
                  )}

                  {replyingId === inq._id ? (
                    <div className="reply-area">
                      <textarea
                        className="reply-textarea"
                        rows={3}
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className="reply-actions">
                        <button className="btn-send" onClick={() => replyToInquiry(inq._id)}>
                          Send Reply
                        </button>
                        <button className="btn-cancel" onClick={() => { setReplyingId(null); setReplyText(''); }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn-reply-open" onClick={() => setReplyingId(inq._id)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                      </svg>
                      Reply
                    </button>
                  )}

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}