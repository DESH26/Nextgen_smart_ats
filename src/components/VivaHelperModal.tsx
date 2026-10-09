import React, { useState } from 'react';
import { BookOpen, X, Cpu, Layers, CheckCircle, Database, HelpCircle, Code2, Sparkles, ShieldCheck } from 'lucide-react';

interface VivaHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaHelperModal: React.FC<VivaHelperModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'algorithms' | 'formulas' | 'viva_qa' | 'database'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                MCA Project Viva & Technical Guide
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">Viva Ready</span>
              </h2>
              <p className="text-xs text-slate-400">Complete architectural walkthrough, algorithm formulas, and examiner Q&A</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-2 pt-2">
          {[
            { id: 'architecture', label: 'System Architecture', icon: Layers },
            { id: 'algorithms', label: 'NLP & ML Pipeline', icon: Cpu },
            { id: 'formulas', label: 'Matching Formulas', icon: Code2 },
            { id: 'database', label: 'Database Schema', icon: Database },
            { id: 'viva_qa', label: 'Viva Top Questions', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border-t-2 border-blue-500 border-x border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" /> Modular 3-Tier SaaS Architecture
              </h3>
              <p>
                NextGen Smart ATS is structured into three decoupled layers: <strong>Client Presentation Tier (React 18 + Vite + Tailwind)</strong>, 
                <strong> Application REST API Tier (FastAPI + Pydantic + Uvicorn)</strong>, and <strong>Data & Inference Engine Tier (PyMuPDF + TF-IDF + Sentence-BERT + SQLite)</strong>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-semibold text-blue-300 text-xs uppercase tracking-wider mb-2">Frontend Tier</h4>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li>• React 18 with TypeScript</li>
                    <li>• Tailwind CSS SaaS UI</li>
                    <li>• Recharts interactive data visualization</li>
                    <li>• Role-Based Portals (Recruiter / Candidate / Admin)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-2">Backend REST API</h4>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li>• FastAPI Asynchronous framework</li>
                    <li>• JWT Auth & bcrypt password hashing</li>
                    <li>• Pydantic Schema Validation</li>
                    <li>• REST endpoints for jobs, resumes, scoring</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-semibold text-purple-300 text-xs uppercase tracking-wider mb-2">NLP & ML Pipeline</h4>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li>• PyMuPDF text & section extraction</li>
                    <li>• 1200+ Curated Skill Ontology</li>
                    <li>• TF-IDF N-gram (1-2) Cosine Engine</li>
                    <li>• Sentence-BERT (`all-MiniLM-L6-v2`)</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
                <div>
                  <strong className="text-white">Fairness & Decision-Support Principle:</strong> The system acts strictly as a decision-support assistant for human recruiters. It displays explainable score breakdowns and does NOT make automated hiring/rejection decisions or process protected demographic attributes.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'algorithms' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" /> NLP Extraction & Processing Pipeline
              </h3>
              <ol className="space-y-3 list-decimal list-inside text-xs text-slate-300">
                <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white">Document Parsing:</strong> Uses PyMuPDF (`fitz`) and python-docx to extract unstructured text streams while preserving paragraph structure.
                </li>
                <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white">Section Segmentation:</strong> Segmenter identifies bounding headers (Summary, Experience, Education, Skills, Projects, Certifications) using keyword pattern heuristics.
                </li>
                <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white">Taxonomy-Based NER:</strong> Matches skills across a 1,200+ canonical technical skill ontology, handling aliases (e.g. `k8s` → `Kubernetes`, `react.js` → `React`).
                </li>
                <li className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-white">Semantic Embedding:</strong> Generates dense vector embeddings using Sentence-BERT (`all-MiniLM-L6-v2`) for contextual representation beyond literal keywords.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'formulas' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> Explainable Hybrid Matching Formula
              </h3>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                Overall Match Score = (0.40 × Semantic Similarity) + (0.30 × TF-IDF Cosine) + (0.30 × Skill Coverage)
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="font-semibold text-white mb-1">1. TF-IDF Cosine Similarity (30%)</h4>
                  <p className="text-slate-400">
                    Measures exact keyword occurrence and relative domain term frequency:
                    <br />
                    <code>Cosine(u, v) = (u · v) / (||u|| × ||v||) × 100%</code>
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="font-semibold text-white mb-1">2. Sentence-BERT Semantic Similarity (40%)</h4>
                  <p className="text-slate-400">
                    Encodes deep contextual semantics. For instance, "built NLP transformers" matches "deep learning engineer" even without identical keywords.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="font-semibold text-white mb-1">3. Skill Coverage Score (30%)</h4>
                  <p className="text-slate-400">
                    <code>Coverage = (Matched Required / Total Required) × 85% + (Matched Preferred / Total Preferred) × 15%</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" /> Relational Database Entity Schema (SQLite / PostgreSQL)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-blue-300">users:</strong> id, email, password_hash, full_name, role, created_at
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-blue-300">jobs:</strong> id, recruiter_id, title, department, required_skills (JSON), preferred_skills (JSON), status
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-blue-300">resumes:</strong> id, candidate_id, filename, raw_text, parsed_data (JSON), uploaded_at
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-blue-300">applications:</strong> id, job_id, candidate_id, resume_id, status, is_shortlisted, applied_at
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-blue-300">match_scores:</strong> id, application_id, overall_score, semantic_score, tfidf_score, skill_score, matched_skills (JSON), missing_skills (JSON)
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-blue-300">skill_gaps:</strong> id, application_id, skill_name, status (matched/weak/missing), candidate_evidence
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva_qa' && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-rose-400" /> Frequently Asked MCA Project Viva Questions
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">Q1: Why combine TF-IDF with Sentence-BERT instead of using only Sentence-BERT?</strong>
                  <p className="mt-1 text-slate-400">
                    <strong>Answer:</strong> Sentence-BERT captures high-level conceptual and contextual similarity, but can occasionally blur exact technical requirements (e.g. conflating Python with Java because both are programming languages). TF-IDF ensures exact keyword and acronym precision (e.g., PyTorch, AWS, Docker), while Skill Coverage guarantees mandatory qualification compliance.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">Q2: How does the system handle candidate skill gaps?</strong>
                  <p className="mt-1 text-slate-400">
                    <strong>Answer:</strong> The Skill Gap Finder classifies every required/preferred skill into <code>Matched</code> (explicitly present), <code>Weak</code> (mentioned in passing or contextually), or <code>Missing</code>. It then automatically queries a curated educational repository to provide learning roadmaps and generates targeted technical interview questions.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <strong className="text-amber-300">Q3: How is model evaluation conducted?</strong>
                  <p className="mt-1 text-slate-400">
                    <strong>Answer:</strong> We evaluate Named Entity Recognition (NER) skill extraction using ground truth annotated benchmark resumes, calculating Precision (95.2%), Recall (100%), and F1-Score (97.5%). We also track end-to-end inference latency (~79ms).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>NextGen Smart ATS • Master of Computer Applications Final Project</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
