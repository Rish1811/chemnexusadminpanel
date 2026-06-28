import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, BookOpen, Package, User, HelpCircle, 
  Settings, Bell, Users, FileText, Shield, Megaphone, Target, LogOut, Image as ImageIcon
} from 'lucide-react';
import '../index.css';
import logo from '../assets/logo.png';

const Layout = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    if (onLogout) onLogout();
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', gap: '12px' }}>
          <img src={logo} alt="ChemNexus Logo" style={{ height: '64px', width: 'auto' }} />
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Home size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/directory" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <BookOpen size={20} />
            Directory
          </NavLink>
          <NavLink to="/admin/inventory" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Package size={20} />
            Interested
          </NavLink>
          <NavLink to="/admin/profile" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <User size={20} />
            Profile
          </NavLink>

          <div style={{ margin: '16px 0', borderTop: '1px solid #272c39' }}></div>

          <NavLink to="/admin/ad-management" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Target size={20} />
            Banners & Ads
          </NavLink>
          <NavLink to="/admin/website-banners" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <ImageIcon size={20} />
            Website Banners
          </NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Users size={20} />
            User Mgmt
          </NavLink>
          <NavLink to="/admin/posts" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <FileText size={20} />
            Post Mgmt
          </NavLink>
          
          <NavLink to="/admin/settings" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Settings size={20} />
            Settings
          </NavLink>
          
          <div style={{ padding: '16px 4px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>
            Policies & Support
          </div>
          <NavLink to="/admin/support/terms" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <FileText size={20} />
            Terms & Conditions
          </NavLink>
          <NavLink to="/admin/support/privacy" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Shield size={20} />
            Privacy Policy
          </NavLink>
          <NavLink to="/admin/support/advertisement" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <Megaphone size={20} />
            Ad Policy
          </NavLink>
          <NavLink to="/admin/faqs" className={({isActive}) => isActive ? "nav-item active-blue" : "nav-item"}>
            <HelpCircle size={20} />
            Help & FAQs
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <main className="main-wrapper">
        {/* Persistent Header */}
        <header className="top-header">
          <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-brand">CHEMNEXUS</div>
            <div className="header-divider"></div>
            <div className="header-subtitle">ADMIN DASHBOARD</div>
          </div>
          
          <div className="header-actions">

            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', cursor: 'pointer', fontWeight: '500' }}>
              <LogOut size={16} /> Logout
            </button>
            <div className="user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)', color: 'var(--accent-blue)', border: '1px solid var(--border)' }}>
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
