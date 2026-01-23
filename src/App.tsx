import { Suspense, useEffect, useRef, useState } from 'react';
import AppErrorBoundary from './components/AppErrorBoundary';
import AnimatedBackground from './components/AnimatedBackground';
import Services from './pages/Services';
import Work from './pages/Work';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import AdminEditor from './pages/AdminEditor';
import { editableDefaults } from './content/editableDefaults';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contentEntries, setContentEntries] = useState<Record<string, string>>({});
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const logoUrl = `${import.meta.env.BASE_URL}logo.png`;

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

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const entries = (data?.entries ?? {}) as Record<string, string>;
        setContentEntries(entries);

        const missing: Record<string, string> = {};
        Object.entries(editableDefaults).forEach(([key, value]) => {
          if (!entries[key]) {
            missing[key] = value;
          }
        });

        if (Object.keys(missing).length > 0) {
          fetch('/api/content/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entries: missing }),
          }).catch(() => undefined);
        }
      } catch {
        // ignore content load failures
      }
    };

    loadContent();
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const root = contentWrapperRef.current;
    if (!root) {
      return;
    }

    const revealNodes = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (!revealNodes.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.2,
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const merged = { ...editableDefaults, ...contentEntries };
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-editable]'));
    elements.forEach((element) => {
      const key = element.dataset.editable;
      if (!key || merged[key] === undefined) {
        return;
      }
      element.textContent = merged[key];
    });
  }, [contentEntries, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <AppErrorBoundary>
        <AdminEditor />
      </AppErrorBoundary>
    );
  }

  return (
    <AppErrorBoundary>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <div className="app-container">
          <AnimatedBackground />

          <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container navbar-glow">
              <div className="navbar-brand">
                <div className="navbar-logo" onClick={() => handleNavClick('hero')}>
                  <img src={logoUrl} alt="Dispulse" className="logo-image" />
                  <span className="logo-text" data-editable="brand-logo-text">Dispulse</span>
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
                <a onClick={() => handleNavClick('hero')} className="nav-link" data-editable="nav-home">Home</a>
                <a onClick={() => handleNavClick('services')} className="nav-link" data-editable="nav-services">Services</a>
                <a onClick={() => handleNavClick('work')} className="nav-link" data-editable="nav-work">Work</a>
                <a onClick={() => handleNavClick('faq')} className="nav-link" data-editable="nav-faq">FAQ</a>
                <a onClick={() => handleNavClick('contact')} className="nav-link" data-editable="nav-contact">Contact</a>
              </nav>

              <button className="btn-cta" onClick={() => handleNavClick('contact')} data-editable="nav-cta">
                Get in Touch
              </button>
            </div>
          </header>

          <div ref={contentWrapperRef} className="content-wrapper">
            <section id="hero" className="hero-section reveal">
              <div className="hero-backdrop"></div>
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="hero-badge-dot"></span>
                  <span data-editable="hero-badge">Creative Studio</span>
                </div>
                <h1 className="hero-title" data-editable="hero-title">
                  Build Brands That
                </h1>
                <h2 className="hero-subtitle" data-editable="hero-subtitle">Move Culture</h2>
                <p className="hero-description" data-editable="hero-description">
                  We help creators, esports teams, and modern brands build identity,
                  community, and long-term relevance through strategic social media.
                </p>
                <div className="hero-actions">
                  <button className="hero-btn-primary" onClick={() => scrollToSection('contact')} data-editable="hero-cta-primary">
                    Start a Project
                  </button>
                  <button className="hero-btn-secondary" onClick={() => scrollToSection('work')} data-editable="hero-cta-secondary">
                    View Our Work
                  </button>
                </div>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="hero-stat-value" data-editable="hero-stat-value-1">45K+</div>
                    <div className="hero-stat-label" data-editable="hero-stat-label-1">Followers Grown</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value" data-editable="hero-stat-value-2">Premium</div>
                    <div className="hero-stat-label" data-editable="hero-stat-label-2">Brand Positioning</div>
                  </div>
                  <div className="hero-stat">
                    <div className="hero-stat-value" data-editable="hero-stat-value-3">Long-Term</div>
                    <div className="hero-stat-label" data-editable="hero-stat-label-3">Partnership Focus</div>
                  </div>
                </div>
              </div>
            </section>

            <section id="services" className="content-section reveal">
              <Services />
            </section>

            <section id="work" className="content-section reveal">
              <Work />
            </section>

            <section id="faq" className="content-section reveal">
              <FAQ />
            </section>

            <section id="contact" className="content-section reveal">
              <Contact />
            </section>

            <footer className="site-footer reveal">
              <div className="footer-shell">
                <div className="footer-brand">
                  <div className="footer-mark">
                    <img src={logoUrl} alt="Dispulse" />
                  </div>
                  <div>
                    <h3 data-editable="footer-brand-title">Dispulse</h3>
                    <p data-editable="footer-brand-description">
                      Strategy, production, and partnerships for teams that want to lead culture.
                    </p>
                  </div>
                </div>

                <div className="footer-columns">
                  <div>
                    <h4 data-editable="footer-explore-title">Explore</h4>
                    <ul>
                      <li><button type="button" onClick={() => scrollToSection('services')} data-editable="footer-link-services">Services</button></li>
                      <li><button type="button" onClick={() => scrollToSection('work')} data-editable="footer-link-work">Work</button></li>
                      <li><button type="button" onClick={() => scrollToSection('faq')} data-editable="footer-link-faq">FAQ</button></li>
                      <li><button type="button" onClick={() => scrollToSection('contact')} data-editable="footer-link-contact">Contact</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 data-editable="footer-social-title">Social</h4>
                    <ul>
                      <li><a href="https://x.com/dispulseMGMT" data-editable="footer-social-x">X / Twitter</a></li>
                      <li><a href="https://www.tiktok.com/@dispulseMGMT" data-editable="footer-social-tiktok">TikTok</a></li>
                      <li><a href="https://www.linkedin.com/company/dispulseMGMT" data-editable="footer-social-linkedin">LinkedIn</a></li>
                    </ul>
                  </div>

                  <div>
                    <h4 data-editable="footer-signal-title">Signal</h4>
                    <p className="footer-note" data-editable="footer-note">Drop a message and get a response within 24 hours.</p>
                    <a className="footer-cta" href="mailto:contact@dispulse.co" data-editable="footer-cta-email">
                      contact@dispulse.co
                    </a>
                  </div>
                </div>

                <div className="footer-bottom">
                  <span data-editable="footer-bottom-studio">Dispulse Studio</span>
                  <span data-editable="footer-bottom-location">London, UK</span>
                  <span data-editable="footer-bottom-year">2024</span>
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
