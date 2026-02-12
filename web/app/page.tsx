import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Job Inbox OS</h1>
        <p className="text-gray-600 mb-8">Turn job emails into actionable events</p>
        <Link
          href="/review"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Review Queue
        </Link>
      </div>
    </main>
  );
}
