import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import PolicyView from './pages/PolicyView';
import AdManagement from './pages/AdManagement';
import UserManagement from './pages/UserManagement';
import PostManagement from './pages/PostManagement';
import Login from './pages/Login';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={setIsAuthenticated} />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="directory" element={<Directory />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ad-management" element={<AdManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="posts" element={<PostManagement />} />
          <Route path="support/:type" element={<PolicyView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
