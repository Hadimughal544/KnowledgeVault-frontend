import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { documentApi } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';

const actionHints = ['Summary', 'Flashcards', 'Quiz', 'Study notes'];

export default function ActionsHub() {
  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.list().then((r) => r.data),
  });

  const readyFiles = (data?.documents || []).filter((d) => d.status === 'COMPLETED');
  const processing = (data?.documents || []).filter(
    (d) => d.status === 'PENDING' || d.status === 'PROCESSING'
  );

  if (isLoading) return <LoadingSpinner text="Loading your files..." />;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <PageHeader
        title="Smart Actions"
        subtitle="Choose a file to create summaries, flashcards, quizzes, and study notes automatically."
      />

      {readyFiles.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={processing.length > 0 ? 'Files are still processing' : 'No files ready yet'}
          description={
            processing.length > 0
              ? 'We\'re reading your files now. Smart Actions will be available once they\'re processed.'
              : 'Add a file on Home first, then come back here to generate study materials.'
          }
          action={
            <Link to="/dashboard" className="btn-primary">
              Go to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Select a file to open Smart Actions:
          </p>
          {readyFiles.map((doc) => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}/generate`}
              className="file-picker-card group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">{doc.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {actionHints.join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--accent)] font-medium shrink-0">
                <span className="hidden sm:inline">Open</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
