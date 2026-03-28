import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InquiryModal from '../components/InquiryModal';

export default function Crops() {

  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal state
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('buyerCart');
    return saved ? JSON.parse(saved) : [];
  });
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    fetchCrops();
  }, [search, minPrice, maxPrice]);

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
      console.error('Failed to fetch crops', err);
    } finally {
      setLoading(false);
    }
  };

  // Send Inquiry Function
  const sendInquiry = async (cropId, message) => {
    try {
      await axios.post('http://localhost:5000/api/inquiries', {
        cropId,
        message
      }, { withCredentials: true });

      alert("✅ Inquiry sent successfully to the farmer!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send inquiry. Please try again.");
    }
  };

  const addToCart = (crop) => {
    if (cart.find(item => item._id === crop._id)) return;

    const newCart = [...cart, { ...crop, cartQuantity: 1 }];
    setCart(newCart);
    localStorage.setItem('buyerCart', JSON.stringify(newCart));

    setAddedIds(prev => new Set([...prev, crop._id]));

    // Remove "Added" status after 2 seconds
    setTimeout(() => {
      setAddedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(crop._id);
        return newSet;
      });
    }, 2000);
  };

  const openInquiryModal = (crop) => {
    setSelectedCrop(crop);
    setShowModal(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        .crops-root { display:flex; min-height:100vh; background:#0a0a0f; font-family:'DM Sans',sans-serif; }
        .crops-main { margin-left:240px; flex:1; display:flex; flex-direction:column; position:relative; z-index:1; }
        .crops-body { padding:36px; flex:1; }
        .page-eyebrow { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#14b47a; font-weight:500; margin-bottom:8px; }
        .page-title { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,32px); font-weight:700; color:#fff; letter-spacing:-.02em; margin-bottom:6px; }
        .page-title span { background:linear-gradient(135deg,#14b47a,#1de9b6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .page-sub { font-size:13.5px; color:rgba(255,255,255,.3); font-weight:300; margin-bottom:28px; }

        .filter-bar { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:20px 24px; margin-bottom:28px; display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .filter-input { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:11px 14px; color:#fff; width:100%; }
        .filter-input:focus { border-color:#14b47a; outline:none; }
        .filter-btn { background:linear-gradient(135deg,#14b47a,#0e9464); border:none; border-radius:10px; padding:11px 22px; color:#fff; font-weight:500; cursor:pointer; }
        
        .crop-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:16px; overflow:hidden; transition:transform .2s,box-shadow .2s; }
        .crop-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.35); }
        .crop-img { width:100%; height:160px; object-fit:cover; }
        .crop-body { padding:18px; flex:1; display:flex; flex-direction:column; }
        .crop-name { font-size:15.5px; font-weight:500; color:#fff; }
        .crop-price { font-size:20px; font-weight:700; color:#14b47a; }
        .crop-desc { font-size:12.5px; color:rgba(255,255,255,.45); line-height:1.5; }
        .cart-btn {
  height: 40px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  width: 100%;
}
.cart-btn:hover:not(:disabled) {
  opacity: 0.88;
  transform: translateY(-1px);
}
.cart-btn:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}
.cart-btn-add {
  background: linear-gradient(135deg, #14b47a, #0e9464);
  color: #fff;
}
.cart-btn-done {
  background: rgba(20, 180, 122, 0.15);
  color: #14b47a;
  border: 1px solid rgba(20, 180, 122, 0.35);
}
      `}</style>

      <div className="crops-root">
        <Sidebar />
        <div className="crops-main">
          <Navbar />
          <div className="crops-body">
            <div className="page-eyebrow">Marketplace</div>
            <h1 className="page-title">Browse <span>Fresh Crops</span></h1>
            <p className="page-sub">Sourced directly from local farmers — fresh, traceable, affordable.</p>

            {/* Filters */}
            <div className="filter-bar">
              <input 
                className="filter-input" 
                type="text" 
                placeholder="Search by crop name..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <input 
                className="filter-input" 
                type="number" 
                placeholder="Min Price" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
              />
              <input 
                className="filter-input" 
                type="number" 
                placeholder="Max Price" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
              />
              <button className="filter-btn" onClick={fetchCrops}>Search</button>
            </div>

            {/* Crops Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {loading ? (
                <p>Loading crops...</p>
              ) : crops.length === 0 ? (
                <p>No crops found.</p>
              ) : (
                crops.map((crop) => (
                  <div className="crop-card" key={crop._id}>
                    <div>
                      {crop.image ? (
                        <img src={`http://localhost:5000${crop.image}`} alt={crop.name} className="crop-img" />
                      ) : (
                        <div style={{ height: '160px', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                          🌿
                        </div>
                      )}
                    </div>

                    <div className="crop-body">
                      <div className="crop-name">{crop.name}</div>
                      <div className="crop-price">₹{crop.price} <span>/ kg</span></div>
                      <div className="crop-desc">{crop.description}</div>
                      <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                        <button 
                          className="btn btn-success w-100 mb-2"
                          onClick={() => {
                            setSelectedCrop(crop);
                            setShowModal(true);
                          }}
                        >
                          Send Inquiry
                        </button>
                        <button
  className={`cart-btn w-100 mb-2 ${cart.find(i => i._id === crop._id) ? 'cart-btn-done' : 'cart-btn-add'}`}
  onClick={() => addToCart(crop)}
  disabled={!!cart.find(i => i._id === crop._id)}
>
  {cart.find(i => i._id === crop._id) ? (
    <>
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      Added
    </>
  ) : (
    <>
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
      Add to Cart
    </>
  )}
</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal 
        crop={selectedCrop}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSend={sendInquiry}
      />
    </>
  );
}