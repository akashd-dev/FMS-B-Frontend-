import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('buyerCart');
    return saved ? JSON.parse(saved) : [];
  });
  const [placingId, setPlacingId] = useState(null);
  const [successIds, setSuccessIds] = useState(new Set());

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map(item => item._id === id ? { ...item, cartQuantity: newQty } : item);
    setCart(updated);
    localStorage.setItem('buyerCart', JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem('buyerCart', JSON.stringify(updated));
  };

  const placeOrder = async (crop) => {
    setPlacingId(crop._id);
    try {
      await axios.post('http://localhost:5000/api/orders/place', {
        cropId: crop._id,
        quantity: crop.cartQuantity
      }, { withCredentials: true });
      setSuccessIds(prev => new Set([...prev, crop._id]));
      setTimeout(() => removeFromCart(crop._id), 1200);
    } catch {
      alert('Failed to place order');
    } finally {
      setPlacingId(null);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        .cart-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .cart-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(ellipse 60% 50% at 30% 10%, rgba(245,166,35,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 60% at 80% 80%, rgba(20,180,120,0.08) 0%, transparent 60%); }
        .cart-grid-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:60px 60px; }
        .cart-main { margin-left:240px; flex:1; display:flex; flex-direction:column; position:relative; z-index:1; }
        .cart-body { padding:36px; flex:1; }
        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a;
          font-weight:500; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .page-eyebrow::before { content:''; width:6px; height:6px; border-radius:50%; background:#14b47a; animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700;
          color:#fff; letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        /* Layout */
        .cart-layout { display:grid; grid-template-columns:1fr 300px; gap:20px; align-items:start; }
        @media(max-width:1000px) { .cart-layout { grid-template-columns:1fr; } }

        /* Cart items */
        .cart-items { display:flex; flex-direction:column; gap:12px; }

        .cart-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; padding:20px; display:flex; gap:16px; flex-wrap:wrap;
          transition:transform .2s,box-shadow .2s; animation:fadeUp .4s ease both; }
        .cart-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,.3); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .cart-card.success-state { border-color:rgba(20,180,120,.35); background:rgba(20,180,120,.05); }

        .crop-icon { width:52px; height:52px; border-radius:12px; background:rgba(20,180,120,.08);
          border:1px solid rgba(20,180,120,.15); display:flex; align-items:center; justify-content:center;
          font-size:22px; flex-shrink:0; }

        .cart-info { flex:1; min-width:120px; }
        .cart-name { font-size:15.5px; font-weight:500; color:rgba(255,255,255,.82); margin-bottom:4px; }
        .cart-unit-price { font-size:12.5px; color:rgba(255,255,255,.3); }
        .cart-subtotal { font-family:'Playfair Display',serif; font-size:18px; font-weight:700;
          color:#14b47a; margin-top:8px; }

        .cart-controls { display:flex; flex-direction:column; align-items:flex-end; gap:12px; }

        /* Qty stepper */
        .qty-stepper { display:flex; align-items:center; gap:0; background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.09); border-radius:10px; overflow:hidden; }
        .qty-btn { width:34px; height:34px; background:none; border:none; cursor:pointer;
          color:rgba(255,255,255,.5); font-size:16px; transition:background .15s,color .15s;
          display:flex; align-items:center; justify-content:center; }
        .qty-btn:hover { background:rgba(255,255,255,.07); color:#fff; }
        .qty-val { width:40px; text-align:center; font-size:14px; color:rgba(255,255,255,.7);
          font-weight:500; font-family:'DM Sans',sans-serif; }

        .remove-btn { display:flex; align-items:center; gap:5px; background:none; border:none;
          font-family:'DM Sans',sans-serif; font-size:12px; color:rgba(255,100,100,.45);
          cursor:pointer; transition:color .2s; padding:0; }
        .remove-btn:hover { color:#ff6b6b; }

        .order-btn { width:100%; border:none; border-radius:10px; padding:11px;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; cursor:pointer;
          transition:all .2s; display:flex; align-items:center; justify-content:center; gap:7px; margin-top:4px; }
        .order-btn-active { background:linear-gradient(135deg,#14b47a,#0e9464); color:#fff;
          box-shadow:0 3px 12px rgba(20,180,120,.25); }
        .order-btn-active:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(20,180,120,.35); }
        .order-btn-active:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .order-btn-success { background:rgba(20,180,120,.12); border:1px solid rgba(20,180,120,.3); color:#1de9b6; cursor:default; }

        .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.3);
          border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* Summary panel */
        .summary-panel { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; overflow:hidden; position:sticky; top:80px; animation:fadeUp .4s .1s ease both; }
        .sp-head { padding:16px 20px; border-bottom:1px solid rgba(255,255,255,.06);
          font-size:12px; letter-spacing:.08em; text-transform:uppercase;
          color:rgba(255,255,255,.25); font-weight:500; }
        .sp-body { padding:20px; display:flex; flex-direction:column; gap:14px; }
        .sp-row { display:flex; justify-content:space-between; font-size:13.5px; color:rgba(255,255,255,.38); }
        .sp-row.total { color:#fff; font-weight:500; font-size:15px; padding-top:12px;
          border-top:1px solid rgba(255,255,255,.06); }
        .sp-row.total span:last-child { font-family:'Playfair Display',serif; font-size:20px; color:#14b47a; }
        .sp-note { font-size:11.5px; color:rgba(255,255,255,.18); text-align:center; margin-top:4px; }

        /* Empty */
        .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:80px 20px; gap:14px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06);
          border-radius:16px; }
        .empty-icon { font-size:48px; opacity:.25; }
        .empty-text { font-size:14px; color:rgba(255,255,255,.2); }
        .browse-link { display:inline-flex; align-items:center; gap:7px; margin-top:4px;
          background:linear-gradient(135deg,#14b47a,#0e9464); border:none; border-radius:10px;
          padding:11px 22px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500;
          color:#fff; cursor:pointer; text-decoration:none; transition:transform .15s,box-shadow .2s;
          box-shadow:0 3px 12px rgba(20,180,120,.25); }
        .browse-link:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(20,180,120,.35); }
      `}</style>

      <div className="cart-root">
        <div className="cart-bg" />
        <div className="cart-grid-bg" />
        <Sidebar />
        <div className="cart-main">
          <Navbar />
          <div className="cart-body">
            <div className="page-eyebrow">Shopping</div>
            <h1 className="page-title">Your <span>Cart</span> ({cart.length})</h1>
            <p className="page-sub">Review items and place orders directly with farmers.</p>

            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <div className="empty-text">Your cart is empty. Start adding crops!</div>
                <a href="/crops" className="browse-link">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22V12M12 12C12 7 7 3 2 3s3 7 10 9M12 12c0-5 5-9 10-9s-3 7-10 9"/>
                  </svg>
                  Browse Crops
                </a>
              </div>
            ) : (
              <div className="cart-layout">
                {/* Items */}
                <div className="cart-items">
                  {cart.map((item, idx) => (
                    <div key={item._id} className={`cart-card${successIds.has(item._id) ? ' success-state' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="crop-icon">🌿</div>
                      <div className="cart-info">
                        <div className="cart-name">{item.name}</div>
                        <div className="cart-unit-price">₹{item.price} per kg</div>
                        <div className="cart-subtotal">₹{(item.price * item.cartQuantity).toFixed(2)}</div>
                      </div>
                      <div className="cart-controls">
                        <div className="qty-stepper">
                          <button className="qty-btn" onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}>−</button>
                          <div className="qty-val">{item.cartQuantity}</div>
                          <button className="qty-btn" onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}>+</button>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                      <button
                        className={`order-btn ${successIds.has(item._id) ? 'order-btn-success' : 'order-btn-active'}`}
                        onClick={() => placeOrder(item)}
                        disabled={placingId === item._id || successIds.has(item._id)}
                      >
                        {successIds.has(item._id) ? (
                          <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Order Placed!</>
                        ) : placingId === item._id ? (
                          <><div className="spinner" /> Placing…</>
                        ) : (
                          <>Place Order for {item.name}</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="summary-panel">
                  <div className="sp-head">Order Summary</div>
                  <div className="sp-body">
                    {cart.map(item => (
                      <div className="sp-row" key={item._id}>
                        <span>{item.name} × {item.cartQuantity}kg</span>
                        <span>₹{(item.price * item.cartQuantity).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="sp-row total">
                      <span>Total</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="sp-note">Orders are placed individually per item</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}