import { SEO } from '@/components/seo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Github, Plus, Play, User, Shield, Code, AlertTriangle, ExternalLink } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      category: 'General',
      icon: Play,
      questions: [
        {
          q: 'What is OsOtaku?',
          a: 'OsOtaku is an open-source AniList wrapper - essentially an alternative interface for browsing and tracking anime using AniList\'s data. We provide a different UI experience while your lists sync directly with AniList. Community members can also contribute streaming source links through GitHub.'
        },
        {
          q: 'Is OsOtaku free to use?',
          a: 'Yes! OsOtaku is completely free and open-source. There are no premium features, subscriptions, ads, or hidden costs. The project is maintained by volunteers and community contributors.'
        },
        {
          q: 'Where does the anime data come from?',
          a: 'All anime metadata (titles, descriptions, ratings, images, etc.) comes directly from AniList\'s public API. We don\'t store or host this data ourselves - it\'s fetched in real-time. Streaming source links are contributed by the community through our GitHub repository.'
        },
        {
          q: 'Do I need an account to use OsOtaku?',
          a: 'No account is required to browse anime. However, to track your anime lists and sync progress, you\'ll need to log in with your AniList account. We don\'t have our own account system.'
        },
        {
          q: 'Should I use OsOtaku for watching anime?',
          a: 'We strongly recommend using official, licensed streaming services like Crunchyroll, Funimation, Netflix, or Hulu. These services directly support anime creators and offer the best quality and legal viewing experience.'
        }
      ]
    },
    {
      category: 'Contributing',
      icon: Plus,
      questions: [
        {
          q: 'How can I add episodes for an anime?',
          a: 'Episodes are added through GitHub pull requests. Fork our repository, add a JSON file at /public/data/{anilistId}.json following our schema, and submit a PR. Check our Contributing page for detailed instructions and examples.'
        },
        {
          q: 'What\'s the episode data format?',
          a: 'Each anime has a JSON file with an array of episodes. Each episode contains an ID, optional title/description/thumbnail, duration, and an array of sources with server name, type (embed/hls), audio type (sub/dub), contributor username, and streaming URLs.'
        },
        {
          q: 'Will I get credit for contributing?',
          a: 'Yes! Every source you add includes an "addedBy" field with your AniList username. Your contributions are visible on episode cards, and you\'re recognized as a contributor to the project.'
        },
        {
          q: 'What streaming sources are accepted?',
          a: 'We accept embed links (iframe-based players) and HLS streams (.m3u8). Sources should be reliable, not require downloads, and minimize ads. Malicious links are not accepted.'
        }
      ]
    },
    {
      category: 'Account & Privacy',
      icon: User,
      questions: [
        {
          q: 'How does login work?',
          a: 'We use AniList OAuth for authentication. When you log in, you\'re redirected to AniList to authorize our app. We never see or store your password - everything goes through AniList.'
        },
        {
          q: 'What data do you store?',
          a: 'We don\'t store any data on servers - we have no backend. Your AniList token is stored locally in your browser. Watch progress and preferences are also stored locally and never leave your device.'
        },
        {
          q: 'How do I disconnect my AniList account?',
          a: 'Click the logout button in the app to clear your local session. To fully revoke access, go to AniList Settings → Apps and remove OsOtaku from authorized apps.'
        },
        {
          q: 'Do you track users or use analytics?',
          a: 'No. We don\'t use Google Analytics, cookies, or any tracking. Our code is open-source, so you can verify this yourself.'
        }
      ]
    },
    {
      category: 'Legal',
      icon: Shield,
      questions: [
        {
          q: 'Does OsOtaku promote piracy?',
          a: 'No. OsOtaku does not promote, encourage, or endorse piracy. We strongly recommend using official streaming services to support anime creators. Community-contributed links are the responsibility of individual contributors.'
        },
        {
          q: 'Is OsOtaku legal?',
          a: 'OsOtaku is an open-source AniList wrapper that aggregates publicly available information. We don\'t host any copyrighted content. Users are responsible for their own actions when accessing third-party sites.'
        },
        {
          q: 'How do you handle DMCA requests?',
          a: 'We take copyright seriously. Rights holders can submit a DMCA notice through our GitHub repository, and we\'ll remove the specified links within 24-48 hours.'
        },
        {
          q: 'Who is responsible for streaming sources?',
          a: 'Streaming source links are contributed by community members and point to external third-party services. We don\'t control or endorse these external services. For content removal on those services, please contact them directly.'
        }
      ]
    },
    {
      category: 'Technical',
      icon: Code,
      questions: [
        {
          q: 'What technologies is OsOtaku built with?',
          a: 'OsOtaku is built with React, TypeScript, Tailwind CSS, and Vite. We use the AniList GraphQL API for anime data, HLS.js for video playback, and React Query for data fetching.'
        },
        {
          q: 'Can I self-host OsOtaku?',
          a: 'Absolutely! Clone the repository, run npm install, and npm run dev. You can deploy to any static hosting service like Vercel, Netlify, or GitHub Pages.'
        },
        {
          q: 'How do I report bugs?',
          a: 'Open an issue on our GitHub repository with details about the bug, including steps to reproduce, expected behavior, and screenshots if applicable.'
        },
        {
          q: 'Why doesn\'t OsOtaku have a backend?',
          a: 'Being a pure frontend app means zero server costs, complete privacy (no data leaves your browser), and anyone can self-host. All data comes from AniList\'s API and community-contributed JSON files.'
        }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="FAQ" 
        description="Frequently asked questions about OsOtaku - Learn about this open-source AniList wrapper, how to contribute, and more"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-8">
          Find answers to common questions about OsOtaku
        </p>

        {/* Important Notice */}
        <Card className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Support Official Anime Sources</p>
                <p className="text-sm text-muted-foreground">
                  OsOtaku is an AniList wrapper and does not promote piracy. We encourage you to support 
                  anime creators by watching through official services like 
                  <a href="https://crunchyroll.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Crunchyroll</a>, 
                  <a href="https://funimation.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Funimation</a>, 
                  <a href="https://netflix.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Netflix</a>, and others.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {faqs.map((section) => (
            <Card key={section.category}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <section.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">{section.category}</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${section.category}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Still have questions?</h3>
              <p className="text-muted-foreground">
                Check out our Contributing guide or open an issue on GitHub
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link to="/contributing">
                    <Plus className="w-4 h-4 mr-2" />
                    Contributing Guide
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://github.com/notsopreety/osotaku/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Open an Issue
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
