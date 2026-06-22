import { Link, useLocation } from 'react-router-dom';
import {
  Home, Search, MessageSquare, Sparkles, ChevronRight,
} from 'lucide-react';

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

export default function SidebarNav({ onNavigate }: Props) {
  const location = useLocation();

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
    </div>
  );
}
