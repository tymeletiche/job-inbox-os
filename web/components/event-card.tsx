'use client';

import { EventType, EventStatus } from '@prisma/client';
import EventTypeBadge from './event-type-badge';
import StatusBadge from './status-badge';

export interface JobEventData {
  id: string;
  type: EventType;
  status: EventStatus;
  createdAt: string;
  job: {
    id: string;
    company: string;
    position: string;
  };
  emailMessage: {
    subject: string;
    body: string;
    sender: string;
  } | null;
}

interface EventCardProps {
  event: JobEventData;
  showActions?: boolean;
  showStatus?: boolean;
  compact?: boolean;
  onConfirm?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default function EventCard({ event, showActions, showStatus, compact, onConfirm, onDismiss }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center">
          <EventTypeBadge type={event.type} />
          {showStatus && <StatusBadge status={event.status} />}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(event.createdAt).toLocaleDateString()}
        </span>
      </div>

      {event.emailMessage && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">From: {event.emailMessage.sender}</p>
          <p className="font-medium text-sm mt-0.5">{event.emailMessage.subject}</p>
          {!compact && (
            <p className="text-sm text-gray-600 mt-1">
              {event.emailMessage.body.substring(0, 200)}
              {event.emailMessage.body.length > 200 ? '...' : ''}
            </p>
          )}
        </div>
      )}

      <div className="p-2 bg-gray-50 rounded mb-3">
        <p className="font-medium text-sm">{event.job.company}</p>
        <p className="text-xs text-gray-500">{event.job.position}</p>
      </div>

      {showActions && event.status === 'PENDING' && (
        <div className="flex gap-2">
          <button
            onClick={() => onConfirm?.(event.id)}
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm
          </button>
          <button
            onClick={() => onDismiss?.(event.id)}
            className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
