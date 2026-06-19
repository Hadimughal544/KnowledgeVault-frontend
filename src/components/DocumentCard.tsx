import { Link } from 'react-router-dom';
import {
  MessageSquare, Sparkles, Trash2, ArrowRight,
} from 'lucide-react';
import type { Document } from '../lib/api';
import StatusBadge, { getStatusHint } from './StatusBadge';

interface Props {
  document: Document;
  onDelete: (id: string) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getFileIcon(mime: string) {
  if (mime.includes('pdf')) return '📄';
  if (mime.includes('word')) return '📝';
  if (mime.includes('markdown')) return '📋';
  return '📃';
}

export default function DocumentCard({ document, onDelete }: Props) {
  const isReady = document.status === 'COMPLETED';
  const isProcessing = document.status === 'PENDING' || document.status === 'PROCESSING';
  const statusHint = getStatusHint(document.status);

  return (
    <div className="file-card group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform">
            {getFileIcon(document.mimeType)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate text-base">{document.name}</h3>
            <p className="text-xs text-[var(--text-faint)] truncate mt-0.5">{document.originalName}</p>
          </div>
        </div>
        <StatusBadge status={document.status} />
      </div>

      {/* Status flow hint */}
      {(isProcessing || document.status === 'FAILED') && statusHint && (
        <div className={`flex items-center gap-2 text-xs mb-3 px-3 py-2.5 rounded-xl ${
          document.status === 'FAILED'
            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
            : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
        }`}>
          {isProcessing && (
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
          <span>{document.statusMessage || statusHint}</span>
        </div>
      )}

      {isReady && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ready to ask questions
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-[var(--text-faint)] mb-4">
        <span>{formatSize(document.fileSize)}</span>
        <span>·</span>
        <span>Added {formatDate(document.createdAt)}</span>
      </div>

      <div className="flex items-center gap-2">
        {isReady ? (
          <>
            <Link to={`/documents/${document.id}/chat`} className="btn-primary text-sm flex-1 py-3">
              <MessageSquare className="w-4 h-4" />
              Ask Questions
            </Link>
            <Link to={`/documents/${document.id}/generate`} className="btn-secondary text-sm flex-1 py-3">
              <Sparkles className="w-4 h-4" />
              Smart Actions
            </Link>
          </>
        ) : isProcessing ? (
          <div className="flex-1 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] py-3 rounded-xl bg-[var(--bg-muted)]">
            <span>Processing</span>
            <ArrowRight className="w-4 h-4 opacity-40" />
            <span className="text-[var(--text-faint)]">Ask Questions</span>
          </div>
        ) : null}
        <button
          onClick={() => onDelete(document.id)}
          className="theme-toggle-btn hover:!bg-red-500/10 hover:!text-red-500 hover:!border-red-500/30 min-w-[44px] min-h-[44px]"
          title="Remove file"
          aria-label="Remove file"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
