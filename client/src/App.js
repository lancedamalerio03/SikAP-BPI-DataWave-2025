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

// Dashboard imports
import DashboardLayout from './components/DashboardLayout';
import HomePage from './components/dashboard/HomePage';
import PortfolioPage from './components/dashboard/PortfolioPage';
import LoansPage from './components/dashboard/LoansPage';
import AgentsPage from './components/dashboard/AgentsPage';
import ChatbotPage from './components/dashboard/ChatbotPage';
import ProfilePage from './components/dashboard/ProfilePage';

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
            
            {/* Dashboard Routes - Protected with nested routing */}
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