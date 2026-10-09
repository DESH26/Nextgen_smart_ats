import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Sparkles, UserCheck, Briefcase, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('recruiter@techcorp.com');
  const [password, setPassword] = useState<string>('demo123');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      if (res.data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    const pwd = demoRole === 'admin' ? 'admin123' : 'demo123';
    setPassword(pwd);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email: demoEmail, password: pwd });
      login(res.data.access_token, res.data.user);
      if (demoRole === 'recruiter') navigate('/recruiter/dashboard');
      else if (demoRole === 'admin') navigate('/admin/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err: any) {
      setError('Failed to log in with demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to NextGen Smart ATS</h2>
        <p className="mt-1 text-xs text-slate-400">Access Recruiter, Candidate, or Admin workspaces</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Switcher Card */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
          <div className="flex items-center gap-2 font-bold text-blue-300 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>1-Click Viva Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => handleQuickDemo('recruiter@techcorp.com', 'recruiter')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-blue-500 text-left transition-colors"
            >
              <div className="font-semibold text-white">Recruiter Demo</div>
              <div className="text-[10px] text-slate-400">Sarah (TechCorp)</div>
            </button>
            <button
              onClick={() => handleQuickDemo('candidate.ml@example.com', 'candidate')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-left transition-colors"
            >
              <div className="font-semibold text-white">ML Candidate</div>
              <div className="text-[10px] text-slate-400">Arjun Sharma (MCA)</div>
            </button>
            <button
              onClick={() => handleQuickDemo('candidate.fullstack@example.com', 'candidate')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500 text-left transition-colors"
            >
              <div className="font-semibold text-white">Full-Stack Dev</div>
              <div className="text-[10px] text-slate-400">Priya Patel (React/Node)</div>
            </button>
            <button
              onClick={() => handleQuickDemo('admin@smartats.com', 'admin')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500 text-left transition-colors"
            >
              <div className="font-semibold text-white">Admin / Evaluation</div>
              <div className="text-[10px] text-slate-400">Model Benchmarks</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
