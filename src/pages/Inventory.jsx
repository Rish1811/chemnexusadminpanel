import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Package, ShieldCheck, MapPin } from 'lucide-react';

const Inventory = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leads`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeads(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load leads:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading Inventory...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Active Chemical Requirements</h3>
          <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>+ New Requirement</button>
        </div>
        
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {leads.map(lead => (
            <div key={lead.id} className="action-card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--border-light)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ 
                    backgroundColor: lead.badge.bgColor, 
                    color: lead.badge.textColor, 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    padding: '4px 10px', 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {lead.isVerified && <ShieldCheck size={12} />}
                    {lead.badge.text}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted {new Date(lead.postedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '12px' }}>{lead.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '80%' }}>
                {lead.description}
              </p>

              <div style={{ display: 'flex', gap: '48px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', width: '100%' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Company</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500' }}>{lead.companyName} ({lead.companyRole})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Destination</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--accent-blue)" /> {lead.location}
                  </div>
                </div>
              </div>

            </div>
          ))}
          {leads.length === 0 && <div style={{ color: 'var(--text-muted)'}}>No active leads found.</div>}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
