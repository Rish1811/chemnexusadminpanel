import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Search, FileText, MoreVertical, X, Eye, PlusCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [filter, setFilter] = useState('All Users');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subAppId, setSubAppId] = useState(null);
  const [subPlanType, setSubPlanType] = useState('FREE_TRIAL');
  const [subStartDate, setSubStartDate] = useState('');
  const [subEndDate, setSubEndDate] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (applicationId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${applicationId}/approve`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        // Refresh the list after approval
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Error approving user");
    }
  };

  const openRejectModal = (applicationId) => {
    setRejectingAppId(applicationId);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${rejectingAppId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      const data = await res.json();
      if (data.success) {
        setRejectModalOpen(false);
        setRejectingAppId(null);
        if (selectedUser && selectedUser.applicationId === rejectingAppId) {
           setSelectedUser(null);
        }
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to reject user:", err);
      alert("Error rejecting user");
    }
  };

  const handleAddToDirectory = async (user) => {
    try {
      const formData = new FormData();
      formData.append('companyName', user.companyInfo?.companyName || 'Unknown');
      formData.append('contactPerson', user.companyInfo?.contactName || '');
      formData.append('email', user.companyInfo?.email || '');
      formData.append('mobile', user.companyInfo?.mobile || '');
      formData.append('gstNumber', user.companyInfo?.gstNumber || '');
      formData.append('location', user.companyInfo?.location || '');
      formData.append('website', user.companyInfo?.website || '');
      formData.append('category', user.role || 'Unknown');
      
      const products = user.businessDetails?.products || [];
      if (Array.isArray(products) && products.length > 0) {
        formData.append('products', JSON.stringify(products));
      } else if (typeof products === 'string' && products.trim() !== '') {
        formData.append('products', JSON.stringify([products]));
      }

      formData.append('isVerified', user.status === 'APPROVED' ? 'true' : 'false');
      
      const res = await fetch(`${API_BASE_URL}/api/admin/directory`, {
         method: 'POST',
         body: formData
      });
      
      const data = await res.json();
      if (data.success) {
         alert("Successfully added to directory!");
         setDropdownOpen(null);
      } else {
         alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error("Failed to add to directory:", err);
      alert("Error adding to directory");
    }
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    if (!subStartDate || !subEndDate) return alert("Please select both dates");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${subAppId}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: subPlanType, startDate: subStartDate, endDate: subEndDate })
      });
      const data = await res.json();
      if (data.success) {
        alert("Subscription activated successfully");
        setSubModalOpen(false);
        fetchUsers();
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving subscription");
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '40px' }}>Loading...</div>;
  }

  const filteredUsers = users.filter(user => {
    // text search
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      (user.applicationId && user.applicationId.toLowerCase().includes(query)) ||
      (user.companyInfo?.companyName && user.companyInfo.companyName.toLowerCase().includes(query)) ||
      (user.companyInfo?.email && user.companyInfo.email.toLowerCase().includes(query));

    if (!matchSearch) return false;

    // dropdown filter
    if (filter === 'All Users') return true;
    if (filter === 'Approved') return user.status === 'APPROVED';
    if (filter === 'Pending') return user.status === 'UNDER_REVIEW';
    
    // Subscription checks
    const sub = user.subscription || {};
    const type = (sub.planType || 'NONE').toUpperCase();
    const isActive = sub.isActive === true || sub.isActive === 'true';

    if (filter === 'Active Free Trial') {
      return isActive && (type.includes('FREE') || type.includes('TRIAL'));
    }
    if (filter === 'Active Paid Subscription') {
      return isActive && (type.includes('PAID') || type.includes('PREMIUM'));
    }
    if (filter === 'Expired Subscriptions') {
      return !isActive && type !== 'NONE';
    }

    return true;
  });


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--accent-blue)', borderRadius: '12px', backgroundColor: 'var(--accent-blue-transparent)', color: 'var(--accent-blue)' }}>
            <Users size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '4px' }}>User Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Review and approve user registrations.</p>
          </div>
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-color)', outline: 'none' }}
          >
            <option value="All Users">All Users</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Active Free Trial">Active Free Trial</option>
            <option value="Active Paid Subscription">Active Paid Subscription</option>
            <option value="Expired Subscriptions">Expired Subscriptions</option>
          </select>
          
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search applications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Application ID</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Company Info</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Role</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Documents</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Plan</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No registrations found yet.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.applicationId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                    {user.applicationId}
                    {user.submittedOn && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', fontFamily: 'sans-serif' }}>
                        {new Date(user.submittedOn).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{user.companyInfo?.companyName || "N/A"}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.companyInfo?.email || ""}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>
                    {user.role}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {Object.keys(user.documents || {}).map(docKey => (
                        <a 
                          key={docKey} 
                          href={Array.isArray(user.documents[docKey]) ? user.documents[docKey][0] : user.documents[docKey]} 
                          target="_blank" 
                          rel="noreferrer"
                          title={`View ${docKey}`}
                          style={{ color: 'var(--accent-blue)' }}
                        >
                          <FileText size={20} />
                        </a>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {user.status === 'APPROVED' ? (
                      <span className="badge-verified" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        <CheckCircle size={14} /> Approved
                      </span>
                    ) : user.status === 'REJECTED' ? (
                      <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                        <X size={14} /> Rejected
                      </span>
                    ) : (
                      <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-yellow)', border: '1px solid var(--accent-yellow)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                        <Clock size={14} /> Under Review
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {user.subscription && user.subscription.isActive ? (
                      <span style={{ backgroundColor: user.subscription.planType === 'PAID' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)', color: user.subscription.planType === 'PAID' ? 'var(--success)' : 'var(--accent-yellow)', border: `1px solid ${user.subscription.planType === 'PAID' ? 'var(--success)' : 'var(--accent-yellow)'}`, padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content', whiteSpace: 'nowrap' }}>
                        {user.subscription.planType === 'PAID' ? <CheckCircle size={14} /> : <Clock size={14} />} 
                        {user.subscription.planType === 'PAID' ? 'Paid Sub' : 'Free Trial'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                      {user.status === 'UNDER_REVIEW' && (
                        <>
                          <button 
                            onClick={() => openRejectModal(user.applicationId)}
                            style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleApprove(user.applicationId)}
                            className="btn-primary" 
                            style={{ padding: '8px 16px', fontSize: '0.9rem', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            Approve
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === user.applicationId ? null : user.applicationId)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    
                    {dropdownOpen === user.applicationId && (
                      <div style={{ position: 'absolute', right: '40px', top: '50px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden', minWidth: '150px' }}>
                        <button 
                          onClick={() => { setSelectedUser(user); setDropdownOpen(null); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '0.9rem' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Eye size={16} color="var(--accent-blue)" /> View Profile
                        </button>
                        <button 
                          onClick={() => handleAddToDirectory(user)}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '0.9rem' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <PlusCircle size={16} color="var(--success)" /> Add to Directory
                        </button>
                        <button 
                          onClick={() => {
                             setSubAppId(user.applicationId);
                             setSubPlanType('FREE_TRIAL');
                             setDropdownOpen(null);
                             setSubModalOpen(true);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '0.9rem' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Clock size={16} color="var(--accent-yellow)" /> Free Trial
                        </button>
                        <button 
                          onClick={() => {
                             setSubAppId(user.applicationId);
                             setSubPlanType('PAID');
                             setDropdownOpen(null);
                             setSubModalOpen(true);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', width: '100%', textAlign: 'left', fontSize: '0.9rem' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <CheckCircle size={16} color="var(--success)" /> Paid Subscription
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'var(--bg-card)', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-blue-transparent)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedUser.companyInfo?.companyName?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 style={{ color: 'black', margin: 0, fontSize: '1.4rem' }}>{selectedUser.companyInfo?.companyName || "Unknown Company"}</h2>
                  <span style={{ color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 'bold' }}>{selectedUser.role?.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 'none', color: 'black', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Grid 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'black', margin: '0 0 16px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Company Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Registered On:</span> <span style={{ color: 'black', fontWeight: '500', textAlign: 'right' }}>{selectedUser.submittedOn ? new Date(selectedUser.submittedOn).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Email:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.companyInfo?.email || "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Mobile:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.companyInfo?.mobile || "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>GST No:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.companyInfo?.gstNumber || "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>PAN No:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.companyInfo?.panNumber || "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Location:</span> <span style={{ color: 'black', fontWeight: '500', textAlign: 'right' }}>{selectedUser.companyInfo?.location || "N/A"}</span></div>
                  </div>
                </div>
                
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'black', margin: '0 0 16px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Business Details</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Turnover:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.businessDetails?.turnover || "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Employees:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.businessDetails?.employees || "N/A"}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#555' }}>Certifications:</span> <span style={{ color: 'black', fontWeight: '500' }}>{selectedUser.businessDetails?.certifications || "N/A"}</span></div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 style={{ color: 'black', marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Uploaded Documents</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {Object.keys(selectedUser.documents || {}).map(docKey => {
                    const docValue = selectedUser.documents[docKey];
                    const isArray = Array.isArray(docValue);
                    const docsToRender = isArray ? docValue : [docValue];
                    
                    return docsToRender.map((docUrl, idx) => (
                      <a key={`${docKey}-${idx}`} href={docUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none' }}>
                        <div style={{ padding: '10px', backgroundColor: 'var(--accent-blue-transparent)', borderRadius: '8px' }}>
                          <FileText size={20} color="var(--accent-blue)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: 'black', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{docKey.replace(/([A-Z])/g, ' $1').trim()} {isArray ? `#${idx + 1}` : ''}</span>
                          <span style={{ color: 'var(--accent-blue)', fontSize: '0.75rem' }}>Click to View</span>
                        </div>
                      </a>
                    ));
                  })}
                </div>
              </div>
              
              {/* Approval Section */}
              {selectedUser.status === 'UNDER_REVIEW' && (
                <div style={{ marginTop: '16px', padding: '24px', backgroundColor: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: 'black', margin: '0 0 6px 0', fontSize: '1.2rem' }}>Approve this application?</h3>
                    <p style={{ color: '#555', margin: 0, fontSize: '0.9rem' }}>This will notify the user and grant them access to the platform.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => openRejectModal(selectedUser.applicationId)}
                      style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 'bold', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Reject User
                    </button>
                    <button 
                      onClick={() => { handleApprove(selectedUser.applicationId); setSelectedUser(null); }}
                      className="btn-primary" 
                      style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 'bold' }}
                    >
                      Approve User
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={20} color="#ef4444" /> Reject Application
              </h3>
              <button onClick={() => setRejectModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold' }}>Reason for Rejection</label>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason to notify the user..."
                style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                autoFocus
              />
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setRejectModalOpen(false)}
                style={{ padding: '10px 16px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmReject}
                style={{ padding: '10px 16px', backgroundColor: '#ef4444', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Confirm Reject
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {subModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)' }}>{subPlanType === 'FREE_TRIAL' ? 'Activate Free Trial' : 'Activate Paid Subscription'}</h3>
              <button onClick={() => setSubModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubscriptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start Date</label>
                <input 
                  type="date" 
                  value={subStartDate} 
                  onChange={(e) => setSubStartDate(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'black' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>End Date</label>
                <input 
                  type="date" 
                  value={subEndDate} 
                  onChange={(e) => setSubEndDate(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'black' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setSubModalOpen(false)} style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>Activate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
