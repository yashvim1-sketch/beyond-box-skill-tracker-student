import React from 'react';

export default function SkillLegend({ compact = false }) {
  const items = [
    { color: "#EF4444", label: "Not Yet", value: 1 },
    { color: "#F97316", label: "Sometimes", value: 2 },
    { color: "#EAB308", label: "Mostly", value: 3 },
    { color: "#22C55E", label: "Always", value: 4 }
  ];

  return (
    <div className={`skill-legend ${compact ? 'skill-legend--compact' : ''}`}>
      {items.map(item => (
        <div key={item.value} className="skill-legend-item">
          <span
            className="skill-legend-dot"
            style={{ background: item.color }}
          />
          <span className="skill-legend-label">
            {item.label} ({item.value})
          </span>
        </div>
      ))}
    </div>
  );
}
