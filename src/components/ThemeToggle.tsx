import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, applyTheme, type Theme } from '../store/themeStore';

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

interface Props {
  compact?: boolean;
}

export default function ThemeToggle({ compact }: Props) {
  const { theme, setTheme } = useThemeStore();
  const resolved = theme === 'system' ? getSystemTheme() : theme;

  const cycleTheme = () => {
    const next: Theme = resolved === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  if (compact) {
    return (
      <button
        onClick={cycleTheme}
        className="theme-toggle-btn"
        title={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
        aria-label="Toggle theme"
      >
        {resolved === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-default)]">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => { setTheme(value); applyTheme(value); }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            theme === value
              ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
          title={label}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
