import { EventType } from '@prisma/client';

const colorMap: Record<EventType, string> = {
  OFFER: 'bg-green-100 text-green-800',
  REJECTION: 'bg-red-100 text-red-800',
  INTERVIEW_REQUEST: 'bg-blue-100 text-blue-800',
  INTERVIEW_SCHEDULED: 'bg-blue-100 text-blue-800',
  ASSESSMENT: 'bg-purple-100 text-purple-800',
  APPLICATION_RECEIVED: 'bg-gray-100 text-gray-800',
  RECRUITER_OUTREACH: 'bg-yellow-100 text-yellow-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

export function formatEventType(type: EventType): string {
  return type.replace(/_/g, ' ');
}

export function getEventTypeColor(type: EventType): string {
  return colorMap[type] || 'bg-gray-100 text-gray-800';
}

export default function EventTypeBadge({ type }: { type: EventType }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${getEventTypeColor(type)}`}>
      {formatEventType(type)}
    </span>
  );
}
