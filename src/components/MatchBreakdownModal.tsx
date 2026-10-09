import React from 'react';
import { X, CheckCircle2, AlertCircle, XCircle, Award, Sparkles, Scale, Info } from 'lucide-react';
import { MatchScore } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { SkillBadge } from './SkillBadge';

interface MatchBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchScore: MatchScore | null;
  candidateName?: string;
  jobTitle?: string;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  isOpen,
  onClose,
  matchScore,
  candidateName = 'Candidate',
  jobTitle = 'Job Opening'
}) => {
  if (!isOpen || !matchScore) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Semantic Match Breakdown & Explainability
            </h2>
            <p className="text-xs text-slate-400">{candidateName} • {jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
              <ScoreGauge score={matchScore.overall_score} size="sm" label="Overall Score" />
            </div>
            
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Semantic Embeddings</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">40% Weight</span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mt-2">{Math.round(matchScore.semantic_score)}%</div>
              <div className="text-[11px] text-slate-500 mt-1">Sentence-BERT Transformer Model</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Keyword Similarity</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">30% Weight</span>
              </div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{Math.round(matchScore.tfidf_score)}%</div>
              <div className="text-[11px] text-slate-500 mt-1">TF-IDF N-Gram Vectorizer</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Skill Coverage</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">30% Weight</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-2">{Math.round(matchScore.skill_score)}%</div>
              <div className="text-[11px] text-slate-500 mt-1">Requirement Matrix Ratio</div>
            </div>
          </div>

          {/* Strengths & Potential Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-4 h-4" /> Candidate Key Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {matchScore.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2.5">
                <AlertCircle className="w-4 h-4" /> Areas For Verification / Gaps
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {matchScore.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill Breakdown Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Skill Matching</h4>
            
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs font-medium text-emerald-400 block mb-2">Matched Competencies ({matchScore.matched_skills.length}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {matchScore.matched_skills.length > 0 ? (
                    matchScore.matched_skills.map((s, i) => <SkillBadge key={i} name={s} status="matched" size="sm" />)
                  ) : (
                    <span className="text-xs text-slate-500">None detected</span>
                  )}
                </div>
              </div>

              {matchScore.weak_skills.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs font-medium text-amber-400 block mb-2">Weak / Contextual Mentions ({matchScore.weak_skills.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchScore.weak_skills.map((s, i) => <SkillBadge key={i} name={s} status="weak" size="sm" />)}
                  </div>
                </div>
              )}

              {matchScore.missing_skills.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs font-medium text-rose-400 block mb-2">Missing Stated Requirements ({matchScore.missing_skills.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchScore.missing_skills.map((s, i) => <SkillBadge key={i} name={s} status="missing" size="sm" />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Model: {matchScore.model_version}</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
