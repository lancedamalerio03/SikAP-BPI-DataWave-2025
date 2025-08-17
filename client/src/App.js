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
            
            {/* Dashboard Route - Temporary placeholder */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-slate-900 mb-4">Dashboard Coming Soon</h1>
                      <p className="text-slate-600">We're building an amazing dashboard for you!</p>
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
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
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