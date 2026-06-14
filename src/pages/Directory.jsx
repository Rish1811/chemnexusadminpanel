import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, CheckCircle2, Plus, X, Upload, Edit2, Trash2 } from 'lucide-react';

const CATEGORIES = [
  "Acids", "Bases", "Solvents", "Industrial Chemicals",
  "Specialty Chemicals", "Performance Chemicals", "Intermediates",
  "Surfactants", "Polymers", "Additives", "Lubricants",
  "Water Treatment Chemicals", "Food & Pharma Chemicals",
  "Lab Chemicals", "Construction Chemicals", "Others"
];

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+61", flag: "🇦🇺" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+971", flag: "🇦🇪" }
];

const Directory = () => {
  const [directoryData, setDirectoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All Companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    companyName: '', contactPerson: '', designation: '', category: '',
    location: '', estYear: '', gstNumber: '',
    mobileCode: '+91', mobile: '', email: '', website: '',
    address: '', businessHours: '', products: []
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchDirectory = () => {
    fetch(`${API_BASE_URL}/api/directory`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDirectoryData(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load directory:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (product) => {
    setFormData(prev => {
      const isSelected = prev.products.includes(product);
      if (isSelected) {
        return { ...prev, products: prev.products.filter(p => p !== product) };
      } else {
        return { ...prev, products: [...prev.products, product] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'products') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });
    if (logoFile) {
      submitData.append('companyLogo', logoFile);
    }

    try {
      const url = isEditing ? `${API_BASE_URL}/api/admin/directory/${editingId}` : `${API_BASE_URL}/api/admin/directory`;
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: submitData
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
          companyName: '', contactPerson: '', designation: '', category: '',
          location: '', estYear: '', gstNumber: '',
          mobileCode: '+91', mobile: '', email: '', website: '',
          address: '', businessHours: '', products: []
        });
        setLogoFile(null);
        fetchDirectory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (company) => {
    setIsEditing(true);
    setEditingId(company.id);
    setFormData({
      companyName: company.title || '', 
      contactPerson: company.contactPerson || '', 
      designation: company.designation || '', 
      category: company.category || '',
      location: company.location || '', 
      estYear: company.estYear || '', 
      gstNumber: company.gstNumber || '',
      mobileCode: company.mobileCode || '+91', 
      mobile: company.mobile || '', 
      email: company.email || '', 
      website: company.website || '',
      address: company.address || '', 
      businessHours: company.businessHours || '', 
      products: company.chips || []
    });
    setLogoFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this directory entry?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/directory/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchDirectory();
        } else {
          alert("Failed to delete: " + data.message);
        }
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading Directory...</div>;
  }

  const filteredDirectoryData = {};
  if (directoryData) {
    Object.keys(directoryData).forEach(region => {
      const filteredCompanies = directoryData[region].companies.filter(company => {
        const query = searchQuery.toLowerCase();
        const title = company.title || '';
        const location = company.location || '';
        const matchSearch = title.toLowerCase().includes(query) || location.toLowerCase().includes(query);

        if (!matchSearch) return false;

        if (filter === 'All Companies') return true;
        if (filter === 'Recently Added') {
          if (!company.createdAt) return false;
          const createdDate = new Date(company.createdAt);
          const diffTime = Math.abs(new Date() - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          return diffDays <= 7;
        }
        if (filter === 'Has Website') return !!company.website && company.website.trim() !== '';
        if (filter === 'No Website') return !company.website || company.website.trim() === '';

        return true;
      });

      if (filteredCompanies.length > 0) {
        filteredDirectoryData[region] = {
          totalCount: filteredCompanies.length,
          companies: filteredCompanies
        };
      }
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="panel-title">Global Directory</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', outline: 'none' }}
            >
              <option value="All Companies">All Companies</option>
              <option value="Recently Added">Recently Added</option>
              <option value="Has Website">Has Website</option>
              <option value="No Website">No Website</option>
            </select>
            <div className="toggle-group" style={{ backgroundColor: 'var(--bg-card)'}}>
               <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)' }}>
                 <Search size={16} />
                 <input type="text" placeholder="Search companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px', outline: 'none'}} />
               </div>
            </div>
            <button className="btn-primary" onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData({
                companyName: '', contactPerson: '', designation: '', category: '',
                location: '', estYear: '', gstNumber: '',
                mobileCode: '+91', mobile: '', email: '', website: '',
                address: '', businessHours: '', products: []
              });
              setLogoFile(null);
              setShowModal(true);
            }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Create Directory
            </button>
          </div>
        </div>
        
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.keys(filteredDirectoryData).length > 0 ? Object.keys(filteredDirectoryData).map(region => (
            <div key={region}>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {region} ({filteredDirectoryData[region].totalCount} Companies)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {filteredDirectoryData[region].companies.map(company => (
                  <div key={company.id} className="action-card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         {company.logoUrl ? (
                            <img src={company.logoUrl} alt="logo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', backgroundColor: 'white' }} />
                         ) : (
                            <div className="action-icon-wrapper" style={{ backgroundColor: 'var(--accent-blue-transparent)', color: 'var(--accent-blue)', fontSize: '1.2rem', fontWeight: 'bold', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                              {company.logoText}
                            </div>
                         )}
                         <div>
                           <div className="action-title" style={{ display: 'flex', alignItems: 'center', gap: '6px'}}>
                              {company.title}
                              {company.isVerified && <CheckCircle2 size={14} color="var(--success)" />}
                           </div>
                           <div className="action-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px'}}>
                              <MapPin size={12} /> {company.location}
                           </div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', color: 'var(--text-muted)'}}>
                          {company.status}
                        </span>
                        <button onClick={() => handleEdit(company)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', padding: '4px' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(company.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                      {company.tagline}
                    </div>
                    {company.chips && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {company.chips.map((chip, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-main)' }}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No directories found. Create one!</div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{isEditing ? 'Edit Directory Company' : 'Create Directory Company'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }}>
                    <option value="">Select Category</option>
                    <option value="Chemical Distributor">Chemical Distributor</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="OEM">OEM</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Contact Person</label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Designation</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Mumbai, India" style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Est. Year</label>
                  <input type="text" name="estYear" value={formData.estYear} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>GST Number</label>
                  <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="e.g. 27AAAAA0000A1Z5" style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mobile</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select name="mobileCode" value={formData.mobileCode} onChange={handleInputChange} style={{ width: '100px', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }}>
                      {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Website</label>
                  <input type="text" name="website" value={formData.website} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Business Hours</label>
                <input type="text" name="businessHours" value={formData.businessHours} onChange={handleInputChange} placeholder="e.g. Mon - Sat : 9:30 AM - 6:30 PM" style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Products We Deal In</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CATEGORIES.map(cat => (
                    <div 
                      key={cat} 
                      onClick={() => handleProductToggle(cat)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        border: '1px solid',
                        borderColor: formData.products.includes(cat) ? 'var(--accent-yellow)' : 'var(--border-color)',
                        backgroundColor: formData.products.includes(cat) ? 'rgba(255, 179, 0, 0.1)' : 'transparent',
                        color: formData.products.includes(cat) ? 'var(--accent-yellow)' : 'var(--text-muted)',
                        userSelect: 'none'
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Company Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-main)', border: '1px dashed var(--border-color)' }}>
                     <Upload size={16} /> Choose Image
                     <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
                   </label>
                   <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                     {logoFile ? logoFile.name : 'No file chosen'}
                   </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 24px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>{isEditing ? 'Update Directory' : 'Save Directory'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;
