import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for offline PWA functionality (subpath-aware)
if ('serviceWorker' in navigator && (process.env.NODE_ENV === 'production' || (import.meta as any).env?.PROD)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('[SW] Registered with scope:', reg.scope))
      .catch((err) => console.log('[SW] Registration error:', err));
  });
}
