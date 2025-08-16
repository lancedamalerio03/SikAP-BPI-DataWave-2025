import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SikAPLanding } from './components/SikAPLanding';
import SignIn from './components/SignIn';
import LoanApplication from './components/LoanApplication';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SikAPLanding />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/application" element={<LoanApplication />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;