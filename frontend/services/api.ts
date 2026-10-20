import { ClientUser } from '../types';
import { DEFAULT_AVATAR } from '../data/content';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;
  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrf() {
  if (getCookie('XSRF-TOKEN')) return;
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
}

export async function api<T = any>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const method = options.method ?? 'GET';
  if (method !== 'GET') await ensureCsrf();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  const xsrf = getCookie('XSRF-TOKEN');
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message ?? 'Error de conexión', res.status, data.errors ?? {});
  return data as T;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  cover_url: string | null;
  profession: string | null;
  company: string | null;
  bio: string | null;
  birth_date: string | null;
  interests: string[];
  portfolio_url: string | null;
  roles: string[];
  plan: {
    slug: string;
    name: string;
    level: number;
    detail_limit: number | null;
    allows_dwg: boolean;
    allows_skp: boolean;
    allows_ebooks: boolean;
  };
  subscription: {
    status: string;
    starts_at: string | null;
    ends_at: string | null;
    days_left: number | null;
  } | null;
}

export const AuthApi = {
  me: () => api<ApiUser>('/user'),
  login: (email: string, password: string) =>
    api<ApiUser>('/login', { method: 'POST', body: { email, password } }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    profession?: string;
    birth_date?: string | null;
    interests?: string[];
  }) => api<ApiUser>('/register', { method: 'POST', body: data }),
  logout: () => api('/logout', { method: 'POST' }),
};

// Traduce la respuesta de la API al formato que hoy usa la interfaz.
// El plan es provisorio: free = 'Basic', cualquier plan pago = 'Pro'.
export function toClientUser(u: ApiUser): ClientUser {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    avatarUrl: u.avatar_url ?? DEFAULT_AVATAR,
    plan: u.plan.slug === 'free' ? 'Basic' : 'Pro',
    status: 'Active',
    subscriptionStart: u.subscription?.starts_at?.slice(0, 10) ?? '',
    subscriptionEnd: u.subscription?.ends_at?.slice(0, 10) ?? '',
    monthlyFee: 0,
    profession: u.profession ?? undefined,
    bio: u.bio ?? undefined,
    birthDate: u.birth_date ?? undefined,
    interests: u.interests,
    coverUrl: u.cover_url ?? undefined,
  };
}