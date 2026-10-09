import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  FileText,
  HelpCircle,
  Award,
  Cpu,
  Settings,
  PlusCircle,
  CheckCircle,
  Search,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/create-job', label: 'Post New Job', icon: PlusCircle },
    { to: '/recruiter/jobs', label: 'Job Openings', icon: Briefcase },
    { to: '/recruiter/candidates', label: 'Candidate Rankings', icon: Users },
    { to: '/recruiter/analytics', label: 'Recruiter Analytics', icon: BarChart3 },
  ];

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/candidate/upload-resume', label: 'Upload & Parse Resume', icon: FileText },
    { to: '/candidate/jobs', label: 'Explore Jobs & Apply', icon: Search },
    { to: '/candidate/skill-gaps', label: 'Skill Gap & Learning', icon: BookOpen },
    { to: '/candidate/interview-prep', label: 'Interview Preparation', icon: HelpCircle },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'System Overview', icon: LayoutDashboard },
    { to: '/admin/evaluation', label: 'ML Model Evaluation', icon: Cpu },
  ];

  const links = user.role === 'recruiter' ? recruiterLinks : user.role === 'admin' ? adminLinks : candidateLinks;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 shrink-0 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            {user.role} workspace
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Model & Version Footnote */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>Active ML Engine</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">Sentence-BERT + TF-IDF N-gram</div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Decision Support Mode</span>
        </div>
      </div>
    </aside>
  );
};
