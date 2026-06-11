import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const Inventory = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/requirements`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter interested posts
          const interested = data.data.filter(req => req.interestedUsers && req.interestedUsers.length > 0);
          setLeads(interested);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load leads:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading Interested Posts...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Interested Posts</h3>
        </div>
        
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {leads.map(lead => {
            const title = lead.productName || lead.itemName || lead.equipmentName || lead.serviceType || 'Unknown';
            const qty = lead.quantity || lead.capacity || lead.quantityRequired || '';
            const location = lead.location || lead.deliveryLocation || lead.fromLocation || '-';
            const type = lead.buyOrSell || (lead.category === 'Logistics' ? 'Transport' : 'OEM/EPC');
            const interestedCount = lead.interestedUsers?.length || 0;

            return (
              <div key={lead._id} className="action-card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--border-light)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ 
                      backgroundColor: type.toLowerCase() === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                      color: type.toLowerCase() === 'buy' ? 'var(--success)' : 'var(--accent-blue)', 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold', 
                      padding: '4px 10px', 
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted {new Date(lead.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                    {interestedCount} Interested User(s)
                  </div>
                </div>

                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '12px' }}>{title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '80%' }}>
                  <strong>Category:</strong> {lead.category} <br/>
                  <strong>Requirement:</strong> {qty}
                </p>

                <div style={{ display: 'flex', gap: '48px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', width: '100%' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Destination / Location</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--accent-blue)" /> {location}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
          {leads.length === 0 && <div style={{ color: 'var(--text-muted)'}}>No interested posts found.</div>}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
