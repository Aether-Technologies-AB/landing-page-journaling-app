import React, { useState } from 'react';
import './NewsletterSection.css';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      const res = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage("You're in! 🎉 Check your inbox for a welcome from us.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <div className="newsletter-text">
          <h2>Get Weekly Memory Tips</h2>
          <p>
            Practical ideas for capturing your child's voice, milestones, and stories —
            before childhood amnesia takes them. Free, once a week.
          </p>
        </div>

        {status === 'success' ? (
          <div className="newsletter-success">
            <span className="newsletter-success-icon">✓</span>
            <p>{message}</p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className={`newsletter-button ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending…' : 'Get Tips Free'}
            </button>
            {status === 'error' && (
              <p className="newsletter-error">{message}</p>
            )}
          </form>
        )}

        <p className="newsletter-disclaimer">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default NewsletterSection;
