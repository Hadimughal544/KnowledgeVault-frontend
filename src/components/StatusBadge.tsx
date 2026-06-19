import type { Document } from '../lib/api';

const config = {
  PENDING: { label: 'Waiting', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' },
  PROCESSING: { label: 'Processing', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' },
  COMPLETED: { label: 'Processed', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' },
  FAILED: { label: 'Failed', className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30' },
};

export default function StatusBadge({ status }: { status: Document['status'] }) {
  const { label, className } = config[status];
  return (
    <span className={`badge-pill ${className}`}>
      {status === 'PROCESSING' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label}
    </span>
  );
}

export function getStatusHint(status: Document['status']): string | null {
  switch (status) {
    case 'PENDING':
      return 'Your file is in the queue…';
    case 'PROCESSING':
      return 'Reading your file — almost ready to ask questions';
    case 'COMPLETED':
      return 'Ready! You can ask questions now';
    case 'FAILED':
      return 'Something went wrong. Try uploading again.';
    default:
      return null;
  }
}
