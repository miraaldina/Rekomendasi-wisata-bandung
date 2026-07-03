import React from 'react';
import { motion } from 'framer-motion';
import { getDestinationImage, Icons } from '../utils/utils';
import { hoverLift, tapScale } from '../utils/motion';

function DestinationCard({ destination, onClick, compact = false }) {
  return (
    <motion.article
      className={`dest-card ${compact ? 'compact' : ''}`}
      onClick={onClick}
      whileHover={hoverLift}
      whileTap={tapScale}
    >
      <div
        className="dest-card-img"
        style={{ backgroundImage: `url(${getDestinationImage(destination.place_name, destination.category, destination.place_id)})` }}
      >
        <span className="dest-card-tag">{destination.category}</span>
      </div>
      <div className="dest-card-body">
        <h3 className="dest-card-name">{destination.place_name}</h3>
        {!compact && destination.description && (
          <p className="dest-card-desc">{destination.description}</p>
        )}
        <div className="dest-card-meta">
          <span className="dest-card-loc">
            {Icons.pin(12)} {destination.city}
          </span>
          <span className="dest-card-cta">
            Selengkapnya {Icons.arrow(12)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default DestinationCard;
