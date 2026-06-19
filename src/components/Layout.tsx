import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Brain, LogOut, Sparkles, Menu, X, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import SidebarNav from './SidebarNav';

function getBreadcrumb(path: string): string | null {
  if (path === '/dashboard') return 'Home';
  if (path.startsWith('/search')) return 'Smart Search';
  if (path === '/ask' || path.includes('/chat')) return 'Ask Questions';
  if (path === '/smart-actions' || path.includes('/generate')) return 'Smart Actions';
  return null;
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const breadcrumb = getBreadcrumb(location.pathname);
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex page-bg">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--border-default)] transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex flex-col h-full p-5 min-h-0">
          <Link to="/dashboard" className="flex items-center gap-3 mb-6 px-2 group shrink-0" onClick={closeMobile}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[var(--text-primary)] text-lg leading-tight">KnowledgeVault</h1>
              <p className="text-xs text-[var(--text-faint)]">Your personal knowledge hub</p>
            </div>
          </Link>

          <SidebarNav onNavigate={closeMobile} />

          <div className="shrink-0 pt-4 mt-4 border-t border-[var(--border-default)] space-y-3">
            <div className="rounded-2xl p-3 bg-[var(--accent-soft)] border border-[var(--accent-glow)]">
              <div className="flex items-center gap-2 text-xs text-[var(--accent)] font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by AI
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 py-2.5 rounded-2xl bg-[var(--bg-muted)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-[var(--text-faint)] truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="nav-link w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={closeMobile} />
      )}

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen min-w-0">
        <header
          className="sticky top-0 z-20 border-b border-[var(--border-default)] px-4 py-3.5 lg:px-8 shrink-0"
          style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden theme-toggle-btn shrink-0"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Open menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {breadcrumb && (
                <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] min-w-0 truncate">
                  <Link to="/dashboard" className="hover:text-[var(--text-primary)] shrink-0">Home</Link>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[var(--text-primary)] font-medium truncate">{breadcrumb}</span>
                </div>
              )}
            </div>
            <ThemeToggle compact />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fade-in overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
