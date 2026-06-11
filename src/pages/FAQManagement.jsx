import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { API_BASE_URL } from '../config';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '', order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/faqs`);
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ question: faq.question, answer: faq.answer, order: faq.order || 0 });
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '', order: faqs.length });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingFaq ? 'PUT' : 'POST';
      const url = editingFaq 
        ? `${API_BASE_URL}/api/admin/faqs/${editingFaq._id}` 
        : `${API_BASE_URL}/api/admin/faqs`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        fetchFaqs();
        closeModal();
      } else {
        alert(data.message || "Failed to save FAQ");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/faqs/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(faqs.filter(f => f._id !== id));
      } else {
        alert(data.message || "Failed to delete FAQ");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting FAQ");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 20px 40px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'white', letterSpacing: '1px', marginBottom: '8px' }}>
            Help & FAQs
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Manage the frequently asked questions that appear in the mobile app.
          </p>
        </div>
        <button 
          onClick={() => openModal()} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-yellow)', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <Plus size={18} /> Add New FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div style={{ 
        width: '100%', 
        border: '1px solid var(--border-light)', 
        borderRadius: '12px', 
        backgroundColor: '#0A192F', 
        padding: '0', 
        overflow: 'hidden' 
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>No FAQs found. Click 'Add New FAQ' to create one.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, index) => (
              <div key={faq._id} style={{ 
                padding: '24px', 
                borderBottom: index < faqs.length - 1 ? '1px solid var(--border-color)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '4px', color: 'var(--accent-yellow)' }}>
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '8px', fontWeight: 'bold' }}>
                        {faq.question}
                      </h3>
                      <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => openModal(faq)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(faq._id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '6px', padding: '8px', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <div style={{ 
            backgroundColor: '#0A192F', width: '100%', maxWidth: '600px', 
            borderRadius: '12px', border: '1px solid var(--border-light)', 
            overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--accent-yellow)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Question
                </label>
                <input 
                  required
                  value={formData.question}
                  onChange={e => setFormData({...formData, question: e.target.value})}
                  placeholder="e.g., How do I verify my account?"
                  style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--accent-yellow)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Answer
                </label>
                <textarea 
                  required
                  value={formData.answer}
                  onChange={e => setFormData({...formData, answer: e.target.value})}
                  placeholder="Provide the detailed answer here..."
                  style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontSize: '1rem', minHeight: '120px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--accent-yellow)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Sort Order
                </label>
                <input 
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                <button 
                  type="button"
                  onClick={closeModal}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-yellow)', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FAQManagement;
