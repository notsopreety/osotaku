#!/usr/bin/env node

/**
 * OsOtaku Sitemap Generator (SEO-aware)
 * Uses episode.updatedOn and anime.updatedOn intelligently
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CONFIG ================= */

const SITE_URL = process.env.SITE_URL || 'https://oso.duckydex.site';

const DATA_DIR = path.join(__dirname, '../public/data');

const DIST = path.join(__dirname, '../dist');
const DIST_SITEMAP = path.join(DIST, 'sitemap');
const DIST_ANIME = path.join(DIST_SITEMAP, 'anime');

const PUBLIC = path.join(__dirname, '../public');
const PUBLIC_SITEMAP = path.join(PUBLIC, 'sitemap');
const PUBLIC_ANIME = path.join(PUBLIC_SITEMAP, 'anime');

/* ================= STATIC ================= */

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/browse', priority: '0.9', changefreq: 'daily' },
  { path: '/search', priority: '0.8', changefreq: 'weekly' },
  { path: '/login', priority: '0.5', changefreq: 'monthly' },
  { path: '/contributing', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/dmca', priority: '0.3', changefreq: 'yearly' }
];

/* ================= HELPERS ================= */

const ensure = d => !fs.existsSync(d) && fs.mkdirSync(d, { recursive: true });

const today = () => new Date().toISOString().split('T')[0];

const writeBoth = (rel, data) => {
  fs.writeFileSync(path.join(DIST, rel), data);
  fs.writeFileSync(path.join(PUBLIC, rel), data);
};

const sitemapWrap = entries => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

const indexWrap = entries => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;

const url = (loc, priority, freq, lastmod) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const sitemapEntry = loc => `  <sitemap>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today()}</lastmod>
  </sitemap>`;

/* ================= DATA ================= */

function loadAnime(animeId) {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, `${animeId}.json`), 'utf-8')
    );
  } catch {
    return null;
  }
}

function getAnimeIds() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function getLatestEpisodeDate(episodes = []) {
  return episodes
    .map(e => e.updatedOn)
    .filter(Boolean)
    .sort()
    .pop();
}

/* ================= GENERATORS ================= */

function generateStatic() {
  const entries = STATIC_PAGES.map(p =>
    url(p.path, p.priority, p.changefreq, today())
  );
  writeBoth('sitemap.xml', sitemapWrap(entries));
}

function generateAnime(animeIds) {
  const entries = [];

  for (const id of animeIds) {
    const anime = loadAnime(id);
    if (!anime) continue;

    const lastEpisodeDate = getLatestEpisodeDate(anime.episodes);
    const lastmod = lastEpisodeDate || anime.updatedOn;

    entries.push(
      url(`/anime/${id}`, '0.8', 'weekly', lastmod)
    );
  }

  writeBoth('sitemap/anime.xml', sitemapWrap(entries));
}

function generateEpisodeSitemaps(animeIds) {
  const indexEntries = [];

  for (const id of animeIds) {
    const anime = loadAnime(id);
    if (!anime?.episodes?.length) continue;

    const urls = anime.episodes.map(ep => {
      const epNum = String(ep.epId || '').replace(/^ep-/, '');
      if (!epNum) return null;

      return url(
        `/watch/${id}/${epNum}`,
        '0.7',
        'weekly',
        ep.updatedOn || anime.updatedOn
      );
    }).filter(Boolean);

    if (!urls.length) continue;

    writeBoth(`sitemap/anime/${id}.xml`, sitemapWrap(urls));
    indexEntries.push(sitemapEntry(`/sitemap/anime/${id}.xml`));
  }

  writeBoth('sitemap/anime-index.xml', indexWrap(indexEntries));
}

function generateRootIndex() {
  writeBoth(
    'sitemap-index.xml',
    indexWrap([
      sitemapEntry('/sitemap.xml'),
      sitemapEntry('/sitemap/anime.xml'),
      sitemapEntry('/sitemap/anime-index.xml')
    ])
  );
}

/* ================= MAIN ================= */

try {
  [DIST, DIST_SITEMAP, DIST_ANIME, PUBLIC, PUBLIC_SITEMAP, PUBLIC_ANIME]
    .forEach(ensure);

  const animeIds = getAnimeIds();

  generateStatic();
  generateAnime(animeIds);
  generateEpisodeSitemaps(animeIds);
  generateRootIndex();

  console.log('✓ SEO-aware sitemaps generated successfully');
} catch (err) {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
}