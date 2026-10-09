import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import api from '../../api/client';

export const RecruiterAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/recruiter');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading recruitment analytics...</div>;
  }

  const jobChartData = analytics.job_breakdown?.map((j: any) => ({
    name: j.job_title.split(' ')[0] + ' ' + (j.job_title.split(' ')[1] || ''),
    apps: j.applications_count,
    avg: j.avg_match
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          Recruiter Pipeline & Scoring Analytics
        </h1>
        <p className="text-xs text-slate-400">Algorithmic distribution metrics and hiring campaign throughput</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Active Recruitment Campaigns</div>
          <div className="text-3xl font-bold text-white mt-1">{analytics.total_jobs}</div>
          <div className="text-xs text-blue-400 mt-1">Open Positions</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Total Evaluated Candidates</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{analytics.total_applications}</div>
          <div className="text-xs text-slate-400 mt-1">Processed with Hybrid NLP</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Average Candidate Compatibility</div>
          <div className="text-3xl font-bold text-purple-400 mt-1">{analytics.avg_match_score}%</div>
          <div className="text-xs text-purple-400/80 mt-1">Across all active roles</div>
        </div>
      </div>

      {/* Applications per Job Role */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-1">Applications & Average Match per Job Opening</h3>
        <p className="text-xs text-slate-400 mb-4">Volume and quality breakdown across distinct engineering departments</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="apps" fill="#3b82f6" name="Applicants" radius={[6, 6, 0, 0]} />
              <Bar dataKey="avg" fill="#10b981" name="Avg Match %" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
