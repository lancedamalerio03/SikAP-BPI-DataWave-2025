// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { SikAPLanding } from './components/SikAPLanding';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PreLoanApplication from './components/PreLoanApplication';

// Public pages
import Programs from './components/Programs';
import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';

// Dashboard imports (User/Borrower Dashboard)
import DashboardLayout from './components/DashboardLayout';
import HomePage from './components/dashboard/HomePage';
import PortfolioPage from './components/dashboard/PortfolioPage';
import LoansPage from './components/dashboard/LoansPage';
import LoanOfferDetails from './components/dashboard/LoanOfferDetails'; // NEW IMPORT
import AgentsPage from './components/dashboard/AgentsPage';
import ChatbotPage from './components/dashboard/ChatbotPage';
import ProfilePage from './components/dashboard/ProfilePage';

// Forms and Portals
import DocumentUploadPortal from './components/DocumentUploadPortal';
import ESGComplianceForm from './components/ESGComplianceForm';
import AssetDeclarationForm from './components/AssetDeclarationForm';

// Loan Officer Dashboard imports
import OfficerDashboard from './components/officer/OfficerDashboard';
import Analytics from './components/officer/Analytics';
import RiskPortfolio from './components/officer/RiskPortfolio';
import LoanRequests from './components/officer/LoanRequests';

import './index.css';

// Wrapper component to fetch application data for DocumentUploadPortal
const DocumentUploadWrapper = () => {
  const { applicationId } = useParams();
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        // Try to get application data from localStorage first
        const userApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
        const application = userApplications.find(app => app.id === applicationId);
        
        if (application) {
          setApplicationData(application);
        } else {
          console.warn('Application not found for ID:', applicationId);
        }
      } catch (error) {
        console.error('Error fetching application data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationData();
    }
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return <DocumentUploadPortal applicationData={applicationData} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SikAPLanding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/application" element={<PreLoanApplication />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Document Upload Portal Route */}
          <Route 
            path="/loans/:applicationId/documents" 
            element={
              <ProtectedRoute>
                <DocumentUploadWrapper />
              </ProtectedRoute>
            } 
          />

          {/* ESG Compliance Form Route */}
          <Route 
            path="/esg-compliance/:applicationId" 
            element={
              <ProtectedRoute>
                <ESGComplianceForm />
              </ProtectedRoute>
            } 
          />

          {/* Asset Declaration Form Route */}
          <Route 
            path="/asset-declaration/:applicationId" 
            element={
              <ProtectedRoute>
                <AssetDeclarationForm />
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
            <Route path="loans/:applicationId/details" element={<LoanOfferDetails />} /> {/* NEW ROUTE */}
            <Route path="agents" element={<AgentsPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Loan Officer Dashboard Routes */}
          <Route 
            path="/officer" 
            element={
              <ProtectedRoute>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Analytics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="portfolio" element={<RiskPortfolio />} />
            <Route path="requests" element={<LoanRequests />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;