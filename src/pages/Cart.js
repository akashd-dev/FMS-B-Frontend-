import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('buyerCart');
    return saved ? JSON.parse(saved) : [];
  });

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map(item => 
      item._id === id ? { ...item, cartQuantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem('buyerCart', JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem('buyerCart', JSON.stringify(updated));
  };

  const placeOrder = async (crop) => {
    try {
      await axios.post('http://localhost:5000/api/orders/place', {
        cropId: crop._id,
        quantity: crop.cartQuantity
      }, { withCredentials: true });

      alert(`Order placed for ${crop.name}!`);
      removeFromCart(crop._id);
    } catch (err) {
      alert('Failed to place order');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">🛒 Your Cart ({cart.length} items)</h3>

          {cart.length === 0 ? (
            <div className="alert alert-info">Your cart is empty. Start adding crops!</div>
          ) : (
            <>
              {cart.map((item) => (
                <div className="card mb-3 p-4" key={item._id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5>{item.name}</h5>
                      <p>₹{item.price} × {item.cartQuantity} kg = ₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                    </div>
                    <div className="text-end">
                      <div className="input-group" style={{ width: '140px' }}>
                        <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}>-</button>
                        <input type="text" className="form-control text-center" value={item.cartQuantity} readOnly />
                        <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}>+</button>
                      </div>
                      <button className="btn btn-danger btn-sm mt-2" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </div>
                  <button 
                    className="btn btn-success mt-3 w-100"
                    onClick={() => placeOrder(item)}
                  >
                    Place Order for this item
                  </button>
                </div>
              ))}

              <div className="card p-4 mt-4">
                <h4>Total Amount: ₹{totalAmount.toFixed(2)}</h4>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}