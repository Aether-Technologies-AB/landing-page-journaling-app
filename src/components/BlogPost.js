import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { FaClock, FaTag, FaArrowLeft, FaApple, FaAndroid } from 'react-icons/fa';
import blogPosts from '../data/blogPosts';
import './Blog.css';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Simple markdown-like rendering for ## headers, **bold**, *italic*, and lists
  const renderContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // H2 headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="blog-h2">{line.replace('## ', '')}</h2>
        );
        i++;
        continue;
      }

      // H3 headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="blog-h3">{line.replace('### ', '')}</h3>
        );
        i++;
        continue;
      }

      // List items
      if (line.startsWith('- ')) {
        const listItems = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(
            <li key={i}>{formatInlineText(lines[i].replace('- ', ''))}</li>
          );
          i++;
        }
        elements.push(<ul key={`list-${i}`} className="blog-list">{listItems}</ul>);
        continue;
      }

      // Numbered list items
      if (/^\d+\.\s/.test(line)) {
        const listItems = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(
            <li key={i}>{formatInlineText(lines[i].replace(/^\d+\.\s/, ''))}</li>
          );
          i++;
        }
        elements.push(<ol key={`olist-${i}`} className="blog-list">{listItems}</ol>);
        continue;
      }

      // Empty lines (paragraph breaks)
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Regular paragraphs
      elements.push(
        <p key={i} className="blog-paragraph">{formatInlineText(line)}</p>
      );
      i++;
    }

    return elements;
  };

  // Handle **bold** and *italic* inline formatting
  const formatInlineText = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Italic
      const italicMatch = remaining.match(/\*(.+?)\*/);

      const match = boldMatch && italicMatch
        ? (boldMatch.index <= italicMatch.index ? boldMatch : italicMatch)
        : boldMatch || italicMatch;

      if (!match) {
        parts.push(remaining);
        break;
      }

      // Text before the match
      if (match.index > 0) {
        parts.push(remaining.substring(0, match.index));
      }

      if (match[0].startsWith('**')) {
        parts.push(<strong key={key++}>{match[1]}</strong>);
      } else {
        parts.push(<em key={key++}>{match[1]}</em>);
      }

      remaining = remaining.substring(match.index + match[0].length);
    }

    return parts;
  };

  return (
    <div className="blog-post-page">
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://nestofmemories.com/blog/${post.slug}`} />
      </Helmet>
      <article className="blog-article">
        <Link to="/blog" className="blog-back-link">
          <FaArrowLeft /> All Articles
        </Link>

        <header className="blog-post-header">
          <div className="blog-post-meta">
            <span className="blog-category">
              <FaTag /> {post.category}
            </span>
            <span className="blog-read-time">
              <FaClock /> {post.readTime}
            </span>
            <span className="blog-date">{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</span>
          </div>
          <h1>{post.title}</h1>
        </header>

        <div className="blog-post-content">
          {renderContent(post.content)}
        </div>

        <div className="blog-post-cta">
          <h3>Start Preserving Your Family's Memories</h3>
          <p>Download Nest of Memories — record, transcribe, and create beautiful memory books.</p>
          <div className="blog-cta-buttons">
            <Link to="/register" className="cta-button">Start Free</Link>
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
      </article>

      {/* Related posts */}
      <section className="blog-related">
        <h2>More Articles</h2>
        <div className="blog-grid">
          {blogPosts
            .filter(p => p.slug !== post.slug)
            .slice(0, 2)
            .map((relatedPost) => (
              <Link to={`/blog/${relatedPost.slug}`} key={relatedPost.slug} className="blog-card">
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-category">
                      <FaTag /> {relatedPost.category}
                    </span>
                  </div>
                  <h2>{relatedPost.title}</h2>
                  <p>{relatedPost.excerpt}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
