import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCamera, 
  FaCloud, 
  FaShare, 
  FaMobile, 
  FaBell, 
  FaBabyCarriage,
  FaHeart,
  FaClock,
  FaBook,
  FaApple,
  FaAndroid,
  FaArrowRight
} from 'react-icons/fa';

const heroImageUrl = "https://www.dropbox.com/scl/fi/3j35ymlx1w2q46fgfdetb/DALL-E-2024-12-24-02.37.10-A-realistic-scene-of-a-mother-sitting-on-the-floor-with-her-baby-reading-a-journal-style-baby-milestone-book-together.-The-book-is-open-showing-page.webp?rlkey=f5tbo43ed2k16smpmk2aycwvr&dl=1";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Every Milestone Is Worth Celebrating</h1>
            <p className="hero-subtitle">
              The smart way to document your child's journey from pregnancy to age 5
            </p>
            <div className="hero-cta">
              <Link to="/register" className="cta-button">Start Your Journey</Link>
              <div className="app-stores">
                <button className="store-button">
                  <FaApple /> App Store
                </button>
                <button className="store-button">
                  <FaAndroid /> Play Store
                </button>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImageUrl} alt="Mother reading baby milestone book with her child" />
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-overview">
        <div className="features-grid">
          <div className="feature-item">
            <FaCamera className="feature-icon" />
            <h3>Capture moments instantly</h3>
            <p>Record precious moments as they happen with our easy-to-use mobile app</p>
          </div>
          <div className="feature-item">
            <FaCloud className="feature-icon" />
            <h3>Secure cloud storage</h3>
            <p>Your memories are safely stored and backed up in the cloud</p>
          </div>
          <div className="feature-item">
            <FaShare className="feature-icon" />
            <h3>Share with family</h3>
            <p>Share special moments with loved ones through secure sharing</p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features">
        <h2>Your Child's Story, Beautifully Documented</h2>
        <div className="feature-blocks">
          <div className="feature-block">
            <div className="feature-content">
              <h3>Digital Memory Book</h3>
              <p>Create beautiful digital memory books that capture every precious moment of your child's growth. Add photos, videos, and notes to create lasting memories.</p>
              <Link to="/features" className="learn-more">
                Learn more <FaArrowRight />
              </Link>
            </div>
            <div className="feature-image">
              <img src={heroImageUrl} alt="Digital Memory Book" />
            </div>
          </div>

          <div className="feature-block reverse">
            <div className="feature-content">
              <h3>Growth Tracking</h3>
              <p>Monitor your child's development with easy-to-use charts and milestone tracking. Compare with WHO standards and get personalized insights.</p>
              <Link to="/features" className="learn-more">
                Learn more <FaArrowRight />
              </Link>
            </div>
            <div className="feature-image">
              <img src={heroImageUrl} alt="Growth Tracking" />
            </div>
          </div>

          <div className="feature-block">
            <div className="feature-content">
              <h3>Family Sharing</h3>
              <p>Share your child's precious moments with family members and close friends through secure invitations. Control who sees what with privacy settings.</p>
              <Link to="/features" className="learn-more">
                Learn more <FaArrowRight />
              </Link>
            </div>
            <div className="feature-image">
              <img src={heroImageUrl} alt="Family Sharing" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Parents Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"This app has made documenting my baby's milestones so much easier. I love how I can share moments with family!"</p>
            <div className="testimonial-author">
              <span>Sarah M.</span>
              <span>Mother of 2</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"The growth tracking feature helps me stay on top of my child's development. It's like having a digital baby book!"</p>
            <div className="testimonial-author">
              <span>Michael P.</span>
              <span>Father of 1</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"I love how easy it is to capture and organize memories. The timeline feature is brilliant!"</p>
            <div className="testimonial-author">
              <span>Emma L.</span>
              <span>Mother of 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bottom-cta">
        <h2>Start Documenting Your Journey Today</h2>
        <p>Join thousands of parents capturing their children's precious moments</p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button">Start Your Free Trial</Link>
          <div className="app-stores">
            <button className="store-button">
              <FaApple /> App Store
            </button>
            <button className="store-button">
              <FaAndroid /> Play Store
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
