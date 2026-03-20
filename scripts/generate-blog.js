/**
 * generate-blog.js
 * Converts blogPosts.js into static HTML files for SEO.
 * Output: public/blog/{slug}/index.html + public/blog/index.html
 * Run: node scripts/generate-blog.js
 */

const fs = require('fs');
const path = require('path');

// Load blog posts — strip ES module syntax so we can eval in CJS
const vm = require('vm');
let src = fs.readFileSync(path.join(__dirname, '../src/data/blogPosts.js'), 'utf8');
src = src
  .replace(/^\/\/.*$/gm, '')               // strip comments
  .replace(/export\s+default\s+\w+\s*;?/g, '') // strip export default
  .replace(/\bconst\s+blogPosts\s*=/g, 'blogPosts =') // replace const with plain assignment
  .trim();
src = 'var blogPosts;\n' + src;
const ctx = {};
vm.runInNewContext(src, ctx);
const blogPosts = ctx.blogPosts;

const BASE_URL = 'https://nestofmemories.com';
const OUT_DIR = path.join(__dirname, '../public/blog');

// ─── Markdown-like renderer ────────────────────────────────────────────────
function renderContent(content) {
  const lines = content.split('\n');
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      const text = inline(line.slice(3));
      html += `<h2>${text}</h2>\n`;
    } else if (line.startsWith('### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      const text = inline(line.slice(4));
      html += `<h3>${text}</h3>\n`;
    } else if (/^[-*] /.test(line)) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>\n`;
    } else if (line.trim() === '') {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += '\n';
    } else {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<p>${inline(line)}</p>\n`;
    }
  }
  if (inList) html += '</ul>\n';
  return html;
}

function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Post page template ────────────────────────────────────────────────────
function postHtml(post) {
  const content = renderContent(post.content || '');
  const url = `${BASE_URL}/blog/${post.slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(post.metaTitle)}</title>
  <meta name="description" content="${esc(post.metaDescription)}" />
  <meta name="keywords" content="${esc(post.keywords)}" />
  <link rel="canonical" href="${url}" />
  <!-- Open Graph -->
  <meta property="og:title" content="${esc(post.metaTitle)}" />
  <meta property="og:description" content="${esc(post.metaDescription)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Nest of Memories" />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(post.metaTitle)}" />
  <meta name="twitter:description" content="${esc(post.metaDescription)}" />
  <link rel="stylesheet" href="/blog/static-blog.css" />
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-SMMRWEK7SR"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-SMMRWEK7SR');
  </script>
</head>
<body>
  <header class="site-header">
    <a href="${BASE_URL}" class="logo">🪺 Nest of Memories</a>
    <a href="${BASE_URL}/blog" class="nav-link">← All Articles</a>
  </header>

  <main class="article-container">
    <div class="article-meta">
      <span class="category">${esc(post.category)}</span>
      <span class="sep">·</span>
      <span class="date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      <span class="sep">·</span>
      <span class="read-time">${esc(post.readTime)}</span>
    </div>

    <h1>${esc(post.title)}</h1>

    <p class="excerpt"><em>${esc(post.excerpt)}</em></p>

    <div class="article-body">
      ${content}
    </div>

    <div class="cta-box">
      <h3>Preserve your family's memories before they fade</h3>
      <p>Nest of Memories lets you record your child's voice, transcribe the stories, and print a real memory book they'll treasure forever.</p>
      <div class="cta-buttons">
        <a href="https://apps.apple.com/app/nest-of-memories/id6740286198" class="cta-btn cta-apple" onclick="gtag('event','click',{event_category:'cta',event_label:'app_store',page_slug:'${post.slug}'})">📱 Download on App Store</a>
        <a href="https://play.google.com/store/apps/details?id=com.nestofmemories.app" class="cta-btn cta-google" onclick="gtag('event','click',{event_category:'cta',event_label:'google_play',page_slug:'${post.slug}'})">🤖 Get on Google Play</a>
      </div>
      <a href="${BASE_URL}" class="cta-link">Learn more at nestofmemories.com →</a>
    </div>
  </main>

  <footer class="site-footer">
    <p>© ${new Date().getFullYear()} <a href="${BASE_URL}">Nest of Memories</a> · Preserve what matters most.</p>
  </footer>
</body>
</html>`;
}

// ─── Blog listing page ─────────────────────────────────────────────────────
function listingHtml(posts) {
  const items = posts.map(p => `
    <article class="post-card">
      <div class="post-meta">
        <span class="category">${esc(p.category)}</span>
        <span class="sep">·</span>
        <span class="date">${new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span class="sep">·</span>
        <span class="read-time">${esc(p.readTime)}</span>
      </div>
      <h2><a href="/blog/${p.slug}">${esc(p.title)}</a></h2>
      <p class="excerpt">${esc(p.excerpt)}</p>
      <a href="/blog/${p.slug}" class="read-more">Read article →</a>
    </article>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog — Nest of Memories</title>
  <meta name="description" content="Practical guides for preserving your family's voice, memories, and stories before childhood amnesia takes them." />
  <link rel="canonical" href="${BASE_URL}/blog" />
  <meta property="og:title" content="Blog — Nest of Memories" />
  <meta property="og:description" content="Practical guides for preserving your family's voice, memories, and stories." />
  <meta property="og:url" content="${BASE_URL}/blog" />
  <link rel="stylesheet" href="/blog/static-blog.css" />
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-SMMRWEK7SR"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-SMMRWEK7SR');
  </script>
</head>
<body>
  <header class="site-header">
    <a href="${BASE_URL}" class="logo">🪺 Nest of Memories</a>
  </header>

  <main class="listing-container">
    <div class="listing-header">
      <h1>The Memory Blog</h1>
      <p>Practical ideas for capturing your child's voice and stories before they're gone.</p>
    </div>
    <div class="post-list">
      ${items}
    </div>
  </main>

  <footer class="site-footer">
    <p>© ${new Date().getFullYear()} <a href="${BASE_URL}">Nest of Memories</a> · Preserve what matters most.</p>
  </footer>
</body>
</html>`;
}

// ─── Generate files ────────────────────────────────────────────────────────
if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
  console.error('❌ Could not load blogPosts — check src/data/blogPosts.js');
  process.exit(1);
}

let count = 0;
for (const post of blogPosts) {
  const dir = path.join(OUT_DIR, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), postHtml(post), 'utf8');
  console.log(`  ✅ /blog/${post.slug}`);
  count++;
}

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), listingHtml(blogPosts), 'utf8');
console.log(`  ✅ /blog (listing)`);

console.log(`\n🎉 Generated ${count} posts + listing page → public/blog/`);
