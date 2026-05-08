import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const insight = generateOverallInsight(overallAvg, topSkill, developingSkill, completedCount, totalBooks);

  const ringColor = getScoreRingColor(overallAvg);
  const ringLabel = getScoreRingLabel(overallAvg);

  const getBarColor = (avg) => {
    if (avg < 2.0) return '#EF4444';
    if (avg < 3.0) return '#F97316';
    if (avg < 3.5) return '#EAB308';
    return '#22C55E';
  };

  const barData = {
    labels: SKILLS.map(s => [`${s.icon} ${s.label}`, s.desc]),
    datasets: [{
      data: SKILLS.map(s => skillAverages[s.id] || 0),
      backgroundColor: SKILLS.map(s => getBarColor(skillAverages[s.id] || 0)),
      borderRadius: 6,
      barPercentage: 0.7
    }]
  };

  const barOptions = {
    indexAxis: 'y',
    animation: { duration: 800 },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { right: 30 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` Average: ${ctx.raw.toFixed(1)} / 4`
        }
      }
    },
    scales: {
      x: {
        min: 0, max: 4,
        ticks: { stepSize: 1, font: { family: 'Inter', size: 11 } },
        grid: { color: '#F3F4F6' }
      },
      y: {
        ticks: { 
          font: { family: 'Inter', size: 11 },
          color: '#374151'
        },
        grid: { display: false }
      }
    }
  };

  const scoreLabelPlugin = {
    id: 'scoreLabel',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      ctx.save();
      const meta = chart.getDatasetMeta(0);
      meta.data.forEach((bar, index) => {
        const val = data.datasets[0].data[index];
        const color = data.datasets[0].backgroundColor[index];
        ctx.fillStyle = color;
        ctx.font = 'bold 12px Inter';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toFixed(1), bar.x + 8, bar.y);
      });
      ctx.restore();
    }
  };

  return (
    <div className="overall-dashboard">
      {/* Overall Score Ring */}
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
        <p className="ring-subtitle">Based on {completedCount} of {totalBooks} completed activities</p>
      </div>

      {/* Positive Highlight */}
      <div className="card highlight-card strength-highlight">
        <div className="highlight-icon">⭐</div>
        <div className="highlight-body">
          <div className="highlight-tag">Strongest Skill Across All Books</div>
          <div className="highlight-name">{topSkill.skill?.label} — Avg {topSkill.value?.toFixed(1)} / 4</div>
          <div className="highlight-desc">
            Your child consistently shows strong {topSkill.skill?.label} abilities throughout their reading journey!
          </div>
        </div>
      </div>

      {/* Gentle Development Card */}
      <div className="card highlight-card developing-highlight">
        <div className="highlight-icon">🌱</div>
        <div className="highlight-body">
          <div className="highlight-tag">Growing Area</div>
          <div className="highlight-name">{developingSkill.skill?.label} — Avg {developingSkill.value?.toFixed(1)} / 4</div>
          <div className="highlight-desc">
            With encouragement and fun activities, your child's {developingSkill.skill?.label} skills are on a wonderful path of growth!
          </div>
        </div>
      </div>

      {/* Average Bar Chart */}
      <div className="card" style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h3 className="section-title" style={{ marginBottom: '4px' }}>Average Skill Performance</h3>
        <p className="overall-subtitle" style={{ marginBottom: '20px', fontSize: '13px' }}>Based on {completedCount} completed books</p>
        <div style={{ height: 300, position: 'relative' }}>
          <Bar data={barData} options={barOptions} plugins={[scoreLabelPlugin]} />
        </div>
      </div>

      {/* Color-coded Summary Table */}
      <div className="card">
        <h3 className="section-title">Full Skills Breakdown</h3>
        <div className="table-scroll-wrapper">
          <table className="skills-table">
            <thead>
              <tr>
                <th>Book</th>
                {SKILLS.map(s => <th key={s.id}>{s.icon} {s.label}</th>)}
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
                  <tr key={book.id} style={{ background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
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
                      style={{ background: avgSc.bg, color: avgSc.text, fontWeight: 700 }}
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

      {/* Milestone Badges */}
      <div className="card">
        <h3 className="section-title">🏅 Milestone Badges</h3>
        <MilestoneBadge currentTier={badgeInfo.tier} />
      </div>

      {/* Overall Insight */}
      <div className="card insight-card">
        <h3 className="section-title">✨ Your Child's Journey</h3>
        <p className="insight-text">{insight}</p>
      </div>

      {/* Print Button */}
      <div className="print-row">
        <button className="btn-primary btn-print" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
      </div>

      <SkillLegend />
    </div>
  );
}
