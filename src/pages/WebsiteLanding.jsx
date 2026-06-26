import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Smartphone, CheckCircle, ChevronRight, Lock, Activity, Users, Target, Rocket, Eye, Menu, X, FlaskConical, BarChart2, Package, Truck, CircleDollarSign, Building2, FileText, Bot } from 'lucide-react';
import './WebsiteLanding.css';
import logo from '../assets/chemnexus-logo.png';
import slider1 from '../assets/image1.jpeg';
import slider2 from '../assets/image2.jpeg';
import slider3 from '../assets/image3.jpeg';
import companyLogo from '../assets/company.jpeg';

const WebsiteLanding = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-navbar">
        <Link to="/website" className="landing-logo">
          <img src={logo} alt="ChemNexus" />
          <span>ChemNexus  Global</span>
        </Link>
        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#offerings">Offerings</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#network">Network</a>
          <a href="#contact">Contact</a>
        </div>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
          <a href="#offerings" onClick={() => setIsMobileMenuOpen(false)}>Offerings</a>
          <a href="#roadmap" onClick={() => setIsMobileMenuOpen(false)}>Roadmap</a>
          <a href="#network" onClick={() => setIsMobileMenuOpen(false)}>Network</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        </div>
      )}
 
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
           Redefining <span className="text-orange">Global</span> <br />
            Chemical Commerce
          </h1>
          <p className="hero-subtitle">
            The Next-Generation AI-Powered, Invite-Only Global Chemical Network
Exclusively engineered for verified chemical industry stakeholders to connect with trusted partners, unlock new opportunities, source intelligently, and accelerate growth across global markets.<br />
            <strong>Trusted Connections. Intelligent Trade.</strong>
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
            <span className="section-tag">🏢 ABOUT CHEMNEXUS GLOBAL </span>
            <h2 className="section-title">ChemNexus brings together verified industry participants</h2>
            <p> 
              ChemNexus is the next-generation, AI-powered, invite-only global network built exclusively for the chemical industry.
               We bring together compliance-verified chemical manufacturers, distributors, traders, logistics partners, laboratory suppliers, equipment providers, packaging suppliers, and procurement professionals within a trusted business ecosystem.
                      With 20+ years of deep industry experience, our leadership team has worked closely with chemical manufacturers, specialty chemical companies, Oil & Gas refineries, EPC contractors, process licensors, petrochemical complexes and large matrix organizations. We understand the real-world challenges of business development—from identifying the right decision-makers and generating qualified leads to navigating complex procurement structures and building long-term business relationships.  </p>
            <p>
       What sets ChemNexus apart is the combination of industry expertise and technology innovation. Our experienced AI and technology team transforms these real-world industry challenges into intelligent digital solutions. By leveraging Artificial Intelligence, smart matching algorithms, data-driven networking, and automation, ChemNexus helps businesses discover relevant opportunities, connect with the right partners, and accelerate growth with greater precision and efficiency.
We don't just build app—we build AI-powered solutions designed around the realities of the chemical industry, enabling businesses to network smarter, engage faster, and grow globally.   </p>
          </div>
          <div className="about-image-container">
            <img src={slider2} alt="Lab and About Section" className="rounded-image" />
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section id="offerings" className="landing-section">
        <div className="text-center mb-4">
          <span className="section-tag">🌟 OUR OFFERINGS</span>
          <h2 className="section-title">What ChemNexus Provides</h2>
        </div>
        <div className="grid-3">
          <div className="feature-card">
            <Globe className="feature-icon gold" size={24} />
            <h3>Connected Chemical Ecosystem</h3>
            <p>ChemNexus unifies the entire chemical value chain on a single trusted platform—bringing together manufacturers, distributors, procurement teams, OEMs, EPC contractors, logistics partners, laboratory suppliers, and packaging providers to enable seamless business collaboration.</p>
          </div>
          <div className="feature-card">
            <Shield className="feature-icon" size={24} />
            <h3>Verified Business Network</h3>
            <p>Every organization undergoes a structured compliance verification process, ensuring that members engage with genuine businesses committed to long-term professional relationships.</p>
          </div>
          <div className="feature-card">
            <Target className="feature-icon gold" size={24} />
            <h3>Business Opportunity Discovery</h3>
            <p>Whether you're looking for new customers, reliable suppliers, strategic partners, contract manufacturers, or technology providers, ChemNexus helps you discover relevant opportunities within a focused chemical industry ecosystem.</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" size={24} />
            <h3>Industry-Focused Networking</h3>
            <p>Expand your professional network by connecting with business leaders, procurement professionals, technical experts, and decision-makers from chemical companies, refineries, industrial plants, and EPC organizations.</p>
          </div>
          <div className="feature-card">
            <Eye className="feature-icon gold" size={24} />
            <h3>Digital Business Visibility</h3>
            <p>Create a powerful company presence by showcasing your products, manufacturing capabilities, certifications, infrastructure, and expertise to a global audience of verified industry professionals.</p>
          </div>
          <div className="feature-card">
            <Zap className="feature-icon" size={24} />
            <h3>AI-Enabled Productivity</h3>
            <p>Our technology team is embedding Artificial Intelligence across the platform to simplify information discovery, accelerate business searches, assist with content creation, automate repetitive tasks, and deliver a smarter, more productive networking experience.</p>
          </div>
        </div>
        
        <div className="feature-card mt-4 text-center" style={{ marginTop: '2rem', padding: '2rem' }}>
          <h3>Built by the Industry, for the Industry</h3>
          <p>With over two decades of chemical industry experience, ChemNexus is designed around real business challenges—not assumptions—delivering practical solutions that help companies connect faster, engage better, and grow with confidence.</p>
          <p style={{ marginTop: '1rem' }}><b>From manufacturing to procurement, engineering to logistics, ChemNexus connects every critical stakeholder in the chemical value chain through one intelligent, trusted platform.</b></p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="landing-section dark-section roadmap-section">
        <div className="mb-2">
          <span className="section-tag">🚀 PLATFORM ROADMAP</span>
          <h2 className="section-title">ChemNexus is Continuously Evolving</h2>
          <p style={{ maxWidth: '900px', margin: '0 0 2rem 0' }}>
            ChemNexus is continuously evolving into the most comprehensive digital ecosystem for the global chemical industry.
          </p>
        </div>

        <div className="roadmap-timeline">
          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><FlaskConical size={24} /></div>
            <div className="roadmap-content">
              <h3>CRO & CDMO Collaboration Network</h3>
              <p>Connect pharmaceutical companies, CROs, CDMOs, research organizations, and manufacturing partners through a dedicated collaboration ecosystem.</p>
            </div>
          </div>
          
          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><BarChart2 size={24} /></div>
            <div className="roadmap-content">
              <h3>Global Chemical Price Intelligence</h3>
              <p>Historical trends, benchmark pricing, and global market insights for high-volume and commodity chemicals to support informed commercial decisions.</p>
            </div>
          </div>
          
          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><Package size={24} /></div>
            <div className="roadmap-content">
              <h3>Surplus Inventory Exchange</h3>
              <p>A secure marketplace for buying and selling surplus chemicals, excess inventory, near-expiry stock, and idle materials.</p>
            </div>
          </div>
          
          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><Truck size={24} /></div>
            <div className="roadmap-content">
              <h3>Live Dispatch Verification</h3>
              <p>Real-time dispatch visibility with optional CCTV-backed loading confirmation to improve transparency and support payment-against-dispatch processes.</p>
            </div>
          </div>

          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><CircleDollarSign size={24} /></div>
            <div className="roadmap-content">
              <h3>Capital Connect</h3>
              <p>Access investors, private equity firms, venture funds, NBFCs, banks, and working capital providers focused on the chemical sector.</p>
            </div>
          </div>

          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><Building2 size={24} /></div>
            <div className="roadmap-content">
              <h3>Warehouse & Storage Directory</h3>
              <p>Locate verified warehousing, tank storage, cold storage, and hazardous chemical storage facilities across strategic locations.</p>
            </div>
          </div>

          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><FileText size={24} /></div>
            <div className="roadmap-content">
              <h3>Digital RFQ & Tender Exchange</h3>
              <p>Streamline procurement by connecting buyers and suppliers through structured RFQs and tender opportunities.</p>
            </div>
          </div>

          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><Bot size={24} /></div>
            <div className="roadmap-content">
              <h3>AI Business Assistant</h3>
              <p>An intelligent assistant to simplify product discovery, answer technical queries, draft business communications, and deliver actionable market insights.</p>
            </div>
          </div>

          <div className="roadmap-item animate-on-scroll">
            <div className="roadmap-icon"><Globe size={24} /></div>
            <div className="roadmap-content">
              <h3>Global Trade Intelligence</h3>
              <p>Access import-export trends, market movements, trade opportunities, and business intelligence tailored to the chemical industry.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 animate-on-scroll fade-up" style={{ marginTop: '4rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#f59e0b', fontStyle: 'italic', maxWidth: '900px', margin: '0 auto', fontWeight: '500', lineHeight: '1.6' }}>
            "Our vision is to build the world's most intelligent AI-powered platform for chemical business, connecting every stakeholder, every opportunity, and every stage of the value chain."
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      {/* <section className="landing-section">
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
      </section> */}



      {/* What We Offer */}
      {/* <section id="network" className="landing-section">
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
      </section> */}

      {/* Trust Section */}
      {/* <section className="landing-section dark-section">
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
      </section>  */}

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
              <h4 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="#offerings" style={{ color: '#94a3b8', textDecoration: 'none' }}>Offerings</a></li>
                <li><a href="#roadmap" style={{ color: '#94a3b8', textDecoration: 'none' }}>Roadmap</a></li>
                <li><a href="#network" style={{ color: '#94a3b8', textDecoration: 'none' }}>Network</a></li>              
                <li><a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a></li>
                <li><a href="#home" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</a></li>
              </ul>
             
            </div>
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
          </div>
        </div> 
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 ChemNexus. All rights reserved. | Invite Only. Global Access. Trusted Trade.
          </div>
          <div className="footer-developed-by">
            <span>Developed by</span>
            <a href="https://www.smservice.co.in/" target="_blank" rel="noopener noreferrer">
              <img src={companyLogo} alt="SM Service" className="developer-logo" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLanding;
