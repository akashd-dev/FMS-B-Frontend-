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
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('buyerCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchCrops();
  }, [search, minPrice, maxPrice]);

  const fetchCrops = async () => {
    try {
      let url = 'http://localhost:5000/api/crops/all?';
      if (search) url += `search=${search}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;

      const res = await axios.get(url);
      setCrops(res.data.crops || []);
    } catch (err) {
      console.error("Failed to fetch crops");
    }
  };

  const addToCart = (crop) => {
    const existing = cart.find(item => item._id === crop._id);
    if (existing) {
      alert("Already in cart!");
      return;
    }
    const newCart = [...cart, { ...crop, cartQuantity: 1 }];
    setCart(newCart);
    localStorage.setItem('buyerCart', JSON.stringify(newCart));
    alert(`${crop.name} added to cart!`);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">🌱 Browse Fresh Crops</h3>

          {/* Search Filters */}
          <div className="card p-4 mb-4">
            <div className="row g-3">
              <div className="col-md-5">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by crop name..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Min Price" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Max Price" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="col-md-1">
                <button className="btn btn-primary w-100" onClick={fetchCrops}>Search</button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {crops.map((crop) => (
              <div className="col-md-6 col-lg-4" key={crop._id}>
                <div className="card h-100">
                  {crop.image && (
                    <img 
                      src={`http://localhost:5000${crop.image}`} 
                      alt={crop.name} 
                      className="crop-image" 
                    />
                  )}
                  <div className="card-body">
                    <h5>{crop.name}</h5>
                    <p className="text-success fw-bold">₹{crop.price} / kg</p>
                    <p>Available: {crop.quantity} kg</p>
                    <p className="text-muted small">{crop.description}</p>
                    <p><strong>Farmer:</strong> {crop.farmerId?.name || 'Unknown'}</p>
                    <button 
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => addToCart(crop)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}