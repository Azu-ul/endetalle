export interface Author {
  name: string;
  avatarUrl: string;
  role: string;
  team?: string;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: string;
  status: "Active" | "Expired" | "Trial";
  subscriptionStart: string;
  subscriptionEnd: string;
  monthlyFee: number;
  // New Profile Fields
  profession?: string;
  bio?: string;
  birthDate?: string;
  interests?: string[];
  coverUrl?: string;
  favoriteDetailIds?: string[];
  quotaUsed?: number;
  quotaLimit?: number | null;
  daysLeft?: number | null;
  roles?: string[];
}

export interface ErrorReport {
  id: string;
  detailId: string;
  detailTitle: string;
  description: string;
  status: "Pending" | "Resolved";
  submittedAt: string;
}

export interface Comment {
  id: string;
  detailId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  role?: string;
}

export interface InternalMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  unread: boolean;
}

export interface SiteConfig {
  siteTitle: string;
  headerImageUrl: string;
  maintenanceMode: boolean;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
  address?: string;
  termsContent?: string;
  privacyContent?: string;
  // Editable Texts
  homeTitle?: string;
  homeSubtitle?: string;
  footerText?: string;
  // Paywall Texts
  paywallTitle?: string;
  paywallDescription?: string;
  paywallButtonText?: string;
}

// Un período de pago de un plan (mensual, 3 meses, anual) con su total en cada moneda
export interface PlanPeriod {
  id: "monthly" | "quarterly" | "yearly";
  months: number;
  discountPercent: number;
  totalArs: number;
  totalUsd: number;
  perMonthArs: number;
  perMonthUsd: number;
}

export interface PricingPlan {
  id: string;
  slug?: string;
  name: string;
  price: number;
  priceArs?: number;
  priceUsd?: number;
  periods?: PlanPeriod[];
  interval: "mo" | "yr";
  description: string;
  features: string[];
  isRecommended?: boolean;
  highlightColor?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: "Subscribed" | "Unsubscribed";
}

export interface Tag {
  id: string;
  name: string;
}

// NEW HIERARCHICAL CATEGORY DEFINITION
export interface CategoryDef {
  id: string;
  name: string;
  imageUrl: string;
  subcategories: string[];
}

export type PublicationStatus = "Published" | "Draft" | "Archived";
export type AccessLevel = "Public" | "Pro" | "Enterprise";

export interface ConstructionDetail {
  id: string;
  title: string;
  category: string; // Parent Category Name
  subcategory?: string; // Optional Child Category
  tags?: string[];
  description: string;
  imageUrl: string;
  specs: string[];
  materials: string[];
  drawings: {
    type: "Section" | "Plan" | "Elevation" | "Axonometric" | "Detail";
    url: string;
    caption: string;
  }[];
  author: Author;
  isVerified: boolean;
  likes: number;
  status: PublicationStatus;
  accessLevel: AccessLevel;
  publishedDate: string;
  slug?: string;
  seoTitle?: string;
  metaDescription?: string;
  locked?: boolean;
  requiredPlanName?: string;
}

export interface LiveStat {
  visitors: number;
  users: number;
  staff: number;
  trend: number[];
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: number;
}
