// ─── Paginação ────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ─── Destinos ─────────────────────────────────────────────────────────────────
export type DestinationStatus = 'Active' | 'Inactive' | 'Suspended';
export type AuthType = 'ApiKey' | 'BearerToken' | 'JwtBearer' | 'BasicAuth';
export type CircuitBreakerState = 'Closed' | 'Open' | 'HalfOpen';

export interface Destination {
  id: string;
  url: string;
  status: DestinationStatus;
  serverRateLimit: number;
  authType: AuthType | null;
  circuitBreakerState: CircuitBreakerState;
  circuitBreakerFailures: number;
  circuitBreakerNextCheckAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationRequest {
  url: string;
  serverRateLimit?: number;
  authType?: AuthType | null;
  credentials?: Record<string, string> | null;
}

export interface UpdateDestinationRequest {
  url?: string;
  serverRateLimit?: number;
  status?: 'Active' | 'Inactive';
  authType?: AuthType | null;
  credentials?: Record<string, string> | null;
  removeAuth?: boolean;
}

export interface IngestTokenResponse {
  ingestToken: string;
}

// ─── Eventos ──────────────────────────────────────────────────────────────────
export type EventStatus =
  | 'Pending'
  | 'Processing'
  | 'Succeeded'
  | 'Failed'
  | 'WaitingRetry'
  | 'CriticalFailure'
  | 'Cancelled'
  | 'AuthenticationFailed';

export interface Event {
  id: string;
  tenantId: string;
  destinationId: string;
  destinationUrl: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  idempotencyKey: string | null;
  currentRetryCount: number;
  nextAttemptAt: string | null;
  acceptedAt: string;
  deliveredAt: string | null;
}

export interface GetEventsParams extends PaginationParams {
  status?: EventStatus;
  destinationId?: string;
  from?: string;
  to?: string;
}

// ─── Senders ──────────────────────────────────────────────────────────────────
export interface Sender {
  id: string;
  destinationId: string;
  tenantId: string;
  label: string | null;
  hasMapping: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SenderDetail extends Sender {
  mapping: Record<string, unknown> | null;
}

export interface CreateSenderRequest {
  label?: string;
}

// ─── API Keys ─────────────────────────────────────────────────────────────────
export interface ApiKey {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  revokedAt: string | null;
}

export interface CreateApiKeyResponse extends ApiKey {
  rawKey: string;
}

// ─── Usuários ─────────────────────────────────────────────────────────────────
export type UserRole = 'Developer' | 'Admin';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Convites ─────────────────────────────────────────────────────────────────
export type InviteStatus = 'Pending' | 'Used';

export interface InviteToken {
  id: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  status: InviteStatus;
  createdAt: string;
}

// ─── Tenant ───────────────────────────────────────────────────────────────────
export interface Tenant {
  id: string;
  name: string;
  webhookSecret: string;
  maxTrys: number;
  circuitBreakerTimer: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Erros ────────────────────────────────────────────────────────────────────
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
