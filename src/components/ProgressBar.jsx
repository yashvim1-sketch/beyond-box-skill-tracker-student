import React, { useEffect, useRef } from 'react';

/**
 * CSS-only animated circular progress ring.
 * Props: value (0–1), size, strokeWidth, color, label, sublabel
 */
export default function ProgressBar({
  value = 0,
  size = 120,
  strokeWidth = 10,
  color = "#22C55E",
  label = "",
  sublabel = ""
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;
  const ringRef = useRef(null);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.transition = 'none';
      ringRef.current.style.strokeDashoffset = circumference;
      // Force reflow
      void ringRef.current.getBoundingClientRect();
      ringRef.current.style.transition = 'stroke-dashoffset 1s ease';
      ringRef.current.style.strokeDashoffset = offset;
    }
  }, [value, circumference, offset]);

  return (
    <div className="progress-ring-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Filled arc */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        {label && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: size * 0.18, fill: '#111827' }}
          >
            {label}
          </text>
        )}
        {sublabel && (
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: size * 0.11, fill: '#6B7280' }}
          >
            {sublabel}
          </text>
        )}
      </svg>
    </div>
  );
}
