import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
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

// Portals + Forms
import DocumentUploadPortal from './components/DocumentUploadPortal';
import ESGComplianceForm from './components/ESGComplianceForm';
import AssetDeclarationForm from './components/AssetDeclarationForm';

// Loan Officer Dashboard imports
import OfficerDashboard from './components/officer/OfficerDashboard';
import Analytics from './components/officer/Analytics';
import RiskPortfolio from './components/officer/RiskPortfolio';
import LoanRequests from './components/officer/LoanRequests';


import './index.css';

// NEW: Wrapper component to fetch application data for DocumentUploadPortal
const DocumentUploadWrapper = () => {
  const { applicationId } = useParams();
  const [applicationData, setApplicationData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        
        // First try to get from localStorage (for recent applications)
        const recentApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
        const localApp = recentApplications.find(app => app.id === applicationId);
        
        if (localApp) {
          setApplicationData(localApp);
          setLoading(false);
          return;
        }

        // TODO: If not in localStorage, fetch from Supabase
        // const { data, error } = await supabase
        //   .from('preloan_applications')
        //   .select('*')
        //   .eq('id', applicationId)
        //   .single();
        
        // if (error) throw error;
        // setApplicationData(data);

        // For now, create mock data if not found
        setApplicationData({
          id: applicationId,
          loanAmount: 75000,
          loanPurpose: 'business_expansion',
          employmentStatus: 'Self-employed',
          hasEWallet: true,
          ewalletProvider: 'GCash',
          businessType: 'Retail Store',
          status: 'pending_documents'
        });
        
      } catch (err) {
        console.error('Error fetching application data:', err);
        setError('Failed to load application data');
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
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

            {/* Document Upload Route */}
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
            />
            
            {/* Individual Loan Officer Dashboard Pages */}
            <Route 
              path="/officer/analytics" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                      <Analytics 
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
                      <RiskPortfolio 
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
                      <LoanRequests
                        triggerWebhook={(endpoint, data) => console.log('Webhook:', endpoint, data)}
                        sendToAgent={(agent, loanId, data) => console.log('Agent:', agent, loanId, data)}
                      />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;