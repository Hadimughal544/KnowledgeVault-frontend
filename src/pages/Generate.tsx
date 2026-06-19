import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Sparkles, FileText, Brain, HelpCircle,
  Lightbulb, BookOpen, Loader2, MessageSquare,
} from 'lucide-react';
import { documentApi, generateApi } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const tools = [
  { type: 'summary', label: 'Summary', icon: FileText, desc: 'A clear overview of the main points', color: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  { type: 'flashcards', label: 'Flashcards', icon: Brain, desc: 'Study cards to help you remember', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { type: 'mcq', label: 'Quiz', icon: HelpCircle, desc: 'Test yourself with multiple-choice questions', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
  { type: 'insights', label: 'Key Takeaways', icon: Lightbulb, desc: 'The most important points at a glance', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { type: 'notes', label: 'Study Notes', icon: BookOpen, desc: 'Organized notes you can review anytime', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
];

export default function Generate() {
  const { id } = useParams<{ id: string }>();
  const [activeType, setActiveType] = useState<string | null>(null);
  const [content, setContent] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentApi.get(id!).then((r) => r.data),
    enabled: !!id,
  });

  const document = data?.document;
  const isReady = document?.status === 'COMPLETED';

  const handleGenerate = async (type: string) => {
    if (!id) return;
    setActiveType(type);
    setLoading(true);
    setError('');
    setContent(null);

    try {
      const { data: res } = await generateApi.create(id, type);
      setContent(res.content);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Generation failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    if (activeType === 'flashcards' && Array.isArray(content)) {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(content as { question: string; answer: string }[]).map((card, i) => (
            <div key={i} className="rounded-xl p-4 border border-[var(--border-default)] bg-[var(--bg-muted)] hover:border-[var(--accent-glow)] transition-colors">
              <p className="text-xs font-semibold text-[var(--accent)] mb-2">Card {i + 1}</p>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-3">{card.question}</p>
              <p className="text-sm text-[var(--text-muted)] border-t border-[var(--border-default)] pt-3">{card.answer}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeType === 'mcq' && Array.isArray(content)) {
      return (
        <div className="space-y-5">
          {(content as { question: string; options: string[]; correctIndex: number }[]).map((q, i) => (
            <div key={i} className="rounded-xl p-5 border border-[var(--border-default)] bg-[var(--bg-muted)]">
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">{i + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options?.map((opt, j) => (
                  <div
                    key={j}
                    className={`text-sm px-4 py-2.5 rounded-lg border transition-colors ${
                      j === q.correctIndex
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-medium'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-default)]'
                    }`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + j)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeType === 'insights' && Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {(content as string[]).map((insight, i) => (
            <li key={i} className="flex gap-4 text-sm text-[var(--text-secondary)] p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)]">
              <span className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-xs flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {insight}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed text-sm">
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner text="Loading document..." />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="btn-ghost">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] truncate">{document?.name}</h1>
            {document && <StatusBadge status={document.status} />}
          </div>
          <p className="text-sm text-[var(--text-muted)]">Smart Actions — summaries, quizzes & more</p>
        </div>
        <Link to={`/documents/${id}/chat`} className="btn-secondary text-sm hidden sm:inline-flex py-2">
          <MessageSquare className="w-4 h-4" />
          Ask Questions
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {tools.map(({ type, label, icon: Icon, desc, color }) => (
          <button
            key={type}
            onClick={() => handleGenerate(type)}
            disabled={loading || !isReady}
            className={`glass-card p-5 text-left transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed ${
              activeType === type ? 'ring-2 ring-[var(--accent)] border-[var(--accent-glow)]' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color.split(' ')[0]}`}>
              <Icon className={`w-5 h-5 ${color.split(' ').slice(1).join(' ')}`} />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">{label}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{desc}</p>
          </button>
        ))}
      </div>

      {!isReady && (
        <div className="text-sm text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 mb-6 text-center">
          We&apos;re still reading your file. Smart Actions will be available once it&apos;s processed.
        </div>
      )}

      {loading && (
        <div className="glass-card p-10 text-center animate-fade-in">
          <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-primary)] font-medium">Creating your {activeType}…</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">This usually takes a few seconds</p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {content != null && !loading && (
        <div className="glass-card p-6 sm:p-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border-default)]">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-semibold text-[var(--text-primary)] capitalize text-lg">{activeType}</h2>
          </div>
          {renderContent()}
        </div>
      )}
    </div>
  );
}
