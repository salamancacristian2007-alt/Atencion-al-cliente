import React from 'react';
import { Clock, Activity, CheckCircle2 } from 'lucide-react';
import { TicketStatus } from '../types';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Pendiente':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-300',
          border: 'border-amber-500/30',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
          icon: Clock,
          label: 'Pendiente',
        };
      case 'En diagnóstico':
        return {
          bg: 'bg-indigo-500/10',
          text: 'text-indigo-300',
          border: 'border-indigo-500/30',
          dot: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)] animate-pulse',
          icon: Activity,
          label: 'En diagnóstico',
        };
      case 'Solucionado':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-300',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
          icon: CheckCircle2,
          label: 'Solucionado',
        };
      default:
        return {
          bg: 'bg-slate-800/80',
          text: 'text-slate-300',
          border: 'border-slate-700/60',
          dot: 'bg-slate-400',
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border backdrop-blur-sm tracking-tight ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <IconComponent className={iconSizes} />
      <span>{config.label}</span>
    </span>
  );
};
