
import { ConstructionDetail, ClientUser, ErrorReport, Comment, SiteConfig, PricingPlan, NewsletterSubscriber, Tag, CategoryDef } from '../types';
import { DETAILS, CLIENTS, REPORTS, COMMENTS, DEFAULT_CONFIG, DEFAULT_PLANS, SUBSCRIBERS, DEFAULT_CATEGORIES, DEFAULT_TAGS } from '../data/content';

const STORAGE_KEYS = {
  DETAILS: 'ed_details_v7',
  CLIENTS: 'ed_clients_v7',
  REPORTS: 'ed_reports_v7',
  COMMENTS: 'ed_comments_v7',
  CONFIG: 'ed_config_v7',
  PLANS: 'ed_plans_v7',
  SUBSCRIBERS: 'ed_subscribers_v7',
  CATEGORIES: 'ed_categories_v7',
  TAGS: 'ed_tags_v7',
  FAVORITES: 'ed_favorites_v7'
};

export const PersistenceService = {
  // DETAILS
  getDetails: (): ConstructionDetail[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DETAILS);
      return stored ? JSON.parse(stored) : DETAILS;
    } catch (e) { return DETAILS; }
  },
  saveDetails: (details: ConstructionDetail[]) => {
    localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
  },

  // CLIENTS
  getClients: (): ClientUser[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return stored ? JSON.parse(stored) : CLIENTS;
    } catch (e) { return CLIENTS; }
  },
  saveClients: (clients: ClientUser[]) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  // REPORTS
  getReports: (): ErrorReport[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return stored ? JSON.parse(stored) : REPORTS;
    } catch (e) { return REPORTS; }
  },
  saveReports: (reports: ErrorReport[]) => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  // COMMENTS
  getComments: (): Comment[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return stored ? JSON.parse(stored) : COMMENTS;
    } catch (e) { return COMMENTS; }
  },
  saveComments: (comments: Comment[]) => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  },

  // PLANS
  getPlans: (): PricingPlan[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLANS);
      return stored ? JSON.parse(stored) : DEFAULT_PLANS;
    } catch (e) { return DEFAULT_PLANS; }
  },
  savePlans: (plans: PricingPlan[]) => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  // SUBSCRIBERS
  getSubscribers: (): NewsletterSubscriber[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      return stored ? JSON.parse(stored) : SUBSCRIBERS;
    } catch (e) { return SUBSCRIBERS; }
  },
  saveSubscribers: (subscribers: NewsletterSubscriber[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
  },

  // CATEGORIES (Updated Type)
  getCategories: (): CategoryDef[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (e) { return DEFAULT_CATEGORIES; }
  },
  saveCategories: (categories: CategoryDef[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // TAGS
  getTags: (): Tag[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
      return stored ? JSON.parse(stored) : DEFAULT_TAGS;
    } catch (e) { return DEFAULT_TAGS; }
  },
  saveTags: (tags: Tag[]) => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  // SITE CONFIG
  getConfig: (): SiteConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!stored) return DEFAULT_CONFIG;
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed };
    } catch (e) { return DEFAULT_CONFIG; }
  },
  saveConfig: (config: SiteConfig) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  // FAVORITES
  getFavorites: (userId?: string): string[] => {
    try {
      if (userId) {
        const userFavs = localStorage.getItem(`ed_user_fav_${userId}`);
        if (userFavs) return JSON.parse(userFavs);
        // Fallback to client record if available
        const clients = PersistenceService.getClients();
        const client = clients.find(c => c.id === userId);
        if (client && client.favoriteDetailIds) return client.favoriteDetailIds;
      }
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES) || localStorage.getItem('ed_saved_items');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },
  saveFavorites: (favorites: string[], userId?: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      localStorage.setItem('ed_saved_items', JSON.stringify(favorites));
      if (userId) {
        localStorage.setItem(`ed_user_fav_${userId}`, JSON.stringify(favorites));
        const clients = PersistenceService.getClients();
        const updatedClients = clients.map(c => c.id === userId ? { ...c, favoriteDetailIds: favorites } : c);
        PersistenceService.saveClients(updatedClients);
      }
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  },
  toggleFavorite: (detailId: string, userId?: string): { isFavorite: boolean; favorites: string[] } => {
    const currentFavs = PersistenceService.getFavorites(userId);
    const exists = currentFavs.includes(detailId);
    const updated = exists ? currentFavs.filter(id => id !== detailId) : [...currentFavs, detailId];
    PersistenceService.saveFavorites(updated, userId);
    return { isFavorite: !exists, favorites: updated };
  },

  // RESET
  resetDatabase: () => {
    localStorage.clear();
    window.location.reload();
  },

  // BACKUP SYSTEM
  createBackup: (): string => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: 'v7.0',
      data: {
        details: localStorage.getItem(STORAGE_KEYS.DETAILS),
        clients: localStorage.getItem(STORAGE_KEYS.CLIENTS),
        reports: localStorage.getItem(STORAGE_KEYS.REPORTS),
        comments: localStorage.getItem(STORAGE_KEYS.COMMENTS),
        config: localStorage.getItem(STORAGE_KEYS.CONFIG),
        plans: localStorage.getItem(STORAGE_KEYS.PLANS),
        subscribers: localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS),
        categories: localStorage.getItem(STORAGE_KEYS.CATEGORIES),
        tags: localStorage.getItem(STORAGE_KEYS.TAGS),
        favorites: localStorage.getItem(STORAGE_KEYS.FAVORITES),
      }
    };
    return JSON.stringify(backupData, null, 2);
  },

  restoreBackup: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) return false;
      
      const { data } = parsed;
      if (data.details) localStorage.setItem(STORAGE_KEYS.DETAILS, data.details);
      if (data.clients) localStorage.setItem(STORAGE_KEYS.CLIENTS, data.clients);
      if (data.reports) localStorage.setItem(STORAGE_KEYS.REPORTS, data.reports);
      if (data.comments) localStorage.setItem(STORAGE_KEYS.COMMENTS, data.comments);
      if (data.config) localStorage.setItem(STORAGE_KEYS.CONFIG, data.config);
      if (data.plans) localStorage.setItem(STORAGE_KEYS.PLANS, data.plans);
      if (data.subscribers) localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, data.subscribers);
      if (data.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, data.categories);
      if (data.tags) localStorage.setItem(STORAGE_KEYS.TAGS, data.tags);
      if (data.favorites) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, data.favorites);
        localStorage.setItem('ed_saved_items', data.favorites);
      }
      
      return true;
    } catch (e) {
      console.error("Backup restore failed", e);
      return false;
    }
  }
};
