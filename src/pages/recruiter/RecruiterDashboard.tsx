import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Sparkles,
  BarChart2,
  Clock,
  Eye,
  Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import api from '../../api/client';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';

export const RecruiterDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/recruiter/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Loading recruiter dashboard...</div>;
  }

  const chartData = data?.score_distribution
    ? Object.entries(data.score_distribution).map(([range, count]) => ({ range, count }))
    : [];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recruiter Command Center</h1>
          <p className="text-xs text-slate-400">Intelligent screening, semantic candidate rankings, and pipeline overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/create-job"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job Opening</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Total Openings</div>
          <div className="text-2xl font-bold text-white mt-1">{data?.total_jobs || 0}</div>
          <div className="text-[10px] text-blue-400 mt-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> {data?.active_jobs} Active
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Total Applicants</div>
          <div className="text-2xl font-bold text-white mt-1">{data?.total_applications || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1">Processed by NLP</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Screened</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{data?.candidates_screened || 0}</div>
          <div className="text-[10px] text-cyan-400/80 mt-1">Evaluated by Model</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Shortlisted</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{data?.shortlisted_candidates || 0}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">High Compatibility</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-medium">Average Match Score</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{data?.average_match_score || 0}%</div>
            <div className="text-[10px] text-slate-400 mt-1">Hybrid Model Ensemble</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Score Distribution & Skill Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" />
                Applicant Compatibility Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Score distribution based on Semantic (40%), TF-IDF (30%), and Skill Coverage (30%)</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Demanded Skills */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Top Required Skills
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Most demanded competencies across current job postings</p>

            <div className="space-y-2.5">
              {data?.top_skills_in_demand?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(100, item.count * 33)}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{item.count} jobs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/recruiter/candidates"
            className="mt-4 pt-3 border-t border-slate-800 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-between font-semibold"
          >
            <span>View All Candidate Rankings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Candidate Submissions</h3>
            <p className="text-[11px] text-slate-400">Processed by NLP parsing and semantic similarity engine</p>
          </div>
          <Link
            to="/recruiter/candidates"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Rank All Candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Job Role</th>
                <th className="py-3 px-4">Match Score</th>
                <th className="py-3 px-4">Semantic Similarity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data?.recent_applications?.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{app.candidate_name}</div>
                    <div className="text-[10px] text-slate-400">{app.candidate_email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">{app.job_title}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/recruiter/candidate-detail/${app.id}`}
                      className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 font-semibold transition-colors"
                    >
                      Inspect Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
