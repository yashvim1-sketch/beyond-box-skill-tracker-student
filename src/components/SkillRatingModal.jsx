import React, { useState, useEffect } from 'react';
import { SKILLS, RATING_COLORS } from '../data/books';
import { getBookRating, saveBookRating } from '../data/storage';
import SkillLegend from './SkillLegend';

export default function SkillRatingModal({ book, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const existing = getBookRating(book.id);

  useEffect(() => {
    const existingData = getBookRating(book.id);
    if (existingData) {
      setRatings(existingData.ratings);
    }
    // Animate in
    setTimeout(() => setIsVisible(true), 10);
  }, [book.id]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSelect = (skillId, value) => {
    setRatings(prev => ({ ...prev, [skillId]: value }));
  };

  const allRated = SKILLS.every(s => ratings[s.id] !== undefined);

  const handleSubmit = () => {
    if (!allRated) return;
    const saved = saveBookRating(book.id, ratings);
    setIsVisible(false);
    setTimeout(() => onSubmit(book, saved), 300);
  };

  return (
    <div
      className="modal-overlay"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}
      onClick={e => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Rate skills for ${book.name}`}
    >
      <div
        <div
        className="modal-sheet"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(0.96)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.25s ease, opacity 0.25s ease'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: book.bgGradient }}>
          <div className="modal-header-left">
            <span className="modal-book-emoji">{book.emoji}</span>
            <div>
              <h2 className="modal-book-name">{book.name}</h2>
              <p className="modal-subtitle">How did this book help your child?</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">
          {/* Skill rows */}
          {SKILLS.map(skill => {
            const selected = ratings[skill.id];
            return (
              <div key={skill.id} className="skill-row">
                <div className="skill-row-header">
                  <span className="skill-icon">{skill.icon}</span>
                  <div className="skill-name">
                    {skill.label}
                    <span className="skill-desc">{skill.desc}</span>
                  </div>
                  <div className="skill-tooltip-wrapper">
                    <button
                      className="skill-tooltip-btn"
                      onMouseEnter={() => setTooltipVisible(skill.id)}
                      onMouseLeave={() => setTooltipVisible(null)}
                      onFocus={() => setTooltipVisible(skill.id)}
                      onBlur={() => setTooltipVisible(null)}
                      aria-label={`Info: ${skill.tooltip}`}
                    >
                      ❓
                    </button>
                    {tooltipVisible === skill.id && (
                      <div className="skill-tooltip-box">{skill.tooltip}</div>
                    )}
                  </div>
                </div>
                <div className="rating-pills-row">
                  {[1, 2, 3, 4].map(val => {
                    const isSelected = selected === val;
                    const rc = RATING_COLORS[val];
                    return (
                      <button
                        key={val}
                        className={`rating-pill ${isSelected ? 'rating-pill--selected' : ''}`}
                        style={isSelected ? {
                          background: rc.bg,
                          color: rc.text,
                          transform: 'scale(1.08)',
                          boxShadow: `0 4px 14px ${rc.bg}88`,
                          border: `2px solid ${rc.bg}`
                        } : {}}
                        onClick={() => handleSelect(skill.id, val)}
                        aria-label={`${rc.label} for ${skill.label}`}
                        aria-pressed={isSelected}
                      >
                        {rc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <SkillLegend compact />

          {/* Submit */}
          <button
            className="btn-primary modal-submit-btn"
            style={allRated ? { background: book.bgGradient } : {}}
            disabled={!allRated}
            onClick={handleSubmit}
          >
            {existing ? "Update Analysis →" : "Generate Analysis →"}
          </button>
        </div>
      </div>
    </div>
  );
}
