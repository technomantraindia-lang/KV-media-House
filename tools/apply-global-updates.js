/**
 * Applies global site updates across all HTML files.
 * Run: node tools/apply-global-updates.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TAGLINE = 'Creative Digital Media & Brand Solutions That Get Seen.';
const EMAIL = 'info@kvmediahouse.com';
const INSTAGRAM = 'https://www.instagram.com/kv_mediahouse';
const FACEBOOK = ''; // placeholder — add official URL when available

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'Tank - Creative Portfolio Showcase HTML Website Template') continue;
      walk(full, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function depthFromRoot(filePath) {
  const rel = path.relative(ROOT, filePath);
  const parts = rel.split(path.sep);
  return parts.length - 1;
}

function prefixForDepth(depth) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

function updateNavBlock(html, prefix) {
  // Remove blog from desktop nav
  html = html.replace(/\s*<li><a href="[^"]*blog\.html" class="nav-link[^"]*">Blog<\/a><\/li>\s*/g, '\n        ');
  // Remove founder from desktop nav (keep page, simplify nav)
  html = html.replace(/\s*<li><a href="[^"]*founder\.html" class="nav-link[^"]*">Founder<\/a><\/li>\s*/g, '\n        ');
  // Update Contact label
  html = html.replace(/(<a href="[^"]*contact\.html" class="nav-link[^"]*">)Contact(<\/a>)/g, '$1Inquiry$2');

  // Mobile nav
  html = html.replace(/\s*<a href="[^"]*blog\.html">Blog<\/a>\s*/g, '\n    ');
  html = html.replace(/\s*<a href="[^"]*founder\.html">Founder<\/a>\s*/g, '\n    ');
  html = html.replace(/(<a href="[^"]*contact\.html">)Contact(<\/a>)/g, '$1Inquiry$2');

  return html;
}

function updateMobileFooter(html) {
  const socialBlock = `<div class="mobile-footer wrap" style="padding-left:0;padding-right:0;">
    <a href="mailto:${EMAIL}">${EMAIL}</a>
    <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram ↗</a>
    ${FACEBOOK ? `<a href="${FACEBOOK}" target="_blank" rel="noopener">Facebook ↗</a>` : `<span class="social-placeholder">Facebook — coming soon</span>`}
  </div>`;
  html = html.replace(/<div class="mobile-footer wrap"[\s\S]*?<\/div>\s*(?=<\/div>\s*\n\s*<main|<\/div>\s*\n\s*<main)/, socialBlock + '\n');
  return html;
}

function updateFooter(html, prefix) {
  html = html.replace(/We Create\. We Connect\. We Make Brands Seen\./g, TAGLINE);

  // Footer navigate — remove blog and founder
  html = html.replace(/\s*<a href="[^"]*blog\.html">Blog<\/a>\s*/g, '\n        ');
  html = html.replace(/\s*<a href="[^"]*founder\.html">Founder<\/a>\s*/g, '\n        ');
  html = html.replace(/(<a href="[^"]*contact\.html">)Contact(<\/a>)/g, '$1Inquiry$2');

  // Remove phone from footer contact
  html = html.replace(/\s*<a href="tel:[^"]*">[^<]*<\/a>\s*/g, '\n        ');

  // Update email
  html = html.replace(/krishabenvadariya29@gmail\.com/g, EMAIL);
  html = html.replace(/mailto:krishabenvadariya29@gmail\.com/g, `mailto:${EMAIL}`);

  // Update instagram links
  html = html.replace(/https:\/\/www\.instagram\.com\/kv_mediahouse[^"']*/g, INSTAGRAM);
  html = html.replace(/@kv_mediahouse ↗/g, 'Instagram ↗');

  // Add facebook to footer contact if not present
  const footContactPattern = /(<div class="foot-col">\s*<h5>Contact<\/h5>[\s\S]*?)(<span>Canada<\/span>)/;
  if (footContactPattern.test(html) && !html.includes('Facebook')) {
    html = html.replace(footContactPattern, (m, start, end) => {
      const fb = FACEBOOK
        ? `<a href="${FACEBOOK}" target="_blank" rel="noopener">Facebook ↗</a>\n        `
        : `<span class="social-placeholder">Facebook — coming soon</span>\n        `;
      return start + fb + end;
    });
  }

  return html;
}

function updateFonts(html) {
  const newFonts = `<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,600&display=swap" rel="stylesheet">`;
  html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant[\s\S]*?display=swap" rel="stylesheet">/, newFonts);
  return html;
}

function updateMetaTagline(html) {
  html = html.replace(/We Create\. We Connect\. We Make Brands Seen\./g, TAGLINE);
  return html;
}

function updateMarquee(html) {
  const oldMarquee = /CONTENT<\/span><span>CULTURE<\/span><span>STRATEGY<\/span><span>STORIES<\/span><span>SOCIAL<\/span><span>EVENTS<\/span><span>DIGITAL<\/span><span>CONNECTION<\/span><span>CONTENT<\/span><span>CULTURE<\/span><span>STRATEGY<\/span><span>STORIES<\/span><span>SOCIAL<\/span><span>EVENTS<\/span><span>DIGITAL<\/span><span>CONNECTION<\/span>/g;
  const newWords = 'DIGITAL STRATEGY</span><span>CREATIVE CONTENT</span><span>BRAND IDENTITY</span><span>VISUAL STORYTELLING</span><span>SOCIAL MEDIA</span><span>WEB DESIGN</span><span>MEDIA PRODUCTION</span><span>DIGITAL MARKETING</span><span>DIGITAL STRATEGY</span><span>CREATIVE CONTENT</span><span>BRAND IDENTITY</span><span>VISUAL STORYTELLING</span><span>SOCIAL MEDIA</span><span>WEB DESIGN</span><span>MEDIA PRODUCTION</span><span>DIGITAL MARKETING';
  html = html.replace(oldMarquee, newWords);
  return html;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const depth = depthFromRoot(filePath);
  const prefix = prefixForDepth(depth);
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');

  if (rel === 'blog.html' || rel.startsWith('blog/')) {
    // Redirect blog pages to home
    const redirect = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=${prefix}index.html"><title>Redirecting…</title><script>location.replace('${prefix}index.html');</script></head><body></body></html>`;
    fs.writeFileSync(filePath, redirect, 'utf8');
    return 'redirected';
  }

  html = updateFonts(html);
  html = updateMetaTagline(html);
  html = updateNavBlock(html, prefix);
  html = updateMobileFooter(html);
  html = updateFooter(html, prefix);
  html = updateMarquee(html);

  // Remove phone anywhere else
  html = html.replace(/\s*<div class="info-item"><span class="lbl">Phone<\/span><a href="tel:[^"]*">[^<]*<\/a><\/div>\s*/g, '\n          ');
  html = html.replace(/672-399-1436/g, '');
  html = html.replace(/tel:6723991436/g, '');

  fs.writeFileSync(filePath, html, 'utf8');
  return 'updated';
}

const files = walk(ROOT);
let counts = { updated: 0, redirected: 0 };
for (const f of files) {
  const result = processFile(f);
  counts[result === 'redirected' ? 'redirected' : 'updated']++;
  console.log(result, path.relative(ROOT, f));
}
console.log('\nDone:', counts);
