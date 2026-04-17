'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventType, EventStatus } from '@prisma/client';
import EventCard, { JobEventData } from '@/components/event-card';
import EmptyState from '@/components/empty-state';
import SearchInput from '@/components/search-input';
import Pagination from '@/components/pagination';

const EVENT_TYPES: EventType[] = [
  'APPLICATION_RECEIVED', 'INTERVIEW_REQUEST', 'INTERVIEW_SCHEDULED',
  'ASSESSMENT', 'OFFER', 'REJECTION', 'RECRUITER_OUTREACH', 'OTHER',
];

const VALID_STATUSES: EventStatus[] = ['PENDING', 'CONFIRMED', 'REJECTED'];

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const initialStatus = VALID_STATUSES.includes(searchParams.get('status') as EventStatus)
    ? (searchParams.get('status') as EventStatus)
    : 'PENDING';

  const [events, setEvents] = useState<JobEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventStatus>(initialStatus);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: filter, page: String(page) });
      if (search) params.set('search', search);
      if (typeFilter) params.set('type', typeFilter);

      const res = await fetch(`/api/review?${params}`);
      const data = await res.json();
      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search, typeFilter, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, search, typeFilter]);

  const handleAction = async (eventId: string, action: 'CONFIRM' | 'REJECT') => {
    try {
      await fetch('/api/review/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <div className="flex gap-1">
          {([['PENDING', 'Pending'], ['CONFIRMED', 'Confirmed'], ['REJECTED', 'Dismissed']] as const).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setFilter(status as EventStatus)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and type filter */}
      <div className="flex gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search company or position..."
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All types</option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <EmptyState message="No events found." />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showActions={filter === 'PENDING'}
              onConfirm={(id) => handleAction(id, 'CONFIRM')}
              onDismiss={(id) => handleAction(id, 'REJECT')}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
