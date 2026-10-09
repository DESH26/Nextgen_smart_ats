import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subtitle?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  label = 'Overall Match',
  subtitle
}) => {
  const validScore = Math.max(0, Math.min(100, isNaN(score) ? 0 : score));
  
  // Color calculation
  let strokeColor = '#ef4444'; // Red
  let badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  let tierLabel = 'Low Compatibility';
  
  if (validScore >= 80) {
    strokeColor = '#10b981'; // Emerald
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    tierLabel = 'Excellent Match';
  } else if (validScore >= 65) {
    strokeColor = '#3b82f6'; // Blue
    badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    tierLabel = 'Strong Fit';
  } else if (validScore >= 50) {
    strokeColor = '#f59e0b'; // Amber
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    tierLabel = 'Moderate Fit';
  }

  const radius = size === 'sm' ? 36 : size === 'lg' ? 68 : 50;
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validScore / 100) * circumference;

  const dimension = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg className="transform -rotate-90" width={dimension} height={dimension}>
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-bold tracking-tight ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'} text-white`}>
            {Math.round(validScore)}%
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      )}
      {subtitle && (
        <span className={`mt-1 text-xs px-2.5 py-0.5 rounded-full border ${badgeColor} font-medium`}>
          {subtitle || tierLabel}
        </span>
      )}
    </div>
  );
};
