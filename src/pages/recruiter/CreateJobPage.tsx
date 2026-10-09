import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, Briefcase, Tag, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { SkillBadge } from '../../components/SkillBadge';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('Senior Machine Learning Engineer');
  const [department, setDepartment] = useState<string>('AI & Data Science');
  const [experienceLevel, setExperienceLevel] = useState<string>('Mid to Senior Level');
  const [location, setLocation] = useState<string>('Bangalore / Hybrid');
  const [jobType, setJobType] = useState<string>('Full-Time');
  const [description, setDescription] = useState<string>(`We are looking for an exceptional Machine Learning Engineer to design and deploy transformer models and NLP search pipelines.
Responsibilities:
- Build Sentence-BERT dense vector embeddings and semantic search APIs using FastAPI.
- Optimize PyTorch models, SQL databases, and data processing with Pandas.
- Containerize services with Docker and deploy to AWS.
Required Skills: Python, Machine Learning, Natural Language Processing, PyTorch, SQL, Docker, AWS.
Preferred Skills: Kubernetes, FastAPI, scikit-learn.`);
  
  const [requiredSkills, setRequiredSkills] = useState<string>('Python, Machine Learning, Natural Language Processing, PyTorch, SQL, Docker, AWS');
  const [preferredSkills, setPreferredSkills] = useState<string>('Kubernetes, FastAPI, scikit-learn, Git');
  const [minEducation, setMinEducation] = useState<string>("Master of Computer Applications (MCA) or B.Tech in CS");
  const [minExperience, setMinExperience] = useState<number>(2.0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const reqSkillsList = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    const prefSkillsList = preferredSkills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      await api.post('/jobs', {
        title,
        department,
        experience_level: experienceLevel,
        location,
        job_type: jobType,
        description,
        required_skills: reqSkillsList,
        preferred_skills: prefSkillsList,
        min_education: minEducation,
        min_experience_years: minExperience
      });
      navigate('/recruiter/jobs');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to post job opening');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create & Publish Job Opening</h1>
        <p className="text-xs text-slate-400">The NLP pipeline will analyze requirements to semantically match and rank applicant resumes.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="Entry-Level">Entry-Level (0-2 Yrs)</option>
              <option value="Mid-Level">Mid-Level (2-5 Yrs)</option>
              <option value="Senior-Level">Senior-Level (5+ Yrs)</option>
              <option value="Lead / Principal">Lead / Principal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location & Workplace</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Comprehensive Job Description</label>
          <textarea
            rows={6}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">Used by Sentence-BERT embeddings and TF-IDF vectorizer for semantic matching.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              placeholder="e.g. Python, Machine Learning, SQL, PyTorch"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred / Bonus Skills (Comma separated)</label>
            <input
              type="text"
              value={preferredSkills}
              onChange={(e) => setPreferredSkills(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              placeholder="e.g. Docker, Kubernetes, AWS"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/recruiter/jobs')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isLoading ? 'Publishing...' : 'Publish Job Opening'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
