import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  Award,
  BookOpen,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import api from '../../api/client';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';

export const CandidateDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/candidate/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading candidate portal...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome, {data?.candidate_name}</h1>
          <p className="text-xs text-slate-400">Track your application compatibility, skill gap recommendations, and interview prep</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/candidate/upload-resume"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Resumes on File</div>
          <div className="text-3xl font-bold text-white mt-1">{data?.resumes_count || 0}</div>
          <div className="text-xs text-blue-400 mt-1">Parsed by PyMuPDF & NER</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Active Applications</div>
          <div className="text-3xl font-bold text-white mt-1">{data?.applications_count || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Evaluated by Hybrid ATS</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Average Match Score</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{data?.average_score || 0}%</div>
          <div className="text-xs text-emerald-400/80 mt-1">Semantic + Keyword + Skill Match</div>
        </div>
      </div>

      {/* Applied Positions */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Your Submitted Applications</h3>
          <Link to="/candidate/jobs" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
            <span>Explore More Openings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recent_applications?.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            You have not applied for any roles yet. Explore open job positions!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Applied Job Role</th>
                  <th className="py-3 px-4">Compatibility Score</th>
                  <th className="py-3 px-4">Semantic Alignment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data?.recent_applications?.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{app.job_title}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-emerald-400">
                          {app.match_score ? Math.round(app.match_score.overall_score) : 0}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400"
                            style={{ width: `${app.match_score?.overall_score || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-300 text-xs">
                      {app.match_score ? Math.round(app.match_score.semantic_score) : 0}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        app.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/candidate/application-feedback/${app.id}`}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 font-semibold transition-colors"
                      >
                        View Full Feedback
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suggested Learning Resources */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Recommended Upskilling Courses & Tutorials
            </h3>
            <p className="text-[11px] text-slate-400">Curated specifically to address identified skill gaps</p>
          </div>
          <Link to="/candidate/skill-gaps" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
            View All Roadmaps
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data?.suggested_resources?.map((res: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {res.skill_name}
                  </span>
                  <span className="text-[10px] text-slate-400">{res.difficulty}</span>
                </div>
                <h4 className="font-bold text-white text-xs leading-snug">{res.title}</h4>
                <p className="text-[11px] text-slate-400">{res.provider} • ~{res.estimated_hours} Hours</p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-between"
              >
                <span>Access Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
