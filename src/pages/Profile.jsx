import React, { useState } from 'react';
import { User, Shield, Mail, Lock, Eye, EyeOff, Key } from 'lucide-react';

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Admin dummy data based on requirements
  const adminData = {
    name: "Super Admin",
    id: "ADM-99842",
    email: "admin@chemnexus.com",
    password: "admin123",
    role: "System Administrator",
    avatarInitial: "A"
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">Admin Profile</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.9rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
          <Shield size={16} />
          Verified Administrator
        </div>
      </div>

      <div className="panel" style={{ backgroundColor: '#0A192F', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--accent-blue-transparent)', 
          color: 'var(--accent-blue)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
        }}>
          {adminData.avatarInitial}
        </div>
        
        <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '8px' }}>
          {adminData.name}
        </h2>
        <div style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '32px' }}>
          {adminData.role}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {/* Admin ID */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--accent-yellow)' }}>
              <User size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '4px' }}>Admin ID</div>
              <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: '500', fontFamily: 'monospace' }}>{adminData.id}</div>
            </div>
          </div>

          {/* Email / Login ID */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--accent-blue)' }}>
              <Mail size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '4px' }}>Login Email</div>
              <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: '500' }}>{adminData.email}</div>
            </div>
          </div>

          {/* Password */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'var(--danger)' }}>
              <Key size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '4px' }}>Admin Password</div>
              <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: '500', fontFamily: 'monospace', letterSpacing: showPassword ? 'normal' : '2px' }}>
                {showPassword ? adminData.password : '••••••••'}
              </div>
            </div>
            <button 
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-blue)', padding: '16px', borderRadius: '12px', color: 'var(--accent-blue)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Lock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          <strong>Security Notice:</strong> These credentials provide full administrative access to the ChemNexus platform. Please keep them strictly confidential. Do not share this screen with unauthorized personnel.
        </p>
      </div>
    </div>
  );
};

export default Profile;
