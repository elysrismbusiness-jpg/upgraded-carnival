import { Suspense, useEffect, useRef, useState } from 'react';
import AppErrorBoundary from './components/AppErrorBoundary';
import AnimatedBackground from './components/AnimatedBackground';
import Services from './pages/Services';
import Work from './pages/Work';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const target = contentWrapperRef.current;
    if (!target) {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(target.scrollTop > 4);
    };

    handleScroll();
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppErrorBoundary>
      <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
        <div className="app-container">
          <AnimatedBackground />

          <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container navbar-glow">
              <div className="navbar-brand">
                <div className="navbar-logo" onClick={() => handleNavClick('hero')}>
                  <img src={new URL('/logo.png', import.meta.url).href} alt="Dispulse" className="logo-image" />
                  <span className="logo-text">Dispulse</span>
                </div>
                <button
                  className="navbar-toggle"
                  type="button"
                  aria-label="Toggle navigation"
                  aria-expanded={isMenuOpen}
                  aria-controls="primary-navigation"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <span className="navbar-toggle-bar"></span>
                  <span className="navbar-toggle-bar"></span>
                  <span className="navbar-toggle-bar"></span>
                </button>
              </div>

              <nav id="primary-navigation" className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
                <a onClick={() => handleNavClick('hero')} className="nav-link">Home</a>
                <a onClick={() => handleNavClick('services')} className="nav-link">Services</a>
                <a onClick={() => handleNavClick('work')} className="nav-link">Work</a>
                <a onClick={() => handleNavClick('faq')} className="nav-link">FAQ</a>
                <a onClick={() => handleNavClick('contact')} className="nav-link">Contact</a>
              </nav>

              <button className="btn-cta" onClick={() => handleNavClick('contact')}>Get in Touch</button>
            </div>
          </header>

          <div ref={contentWrapperRef} className="content-wrapper">
            <section id="hero" className="hero-section">
              <div className="hero-backdrop"></div>
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="hero-badge-dot"></span>
                  Creative Studio
                </div>
                <h1 className="hero-title">
                  Build Brands That
                </h1>
                <h2 className="hero-subtitle">Move Culture</h2>
                <p className="hero-description">
                  We help creators, esports teams, and modern brands build identity,
                  community, and long-term relevance through strategic social media.
                </p>
                <div className="hero-actions">
                  <button className="hero-btn-primary" onClick={() => scrollToSection('contact')}>
                    Start a Project
                  </button>
                  <button className="hero-btn-secondary" onClick={() => scrollToSection('work')}>
                    View Our Work
                  </button>
                </div>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="hero-stat-value">45K+</div>
                    <div className="hero-stat-label">Followers Grown</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">Premium</div>
                    <div className="hero-stat-label">Brand Positioning</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value">Long-Term</div>
                    <div className="hero-stat-label">Partnership Focus</div>
                  </div>
                </div>
              </div>
            </section>

            <section id="services" className="content-section">
              <Services />
            </section>

            <section id="work" className="content-section">
              <Work />
            </section>

            <section id="faq" className="content-section">
              <FAQ />
            </section>

            <section id="contact" className="content-section">
              <Contact />
            </section>

            <footer className="site-footer">
              <div className="footer-shell">
                <div className="footer-brand">
                  <div className="footer-mark">
                    <img
                      src={new URL('/logo.png', import.meta.url).href}
                      alt="Dispulse"
                    />
                  </div>
                  <div>
                    <h3>Dispulse</h3>
                    <p>Strategy, production, and partnerships for teams that want to lead culture.</p>
                  </div>
                </div>

                <div className="footer-columns">
                  <div>
                    <h4>Explore</h4>
                    <ul>
                      <li><button type="button" onClick={() => scrollToSection('services')}>Services</button></li>
                      <li><button type="button" onClick={() => scrollToSection('work')}>Work</button></li>
                      <li><button type="button" onClick={() => scrollToSection('faq')}>FAQ</button></li>
                      <li><button type="button" onClick={() => scrollToSection('contact')}>Contact</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4>Social</h4>
                    <ul>
                      <li><a href="https://x.com/dispulseMGMT">X / Twitter</a></li>
                      <li><a href="https://www.tiktok.com/@dispulseMGMT">TikTok</a></li>
                      <li><a href="https://www.linkedin.com/company/dispulseMGMT">LinkedIn</a></li>
                    </ul>
                  </div>

                  <div>
                    <h4>Signal</h4>
                    <p className="footer-note">Drop a message and get a response within 24 hours.</p>
                    <a className="footer-cta" href="mailto:contact@dispulse.co">contact@dispulse.co</a>
                  </div>
                </div>

                <div className="footer-bottom">
                  <span>Dispulse Studio</span>
                  <span>London, UK</span>
                  <span>2024</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </Suspense>
    </AppErrorBoundary>
  );
}

export default App;
