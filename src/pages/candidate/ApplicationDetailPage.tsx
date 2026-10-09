import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, BookOpen, HelpCircle, FileText, Clock, Award } from 'lucide-react';
import api from '../../api/client';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<any>(null);
  const [matchScore, setMatchScore] = useState<any>(null);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) fetchApplicationData();
  }, [id]);

  const fetchApplicationData = async () => {
    try {
      const [appRes, scoreRes, gapsRes, qRes] = await Promise.all([
        api.get(`/applications/${id}`),
        api.get(`/matching/${id}`),
        api.get(`/skill-gap/${id}`),
        api.get(`/interview/${id}`)
      ]);
      setApp(appRes.data);
      setMatchScore(scoreRes.data);
      setSkillGaps(gapsRes.data);
      setQuestions(qRes.data);

      if (scoreRes.data?.missing_skills?.length > 0) {
        const recRes = await api.get('/learning/recommendations', {
          params: { skills: scoreRes.data.missing_skills }
        });
        setResources(recRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !matchScore) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading application analysis...</div>;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/candidate/dashboard"
        className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Candidate Dashboard</span>
      </Link>

      {/* Compatibility Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold">
            Application Feedback & Evaluation
          </div>
          <h2 className="text-xl font-bold text-white">{app?.job_title}</h2>
          <p className="text-xs text-slate-400">
            Status: <span className="font-semibold text-white uppercase">{app?.status}</span> • Evaluated by Sentence-BERT & TF-IDF
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <ScoreGauge score={matchScore.overall_score} size="md" label="Compatibility Score" />
        </div>
      </div>

      {/* Score Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 font-semibold">Semantic Embeddings Match</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{Math.round(matchScore.semantic_score)}%</div>
          <div className="text-[11px] text-slate-500 mt-1">40% weight • Sentence-BERT</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 font-semibold">Keyword Density Similarity</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{Math.round(matchScore.tfidf_score)}%</div>
          <div className="text-[11px] text-slate-500 mt-1">30% weight • TF-IDF N-grams</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 font-semibold">Skill Requirement Coverage</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{Math.round(matchScore.skill_score)}%</div>
          <div className="text-[11px] text-slate-500 mt-1">30% weight • Taxonomy Coverage</div>
        </div>
      </div>

      {/* Experience & Education Fit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" /> Experience Level Fit
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] uppercase font-bold">
              {matchScore.experience_analysis?.status || 'Strong Fit'}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Required: <strong className="text-white">{matchScore.experience_analysis?.required_years || '2.0 years'}</strong> • Detected: <strong className="text-emerald-400">{matchScore.experience_analysis?.candidate_years || '2.0 years'}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" /> Education Relevance
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] uppercase font-bold">
              {matchScore.education_analysis?.status || 'Relevant'}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Qualification: <strong className="text-purple-300">{matchScore.education_analysis?.candidate_degrees || 'MCA / Graduate'}</strong>
          </div>
        </div>
      </div>

      {/* Strengths & Missing Competencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Your Profile Strengths
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {matchScore.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Areas for Skill Improvement
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {matchScore.gaps?.map((gap: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Targeted Interview Questions for Candidate Practice */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          Recommended Interview Preparation Questions
        </h3>
        <p className="text-xs text-slate-400 mb-4">Practice these questions generated based on this job role and your skill gaps</p>

        <div className="space-y-3">
          {questions.map((q: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                  {q.category}
                </span>
                <span className="text-slate-500 text-[10px]">Difficulty: {q.difficulty}</span>
              </div>
              <p className="font-bold text-white text-sm">{q.question}</p>
              {q.suggested_answer_points?.length > 0 && (
                <div className="pt-2 border-t border-slate-900">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Key Points to Highlight in Your Answer:</span>
                  <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5 mt-1">
                    {q.suggested_answer_points.map((pt: string, pidx: number) => (
                      <li key={pidx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
