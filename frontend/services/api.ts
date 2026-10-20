import {
  ClientUser,
  ConstructionDetail,
  SiteConfig,
  CategoryDef,
  PricingPlan,
} from "../types";
import { DEFAULT_AVATAR } from "../data/content";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;
  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrf() {
  if (getCookie("XSRF-TOKEN")) return;
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
}

export async function api<T = any>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const method = options.method ?? "GET";
  if (method !== "GET") await ensureCsrf();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(
      data.message ?? "Error de conexión",
      res.status,
      data.errors ?? {},
    );
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
  quota: { used: number; limit: number | null };
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
  me: () => api<ApiUser>("/user"),
  login: (email: string, password: string) =>
    api<ApiUser>("/login", { method: "POST", body: { email, password } }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    profession?: string;
    birth_date?: string | null;
    interests?: string[];
  }) => api<ApiUser>("/register", { method: "POST", body: data }),
  logout: () => api("/logout", { method: "POST" }),
};

// Traduce la respuesta de la API al formato que hoy usa la interfaz.
// El plan es provisorio: free = 'Basic', cualquier plan pago = 'Pro'.
export function toClientUser(u: ApiUser): ClientUser {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    avatarUrl: u.avatar_url ?? DEFAULT_AVATAR,
    plan: u.plan.name,
    status: "Active",
    subscriptionStart: u.subscription?.starts_at?.slice(0, 10) ?? "",
    subscriptionEnd: u.subscription?.ends_at?.slice(0, 10) ?? "",
    monthlyFee: 0,
    profession: u.profession ?? undefined,
    bio: u.bio ?? undefined,
    birthDate: u.birth_date ?? undefined,
    interests: u.interests,
    coverUrl: u.cover_url ?? undefined,
    quotaUsed: u.quota.used,
    quotaLimit: u.quota.limit,
    daysLeft: u.subscription?.days_left ?? null,
  };
}

// ---------- Catálogo, categorías, planes y ajustes ----------

export interface ApiDetailCard {
  id: number;
  slug: string;
  title: string;
  description: string;
  cover_url: string | null;
  category: { id: number; name: string; slug: string } | null;
  subcategory: { id: number; name: string; slug: string } | null;
  author: {
    id: number;
    name: string;
    avatar_url: string | null;
    profession: string | null;
    company: string | null;
  } | null;
  tags: string[];
  is_verified: boolean;
  votes_count: number;
  published_at: string | null;
  required_plan: { slug: string; name: string; level: number } | null;
  locked: boolean;
}

export interface ApiDetailFull extends ApiDetailCard {
  access: { allowed: boolean; reason: 'login' | 'plan' | 'quota' | null };
  specs?: string[];
  materials?: string[];
  images?: { type: string; url: string; caption: string | null }[];
  seo_title?: string | null;
  meta_description?: string | null;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  subcategories: { id: number; name: string; slug: string }[];
}

export interface ApiPlan {
  id: number;
  slug: string;
  name: string;
  price: number;
  interval: string;
  description: string | null;
  features: string[];
  is_recommended: boolean;
  highlight_color: string | null;
}

export const SiteApi = {
  settings: () => api<Record<string, any>>('/settings'),
  categories: () => api<ApiCategory[]>('/categories'),
  plans: () => api<ApiPlan[]>('/plans'),
};

export const DetailsApi = {
  list: () => api<{ data: ApiDetailCard[] }>('/details?per_page=100'),
  show: (slug: string) => api<ApiDetailFull>(`/details/${encodeURIComponent(slug)}`),
};

export function toDetail(d: ApiDetailCard | ApiDetailFull): ConstructionDetail {
  const full = d as Partial<ApiDetailFull>;
  return {
    id: String(d.id),
    slug: d.slug,
    title: d.title,
    category: d.category?.name ?? '',
    subcategory: d.subcategory?.name,
    tags: d.tags,
    description: d.description,
    imageUrl: d.cover_url ?? '',
    specs: full.specs ?? [],
    materials: full.materials ?? [],
    drawings: (full.images ?? []).map((i) => ({
      type: (i.type.charAt(0).toUpperCase() + i.type.slice(1)) as any,
      url: i.url,
      caption: i.caption ?? '',
    })),
    author: {
      name: d.author?.name ?? 'enDetalle',
      avatarUrl: d.author?.avatar_url ?? DEFAULT_AVATAR,
      role: d.author?.profession ?? '',
      team: d.author?.company ?? undefined,
    },
    isVerified: d.is_verified,
    likes: d.votes_count,
    status: 'Published',
    accessLevel: d.required_plan ? 'Pro' : 'Public',
    publishedDate: d.published_at ?? '',
    seoTitle: full.seo_title ?? undefined,
    metaDescription: full.meta_description ?? undefined,
    locked: d.locked,
    requiredPlanName: d.required_plan?.name,
  };
}

export function toCategory(c: ApiCategory): CategoryDef {
  // El id es el slug porque el menú lateral lo usa para elegir el ícono.
  return {
    id: c.slug,
    name: c.name,
    imageUrl: c.image_url ?? '',
    subcategories: c.subcategories.map((s) => s.name),
  };
}

export function toPlan(p: ApiPlan): PricingPlan {
  return {
    id: String(p.id),
    name: p.name,
    price: p.price,
    interval: p.interval === 'year' ? 'yr' : 'mo',
    description: p.description ?? '',
    features: p.features,
    isRecommended: p.is_recommended,
    highlightColor: p.highlight_color ?? undefined,
  };
}

export function toConfig(s: Record<string, any>): SiteConfig {
  return {
    siteTitle: s.site_title ?? 'enDetalle',
    headerImageUrl: s.header_image_url ?? '',
    maintenanceMode: !!s.maintenance_mode,
    socialLinks: s.social_links ?? {},
    termsContent: s.terms_content,
    privacyContent: s.privacy_content,
    homeTitle: s.home_title,
    homeSubtitle: s.home_subtitle,
    footerText: s.footer_text,
    paywallTitle: s.paywall_title,
    paywallDescription: s.paywall_description,
    paywallButtonText: s.paywall_button_text,
  };
}