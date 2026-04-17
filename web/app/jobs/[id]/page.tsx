'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { EventType, EventStatus } from '@prisma/client';
import EventTypeBadge from '@/components/event-type-badge';
import StatusBadge from '@/components/status-badge';

interface JobEvent {
  id: string;
  type: EventType;
  status: EventStatus;
  createdAt: string;
  confirmedAt: string | null;
  rejectedAt: string | null;
  emailMessage: {
    subject: string;
    body: string;
    sender: string;
  } | null;
}

interface JobDetail {
  id: string;
  company: string;
  position: string;
  status: string;
  createdAt: string;
  events: JobEvent[];
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data.job))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (eventId: string, action: 'CONFIRM' | 'REJECT') => {
    try {
      await fetch('/api/review/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });
      // Update local state
      setJob((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          events: prev.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  status: action === 'CONFIRM' ? ('CONFIRMED' as EventStatus) : ('REJECTED' as EventStatus),
                  confirmedAt: action === 'CONFIRM' ? new Date().toISOString() : null,
                  rejectedAt: action === 'REJECT' ? new Date().toISOString() : null,
                }
              : e
          ),
        };
      });
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!job) {
    return (
      <div>
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">&larr; Back to Jobs</Link>
        <p className="text-gray-500 mt-4">Job not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/jobs" className="text-sm text-blue-600 hover:underline">&larr; Back to Jobs</Link>

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold">{job.company}</h1>
        <p className="text-gray-600">{job.position}</p>
      </div>

      {/* Event timeline */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Timeline ({job.events.length} event{job.events.length !== 1 ? 's' : ''})
      </h2>

      <div className="space-y-0">
        {job.events.map((event, i) => (
          <div key={event.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              {i < job.events.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 min-h-8" />}
            </div>

            {/* Event content */}
            <div className="bg-white rounded-lg shadow p-4 mb-3 flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-center">
                  <EventTypeBadge type={event.type} />
                  <StatusBadge status={event.status} />
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>

              {event.emailMessage && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500">From: {event.emailMessage.sender}</p>
                  <p className="font-medium text-sm mt-0.5">{event.emailMessage.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.emailMessage.body.substring(0, 300)}
                    {event.emailMessage.body.length > 300 ? '...' : ''}
                  </p>
                </div>
              )}

              {event.status === 'PENDING' && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAction(event.id, 'CONFIRM')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleAction(event.id, 'REJECT')}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
