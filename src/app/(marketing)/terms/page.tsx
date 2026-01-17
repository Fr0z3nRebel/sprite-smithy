import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Sprite Smithy',
  description: 'Terms of Service for Sprite Smithy - Read our terms and conditions for using our service.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'January 1, 2025';

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using Sprite Smithy ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
          </p>
          <p className="mb-4">
            These Terms apply to all visitors, users, and others who access or use the Service. Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Sprite Smithy is a web-based service that allows users to convert AI-generated character videos into sprite sheets for game development. The Service includes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Video upload and processing capabilities</li>
            <li>Frame extraction and alignment tools</li>
            <li>Background removal and chroma key features</li>
            <li>Automatic cropping and halo removal</li>
            <li>Sprite sheet export functionality</li>
            <li>All features are available free of charge</li>
            <li>No watermarks, no limits, no credit card required</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
          <p className="mb-4">
            To use certain features of the Service, you must create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">3.2 Account Termination</h3>
          <p className="mb-4">
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in any fraudulent, abusive, or illegal activity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Service for any illegal purpose or in violation of any laws</li>
            <li>Upload content that infringes on intellectual property rights of others</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Attempt to gain unauthorized access to the Service or its systems</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Resell or redistribute the Service without authorization</li>
            <li>Upload content that is defamatory, obscene, or violates others' rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <h3 className="text-xl font-semibold mb-3">5.1 Your Content</h3>
          <p className="mb-4">
            You retain all ownership rights to the videos, images, and other content you upload to the Service ("Your Content"). By uploading Your Content, you grant us a limited, non-exclusive license to use, process, and store Your Content solely for the purpose of providing the Service to you.
          </p>

          <h3 className="text-xl font-semibold mb-3">5.2 Our Service</h3>
          <p className="mb-4">
            The Service, including its original content, features, and functionality, is owned by Sprite Smithy and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Free Service</h2>
          <p className="mb-4">
            Sprite Smithy is currently offered as a completely free service. All features are available to all users at no cost. No credit card is required, and there are no usage limits or restrictions.
          </p>
          <p className="mb-4">
            We reserve the right to modify the pricing structure in the future, but any such changes will be clearly communicated to users in advance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
          <p className="mb-4">
            We strive to provide reliable service but do not guarantee that the Service will be available at all times. The Service may be unavailable due to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Scheduled maintenance</li>
            <li>Unscheduled maintenance or repairs</li>
            <li>Technical failures</li>
            <li>Circumstances beyond our reasonable control</li>
          </ul>
          <p className="mb-4">
            We are not liable for any loss or damage resulting from Service unavailability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPRITE SMITHY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
          <p className="mb-4">
            Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
          <p className="mb-4">
            You agree to indemnify, defend, and hold harmless Sprite Smithy and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your use of the Service or violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
          <p className="mb-4">
            You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in the United States.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-none pl-0 mb-4 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:support@spritesmithy.com" className="text-primary hover:underline">support@spritesmithy.com</a></li>
            <li><strong>Legal Inquiries:</strong> <a href="mailto:legal@spritesmithy.com" className="text-primary hover:underline">legal@spritesmithy.com</a></li>
          </ul>
        </section>
      </div>
    </main>
  );
}

