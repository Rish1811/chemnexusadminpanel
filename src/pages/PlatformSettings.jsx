import React, { useState, useEffect } from 'react';
import { Settings, Save, Mail, Phone, Loader } from 'lucide-react';
import { API_BASE_URL } from '../config';

const PlatformSettings = () => {
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/support`);
      const data = await res.json();
      if (data.success && data.data) {
        setSupportEmail(data.data.email || '');
        setSupportPhone(data.data.phone || '');
      }
    } catch (err) {
      console.error("Failed to fetch support settings", err);
      setMessage({ text: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: supportEmail, phone: supportPhone })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Failed to save settings', type: 'error' });
      }
    } catch (err) {
      console.error("Failed to save support settings", err);
      setMessage({ text: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '40px' }}><Loader className="animate-spin" /> Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--accent-yellow)', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-yellow)' }}>
            <Settings size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '4px' }}>Platform Settings</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage global platform configurations and support details.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="panel" style={{ maxWidth: '600px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Support Contact Information</h3>
        
        {message.text && (
          <div style={{ 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? '#4ade80' : '#ef4444',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Support Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px' }}>
              <Mail size={18} color="var(--text-muted)" />
              <input 
                type="email" 
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@chemnexus.com"
                required
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Support Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px' }}>
              <Phone size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+1 800 123 4567"
                required
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Include country code (e.g., +91)</span>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary" 
            style={{ 
              marginTop: '10px', 
              padding: '12px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '1rem'
            }}
          >
            {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default PlatformSettings;
