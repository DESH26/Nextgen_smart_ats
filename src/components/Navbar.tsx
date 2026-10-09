import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User as UserIcon, BookOpen, Sparkles, ChevronDown, Check, Shield, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VivaHelperModal } from './VivaHelperModal';

export const Navbar: React.FC = () => {
  const { user, logout, switchUser } = useAuth();
  const navigate = useNavigate();
  const [showVivaModal, setShowVivaModal] = useState<boolean>(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState<boolean>(false);

  const demoAccounts = [
    { email: 'recruiter@techcorp.com', role: 'recruiter', name: 'Sarah Jenkins (Recruiter)', desc: 'TechCorp Lead' },
    { email: 'recruiter.ai@ailabs.io', role: 'recruiter', name: 'David Chen (AI Recruiter)', desc: 'AI Labs Talent' },
    { email: 'candidate.ml@example.com', role: 'candidate', name: 'Arjun Sharma (Candidate)', desc: 'ML & NLP Engineer' },
    { email: 'candidate.fullstack@example.com', role: 'candidate', name: 'Priya Patel (Candidate)', desc: 'Full-Stack Dev' },
    { email: 'candidate.devops@example.com', role: 'candidate', name: 'Rohan Verma (Candidate)', desc: 'DevOps & Cloud' },
    { email: 'admin@smartats.com', role: 'admin', name: 'System Admin', desc: 'Platform Administrator' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                NextGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Smart ATS</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono">NLP & Semantic Matching</span>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Academic Viva Helper Button */}
            <button
              onClick={() => setShowVivaModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-all shadow-sm shadow-blue-500/10"
              title="Open MCA Viva Architecture & Technical Q&A Guide"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Viva & Architecture Guide</span>
            </button>

            {/* Quick Demo Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDemoDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Quick-Switch Demo Persona
                  </div>
                  <div className="divide-y divide-slate-800/50 mt-1">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={async () => {
                          setShowDemoDropdown(false);
                          await switchUser(acc.email, acc.role);
                          if (acc.role === 'recruiter') navigate('/recruiter/dashboard');
                          else if (acc.role === 'admin') navigate('/admin/dashboard');
                          else navigate('/candidate/dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                          user?.email === acc.email ? 'bg-blue-500/10 text-blue-300 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{acc.name}</div>
                          <div className="text-[10px] text-slate-400">{acc.desc}</div>
                        </div>
                        {user?.email === acc.email && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Navigation */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white">{user.full_name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 inline-block self-end">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Academic Viva Helper Modal */}
      <VivaHelperModal isOpen={showVivaModal} onClose={() => setShowVivaModal(false)} />
    </>
  );
};
