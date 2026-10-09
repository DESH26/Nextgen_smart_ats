import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Filter,
  Sliders,
  ArrowUpDown,
  CheckCircle2,
  Eye,
  ShieldAlert,
  Award,
  Sparkles,
  Check,
  XCircle,
  AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import { SkillBadge } from '../../components/SkillBadge';
import { MatchBreakdownModal } from '../../components/MatchBreakdownModal';

export const CandidateRankingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('job_id') || '';

  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>(initialJobId);
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('overall');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  // Modal breakdown state
  const [activeModalApp, setActiveModalApp] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchRankedCandidates();
  }, [selectedJob, minScore, sortBy]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRankedCandidates = async () => {
    setIsLoading(true);
    try {
      const params: any = { min_score: minScore, sort_by: sortBy };
      if (selectedJob) params.job_id = selectedJob;
      const res = await api.get('/recruiter/candidates/ranked', { params });
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (appId: number, status: string, isShortlisted?: boolean) => {
    try {
      await api.patch(`/applications/${appId}/status`, {
        status,
        is_shortlisted: isShortlisted
      });

      // Optimistically update list
      setCandidates((prev) =>
        prev.map((c) =>
          c.application_id === appId
            ? { ...c, status, is_shortlisted: isShortlisted !== undefined ? isShortlisted : c.is_shortlisted }
            : c
        )
      );

      setToastMessage({
        text: status === 'shortlisted' ? 'Candidate marked as Shortlisted!' : 'Candidate marked as Rejected.',
        type: status === 'shortlisted' ? 'success' : 'danger'
      });

      setTimeout(() => setToastMessage(null), 3000);
      fetchRankedCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Candidate Rankings & Matching Matrix
          </h1>
          <p className="text-xs text-slate-400">
            Explainable multi-candidate ranking combining Sentence-BERT semantic similarity, TF-IDF cosine, and skill coverage.
          </p>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Filter By Job Role</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Job Openings</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Sort Ranking Metric</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="overall">Overall Hybrid Score (Weighted)</option>
            <option value="semantic">Sentence-BERT Semantic Match</option>
            <option value="tfidf">TF-IDF Keyword Similarity</option>
            <option value="skill">Skill Coverage Ratio</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between font-semibold text-slate-300 mb-1">
            <span>Minimum Match Threshold:</span>
            <span className="text-blue-400 font-mono">{minScore}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* Ranked Candidate Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Calculating semantic rankings...</div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No candidates match current filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-3 text-center">Overall Match</th>
                  <th className="py-3 px-3 text-center">Semantic (40%)</th>
                  <th className="py-3 px-3 text-center">TF-IDF (30%)</th>
                  <th className="py-3 px-3 text-center">Skill (30%)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {candidates.map((cand) => (
                  <tr key={cand.application_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        cand.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        cand.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30' :
                        cand.rank === 3 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        #{cand.rank}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{cand.candidate_name}</div>
                      <div className="text-[10px] text-slate-400">{cand.candidate_email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">{cand.job_title}</td>
                    
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                        cand.overall_score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        cand.overall_score >= 65 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {Math.round(cand.overall_score)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono text-purple-300">{Math.round(cand.semantic_score)}%</td>
                    <td className="py-3.5 px-3 text-center font-mono text-blue-300">{Math.round(cand.tfidf_score)}%</td>
                    <td className="py-3.5 px-3 text-center font-mono text-emerald-300">{Math.round(cand.skill_score)}%</td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                        cand.status === 'shortlisted' || cand.is_shortlisted
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : cand.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {cand.status === 'shortlisted' || cand.is_shortlisted ? 'Shortlisted' : cand.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cand.status !== 'shortlisted' && !cand.is_shortlisted ? (
                          <button
                            onClick={() => updateStatus(cand.application_id, 'shortlisted', true)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Shortlist Candidate"
                          >
                            <Check className="w-3 h-3" />
                            <span>Shortlist</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Shortlisted
                          </span>
                        )}

                        <Link
                          to={`/recruiter/candidate-detail/${cand.application_id}`}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold transition-colors"
                        >
                          Deep Dive
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
