import React, { useState } from 'react';
import { getBookRating } from '../data/storage';

export default function BookCard({ book, onSelect, onUndo }) {
  const saved = getBookRating(book.id);
  const isCompleted = !!saved;
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUndoClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmUndo = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
    if (onUndo) onUndo(book.id);
  };

  const handleCancelUndo = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div
      className={`book-card ${isCompleted ? 'book-card--completed' : ''}`}
      style={{
        background: book.bgGradient,
        boxShadow: isCompleted
          ? `0 0 0 3px ${book.color}, 0 8px 30px ${book.color}44`
          : '0 4px 20px rgba(0,0,0,0.12)'
      }}
      onClick={() => {
        if (!showConfirm) onSelect(book);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Evaluate ${book.name}`}
      onKeyDown={e => e.key === 'Enter' && !showConfirm && onSelect(book)}
    >
      <div className="book-card-emoji">{book.emoji}</div>
      <div className="book-card-body">
        <h3 className="book-card-title">{book.name}</h3>
        <p className="book-card-scientist">{book.scientist}</p>
        <p className="book-card-desc">{book.description}</p>
      </div>
      <div className="book-card-footer">
        {isCompleted ? (
          <span className="book-card-status book-card-status--done">
            ✅ Completed
          </span>
        ) : (
          <span className="book-card-status book-card-status--todo">
            Tap to evaluate
          </span>
        )}
      </div>

      {isCompleted && !showConfirm && (
        <button className="book-card-undo" onClick={handleUndoClick}>
          ↩ Undo
        </button>
      )}

      {showConfirm && (
        <div className="undo-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="undo-dialog-title">Remove this analysis?</div>
          <div className="undo-dialog-msg">This will delete the ratings you submitted for {book.name}. You can fill it in again anytime.</div>
          <div className="undo-dialog-actions">
            <button className="btn-undo-confirm" onClick={handleConfirmUndo}>Yes, Remove</button>
            <button className="btn-undo-cancel" onClick={handleCancelUndo}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
