import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, CheckCircle2, Plus, X, Upload } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    companyName: '', contactPerson: '', designation: '', category: '',
    location: '', estYear: '', phoneCode: '+91', phone: '',
    mobileCode: '+91', mobile: '', email: '', website: '',
    address: '', businessHours: '', products: []
  });
  const [logoFile, setLogoFile] = useState(null);

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
      const res = await fetch(`${API_BASE_URL}/api/admin/directory`, {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({
          companyName: '', contactPerson: '', designation: '', category: '',
          location: '', estYear: '', phoneCode: '+91', phone: '',
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

  if (loading) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Loading Directory...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="panel-title">Global Directory</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="toggle-group" style={{ backgroundColor: 'var(--bg-card)'}}>
               <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)' }}>
                 <Search size={16} />
                 <input type="text" placeholder="Search companies..." style={{ background: 'transparent', border: 'none', color: 'white', padding: '8px', outline: 'none'}} />
               </div>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Create Directory
            </button>
          </div>
        </div>
        
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {directoryData && Object.keys(directoryData).length > 0 ? Object.keys(directoryData).map(region => (
            <div key={region}>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {region} ({directoryData[region].totalCount} Companies)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {directoryData[region].companies.map(company => (
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
                      <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', color: 'var(--text-muted)'}}>
                        {company.status}
                      </span>
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
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Create Directory Company</h3>
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
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Phone</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select name="phoneCode" value={formData.phoneCode} onChange={handleInputChange} style={{ width: '100px', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }}>
                      {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ flex: 1, padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: '#333' }} />
                  </div>
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
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>Save Directory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;
