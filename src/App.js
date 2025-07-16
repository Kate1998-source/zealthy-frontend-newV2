// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingWizard from './components/OnboardingWizard/OnboardingWizard';
import AdminDashboard from './components/AdminDashboard';
import DataTable from './components/DataTable';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;