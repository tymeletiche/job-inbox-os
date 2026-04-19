import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';

export const metadata = {
  title: 'Terms of Service — Job Inbox OS',
  description: 'The rules and conditions for using Job Inbox OS.',
};

export default function TermsPage() {
  return (
    <div>
      <MarketingHeader />

      <article className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: April 18, 2026</p>

        <Section title="1. Acceptance of these terms">
          <p>
            By creating an account or using Job Inbox OS (the &ldquo;Service&rdquo;), you
            agree to these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree,
            do not use the Service. These Terms form a binding agreement between you and
            Tyler Meletiche, the operator of Job Inbox OS (&ldquo;we,&rdquo;
            &ldquo;us&rdquo;).
          </p>
        </Section>

        <Section title="2. The Service">
          <p>
            Job Inbox OS reads your connected Gmail inbox, classifies job-related messages
            (such as applications, interviews, assessments, offers, rejections, and
            recruiter outreach), and presents them in a dashboard, review queue, and
            per-job timeline. Our{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            explains how we handle your data.
          </p>
        </Section>

        <Section title="3. Beta status">
          <p>
            The Service is currently in beta. Features may change, break, or be removed.
            Data loss is possible during the beta period. You should not rely on the
            Service as the sole record of your job search. We may limit access, add
            usage caps, or pause the Service at any time.
          </p>
        </Section>

        <Section title="4. Eligibility">
          <p>
            You must be at least 18 years old and able to form a binding contract in your
            jurisdiction to use the Service. You must have a valid Google account to
            connect Gmail.
          </p>
        </Section>

        <Section title="5. Your account">
          <p>
            You are responsible for maintaining the confidentiality of your Google
            credentials and for all activity that occurs under your account. Notify us
            promptly at{' '}
            <a className="text-blue-600 hover:underline" href="mailto:ty.meletiche@gmail.com">
              ty.meletiche@gmail.com
            </a>{' '}
            if you suspect unauthorized access.
          </p>
        </Section>

        <Section title="6. Acceptable use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use the Service to violate any law or third-party right.</li>
            <li>Reverse engineer, scrape, or attempt to bypass the Service&rsquo;s rate limits or security controls.</li>
            <li>Use the Service to process Gmail data you are not authorized to access.</li>
            <li>Upload or transmit malicious code or attempt to disrupt the Service.</li>
            <li>Resell or sublicense the Service without our written permission.</li>
          </ul>
          <p className="mt-3">
            We may suspend or terminate accounts that violate these rules.
          </p>
        </Section>

        <Section title="7. Your data">
          <p>
            You retain all rights to the Gmail content you authorize us to access. You
            grant us a limited, revocable license to access, process, store, and display
            that content solely to provide the Service to you, as described in our
            Privacy Policy. You may disconnect Gmail and delete your data at any time.
          </p>
        </Section>

        <Section title="8. Our intellectual property">
          <p>
            The Service, including its code, design, and branding, is owned by us and
            protected by intellectual-property laws. These Terms do not transfer any
            ownership of the Service to you. You may not copy, modify, or create
            derivative works of the Service except as expressly permitted.
          </p>
        </Section>

        <Section title="9. Third-party services">
          <p>
            The Service depends on Google APIs (Gmail, Google Sign-In). Your use of those
            services is subject to Google&rsquo;s terms and privacy policy. We are not
            responsible for the availability, accuracy, or content of third-party
            services.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            You may stop using the Service at any time by disconnecting Gmail and
            deleting your account. We may suspend or terminate your access at our
            discretion — for example, if you violate these Terms or if continuing to
            provide the Service becomes impractical. On termination, your right to use
            the Service ends immediately; the data-deletion commitments in our Privacy
            Policy continue to apply.
          </p>
        </Section>

        <Section title="11. Disclaimers">
          <p className="uppercase text-xs text-gray-600 font-medium mb-2">
            Read this section carefully.
          </p>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
            without warranties of any kind, whether express or implied, including
            warranties of merchantability, fitness for a particular purpose, or
            non-infringement. We do not warrant that the classifier will be accurate,
            that the Service will be uninterrupted or error-free, or that any defects
            will be corrected. You use the Service at your own risk.
          </p>
        </Section>

        <Section title="12. Limitation of liability">
          <p className="uppercase text-xs text-gray-600 font-medium mb-2">
            Read this section carefully.
          </p>
          <p>
            To the maximum extent permitted by law, we will not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or any
            loss of profits, revenue, data, or goodwill arising from your use of the
            Service. Our aggregate liability for any claim relating to the Service will
            not exceed one hundred US dollars ($100).
          </p>
        </Section>

        <Section title="13. Indemnification">
          <p>
            You agree to indemnify and hold us harmless from any claims, damages, losses,
            or expenses (including reasonable legal fees) arising from your misuse of the
            Service or violation of these Terms.
          </p>
        </Section>

        <Section title="14. Governing law and disputes">
          <p>
            These Terms are governed by the laws of the United States, without regard to
            conflict-of-laws principles. Any dispute arising from or relating to these
            Terms or the Service will be resolved in the state or federal courts located
            in the United States, and you consent to personal jurisdiction there.
          </p>
        </Section>

        <Section title="15. Changes to these Terms">
          <p>
            We may update these Terms as the Service evolves. When we make material
            changes, we will update the effective date above and, where appropriate,
            notify active users by email. Continued use of the Service after changes
            constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="16. Contact">
          <p>
            Questions about these Terms? Reach out at{' '}
            <a className="text-blue-600 hover:underline" href="mailto:ty.meletiche@gmail.com">
              ty.meletiche@gmail.com
            </a>
            .
          </p>
        </Section>
      </article>

      <MarketingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-gray-700 space-y-2">{children}</div>
    </section>
  );
}
