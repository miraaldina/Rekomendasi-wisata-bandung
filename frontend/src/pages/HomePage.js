import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  API_URL,
  HERO_VIDEOS,
  SAMPLE_QUERIES,
  getDestinationImage,
  Icons
} from '../utils/utils';
import { fadeUp, staggerContainer, hoverScaleSm, tapScale, EASE_SMOOTH } from '../utils/motion';
import DestinationCard from '../card/DestinationCard';
import { FiSearch, FiMapPin, FiMessageCircle, FiChevronDown } from "react-icons/fi";

function HomePage({ destinations, categories, cities }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchMode, setSearchMode] = useState('place');
  const [searchQuery, setSearchQuery] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 8000);

    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowCityDropdown(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const filteredDest = destinations.filter(d =>
    d.place_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  const searchByPlace = async (placeName = null) => {
    const place = placeName || selectedPlace || searchQuery;
    if (!place) { setError('Pilih destinasi terlebih dahulu.'); return; }
    const found = destinations.find(d => d.place_name.toLowerCase().includes(place.toLowerCase()));
    if (found) navigate(`/destinasi/${found.place_id}`);
    else setError(`Destinasi "${place}" tidak ditemukan.`);
  };

  const searchByText = async (q = null) => {
    const query = q || textQuery;
    if (!query || query.trim().length < 3) { setError('Ketik deskripsi minimal 3 karakter.'); return; }
    setLoading(true); setError('');
    try {
      const body = { query: query.trim(), top_n: 1 };
      if (cityFilter) body.city = cityFilter;
      if (categoryFilter) body.category = categoryFilter;
      const res = await fetch(`${API_URL}/recommendations-by-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error || !data.recommendations || data.recommendations.length === 0) {
        setError(data.message || 'Tidak ditemukan destinasi yang sesuai. Coba kata kunci lain.');
      } else {
        navigate(`/destinasi/${data.recommendations[0].place_id}`);
      }
    } catch { setError('Gagal terhubung ke server.'); }
    finally { setLoading(false); }
  };

  const handleSubmit = () => searchMode === 'place' ? searchByPlace() : searchByText();

  const selectPlace = (name) => {
    const found = destinations.find(d => d.place_name === name);
    setSelectedPlace(name);
    setSearchQuery(name);
    setShowDropdown(false);
    if (found) navigate(`/destinasi/${found.place_id}`);
  };

  const onCardClick = (placeId) => navigate(`/destinasi/${placeId}`);

  const byCategory = {};
  destinations.forEach(d => {
    if (!byCategory[d.category]) byCategory[d.category] = [];
    byCategory[d.category].push(d);
  });
  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen">

        {/* Background Video — gradasi biru di belakang sebagai fallback,
            supaya kalau video belum sempat termuat (mis. baru saja
            mount ulang setelah pindah halaman), yang terlihat tetap
            enak dipandang, bukan kotak abu-abu polos */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #6f6b67, #322f2c)' }}
        >
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={i}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === heroIdx ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content — animasi masuk otomatis terpicu ulang tiap kali HomePage mount (mis. pindah halaman lalu kembali) */}
        <div className="relative z-20 flex min-h-screen items-center justify-center px-6 pt-24 md:pt-28">
          <div className="w-full max-w-6xl text-center text-white">

            <motion.h1
              className="hero-title"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Temukan tempat<br />
              yang <em>tepat untukmu</em>
            </motion.h1>

            <motion.p
              className="hero-sub"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Dari kawah belerang yang misterius hingga kebun teh berembun pagi
              biarkan kami merekomendasikan destinasi yang sesuai selera Anda.
            </motion.p>

            <motion.div
              className="mb-6 flex justify-center"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <div className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 p-1.5 shadow-lg backdrop-blur-xl">
                <motion.button
                  onClick={() => { setSearchMode('place'); setError(''); }}
                  whileTap={tapScale}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 sm:px-6 ${
                    searchMode === 'place' ? 'text-[#4a4745]' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {searchMode === 'place' && (
                    <motion.span
                      layoutId="hero-tab-highlight"
                      className="absolute inset-0 rounded-full bg-white shadow-md"
                      transition={{ duration: 0.45, ease: EASE_SMOOTH }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <FiMapPin size={14} />
                    Cari Berdasarkan Tempat
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => { setSearchMode('text'); setError(''); }}
                  whileTap={tapScale}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 sm:px-6 ${
                    searchMode === 'text' ? 'text-[#4a4745]' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {searchMode === 'text' && (
                    <motion.span
                      layoutId="hero-tab-highlight"
                      className="absolute inset-0 rounded-full bg-white shadow-md"
                      transition={{ duration: 0.45, ease: EASE_SMOOTH }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <FiMessageCircle size={14} />
                    Ceritakan Keinginanmu
                  </span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              layout
              className="mx-auto mt-6 max-w-4xl"
              transition={{ layout: { duration: 0.45, ease: EASE_SMOOTH } }}
            >
              <AnimatePresence mode="popLayout">
                {searchMode === 'place' ? (
                  <motion.div
                    key="place"
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32, ease: EASE_SMOOTH }}
                  >
                    <div className="flex flex-col rounded-[28px] border border-white/25 bg-white/10 shadow-2xl backdrop-blur-2xl md:flex-row md:items-stretch md:rounded-full">

                      {/* Tujuan */}
                      <div className="relative flex-1 px-6 py-2.5 md:py-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/55">
                          Tujuan
                        </label>
                        <input
                          type="text"
                          placeholder="Mau ke mana?"
                          value={searchQuery}
                          onChange={(e) => { setSearchQuery(e.target.value); setSelectedPlace(''); setShowDropdown(true); }}
                          onFocus={() => setShowDropdown(true)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                        />
                        <AnimatePresence>
                          {showDropdown && searchQuery && filteredDest.length > 0 && (
                            <motion.div
                              className="absolute left-0 right-0 z-50 mt-3 max-h-80 overflow-y-auto rounded-2xl border border-black/5 bg-white shadow-2xl"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                            >
                              {filteredDest.map((d) => (
                                <button
                                  key={d.place_id}
                                  type="button"
                                  onClick={() => selectPlace(d.place_name)}
                                  className="flex w-full items-center gap-3 border-b border-black/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#faf6ee]"
                                >
                                  <img
                                    src={getDestinationImage(d.place_name, d.category, d.place_id)}
                                    alt={d.place_name}
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                  <div className="min-w-0">
                                    <div className="truncate font-medium text-[#1a1f1a]">{d.place_name}</div>
                                    <div className="text-sm text-[#5c615c]">{d.category} • {d.city}</div>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="mx-6 hidden w-px bg-white/15 md:my-3 md:block" />
                      <div className="mx-6 h-px bg-white/15 md:hidden" />

                      {/* Wilayah */}
                      <div className="relative flex-none px-6 py-2.5 md:py-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/55">
                          Wilayah
                        </label>
                        <button
                          type="button"
                          onClick={() => { setShowCityDropdown(!showCityDropdown); setShowCategoryDropdown(false); }}
                          className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm text-white outline-none"
                        >
                          <span className="truncate">{cityFilter || 'Semua wilayah'}</span>
                          <FiChevronDown size={14} className={`shrink-0 text-white/50 transition-transform duration-300 ${showCityDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {showCityDropdown && (
                            <motion.div
                              className="absolute left-0 right-0 top-full z-50 mt-3 max-h-80 w-56 overflow-y-auto rounded-2xl border border-black/5 bg-white shadow-2xl"
                              style={{ scrollbarWidth: 'thin' }}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <button
                                className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#faf6ee] ${!cityFilter ? 'font-semibold text-[#4a4745]' : 'text-[#2d322d]'}`}
                                onClick={() => { setCityFilter(''); setShowCityDropdown(false); }}
                              >
                                Semua wilayah
                              </button>
                              {cities.map((c) => (
                                <button
                                  key={c.name}
                                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#faf6ee] ${cityFilter === c.name ? 'font-semibold text-[#4a4745]' : 'text-[#2d322d]'}`}
                                  onClick={() => { setCityFilter(c.name); setShowCityDropdown(false); }}
                                >
                                  {c.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="mx-6 hidden w-px bg-white/15 md:my-3 md:block" />
                      <div className="mx-6 h-px bg-white/15 md:hidden" />

                      {/* Kategori */}
                      <div className="relative flex-none px-6 py-2.5 md:py-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/55">
                          Kategori
                        </label>
                        <button
                          type="button"
                          onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowCityDropdown(false); }}
                          className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm text-white outline-none"
                        >
                          <span className="truncate">{categoryFilter || 'Semua kategori'}</span>
                          <FiChevronDown size={14} className={`shrink-0 text-white/50 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {showCategoryDropdown && (
                            <motion.div
                              className="absolute left-0 right-0 top-full z-50 mt-3 max-h-64 w-56 overflow-y-auto rounded-2xl border border-black/5 bg-white shadow-2xl"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <button
                                className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#faf6ee] ${!categoryFilter ? 'font-semibold text-[#4a4745]' : 'text-[#2d322d]'}`}
                                onClick={() => { setCategoryFilter(''); setShowCategoryDropdown(false); }}
                              >
                                Semua kategori
                              </button>
                              {categories.map((c) => (
                                <button
                                  key={c.name}
                                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#faf6ee] ${categoryFilter === c.name ? 'font-semibold text-[#4a4745]' : 'text-[#2d322d]'}`}
                                  onClick={() => { setCategoryFilter(c.name); setShowCategoryDropdown(false); }}
                                >
                                  {c.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Tombol cari */}
                      <div className="p-2 md:py-2 md:pr-2">
                        <motion.button
                          onClick={handleSubmit}
                          whileHover={hoverScaleSm}
                          whileTap={tapScale}
                          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#76624C] text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#866F56] md:w-11"
                        >
                          <FiSearch size={18} />
                          <span className="md:hidden">Cari</span>
                        </motion.button>
                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32, ease: EASE_SMOOTH }}
                    className="flex flex-col items-center gap-5"
                  >
                    <div className="w-full rounded-[28px] border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
                      <div className="flex items-start gap-3">
                        <FiMessageCircle size={18} className="mt-1.5 shrink-0 text-white/45" />
                        <textarea
                          className="min-h-[44px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-white outline-none placeholder:text-white/40"
                          placeholder="Contoh: wisata alam dengan udara sejuk dan pemandangan gunung..."
                          value={textQuery}
                          onChange={(e) => setTextQuery(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); searchByText(); } }}
                          rows={2}
                        />
                      </div>
                      <div className="mt-3 flex flex-col gap-3 border-t border-white/15 pt-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white outline-none backdrop-blur-md">
                            <option className="text-black" value="">Semua wilayah</option>
                            {cities.map((c) => <option key={c.name} value={c.name} className="text-black">{c.name}</option>)}
                          </select>
                          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white outline-none backdrop-blur-md">
                            <option className="text-black" value="">Semua kategori</option>
                            {categories.map((c) => <option key={c.name} value={c.name} className="text-black">{c.name}</option>)}
                          </select>
                        </div>
                        <motion.button
                          onClick={handleSubmit}
                          disabled={!textQuery.trim() || loading}
                          whileHover={hoverScaleSm}
                          whileTap={tapScale}
                          className="flex items-center justify-center gap-2 rounded-full bg-[#76624C] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#866F56] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loading ? (
                            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>Mencari...</>
                          ) : (
                            <>Temukan {Icons.arrow(14)}</>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    <motion.div
                      className="flex flex-wrap items-center justify-center gap-2"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <span className="flex items-center gap-1.5 text-sm text-white/75">
                        {Icons.sparkle(12)} Coba:
                      </span>
                      {SAMPLE_QUERIES.map((q, i) => (
                        <motion.button
                          key={i}
                          variants={fadeUp}
                          custom={i}
                          onClick={() => { setTextQuery(q); searchByText(q); }}
                          disabled={loading}
                          whileHover={hoverScaleSm}
                          whileTap={tapScale}
                          className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-md transition-colors hover:bg-white/20 disabled:opacity-50"
                        >
                          {q}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="mt-4 text-red-300"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <motion.section
        className="stats-bar"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="stats-inner">
          {[
            { num: destinations.length, lbl: 'Destinasi pilihan' },
            { num: categories.length, lbl: 'Kategori wisata' },
            { num: cities.length, lbl: 'Wilayah Bandung' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}>
              <span className="stats-num">{s.num}</span>
              <span className="stats-lbl">{s.lbl}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FEATURED DESTINATIONS */}
      <section className="sec">
        <div className="sec-inner">
          <motion.div
            className="sec-head"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div>
              <span className="sec-eyebrow">Pilihan kami</span>
              <h2>Destinasi yang sedang ramai diminati</h2>
            </div>
            <button className="sec-link" onClick={() => navigate('/destinasi')}>
              Jelajahi semua {Icons.arrow(13)}
            </button>
          </motion.div>

          <motion.div
            className="cards-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {destinations.slice(0, 6).map((d, i) => (
              <motion.div key={d.place_id} variants={fadeUp} custom={i}>
                <DestinationCard destination={d} onClick={() => onCardClick(d.place_id)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="sec sec-warm">
        <div className="sec-inner">
          <motion.div
            className="sec-head"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div>
              <span className="sec-eyebrow">Telusuri</span>
              <h2>Berdasarkan kategori</h2>
            </div>
          </motion.div>

          <motion.div
            className="cat-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {topCategories.map(([cat, items], i) => (
              <motion.button
                key={cat}
                className="cat-tile"
                onClick={() => navigate(`/destinasi?kategori=${encodeURIComponent(cat)}`)}
                style={{ backgroundImage: `url(${getDestinationImage(items[0].place_name, cat, items[0].place_id)})` }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.35, ease: EASE_SMOOTH } }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="cat-overlay"></div>
                <div className="cat-content">
                  <h3>{cat}</h3>
                  <span>{items.length} destinasi {Icons.arrow(12)}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

    </>
  );
}

export default HomePage;