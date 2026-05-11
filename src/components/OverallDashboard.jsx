import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SKILL_LINE_COLORS = [
  '#2563EB',
  '#BE185D',
  '#B45309',
  '#047857',
  '#DC2626',
  '#4F46E5'
];

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

function shortBookName(name) {
  if (!name) return '';
  return name.length > 18 ? `${name.slice(0, 16)}...` : name;
}

export default function OverallDashboard() {
  const allRatings = getAllRatings();
  const completedBooks = BOOKS.filter(book =>
    allRatings.find(rating => rating.bookId === book.id)
  );

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

  const lineData = {
    labels: completedBooks.map(book => shortBookName(book.name)),
    datasets: SKILLS.map((skill, index) => ({
      label: skill.label,
      data: completedBooks.map(book => {
        const rating = allRatings.find(r => r.bookId === book.id);
        return rating?.ratings?.[skill.id] || 0;
      }),
      borderColor: SKILL_LINE_COLORS[index % SKILL_LINE_COLORS.length],
      backgroundColor: SKILL_LINE_COLORS[index % SKILL_LINE_COLORS.length],
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.35
    }))
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 700
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw} / 4`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        title: {
          display: true,
          text: 'Skill Score',
          font: {
            family: 'Inter',
            size: 13
          }
        },
        ticks: {
          stepSize: 1,
          font: {
            family: 'Inter',
            size: 12
          }
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Inter',
            size: 11
          },
          maxRotation: 40,
          minRotation: 35
        },
        grid: {
          color: '#F3F4F6'
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
        <p className="ring-label" style={{ color: ringColor }}>
          {ringLabel}
        </p>
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

      <div className="card analysis-radar-card">
        <h3 className="section-title">📈 Skill Growth Across Books</h3>
        <p className="overall-subtitle" style={{ marginBottom: '20px' }}>
          Each line shows how one skill has grown across every book your child completed
        </p>

        <div style={{ height: 380, position: 'relative' }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Full Skills Breakdown</h3>
        <div className="table-scroll-wrapper">
          <table className="skills-table">
            <thead>
              <tr>
                <th>Book</th>
                {SKILLS.map(skill => (
                  <th key={skill.id}>{skill.icon} {skill.label}</th>
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

                    {SKILLS.map(skill => {
                      const score = rating?.ratings?.[skill.id] || 0;
                      const key = scoreColorKey(score);
                      const sc = SCORE_COLORS[key];

                      return (
                        <td
                          key={skill.id}
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