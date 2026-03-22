import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaClock, FaTag, FaArrowRight } from 'react-icons/fa';
import blogPosts from '../data/blogPosts';
import './Blog.css';

const Blog = () => {
  return (
    <div className="blog-page">
      <Helmet>
        <title>Blog | Nest of Memories</title>
        <meta name="description" content="Tips, guides, and inspiration for preserving your family's most precious memories. Record your child's voice, beat childhood amnesia, and create lasting memory books." />
      </Helmet>
      <section className="blog-hero">
        <h1>Stories Worth Keeping</h1>
        <p>Tips, guides, and inspiration for preserving your family's most precious memories</p>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post.slug} className="blog-card">
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-category">
                    <FaTag /> {post.category}
                  </span>
                  <span className="blog-read-time">
                    <FaClock /> {post.readTime}
                  </span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="blog-read-more">
                  Read article <FaArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="blog-cta">
        <h2>Ready to Start Preserving Memories?</h2>
        <p>Download Nest of Memories — free on iOS and Android</p>
        <Link to="/register" className="cta-button">Get Started Free</Link>
      </section>
    </div>
  );
};

export default Blog;
