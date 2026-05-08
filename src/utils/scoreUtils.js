import { SKILLS } from '../data/books';

/**
 * Returns the average score for a single book's ratings object.
 */
export function computeAverage(ratings) {
  if (!ratings) return 0;
  const vals = SKILLS.map(s => ratings[s.id] || 0);
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 100) / 100;
}

/**
 * Given array of rating entries, compute per-skill averages across all books.
 * Returns { cognitive: avg, creative: avg, … }
 */
export function computeSkillAverages(allRatings) {
  if (!allRatings || allRatings.length === 0) return {};
  const totals = {};
  SKILLS.forEach(s => { totals[s.id] = 0; });
  allRatings.forEach(entry => {
    SKILLS.forEach(s => {
      totals[s.id] += entry.ratings[s.id] || 0;
    });
  });
  const result = {};
  SKILLS.forEach(s => {
    result[s.id] = Math.round((totals[s.id] / allRatings.length) * 100) / 100;
  });
  return result;
}

/**
 * Returns overall average across all books and all skills.
 */
export function computeOverallAverage(allRatings) {
  if (!allRatings || allRatings.length === 0) return 0;
  const avgs = allRatings.map(r => r.averageScore || computeAverage(r.ratings));
  return Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 100) / 100;
}

/**
 * Find the skill with the highest average score.
 */
export function getTopSkill(skillAverages) {
  let top = null;
  let topVal = -1;
  SKILLS.forEach(s => {
    const v = skillAverages[s.id] || 0;
    if (v > topVal) { topVal = v; top = s; }
  });
  return { skill: top, value: topVal };
}

/**
 * Find the skill with the lowest average score.
 */
export function getDevelopingSkill(skillAverages) {
  let dev = null;
  let devVal = 99;
  SKILLS.forEach(s => {
    const v = skillAverages[s.id] || 0;
    if (v < devVal) { devVal = v; dev = s; }
  });
  return { skill: dev, value: devVal };
}

/**
 * Returns score color class based on numeric score (1–4).
 */
export function scoreColorKey(score) {
  const rounded = Math.round(score);
  if (rounded <= 1) return 1;
  if (rounded <= 2) return 2;
  if (rounded <= 3) return 3;
  return 4;
}

/**
 * Returns motivational microcopy based on completed count.
 */
export function getMotivationalText(completed, total) {
  if (completed === 0) return "Start your journey! Pick a book your child has read.";
  if (completed <= 3) return "Great start! Keep going — you're building amazing habits!";
  if (completed <= 7) return "Halfway there! Your child is growing beautifully.";
  if (completed < total) return "Almost done! One more to unlock full insights!";
  return "🎉 Complete! View your child's full growth story below.";
}

/**
 * Returns badge info based on overall average.
 */
export function getBadgeInfo(overallAvg) {
  if (overallAvg > 3) return { emoji: "🏆", label: "Star Learner", tier: 3 };
  if (overallAvg >= 2) return { emoji: "⭐", label: "Active Learner", tier: 2 };
  return { emoji: "🌱", label: "Growing Learner", tier: 1 };
}
