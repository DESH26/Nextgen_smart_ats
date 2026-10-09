import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, User, Briefcase, GraduationCap } from 'lucide-react';
import api from '../../api/client';
import { SkillBadge } from '../../components/SkillBadge';

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF or DOCX resume file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setParsedResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Resume extraction failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-blue-400" />
          Resume Parser & NLP Entity Extractor
        </h1>
        <p className="text-xs text-slate-400">
          Upload your resume in PDF or DOCX format. The NLP pipeline will extract skills, education, experience, and projects.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 transition-colors flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-blue-400 mb-3" />
          <p className="text-sm font-semibold text-white">
            {file ? file.name : 'Drag & drop your PDF or DOCX resume, or browse'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Maximum file size: 10MB • PyMuPDF & python-docx Parser</p>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="resume-file-input"
          />
          <label
            htmlFor="resume-file-input"
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Select Document
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          {isUploading ? 'Extracting Text & Entities...' : 'Parse & Save Resume'}
        </button>
      </form>

      {/* Live Extracted Results Inspector */}
      {parsedResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Structured Entities Extracted by NLP Pipeline</h3>
            </div>
            <button
              onClick={() => navigate('/candidate/jobs')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <span>Explore Matching Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Candidate Name</span>
              <span className="font-bold text-white text-sm">{parsedResult.parsed_data?.name || 'Candidate'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Email</span>
              <span className="text-slate-300">{parsedResult.parsed_data?.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Location</span>
              <span className="text-slate-300">{parsedResult.parsed_data?.location}</span>
            </div>
          </div>

          {/* Extracted Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Detected Skills ({parsedResult.parsed_data?.skills?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {parsedResult.parsed_data?.skills?.map((s: string, i: number) => (
                <SkillBadge key={i} name={s} status="matched" size="sm" />
              ))}
            </div>
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" /> Extracted Education
              </h4>
              {parsedResult.parsed_data?.education?.map((edu: any, idx: number) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-2">
                  <div className="font-bold text-white">{edu.degree}</div>
                  <div className="text-slate-400 text-[11px]">{edu.institution} ({edu.year})</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-400" /> Work Experience
              </h4>
              {parsedResult.parsed_data?.experience?.map((exp: any, idx: number) => (
                <div key={idx} className="border-l-2 border-emerald-500 pl-2">
                  <div className="font-bold text-white">{exp.title}</div>
                  <div className="text-slate-400 text-[11px]">{exp.company} ({exp.duration})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
