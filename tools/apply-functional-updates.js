/**
 * Applies ONLY functional/content updates — no design/CSS/font changes.
 * Run: node tools/apply-functional-updates.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TAGLINE = 'Creative Digital Media & Brand Solutions That Get Seen.';
const EMAIL = 'info@kvmediahouse.com';
const INSTAGRAM = 'https://www.instagram.com/kv_mediahouse';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.includes('Tank')) continue;
      walk(full, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function prefixFromFile(filePath) {
  const depth = path.relative(ROOT, filePath).split(path.sep).length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function processFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const prefix = prefixFromFile(filePath);

  if (rel === 'blog.html' || rel.startsWith('blog/')) {
    const redirect = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=${prefix}index.html"><title>Redirecting…</title><script>location.replace('${prefix}index.html');</script></head><body></body></html>`;
    fs.writeFileSync(filePath, redirect, 'utf8');
    return 'redirected';
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Remove blog from navigation
  html = html.replace(/\s*<li><a href="[^"]*blog\.html" class="nav-link[^"]*">Blog<\/a><\/li>\s*/g, '\n        ');
  html = html.replace(/\s*<a href="[^"]*blog\.html">Blog<\/a>\s*/g, '\n        ');

  // Remove phone everywhere
  html = html.replace(/\s*<div class="info-item"><span class="lbl">Phone<\/span><a href="tel:[^"]*">[^<]*<\/a><\/div>\s*/g, '\n          ');
  html = html.replace(/\s*<a href="tel:[^"]*">[^<]*<\/a>\s*/g, '\n        ');
  html = html.replace(/\s*<div class="field"><label for="fPhone">Phone<\/label>[\s\S]*?<\/div>\s*/g, '\n          ');

  // Update email
  html = html.replace(/krishabenvadariya29@gmail\.com/g, EMAIL);
  html = html.replace(/mailto:krishabenvadariya29@gmail\.com/g, `mailto:${EMAIL}`);

  // Update Instagram links
  html = html.replace(/https:\/\/www\.instagram\.com\/kv_mediahouse[^"']*/g, INSTAGRAM);

  // Update tagline in footer/meta/titles where old tagline appears
  html = html.replace(/We Create\. We Connect\. We Make Brands Seen\./g, TAGLINE);

  // Marquee: replace culture/stories/strategy with digital media terms
  html = html.replace(
    />CONTENT<\/span><span>CULTURE<\/span><span>STRATEGY<\/span><span>STORIES<\/span><span>SOCIAL<\/span><span>EVENTS<\/span><span>DIGITAL<\/span><span>CONNECTION<\/span><span>CONTENT<\/span><span>CULTURE<\/span><span>STRATEGY<\/span><span>STORIES<\/span><span>SOCIAL<\/span><span>EVENTS<\/span><span>DIGITAL<\/span><span>CONNECTION<\/span>/g,
    '>DIGITAL STRATEGY</span><span>CREATIVE CONTENT</span><span>BRAND IDENTITY</span><span>VISUAL STORYTELLING</span><span>SOCIAL MEDIA</span><span>WEB DESIGN</span><span>MEDIA PRODUCTION</span><span>DIGITAL MARKETING</span><span>DIGITAL STRATEGY</span><span>CREATIVE CONTENT</span><span>BRAND IDENTITY</span><span>VISUAL STORYTELLING</span><span>SOCIAL MEDIA</span><span>WEB DESIGN</span><span>MEDIA PRODUCTION</span><span>DIGITAL MARKETING</span>'
  );

  // Normalize footer contact column
  html = html.replace(
    /<div class="foot-col">\s*<h5>Contact<\/h5>[\s\S]*?<\/div>\s*(?=<\/div>\s*<div class="footer-bottom">)/,
    `<div class="foot-col">
        <h5>Contact</h5>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
        <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram ↗</a>
        <span>Facebook — coming soon</span>
        <span>Canada</span>
      </div>
    `
  );

  // Add Facebook to contact info block
  if (html.includes('class="info-block"') && !html.includes('lbl">Facebook')) {
    html = html.replace(
      /(<div class="info-item"><span class="lbl">Instagram<\/span>[\s\S]*?<\/a><\/div>)/,
      `$1\n          <div class="info-item"><span class="lbl">Facebook</span><span class="val">Coming soon</span></div>`
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return 'updated';
}

const files = walk(ROOT);
const counts = { updated: 0, redirected: 0 };
for (const f of files) {
  const r = processFile(f);
  counts[r]++;
  console.log(r, path.relative(ROOT, f));
}
console.log('\nDone:', counts);
