import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Send, Bot, User, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { documentApi, chatApi, type ChatSource } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentApi.get(id!).then((r) => r.data),
    enabled: !!id,
  });

  const document = data?.document;
  const isReady = document?.status === 'COMPLETED';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const sendMessage = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg || !id || sending) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setSending(true);

    try {
      const { data: res } = await chatApi.send(id, userMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.answer, sources: res.sources },
      ]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Failed to get a response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const suggestions = [
    'What is this document about?',
    'Summarize the key points',
    'Explain the main concepts simply',
    'What are the most important takeaways?',
  ];

  if (isLoading) return <LoadingSpinner text="Loading document..." />;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-7rem)] animate-fade-in">
      <div className="flex items-center gap-4 mb-5">
        <Link to="/dashboard" className="btn-ghost">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-[var(--text-primary)] truncate">{document?.name}</h1>
            {document && <StatusBadge status={document.status} />}
          </div>
          <p className="text-sm text-[var(--text-muted)]">Ask anything — answers come from your file</p>
        </div>
        <Link to={`/documents/${id}/generate`} className="btn-secondary text-sm hidden sm:inline-flex py-2">
          <Sparkles className="w-4 h-4" />
          Smart Actions
        </Link>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.length === 0 && (
            <div className="text-center py-10 sm:py-16">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-5">
                <Bot className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Ask a question</h3>
              <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Type a question below and get an answer based on what&apos;s in your file.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={!isReady}
                    className="text-sm px-4 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] text-[var(--text-secondary)] transition-all disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-slide-up`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[var(--accent)]" />
                </div>
              )}
              <div className={`max-w-[85%] sm:max-w-[75%] group ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-md'
                      : 'text-[var(--text-primary)] rounded-bl-md border border-[var(--border-default)]'
                  }`}
                  style={msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }
                    : { background: 'var(--chat-assistant)' }
                  }
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyText(msg.content, i)}
                    className="mt-1.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-[var(--text-faint)] hover:text-[var(--accent)] transition-all"
                  >
                    {copied === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === i ? 'Copied' : 'Copy'}
                  </button>
                )}
                {msg.sources && msg.sources.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--accent)] select-none">
                      📎 {msg.sources.length} passage{msg.sources.length > 1 ? 's' : ''} used for this answer
                    </summary>
                    <div className="mt-2 space-y-2">
                      {msg.sources.map((s, j) => (
                        <div key={j} className="text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] rounded-xl p-3 border border-[var(--border-default)]">
                          <span className="text-[var(--accent)] font-semibold">
                            {(s.similarity * 100).toFixed(0)}% relevant
                          </span>
                          <p className="mt-1.5 line-clamp-3 leading-relaxed">{s.content}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </div>
              )}
            </div>
          ))}

          {sending && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />
              </div>
              <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm text-[var(--text-muted)] border border-[var(--border-default)]" style={{ background: 'var(--chat-assistant)' }}>
                <span className="inline-flex gap-1">
                  Thinking
                  <span className="animate-pulse">...</span>
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-muted)]"
        >
          {!isReady && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2 text-center">
              We&apos;re still reading your file — you can ask questions once it&apos;s processed.
            </p>
          )}
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isReady ? 'Type your question here…' : 'Almost ready…'}
              className="input-field flex-1"
              disabled={sending || !isReady}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending || !isReady}
              className="btn-primary px-4 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
