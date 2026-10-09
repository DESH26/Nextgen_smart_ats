import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, Users, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/client';
import { Job } from '../../types';
import { SkillBadge } from '../../components/SkillBadge';

export const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Job Openings</h1>
          <p className="text-xs text-slate-400">Manage recruitment campaigns and inspect applicant candidate rankings</p>
        </div>
        <Link
          to="/recruiter/create-job"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opening</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading job postings...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{job.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${job.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.experience_level}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {job.required_skills?.map((sk, idx) => (
                    <SkillBadge key={idx} name={sk} status="neutral" size="sm" />
                  ))}
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end gap-3">
                <div className="text-xs text-slate-300 flex items-center gap-1.5 font-semibold">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{job.applications_count || 0} Candidates</span>
                </div>
                <Link
                  to={`/recruiter/candidates?job_id=${job.id}`}
                  className="px-4 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold text-xs transition-colors"
                >
                  View Ranked Candidates
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
