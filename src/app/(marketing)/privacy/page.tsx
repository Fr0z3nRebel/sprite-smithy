import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Sprite Smithy',
  description: 'Privacy Policy for Sprite Smithy - Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 1, 2025';

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Sprite Smithy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service, which allows you to convert AI-generated videos into sprite sheets for game development.
          </p>
          <p className="mb-4">
            By using our service, you consent to the data practices described in this policy. If you do not agree with the data practices described in this Privacy Policy, you should not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Account Information:</strong> When you create an account, we collect your email address and any other information you choose to provide.</li>
            <li><strong>Content:</strong> Videos and images you upload to our service for processing.</li>
            <li><strong>Communications:</strong> Information you provide when contacting our support team.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> Information about how you use our service, including pages visited, features used, and time spent on the service.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and IP address.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience and analyze service usage.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide, maintain, and improve our service</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR)</h2>
          <p className="mb-4">If you are located in the European Economic Area (EEA), we process your personal data based on the following legal grounds:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Contract Performance:</strong> To fulfill our contract with you and provide the service you requested</li>
            <li><strong>Legitimate Interests:</strong> To improve our service, ensure security, and prevent fraud</li>
            <li><strong>Consent:</strong> When you have given clear consent for specific processing activities</li>
            <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p className="mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
          
          <h3 className="text-xl font-semibold mb-3">5.1 Service Providers</h3>
          <p className="mb-4">
            We share information with third-party service providers who perform services on our behalf, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Supabase:</strong> Authentication and database services (see Supabase's privacy policy at <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>)</li>
            <li><strong>Vercel:</strong> Hosting and infrastructure services</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">5.2 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose your information if required by law or in response to valid requests by public authorities.
          </p>

          <h3 className="text-xl font-semibold mb-3">5.3 Business Transfers</h3>
          <p className="mb-4">
            In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to provide our service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights (GDPR)</h2>
          <p className="mb-4">If you are located in the EEA, you have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Right of Access:</strong> You can request a copy of the personal data we hold about you</li>
            <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> You can request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> You can request that we limit how we use your data</li>
            <li><strong>Right to Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format</li>
            <li><strong>Right to Object:</strong> You can object to processing of your data based on legitimate interests</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us at <a href="mailto:privacy@spritesmithy.com" className="text-primary hover:underline">privacy@spritesmithy.com</a>. We will respond to your request within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p className="mb-4">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>
          <p className="mb-4">
            We use the following types of cookies:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the service to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our service</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. When we transfer personal data from the EEA to other countries, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
          <p className="mb-4">
            Our service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <ul className="list-none pl-0 mb-4 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@spritesmithy.com" className="text-primary hover:underline">privacy@spritesmithy.com</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@spritesmithy.com" className="text-primary hover:underline">support@spritesmithy.com</a></li>
          </ul>
        </section>
      </div>
    </main>
  );
}

