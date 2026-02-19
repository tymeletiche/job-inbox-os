'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface GmailStatus {
  connected: boolean;
  email?: string;
  lastSyncAt?: string;
}

interface SyncResult {
  success: boolean;
  ingested: number;
  skipped: number;
  errors: number;
  total: number;
}

export default function Home() {
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gmail/status')
      .then((res) => res.json())
      .then(setGmailStatus)
      .catch(() => setGmailStatus({ connected: false }));

    // Check URL params for OAuth callback results
    const params = new URLSearchParams(window.location.search);
    if (params.get('gmail_connected') === 'true') {
      setError(null);
      // Re-fetch status
      fetch('/api/gmail/status')
        .then((res) => res.json())
        .then(setGmailStatus);
      // Clean URL
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
        // Refresh status
        const statusRes = await fetch('/api/gmail/status');
        setGmailStatus(await statusRes.json());
      }
    } catch {
      setError('Network error during sync');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Job Inbox OS</h1>
        <p className="text-gray-600 mb-8">Turn job emails into actionable events</p>

        <Link
          href="/review"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-8"
        >
          Go to Review Queue
        </Link>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Gmail Integration</h2>

          {gmailStatus === null ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : gmailStatus.connected ? (
            <div>
              <p className="text-green-600 text-sm mb-2">
                Connected: {gmailStatus.email}
              </p>
              {gmailStatus.lastSyncAt && (
                <p className="text-gray-400 text-xs mb-4">
                  Last synced: {new Date(gmailStatus.lastSyncAt).toLocaleString()}
                </p>
              )}
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          ) : (
            <a
              href="/api/auth/gmail"
              className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Connect Gmail
            </a>
          )}

          {syncResult && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-left">
              <p>Ingested: {syncResult.ingested}</p>
              <p>Skipped (already synced): {syncResult.skipped}</p>
              {syncResult.errors > 0 && (
                <p className="text-red-600">Errors: {syncResult.errors}</p>
              )}
              <p className="text-gray-500">Total messages scanned: {syncResult.total}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
