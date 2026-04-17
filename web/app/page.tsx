'use client';

import { useEffect, useState } from 'react';
import { EventType } from '@prisma/client';
import StatCard from '@/components/stat-card';
import EventCard, { JobEventData } from '@/components/event-card';
import EventTypeBadge from '@/components/event-type-badge';
import EmptyState from '@/components/empty-state';

interface DashboardStats {
  pendingEvents: number;
  confirmedEvents: number;
  rejectedEvents: number;
  totalJobs: number;
  eventsByType: Record<string, number>;
  recentEvents: JobEventData[];
}

interface GmailStatus {
  connected: boolean;
  email?: string;
  lastSyncAt?: string;
}

interface SyncResult {
  success: boolean;
  ingested: number;
  skipped: number;
  filtered: number;
  errors: number;
  total: number;
}

const EVENT_TYPES: EventType[] = [
  'APPLICATION_RECEIVED', 'INTERVIEW_REQUEST', 'INTERVIEW_SCHEDULED',
  'ASSESSMENT', 'OFFER', 'REJECTION', 'RECRUITER_OUTREACH', 'OTHER',
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch('/api/gmail/status')
      .then((res) => res.json())
      .then(setGmailStatus)
      .catch(() => setGmailStatus({ connected: false }));

    const params = new URLSearchParams(window.location.search);
    if (params.get('gmail_connected') === 'true') {
      setError(null);
      fetch('/api/gmail/status').then((res) => res.json()).then(setGmailStatus);
      window.history.replaceState({}, '', '/');
    }
    if (params.get('gmail_error')) {
      setError(`Gmail connection failed: ${params.get('gmail_error')}`);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    setError(null);
    try {
      const res = await fetch('/api/gmail/sync', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sync failed');
      } else {
        setSyncResult(data);
        const statusRes = await fetch('/api/gmail/status');
        setGmailStatus(await statusRes.json());
        // Refresh stats after sync
        const statsRes = await fetch('/api/dashboard/stats');
        setStats(await statsRes.json());
      }
    } catch {
      setError('Network error during sync');
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Events" value={stats?.pendingEvents ?? 0} href="/review" />
        <StatCard label="Confirmed" value={stats?.confirmedEvents ?? 0} href="/review?status=CONFIRMED" />
        <StatCard label="Dismissed" value={stats?.rejectedEvents ?? 0} href="/review?status=REJECTED" />
        <StatCard label="Jobs Tracked" value={stats?.totalJobs ?? 0} href="/jobs" />
      </div>

      {/* Events by type */}
      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Events by Type</h2>
        <div className="flex flex-wrap gap-3">
          {EVENT_TYPES.map((type) => {
            const count = stats?.eventsByType[type] ?? 0;
            if (count === 0) return null;
            return (
              <div key={type} className="flex items-center gap-1.5">
                <EventTypeBadge type={type} />
                <span className="text-sm text-gray-600 font-medium">{count}</span>
              </div>
            );
          })}
          {EVENT_TYPES.every((type) => (stats?.eventsByType[type] ?? 0) === 0) && (
            <p className="text-sm text-gray-400">No events yet</p>
          )}
        </div>
      </div>

      {/* Recent events */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Events</h2>
        {stats?.recentEvents && stats.recentEvents.length > 0 ? (
          <div className="space-y-3">
            {stats.recentEvents.map((event) => (
              <EventCard key={event.id} event={event} compact showStatus />
            ))}
          </div>
        ) : (
          <EmptyState message="No events yet. Sync your Gmail or ingest mock emails to get started." />
        )}
      </div>

      {/* Gmail controls */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Gmail Integration</h2>

        {gmailStatus === null ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : gmailStatus.connected ? (
          <div>
            <p className="text-green-600 text-sm mb-1">
              Connected: {gmailStatus.email}
            </p>
            {gmailStatus.lastSyncAt && (
              <p className="text-gray-400 text-xs mb-3">
                Last synced: {new Date(gmailStatus.lastSyncAt).toLocaleString()}
              </p>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        ) : (
          <a
            href="/api/auth/gmail"
            className="inline-block px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Connect Gmail
          </a>
        )}

        {syncResult && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
            <p>Emails scanned: {syncResult.total}</p>
            <p>Ingested: {syncResult.ingested}</p>
            <p className="text-gray-500">Filtered (low confidence): {syncResult.filtered}</p>
            <p className="text-gray-500">Already synced: {syncResult.skipped}</p>
            {syncResult.errors > 0 && <p className="text-red-600">Errors: {syncResult.errors}</p>}
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
