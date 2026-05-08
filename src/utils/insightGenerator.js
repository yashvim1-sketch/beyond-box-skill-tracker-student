import { SKILLS } from '../data/books';

const RECOMMENDATIONS = {
  cognitive: [
    { icon: "🧩", label: "Puzzles & brain games" },
    { icon: "🔭", label: "STEM exploration kits" },
    { icon: "♟️", label: "Problem-solving challenges" }
  ],
  creative: [
    { icon: "🎨", label: "Drawing & painting" },
    { icon: "🧱", label: "Clay modeling" },
    { icon: "📖", label: "Story creation" }
  ],
  communication: [
    { icon: "📚", label: "Read aloud sessions" },
    { icon: "🎭", label: "Roleplay games" },
    { icon: "🗣️", label: "Group storytelling" }
  ],
  social_emotional: [
    { icon: "🏅", label: "Team games" },
    { icon: "💛", label: "Empathy discussions" },
    { icon: "🌍", label: "Community activities" }
  ],
  physical: [
    { icon: "✂️", label: "Craft activities" },
    { icon: "🌿", label: "Sensory play" },
    { icon: "🌳", label: "Outdoor exploration" }
  ],
  practical: [
    { icon: "🍳", label: "Cooking together" },
    { icon: "🔨", label: "DIY projects" },
    { icon: "🔬", label: "Science experiments" }
  ]
};

/**
 * Generate a warm, personalized insight paragraph for a single book.
 */
export function generateBookInsight(ratings, bookName) {
  if (!ratings) return "";

  const skillScores = SKILLS.map(s => ({ ...s, score: ratings[s.id] || 0 }));
  const sorted = [...skillScores].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const developing = sorted[sorted.length - 1];

  let insight = "";

  if (top.score >= 4 && developing.score >= 3) {
    insight = `Outstanding performance! Your child demonstrates strong capabilities across all skill areas in "${bookName}". ` +
      `Both ${top.label} and ${developing.label} skills are flourishing beautifully — a testament to their curiosity and engagement. ` +
      `Keep nurturing this wonderful momentum!`;
    return insight;
  }

  // Opening sentence
  if (top.score === 4) {
    insight += `Your child shows exceptional ${top.label} abilities through "${bookName}" — this is a real strength to celebrate! `;
  } else if (top.score === 3) {
    insight += `Your child is making great strides in ${top.label} through "${bookName}" — a skill that is blossoming with every activity! `;
  } else {
    insight += `Reading "${bookName}" has been a meaningful experience for your child, sparking curiosity and engagement across multiple areas. `;
  }

  // Middle — mention developing skill gently
  if (developing.score === 1) {
    insight += `${developing.label} is an area where more practice and encouragement will go a long way — and that's perfectly okay! `;
    insight += `Every great learner grows at their own unique pace, and with the right activities, this skill will blossom soon.`;
  } else if (developing.score === 2) {
    insight += `${developing.label} skills are developing steadily and will grow beautifully with continued practice and encouragement. `;
    insight += `You're doing a wonderful job supporting your child's learning journey!`;
  } else {
    insight += `All skills are developing beautifully through this book, with ${developing.label} showing steady and encouraging progress. `;
    insight += `Your child's engagement and effort are truly something to be proud of!`;
  }

  return insight;
}

/**
 * Generate a one-sentence skill story summary.
 */
export function generateSkillStory(ratings) {
  if (!ratings) return "";
  const skillScores = SKILLS.map(s => ({ ...s, score: ratings[s.id] || 0 }));
  const sorted = [...skillScores].sort((a, b) => b.score - a.score);
  const shining = sorted.slice(0, 2).map(s => s.label);
  const growing = sorted[sorted.length - 1];

  return `${shining.join(" and ")} skills shine brightly in this activity, while ${growing.label} is growing steadily.`;
}

/**
 * Get 2–3 recommendations based on the developing skill.
 */
export function getRecommendations(developingSkillId) {
  return RECOMMENDATIONS[developingSkillId] || RECOMMENDATIONS.cognitive;
}

/**
 * Generate a warm overall insight paragraph.
 */
export function generateOverallInsight(overallAvg, topSkill, developingSkill, completedCount, totalCount) {
  const topLabel = topSkill?.skill?.label || "various";
  const devLabel = developingSkill?.skill?.label || "some";
  const topVal = topSkill?.value?.toFixed(1) || "—";
  const devVal = developingSkill?.value?.toFixed(1) || "—";

  let para = `Your child has completed ${completedCount} of ${totalCount} activities in the Humans of Science STEM series — what an incredible achievement! `;

  if (overallAvg >= 3.5) {
    para += `With an outstanding overall score of ${overallAvg.toFixed(1)} out of 4, your child is truly excelling across all learning dimensions. `;
  } else if (overallAvg >= 2.5) {
    para += `With a strong overall score of ${overallAvg.toFixed(1)} out of 4, your child is developing beautifully across all learning areas. `;
  } else {
    para += `With an overall score of ${overallAvg.toFixed(1)} out of 4, your child is on a wonderful growth journey filled with great potential. `;
  }

  para += `${topLabel} stands out as their strongest skill (avg ${topVal}/4), reflecting their natural ability to engage deeply with ideas and challenges. `;
  para += `${devLabel} (avg ${devVal}/4) is an exciting area of growth — with nurturing activities and your loving support, this skill is sure to blossom further.`;

  return para;
}
