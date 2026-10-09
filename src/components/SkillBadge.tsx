import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface SkillBadgeProps {
  name: string;
  status: 'matched' | 'weak' | 'missing' | 'neutral';
  category?: string;
  importance?: 'required' | 'preferred';
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  status,
  category,
  importance,
  showIcon = true,
  size = 'md'
}) => {
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = null;

  if (status === 'matched') {
    styles = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 shadow-sm shadow-emerald-950/50';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  } else if (status === 'weak') {
    styles = 'bg-amber-950/60 text-amber-300 border-amber-700/50 shadow-sm shadow-amber-950/50';
    icon = <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  } else if (status === 'missing') {
    styles = 'bg-rose-950/60 text-rose-300 border-rose-700/50 shadow-sm shadow-rose-950/50';
    icon = <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${padding} ${styles}`}>
      {showIcon && icon}
      <span>{name}</span>
      {importance === 'preferred' && (
        <span className="text-[10px] text-slate-400 font-normal ml-0.5">(Bonus)</span>
      )}
    </span>
  );
};
