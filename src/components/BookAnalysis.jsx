import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { SKILLS, SCORE_COLORS } from '../data/books';
import { scoreColorKey, getTopSkill, getDevelopingSkill } from '../utils/scoreUtils';
import { generateBookInsight, generateSkillStory, getRecommendations } from '../utils/insightGenerator';
import SkillLegend from './SkillLegend';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function BookAnalysis({ book, ratingData }) {
  const { ratings, averageScore } = ratingData;

  const skillScores = SKILLS.map(s => ({ ...s, score: ratings[s.id] || 0 }));
  const skillAverages = {};
  SKILLS.forEach(s => { skillAverages[s.id] = ratings[s.id] || 0; });

  const topSkill = getTopSkill(skillAverages);
  const developingSkill = getDevelopingSkill(skillAverages);
  const insight = generateBookInsight(ratings, book.name);
  const story = generateSkillStory(ratings);
  const recommendations = getRecommendations(developingSkill.skill?.id);

  const avgKey = scoreColorKey(averageScore);
  const avgColor = SCORE_COLORS[avgKey];

  const radarData = {
    labels: SKILLS.map(s => `${s.icon} ${s.label}`),
    datasets: [{
      label: book.name,
      data: SKILLS.map(s => ratings[s.id] || 0),
      backgroundColor: hexToRgba(book.color, 0.3),
      borderColor: hexToRgba(book.color, 0.9),
      pointBackgroundColor: book.color,
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2.5
    }]
  };

  const radarOptions = {
    animation: { duration: 1000, easing: 'easeOutQuart' },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          font: { family: 'Inter', size: 11 },
          color: '#6B7280',
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: { family: 'Inter', size: 12, weight: '500' },
          color: '#374151'
        },
        grid: { color: '#E5E7EB' },
        angleLines: { color: '#E5E7EB' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.raw} / 4`
        }
      }
    }
  };

  return (
    <div className="book-analysis-container">
      {/* Avg badge */}
      <div className="avg-badge-wrapper">
        <span
          className="avg-badge"
          style={{ background: avgColor.bg, color: avgColor.text, border: `1.5px solid ${avgColor.border}` }}
        >
          Avg: {averageScore.toFixed(1)} / 4
        </span>
      </div>

      {/* Radar Chart */}
      <div className="card analysis-radar-card">
        <h3 className="section-title">Skills Overview</h3>
        <div style={{ height: 380, position: 'relative' }}>
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      {/* Skill pills */}
      <div className="card">
        <h3 className="section-title">Skill Scores</h3>
        <div className="skill-pills-row">
          {skillScores.map(s => {
            const key = scoreColorKey(s.score);
            const sc = SCORE_COLORS[key];
            return (
              <div
                key={s.id}
                className="skill-score-pill"
                style={{ background: sc.bg, borderColor: sc.border, color: sc.text }}
              >
                <span className="skill-score-pill-icon">{s.icon}</span>
                <span className="skill-score-pill-label">{s.label}</span>
                <span className="skill-desc" style={{ marginTop: 0, marginBottom: 4 }}>{s.desc}</span>
                <span className="skill-score-pill-score">{s.score} / 4</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strongest & Developing */}
      <div className="two-col-cards">
        <div className="card strength-card">
          <div className="strength-icon">⭐</div>
          <div className="strength-tag">Strongest Skill</div>
          <div className="strength-name">{topSkill.skill?.label}</div>
          <div className="strength-score">{topSkill.value} / 4</div>
        </div>
        <div className="card developing-card">
          <div className="strength-icon">🌱</div>
          <div className="strength-tag">Developing Steadily</div>
          <div className="strength-name">{developingSkill.skill?.label}</div>
          <div className="developing-note">Growing with every activity</div>
        </div>
      </div>

      {/* Personalized Insight */}
      <div className="card insight-card">
        <h3 className="section-title">✨ Personalized Insight</h3>
        <p className="insight-text">{insight}</p>
        <p className="skill-story">{story}</p>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 className="section-title">🎯 Activity Recommendations</h3>
        <p className="rec-subtitle">Based on your child's developing {developingSkill.skill?.label} skill:</p>
        <div className="rec-pills-row">
          {recommendations.map(rec => (
            <div key={rec.label} className="rec-pill">
              <span className="rec-pill-icon">{rec.icon}</span>
              <span className="rec-pill-label">{rec.label}</span>
            </div>
          ))}
        </div>
      </div>

      <SkillLegend />
    </div>
  );
}
