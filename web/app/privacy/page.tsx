import MarketingHeader from '@/components/marketing-header';
import MarketingFooter from '@/components/marketing-footer';

export const metadata = {
  title: 'Privacy Policy — Job Inbox OS',
  description: 'How Job Inbox OS collects, uses, stores, and deletes your data.',
};

export default function PrivacyPage() {
  return (
    <div>
      <MarketingHeader />

      <article className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: April 18, 2026</p>

        <Section title="1. Who we are">
          <p>
            Job Inbox OS (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a personal-productivity tool
            operated by Tyler Meletiche. The service reads your Gmail inbox, classifies
            job-related messages (applications, interviews, assessments, offers,
            rejections, recruiter outreach), and organizes them into a dashboard. This
            policy explains what data we collect, how we use it, and the choices you have.
          </p>
          <p className="mt-3">
            Contact: <a className="text-blue-600 hover:underline" href="mailto:ty.meletiche@gmail.com">ty.meletiche@gmail.com</a>.
          </p>
        </Section>

        <Section title="2. Google API disclosure (Limited Use)">
          <p className="font-medium">
            Job Inbox OS&rsquo;s use and transfer to any other app of information received
            from Google APIs will adhere to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-600 hover:underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
          <p className="mt-3">
            Concretely, we do not use your Gmail data to train generalized AI or machine
            learning models, serve ads, sell data to third parties, or allow humans to
            read your messages unless you explicitly grant support access to investigate
            a specific issue, or we are required to by law.
          </p>
        </Section>

        <Section title="3. Information we collect">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Google account basics</strong> — your email address and name,
              obtained when you sign in with Google.
            </li>
            <li>
              <strong>Gmail message content</strong> — when you connect Gmail, we fetch
              messages matching job-related search filters. For each message we process
              the subject, sender, recipient, send date, and body. We do not access
              attachments.
            </li>
            <li>
              <strong>Derived classifications</strong> — the event type our rule-based
              classifier assigns (e.g., OFFER, REJECTION) plus extracted fields such as
              company name, position title, interview date, and assessment links.
            </li>
            <li>
              <strong>OAuth tokens</strong> — the access and refresh tokens Google issues
              so we can sync on your behalf.
            </li>
            <li>
              <strong>Usage events</strong> — minimal logs of API requests and sync runs
              for debugging and abuse prevention. No tracking pixels, no third-party
              analytics during the beta.
            </li>
          </ul>
        </Section>

        <Section title="4. How we use your information">
          <ul className="list-disc pl-5 space-y-2">
            <li>Classify emails and build the dashboard, review queue, and job timelines you see in the app.</li>
            <li>Let you confirm or dismiss classifications so the record stays accurate.</li>
            <li>Authenticate you and keep you signed in.</li>
            <li>Diagnose bugs, prevent abuse, and keep the service running.</li>
          </ul>
          <p className="mt-3">
            We do not use your data for advertising, generalized AI model training, or to
            build profiles for third parties.
          </p>
        </Section>

        <Section title="5. How we store and secure your information">
          <ul className="list-disc pl-5 space-y-2">
            <li>Data is stored in a managed Postgres database hosted on our infrastructure provider.</li>
            <li>OAuth tokens are stored server-side and never exposed to the browser.</li>
            <li>Traffic to the service is served over HTTPS.</li>
            <li>Access to production systems is limited to the operator.</li>
          </ul>
          <p className="mt-3">
            No system is perfectly secure. If we learn of a breach affecting your data, we
            will notify you without undue delay.
          </p>
        </Section>

        <Section title="6. Who we share data with">
          <p>
            We do not sell your data, rent it, or share it with advertisers. We share only
            with the infrastructure providers needed to run the service — our hosting
            provider and database provider — under their respective data-processing terms.
            We may also disclose data when required by law or to protect against fraud.
          </p>
        </Section>

        <Section title="7. Your choices and rights">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Disconnect Gmail at any time</strong> — in the dashboard, disconnect
              to revoke our access. You can also revoke directly at{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-600 hover:underline"
              >
                myaccount.google.com/permissions
              </a>
              .
            </li>
            <li>
              <strong>Delete your data</strong> — request deletion of your account and all
              stored messages, classifications, and tokens by emailing{' '}
              <a className="text-blue-600 hover:underline" href="mailto:ty.meletiche@gmail.com">
                ty.meletiche@gmail.com
              </a>
              . We will complete deletion within 30 days.
            </li>
            <li>
              <strong>Access or export your data</strong> — request a copy of the data we
              hold about you using the same email.
            </li>
          </ul>
        </Section>

        <Section title="8. Data retention">
          <p>
            We keep your data for as long as your account is active. When you delete your
            account or disconnect Gmail and request deletion, we remove your stored
            messages, classifications, and tokens within 30 days. Aggregate, anonymized
            statistics (e.g., total number of classifications) may be retained for
            product analytics.
          </p>
        </Section>

        <Section title="9. Children">
          <p>
            Job Inbox OS is not directed to children under 13 and we do not knowingly
            collect personal information from children under 13. If you believe a child
            has provided us with personal information, please contact us so we can delete
            it.
          </p>
        </Section>

        <Section title="10. Changes to this policy">
          <p>
            We may update this policy as the product evolves. When we make material
            changes, we will update the effective date above and, where appropriate,
            notify active users by email.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about this policy, or requests related to your data, go to{' '}
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
