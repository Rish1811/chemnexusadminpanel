import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Lock, Megaphone } from 'lucide-react';

const PolicyView = () => {
  const { type } = useParams(); // terms, privacy, or advertisement
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/policies/${type}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPolicy(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load policy:", err);
        setLoading(false);
      });
  }, [type]);

  if (loading) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading Policy...</div>;
  }

  if (!policy) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Policy not found.</div>;

  const renderIcon = () => {
    if (policy.icon === 'lock-shield') return <Lock size={32} color="var(--accent-yellow)" />;
    if (policy.icon === 'megaphone') return <Megaphone size={32} color="var(--accent-yellow)" />;
    return <Shield size={32} color="var(--accent-yellow)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 40px 20px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '900px', 
        border: '1px solid var(--border-light)', 
        borderRadius: '12px', 
        backgroundColor: '#0A192F', 
        padding: '0', 
        overflow: 'hidden' 
      }}>
        
        {/* Header */}
        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ padding: '12px', border: '1px solid var(--accent-yellow)', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
              {renderIcon()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'white', letterSpacing: '1px', marginBottom: '8px' }}>{policy.title}</h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{policy.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content Points */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {policy.points.map((point) => (
            <div key={point.id} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                minWidth: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                border: '1px solid var(--accent-yellow)', 
                color: 'var(--accent-yellow)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {point.id}
              </div>
              <div style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {point.title && <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{point.title}</span>}
                {point.text}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Agree Button */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Shield size={16} color="var(--accent-yellow)" />
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              By using ChemNexus, you acknowledge that you have read, understood,<br/>and agree to this {policy.title.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}.
            </p>
          </div>
          <button className="btn-primary" style={{ padding: '10px 32px', fontWeight: 'bold', fontSize: '1rem', color: 'black' }}>
            {policy.buttonText}
          </button>
        </div>
        
      </div>
      
      {/* Page Footer Badges */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px', padding: '20px', borderTop: '1px solid var(--border-color)', width: '100%', maxWidth: '900px', justifyContent: 'space-between' }}>
        {[
          { icon: <Shield size={20} color="var(--accent-yellow)" />, title: "Secure & Trusted", desc: "Your data is protected" },
          { icon: <Lock size={20} color="var(--accent-yellow)" />, title: "Verified Network", desc: "Only verified companies" },
          { icon: <Megaphone size={20} color="var(--accent-yellow)" />, title: "Quality Over Quantity", desc: "We maintain network quality" }
        ].map((badge, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ border: '1px solid var(--accent-yellow)', padding: '8px', borderRadius: '8px' }}>
              {badge.icon}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>{badge.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{badge.desc}</div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default PolicyView;
