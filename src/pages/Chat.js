import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000', { withCredentials: true });

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [farmers, setFarmers] = useState([]);        // Will store real farmers later
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // For now, using demo farmers (but we'll use real IDs)
  // In future, you can fetch real farmers who have crops or orders
  useEffect(() => {
    setFarmers([
      { 
        _id: "69c4fc60effb9e7ba2303663",   // ← Replace with a REAL farmer ObjectId from your DB
        name: "Ramesh Kumar", 
        location: "Jamshedpur" 
      },
      { 
        _id: "69c4f5a89e610db262b4430c", 
        name: "Sita Devi", 
        location: "Ranchi" 
      }
    ]);
  }, []);

  // Join chat room and load history when a farmer is selected
  useEffect(() => {
    if (!selectedFarmer || !user) return;

    const roomData = {
      senderId: user.id,
      receiverId: selectedFarmer._id
    };

    socket.emit('joinChat', roomData);

    // Load previous messages
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/chat/${selectedFarmer._id}`, 
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchHistory();

    // Listen for new messages
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedFarmer, user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedFarmer || !user) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedFarmer._id,
      message: newMessage.trim()
    };

    socket.emit('sendMessage', messageData);

    // Optimistically add to UI
    setMessages(prev => [...prev, {
      ...messageData,
      createdAt: new Date()
    }]);

    setNewMessage('');
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '260px', width: '100%' }}>
        <Navbar />
        <div className="container mt-4">
          <h3 className="mb-4">💬 Chat with Farmers</h3>

          <div className="row">
            {/* Farmers List */}
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <strong>Available Farmers</strong>
                </div>
                <div className="list-group list-group-flush">
                  {farmers.map(farmer => (
                    <button
                      key={farmer._id}
                      className={`list-group-item list-group-item-action ${selectedFarmer?._id === farmer._id ? 'active' : ''}`}
                      onClick={() => setSelectedFarmer(farmer)}
                    >
                      <strong>{farmer.name}</strong><br />
                      <small className="text-muted">{farmer.location}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-md-8">
              {selectedFarmer ? (
                <div className="card" style={{ minHeight: '620px' }}>
                  <div className="card-header bg-success text-white d-flex justify-content-between">
                    <strong>Chat with {selectedFarmer.name}</strong>
                    <small>{selectedFarmer.location}</small>
                  </div>

                  <div className="card-body overflow-auto" style={{ height: '480px' }}>
                    {messages.length === 0 ? (
                      <p className="text-center text-muted mt-5">No messages yet. Say hello!</p>
                    ) : (
                      messages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`mb-3 ${msg.senderId === user.id ? 'text-end' : ''}`}
                        >
                          <div 
                            className={`d-inline-block p-3 rounded-3 ${
                              msg.senderId === user.id 
                                ? 'bg-success text-white' 
                                : 'bg-light border'
                            }`}
                          >
                            {msg.message}
                          </div>
                          <small className="text-muted d-block mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="card-footer p-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Type your message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <button className="btn btn-success" onClick={sendMessage}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card h-100 d-flex align-items-center justify-content-center text-muted" style={{ minHeight: '500px' }}>
                  Select a farmer from the list to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}