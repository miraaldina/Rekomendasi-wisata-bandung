import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationCard from '../card/DestinationCard';
import { fadeUp, viewportOnce } from '../utils/motion';

// Setiap kartu mengamati posisi scroll-nya sendiri (whileInView bawaan
// framer-motion), jadi otomatis "muncul" saat masuk layar — baik scroll
// ke bawah maupun ke atas — tanpa perlu IntersectionObserver manual.
// Variant & easing-nya sama persis dengan kartu di halaman lain (Home,
// Detail) supaya terasa senada di seluruh situs.
function AnimatedCard({ destination, onClick }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <DestinationCard destination={destination} onClick={onClick} />
    </motion.div>
  );
}

function DestinasiPage({ destinations, categories, cities }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cityFilter, setCityFilter] = useState(searchParams.get('wilayah') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('kategori') || '');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [pageKey, setPageKey] = useState(Date.now());

  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setPageKey(Date.now());
    }
  }, [location.pathname]);

  useEffect(() => {
    setPageKey(Date.now());
  }, []);

  useEffect(() => {
    const params = {};
    if (cityFilter) params.wilayah = cityFilter;
    if (categoryFilter) params.kategori = categoryFilter;
    if (search) params.q = search;
    setSearchParams(params, { replace: true });
  }, [cityFilter, categoryFilter, search, setSearchParams]);

  useEffect(() => {
    setCategoryFilter(searchParams.get('kategori') || '');
    setCityFilter(searchParams.get('wilayah') || '');
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleClick = (placeId) => navigate(`/destinasi/${placeId}`);

  const filtered = destinations
    .filter(d => !cityFilter || d.city === cityFilter)
    .filter(d => !categoryFilter || d.category === categoryFilter)
    .filter(d => !search || d.place_name.toLowerCase().includes(search.toLowerCase()));

  const hasActiveFilter = cityFilter || categoryFilter || search;

  return (
    <section className="pg">

      {/* PAGE HEADER */}
      <div className="pg-head">
        <div className="pg-head-inner">
          <span className="sec-eyebrow">Eksplorasi</span>

          <h1>
            <AnimatePresence mode="wait">
              <motion.span
                key={categoryFilter || cityFilter || 'default'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'block' }}
              >
                {categoryFilter ? (
                  <>Destinasi<br />{categoryFilter}</>
                ) : cityFilter ? (
                  <>Destinasi di<br />{cityFilter}</>
                ) : (
                  <>Semua destinasi<br />Bandung Raya</>
                )}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p>Klik kartu destinasi untuk melihat rekomendasi serupa.</p>
        </div>
      </div>

      <div className="pg-inner">

        {/* FILTERS */}
        <div className="pg-filters">
          <div className="pg-search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11 L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Cari nama destinasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">Semua wilayah</option>
            {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Semua kategori</option>
            {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* COUNT + CLEAR */}
        <div className="pg-count">
          <strong>{filtered.length}</strong> destinasi ditemukan
          <AnimatePresence>
            {hasActiveFilter && (
              <motion.button
                className="pg-clear"
                onClick={() => { setCityFilter(''); setCategoryFilter(''); setSearch(''); }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Bersihkan filter ×
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* CARDS / EMPTY */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <div key={`cards-${pageKey}`} className="cards-grid">
              {filtered.map((d) => (
                <AnimatedCard
                  key={d.place_id}
                  destination={d}
                  onClick={() => handleClick(d.place_id)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              key="empty"
              className="pg-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
            >
              <p>Tidak ada destinasi yang cocok dengan filter Anda.</p>
              <motion.button
                onClick={() => { setCityFilter(''); setCategoryFilter(''); setSearch(''); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset filter
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

export default DestinasiPage;