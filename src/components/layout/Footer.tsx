import { Link } from 'react-router-dom';
import { Github, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    browse: [
      { label: 'Popular', href: '/browse?sort=POPULARITY_DESC' },
      { label: 'Trending', href: '/browse?sort=TRENDING_DESC' },
      { label: 'Top Rated', href: '/browse?sort=SCORE_DESC' },
      { label: 'New Releases', href: '/browse?status=RELEASING&sort=START_DATE_DESC' },
    ],
    seasons: [
      { label: `Winter ${currentYear}`, href: `/browse?season=WINTER&year=${currentYear}` },
      { label: `Spring ${currentYear}`, href: `/browse?season=SPRING&year=${currentYear}` },
      { label: `Summer ${currentYear}`, href: `/browse?season=SUMMER&year=${currentYear}` },
      { label: `Fall ${currentYear}`, href: `/browse?season=FALL&year=${currentYear}` },
    ],
    community: [
      { label: 'Contributing', href: '/contributing' },
      { label: 'FAQ', href: '/faq' },
      { label: 'GitHub', href: 'https://github.com/notsopreety/OsOtaku', external: true },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'DMCA', href: '/dmca' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.webp" alt="OsOtaku" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-bold gradient-text">OsOtaku</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Open-source AniList wrapper for discovering and tracking anime. 
              We encourage users to support official streaming platforms.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/notsopreety/osotaku"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold mb-4">Browse</h3>
            <ul className="space-y-2">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seasons */}
          <div>
            <h3 className="font-semibold mb-4">Seasons</h3>
            <ul className="space-y-2">
              {footerLinks.seasons.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> OsOtaku is an open-source AniList wrapper and does not host, 
            store, or distribute any video content. We encourage users to support anime creators by 
            watching through official licensed platforms. Community-contributed links point to third-party 
            services outside our control.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} OsOtaku. Open-source under MIT License.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>by the community. Powered by</span>
            <a
              href="https://anilist.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              AniList
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
