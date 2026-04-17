import { EventStatus } from '@prisma/client';

const colorMap: Record<EventStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-gray-100 text-gray-600',
};

const labelMap: Record<EventStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Dismissed',
};

export default function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}
