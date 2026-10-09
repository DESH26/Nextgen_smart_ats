import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Users, Briefcase, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import api from '../../api/client';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reseedStatus, setReseedStatus] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/system-stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReseed = async () => {
    setReseedStatus('Reseeding database...');
    try {
      await api.post('/admin/reseed-db');
      setReseedStatus('Database successfully re-seeded with sample viva data!');
      fetchData();
    } catch (err) {
      setReseedStatus('Failed to reseed database.');
    }
  };

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading admin console...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            System Administration & Environment Overview
          </h1>
          <p className="text-xs text-slate-400">Database health, user directory, and demo environment reset tools</p>
        </div>

        <button
          onClick={handleReseed}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reseed Demo Database</span>
        </button>
      </div>

      {reseedStatus && (
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center justify-between">
          <span>{reseedStatus}</span>
          <button onClick={() => setReseedStatus('')} className="font-bold">×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.total_users}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Jobs Posted</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{stats.total_jobs}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Resumes Processed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.total_resumes}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Applications</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.total_applications}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3">User Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{u.full_name}</td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
