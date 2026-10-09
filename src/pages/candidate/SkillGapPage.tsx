import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ExternalLink,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Layers,
  GraduationCap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import api from '../../api/client';

export const SkillGapPage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [candidateGaps, setCandidateGaps] = useState<{
    matched: string[];
    weak: string[];
    missing: string[];
  }>({ matched: [], weak: [], missing: [] });
  
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Candidate Applications to extract real skill gaps
      const appsRes = await api.get('/applications/my-applications').catch(() => ({ data: [] }));
      const apps = appsRes.data || [];
      setApplications(apps);

      const matchedSet = new Set<string>();
      const weakSet = new Set<string>();
      const missingSet = new Set<string>();

      apps.forEach((app: any) => {
        if (app.match_score) {
          (app.match_score.matched_skills || []).forEach((s: string) => matchedSet.add(s));
          (app.match_score.weak_skills || []).forEach((s: string) => weakSet.add(s));
          (app.match_score.missing_skills || []).forEach((s: string) => missingSet.add(s));
        }
      });

      setCandidateGaps({
        matched: Array.from(matchedSet),
        weak: Array.from(weakSet),
        missing: Array.from(missingSet)
      });

      // 2. Fetch Learning Recommendations
      // Query for missing & weak skills if present, or fetch full verified database
      const prioritySkills = [...Array.from(missingSet), ...Array.from(weakSet)];
      const recRes = await api.get('/learning/recommendations', {
        params: prioritySkills.length > 0 ? { skills: prioritySkills.join(',') } : {}
      });
      
      let resList = recRes.data || [];
      
      // If few recommendations came back, also fetch the full catalog to give wide options
      if (resList.length < 8) {
        const catalogRes = await api.get('/learning/resources').catch(() => ({ data: [] }));
        const existingTitles = new Set(resList.map((r: any) => r.title));
        (catalogRes.data || []).forEach((catItem: any) => {
          if (!existingTitles.has(catItem.title)) {
            resList.push(catItem);
          }
        });
      }

      setResources(resList);
    } catch (err) {
      console.error('Failed to load learning resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter resources
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      !searchQuery ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill =
      selectedSkillFilter === 'all' ||
      res.skill_name.toLowerCase() === selectedSkillFilter.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      res.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesType =
      selectedType === 'all' ||
      (res.resource_type && res.resource_type.toLowerCase() === selectedType.toLowerCase());

    return matchesSearch && matchesSkill && matchesDifficulty && matchesType;
  });

  // Extract all unique skills available in resources
  const availableSkills = Array.from(new Set(resources.map((r) => r.skill_name)));

  // Calculate estimated study hours
  const totalHours = filteredResources.reduce((acc, curr) => acc + (curr.estimated_hours || 10), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Skill Gap Explorer & Learning Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalized upskilling roadmaps and verified courses curated to bridge competencies identified in your job applications.
          </p>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Identified Missing Skills</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{candidateGaps.missing.length || 0}</div>
          <div className="text-[10px] text-slate-500 mt-1">Target for high ATS impact</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Partial / Weak Competencies</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{candidateGaps.weak.length || 0}</div>
          <div className="text-[10px] text-slate-500 mt-1">Strengthen with tutorials</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Curated Resources Available</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{resources.length || 0}</div>
          <div className="text-[10px] text-slate-500 mt-1">Verified platforms & docs</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Total Upskilling Duration</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">~{totalHours}h</div>
          <div className="text-[10px] text-slate-500 mt-1">Self-paced modular roadmap</div>
        </div>
      </div>

      {/* Candidate Skill Breakdown Matrix (If applications exist) */}
      {(candidateGaps.missing.length > 0 || candidateGaps.weak.length > 0 || candidateGaps.matched.length > 0) && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Your Application Competency Breakdown
            </h3>
            <span className="text-[11px] text-slate-400">Click any skill to filter relevant learning roadmaps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Missing Skills */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Missing Core Skills
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  {candidateGaps.missing.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidateGaps.missing.length === 0 ? (
                  <span className="text-xs text-slate-500">None detected! Strong alignment.</span>
                ) : (
                  candidateGaps.missing.map((sk, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSkillFilter(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        selectedSkillFilter.toLowerCase() === sk.toLowerCase()
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/50'
                      }`}
                    >
                      {sk}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Weak Skills */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Needs Practice / Weak
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {candidateGaps.weak.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidateGaps.weak.length === 0 ? (
                  <span className="text-xs text-slate-500">No weak competencies detected.</span>
                ) : (
                  candidateGaps.weak.map((sk, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSkillFilter(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        selectedSkillFilter.toLowerCase() === sk.toLowerCase()
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                      }`}
                    >
                      {sk}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Matched Skills */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Validated Strengths
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {candidateGaps.matched.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidateGaps.matched.length === 0 ? (
                  <span className="text-xs text-slate-500">Submit an application to validate.</span>
                ) : (
                  candidateGaps.matched.slice(0, 6).map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                    >
                      {sk}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search topic, course, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Skill Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="all">All Tech Topics ({availableSkills.length})</option>
            {availableSkills.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Reset Filters */}
          {(selectedSkillFilter !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSkillFilter('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>Loading verified educational courses and tutorials...</div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-bold text-white">No matching learning resources found</div>
          <p className="text-slate-400 max-w-md mx-auto">
            Try resetting your active filters or searching for another keyword to view recommended courses.
          </p>
          <button
            onClick={() => {
              setSelectedSkillFilter('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-block"
          >
            View All Resources
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    {res.skill_name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        res.difficulty === 'Beginner'
                          ? 'bg-blue-500/10 text-blue-300'
                          : res.difficulty === 'Intermediate'
                          ? 'bg-purple-500/10 text-purple-300'
                          : 'bg-orange-500/10 text-orange-300'
                      }`}
                    >
                      {res.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {res.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[150px]">
                    Platform: <strong className="text-slate-300">{res.provider}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Clock className="w-3 h-3 text-slate-500" />
                    ~{res.estimated_hours}h
                  </span>
                </div>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 hover:border-transparent font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Access Course / Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
