import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { SikAPLanding } from './components/SikAPLanding';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PreLoanApplication from './components/PreLoanApplication';

// Add the new page imports
import Programs from './components/Programs';
import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';

// Dashboard imports (User/Borrower Dashboard)
import DashboardLayout from './components/DashboardLayout';
import HomePage from './components/dashboard/HomePage';
import PortfolioPage from './components/dashboard/PortfolioPage';
import LoansPage from './components/dashboard/LoansPage';
import AgentsPage from './components/dashboard/AgentsPage';
import ChatbotPage from './components/dashboard/ChatbotPage';
import ProfilePage from './components/dashboard/ProfilePage';

// Loan Officer Dashboard imports
import LoanOfficerDashboard from './components/officer/LoanOfficerDashboard';
import AnalyticsTab from './components/officer/Analytics';
import RiskPortfolioTab from './components/officer/RiskPortfolio';
import LoanRequestsTab from './components/officer/LoanRequests';
import ActivityLogTab from './components/officer/ActivityLog';
import AIAgentsTab from './components/officer/AIAgents';
import WorkflowTab from './components/officer/Workflow';
import SettingsTab from './components/officer/Settings';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SikAPLanding />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Public Routes */}
            <Route path="/programs" element={<Programs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/application" 
              element={
                <ProtectedRoute>
                  <PreLoanApplication />
                </ProtectedRoute>
              } 
            />
            
            {/* User/Borrower Dashboard Routes - Protected with nested routing */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="home" element={<HomePage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="agents" element={<AgentsPage />} />
              <Route path="chatbot" element={<ChatbotPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            {/* Loan Officer Dashboard Routes - NEW ADDITION */}
            <Route 
              path="/officer" 
              element={
                <ProtectedRoute>
                  <LoanOfficerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Individual Loan Officer Dashboard Pages (Alternative Routing) */}
            <Route 
              path="/officer/analytics" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <AnalyticsTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer/risk" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <RiskPortfolioTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer/requests" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <LoanRequestsTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer/activity" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <ActivityLogTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer/agents" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <AIAgentsTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer/workflow" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <WorkflowTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer/settings" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <SettingsTab 
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Future Routes - Commented for now */}
            {/* 
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute requireVerification={true}>
                  <DocumentPortal />
                </ProtectedRoute>
              } 
            />
            */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;