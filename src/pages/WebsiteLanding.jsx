import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Smartphone, CheckCircle, ChevronRight, Lock, Activity, FileText } from 'lucide-react';
import './WebsiteLanding.css';
import logo from '../assets/chemnexus-logo.png';

const WebsiteLanding = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banners and simple scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000); // 5 seconds default
    return () => clearInterval(interval);
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/banners?type=WEBSITE`);
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-navbar">
        <Link to="/website" className="landing-logo">
          <img src={logo} alt="ChemNexus" />
          <span>ChemNexus</span>
        </Link>
        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
        <Link to="/login" className="join-btn">
          Download App
        </Link>
      </nav>

      {/* Hero Section */}
      <section id="home" className="landing-section hero-section">
        <div className="hero-glow"></div>
        <div className="hero-split-container">
          <div className="hero-left-content">
            <span className="global-beta-tag">Global Beta Access</span>
            <h1 className="hero-title">
              Invite-Only <span className="text-orange">Global</span> <br />
              <span className="text-orange">Chemical</span> Network
            </h1>
            <p className="hero-subtitle">
              A private ecosystem for verified chemical businesses to connect, collaborate and trade directly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', marginTop: '2rem' }}>
              <button className="join-btn" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                Request Access <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
              </button>
              <button className="outline-btn" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hero-right-slider">
            {banners.length > 0 ? (
              <div className="banner-carousel">
                {banners.map((banner, index) => (
                  <div 
                    key={banner._id} 
                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${banner.imageUrl})` }}
                  ></div>
                ))}
                {banners.length > 1 && (
                  <div className="carousel-dots">
                    {banners.map((_, index) => (
                      <span 
                        key={index} 
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="banner-carousel placeholder-carousel">
                <div className="carousel-slide active" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* No Noise Section */}
      <section id="about" className="landing-section">
        <div className="split-section" style={{ marginBottom: '4rem' }}>
          <div>
            <span className="section-tag">No Noise. Just Business.</span>
            <h2 className="section-title">High-Trust Environment</h2>
            <p>
              ChemNexus filters out the marketplace static. We bring together manufacturers, distributors, 
              and logistics partners in an elite environment designed exclusively for serious enterprise.
            </p>
          </div>
          <div className="grid-2">
            <div className="feature-card">
              <div className="feature-icon gold">
                <Zap size={24} />
              </div>
              <h3>Manufacturers</h3>
              <p>Direct access to verified advanced producers and trade workflows.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3>Distributors</h3>
              <p>Streamlined procurement with automated trade workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Nexus Advantage */}
      <section className="landing-section">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-tag">The Nexus Advantage</span>
          <h2 className="section-title">Elite Infrastructure</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Built for the world's most critical supply chain.
          </p>
        </div>

        <div className="grid-3">
          <div className="feature-card">
            <Shield className="feature-icon" size={24} />
            <h3>Verified Companies Only</h3>
            <p>Every member undergoes a multi-layer KYC and operational audit before entry.</p>
          </div>
          <div className="feature-card">
            <Activity className="feature-icon gold" size={24} />
            <h3>Structured Communication</h3>
            <p>Proprietary tools ensure that materials for trade conversations stay measurable.</p>
          </div>
          <div className="feature-card">
            <Zap className="feature-icon" size={24} />
            <h3>Faster Deal Closures</h3>
            <p>Smart assistants analyze workflow assessments, reducing closing time up to 60%.</p>
          </div>
          <div className="feature-card">
            <Globe className="feature-icon gold" size={24} />
            <h3>Global Access</h3>
            <p>One network spanning 120+ countries, with localized regulatory support built in.</p>
          </div>
          <div className="feature-card">
            <Lock className="feature-icon" size={24} />
            <h3>Integrated Ecosystem</h3>
            <p>From procurement to final delivery, every shipment is staged within a single secure portal.</p>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="landing-section">
        <div className="split-section">
          <div>
            <span className="section-title" style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '1rem', display: 'block' }}>Trade on the Move</span>
            <p style={{ fontSize: '1.1rem' }}>
              Access the complete Nexus terminal from your smartphone. Real-time price alerts, instant trade approvals, and secure document signing — anywhere at your fingertips.
            </p>
            <ul className="check-list">
              <li><CheckCircle className="check-icon" size={20} /> End-to-end encrypted messaging</li>
              <li><CheckCircle className="check-icon" size={20} /> Instant push notifications for deal updates</li>
              <li><CheckCircle className="check-icon" size={20} /> Live commodity price tracking</li>
              <li><CheckCircle className="check-icon" size={20} /> Secure in-app document signing</li>
            </ul>
          </div>
          <div className="phones-container">
            <div className="phone-mockup left">
              <img src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="App Screen 1" />
            </div>
            <div className="phone-mockup right">
              <img src="https://images.unsplash.com/photo-1601972599720-36938d4ecd31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="App Screen 2" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="landing-section" style={{ textAlign: 'center', paddingBottom: '6rem' }}>
        <div className="feature-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)' }}>
          <h2 className="section-title">Built for Serious Trade.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            ChemNexus isn't just another marketplace. It's a high-trust private terminal for the global chemical economy. No paid banners, no spam — just direct business with verified peers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="join-btn">Apply Now</button>
            <button className="outline-btn">Contact Sales</button>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            Applications are reviewed within 48 hours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/website" className="landing-logo">
              <img src={logo} alt="ChemNexus" />
              <span>ChemNexus</span>
            </Link>
            <p>The global standard for chemical trading and industrial commerce.</p>
          </div>
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
              <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Manufacturers</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Distributors</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Logistics</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a></li>
                <li><a href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Admin Portal</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 ChemNexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLanding;
