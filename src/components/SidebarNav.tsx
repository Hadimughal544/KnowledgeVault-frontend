import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Home, Search, MessageSquare, Sparkles, FileText, ChevronRight, Loader2,
} from 'lucide-react';
import { documentApi, type Document } from '../lib/api';

interface Props {
  onNavigate?: () => void;
}

const mainNav = [
  { to: '/dashboard', label: 'Home', icon: Home, desc: 'Your files & uploads' },
  { to: '/search', label: 'Smart Search', icon: Search, desc: 'Find anything in your files' },
];

const actionNav = [
  {
    to: '/ask',
    match: '/chat',
    label: 'Ask Questions',
    icon: MessageSquare,
    desc: 'Chat with your files',
  },
  {
    to: '/smart-actions',
    match: '/generate',
    label: 'Smart Actions',
    icon: Sparkles,
    desc: 'Summaries, quizzes & notes',
  },
];

function isActive(path: string, locationPath: string, match?: string) {
  if (locationPath === path || locationPath.startsWith(path + '/')) return true;
  if (match && locationPath.includes(match)) return true;
  return false;
}

function FileQuickLinks({ doc, onNavigate }: { doc: Document; onNavigate?: () => void }) {
  const location = useLocation();
  const chatActive = location.pathname === `/documents/${doc.id}/chat`;
  const actionsActive = location.pathname === `/documents/${doc.id}/generate`;

  return (
    <div className="sidebar-file-item">
      <div className="flex items-center gap-2 min-w-0 mb-2">
        <span className="text-base shrink-0" aria-hidden>📄</span>
        <span className="text-sm font-medium text-[var(--text-primary)] truncate" title={doc.name}>
          {doc.name}
        </span>
      </div>
      <div className="flex gap-1.5">
        <Link
          to={`/documents/${doc.id}/chat`}
          onClick={onNavigate}
          className={`sidebar-file-action ${chatActive ? 'sidebar-file-action-active' : ''}`}
          title={`Ask questions about ${doc.name}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask</span>
        </Link>
        <Link
          to={`/documents/${doc.id}/generate`}
          onClick={onNavigate}
          className={`sidebar-file-action ${actionsActive ? 'sidebar-file-action-active' : ''}`}
          title={`Smart actions for ${doc.name}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Actions</span>
        </Link>
      </div>
    </div>
  );
}

export default function SidebarNav({ onNavigate }: Props) {
  const location = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.list().then((r) => r.data),
    refetchInterval: 8000,
  });

  const readyFiles = (data?.documents || []).filter((d) => d.status === 'COMPLETED');
  const processingCount = (data?.documents || []).filter(
    (d) => d.status === 'PENDING' || d.status === 'PROCESSING'
  ).length;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <p className="sidebar-section-label">Menu</p>
      <nav className="space-y-1 mb-6">
        {mainNav.map(({ to, label, icon: Icon, desc }) => {
          const active = isActive(to, location.pathname);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={`nav-link ${active ? 'nav-link-active' : ''}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <div className="min-w-0">
                <span className="block">{label}</span>
                {!active && (
                  <span className="block text-xs text-[var(--text-faint)] font-normal truncate">{desc}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <p className="sidebar-section-label">AI Assistant</p>
      <nav className="space-y-1 mb-5">
        {actionNav.map(({ to, match, label, icon: Icon, desc }) => {
          const active = isActive(to, location.pathname, match);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={`nav-link ${active ? 'nav-link-active' : ''}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block">{label}</span>
                {!active && (
                  <span className="block text-xs text-[var(--text-faint)] font-normal truncate">{desc}</span>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 opacity-40 ${active ? 'text-[var(--accent)] opacity-100' : ''}`} />
            </Link>
          );
        })}
      </nav>

      <div className="flex-1 min-h-0 flex flex-col">
        <p className="sidebar-section-label flex items-center justify-between">
          <span>Ready to use</span>
          {readyFiles.length > 0 && (
            <span className="text-[var(--accent)] font-semibold normal-case tracking-normal">
              {readyFiles.length}
            </span>
          )}
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1 min-h-0 max-h-48 lg:max-h-none">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-4 text-xs text-[var(--text-faint)]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading files…
            </div>
          ) : readyFiles.length === 0 ? (
            <div className="rounded-xl px-3 py-4 bg-[var(--bg-muted)] border border-[var(--border-default)]">
              <FileText className="w-5 h-5 text-[var(--text-faint)] mb-2" />
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {processingCount > 0
                  ? `${processingCount} file${processingCount > 1 ? 's' : ''} still processing. Check back soon!`
                  : 'Add a file on Home to start asking questions.'}
              </p>
              <Link
                to="/dashboard"
                onClick={onNavigate}
                className="inline-flex items-center gap-1 text-xs text-[var(--accent)] font-medium mt-2 hover:underline"
              >
                Go to Home
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            readyFiles.slice(0, 8).map((doc) => (
              <FileQuickLinks key={doc.id} doc={doc} onNavigate={onNavigate} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
