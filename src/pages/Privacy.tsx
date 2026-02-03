import { SEO } from '@/components/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Cookie, Server, UserCheck, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="Privacy policy for OsOtaku - Learn how we protect your data and respect your privacy"
        noindex
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        {/* Important Notice Banner */}
        <Card className="mb-6 border-green-500/50 bg-green-500/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Privacy-First Approach</p>
                <p className="text-sm text-muted-foreground">
                  OsOtaku is an <strong>open-source AniList wrapper</strong> that prioritizes your privacy. 
                  We collect zero personal data and don't track your activity. All data stays in your browser.
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
                Our Privacy Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                OsOtaku is committed to protecting your privacy. As an open-source project, 
                we believe in complete transparency about how data is handled.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>No personal data collection</strong> - We don't collect or store your data</li>
                <li><strong>No tracking</strong> - No analytics, cookies, or user tracking</li>
                <li><strong>No accounts</strong> - Authentication is handled entirely by AniList</li>
                <li><strong>Open source</strong> - Our code is public for anyone to verify</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Information We Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p><strong>Via AniList OAuth (when you choose to log in):</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your AniList username and profile ID</li>
                <li>Your public anime/manga lists</li>
                <li>Your profile avatar and banner</li>
              </ul>
              <p className="mt-4">
                This information is fetched <strong>directly from AniList's API</strong> in your browser 
                and is <strong>never sent to or stored on our servers</strong>. We have no backend - 
                the entire application runs in your browser.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Browser Local Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use your browser's local storage for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AniList authentication tokens (stored securely in your browser only)</li>
                <li>Theme preferences (dark/light mode)</li>
                <li>Watch progress (optional, stored locally)</li>
              </ul>
              <p className="mt-4">
                This data <strong>never leaves your browser</strong> and can be cleared at any time 
                through your browser settings or by logging out.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Cookies & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>We do not use any cookies or analytics.</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No Google Analytics or similar tracking</li>
                <li>No advertising cookies</li>
                <li>No third-party trackers</li>
                <li>No user behavior monitoring</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> Third-party embedded content (streaming sources) may have their 
                own cookie policies and tracking which are outside our control. We recommend using 
                browser privacy extensions when accessing external content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have complete control over your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Disconnect your AniList account at any time via the logout button</li>
                <li>Clear all local data by clearing your browser's local storage</li>
                <li>Revoke OAuth access through your AniList Settings → Apps</li>
                <li>Use the site without logging in for anonymous browsing</li>
              </ul>
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
              <p>Our platform interacts with:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>AniList</strong> - For anime metadata and user authentication. 
                  See their <a href="https://anilist.co/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a>.
                </li>
                <li>
                  <strong>Third-party streaming sources</strong> - Community-contributed links point to 
                  external services with their own privacy practices. We recommend using official 
                  streaming services for better privacy protection.
                </li>
                <li>
                  <strong>GitHub</strong> - Hosts our open-source code and episode data.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                OsOtaku does not promote piracy. We encourage users to support anime creators by 
                watching through <strong>official licensed streaming services</strong> which offer 
                better privacy protections and directly support the industry.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Questions about privacy? Review our open-source code on GitHub or open an issue 
                for any concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
