import { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does your process work?",
      answer: "Our process is simple and streamlined: 1) Initial consultation to understand your goals, 2) We create a custom strategy tailored to your brand, 3) Content creation and scheduling, 4) Daily monitoring and engagement, 5) Weekly analytics and optimization, 6) Monthly reporting and strategy adjustments."
    },
    {
      question: "What is the step-by-step onboarding process?",
      answer: "Step 1: Book a discovery call where we discuss your brand, goals, and target audience. Step 2: We audit your current social media presence and competitors. Step 3: Sign the agreement and provide us with access to your accounts. Step 4: We create your content calendar for the first month. Step 5: Review and approve the initial content. Step 6: We launch your campaign and begin posting. Step 7: Ongoing optimization and monthly strategy sessions."
    },
    {
      question: "How long does it take to see results?",
      answer: "Typically, clients start seeing noticeable engagement improvements within 2-4 weeks. Significant follower growth usually occurs around the 2-3 month mark. However, building a strong, engaged community is a long-term strategy. We recommend committing to at least 3-6 months for optimal results."
    },
    {
      question: "Do I need to provide content, or do you create it?",
      answer: "We handle everything! Our team creates all content including graphics, videos, captions, and hashtags. However, we do request occasional input from you such as product photos, behind-the-scenes footage, or specific announcements you'd like us to share. We'll provide a content calendar for your approval each month."
    },
    {
      question: "Which social media platforms do you manage?",
      answer: "We specialize in Instagram, TikTok, YouTube, Twitter/X, LinkedIn, and Facebook. We can manage one platform or create a comprehensive multi-platform strategy. During our consultation, we'll recommend which platforms make the most sense for your specific business and target audience."
    },
    {
      question: "What makes your service different from others?",
      answer: "Unlike agencies that treat you like a number, we provide personalized attention to every client. Our team stays on top of the latest trends, algorithm changes, and platform features. We focus on authentic engagement rather than vanity metrics, and we're transparent with our reporting. Plus, we're available for communication whenever you need us."
    },
    {
      question: "Can I cancel my service at any time?",
      answer: "Yes! While we require a minimum 3-month commitment to see results, you can cancel after that with 30 days notice. We want you to stay because you love our work, not because you're locked into a contract. No hidden fees or cancellation charges."
    },
    {
      question: "How do you measure success?",
      answer: "We track multiple metrics including follower growth, engagement rate, reach, impressions, website clicks, and conversions. You'll receive detailed monthly reports showing your progress. We also set specific KPIs during our initial consultation so we're always working toward your unique goals."
    },
    {
      question: "Will I have a dedicated account manager?",
      answer: "Absolutely! You'll be assigned a dedicated account manager who will be your main point of contact. They'll learn your brand inside and out and be available via email, phone, or scheduled calls. You'll also have access to our creative team and strategists as needed."
    },
    {
      question: "What information do you need to get started?",
      answer: "To get started, we need: 1) Access to your social media accounts (we'll guide you through secure access setup), 2) Brand guidelines, logos, and color schemes, 3) Any existing content you'd like us to use, 4) Information about your products/services, target audience, and competitors, 5) Your goals and any specific campaigns you have in mind. Don't worry, we'll walk you through everything!"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-content">
      <div className="faq-hero">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">Everything you need to know about our process and services</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-cta">
        <h2>Still have questions?</h2>
        <p>We're here to help! Reach out to us anytime.</p>
      </div>
    </div>
  );
}

export default FAQ;
