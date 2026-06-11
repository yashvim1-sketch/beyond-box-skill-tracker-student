import React, { useState, useEffect } from 'react';
import { SKILLS, RATING_COLORS } from '../data/books';
import { getBookRating, saveBookRating } from '../data/storage';
import SkillLegend from './SkillLegend';

/**
 * SkillRatingModal
 *
 * Props:
 *  - book     {object}   The book being rated
 *  - canEdit  {boolean}  If false (tutor_student), all inputs are disabled/read-only
 *  - onClose  {fn}       Called when the X button is clicked (no save)
 *  - onSubmit {fn}       Called as onSubmit(book, ratings) after a successful save
 */
export default function SkillRatingModal({ book, canEdit = true, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const existing = getBookRating(book.id);

  useEffect(() => {
    const existingData = getBookRating(book.id);
    if (existingData) {
      setRatings(existingData.ratings);
    }
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsVisible(true), 10);

    return () => {
      document.body.style.overflow = '';
    };
  }, [book.id]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSelect = (skillId, value) => {
    if (!canEdit) return; // guard against keyboard events when disabled
    setRatings(prev => ({ ...prev, [skillId]: value }));
  };

  const allRated = SKILLS.every(s => ratings[s.id] !== undefined);

  const handleSubmit = () => {
    if (!allRated || !canEdit) return;
    // Save to localStorage first (works in standalone + Wix modes)
    saveBookRating(book.id, ratings);
    setIsVisible(false);
    // Pass book + ratings back so HomePage can sync to Wix CMS
    setTimeout(() => onSubmit(book, ratings), 300);
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
              <p className="modal-subtitle">
                {canEdit ? 'How did this book help your child?' : 'Skill ratings for this book'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">

          {/* ── Restriction message for tutor_student ──────────── */}
          {!canEdit && (
            <div className="modal-restriction-msg" role="alert">
              <span className="modal-restriction-icon">🔒</span>
              <span>You don't have access to edit your marks. Your tutor will update them for you.</span>
            </div>
          )}

          {/* Skill rows */}
          {SKILLS.map(skill => {
            const selected = ratings[skill.id];
            return (
              <div key={skill.id} className={`skill-row ${!canEdit ? 'skill-row--disabled' : ''}`}>
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
                        className={`rating-pill ${isSelected ? 'rating-pill--selected' : ''} ${!canEdit ? 'rating-pill--readonly' : ''}`}
                        style={isSelected ? {
                          background:  rc.bg,
                          color:       rc.text,
                          transform:   'scale(1.08)',
                          boxShadow:   `0 4px 14px ${rc.bg}88`,
                          border:      `2px solid ${rc.bg}`
                        } : {}}
                        onClick={() => handleSelect(skill.id, val)}
                        disabled={!canEdit}
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

          {/* Submit — only shown for home_learner (canEdit = true) */}
          {canEdit && (
            <button
              className="btn-primary modal-submit-btn"
              style={allRated ? { background: book.bgGradient } : {}}
              disabled={!allRated}
              onClick={handleSubmit}
            >
              {existing ? 'Update Scores' : 'Save Scores'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
