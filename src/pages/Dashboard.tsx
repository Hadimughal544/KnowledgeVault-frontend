import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, CheckCircle, Loader, Upload, Sparkles, FolderOpen } from 'lucide-react';
import { documentApi } from '../lib/api';
import FileUpload from '../components/FileUpload';
import DocumentCard from '../components/DocumentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { data: docsData, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.list().then((r) => r.data),
    refetchInterval: 5000,
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => documentApi.stats().then((r) => r.data),
    refetchInterval: 5000,
  });

  const handleUpload = useCallback(async (file: File) => {
    await documentApi.upload(file);
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 5000);
  }, [queryClient]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Remove this file? You won\'t be able to ask questions about it anymore.')) return;
    await documentApi.delete(id);
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  }, [queryClient]);

  const stats = statsData?.stats;
  const documents = docsData?.documents || [];

  const statItems = [
    { label: 'My Files', value: stats?.total ?? 0, icon: FileText, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/15' },
    { label: 'Processed', value: stats?.completed ?? 0, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/15' },
    { label: 'Processing', value: stats?.processing ?? 0, icon: Loader, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/15' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Welcome header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          Welcome back
        </h1>
        <p className="text-[var(--text-muted)] mt-2 text-base leading-relaxed max-w-xl">
          Add your files and start asking questions. Your AI assistant reads everything for you.
        </p>
      </div>

      {/* Prominent upload section */}
      <section className="upload-hero animate-slide-up">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-600/25 shrink-0">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Add Your Files</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
              Upload PDFs, Word files, or text files. We&apos;ll turn them into searchable knowledge.
            </p>
          </div>
        </div>

        <FileUpload onUpload={handleUpload} />

        {uploadSuccess && (
          <div className="mt-5 flex items-start gap-3 text-sm bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-5 py-4 animate-fade-in">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-700 dark:text-emerald-300">File added successfully!</p>
              <p className="text-[var(--text-muted)] mt-1">
                We&apos;re reading your file now. Once processed, you can ask questions about it.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-3 sm:gap-4 animate-slide-up">
        {statItems.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4 sm:p-5 text-center">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
              <Icon className={`w-5 h-5 ${color} ${label === 'Processing' && value > 0 ? 'animate-spin' : ''}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* My Files */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <FolderOpen className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            My Files
            {documents.length > 0 && (
              <span className="text-sm font-normal text-[var(--text-muted)] ml-2">({documents.length})</span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <LoadingSpinner text="Loading your files..." />
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No files yet"
            description="Add your first file above — a PDF, Word document, or text file. Once it's processed, you can ask questions and search through it."
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {documents.map((doc, i) => (
              <div key={doc.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <DocumentCard document={doc} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
