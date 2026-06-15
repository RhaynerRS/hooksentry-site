import { Destination } from '@/lib/api/types';
import { CircuitBreakerBadge } from '@/components/dashboard/status-badge';

export function CircuitBreakerCard({ destination: dest }: { destination: Destination }) {
  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">Circuit Breaker</h3>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground mb-1">Estado atual</dt>
          <dd><CircuitBreakerBadge state={dest.circuitBreakerState} /></dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">Falhas consecutivas</dt>
          <dd>{dest.circuitBreakerFailures}</dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">Threshold</dt>
          <dd>5 falhas</dd>
        </div>

        {(dest.circuitBreakerState === 'Open' || dest.circuitBreakerState === 'HalfOpen') && (
          <>
            {dest.circuitBreakerNextCheckAt && (
              <div>
                <dt className="text-xs text-muted-foreground mb-1">Próxima verificação</dt>
                <dd>{new Date(dest.circuitBreakerNextCheckAt).toLocaleString('pt-BR')}</dd>
              </div>
            )}
          </>
        )}
      </dl>
    </div>
  );
}
