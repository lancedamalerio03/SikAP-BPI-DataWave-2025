import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { SikAPLanding } from './components/SikAPLanding';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PreLoanApplication from './components/PreLoanApplication';
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
            
            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/application" 
              element={
                <ProtectedRoute>
                  <PreLoanApplication />
                </ProtectedRoute>
              } 
            />
            
            {/* Future Routes - Commented for now */}
            {/* 
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
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