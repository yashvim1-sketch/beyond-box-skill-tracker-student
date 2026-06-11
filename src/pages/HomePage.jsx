import React, { useState, useCallback } from 'react';
import { BOOKS } from '../data/books';
import { getAllRatings, clearBookRating, saveRemarks, getRemarks } from '../data/storage';
import { getMotivationalText } from '../utils/scoreUtils';
import BookCard from '../components/BookCard';
import SkillRatingModal from '../components/SkillRatingModal';
import ProgressBar from '../components/ProgressBar';

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [remarks, setRemarks] = useState(getRemarks);
  const [remarksSaved, setRemarksSaved] = useState('');

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

  const handleUndoBook = useCallback((bookId) => {
    clearBookRating(bookId);
    setRefreshKey(k => k + 1);
  }, []);

  const handleSaveRemarks = () => {
    saveRemarks(remarks);
    setRemarksSaved('Remarks saved successfully!');
    setTimeout(() => setRemarksSaved(''), 3000);
  };

  return (
    <div className="page-fade home-page" key={refreshKey}>
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
              onSelect={handleSelectBook}
              onUndo={handleUndoBook}
            />
          ))}
        </div>
      </section>

      {/* Remarks Section */}
      <section className="remarks-section">
        <div className="page-inner">
          <div className="card tutor-comment-card">
            <h3 className="section-title">📝 Remarks</h3>
            <textarea
              className="tutor-comment-textarea"
              placeholder="Write your remarks here..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={6}
            />
            <div className="tutor-comment-footer">
              <button
                className="btn-primary tutor-comment-save-btn"
                onClick={handleSaveRemarks}
              >
                💾 Save Comment
              </button>
              {remarksSaved && (
                <span className="tutor-comment-success">✅ {remarksSaved}</span>
              )}
            </div>
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

      {/* Modal */}
      {selectedBook && (
        <SkillRatingModal
          book={selectedBook}
          onClose={handleModalClose}
          onSubmit={handleModalClose}
        />
      )}
    </div>
  );
}
