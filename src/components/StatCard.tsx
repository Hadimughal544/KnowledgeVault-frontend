import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
}

export default function StatCard({ label, value, icon: Icon, iconClass, bgClass }: Props) {
  return (
    <div className="glass-card p-5 hover-lift group animate-slide-up">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bgClass} group-hover:scale-105 transition-transform`}>
        <Icon className={`w-5 h-5 ${iconClass}`} />
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
      <p className="text-sm text-[var(--text-muted)] mt-1">{label}</p>
    </div>
  );
}
