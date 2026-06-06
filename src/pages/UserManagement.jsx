import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Search, FileText, MoreVertical, X, Eye } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://mellifluous-dragon-3e1091.netlify.app/api/admin/users');
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
      const res = await fetch(`https://mellifluous-dragon-3e1091.netlify.app/api/admin/users/${applicationId}/approve`, {
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

  const handleReject = async (applicationId) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    try {
      const res = await fetch(`https://mellifluous-dragon-3e1091.netlify.app/api/admin/users/${applicationId}/reject`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to reject user:", err);
      alert("Error rejecting user");
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '40px' }}>Loading...</div>;
  }

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
        
        {/* Search */}
        <div className="search-bar" style={{ width: '300px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input type="text" placeholder="Search applications..." style={{ backgroundColor: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
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
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No registrations found yet.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.applicationId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                    {user.applicationId}
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
                  <td style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                    {user.status === 'UNDER_REVIEW' && (
                      <>
                        <button 
                          onClick={() => handleReject(user.applicationId)}
                          style={{ padding: '8px 16px', fontSize: '0.9rem', marginRight: '8px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(user.applicationId)}
                          className="btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '0.9rem', marginRight: '12px' }}
                        >
                          Approve
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setDropdownOpen(dropdownOpen === user.applicationId ? null : user.applicationId)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <MoreVertical size={20} />
                    </button>
                    
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
                      onClick={() => { handleReject(selectedUser.applicationId); setSelectedUser(null); }}
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

    </div>
  );
};

export default UserManagement;
