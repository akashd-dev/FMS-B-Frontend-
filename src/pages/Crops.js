import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

export default function Crops() {
  const { user } = useContext(AuthContext);
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('buyerCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { fetchCrops(); }, [search, minPrice, maxPrice]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/crops/all?';
      if (search) url += `search=${search}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;
      const res = await axios.get(url);
      setCrops(res.data.crops || []);
    } catch (err) {
      console.error('Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (crop) => {
    if (cart.find(i => i._id === crop._id)) return;
    const newCart = [...cart, { ...crop, cartQuantity: 1 }];
    setCart(newCart);
    localStorage.setItem('buyerCart', JSON.stringify(newCart));
    setAddedIds(prev => new Set([...prev, crop._id]));
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(crop._id); return s; }), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        .crops-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .crops-bg { position:fixed; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(ellipse 60% 50% at 80% 0%, rgba(20,180,120,0.10) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 60% at 10% 90%, rgba(16,100,220,0.07) 0%, transparent 60%); }
        .crops-grid { position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:60px 60px; }
        .crops-main { margin-left:240px; flex:1; display:flex; flex-direction:column; position:relative; z-index:1; }
        .crops-body { padding:36px; flex:1; }
        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a;
          font-weight:500; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .page-eyebrow::before { content:''; width:6px; height:6px; border-radius:50%; background:#14b47a; animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700; color:#fff;
          letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        /* Filter bar */
        .filter-bar { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px;
          padding:20px 24px; margin-bottom:28px; display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .filter-input-wrap { position:relative; flex:1; min-width:160px; }
        .filter-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.2); display:flex; }
        .filter-input { width:100%; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
          border-radius:10px; padding:11px 14px 11px 38px; font-family:'DM Sans',sans-serif; font-size:13.5px;
          color:#fff; outline:none; transition:border-color .2s,box-shadow .2s; }
        .filter-input::placeholder { color:rgba(255,255,255,.18); }
        .filter-input:focus { border-color:rgba(20,180,122,.5); box-shadow:0 0 0 4px rgba(20,180,122,.08); }
        .filter-btn { background:linear-gradient(135deg,#14b47a,#0e9464); border:none; border-radius:10px;
          padding:11px 22px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; color:#fff;
          cursor:pointer; transition:transform .15s,box-shadow .2s; white-space:nowrap;
          box-shadow:0 4px 16px rgba(20,180,120,.3); }
        .filter-btn:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(20,180,120,.4); }

        /* Crops grid */
        .crops-grid-layout { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; }

        .crop-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px;
          overflow:hidden; display:flex; flex-direction:column; transition:transform .2s,box-shadow .2s;
          animation:fadeUp .4s ease both; }
        .crop-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,.35); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .crop-img-wrap { height:160px; overflow:hidden; background:rgba(20,180,120,.06);
          display:flex; align-items:center; justify-content:center; position:relative; }
        .crop-img { width:100%; height:100%; object-fit:cover; }
        .crop-img-placeholder { font-size:40px; opacity:.4; }
        .crop-category-pill { position:absolute; top:10px; left:10px; background:rgba(10,10,15,.7);
          border:1px solid rgba(20,180,120,.3); border-radius:100px; padding:3px 10px;
          font-size:10.5px; color:#1de9b6; font-weight:500; letter-spacing:.04em; backdrop-filter:blur(8px); }

        .crop-body { padding:18px; flex:1; display:flex; flex-direction:column; gap:10px; }
        .crop-name { font-size:15.5px; font-weight:500; color:rgba(255,255,255,.85); }
        .crop-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#14b47a; }
        .crop-price span { font-family:'DM Sans',sans-serif; font-size:12px; color:rgba(255,255,255,.3); font-weight:300; }
        .crop-meta { display:flex; flex-direction:column; gap:5px; }
        .crop-meta-row { display:flex; align-items:center; gap:7px; font-size:12.5px; color:rgba(255,255,255,.35); }
        .crop-meta-row svg { flex-shrink:0; color:rgba(255,255,255,.2); }
        .crop-desc { font-size:12px; color:rgba(255,255,255,.28); line-height:1.6; display:-webkit-box;
          -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .crop-divider { height:1px; background:rgba(255,255,255,.05); }
        .crop-farmer { display:flex; align-items:center; gap:8px; font-size:12.5px; color:rgba(255,255,255,.35); }
        .farmer-avatar { width:24px; height:24px; border-radius:50%; background:linear-gradient(135deg,#14b47a,#0e9464);
          display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600; color:#fff; flex-shrink:0; }

        .cart-btn { margin-top:auto; width:100%; border:none; border-radius:10px; padding:12px;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; cursor:pointer;
          transition:all .2s; display:flex; align-items:center; justify-content:center; gap:7px; }
        .cart-btn-add { background:linear-gradient(135deg,#14b47a,#0e9464); color:#fff;
          box-shadow:0 3px 12px rgba(20,180,120,.25); }
        .cart-btn-add:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(20,180,120,.35); }
        .cart-btn-done { background:rgba(20,180,120,.12); border:1px solid rgba(20,180,120,.25); color:#1de9b6; cursor:default; }

        /* Empty / loading */
        .empty-state { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:80px 20px; color:rgba(255,255,255,.2); gap:12px; }
        .empty-icon { font-size:48px; opacity:.3; }
        .empty-text { font-size:14px; }
        .skeleton { background:rgba(255,255,255,.05); border-radius:16px; height:320px;
          animation:pulse 1.4s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
      `}</style>

      <div className="crops-root">
        <div className="crops-bg" />
        <div className="crops-grid" />
        <Sidebar />
        <div className="crops-main">
          <Navbar />
          <div className="crops-body">
            <div className="page-eyebrow">Marketplace</div>
            <h1 className="page-title">Browse <span>Fresh Crops</span></h1>
            <p className="page-sub">Sourced directly from local farmers — fresh, traceable, affordable.</p>

            {/* Filters */}
            <div className="filter-bar">
              <div className="filter-input-wrap" style={{ flex: 2 }}>
                <span className="filter-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input className="filter-input" type="text" placeholder="Search by crop name..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="filter-input-wrap">
                <span className="filter-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                </span>
                <input className="filter-input" type="number" placeholder="Min ₹"
                  value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              </div>
              <div className="filter-input-wrap">
                <span className="filter-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                </span>
                <input className="filter-input" type="number" placeholder="Max ₹"
                  value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
              <button className="filter-btn" onClick={fetchCrops}>Search</button>
            </div>

            {/* Grid */}
            <div className="crops-grid-layout">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" />)
              ) : crops.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🌱</div>
                  <div className="empty-text">No crops found. Try adjusting your filters.</div>
                </div>
              ) : crops.map((crop, idx) => (
                <div className="crop-card" key={crop._id} style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="crop-img-wrap">
                    {crop.image
                      ? <img className="crop-img" src={`http://localhost:5000${crop.image}`} alt={crop.name} />
                      : <div className="crop-img-placeholder">🌿</div>
                    }
                    <div className="crop-category-pill">Fresh</div>
                  </div>
                  <div className="crop-body">
                    <div className="crop-name">{crop.name}</div>
                    <div className="crop-price">₹{crop.price} <span>/ kg</span></div>
                    <div className="crop-meta">
                      <div className="crop-meta-row">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                        </svg>
                        {crop.quantity} kg available
                      </div>
                    </div>
                    {crop.description && <div className="crop-desc">{crop.description}</div>}
                    <div className="crop-divider" />
                    <div className="crop-farmer">
                      <div className="farmer-avatar">{(crop.farmerId?.name || 'F')[0]}</div>
                      {crop.farmerId?.name || 'Unknown Farmer'}
                    </div>
                    <button
                      className={`cart-btn ${addedIds.has(crop._id) || cart.find(i => i._id === crop._id) ? 'cart-btn-done' : 'cart-btn-add'}`}
                      onClick={() => addToCart(crop)}
                      disabled={!!cart.find(i => i._id === crop._id)}
                    >
                      {cart.find(i => i._id === crop._id) ? (
                        <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Added</>
                      ) : (
                        <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                        </svg> Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}