import Link from 'next/link';

interface StatCardProps {
  label: string;
  value: number | string;
  href?: string;
}

export default function StatCard({ label, value, href }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );

  if (href) {
    return <Link href={href} className="block hover:ring-2 hover:ring-blue-200 rounded-lg">{content}</Link>;
  }
  return content;
}
