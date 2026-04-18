import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-bold text-lg text-gray-900">Job Inbox OS</span>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try the beta
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-5">
          Turn your inbox into your job search command center.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Job Inbox OS reads your Gmail, classifies every application, interview, and
          offer, and organizes them into a clean timeline per job — so nothing slips
          through the cracks.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded text-base font-medium hover:bg-blue-700"
        >
          Try the beta
        </Link>
        <p className="text-xs text-gray-500 mt-3">Free during beta. No credit card.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 text-center uppercase tracking-wide">
          What it does
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Auto-classify every email
            </h3>
            <p className="text-sm text-gray-600">
              Applications, interviews, assessments, offers, rejections — sorted the moment
              they land. No manual tagging.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Timeline per job
            </h3>
            <p className="text-sm text-gray-600">
              Every event for a role collapses into one chronological thread. Know
              exactly where each application stands.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Review before anything sticks
            </h3>
            <p className="text-sm text-gray-600">
              Low-confidence classifications land in a review queue. Confirm or dismiss
              in one click — your data stays accurate.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 text-center uppercase tracking-wide">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Connect in 30 seconds
            </h3>
            <p className="text-sm text-gray-600">
              Sign in with Google once. Read-only access — we never send mail on your
              behalf.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Keep applying like normal
            </h3>
            <p className="text-sm text-gray-600">
              Nothing to change about your workflow. New events appear in your dashboard
              as responses hit your inbox.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Check in when you want
            </h3>
            <p className="text-sm text-gray-600">
              Open the dashboard for a real-time pulse on every application — no more
              digging through email threads.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Ready to get your job search organized?
        </h2>
        <p className="text-gray-600 mb-6">
          Open the dashboard and connect your inbox — takes under a minute.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded text-base font-medium hover:bg-blue-700"
        >
          Try the beta
        </Link>
      </section>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <span>Job Inbox OS — beta</span>
          <Link href="/dashboard" className="hover:text-gray-900">
            Open the app
          </Link>
        </div>
      </footer>
    </div>
  );
}
