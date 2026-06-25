import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Smartphone, CheckCircle, ChevronRight, Lock, Activity, Users, Target, Rocket, Eye } from 'lucide-react';
import './WebsiteLanding.css';
import logo from '../assets/chemnexus-logo.png';
import slider1 from '../assets/slider1.png';
import slider2 from '../assets/slider2.png';
import slider3 from '../assets/slider3.png';

const WebsiteLanding = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use local chemical industry images for the hero slider
  useEffect(() => {
    window.scrollTo(0, 0);
    setBanners([
      { _id: '1', imageUrl: slider1 },
      { _id: '2', imageUrl: slider2 },
      { _id: '3', imageUrl: slider3 }
    ]);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000); // 5 seconds default
    return () => clearInterval(interval);
  }, [banners]);

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
          <a href="#network">Network</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background-slider">
          <div className="slider-overlay"></div>
          {banners.length > 0 ? (
            <div className="banner-carousel">
              {banners.map((banner, index) => (
                <div 
                  key={banner._id} 
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                ></div>
              ))}
            </div>
          ) : (
            <div className="banner-carousel placeholder-carousel">
              <div className="carousel-slide active" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}></div>
            </div>
          )}
        </div>

        <div className="hero-content">
          <span className="global-beta-tag">Built for Serious Trade</span>
          <h1 className="hero-title">
            Invite-Only <span className="text-orange">Global</span> <br />
            Chemical Network
          </h1>
          <p className="hero-subtitle">
            A private ecosystem built for verified chemical businesses to connect, collaborate, and trade directly.<br />
            <strong>No Noise. Just Business.</strong>
          </p>
          <div className="hero-cta-group">
            <button 
              className="join-btn hero-btn"
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=chemnexusio@gmail.com', '_blank')}
            >
              Request Access <ChevronRight size={18} className="icon-inline" />
            </button>
          </div>
        </div>
        
        {banners.length > 1 && (
          <div className="carousel-dots hero-dots">
            {banners.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        )}
      </section>

      {/* About Us Section */}
      <section id="about" className="landing-section dark-section">
        <div className="split-section align-items-center">
          <div className="about-text">
            <span className="section-tag">🏢 ABOUT US</span>
            <h2 className="section-title">ChemNexus brings together verified industry participants</h2>
            <p>
              ChemNexus is a private, invite-only platform designed to transform how chemical businesses connect and trade globally. 
              We aim to eliminate inefficiencies, reduce dependency on intermediaries, and enable direct communication between verified industry participants.
            </p>
            <p>
              By combining structured trade formats with a trusted network, ChemNexus creates an environment where serious businesses can engage with confidence.
              Our focus is simple — quality connections, faster decisions, and better outcomes.
            </p>
          </div>
          <div className="about-image-container">
            <img src={slider2} alt="Lab and About Section" className="rounded-image" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="landing-section">
        <div className="grid-2">
          <div className="feature-card text-center">
            <div className="feature-icon mx-auto gold">
              <Eye size={28} />
            </div>
            <h3>🎯 VISION</h3>
            <p>To become the world’s most trusted and efficient digital network for the global chemical industry.</p>
          </div>
          <div className="feature-card text-center">
            <div className="feature-icon mx-auto">
              <Rocket size={28} />
            </div>
            <h3>🚀 MISSION</h3>
            <p>To simplify and streamline chemical trade by enabling direct, transparent, and structured interactions between verified businesses across the supply chain.</p>
          </div>
        </div>
      </section>

      {/* Aim & Objectives */}
      <section className="landing-section dark-section">
        <div className="text-center mb-4">
          <span className="section-tag">🎯 AIM & OBJECTIVES</span>
          <h2 className="section-title">What We Strive For</h2>
        </div>
        <div className="grid-3">
          <div className="feature-card">
            <Shield className="feature-icon gold" size={24} />
            <h3>Trusted Ecosystem</h3>
            <p>Build a trusted ecosystem of verified chemical businesses.</p>
          </div>
          <div className="feature-card">
            <Zap className="feature-icon" size={24} />
            <h3>Direct Trade</h3>
            <p>Enable direct trade without unnecessary intermediaries.</p>
          </div>
          <div className="feature-card">
            <Activity className="feature-icon gold" size={24} />
            <h3>Speed & Efficiency</h3>
            <p>Improve speed and efficiency of deal-making.</p>
          </div> 
          <div className="feature-card">
            <Lock className="feature-icon" size={24} />
            <h3>Structured Cmmunication</h3>
            <p>Provide structured communication to reduce noise and confusion.</p>
          </div>
          <div className="feature-card">
            <Globe className="feature-icon gold" size={24} />
            <h3>Integrated Platform</h3>
            <p>Integrate logistics, supply, and demand in one platform.</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" size={24} />
            <h3>Reputation Driven</h3>
            <p>Create a reputation-driven business network.</p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="network" className="landing-section">
        <div className="split-section">
          <div>
            <span className="section-tag">🌍 WHAT WE OFFER</span>
            <h2 className="section-title">A Comprehensive Network</h2>
            <ul className="check-list highlight-list">
              <li><CheckCircle className="check-icon" size={22} /> Direct access to global buyers and sellers</li>
              <li><CheckCircle className="check-icon" size={22} /> Verified business profiles</li>
              <li><CheckCircle className="check-icon" size={22} /> Structured requirement & supply postings</li>
              <li><CheckCircle className="check-icon" size={22} /> Controlled and meaningful interactions</li>
              <li><CheckCircle className="check-icon" size={22} /> Integrated logistics connections</li>
              <li><CheckCircle className="check-icon" size={22} /> Performance and reputation tracking</li>
            </ul>
          </div>
          <div className="about-image-container">
            <img src={slider3} alt="Global Network" className="rounded-image" />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="landing-section dark-section">
        <div className="split-section reverse-mobile">
          <div className="about-image-container">
            <img src={slider1} alt="Trust Infrastructure" className="rounded-image" />
          </div>
          <div>
            <span className="section-tag">🔐 WHY TRUST CHEMNEXUS</span>
            <h2 className="section-title">Built for Safety and Scale</h2>
            <p style={{ marginBottom: '2rem' }}>Our platform ensures a secure environment for all participants.</p>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="small-feature">
                <div className="icon-circle"><Shield size={20} /></div>
                <h4>Strict Onboarding</h4>
                <p>Rigorous verification process.</p>
              </div>
              <div className="small-feature">
                <div className="icon-circle"><Lock size={20} /></div>
                <h4>Regulated Access</h4>
                <p>No open or uncontrolled entries.</p>
              </div>
              <div className="small-feature">
                <div className="icon-circle"><Target size={20} /></div>
                <h4>Serious Business</h4>
                <p>Focus solely on verified participants.</p>
              </div>
              <div className="small-feature">
                <div className="icon-circle"><Activity size={20} /></div>
                <h4>Transparent Communication</h4>
                <p>Structured and clear interactions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="landing-section" style={{ textAlign: 'center', paddingBottom: '6rem' }}>
        <div className="feature-card cta-card">
          <span className="section-tag">📩 JOIN THE NETWORK</span>
          <h2 className="section-title">Ready to Transform Your Trade?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.1rem' }}>
            ChemNexus is currently invite-only. We onboard a limited number of companies to maintain quality and trust.
          </p>
          <form className="invite-form" onSubmit={(e) => { e.preventDefault(); alert('Invite request sent successfully!'); }}>
            <input type="email" placeholder="Enter your business email" required className="invite-input" />
            <button type="submit" className="join-btn" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
              Request Invite
            </button>
          </form>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
            Applications are reviewed by our team of industry experts !
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/website" className="landing-logo">
              <img src={logo} alt="ChemNexus" />
              <span>ChemNexus Global</span>
            </Link>
            <p>The Intelligent Network for Global Chemical Business.</p>
          </div>
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Who Can Join</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><span style={{ color: '#94a3b8' }}>Chemical Manufacturers</span></li>
                <li><span style={{ color: '#94a3b8' }}>Chemical Distributors & Traders </span></li>
                <li><span style={{ color: '#94a3b8' }}>Logistics Service Providers </span></li>
                <li><span style={{ color: '#94a3b8' }}>Lab chemicals and supplies</span></li>
                <li><span style={{ color: '#94a3b8' }}>OEM/EPC and Equipment Providers </span></li>
                <li><span style={{ color: '#94a3b8' }}>Chemical Packing Material Providers</span></li>
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
          © 2026 ChemNexus. All rights reserved. | Invite Only. Global Access. Trusted Trade.
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLanding;
