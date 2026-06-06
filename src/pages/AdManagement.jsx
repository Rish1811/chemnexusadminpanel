import React, { useState, useEffect } from 'react';
import { Target, UploadCloud, AlertCircle, Trash2, Power } from 'lucide-react';

const AdManagement = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [adTimer, setAdTimer] = useState(5);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('https://mellifluous-dragon-3e1091.netlify.app/api/admin/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (err) { 
      console.error(err);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  const toggleBannerStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`https://mellifluous-dragon-3e1091.netlify.app/api/admin/banners/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`https://mellifluous-dragon-3e1091.netlify.app/api/admin/banners/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please select an image first.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('bannerImage', file);
    formData.append('linkUrl', linkUrl);
    formData.append('adTimer', adTimer);

    try {
      const response = await fetch('https://mellifluous-dragon-3e1091.netlify.app/api/banners/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Banner uploaded successfully!' });
        setFile(null);
        setPreview(null);
        setLinkUrl('');
        setAdTimer(5);
        fetchBanners(); // Refresh the list
      } else {
        setStatus({ type: 'error', message: data.message || 'Upload failed.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Network error occurred during upload.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--accent-blue)', borderRadius: '12px', backgroundColor: 'var(--accent-blue-transparent)', color: 'var(--accent-blue)' }}>
            <Target size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '4px' }}>Ad Management</h2>
            <p style={{ color: 'var(--text-muted)' }}>Upload and manage promotional banners for the mobile app.</p>
          </div>
        </div>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '40px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            
            {preview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <img src={preview} alt="Banner Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>Click to change image</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <UploadCloud size={48} color="var(--text-muted)" />
                <div style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Drag & Drop or Click to Upload</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Image must be exactly <strong style={{ color: 'var(--accent-yellow)'}}>500x100 pixels</strong>. (JPG, PNG)
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Target URL (Optional)</label>
            <input 
              type="url" 
              placeholder="https://example.com/promo" 
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>Ad Display Timer (Seconds)</label>
            <input 
              type="number" 
              min="1"
              max="60"
              value={adTimer}
              onChange={(e) => setAdTimer(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'white', outline: 'none' }}
            />
          </div>

          {status.message && (
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              border: `1px solid ${status.type === 'error' ? 'var(--danger)' : 'var(--success)'}`,
              color: status.type === 'error' ? 'var(--danger)' : 'var(--success)'
            }}>
              <AlertCircle size={20} />
              {status.message}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isUploading || !file}
              style={{ opacity: (isUploading || !file) ? 0.5 : 1, padding: '12px 32px', fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              {isUploading ? 'Uploading...' : 'Upload Banner'}
              {!isUploading && <UploadCloud size={18} />}
            </button>
          </div>
        </form>
      </div>

      {/* Banner List Section */}
      <div className="panel" style={{ padding: '40px' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '24px' }}>Manage Existing Banners</h3>
        
        {isLoadingBanners ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading banners...</div>
        ) : banners.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            No banners uploaded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {banners.map((banner) => (
              <div key={banner._id} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <img src={banner.imageUrl} alt="Banner" style={{ width: '200px', height: 'auto', borderRadius: '8px', border: '1px solid var(--border-light)', opacity: banner.isActive ? 1 : 0.4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{banner.linkUrl !== '#' ? banner.linkUrl : 'No Link Provided'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Timer: {banner.adTimer ?? 5}s | Uploaded: {new Date(banner.createdAt).toLocaleDateString()}</div>
                  <div style={{ marginTop: '8px', display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: banner.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: banner.isActive ? 'var(--success)' : 'var(--danger)' }}>
                    {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                    className="icon-btn" 
                    title={banner.isActive ? "Deactivate" : "Activate"}
                    style={{ backgroundColor: banner.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: banner.isActive ? 'var(--danger)' : 'var(--success)' }}
                  >
                    <Power size={18} />
                  </button>
                  <button 
                    onClick={() => deleteBanner(banner._id)}
                    className="icon-btn" 
                    title="Delete"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdManagement;
