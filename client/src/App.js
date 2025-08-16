import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { SikAPLanding } from './components/SikAPLanding';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import LoanApplication from './components/LoanApplication';
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
                  <LoanApplication />
                </ProtectedRoute>
              } 
            />
            
            {/* You can add more protected routes here */}
            {/* 
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
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