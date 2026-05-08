import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BOOKS } from '../data/books';
import { getBookRating } from '../data/storage';
import { scoreColorKey } from '../utils/scoreUtils';
import { SCORE_COLORS } from '../data/books';
import BookAnalysis from '../components/BookAnalysis';
import SkillRatingModal from '../components/SkillRatingModal';

export default function BookAnalysisPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const book = BOOKS.find(b => b.id === bookId);
  const ratingData = getBookRating(bookId);

  if (!book) {
    return (
      <div className="page-fade error-page">
        <p>Book not found.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>← Back to Books</button>
      </div>
    );
  }

  if (!ratingData) {
    return (
      <div className="page-fade error-page">
        <p>No ratings found for this book yet.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>← Back to Books</button>
      </div>
    );
  }

  const avgKey = scoreColorKey(ratingData.averageScore);
  const avgSc = SCORE_COLORS[avgKey];

  const handleUpdateClose = () => {
    setShowModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleUpdateSubmit = (b, saved) => {
    setShowModal(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="page-fade book-analysis-page" key={refreshKey}>
      {/* Back nav */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Books
      </button>

      {/* Book Hero Header */}
      <div className="book-hero-strip" style={{ background: book.bgGradient }}>
        <span className="book-hero-emoji">{book.emoji}</span>
        <div className="book-hero-text">
          <h2 className="book-hero-name">{book.name}</h2>
          <p className="book-hero-scientist">{book.scientist}</p>
        </div>
        <span
          className="avg-badge avg-badge-hero"
          style={{ background: avgSc.bg, color: avgSc.text, border: `1.5px solid ${avgSc.border}` }}
        >
          Avg: {ratingData.averageScore.toFixed(1)} / 4
        </span>
      </div>

      {/* Analysis Component */}
      <div className="page-inner">
        <BookAnalysis book={book} ratingData={ratingData} />

        {/* Action buttons */}
        <div className="analysis-action-row">
          <button
            className="btn-secondary"
            onClick={() => setShowModal(true)}
          >
            ✏️ Update Ratings
          </button>
          <button
            className="btn-primary"
            style={{ background: book.bgGradient }}
            onClick={() => navigate('/overall')}
          >
            Continue to Overall Analysis →
          </button>
        </div>
      </div>

      {showModal && (
        <SkillRatingModal
          book={book}
          onClose={handleUpdateClose}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
}
