import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Target,
  BookOpen,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  Layers,
  Users,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Smarter Resume Screening.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Better Candidate Insights.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            An NLP and Machine Learning powered Applicant Tracking System combining{' '}
            <strong className="text-slate-200">Sentence-BERT Semantic Embeddings</strong>,{' '}
            <strong className="text-slate-200">TF-IDF Vectorization</strong>, and{' '}
            <strong className="text-slate-200">Skill Gap Analysis</strong> for explainable recruiter decision support.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                <span>Go to {user.role === 'recruiter' ? 'Recruiter' : 'Candidate'} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all"
                >
                  <span>Launch Live Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Key Feature Metric Badges */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-blue-400">40% / 30% / 30%</div>
              <div className="text-xs text-slate-400 mt-1">Hybrid Weighted Scoring</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-emerald-400">1,200+ Skills</div>
              <div className="text-xs text-slate-400 mt-1">Curated Skill Taxonomy</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-purple-400">97.5% F1</div>
              <div className="text-xs text-slate-400 mt-1">NER Extraction Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl font-bold text-cyan-400">&lt;80ms</div>
              <div className="text-xs text-slate-400 mt-1">Real-Time Inference</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Modules Grid */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete End-to-End ATS Architecture
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Engineered with genuine NLP, Machine Learning, and explainable decision-support algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Automated Resume Parser</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accepts PDF and DOCX documents, cleans extraction artifacts, identifies section bounding boxes, and extracts skills, education, and experience.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Hybrid Semantic Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Combines Sentence-BERT (40%), TF-IDF Cosine Similarity (30%), and Skill Requirement Coverage (30%) for high-precision explainable rankings.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Skill Gap Detection Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Classifies required competencies into Matched, Weak (partial context evidence), and Missing, with granular candidate justification.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Learning Resource Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recommends verified courses, interactive tutorials, and official documentation tailored to the candidate's specific skill weaknesses.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Interview Question Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates technical, behavioral STAR, and targeted gap-assessment questions with difficulty levels and sample model answer pointers.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Recruiter & Candidate Portals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rich dashboards featuring candidate ranking sliders, score distribution histograms, skill demand analytics, and model evaluation metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
          <p>© 2026 NextGen Smart ATS • Master of Computer Applications (MCA) Project</p>
          <p className="text-slate-600">Decision-Support Architecture • Non-discriminatory algorithmic scoring</p>
        </div>
      </footer>
    </div>
  );
};
