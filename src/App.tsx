import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Recruiter
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CreateJobPage } from './pages/recruiter/CreateJobPage';
import { JobListPage } from './pages/recruiter/JobListPage';
import { CandidateRankingPage } from './pages/recruiter/CandidateRankingPage';
import { CandidateDetailPage } from './pages/recruiter/CandidateDetailPage';
import { RecruiterAnalyticsPage } from './pages/recruiter/RecruiterAnalyticsPage';

// Candidate
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ResumeUploadPage } from './pages/candidate/ResumeUploadPage';
import { JobListCandidatePage } from './pages/candidate/JobListCandidatePage';
import { ApplicationDetailPage } from './pages/candidate/ApplicationDetailPage';
import { SkillGapPage } from './pages/candidate/SkillGapPage';
import { InterviewPrepPage } from './pages/candidate/InterviewPrepPage';

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ModelEvaluationPage } from './pages/admin/ModelEvaluationPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><LandingPage /></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<ProtectedLayout allowedRoles={['recruiter', 'admin']}><RecruiterDashboard /></ProtectedLayout>} />
          <Route path="/recruiter/create-job" element={<ProtectedLayout allowedRoles={['recruiter', 'admin']}><CreateJobPage /></ProtectedLayout>} />
          <Route path="/recruiter/jobs" element={<ProtectedLayout allowedRoles={['recruiter', 'admin']}><JobListPage /></ProtectedLayout>} />
          <Route path="/recruiter/candidates" element={<ProtectedLayout allowedRoles={['recruiter', 'admin']}><CandidateRankingPage /></ProtectedLayout>} />
          <Route path="/recruiter/candidate-detail/:applicationId" element={<ProtectedLayout allowedRoles={['recruiter', 'admin']}><CandidateDetailPage /></ProtectedLayout>} />
          <Route path="/recruiter/analytics" element={<ProtectedLayout allowedRoles={['recruiter', 'admin']}><RecruiterAnalyticsPage /></ProtectedLayout>} />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={<ProtectedLayout allowedRoles={['candidate', 'admin']}><CandidateDashboard /></ProtectedLayout>} />
          <Route path="/candidate/upload-resume" element={<ProtectedLayout allowedRoles={['candidate', 'admin']}><ResumeUploadPage /></ProtectedLayout>} />
          <Route path="/candidate/jobs" element={<ProtectedLayout allowedRoles={['candidate', 'admin']}><JobListCandidatePage /></ProtectedLayout>} />
          <Route path="/candidate/application-feedback/:id" element={<ProtectedLayout allowedRoles={['candidate', 'admin']}><ApplicationDetailPage /></ProtectedLayout>} />
          <Route path="/candidate/skill-gaps" element={<ProtectedLayout allowedRoles={['candidate', 'admin']}><SkillGapPage /></ProtectedLayout>} />
          <Route path="/candidate/interview-prep" element={<ProtectedLayout allowedRoles={['candidate', 'admin']}><InterviewPrepPage /></ProtectedLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedLayout allowedRoles={['admin']}><AdminDashboard /></ProtectedLayout>} />
          <Route path="/admin/evaluation" element={<ProtectedLayout allowedRoles={['admin']}><ModelEvaluationPage /></ProtectedLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
