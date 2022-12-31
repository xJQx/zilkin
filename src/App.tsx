import React from 'react';
import { Navbar } from './components';
import { Route, Routes } from 'react-router-dom';
import { ContractsPage, DeployPage, HomePage } from './pages';

function App() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/deploy" element={<DeployPage />} />
      </Routes>
    </div>
  );
}

export default App;
