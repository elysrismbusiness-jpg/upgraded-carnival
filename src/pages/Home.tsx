// Home.jsx
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('[data-scroll]'));
    if (items.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-container">
      {/* Desktop Experience */}
      <div className="desktop-view">
        <spline-viewer url="https://prod.spline.design/hJKMelfycWC4hWys/scene.splinecode" />
        <div className="desktop-overlay" data-scroll>
          <h1 className="hero-title">Dispulse</h1>
          <p className="hero-tagline">
            We design brands that move culture.
          </p>
        </div>
      </div>

      {/* Mobile Experience */}
      <div className="mobile-view">
        <div className="mobile-hero" data-scroll>
          <span className="mobile-eyebrow">Creative Studio</span>

          <h1 className="mobile-title">
            Brands<br />That Move Culture
          </h1>

          <p className="mobile-description">
            We help creators, esports teams, and modern brands build identity,
            community, and long-term relevance.
          </p>

          <div className="mobile-actions">
            <button className="primary-btn">Start a Project</button>
            <button className="secondary-btn">View Our Work</button>
          </div>
        </div>

        <div className="mobile-proof" data-scroll>
          <div className="proof-item" data-scroll>
            <strong>45K+</strong>
            <span>Followers Grown</span>
          </div>
          <div className="proof-item" data-scroll>
            <strong>Premium</strong>
            <span>Brand Positioning</span>
          </div>
          <div className="proof-item" data-scroll>
            <strong>Long-Term</strong>
            <span>Partnership Focus</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide mobile by default, show desktop */
        .mobile-view {
          display: none;
        }

        .desktop-view {
          position: relative;
        }

        /* Media query for mobile devices */
        @media (max-width: 768px) {
          .desktop-view {
            display: none; /* hide the spline on mobile */
          }

          .mobile-view {
            display: block; /* show mobile content */
            position: relative;
            z-index: 10; /* ensure it covers the spline if needed */
          }
        }

        /* Optional: make sure mobile overlay covers everything */
        .mobile-view,
        .mobile-view * {
          box-sizing: border-box;
        }

        [data-scroll] {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        [data-scroll].is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .proof-item[data-scroll] {
          transition-delay: 0.1s;
        }

        .proof-item[data-scroll]:nth-child(2) {
          transition-delay: 0.22s;
        }

        .proof-item[data-scroll]:nth-child(3) {
          transition-delay: 0.34s;
        }
      `}</style>
    </div>
  );
};

export default Home;
