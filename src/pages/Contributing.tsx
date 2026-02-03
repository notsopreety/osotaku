import { SEO } from '@/components/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  GitFork, 
  FileJson, 
  GitPullRequest, 
  CheckCircle, 
  Code, 
  Heart,
  Users,
  Tv,
  Film
} from 'lucide-react';

export default function Contributing() {
  const episodeSchema = `{
  "episodes": [
    {
      "epId": "ep-1",
      "title": "The Beginning",
      "description": "The journey starts...",
      "thumbnail": "https://cdn.example.com/ep-1.jpg",
      "duration": 1420,
      "updatedOn": "2026-02-03",
      "sources": [
        {
          "server": "streamsb",
          "type": "embed",
          "audio": "sub",
          "addedBy": "yourUsername",
          "data": [
            {
              "url": "https://streamsb.com/e/xxxxx",
              "quality": "auto"
            }
          ]
        },
        {
          "server": "cloudflare",
          "type": "hls",
          "audio": "dub",
          "addedBy": "yourUsername",
          "data": [
            {
              "url": "https://cdn.example.com/master.m3u8",
              "quality": "auto",
              "subtitles": [
                {
                  "languageId": "en",
                  "label": "English",
                  "url": "https://cdn.example.com/en.vtt"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;

  return (
    <>
      <SEO 
        title="Contributing" 
        description="Learn how to contribute to OsOtaku - Add episodes, improve the codebase, and help grow the community"
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contributing to OsOtaku</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            OsOtaku is powered by the community. Here's how you can help make it better!
          </p>
        </div>

        {/* Thank You Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Thank You, Contributors! 💜</h2>
                <p className="text-muted-foreground">
                  OsOtaku wouldn't exist without our amazing contributors who add episodes, 
                  fix bugs, and improve the platform every day. You're the heart of this project!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ways to Contribute */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-primary" />
                Add Episode Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                The most impactful way to contribute! Add streaming sources for anime episodes 
                so everyone can watch their favorite shows.
              </p>
              <Badge variant="secondary" className="mt-2">Most Needed</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Improve the Codebase
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Fix bugs, add features, improve performance, or enhance the UI. 
                All code contributions are welcome!
              </p>
              <Badge variant="outline" className="mt-2">TypeScript/React</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Report Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Found a bug or broken link? Report it on GitHub so we can fix it. 
                Detailed bug reports are incredibly helpful!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5 text-orange-500" />
                Spread the Word
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Star the repo, share with friends, and help grow the community. 
                More users means more contributors!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Episode Contribution Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              Episode Contribution Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                  Fork the Repository
                </h3>
                <p className="text-muted-foreground ml-8 mt-1">
                  Go to our GitHub repository and click the "Fork" button to create your own copy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                  Find the AniList ID
                </h3>
                <p className="text-muted-foreground ml-8 mt-1">
                  Each anime has a unique AniList ID. You can find it in the URL when viewing an anime on AniList 
                  (e.g., anilist.co/anime/<strong>195515</strong>).
                </p>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                  Create or Edit the JSON File
                </h3>
                <p className="text-muted-foreground ml-8 mt-1">
                  Add your episode data to <code className="bg-muted px-1 py-0.5 rounded">/public/data/&#123;anilistId&#125;.json</code>
                </p>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
                  Submit a Pull Request
                </h3>
                <p className="text-muted-foreground ml-8 mt-1">
                  For embededed players, you can use <a href="https://abyss.to/" className="text-primary hover:underline">Abyss.to</a> video streaming.
                </p>
              </div>

              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">5</span>
                  Submit a Pull Request
                </h3>
                <p className="text-muted-foreground ml-8 mt-1">
                  Push your changes and create a pull request. We'll review and merge it!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schema Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Episode Data Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{episodeSchema}</code>
              </pre>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="font-semibold">Field Descriptions:</h4>
              <div className="grid gap-3 text-sm">
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">epId</Badge>
                  <span className="text-muted-foreground">Unique episode identifier (e.g., "ep-1", "ep-2")</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">title</Badge>
                  <span className="text-muted-foreground">Episode title (optional)</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">description</Badge>
                  <span className="text-muted-foreground">Brief episode description (optional)</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">thumbnail</Badge>
                  <span className="text-muted-foreground">Episode thumbnail URL (optional)</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">duration</Badge>
                  <span className="text-muted-foreground">Episode duration in seconds (optional)</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">server</Badge>
                  <span className="text-muted-foreground">Streaming server name (e.g., "vidcloud", "streamsb")</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">type</Badge>
                  <span className="text-muted-foreground">"embed" for iframe players, "hls" for .m3u8 streams</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">audio</Badge>
                  <span className="text-muted-foreground">"sub" for subbed, "dub" for dubbed</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">addedBy</Badge>
                  <span className="text-muted-foreground">Your username (for attribution)</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="shrink-0">subtitles</Badge>
                  <span className="text-muted-foreground">Array of VTT subtitle tracks (optional, for HLS only)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Contribution Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>✅ <strong>Do:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Use reliable, stable streaming sources</li>
              <li>We suggest using embed sources for stable streaming</li>
              <li>Test your links before submitting</li>
              <li>Follow the JSON schema exactly</li>
              <li>Use your actual username for attribution</li>
              <li>Add multiple quality options when available</li>
              <li>Include subtitles for HLS streams when possible</li>
            </ul>
            
            <p className="mt-4">❌ <strong>Don't:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Submit links with excessive ads or popups (Minor can be accepted)</li>
              <li>Add malicious or unsafe sources</li>
              <li>Submit broken or expired links</li>
              <li>Impersonate other contributors</li>
              <li>Add download links (streaming only)</li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/20 to-primary/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Contribute?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Join our community of contributors and help make anime accessible to everyone!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <a 
                    href="https://github.com/notsopreety/osotaku" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a 
                    href="https://github.com/notsopreety/osotaku/fork" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <GitFork className="w-5 h-5 mr-2" />
                    Fork Repository
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
