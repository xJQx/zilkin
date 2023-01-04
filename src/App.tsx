import React from 'react';
import { Navbar, Footer } from './components';
import { Route, Routes } from 'react-router-dom';
import { ContractsWizardPage, DeployPage, DocsPage, HomePage } from './pages';

function App() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contracts-wizard" element={<ContractsWizardPage />} />
        <Route path="/deploy" element={<DeployPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
