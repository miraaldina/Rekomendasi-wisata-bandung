import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from './utils/utils';
import { EASE_SMOOTH } from './utils/motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DestinasiPage from './pages/DestinasiPage';
import DetailPage from './pages/DetailPage';
import TentangPage from './pages/TentangPage';
import './App.css';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  return null;
}

// Crossfade halaman lama & baru SECARA BERSAMAAN (bukan tunggu halaman lama
// hilang total baru halaman baru muncul — itu yang bikin terasa delay).
// Keduanya ditumpuk di sel grid yang sama (lihat "main { display: grid }"
// di App.css) supaya tidak saling dorong/tabrakan layout selagi bertransisi.
function AnimatedRoutes({ destinations, categories, cities }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: EASE_SMOOTH }}
        style={{ gridColumn: 1, gridRow: 1 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage destinations={destinations} categories={categories} cities={cities} />} />
          <Route path="/destinasi" element={<DestinasiPage destinations={destinations} categories={categories} cities={cities} />} />
          <Route path="/destinasi/:id" element={<DetailPage destinations={destinations} />} />
          <Route path="/tentang" element={<TentangPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/destinations`).then(r => r.json()).then(d => setDestinations(d.data)).catch(() => {});
    fetch(`${API_URL}/categories`).then(r => r.json()).then(d => setCategories(d.data)).catch(() => {});
    fetch(`${API_URL}/cities`).then(r => r.json()).then(d => setCities(d.data)).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <AnimatedRoutes destinations={destinations} categories={categories} cities={cities} />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;