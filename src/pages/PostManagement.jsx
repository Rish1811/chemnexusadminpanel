import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Check, X, AlertCircle } from 'lucide-react';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [category, setCategory] = useState('Chemical Manufacturer');
  const [formData, setFormData] = useState({
    buyOrSell: 'Buy',
    productName: '',
    casNumber: '',
    quantity: '',
    location: ''
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requirements`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    
    // Reset form data based on category
    if (newCategory === 'Logistics') {
      setFormData({ fromLocation: '', toLocation: '', serviceType: '', materialType: '', quantity: '' });
    } else if (newCategory === 'Lab Chemicals') {
      setFormData({ buyOrSell: 'Buy', itemName: '', grade: '', quantity: '', deliveryLocation: '' });
    } else if (newCategory === 'OEM / EPC') {
      setFormData({ requirementType: 'OEM', equipmentName: '', capacity: '', budget: '', location: '' });
    } else if (newCategory === 'Packaging Material') {
      setFormData({ buyOrSell: 'Buy', productName: '', materialType: '', capacity: '', quantityRequired: '', deliveryLocation: '' });
    } else {
      setFormData({ buyOrSell: 'Buy', productName: '', casNumber: '', quantity: '', location: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    let endpoint = '';
    if (category === 'Logistics') endpoint = '/api/requirements/logistics/post';
    else if (category === 'Lab Chemicals') endpoint = '/api/requirements/lab/post';
    else if (category === 'OEM / EPC') endpoint = '/api/requirements/oem/post';
    else if (category === 'Packaging Material') endpoint = '/api/requirements/packaging/post';
    else endpoint = '/api/requirements/manufacturer/post';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        fetchPosts(); // Refresh list
      } else {
        alert("Error posting requirement: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setSubmitting(false);
    }
  };

  // Render Dynamic Form Fields
  const renderFormFields = () => {
    if (category === 'Logistics') {
      return (
        <>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>From Location</label>
              <input type="text" name="fromLocation" value={formData.fromLocation} onChange={handleInputChange} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>To Location</label>
              <input type="text" name="toLocation" value={formData.toLocation} onChange={handleInputChange} required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Service Type</label>
            <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange} placeholder="e.g. Tanker, ISO Container" required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Material Type</label>
              <input type="text" name="materialType" value={formData.materialType} onChange={handleInputChange} placeholder="e.g. Hazardous Liquid" required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Quantity</label>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} required style={inputStyle} />
            </div>
          </div>
        </>
      );
    } else if (category === 'Lab Chemicals') {
      return (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Buy or Sell?</label>
            <select name="buyOrSell" value={formData.buyOrSell} onChange={handleInputChange} style={inputStyle}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Item Name</label>
            <input type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Grade</label>
              <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} placeholder="e.g. AR, LR" required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Quantity</label>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Location</label>
            <input type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleInputChange} required style={inputStyle} />
          </div>
        </>
      );
    } else if (category === 'OEM / EPC') {
      return (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Requirement Type</label>
            <select name="requirementType" value={formData.requirementType} onChange={handleInputChange} style={inputStyle}>
              <option value="OEM">OEM</option>
              <option value="EPC">EPC</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Equipment/Project Name</label>
            <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleInputChange} required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Capacity/Specs</label>
              <input type="text" name="capacity" value={formData.capacity} onChange={handleInputChange} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Budget</label>
              <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={inputStyle} />
          </div>
        </>
      );
    } else if (category === 'Packaging Material') {
      return (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Buy or Sell?</label>
            <select name="buyOrSell" value={formData.buyOrSell} onChange={handleInputChange} style={inputStyle}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Product Name</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="e.g. IBC Tote, Drums" required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Material Type</label>
              <input type="text" name="materialType" value={formData.materialType} onChange={handleInputChange} placeholder="e.g. HDPE, Steel" required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Capacity</label>
              <input type="text" name="capacity" value={formData.capacity} onChange={handleInputChange} placeholder="e.g. 1000L" required style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Quantity Required</label>
              <input type="text" name="quantityRequired" value={formData.quantityRequired} onChange={handleInputChange} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Location</label>
              <input type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleInputChange} required style={inputStyle} />
            </div>
          </div>
        </>
      );
    } else {
      // Default: Chemical Manufacturer / Distributor
      return (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Buy or Sell?</label>
            <select name="buyOrSell" value={formData.buyOrSell} onChange={handleInputChange} style={inputStyle}>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Product Name</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>CAS Number</label>
              <input type="text" name="casNumber" value={formData.casNumber} onChange={handleInputChange} placeholder="Optional" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Quantity</label>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={inputStyle} />
          </div>
        </>
      );
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-main)', padding: '40px' }}>Loading Posts...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Post Management</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>View all user requirements and post as admin.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Create New Post
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-sidebar)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>POST INFO</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>CATEGORY</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>TYPE</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>LOCATION</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No posts found.</td>
              </tr>
            ) : (
              posts.map((post) => {
                const title = post.productName || post.itemName || post.equipmentName || post.serviceType || 'Unknown';
                const qty = post.quantity || post.capacity || post.quantityRequired || '';
                const location = post.location || post.deliveryLocation || post.fromLocation || '-';
                const type = post.buyOrSell || (post.category === 'Logistics' ? 'Transport' : 'OEM/EPC');
                
                return (
                  <tr key={post._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>{title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>{qty}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{post.category}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        backgroundColor: type.toLowerCase() === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: type.toLowerCase() === 'buy' ? 'var(--success)' : 'var(--accent-blue)'
                      }}>
                        {type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{location}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(post.postedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            width: '500px', 
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>Create New Post</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Select Category</label>
                <select 
                  value={category} 
                  onChange={handleCategoryChange} 
                  style={{ ...inputStyle, border: '2px solid var(--accent-blue)' }}
                >
                  <option value="Chemical Manufacturer">Chemical Manufacturer</option>
                  <option value="Chemical Trader / Distributor">Chemical Trader / Distributor</option>
                  <option value="Lab Chemicals">Lab Chemicals</option>
                  <option value="Logistics">Logistics</option>
                  <option value="OEM / EPC">OEM / EPC</option>
                  <option value="Packaging Material">Packaging Material</option>
                </select>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.5px' }}>Dynamic Fields</h3>
                {renderFormFields()}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-main)',
  fontSize: '14px',
  outline: 'none'
};

export default PostManagement;
