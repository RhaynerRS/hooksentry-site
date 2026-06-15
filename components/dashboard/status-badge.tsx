'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { CircuitBreakerState, EventStatus, DestinationStatus } from '@/lib/api/types';

const EVENT_CLASS: Record<EventStatus, string> = {
  Pending:              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Processing:           'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Succeeded:            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Failed:               'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  WaitingRetry:         'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  CriticalFailure:      'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100 font-semibold',
  Cancelled:            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  AuthenticationFailed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const CB_CLASS: Record<CircuitBreakerState, string> = {
  Closed:   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Open:     'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  HalfOpen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const DEST_CLASS: Record<DestinationStatus, string> = {
  Active:    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Inactive:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Suspended: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

const FALLBACK_CLASS = 'bg-muted text-muted-foreground';
const BASE = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs';

interface BadgeProps { className?: string }

export function EventStatusBadge({ status, className }: { status: EventStatus } & BadgeProps) {
  const t = useTranslations('status.event');
  const cls = status ? (EVENT_CLASS[status] ?? FALLBACK_CLASS) : FALLBACK_CLASS;
  const label = status && EVENT_CLASS[status] ? t(status as Parameters<typeof t>[0]) : (status ?? '—');
  return <span className={cn(BASE, cls, className)}>{label}</span>;
}

export function CircuitBreakerBadge({ state, className }: { state: CircuitBreakerState } & BadgeProps) {
  const t = useTranslations('status.circuitBreaker');
  const cls = state ? (CB_CLASS[state] ?? FALLBACK_CLASS) : FALLBACK_CLASS;
  const label = state && CB_CLASS[state] ? t(state as Parameters<typeof t>[0]) : (state ?? '—');
  return <span className={cn(BASE, cls, className)}>{label}</span>;
}

export function DestinationStatusBadge({ status, className }: { status: DestinationStatus } & BadgeProps) {
  const t = useTranslations('status.destination');
  const cls = status ? (DEST_CLASS[status] ?? FALLBACK_CLASS) : FALLBACK_CLASS;
  const label = status && DEST_CLASS[status] ? t(status as Parameters<typeof t>[0]) : (status ?? '—');
  return <span className={cn(BASE, cls, className)}>{label}</span>;
}

// ─── Generic badge ─────────────────────────────────────────────────────────────

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
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', VARIANT_CLASSES[variant], className)}>
      {label}
    </span>
  );
}
