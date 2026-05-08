import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookAnalysisPage from './pages/BookAnalysisPage';
import OverallPage from './pages/OverallPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:bookId" element={<BookAnalysisPage />} />
        <Route path="/overall" element={<OverallPage />} />
      </Routes>
    </Router>
  );
}
