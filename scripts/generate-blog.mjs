/**
 * generate-blog.mjs
 * Generates static HTML for all blog posts so Googlebot can crawl them.
 * Run: node scripts/generate-blog.mjs
 * Wired into package.json as postbuild — runs after every Netlify deploy.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Load blog posts — we eval the file since it uses ES export syntax
const blogPostsRaw = readFileSync(join(ROOT, 'src/data/blogPosts.js'), 'utf8');
// Strip ES module export, wrap in IIFE, evaluate
const cleaned = blogPostsRaw
  .replace(/^export default blogPosts;?\s*$/m, '')
  .replace(/^const blogPosts = /m, 'const blogPosts = ');

let blogPosts;
try {
  // Use Function constructor to evaluate — safe here (our own data file)
  const fn = new Function(`${cleaned}; return blogPosts;`);
  blogPosts = fn();
} catch (e) {
  console.error('Failed to parse blogPosts.js:', e.message);
  process.exit(1);
}

const SITE_URL = 'https://nestofmemories.com';
const CSS_PATH = '/blog/static-blog.css';

function markdownToHtml(text) {
  if (!text) return '';
  return text
    // H2
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Paragraphs — split by double newline
    .split(/\n\n+/)
    .map(para => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h2>') || trimmed.startsWith('<h3>')) return trimmed;
      // Preserve single newlines within a paragraph as <br>
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

function generatePostHtml(post) {
  const contentHtml = markdownToHtml(post.content);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.metaTitle || post.title)}</title>
  <meta name="description" content="${escapeHtml(post.metaDescription)}">
  <meta name="keywords" content="${escapeHtml(post.keywords || '')}">
  <link rel="canonical" href="${SITE_URL}/blog/${post.slug}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(post.metaDescription)}">
  <meta property="og:url" content="${SITE_URL}/blog/${post.slug}">
  <meta property="og:site_name" content="Nest of Memories">

  <!-- Schema.org Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeJson(post.title)}",
    "description": "${escapeJson(post.metaDescription)}",
    "datePublished": "${post.date}",
    "author": {"@type": "Organization", "name": "Nest of Memories"},
    "publisher": {"@type": "Organization", "name": "Nest of Memories", "url": "${SITE_URL}"},
    "url": "${SITE_URL}/blog/${post.slug}"
  }
  </script>

  <link rel="stylesheet" href="${CSS_PATH}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <a href="/" class="logo">Nest of Memories</a>
    <nav>
      <a href="/blog">Blog</a>
      <a href="/#download" class="cta-btn">Download Free</a>
    </nav>
  </header>

  <article class="blog-post">
    <div class="post-meta">
      <span class="category">${escapeHtml(post.category || 'Parenting')}</span>
      <span class="date">${formatDate(post.date)}</span>
      <span class="read-time">${escapeHtml(post.readTime || '7 min read')}</span>
    </div>

    <h1>${escapeHtml(post.title)}</h1>

    <p class="excerpt"><em>${escapeHtml(post.excerpt)}</em></p>

    <div class="post-content">
      ${contentHtml}
    </div>

    <div class="post-cta">
      <p>Start capturing your child's voice today — free.</p>
      <a href="https://apps.apple.com/app/nest-of-memories" class="cta-btn">Download Nest of Memories</a>
    </div>
  </article>

  <footer class="site-footer">
    <p>&copy; ${new Date().getFullYear()} Nest of Memories &mdash; <a href="/">nestofmemories.com</a></p>
    <p><a href="/blog">More articles</a> &middot; <a href="/privacy">Privacy</a></p>
  </footer>
</body>
</html>`;
}

function generateListingHtml(posts) {
  const items = posts.map(post => `
    <article class="post-card">
      <div class="post-card-meta">
        <span class="category">${escapeHtml(post.category || 'Parenting')}</span>
        <span class="date">${formatDate(post.date)}</span>
      </div>
      <h2><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h2>
      <p>${escapeHtml(post.excerpt)}</p>
      <a href="/blog/${post.slug}" class="read-more">Read article &rarr;</a>
    </article>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Nest of Memories | Parenting & Family Memory Tips</title>
  <meta name="description" content="Tips and advice for parents on capturing family memories, preserving children's voices, and creating lasting memory books.">
  <link rel="canonical" href="${SITE_URL}/blog">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Blog — Nest of Memories">
  <meta property="og:url" content="${SITE_URL}/blog">
  <link rel="stylesheet" href="${CSS_PATH}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <a href="/" class="logo">Nest of Memories</a>
    <nav>
      <a href="/blog" class="active">Blog</a>
      <a href="/#download" class="cta-btn">Download Free</a>
    </nav>
  </header>

  <main class="blog-listing">
    <h1>The Nest of Memories Blog</h1>
    <p class="listing-intro">Advice for parents on capturing family memories before they slip away.</p>
    <div class="posts-grid">
      ${items}
    </div>
  </main>

  <footer class="site-footer">
    <p>&copy; ${new Date().getFullYear()} Nest of Memories &mdash; <a href="/">nestofmemories.com</a></p>
  </footer>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJson(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Generate all blog post pages
let generated = 0;
for (const post of blogPosts) {
  if (!post.slug) continue;
  // Write to build/blog (Netlify publish dir) AND public/blog (local dev)
  for (const base of ['build', 'public']) {
    const dir = join(ROOT, `${base}/blog`, post.slug);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const html = generatePostHtml(post);
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
  }
  console.log(`  ✓ /blog/${post.slug}`);
  generated++;
}

// Generate listing page in both public/ and build/
for (const base of ['build', 'public']) {
  const listDir = join(ROOT, `${base}/blog`);
  if (!existsSync(listDir)) mkdirSync(listDir, { recursive: true });
  writeFileSync(join(listDir, 'index.html'), generateListingHtml(blogPosts), 'utf8');
}
console.log(`  ✓ /blog (listing, ${blogPosts.length} posts)`);
console.log(`\nGenerated ${generated} blog pages + listing page.`);
