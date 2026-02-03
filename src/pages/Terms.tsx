import { SEO } from '@/components/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle, Scale, Users, Ban, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms of Service" 
        description="Terms of Service for OsOtaku - Understand your rights and responsibilities when using our open-source anime discovery platform"
        noindex
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        {/* Important Disclaimer Banner */}
        <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Important Disclaimer</p>
                <p className="text-sm text-muted-foreground">
                  <strong>OsOtaku does not promote or encourage piracy.</strong> We strongly recommend 
                  supporting anime creators by watching content through official and licensed streaming 
                  platforms such as <a href="https://crunchyroll.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Crunchyroll</a>, 
                  {' '}<a href="https://funimation.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Funimation</a>, 
                  {' '}<a href="https://netflix.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Netflix</a>, 
                  {' '}and other licensed services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing or using OsOtaku, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
              <p>
                OsOtaku is an open-source, community-driven project provided "as is" without 
                warranties of any kind, express or implied.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                What is OsOtaku?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>OsOtaku is fundamentally an AniList wrapper</strong> - a user interface layer 
                that presents anime data from the AniList API in a different format. Think of it as 
                an alternative frontend for browsing and tracking anime on AniList.
              </p>
              <p>OsOtaku provides:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>An alternative interface for AniList anime data</li>
                <li>List tracking synced directly with your AniList account</li>
                <li>Community-contributed links to third-party streaming sources</li>
                <li>Open-source codebase for transparency</li>
              </ul>
              <p className="mt-4">OsOtaku does <strong>NOT</strong>:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Host, store, or distribute any video content</li>
                <li>Upload or stream copyrighted material from its own servers</li>
                <li>Promote, encourage, or facilitate piracy in any form</li>
                <li>Have any affiliation with anime studios or distributors</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                Support Official Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We strongly encourage users to support the anime industry by using official, 
                licensed streaming services. Legal streaming options include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Crunchyroll</strong> - Wide selection of subbed anime</li>
                <li><strong>Funimation</strong> - Extensive dubbed anime library</li>
                <li><strong>Netflix</strong> - Growing anime collection with originals</li>
                <li><strong>Amazon Prime Video</strong> - Various anime titles</li>
                <li><strong>Hulu</strong> - Anime and simulcasts</li>
                <li><strong>HIDIVE</strong> - Sentai Filmworks content</li>
              </ul>
              <p className="mt-4">
                By using official sources, you directly support the creators, animators, voice actors, 
                and everyone who works hard to bring anime to life.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>As a user of OsOtaku, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service in compliance with all applicable laws in your jurisdiction</li>
                <li>Understand that accessing copyrighted content without authorization may be illegal</li>
                <li>Take personal responsibility for your actions on third-party sites</li>
                <li>Not attempt to bypass any security measures</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contributor Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>If you contribute episode data to the project, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Only submit links to content you believe is legally available</li>
                <li>Not submit malicious links or content</li>
                <li>Follow the contribution guidelines</li>
                <li>Accept that your contributions may be modified or removed</li>
                <li>License your contributions under the project's open-source license</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Disclaimer of Warranties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Continuous, uninterrupted access to the service</li>
                <li>Accuracy of anime information or metadata (sourced from AniList)</li>
                <li>Availability or quality of third-party streaming sources</li>
                <li>Safety or legality of third-party websites linked through our service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the maximum extent permitted by law, OsOtaku and its contributors shall not be 
                liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of or inability to use the service.
              </p>
              <p>
                We are not responsible for any content hosted on third-party services accessed 
                through links on our platform. Users access external content at their own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting to the website. Your continued use of the service after 
                changes constitutes acceptance of the new terms.
              </p>
              <p>
                As an open-source project, all changes are transparent and visible in our 
                GitHub repository's commit history.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                OsOtaku is a non-commercial, open-source project. We respect intellectual property 
                and encourage users to support anime through official channels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
