import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMicrophone, 
  FaCloud, 
  FaShare, 
  FaBook,
  FaLock,
  FaDownload,
  FaApple,
  FaAndroid,
  FaArrowRight,
  FaClock,
  FaHeart
} from 'react-icons/fa';

const heroImageUrl = "https://www.dropbox.com/scl/fi/t57gtd19opzn3x0d17v4x/momento-madre-nino-acurrucados-juntos-leyendo-libro-dia-madre_697880-516.jpg.avif?rlkey=mm3s6amexid3z51mxce5sctqa&st=eqjyzxqp&dl=1";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Preserve Your Family's Voice Forever</h1>
            <p className="hero-subtitle">
              Turn precious conversations and stories into beautifully transcribed memories that last a lifetime
            </p>
            <div className="hero-cta">
              <Link to="/register" className="cta-button">Start Recording Memories</Link>
              <div className="app-stores">
                <button className="store-button">
                  <FaApple /> iOS App
                </button>
                <button className="store-button">
                  <FaAndroid /> Android App
                </button>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImageUrl} alt="Family sharing stories together" />
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-overview">
        <div className="features-grid">
          <div className="feature-item">
            <FaMicrophone className="feature-icon" />
            <h3>Easy Voice Recording</h3>
            <p>Record conversations and stories with just one tap</p>
          </div>
          <div className="feature-item">
            <FaCloud className="feature-icon" />
            <h3>Instant Transcription</h3>
            <p>AI-powered transcription converts voice to text in minutes</p>
          </div>
          <div className="feature-item">
            <FaShare className="feature-icon" />
            <h3>Share with Family</h3>
            <p>Share transcribed memories with loved ones securely</p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features">
        <h2>Capture Every Precious Memory</h2>
        <div className="feature-blocks">
          <div className="feature-block">
            <div className="feature-content">
              <h3>Voice to Text Magic</h3>
              <p>Our advanced AI technology transforms your voice recordings into beautifully formatted text. Perfect for capturing family stories, baby's first words, or important life moments.</p>
              <Link to="/features" className="learn-more">
                Learn more <FaArrowRight />
              </Link>
            </div>
            <div className="feature-image">
              <img src={heroImageUrl} alt="Voice recording interface" />
            </div>
          </div>

          <div className="feature-block reverse">
            <div className="feature-content">
              <h3>Digital Memory Book</h3>
              <p>Create beautiful digital books from your transcribed memories. Add photos, organize by date or theme, and preserve your family's legacy for generations to come.</p>
              <Link to="/features" className="learn-more">
                Learn more <FaArrowRight />
              </Link>
            </div>
            <div className="feature-image">
              <img src={heroImageUrl} alt="Digital memory book interface" />
            </div>
          </div>

          <div className="feature-block">
            <div className="feature-content">
              <h3>Secure Family Sharing</h3>
              <p>Share your recorded memories with family members through secure invitations. Control who can access what, and collaborate on family stories together.</p>
              <Link to="/features" className="learn-more">
                Learn more <FaArrowRight />
              </Link>
            </div>
            <div className="feature-image">
              <img src={heroImageUrl} alt="Family sharing interface" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>Record Your Legacy in 4 Easy Steps</h2>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-icon">
              <FaMicrophone />
            </div>
            <h3>Record</h3>
            <p>Start recording with a single tap. Capture stories, conversations, or precious moments.</p>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaClock />
            </div>
            <h3>Transcribe</h3>
            <p>Our AI converts your recording to text in minutes with high accuracy.</p>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaHeart />
            </div>
            <h3>Enhance</h3>
            <p>Add photos, edit transcripts, and organize your memories.</p>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaShare />
            </div>
            <h3>Share</h3>
            <p>Share your memories with family or export as a beautiful book.</p>
          </div>
        </div>
      </section>

      {/* Finished Section */}
      <section className="finished-section">
        <div className="finished-content">
          <div className="finished-text">
            <h2>Ready to Print?</h2>
            <p>Transform your digital memories into a beautiful physical book</p>
            <ul className="feature-list">
              <li>
                <FaBook className="list-icon" />
                <span>Hardcover & softcover options</span>
              </li>
              <li>
                <FaDownload className="list-icon" />
                <span>Choose from multiple sizes</span>
              </li>
              <li>
                <FaLock className="list-icon" />
                <span>Premium paper quality</span>
              </li>
              <li>
                <FaClock className="list-icon" />
                <span>Fast production & delivery</span>
              </li>
            </ul>
            <div className="finished-buttons">
              <Link to="/get-started" className="get-started">Get Started</Link>
              <Link to="/pricing" className="info-pricing">Info & Pricing</Link>
            </div>
          </div>
          <div className="finished-image">
            <img src={heroImageUrl} alt="Printed memory book samples" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"This app has helped me preserve my grandmother's stories for future generations. The voice-to-text feature is amazing!"</p>
            <div className="testimonial-author">
              <span>Sarah M.</span>
              <span>Using since 2023</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"I love how easy it is to record and transcribe our family conversations. The printed books are beautiful keepsakes."</p>
            <div className="testimonial-author">
              <span>Michael P.</span>
              <span>Using since 2024</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"Perfect for capturing my children's voices as they grow. The transcription quality is excellent!"</p>
            <div className="testimonial-author">
              <span>Emma L.</span>
              <span>Using since 2023</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collage Section */}
      <section className="collage-section">
        <div className="collage-content">
          <div className="collage-text">
            <h2>Create Beautiful Memory Books</h2>
            <p>Transform your voice recordings and transcripts into timeless keepsakes</p>
          </div>
          <div className="collage-grid">
            <img 
              src="https://www.dropbox.com/scl/fi/e183y4x5kzelu13doaolo/collage.png?rlkey=pqmx7k314kezuduqb5zc99js5&dl=1" 
              alt="Memory book collage" 
              className="collage-image"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <h2>Start Preserving Your Memories Today</h2>
        <p>Join thousands of families capturing their precious moments in voice and text</p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button">Start Your Free Trial</Link>
          <div className="app-stores">
            <button className="store-button">
              <FaApple /> iOS App
            </button>
            <button className="store-button">
              <FaAndroid /> Android App
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
