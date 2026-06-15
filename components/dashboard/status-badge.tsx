import { cn } from '@/lib/utils';
import type { CircuitBreakerState, EventStatus, DestinationStatus } from '@/lib/api/types';

// ─── Typed badges ─────────────────────────────────────────────────────────────

const EVENT_STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
  Pending:              { label: 'Pendente',     className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  Processing:           { label: 'Processando',  className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  Succeeded:            { label: 'Entregue',     className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  Failed:               { label: 'Falhou',       className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  WaitingRetry:         { label: 'Retentativa',  className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  CriticalFailure:      { label: 'Falha Crítica',className: 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100 font-semibold' },
  Cancelled:            { label: 'Cancelado',    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  AuthenticationFailed: { label: 'Auth Falhou',  className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
};

const CB_STATE_CONFIG: Record<CircuitBreakerState, { label: string; className: string }> = {
  Closed:   { label: 'Fechado',     className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  Open:     { label: 'Aberto',      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  HalfOpen: { label: 'Meio-Aberto', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
};

const DEST_STATUS_CONFIG: Record<DestinationStatus, { label: string; className: string }> = {
  Active:    { label: 'Ativo',    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  Inactive:  { label: 'Inativo',  className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  Suspended: { label: 'Suspenso', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
};

interface BadgeProps { className?: string }

const FALLBACK = { label: '', className: 'bg-muted text-muted-foreground' } as const;

export function EventStatusBadge({ status, className }: { status: EventStatus } & BadgeProps) {
  const config = EVENT_STATUS_CONFIG[status] ?? FALLBACK;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs', config.className, className)}>
      {config.label || status}
    </span>
  );
}

export function CircuitBreakerBadge({ state, className }: { state: CircuitBreakerState } & BadgeProps) {
  const config = CB_STATE_CONFIG[state] ?? FALLBACK;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs', config.className, className)}>
      {config.label || state}
    </span>
  );
}

export function DestinationStatusBadge({ status, className }: { status: DestinationStatus } & BadgeProps) {
  const config = DEST_STATUS_CONFIG[status] ?? FALLBACK;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs', config.className, className)}>
      {config.label || status}
    </span>
  );
}

// ─── Generic badge (used by shared components) ─────────────────────────────────

type StatusVariant = 'success' | 'error' | 'warning' | 'pending' | 'default';

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  error:   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ label, variant = 'default', className }: {
  label: string;
  variant?: StatusVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
