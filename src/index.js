import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ This is the most important line - Import Bootstrap CSS here
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';   // Your custom CSS (gradients, cards, etc.)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);