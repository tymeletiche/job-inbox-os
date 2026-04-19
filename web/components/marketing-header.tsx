import Link from 'next/link';

export default function MarketingHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg text-gray-900">
          Job Inbox OS
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try the beta
        </Link>
      </div>
    </header>
  );
}
