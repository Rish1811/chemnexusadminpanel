import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Lock, Megaphone, Edit3, Save, Plus, Trash2 } from 'lucide-react';

const PolicyView = () => {
  const { type } = useParams(); // terms, privacy, or advertisement
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, [type]);

  const fetchPolicy = () => {
    setLoading(true);
    setIsEditing(false);
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
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/policies/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy)
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        // Updated policy from backend
        setPolicy(data.data);
      } else {
        alert("Failed to save policy: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving policy");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setPolicy(prev => ({ ...prev, [field]: value }));
  };

  const updatePoint = (index, field, value) => {
    const newPoints = [...policy.points];
    newPoints[index][field] = value;
    setPolicy(prev => ({ ...prev, points: newPoints }));
  };

  const addPoint = () => {
    setPolicy(prev => ({
      ...prev,
      points: [...prev.points, { id: (prev.points.length + 1).toString(), title: '', text: '' }]
    }));
  };

  const removePoint = (index) => {
    const newPoints = [...policy.points];
    newPoints.splice(index, 1);
    // Re-assign IDs
    newPoints.forEach((p, i) => p.id = (i + 1).toString());
    setPolicy(prev => ({ ...prev, points: newPoints }));
  };

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
      
      {/* Top action bar */}
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => fetchPolicy()} 
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-yellow)', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--accent-yellow)', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-yellow)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <Edit3 size={16} /> Edit Policy
          </button>
        )}
      </div>

      <div style={{ 
        width: '100%', 
        maxWidth: '900px', 
        border: isEditing ? '1px solid var(--accent-yellow)' : '1px solid var(--border-light)', 
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
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <>
                  <input 
                    value={policy.title || ''} 
                    onChange={e => updateField('title', e.target.value)}
                    style={{ width: '100%', fontSize: '1.8rem', color: 'white', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', marginBottom: '8px' }}
                  />
                  <textarea 
                    value={policy.subtitle || ''} 
                    onChange={e => updateField('subtitle', e.target.value)}
                    style={{ width: '100%', color: '#cbd5e1', fontSize: '0.95rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', minHeight: '60px' }}
                  />
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: '1.8rem', color: 'white', letterSpacing: '1px', marginBottom: '8px' }}>{policy.title}</h1>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{policy.subtitle}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Points */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {policy.points && policy.points.map((point, index) => (
            <div key={index} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
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
                fontWeight: 'bold',
                marginTop: isEditing ? '8px' : '0'
              }}>
                {point.id}
              </div>
              <div style={{ color: 'white', fontSize: '0.9rem', lineHeight: '1.5', flex: 1 }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      placeholder="Point Title (Optional)"
                      value={point.title || ''} 
                      onChange={e => updatePoint(index, 'title', e.target.value)}
                      style={{ width: '100%', color: 'var(--accent-yellow)', fontWeight: 'bold', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px' }}
                    />
                    <textarea 
                      placeholder="Point Description"
                      value={point.text || ''} 
                      onChange={e => updatePoint(index, 'text', e.target.value)}
                      style={{ width: '100%', color: 'white', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', minHeight: '80px' }}
                    />
                  </div>
                ) : (
                  <>
                    {point.title && <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{point.title}</span>}
                    {point.text}
                  </>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => removePoint(index)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '8px' }}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <button 
              onClick={addPoint}
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px dashed var(--accent-yellow)', backgroundColor: 'transparent', color: 'var(--accent-yellow)', cursor: 'pointer', marginTop: '10px' }}
            >
              <Plus size={16} /> Add New Point
            </button>
          )}
        </div>

        {/* Footer / Agree Button */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Shield size={16} color="var(--accent-yellow)" />
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
              By using ChemNexus, you acknowledge that you have read, understood,<br/>and agree to this policy.
            </p>
          </div>
          <div style={{ marginLeft: '16px' }}>
            {isEditing ? (
              <input 
                value={policy.buttonText || ''} 
                onChange={e => updateField('buttonText', e.target.value)}
                style={{ padding: '10px', fontWeight: 'bold', fontSize: '1rem', color: 'black', backgroundColor: 'var(--accent-yellow)', border: 'none', borderRadius: '8px', width: '200px', textAlign: 'center' }}
              />
            ) : (
              <button className="btn-primary" style={{ padding: '10px 32px', fontWeight: 'bold', fontSize: '1rem', color: 'black' }}>
                {policy.buttonText}
              </button>
            )}
          </div>
        </div>
        
      </div>
      
      {/* Page Footer Badges */}
      {!isEditing && (
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
      )}
      
    </div>
  );
};

export default PolicyView;
