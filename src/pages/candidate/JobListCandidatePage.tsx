import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Search, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../api/client';
import { Job, Resume } from '../../types';
import { SkillBadge } from '../../components/SkillBadge';

export const JobListCandidatePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    fetchJobsAndResumes();
  }, []);

  const fetchJobsAndResumes = async () => {
    try {
      const [jobsRes, resumesRes, myAppsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/resumes/my-resumes'),
        api.get('/applications/my-applications')
      ]);
      setJobs(jobsRes.data);
      setResumes(resumesRes.data);
      if (resumesRes.data.length > 0) {
        setSelectedResume(resumesRes.data[0].id);
      }
      setAppliedJobs(myAppsRes.data.map((a: any) => a.job_id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    if (!selectedResume) {
      setStatusMessage('Please upload or select a resume before applying.');
      return;
    }

    try {
      await api.post('/applications/apply', {
        job_id: jobId,
        resume_id: selectedResume
      });
      setAppliedJobs([...appliedJobs, jobId]);
      setStatusMessage('Application submitted! Hybrid ATS evaluated your semantic compatibility.');
    } catch (err: any) {
      setStatusMessage(err.response?.data?.detail || 'Application failed');
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.required_skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Explore Job Openings & Apply</h1>
        <p className="text-xs text-slate-400">Discover job openings and receive immediate explainable semantic compatibility feedback.</p>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage('')} className="font-bold">×</button>
        </div>
      )}

      {/* Filter and Resume Selection */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by job title, department, or skill (e.g. Python, React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          {resumes.length > 0 ? (
            <select
              value={selectedResume || ''}
              onChange={(e) => setSelectedResume(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  Using Active Resume: {r.filename} ({r.parsed_data?.skills?.length || 0} skills)
                </option>
              ))}
            </select>
          ) : (
            <Link
              to="/candidate/upload-resume"
              className="w-full py-2 px-3 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-semibold"
            >
              Upload a Resume to Begin Applying
            </Link>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading open job positions...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobs.includes(job.id);
            return (
              <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {job.department}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.experience_level}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.required_skills?.map((sk, i) => (
                      <SkillBadge key={i} name={sk} status="neutral" size="sm" />
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0">
                  {hasApplied ? (
                    <span className="px-4 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply with 1-Click</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
