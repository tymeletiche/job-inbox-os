'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventType, EventStatus } from '@prisma/client';
import EventTypeBadge from '@/components/event-type-badge';
import EmptyState from '@/components/empty-state';

interface JobWithMeta {
  id: string;
  company: string;
  position: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: { events: number };
  events: { type: EventType; status: EventStatus; createdAt: string }[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>

      {jobs.length === 0 ? (
        <EmptyState message="No jobs tracked yet." />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Events</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Latest</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => {
                const latest = job.events[0];
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-blue-600 hover:underline">
                        {job.company}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.position}</td>
                    <td className="px-4 py-3 text-gray-600">{job._count.events}</td>
                    <td className="px-4 py-3">
                      {latest && <EventTypeBadge type={latest.type} />}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {latest && new Date(latest.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
