'use client';

import { useEffect, useState } from 'react';
import { EventType, EventStatus } from '@prisma/client';

interface JobEvent {
  id: string;
  type: EventType;
  status: EventStatus;
  createdAt: string;
  job: {
    company: string;
    position: string;
  };
  emailMessage: {
    subject: string;
    body: string;
    sender: string;
  } | null;
}

export default function ReviewPage() {
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventStatus>('PENDING');

  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);

  const fetchEvents = async (status: EventStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/review?status=${status}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (eventId: string, action: 'CONFIRM' | 'REJECT') => {
    try {
      await fetch('/api/review/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });

      // Optimistic update
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const formatEventType = (type: EventType) => {
    return type.replace(/_/g, ' ');
  };

  const getEventTypeBadgeColor = (type: EventType) => {
    switch (type) {
      case 'OFFER':
        return 'bg-green-100 text-green-800';
      case 'REJECTION':
        return 'bg-red-100 text-red-800';
      case 'INTERVIEW_REQUEST':
      case 'INTERVIEW_SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'ASSESSMENT':
        return 'bg-purple-100 text-purple-800';
      case 'APPLICATION_RECEIVED':
        return 'bg-gray-100 text-gray-800';
      case 'RECRUITER_OUTREACH':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Review Queue</h1>
          <div className="flex gap-2">
            {(['PENDING', 'CONFIRMED', 'REJECTED'] as EventStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded ${getEventTypeBadgeColor(
                      event.type
                    )}`}
                  >
                    {formatEventType(event.type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {event.emailMessage && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">From: {event.emailMessage.sender}</p>
                    <p className="font-semibold mt-1">{event.emailMessage.subject}</p>
                    <p className="text-gray-700 mt-2">
                      {event.emailMessage.body.substring(0, 200)}
                      {event.emailMessage.body.length > 200 ? '...' : ''}
                    </p>
                  </div>
                )}

                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="font-semibold text-sm">{event.job.company}</p>
                  <p className="text-sm text-gray-600">{event.job.position}</p>
                </div>

                {filter === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(event.id, 'CONFIRM')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleAction(event.id, 'REJECT')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
