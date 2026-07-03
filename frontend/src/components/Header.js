import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_SMOOTH, tapScale } from '../utils/motion';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <motion.header
      className={`hd ${scrolled || !isHome ? 'hd-solid' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_SMOOTH }}
    >
      <div className="hd-inner">
        <Link to="/" className="hd-brand">
          <span className="hd-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 18 L9 10 L13 13 L15 11 L21 18 Z" fill="currentColor"/>
              <circle cx="16" cy="7" r="1.8" fill="currentColor"/>
            </svg>
          </span>
          <span className="hd-name">Parahyangan</span>
        </Link>

        <nav className="hd-nav">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/destinasi">Destinasi</NavLink>
          <NavLink to="/tentang">Tentang</NavLink>
        </nav>

        <motion.button
          className={`hd-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          whileTap={tapScale}
        >
          <span></span>
          <span></span>
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="hd-drawer"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_SMOOTH }}
          >
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Beranda</NavLink>
            <NavLink to="/destinasi" onClick={() => setMenuOpen(false)}>Destinasi</NavLink>
            <NavLink to="/tentang" onClick={() => setMenuOpen(false)}>Tentang</NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
