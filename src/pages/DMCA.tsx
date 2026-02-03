import { SEO } from '@/components/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, AlertTriangle, FileText, Clock, ExternalLink, Shield } from 'lucide-react';

export default function DMCA() {
  return (
    <>
      <SEO 
        title="DMCA Policy" 
        description="DMCA takedown policy and procedures for OsOtaku - Learn how we handle copyright concerns"
        noindex
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">DMCA Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        {/* Important Disclaimer Banner */}
        <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">We Do Not Host Content</p>
                <p className="text-sm text-muted-foreground">
                  OsOtaku is an <strong>AniList wrapper</strong> and does not host, store, upload, or 
                  distribute any video content. We only aggregate metadata and links to third-party services. 
                  We encourage users to watch anime through <strong>official licensed platforms</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Our Position on Copyright
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>OsOtaku respects intellectual property rights</strong> and does not promote or 
                encourage piracy in any form. We believe creators deserve to be compensated for their work.
              </p>
              <p>
                We strongly recommend users watch anime through official, licensed streaming services such as:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Crunchyroll, Funimation, Netflix, Amazon Prime Video, Hulu, HIDIVE</li>
              </ul>
              <p className="mt-4">
                Supporting official sources ensures the continued production of the anime we all love.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                What We Actually Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                OsOtaku functions as an <strong>alternative interface for AniList</strong>. Specifically:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Anime metadata (titles, images, ratings) comes from <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AniList's API</a></li>
                <li>Episode links are <strong>community-contributed</strong> via GitHub pull requests</li>
                <li>All contributed links point to <strong>external third-party services</strong></li>
                <li>We do <strong>not</strong> host, upload, or stream any video files</li>
                <li>Our source code is <strong>fully open-source</strong> for transparency</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Filing a Takedown Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you are a rights holder and believe that links on our platform infringe your copyright, 
                we will promptly remove them from our public data repository.
              </p>
              <p><strong>Please provide:</strong></p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Identification of the copyrighted work claimed to be infringed</li>
                <li>The specific AniList ID(s) or anime titles where infringing links appear</li>
                <li>Your contact information (name, email, company/organization)</li>
                <li>A statement of good faith belief that the use is unauthorized</li>
                <li>A statement that the information provided is accurate</li>
                <li>Your physical or electronic signature</li>
              </ol>
              <p className="mt-4">
                <strong>Submit notices via:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>GitHub Issues on our repository (fastest response)</li>
                <li>Direct contact with repository maintainers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Response Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Upon receiving a valid DMCA notice, we will:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Review the notice within <strong>24-48 hours</strong></li>
                <li>Remove the specified links from our public data repository</li>
                <li>Notify the contributor who added the content (if applicable)</li>
                <li>Maintain a record of the takedown for compliance purposes</li>
              </ul>
              <p className="mt-4 text-sm">
                Note: For infringing content on third-party streaming services, please contact those 
                services directly as we have no control over their content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Community-contributed links point to various third-party streaming services. We do not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Control, operate, or have any affiliation with these services</li>
                <li>Have the ability to remove content from their servers</li>
                <li>Endorse or verify the legality of content on these services</li>
              </ul>
              <p className="mt-4">
                Rights holders should contact third-party services directly to have infringing content 
                removed from their platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                This is an open-source, non-commercial project. We respect intellectual property rights 
                and work cooperatively with rights holders to address concerns promptly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
