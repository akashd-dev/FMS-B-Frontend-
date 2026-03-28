import { useState } from 'react';

export default function InquiryModal({ crop, isOpen, onClose, onSend }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    await onSend(crop._id, message.trim());
    setMessage('');
    setSending(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Send Inquiry - {crop.name}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <p><strong>Price:</strong> ₹{crop.price} per kg</p>
            <p><strong>Available:</strong> {crop.quantity} kg</p>
            
            <textarea
              className="form-control"
              rows="4"
              placeholder="Write your inquiry here... (e.g., Do you have more quantity? What is the delivery time?)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              className="btn btn-success" 
              onClick={handleSend}
              disabled={sending || !message.trim()}
            >
              {sending ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}