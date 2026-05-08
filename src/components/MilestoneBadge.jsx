import React from 'react';

const BADGE_DATA = [
  {
    emoji: "🌱",
    label: "Growing Learner",
    description: "Your child has begun their learning journey!",
    minTier: 1,
    color: "#22C55E",
    colorLight: "#DCFCE7"
  },
  {
    emoji: "⭐",
    label: "Active Learner",
    description: "Your child is actively building new skills!",
    minTier: 2,
    color: "#EAB308",
    colorLight: "#FEF9C3"
  },
  {
    emoji: "🏆",
    label: "Star Learner",
    description: "Your child is excelling across all skill areas!",
    minTier: 3,
    color: "#A855F7",
    colorLight: "#F3E8FF"
  }
];

export default function MilestoneBadge({ currentTier = 0 }) {
  return (
    <div className="milestone-badges-row">
      {BADGE_DATA.map((badge) => {
        const unlocked = currentTier >= badge.minTier;
        return (
          <div
            key={badge.label}
            className={`milestone-badge-card ${unlocked ? 'unlocked' : 'locked'}`}
            style={unlocked ? {
              borderColor: badge.color,
              background: badge.colorLight
            } : {}}
          >
            <div className="badge-emoji">
              {unlocked ? badge.emoji : "🔒"}
            </div>
            <div className="badge-label" style={unlocked ? { color: badge.color } : {}}>
              {badge.label}
            </div>
            <div className="badge-desc">
              {unlocked ? badge.description : "Keep going to unlock!"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
