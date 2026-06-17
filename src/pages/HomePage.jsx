import React, { useState, useCallback } from 'react';
import { BOOKS } from '../data/books';
import { getAllRatings, clearBookRating, saveRemarks, getRemarks } from '../data/storage';
import { getMotivationalText } from '../utils/scoreUtils';
import BookCard from '../components/BookCard';
import SkillRatingModal from '../components/SkillRatingModal';
import ProgressBar from '../components/ProgressBar';
import useWixBridge from '../hooks/useWixBridge';

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [remarks, setRemarks] = useState(getRemarks);
  const [remarksSaved, setRemarksSaved] = useState('');

  // Wix bridge — handles role, canEdit, CMS syncing via postMessage
  const {
    wixReady,
    canEdit,
    inWix,
    saveScoresToWix,
    saveRemarksToWix
  } = useWixBridge();

  const allRatings = getAllRatings();
  const completedIds = new Set(allRatings.map(r => r.bookId));
  const completedCount = completedIds.size;
  const totalCount = BOOKS.length;
  const progressValue = totalCount > 0 ? completedCount / totalCount : 0;
  const motivationalText = getMotivationalText(completedCount, totalCount);
  const canViewDashboard = completedCount > 0;

  const handleSelectBook = useCallback((book) => {
    setSelectedBook(book);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedBook(null);
    setRefreshKey(k => k + 1);
  }, []);

  // Called by SkillRatingModal after saving locally — also syncs to Wix CMS
  const handleModalSubmit = useCallback((book, ratings) => {
    setSelectedBook(null);
    setRefreshKey(k => k + 1);
    if (inWix && canEdit && book && ratings) {
      saveScoresToWix(book.id, book.name, ratings);
    }
  }, [inWix, canEdit, saveScoresToWix]);

  const handleUndoBook = useCallback((bookId) => {
    if (!canEdit) return; // tutor_student cannot undo
    clearBookRating(bookId);
    setRefreshKey(k => k + 1);
  }, [canEdit]);

  const handleSaveRemarks = () => {
    saveRemarks(remarks);
    if (inWix && canEdit) {
      saveRemarksToWix(remarks);
    }
    setRemarksSaved('Remarks saved successfully!');
    setTimeout(() => setRemarksSaved(''), 3000);
  };

  // ── Loading state (inside Wix iframe, waiting for WIX_INIT) ──────────────
  if (!wixReady) {
    return (
      <div className="skill-tracker-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your Skill Tracker...</p>
      </div>
    );
  }

  return (
    <div className="page-fade home-page" key={refreshKey}>

      {/* ── Tutor-Student Access Restriction Banner ──────────────── */}
      {!canEdit && (
        <div className="access-restriction-banner" role="alert">
          <span className="access-restriction-icon">🔒</span>
          <div className="access-restriction-text">
            <strong>View Only</strong>
            <p>You don't have access to edit your marks. Your tutor will update them for you.</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <header className="home-header">
        <div className="home-header-gradient-strip"></div>
        <div className="home-header-inner">
          <div className="logo-text">
            <span className="logo-emoji">📚</span>
            <span className="logo-title">Skill Tracker</span>
          </div>
          <p className="home-subtitle">
            Tracking skills, confidence, and creativity in one journey 🌱
          </p>
        </div>
      </header>

      {/* Progress Section */}
      <section className="progress-section">
        <div className="progress-section-inner card">
          <ProgressBar
            value={progressValue}
            size={140}
            strokeWidth={13}
            color={completedCount === totalCount ? '#22C55E' : completedCount > 0 ? '#F97316' : '#CBD5E1'}
            label={`${completedCount}/${totalCount}`}
          />
          <div className="progress-text-block">
            <p className="progress-count">
              <strong>{completedCount}</strong> of <strong>{totalCount}</strong> books completed
            </p>
            <p className="progress-motivation">{motivationalText}</p>
          </div>
        </div>
      </section>

      {/* Book Grid */}
      <section className="books-section">
        <h2 className="books-section-title">📚 Your Book Collection</h2>
        <div className="books-grid">
          {BOOKS.map(book => (
            <BookCard
              key={book.id}
              book={book}
              canEdit={canEdit}
              onSelect={handleSelectBook}
              onUndo={handleUndoBook}
            />
          ))}
        </div>
      </section>

      {/* Remarks Section */}
      <section className="remarks-section">
        <div className="page-inner">
          <div className={`card tutor-comment-card ${!canEdit ? 'remarks-disabled' : ''}`}>
            <h3 className="section-title">📝 Remarks</h3>

            {!canEdit && (
              <p className="remarks-view-only-note">
                🔒 Remarks are managed by your tutor.
              </p>
            )}

            <textarea
              className="tutor-comment-textarea"
              placeholder={canEdit ? "Write your remarks here..." : "No remarks added yet."}
              value={remarks}
              onChange={e => canEdit && setRemarks(e.target.value)}
              rows={6}
              disabled={!canEdit}
              readOnly={!canEdit}
              aria-label="Remarks"
            />
            {canEdit && (
              <div className="tutor-comment-footer">
                <button
                  className="btn-primary tutor-comment-save-btn"
                  onClick={handleSaveRemarks}
                >
                  💾 Save Remarks
                </button>
                {remarksSaved && (
                  <span className="tutor-comment-success">✅ {remarksSaved}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard CTA */}
      <div className="overall-cta">
        {canViewDashboard ? (
          <a
            className="btn-primary btn-overall"
            href="https://www.thebeyondbox.org/student-dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Dashboard →
          </a>
        ) : (
          <button
            className="btn-primary btn-overall btn-disabled"
            disabled
            title="Complete at least 1 book to view dashboard"
          >
            View Dashboard
            <span className="btn-disabled-hint"> (complete a book first)</span>
          </button>
        )}
      </div>

      {/* Skill Rating Modal */}
      {selectedBook && (
        <SkillRatingModal
          book={selectedBook}
          canEdit={canEdit}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
