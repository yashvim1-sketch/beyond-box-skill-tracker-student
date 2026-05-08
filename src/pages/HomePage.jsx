import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BOOKS } from '../data/books';
import { getAllRatings, clearBookRating } from '../data/storage';
import { getMotivationalText } from '../utils/scoreUtils';
import BookCard from '../components/BookCard';
import SkillRatingModal from '../components/SkillRatingModal';
import ProgressBar from '../components/ProgressBar';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const allRatings = getAllRatings();
  const completedIds = new Set(allRatings.map(r => r.bookId));
  const completedCount = completedIds.size;
  const totalCount = BOOKS.length;
  const progressValue = totalCount > 0 ? completedCount / totalCount : 0;
  const motivationalText = getMotivationalText(completedCount, totalCount);
  const canViewOverall = completedCount > 0;

  const handleSelectBook = useCallback((book) => {
    setSelectedBook(book);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedBook(null);
    setRefreshKey(k => k + 1);
  }, []);

  const handleModalSubmit = useCallback((book, saved) => {
    setSelectedBook(null);
    setRefreshKey(k => k + 1);
    navigate(`/book/${book.id}`);
  }, [navigate]);

  const handleUndoBook = useCallback((bookId) => {
    clearBookRating(bookId);
    setRefreshKey(k => k + 1);
  }, []);

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

      {/* Overall CTA */}
      <div className="overall-cta">
        {canViewOverall ? (
          <button
            className="btn-primary btn-overall"
            onClick={() => navigate('/overall')}
          >
            View Overall Analysis →
          </button>
        ) : (
          <button
            className="btn-primary btn-overall btn-disabled"
            disabled
            title="Complete at least 1 book to view analysis"
          >
            View Overall Analysis
            <span className="btn-disabled-hint"> (complete a book first)</span>
          </button>
        )}
      </div>

      {/* Modal */}
      {selectedBook && (
        <SkillRatingModal
          book={selectedBook}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
