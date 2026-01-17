import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(false);

    try {
      const response = await fetch('https://formspree.io/f/mbddloab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">Ready to grow your social media presence? Let's talk about your goals.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">✉</div>
            <h3>Email Us</h3>
            <p>contact@dispulse.co</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>DM Us on X</h3>
            <p>
              <a href="https://x.com/dispulse" className="social-icon">
                x.com/dispulse
              </a>
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">⏰</div>
            <h3>Business Hours</h3>
            <p>Mon - Fri: 8am - 6pm UK Time (Corporate clients)</p>
          </div>

          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://x.com/dispulse" className="social-icon">X</a>
              <a href="https://www.tiktok.com/@dispulse" className="social-icon">TikTok</a>
              <a href="https://www.linkedin.com/company/dispulse" className="social-icon">LinkedIn</a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {submitted && (
            <div className="success-message">
              Thank you! We'll get back to you within 24 hours.
            </div>
          )}
          {errorMessage && (
            <div className="error-message">
              Something went wrong. Please try again.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your Company"
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Interested In *</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              <option value="full-package-consulting">Full Package - Consulting</option>
              <option value="brand-partnerships-outreach">Brand Partnerships/Outreach</option>
              <option value="content-strategy-production">Content Strategy & Production</option>
              <option value="community-engagement">Community Engagement</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Tell us about your project *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Share your goals, current challenges, and what you're hoping to achieve with social media..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
