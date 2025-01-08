import React from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaCloud, FaShare } from 'react-icons/fa';

const heroImageUrl = "https://www.dropbox.com/scl/fi/3j35ymlx1w2q46fgfdetb/DALL-E-2024-12-24-02.37.10-A-realistic-scene-of-a-mother-sitting-on-the-floor-with-her-baby-reading-a-journal-style-baby-milestone-book-together.-The-book-is-open-showing-page.webp?rlkey=f5tbo43ed2k16smpmk2aycwvr&dl=1";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Every Milestone Is Worth Celebrating</h1>
            <p className="hero-subtitle">
              The smart way to document your child's journey from pregnancy to age 5
            </p>
            <div className="hero-features">
              <div className="hero-feature">
                <FaCamera className="hero-icon" />
                <span>Capture moments instantly</span>
              </div>
              <div className="hero-feature">
                <FaCloud className="hero-icon" />
                <span>Secure cloud storage</span>
              </div>
              <div className="hero-feature">
                <FaShare className="hero-icon" />
                <span>Share with family</span>
              </div>
            </div>
            <Link to="/register" className="cta-button">Start Your Journey</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImageUrl} alt="Mother reading baby milestone book with her child" />
        </div>
      </section>

      <section className="app-features">
        <h2>Your Child's Story, Beautifully Documented</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaMobile className="feature-icon" />
            <h3>Instant Capture</h3>
            <p>Record moments as they happen with our iOS app. Take photos, videos, and notes on the go.</p>
          </div>
          <div className="feature-card">
            <FaBell className="feature-icon" />
            <h3>Milestone Reminders</h3>
            <p>Never miss important moments with smart reminders for developmental milestones and vaccinations.</p>
          </div>
          <div className="feature-card">
            <FaCloud className="feature-icon" />
            <h3>Safe Storage</h3>
            <p>All memories are securely stored in the cloud, accessible anytime, anywhere.</p>
          </div>
          <div className="feature-card">
            <FaShare className="feature-icon" />
            <h3>Family Sharing</h3>
            <p>Share special moments with family members through private, secure links.</p>
          </div>
        </div>
      </section>

      <section className="milestones">
        <h2>Track Every Special Moment</h2>
        <div className="milestone-grid">
          <div className="milestone-card">
            <FaBabyCarriage className="milestone-icon" />
            <h3>Pregnancy Journey</h3>
            <ul>
              <li>Weekly pregnancy updates</li>
              <li>Ultrasound photo storage</li>
              <li>Pregnancy symptoms tracker</li>
              <li>Birth plan organizer</li>
            </ul>
          </div>
          
          <div className="milestone-card">
            <FaHeart className="milestone-icon" />
            <h3>First Year</h3>
            <ul>
              <li>Monthly milestone tracking</li>
              <li>Growth measurements</li>
              <li>First smile, steps, words</li>
              <li>Feeding and sleep schedules</li>
            </ul>
          </div>
          
          <div className="milestone-card">
            <FaClock className="milestone-icon" />
            <h3>Toddler Years</h3>
            <ul>
              <li>Development tracking</li>
              <li>Favorite activities</li>
              <li>Funny quotes and stories</li>
              <li>Artwork gallery</li>
            </ul>
          </div>
          
          <div className="milestone-card">
            <FaBook className="milestone-icon" />
            <h3>Digital Memory Book</h3>
            <ul>
              <li>Custom photo albums</li>
              <li>Milestone certificates</li>
              <li>Video compilations</li>
              <li>Printable yearbooks</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Download the App</h3>
            <p>Get our iOS app and create your account</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Set Up Profiles</h3>
            <p>Create profiles for each of your children</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Start Recording</h3>
            <p>Capture photos, videos, and milestones</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Share & Preserve</h3>
            <p>Share with family and create lasting memories</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Parents Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p>"Finally, a simple way to keep track of all my baby's milestones. The reminders are so helpful!"</p>
            <cite>- Sarah, mom of 2</cite>
          </div>
          <div className="testimonial">
            <p>"Love how easy it is to share updates with grandparents. The digital memory book feature is amazing!"</p>
            <cite>- Michael, dad of 1</cite>
          </div>
          <div className="testimonial">
            <p>"This app has helped me document precious moments I would have otherwise forgotten."</p>
            <cite>- Emma, mom of 3</cite>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Start Documenting Your Child's Journey Today</h2>
          <p>Join thousands of parents preserving their children's precious moments</p>
          <Link to="/register" className="cta-button">Create Your Account</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
