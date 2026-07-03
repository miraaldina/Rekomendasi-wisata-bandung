import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Catatan: React.StrictMode sengaja TIDAK dipakai di sini.
// StrictMode melakukan mount→unmount→mount ganda di mode development
// untuk membantu mendeteksi bug, tapi itu bikin AnimatePresence dari
// framer-motion "bingung" melacak elemen yang sedang keluar — akibatnya
// animasi transisi antar halaman jadi terpotong instan (tanpa fade)
// setiap kali dijalankan lewat `npm start`. Build produksi sebenarnya
// tidak terpengaruh (StrictMode otomatis nonaktif di production build),
// tapi supaya transisi terlihat mulus juga saat development, StrictMode
// dilepas di sini.
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();