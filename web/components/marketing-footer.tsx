import Link from 'next/link';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-3">
        <span>Job Inbox OS — beta</span>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
          <Link href="/dashboard" className="hover:text-gray-900">
            Open the app
          </Link>
        </div>
      </div>
    </footer>
  );
}
