import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, FileText, Zap } from 'lucide-react';
import { documentApi, searchApi, type SearchResult } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

const exampleQueries = [
  'Where is authentication explained?',
  'What are the key conclusions?',
  'How does the refund policy work?',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [scope, setScope] = useState<'all' | string>('all');
  const [searched, setSearched] = useState(false);

  const { data: docsData, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.list().then((r) => r.data),
  });

  const completedDocs = (docsData?.documents || []).filter((d) => d.status === 'COMPLETED');

  const handleSearch = async (q?: string) => {
    const searchQuery = (q || query).trim();
    if (!searchQuery) return;
    setQuery(searchQuery);

    setSearching(true);
    setSearched(true);
    try {
      if (scope === 'all') {
        const { data } = await searchApi.all(searchQuery);
        setResults(data.results);
      } else {
        const { data } = await searchApi.document(scope, searchQuery);
        setResults(data.results);
      }
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        title="Smart Search"
        subtitle="Find anything in your files — just describe what you're looking for in plain language."
      />

      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
        className="glass-card p-6 space-y-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-faint)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "Where is login logic explained?"'
              className="input-field pl-11"
            />
          </div>
          <button type="submit" disabled={searching || !query.trim()} className="btn-primary sm:shrink-0">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Search</>}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm text-[var(--text-muted)] shrink-0">Search in:</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="input-field text-sm py-2.5 sm:max-w-xs"
          >
            <option value="all">All documents ({completedDocs.length})</option>
            {completedDocs.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {!searched && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-default)]">
            <span className="text-xs text-[var(--text-faint)] w-full mb-1">Try these:</span>
            {exampleQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSearch(q)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </form>

      {searching && <LoadingSpinner text="Searching your files..." />}

      {searched && !searching && (
        <div className="space-y-4 animate-slide-up">
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--accent)]" />
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matches found"
              description="Try asking in a different way — like how you'd ask a friend. For example: 'Where does it talk about refunds?'"
            />
          ) : (
            results.map((r, i) => (
              <div
                key={i}
                className="glass-card p-5 hover-lift animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] min-w-0">
                    {r.documentName && (
                      <>
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate font-medium text-[var(--text-secondary)]">{r.documentName}</span>
                        <span className="text-[var(--text-faint)]">·</span>
                      </>
                    )}
                    <span className="shrink-0">Section #{r.chunkIndex + 1}</span>
                  </div>
                  <span className="badge-pill bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-glow)] shrink-0">
                    {(r.similarity * 100).toFixed(0)}% relevant
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{r.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
