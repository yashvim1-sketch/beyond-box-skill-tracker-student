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
import { BOOKS, SKILLS, SCORE_COLORS } from '../data/books';
import { getAllRatings } from '../data/storage';
import {
  computeOverallAverage,
  computeSkillAverages,
  getTopSkill,
  getDevelopingSkill,
  scoreColorKey,
  getBadgeInfo
} from '../utils/scoreUtils';
import { generateOverallInsight } from '../utils/insightGenerator';
import ProgressBar from './ProgressBar';
import MilestoneBadge from './MilestoneBadge';
import SkillLegend from './SkillLegend';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function getScoreRingColor(avg) {
  if (avg > 3) return '#22C55E';
  if (avg >= 2) return '#F97316';
  return '#EF4444';
}

function getScoreRingLabel(avg) {
  if (avg > 3) return 'Excellent Progress!';
  if (avg >= 2) return 'Developing Well';
  return 'Keep Going! 💪';
}

export default function OverallDashboard() {
  const allRatings = getAllRatings();
  const completedBooks = BOOKS.filter(b => allRatings.find(r => r.bookId === b.id));
  const totalBooks = BOOKS.length;
  const completedCount = completedBooks.length;

  if (completedCount === 0) {
    return (
      <div className="overall-empty">
        <div className="overall-empty-emoji">📚</div>
        <h2>No books completed yet</h2>
        <p>Rate at least one book to view your overall analysis.</p>
      </div>
    );
  }

  const overallAvg = computeOverallAverage(allRatings);
  const skillAverages = computeSkillAverages(allRatings);
  const topSkill = getTopSkill(skillAverages);
  const developingSkill = getDevelopingSkill(skillAverages);
  const badgeInfo = getBadgeInfo(overallAvg);
  const insight = generateOverallInsight(
    overallAvg,
    topSkill,
    developingSkill,
    completedCount,
    totalBooks
  );

  const ringColor = getScoreRingColor(overallAvg);
  const ringLabel = getScoreRingLabel(overallAvg);

  const radarData = {
    labels: SKILLS.map(s => `${s.icon} ${s.label}`),
    datasets: [
      {
        label: 'Skill Average',
        data: SKILLS.map(s => skillAverages[s.id] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366F1',
        borderWidth: 3,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366F1'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` Average: ${ctx.raw.toFixed(1)} / 4`
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent',
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        },
        angleLines: {
          color: '#E5E7EB'
        },
        pointLabels: {
          color: '#374151',
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      }
    }
  };

  return (
    <div className="overall-dashboard">
      <div className="card overall-ring-card">
        <ProgressBar
          value={overallAvg / 4}
          size={160}
          strokeWidth={14}
          color={ringColor}
          label={overallAvg.toFixed(1)}
          sublabel="/ 4"
        />
        <p className="ring-label" style={{ color: ringColor }}>{ringLabel}</p>
        <p className="ring-subtitle">
          Based on {completedCount} of {totalBooks} completed activities
        </p>
      </div>

      <div className="card highlight-card strength-highlight">
        <div className="highlight-icon">⭐</div>
        <div className="highlight-body">
          <div className="highlight-tag">Strongest Skill Across All Books</div>
          <div className="highlight-name">
            {topSkill.skill?.label} — Avg {topSkill.value?.toFixed(1)} / 4
          </div>
          <div className="highlight-desc">
            Your child consistently shows strong {topSkill.skill?.label} abilities throughout their reading journey!
          </div>
        </div>
      </div>

      <div className="card highlight-card developing-highlight">
        <div className="highlight-icon">🌱</div>
        <div className="highlight-body">
          <div className="highlight-tag">Growing Area</div>
          <div className="highlight-name">
            {developingSkill.skill?.label} — Avg {developingSkill.value?.toFixed(1)} / 4
          </div>
          <div className="highlight-desc">
            With encouragement and fun activities, your child's {developingSkill.skill?.label} skills are on a wonderful path of growth!
          </div>
        </div>
      </div>

      <div
        className="card analysis-radar-card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <h3 className="section-title" style={{ marginBottom: '4px' }}>
          Average Skill Performance
        </h3>
        <p
          className="overall-subtitle"
          style={{ marginBottom: '20px', fontSize: '13px' }}
        >
          Based on {completedCount} completed books
        </p>
        <div style={{ height: 360, position: 'relative' }}>
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Full Skills Breakdown</h3>
        <div className="table-scroll-wrapper">
          <table className="skills-table">
            <thead>
              <tr>
                <th>Book</th>
                {SKILLS.map(s => (
                  <th key={s.id}>{s.icon} {s.label}</th>
                ))}
                <th>Avg</th>
              </tr>
            </thead>
            <tbody>
              {completedBooks.map((book, idx) => {
                const rating = allRatings.find(r => r.bookId === book.id);
                const avg = rating?.averageScore || 0;
                const avgKey = scoreColorKey(avg);
                const avgSc = SCORE_COLORS[avgKey];

                return (
                  <tr
                    key={book.id}
                    style={{ background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}
                  >
                    <td className="table-book-cell">
                      <span className="table-book-emoji">{book.emoji}</span>
                      <span className="table-book-name">{book.name}</span>
                    </td>

                    {SKILLS.map(s => {
                      const score = rating?.ratings[s.id] || 0;
                      const key = scoreColorKey(score);
                      const sc = SCORE_COLORS[key];

                      return (
                        <td
                          key={s.id}
                          className="table-score-cell"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          {score}
                        </td>
                      );
                    })}

                    <td
                      className="table-score-cell table-avg-cell"
                      style={{
                        background: avgSc.bg,
                        color: avgSc.text,
                        fontWeight: 700
                      }}
                    >
                      {avg.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">🏅 Milestone Badges</h3>
        <MilestoneBadge currentTier={badgeInfo.tier} />
      </div>

      <div className="card insight-card">
        <h3 className="section-title">✨ Your Child's Journey</h3>
        <p className="insight-text">{insight}</p>
      </div>

      <div className="print-row">
        <button className="btn-primary btn-print" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
      </div>

      <SkillLegend />
    </div>
  );
}