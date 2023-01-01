import React from 'react';
import { Navbar, Footer } from './components';
import { Route, Routes } from 'react-router-dom';
import { ContractsWizardPage, DeployPage, HomePage } from './pages';

function App() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contracts-wizard" element={<ContractsWizardPage />} />
        <Route path="/deploy" element={<DeployPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
