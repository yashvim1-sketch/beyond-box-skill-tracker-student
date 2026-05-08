import React from 'react';
import { useNavigate } from 'react-router-dom';
import OverallDashboard from '../components/OverallDashboard';

export default function OverallPage() {
  const navigate = useNavigate();

  return (
    <div className="page-fade overall-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Books
      </button>

      <div className="overall-page-header">
        <h1 className="overall-title">Overall Growth Summary</h1>
        <p className="overall-subtitle">
          Your child's complete learning journey across the Humans of Science STEM Series
        </p>
      </div>

      <div className="page-inner">
        <OverallDashboard />
      </div>
    </div>
  );
}
