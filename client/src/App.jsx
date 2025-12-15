import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/departments" element={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Departments Page (Coming Soon)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
