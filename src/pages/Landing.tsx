import { Link, Navigate } from 'react-router-dom';
import {
  Brain, Upload, Search, MessageSquare, Sparkles,
  Zap, Shield, ArrowRight, BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  { icon: Upload, title: 'Add Your Files', desc: 'PDF, Word, or text — just drag and drop', color: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  { icon: Search, title: 'Smart Search', desc: 'Find anything by describing what you need', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { icon: MessageSquare, title: 'Ask Questions', desc: 'Get clear answers from your own files', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
  { icon: Sparkles, title: 'Smart Actions', desc: 'Summaries, flashcards, and quizzes in one click', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  { icon: Zap, title: 'Fast & Simple', desc: 'Upload and start asking — we handle the rest', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your files stay yours — always', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
];

const steps = [
  { num: '01', title: 'Add files', desc: 'Upload what you need' },
  { num: '02', title: 'We read it', desc: 'Automatic processing' },
  { num: '03', title: 'Ask away', desc: 'Questions & search' },
];

export default function Landing() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen page-bg">
      <nav className="sticky top-0 z-30 border-b border-[var(--border-default)] px-6 py-4" style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[var(--text-primary)]">KnowledgeVault</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <Link to="/login" className="btn-secondary text-sm hidden sm:inline-flex">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-24 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-[var(--accent)] mb-8 border border-[var(--accent-glow)]">
          <Sparkles className="w-4 h-4" />
          Your personal knowledge hub
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6 tracking-tight">
          Turn your files into{' '}
          <span className="gradient-text">answers you can trust</span>
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Add PDFs, Word docs, or notes. Ask questions, search naturally, and get summaries —
          all from your own files. No technical setup required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary text-base px-8 py-3 w-full sm:w-auto">
            Get started free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3 w-full sm:w-auto">
            Sign in
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[var(--accent)] opacity-40">{num}</span>
              <div className="text-left">
                <p className="font-semibold text-[var(--text-primary)] text-sm">{title}</p>
                <p className="text-xs text-[var(--text-muted)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            A simple way to work with your documents — built for students, professionals, and anyone who reads a lot.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className="glass-card p-6 hover-lift animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color.split(' ')[0]}`}>
                <Icon className={`w-5 h-5 ${color.split(' ').slice(1).join(' ')}`} />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="glass-card p-10 sm:p-14 border-[var(--accent-glow)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-soft)] to-transparent pointer-events-none" />
          <div className="relative">
            <BookOpen className="w-10 h-10 text-[var(--accent)] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Ready to get started?
            </h2>
            <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto leading-relaxed">
              Add your first file and start asking questions in minutes. It&apos;s free to try.
            </p>
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
