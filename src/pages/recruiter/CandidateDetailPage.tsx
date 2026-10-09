import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  FileText,
  Clock,
  Award,
  Save,
  Check,
  RotateCcw
} from 'lucide-react';
import api from '../../api/client';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';

export const CandidateDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [recruiterNotes, setRecruiterNotes] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skill_gaps' | 'interview_q' | 'resume'>('overview');

  useEffect(() => {
    if (applicationId) fetchCandidateDetails();
  }, [applicationId]);

  const fetchCandidateDetails = async () => {
    try {
      const res = await api.get(`/recruiter/candidate-deep-dive/${applicationId}`);
      setData(res.data);
      setRecruiterNotes(res.data.recruiter_notes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string, isShortlisted?: boolean) => {
    setIsUpdating(true);
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
        is_shortlisted: isShortlisted,
        recruiter_notes: recruiterNotes
      });

      setData((prev: any) => ({
        ...prev,
        status: newStatus,
        is_shortlisted: isShortlisted !== undefined ? isShortlisted : prev.is_shortlisted,
        recruiter_notes: recruiterNotes
      }));

      const msg =
        newStatus === 'shortlisted'
          ? 'Candidate successfully shortlisted for interview!'
          : newStatus === 'rejected'
          ? 'Application marked as rejected.'
          : `Application status updated to ${newStatus}.`;

      setToastMessage({
        text: msg,
        type: newStatus === 'shortlisted' ? 'success' : newStatus === 'rejected' ? 'danger' : 'info'
      });

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to update candidate status:', err);
      setToastMessage({ text: 'Failed to update application status. Please try again.', type: 'danger' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: data?.status || 'applied',
        is_shortlisted: data?.is_shortlisted || false,
        recruiter_notes: recruiterNotes
      });
      setToastMessage({ text: 'Recruiter notes saved successfully!', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save recruiter notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs space-y-2">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div>Loading detailed candidate deep-dive profile...</div>
      </div>
    );
  }

  const { candidate, job, match_score, skill_gaps, interview_questions, resume, status, is_shortlisted } = data;

  const statusColor =
    status === 'shortlisted' || is_shortlisted
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : status === 'rejected'
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      : status === 'reviewing'
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      : 'bg-slate-800 text-slate-300 border-slate-700';

  const requiredExpDisplay =
    match_score?.experience_analysis?.required_years ||
    (job?.min_experience_years !== undefined ? `${job.min_experience_years} yrs` : '2.0 yrs');

  const requiredEduDisplay =
    job?.min_education ||
    match_score?.education_analysis?.required_degrees ||
    "Bachelor's / MCA in CS or related field";

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : toastMessage.type === 'danger'
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
              : 'bg-blue-950/80 border-blue-500/50 text-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'danger' && <XCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-400" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Back Link & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/recruiter/candidates"
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Rankings</span>
        </Link>

        {/* Shortlist / Reject Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange('shortlisted', true)}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              status === 'shortlisted' || is_shortlisted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{status === 'shortlisted' || is_shortlisted ? '✓ Shortlisted for Interview' : 'Shortlist for Interview'}</span>
          </button>

          <button
            onClick={() => handleStatusChange('rejected', false)}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              status === 'rejected'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{status === 'rejected' ? 'Application Rejected' : 'Reject'}</span>
          </button>

          {(status === 'shortlisted' || status === 'rejected') && (
            <button
              onClick={() => handleStatusChange('applied', false)}
              disabled={isUpdating}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset application status to Pending"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Candidate Banner & Summary */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-xl text-white shadow-md">
              {candidate.name ? candidate.name.charAt(0) : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                  {status === 'shortlisted' || is_shortlisted ? 'Shortlisted' : status}
                </span>
              </div>
              <p className="text-xs text-blue-400 mt-0.5">{candidate.headline}</p>
              <p className="text-xs text-slate-400">
                Applied for: <strong className="text-slate-200">{job.title}</strong> ({job.department})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {candidate.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> {candidate.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {candidate.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 self-stretch md:self-auto justify-center">
          <ScoreGauge score={match_score.overall_score} size="md" label="Compatibility Score" />
        </div>
      </div>

      {/* Recruiter Notes Input Box */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" /> Recruiter Internal Notes & Interview Remarks
          </label>
          <button
            onClick={handleSaveNotes}
            disabled={isUpdating}
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Notes</span>
          </button>
        </div>
        <textarea
          value={recruiterNotes}
          onChange={(e) => setRecruiterNotes(e.target.value)}
          placeholder="Add interviewer notes, technical screening feedback, or interview schedule..."
          rows={2}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'overview', label: 'Match Overview & Strengths', icon: Sparkles },
          { id: 'skill_gaps', label: `Skill Gap Matrix (${skill_gaps?.length || 0})`, icon: AlertCircle },
          { id: 'interview_q', label: `Generated Interview Questions (${interview_questions?.length || 0})`, icon: HelpCircle },
          { id: 'resume', label: 'Raw Extracted Resume', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all ${
                isActive
                  ? 'bg-slate-800 text-blue-400 border-t-2 border-blue-500 border-x border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Score Trio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Sentence-BERT Semantic Match</div>
              <div className="text-2xl font-bold text-purple-400">{Math.round(match_score.semantic_score)}%</div>
              <p className="text-[11px] text-slate-500 mt-1">40% weight • Dense contextual transformer vectors</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">TF-IDF Keyword Similarity</div>
              <div className="text-2xl font-bold text-blue-400">{Math.round(match_score.tfidf_score)}%</div>
              <p className="text-[11px] text-slate-500 mt-1">30% weight • N-gram terminology overlap</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Skill Coverage Ratio</div>
              <div className="text-2xl font-bold text-emerald-400">{Math.round(match_score.skill_score)}%</div>
              <p className="text-[11px] text-slate-500 mt-1">30% weight • Required and preferred skills coverage</p>
            </div>
          </div>

          {/* Experience & Education Alignment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" /> Experience Requirement Alignment
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                  {match_score.experience_analysis?.status || 'Fit'}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span>
                  Job Requirement: <strong className="text-white">{requiredExpDisplay}</strong>
                </span>
                <span>
                  Candidate Detected:{' '}
                  <strong className="text-emerald-400">
                    {match_score.experience_analysis?.candidate_years || '2.0 yrs'}
                  </strong>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" /> Education Qualification Check
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                  {match_score.education_analysis?.status || 'Relevant'}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span className="truncate max-w-[200px]">
                  Required: <strong className="text-white">{requiredEduDisplay}</strong>
                </span>
                <span>
                  Detected:{' '}
                  <strong className="text-purple-300">
                    {match_score.education_analysis?.candidate_degrees || 'MCA / B.Tech'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Validated Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {match_score.strengths?.length > 0 ? (
                  match_score.strengths.map((str: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-xs">Strong overall baseline candidate.</li>
                )}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Potential Skill Gaps
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {match_score.gaps?.length > 0 ? (
                  match_score.gaps.map((gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400">•</span>
                      <span>{gap}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-xs">No critical gaps identified for this role.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Education & Experience Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-blue-400" /> Education Background
              </h4>
              <div className="space-y-3">
                {candidate.education?.map((edu: any, idx: number) => (
                  <div key={idx} className="text-xs">
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-slate-400">{edu.institution} • {edu.year}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-blue-400" /> Work Experience
              </h4>
              <div className="space-y-3">
                {candidate.experience?.map((exp: any, idx: number) => (
                  <div key={idx} className="text-xs">
                    <div className="font-bold text-white">{exp.title}</div>
                    <div className="text-slate-400">{exp.company} • {exp.duration}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Gaps */}
      {activeTab === 'skill_gaps' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Granular Skill Gap Analysis</h3>
            <p className="text-xs text-slate-400 mb-4">
              Classified into Matched (explicit evidence), Weak (contextual mention), and Missing.
            </p>

            <div className="space-y-2">
              {skill_gaps?.map((gap: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <SkillBadge name={gap.skill_name} status={gap.status} />
                      <span className="text-[10px] uppercase font-bold text-slate-500">{gap.importance}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{gap.candidate_evidence}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      gap.status === 'matched'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : gap.status === 'weak'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {gap.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interview Questions */}
      {activeTab === 'interview_q' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Algorithmic Interview Questions</h3>
            <p className="text-xs text-slate-400 mb-4">
              Contextually prioritized to test candidate strengths, weaknesses, and behavioral competence.
            </p>

            <div className="space-y-4">
              {interview_questions?.map((q: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.category === 'skill_gap'
                            ? 'bg-rose-500/20 text-rose-300'
                            : q.category === 'technical'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {q.category}
                      </span>
                      {q.skill_focus && <span className="text-slate-400 font-mono">Focus: {q.skill_focus}</span>}
                    </div>
                    <span className="text-slate-500 text-[10px]">Difficulty: {q.difficulty}</span>
                  </div>

                  <p className="font-bold text-white text-sm">{q.question}</p>

                  {q.suggested_answer_points?.length > 0 && (
                    <div className="pt-2 border-t border-slate-900 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Key Answer Pointers to Look For:</span>
                      <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
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
      )}

      {/* Tab 4: Raw Resume */}
      {activeTab === 'resume' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-2">Extracted Document Text ({resume?.filename || 'Resume'})</h3>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
            {resume?.raw_text_excerpt || 'No excerpt available.'}
          </pre>
        </div>
      )}
    </div>
  );
};
