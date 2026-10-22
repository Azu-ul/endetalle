import { ConstructionDetail } from "../types";

export type SortOption = "popular" | "date" | "az" | "za";
export type AccessFilter = "all" | "free" | "pro";
export type PeriodFilter = "any" | "week" | "month" | "year";

export interface ExplorerFilters {
  categories: string[]; // categorías elegidas (alguna de ellas)
  subcategories: string[]; // claves "Categoría::Subcategoría" (ver subKey)
  tags: string[]; // alguna de las etiquetas elegidas
  author: string; // "all" o nombre del autor
  access: AccessFilter;
  period: PeriodFilter;
  verifiedOnly: boolean;
  availableOnly: boolean; // solo los que el plan del usuario puede abrir
  favoritesOnly: boolean;
}

export const DEFAULT_FILTERS: ExplorerFilters = {
  categories: [],
  subcategories: [],
  tags: [],
  author: "all",
  access: "all",
  period: "any",
  verifiedOnly: false,
  availableOnly: false,
  favoritesOnly: false,
};

// Grupos de filtros que se pueden "saltear" para calcular los contadores:
// el contador de cada opción muestra cuántos resultados daría elegirla,
// sin contar la selección que ya hay en su propio grupo.
export type FilterGroup = "categories" | "tags" | "author" | "access";

const PERIOD_DAYS: Record<Exclude<PeriodFilter, "any">, number> = {
  week: 7,
  month: 30,
  year: 365,
};

// Clave única de una subcategoría (dos categorías pueden repetir un nombre)
export const subKey = (category: string, sub: string) => `${category}::${sub}`;

// Minúsculas y sin tildes: "hormigon" encuentra "Hormigón"
export const normalizeText = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function matchesSearch(d: ConstructionDetail, term: string): boolean {
  const q = normalizeText(term.trim());
  if (!q) return true;
  return (
    normalizeText(d.title).includes(q) ||
    normalizeText(d.description).includes(q) ||
    (d.tags ?? []).some((t) => normalizeText(t).includes(q)) ||
    normalizeText(d.author.name).includes(q)
  );
}

// Categorías: alguna de las elegidas. Si de una categoría se eligieron
// subcategorías, de esa categoría solo entran esas; si no, entra completa.
function matchesCategories(d: ConstructionDetail, f: ExplorerFilters) {
  if (f.categories.length === 0) return true;
  if (!f.categories.includes(d.category)) return false;
  const prefix = `${d.category}::`;
  const chosen = f.subcategories.filter((k) => k.startsWith(prefix));
  if (chosen.length === 0) return true;
  return !!d.subcategory && chosen.includes(subKey(d.category, d.subcategory));
}

export function matchesFilters(
  d: ConstructionDetail,
  f: ExplorerFilters,
  favoriteIds: string[],
  skip?: FilterGroup,
): boolean {
  if (skip !== "categories" && !matchesCategories(d, f)) return false;
  if (
    skip !== "tags" &&
    f.tags.length > 0 &&
    !(d.tags ?? []).some((t) => f.tags.includes(t))
  ) {
    return false;
  }
  if (skip !== "author" && f.author !== "all" && d.author.name !== f.author) {
    return false;
  }
  if (skip !== "access") {
    if (f.access === "free" && d.requiredPlanName) return false;
    if (f.access === "pro" && !d.requiredPlanName) return false;
  }
  if (f.verifiedOnly && !d.isVerified) return false;
  if (f.availableOnly && d.locked) return false;
  if (f.favoritesOnly && !favoriteIds.includes(d.id)) return false;
  if (f.period !== "any") {
    const published = new Date(d.publishedDate || 0).getTime();
    if (!published || published < Date.now() - PERIOD_DAYS[f.period] * 86400000) {
      return false;
    }
  }
  return true;
}

// Búsqueda + filtros en un solo paso (devuelve una lista nueva)
export function filterDetails(
  details: ConstructionDetail[],
  opts: {
    search: string;
    filters: ExplorerFilters;
    favoriteIds: string[];
    skip?: FilterGroup;
  },
): ConstructionDetail[] {
  const { search, filters, favoriteIds, skip } = opts;
  return details.filter(
    (d) =>
      matchesSearch(d, search) && matchesFilters(d, filters, favoriteIds, skip),
  );
}

// ¿Hay algún filtro puesto (categorías incluidas)?
export function hasAnyFilter(f: ExplorerFilters): boolean {
  return (
    f.categories.length > 0 ||
    f.subcategories.length > 0 ||
    countPanelFilters(f) > 0
  );
}

// Cantidad de filtros activos que viven en el panel "Filtros"
// (las categorías no cuentan: siempre se ven en su propia fila)
export function countPanelFilters(f: ExplorerFilters): number {
  return (
    f.tags.length +
    (f.author !== "all" ? 1 : 0) +
    (f.access !== "all" ? 1 : 0) +
    (f.period !== "any" ? 1 : 0) +
    (f.verifiedOnly ? 1 : 0) +
    (f.availableOnly ? 1 : 0) +
    (f.favoritesOnly ? 1 : 0)
  );
}

// Título del explorador según lo seleccionado
export function getSelectionTitle(f: ExplorerFilters): string {
  if (f.categories.length === 0) return "Explorador";
  if (f.categories.length === 1) {
    const cat = f.categories[0];
    const subs = f.subcategories
      .filter((k) => k.startsWith(`${cat}::`))
      .map((k) => k.slice(cat.length + 2));
    if (subs.length === 1) return `${cat} > ${subs[0]}`;
    return cat;
  }
  return `${f.categories.length} categorías`;
}