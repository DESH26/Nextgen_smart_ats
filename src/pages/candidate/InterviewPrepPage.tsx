import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  Shuffle,
  Clock,
  ThumbsUp,
  Check
} from 'lucide-react';
import api from '../../api/client';

export const InterviewPrepPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [mastered, setMastered] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ats_mastered_questions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedJobRole, setSelectedJobRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadInterviewData();
  }, []);

  const loadInterviewData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Candidate Applications to get applied job roles and their specific questions
      const appsRes = await api.get('/applications/my-applications').catch(() => ({ data: [] }));
      const apps = appsRes.data || [];
      setAppliedJobs(apps);

      // 2. Fetch complete interview questions catalog from backend
      const catRes = await api.get('/interview/catalog').catch(() => ({ data: [] }));
      let allQuestions = catRes.data || [];

      // If backend returned catalog, also pull application-specific generated questions
      if (apps.length > 0) {
        for (const app of apps) {
          try {
            const appQRes = await api.get(`/interview/${app.id}`);
            if (appQRes.data && appQRes.data.length > 0) {
              const appTitle = app.job_title || 'Applied Job';
              appQRes.data.forEach((q: any) => {
                // Check if already in list
                if (!allQuestions.some((item: any) => item.question === q.question)) {
                  allQuestions.push({
                    id: allQuestions.length + 100,
                    question: q.question,
                    category: q.category === 'skill_gap' ? 'Skill Gap Assessment' : q.category,
                    domain: `Job Match (${appTitle})`,
                    skill_focus: q.skill_focus || appTitle,
                    difficulty: q.difficulty || 'Medium',
                    suggested_answer_points: q.suggested_answer_points || []
                  });
                }
              });
            }
          } catch (e) {
            // non-blocking
          }
        }
      }

      setQuestions(allQuestions);
    } catch (err) {
      console.error('Failed to load interview questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReveal = (id: number) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastered = (id: number) => {
    setMastered((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('ats_mastered_questions', JSON.stringify(updated));
      } catch (e) {
        // storage error
      }
      return updated;
    });
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      !searchQuery ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.skill_focus && q.skill_focus.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.suggested_answer_points &&
        q.suggested_answer_points.some((p: string) =>
          p.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesDomain =
      selectedDomain === 'all' ||
      (q.domain && q.domain.toLowerCase().includes(selectedDomain.toLowerCase())) ||
      (q.category && q.category.toLowerCase().includes(selectedDomain.toLowerCase())) ||
      (q.skill_focus && q.skill_focus.toLowerCase().includes(selectedDomain.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const masteredCount = Object.values(mastered).filter(Boolean).length;
  const progressPercent = questions.length > 0 ? Math.round((masteredCount / questions.length) * 100) : 0;

  const domainTabs = [
    { id: 'all', label: 'All Questions' },
    { id: 'machine learning', label: 'Machine Learning & AI' },
    { id: 'natural language processing', label: 'NLP & Transformers' },
    { id: 'react', label: 'Full-Stack & React' },
    { id: 'fastapi', label: 'Backend & APIs' },
    { id: 'cloud', label: 'Cloud & DevOps' },
    { id: 'system design', label: 'System Design' },
    { id: 'behavioral', label: 'Behavioral (STAR)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            Interactive Interview Preparation Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Industry-aligned technical and behavioral questions mapped to job descriptions with model answer talking points.
          </p>
        </div>
      </div>

      {/* Progress & Mastery Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 w-full md:w-1/2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Your Interview Readiness Progress
            </span>
            <span className="font-mono font-bold text-purple-400">{progressPercent}% Mastered</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>{masteredCount} questions marked as mastered</span>
            <span>{questions.length} total questions in catalog</span>
          </div>
        </div>

        {/* Applied Roles Quick Filter */}
        {appliedJobs.length > 0 && (
          <div className="w-full md:w-auto p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              Tailored For Your Applied Openings:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {appliedJobs.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSearchQuery(app.job_title)}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-medium transition-colors"
                >
                  {app.job_title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800 text-xs font-semibold">
        {domainTabs.map((tab) => {
          const isActive = selectedDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedDomain(tab.id);
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 rounded-t-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-purple-300 border-t-2 border-purple-500 border-x border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Difficulty Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search questions by keyword, topic, or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-slate-400 font-medium">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {(selectedDomain !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Question List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs space-y-2">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>Loading curated interview questions and model answer hints...</div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">No questions matched your search criteria</div>
          <p className="text-slate-400 max-w-md mx-auto">
            Try broadening your search term or switching to another domain tab to view questions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isQMastered = !!mastered[q.id || idx];
            const isRevealed = !!revealed[q.id || idx];

            return (
              <div
                key={q.id || idx}
                className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                  isQMastered
                    ? 'border-emerald-500/40 bg-slate-900/90'
                    : 'border-slate-800 hover:border-slate-700'
                } space-y-3`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.category?.toLowerCase().includes('behavioral')
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : q.category?.toLowerCase().includes('gap')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {q.category || 'Technical'}
                    </span>
                    {q.skill_focus && (
                      <span className="text-xs text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        Focus: <strong className="text-slate-200">{q.skill_focus}</strong>
                      </span>
                    )}
                    {q.domain && (
                      <span className="text-[11px] text-slate-500">
                        • {q.domain}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        q.difficulty === 'Easy'
                          ? 'bg-blue-500/10 text-blue-300'
                          : q.difficulty === 'Medium'
                          ? 'bg-purple-500/10 text-purple-300'
                          : 'bg-orange-500/10 text-orange-300'
                      }`}
                    >
                      Difficulty: {q.difficulty}
                    </span>

                    {/* Mastered Button */}
                    <button
                      onClick={() => toggleMastered(q.id || idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isQMastered
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }`}
                      title={isQMastered ? 'Mark as Not Mastered' : 'Mark as Mastered'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isQMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                  {q.question}
                </h3>

                {/* Reveal Model Answer Button */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <button
                    onClick={() => toggleReveal(q.id || idx)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>{isRevealed ? 'Hide Answer Hints' : 'Reveal Model Answer Talking Points'}</span>
                    {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Model Answer Body */}
                {isRevealed && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Model Answer Talking Points & Evaluation Criteria:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {(q.suggested_answer_points || q.points || []).map((pt: string, pidx: number) => (
                        <li key={pidx} className="flex items-start gap-2">
                          <span className="text-purple-400 font-bold">•</span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
