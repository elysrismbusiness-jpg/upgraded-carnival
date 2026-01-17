import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Services = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const styles = {
    body: {
      background: 'transparent',
      color: '#e9f5ff',
      fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
      minHeight: '100vh',
      padding: '40px 20px',
      margin: 0,
      position: 'relative' as const,
    },
    blueGlow: {
      display: 'none' as const,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative' as const,
      zIndex: 2,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '60px',
      animation: 'sectionSweep 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      animationDelay: '0.05s',
    },
    badge: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, rgba(54, 140, 255, 0.18), rgba(25, 95, 210, 0.18))',
      border: '1px solid rgba(125, 190, 255, 0.35)',
      borderRadius: '999px',
      padding: '8px 18px',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.4px',
      color: '#bfe3ff',
    },
    badgeIcon: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #6cc3ff, #2f83ff)',
      borderRadius: '10px',
      width: '18px',
      height: '18px',
      marginRight: '8px',
      verticalAlign: 'middle' as const,
    },
    h1: {
      fontSize: '52px',
      fontWeight: 700,
      marginBottom: '14px',
      lineHeight: 1.1,
      color: '#e9f5ff',
      letterSpacing: '-0.5px',
    },
    highlight: {
      color: '#6cc3ff',
    },
    subtitle: {
      fontSize: '16px',
      color: 'rgba(231, 242, 255, 0.72)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.8,
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginTop: '60px',
      borderRadius: '24px',
      padding: '40px',
      background: 'linear-gradient(135deg, rgba(8, 20, 40, 0.75), rgba(14, 40, 80, 0.7))',
      border: '1px solid rgba(93, 170, 255, 0.25)',
      boxShadow: '0 25px 60px rgba(6, 16, 34, 0.55)',
      animation: 'sectionSweep 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      animationDelay: '0.12s',
    },
    card: (isHovered: boolean) => ({
      background: 'linear-gradient(145deg, rgba(8, 18, 36, 0.82), rgba(14, 38, 72, 0.72))',
      border: isHovered ? '1px solid rgba(110, 190, 255, 0.55)' : '1px solid rgba(93, 170, 255, 0.25)',
      borderRadius: '18px',
      padding: '34px 28px',
      textAlign: 'left' as const,
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      cursor: 'pointer',
      boxShadow: isHovered
        ? '0 18px 30px rgba(11, 26, 52, 0.6)'
        : '0 10px 20px rgba(8, 18, 36, 0.5)',
      animation: 'cardGlide 0.85s cubic-bezier(0.22, 1, 0.36, 1) both',
    }),
    cardIcon: {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(135deg, rgba(76, 155, 255, 0.25), rgba(30, 110, 230, 0.25))',
      border: '1px solid rgba(125, 190, 255, 0.35)',
      borderRadius: '16px',
      margin: '0 0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 700,
      color: '#6cc3ff',
      letterSpacing: '1px',
    },
    cardH3: {
      fontSize: '22px',
      marginBottom: '12px',
      fontWeight: 700,
      color: '#e9f5ff',
    },
    cardP: {
      fontSize: '14px',
      color: 'rgba(231, 242, 255, 0.72)',
      lineHeight: 1.8,
    },
    formContainer: {
      background: 'linear-gradient(145deg, rgba(8, 18, 36, 0.82), rgba(14, 38, 72, 0.72))',
      border: '1px solid rgba(93, 170, 255, 0.25)',
      borderRadius: '24px',
      padding: '50px 40px',
      maxWidth: '550px',
      margin: '80px auto 0',
      boxShadow: '0 24px 50px rgba(8, 18, 36, 0.55)',
      animation: 'sectionSweep 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      animationDelay: '0.2s',
    },
    datePickerContainer: {
      position: 'relative' as const,
      width: '100%',
    },
    formH2: {
      fontSize: '32px',
      marginBottom: '35px',
      textAlign: 'center' as const,
      color: '#e9f5ff',
      fontWeight: 700,
    },
    formGroup: {
      marginBottom: '28px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '14px',
      color: '#9fd5ff',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '1px solid rgba(96, 165, 250, 0.35)',
      borderRadius: '12px',
      background: 'rgba(5, 12, 24, 0.6)',
      color: '#e9f5ff',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
      fontWeight: 500,
    },
    inputFocus: {
      outline: 'none',
      borderColor: 'rgba(96, 165, 250, 0.7)',
      background: 'rgba(5, 12, 24, 0.8)',
      boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.18)',
    },
    button: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #4da3ff 0%, #1f7bff 100%)',
      color: '#041127',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
      marginTop: '20px',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      boxShadow: '0 16px 28px rgba(16, 58, 120, 0.4)',
    },
    buttonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 20px 36px rgba(16, 58, 120, 0.55)',
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    successMsg: {
      display: successMessage ? 'block' : 'none',
      background: 'linear-gradient(135deg, rgba(28, 160, 84, 0.18), rgba(18, 130, 64, 0.18))',
      border: '1px solid rgba(64, 205, 120, 0.45)',
      color: '#9ff0be',
      padding: '18px',
      borderRadius: '12px',
      marginTop: '25px',
      textAlign: 'center' as const,
      fontSize: '14px',
      fontWeight: 600,
      animation: 'slideIn 0.4s ease',
    },
    errorMsg: {
      display: errorMessage ? 'block' : 'none',
      background: 'linear-gradient(135deg, rgba(210, 60, 60, 0.18), rgba(160, 40, 40, 0.18))',
      border: '1px solid rgba(255, 120, 120, 0.45)',
      color: '#ffb1b1',
      padding: '18px',
      borderRadius: '12px',
      marginTop: '25px',
      textAlign: 'center' as const,
      fontSize: '14px',
      fontWeight: 600,
      animation: 'slideIn 0.4s ease',
    },
  };

  const cards = [
    {
      icon: '01',
      title: 'Content Strategy & Production',
      description: 'Long-form and social-first storytelling built to raise brand perception and grow durable audiences.',
    },
    {
      icon: '02',
      title: 'Community Engagement',
      description: 'Programs that build loyalty, keep players close, and turn audience participation into a repeatable system.',
    },
    {
      icon: '03',
      title: 'Brand Partnerships & Outreach',
      description: 'Targeted partner lists, positioning, and outreach that align with your long-term content direction.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !date) {
      setErrorMessage(true);
      setSuccessMessage(false);
      return;
    }

    setLoading(true);
    setErrorMessage(false);

    try {
      const response = await fetch('https://formspree.io/f/mbddloab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          date: date,
          message: `Selected date: ${date}`,
        }),
      });

      if (response.ok) {
        setSuccessMessage(true);
        setErrorMessage(false);
        setEmail('');
        setDate('');
        setTimeout(() => setSuccessMessage(false), 4000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(true);
      setSuccessMessage(false);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.body}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes sectionSweep {
          from {
            opacity: 0;
            transform: translateY(28px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes cardGlide {
          from {
            opacity: 0;
            transform: translateY(26px) scale(0.97) rotateX(2deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }
        input::placeholder {
          color: rgba(231, 242, 255, 0.5);
        }
        input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        .custom-datepicker {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(96, 165, 250, 0.35);
          border-radius: 12px;
          background: rgba(5, 12, 24, 0.6);
          color: #e9f5ff;
          font-size: 14px;
          font-weight: 500;
          box-sizing: border-box;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .custom-datepicker:focus {
          outline: none;
          border-color: rgba(96, 165, 250, 0.7);
          background: rgba(5, 12, 24, 0.8);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.18);
        }
        .react-datepicker {
          background-color: #0b1730;
          border: 1px solid rgba(96, 165, 250, 0.35);
          border-radius: 12px;
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: rgba(14, 38, 72, 0.9);
          border-bottom: 1px solid rgba(96, 165, 250, 0.35);
          color: #e9f5ff;
        }
        .react-datepicker__month {
          color: #e9f5ff;
        }
        .react-datepicker__day {
          color: rgba(231, 242, 255, 0.75);
        }
        .react-datepicker__day:hover {
          background-color: rgba(77, 163, 255, 0.7);
          color: #fff;
        }
        .react-datepicker__day--selected {
          background-color: #4da3ff;
          color: #fff;
        }
        .react-datepicker__day--today {
          font-weight: bold;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #6cc3ff;
        }
        .react-datepicker__day-name {
          color: #6cc3ff;
        }
      `}</style>

      <div style={styles.blueGlow}></div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}></span>
            Our Services
          </div>
          <h1 style={styles.h1}>
            Services built
            <br />
            <span style={styles.highlight}>for brands that want to lead</span>
          </h1>
          <p style={styles.subtitle}>
            Strategy, production, and partnership support designed to create durable growth in esports and beyond.
          </p>
        </div>

        <div style={styles.cardsContainer}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                ...styles.card(hoveredCard === index),
                animationDelay: `${0.1 + index * 0.08}s`,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardH3}>{card.title}</h3>
              <p style={styles.cardP}>{card.description}</p>
            </div>
          ))}
        </div>

        <div style={styles.formContainer}>
          <h2 style={styles.formH2}>Schedule & Email</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.35)';
                  e.currentTarget.style.background = 'rgba(5, 12, 24, 0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Date</label>
              <div style={styles.datePickerContainer}>
                <DatePicker
                  selected={date ? new Date(date) : null}
                  onChange={(selectedDate: Date | null) => {
                    if (selectedDate) {
                      const isoDate = selectedDate.toISOString().split('T')[0];
                      setDate(isoDate);
                    }
                  }}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Click to select a date"
                  className="custom-datepicker"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
              onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.buttonHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 16px 28px rgba(16, 58, 120, 0.4)';
              }}
            >
              {loading ? 'Sending...' : 'Send date via email'}
            </button>
          </form>

          <div style={styles.successMsg}>
            Email sent successfully! Check your inbox.
          </div>

          <div style={styles.errorMsg}>
            Please fill in all fields correctly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;


