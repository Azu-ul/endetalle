import React, { useMemo, useState } from "react";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryDef, ConstructionDetail } from "../types";
import {
  DEFAULT_FILTERS,
  countPanelFilters,
  filterDetails,
  hasAnyFilter,
  normalizeText,
  subKey,
  type AccessFilter,
  type ExplorerFilters,
  type PeriodFilter,
  type SortOption,
} from "./explorerFilters";

interface ExplorerToolbarProps {
  details: ConstructionDetail[]; // los detalles visibles, SIN filtrar (para los contadores)
  favoriteIds: string[];
  categories: CategoryDef[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: ExplorerFilters;
  onFiltersChange: (filters: ExplorerFilters) => void;
  resultCount: number;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "popular", label: "Más popular" },
  { id: "date", label: "Más reciente" },
  { id: "az", label: "A → Z" },
  { id: "za", label: "Z → A" },
];

const ACCESS_OPTIONS: { id: AccessFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

const PERIOD_OPTIONS: { id: PeriodFilter; label: string }[] = [
  { id: "any", label: "Cualquiera" },
  { id: "week", label: "Última semana" },
  { id: "month", label: "Último mes" },
  { id: "year", label: "Último año" },
];

// Cuántas etiquetas se ven antes de "Ver todas"
const TAGS_COLLAPSED = 12;

const sectionLabel =
  "text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2";

const selectClass =
  "w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50";

// Cuántos resultados daría una opción (el número chiquito de cada chip)
const Count: React.FC<{ n: number; active: boolean }> = ({ n, active }) => (
  <span
    className={`text-[11px] font-bold tabular-nums leading-none px-1.5 py-1 rounded-full ${
      active
        ? "bg-slate-900/15 text-slate-900"
        : "bg-slate-100 dark:bg-dark-bg text-slate-500 dark:text-slate-400"
    }`}
  >
    {n}
  </span>
);

// Chip grande de categoría (fila principal)
const CategoryChip: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}> = ({ label, count, active, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`inline-flex shrink-0 items-center gap-2 h-10 px-4 rounded-full text-sm font-semibold border whitespace-nowrap select-none transition-all active:scale-95 ${
      active
        ? "bg-primary-400 text-slate-900 border-primary-400 shadow-sm shadow-primary-400/30"
        : `bg-white dark:bg-dark-surface text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:border-primary-400 hover:text-slate-900 dark:hover:text-white ${count === 0 ? "opacity-50 hover:opacity-100" : ""}`
    }`}
  >
    {active && <Check size={14} strokeWidth={3} />}
    <span>{label}</span>
    <Count n={count} active={active} />
  </button>
);

// Chip chico (subcategorías, etiquetas, períodos)
const SmallChip: React.FC<{
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}> = ({ label, count, active, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
      active
        ? "bg-primary-400 text-slate-900 border-primary-400"
        : `bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-bg ${count === 0 ? "opacity-50 hover:opacity-100" : ""}`
    }`}
  >
    {active && <Check size={12} strokeWidth={3} />}
    <span>{label}</span>
    {count !== undefined && (
      <span
        className={`tabular-nums font-semibold ${active ? "text-slate-900/60" : "text-slate-400"}`}
      >
        {count}
      </span>
    )}
  </button>
);

const ToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between py-1.5 text-sm text-slate-700 dark:text-slate-300"
  >
    <span>{label}</span>
    <span
      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${checked ? "bg-primary-400" : "bg-slate-200 dark:bg-slate-700"}`}
    >
      <span
        className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`}
      />
    </span>
  </button>
);

const ExplorerToolbar: React.FC<ExplorerToolbarProps> = ({
  details,
  favoriteIds,
  categories,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
  resultCount,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagQuery, setTagQuery] = useState("");

  const update = (patch: Partial<ExplorerFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  // ---------- Categorías (se pueden elegir varias a la vez) ----------
  const toggleCategory = (name: string) => {
    if (filters.categories.includes(name)) {
      // Al sacar una categoría también se sacan sus subcategorías
      update({
        categories: filters.categories.filter((c) => c !== name),
        subcategories: filters.subcategories.filter(
          (k) => !k.startsWith(`${name}::`),
        ),
      });
    } else {
      update({ categories: [...filters.categories, name] });
    }
  };

  const toggleSub = (cat: string, sub: string) => {
    const key = subKey(cat, sub);
    update({
      subcategories: filters.subcategories.includes(key)
        ? filters.subcategories.filter((k) => k !== key)
        : [...filters.subcategories, key],
    });
  };

  const toggleTag = (tag: string) =>
    update({
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag],
    });

  const clearAll = () => {
    onFiltersChange(DEFAULT_FILTERS);
    setTagQuery("");
  };

  // ---------- Contadores: cuántos resultados daría cada opción ----------
  const facets = useMemo(() => {
    const base = { search: searchTerm, filters, favoriteIds };
    const tally = (list: ConstructionDetail[], keys: (d: ConstructionDetail) => string[]) => {
      const m = new Map<string, number>();
      list.forEach((d) => keys(d).forEach((k) => m.set(k, (m.get(k) ?? 0) + 1)));
      return m;
    };

    const forCategories = filterDetails(details, { ...base, skip: "categories" });
    const forTags = filterDetails(details, { ...base, skip: "tags" });
    const forAuthor = filterDetails(details, { ...base, skip: "author" });
    const forAccess = filterDetails(details, { ...base, skip: "access" });

    return {
      allCategories: forCategories.length,
      category: tally(forCategories, (d) => [d.category]),
      sub: tally(forCategories, (d) =>
        d.subcategory ? [subKey(d.category, d.subcategory)] : [],
      ),
      tag: tally(forTags, (d) => d.tags ?? []),
      author: tally(forAuthor, (d) => [d.author.name]),
      access: {
        all: forAccess.length,
        free: forAccess.filter((d) => !d.requiredPlanName).length,
        pro: forAccess.filter((d) => !!d.requiredPlanName).length,
      },
    };
  }, [details, filters, searchTerm, favoriteIds]);

  // Etiquetas: las más usadas primero (y siempre se ven las elegidas)
  const allTags = useMemo(() => {
    const names = Array.from(new Set(details.flatMap((d) => d.tags ?? [])));
    return names.sort(
      (a, b) =>
        (facets.tag.get(b) ?? 0) - (facets.tag.get(a) ?? 0) ||
        a.localeCompare(b, "es", { sensitivity: "base" }),
    );
  }, [details, facets.tag]);

  const authors = useMemo(
    () =>
      Array.from(new Set(details.map((d) => d.author.name))).sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" }),
      ),
    [details],
  );

  const tagQ = normalizeText(tagQuery.trim());
  const visibleTags = allTags.filter((t, i) => {
    if (tagQ) return normalizeText(t).includes(tagQ);
    return showAllTags || i < TAGS_COLLAPSED || filters.tags.includes(t);
  });
  const hiddenTagCount = allTags.length - visibleTags.length;

  // ---------- Filtros activos (los del panel; las categorías ya se ven arriba) ----------
  const panelCount = countPanelFilters(filters);
  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  filters.tags.forEach((tag) =>
    chips.push({
      key: `tag-${tag}`,
      label: `#${tag}`,
      onRemove: () => toggleTag(tag),
    }),
  );
  if (filters.author !== "all") {
    chips.push({
      key: "author",
      label: `Autor: ${filters.author}`,
      onRemove: () => update({ author: "all" }),
    });
  }
  if (filters.access !== "all") {
    chips.push({
      key: "access",
      label: filters.access === "free" ? "Free" : "Pro",
      onRemove: () => update({ access: "all" }),
    });
  }
  if (filters.period !== "any") {
    chips.push({
      key: "period",
      label: PERIOD_OPTIONS.find((p) => p.id === filters.period)?.label ?? "",
      onRemove: () => update({ period: "any" }),
    });
  }
  if (filters.verifiedOnly) {
    chips.push({
      key: "verified",
      label: "Verificados",
      onRemove: () => update({ verifiedOnly: false }),
    });
  }
  if (filters.availableOnly) {
    chips.push({
      key: "available",
      label: "Disponibles para mi plan",
      onRemove: () => update({ availableOnly: false }),
    });
  }
  if (filters.favoritesOnly) {
    chips.push({
      key: "favorites",
      label: "Mis favoritos",
      onRemove: () => update({ favoritesOnly: false }),
    });
  }

  // Categorías elegidas que tienen subcategorías (para la segunda fila)
  const selectedWithSubs = categories.filter(
    (c) => filters.categories.includes(c.name) && c.subcategories.length > 0,
  );

  return (
    <div
      className="mb-6"
      onKeyDown={(e) => {
        if (e.key === "Escape" && filtersOpen) setFiltersOpen(false);
      }}
    >
      {/* BÚSQUEDA + ORDEN + BOTÓN DE FILTROS */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, descripción, etiqueta o autor..."
            className="w-full h-12 pl-12 pr-12 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-base text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              title="Borrar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            title="Ordenar por"
            className="h-12 flex-1 md:flex-none px-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className={`h-12 px-5 rounded-2xl border shadow-sm flex items-center gap-2 text-sm font-bold transition-colors ${filtersOpen || panelCount > 0 ? "bg-slate-100 dark:bg-dark-bg border-slate-200 dark:border-dark-border text-primary-600" : "bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-bg"}`}
          >
            <SlidersHorizontal size={16} />
            <span>Filtros</span>
            {panelCount > 0 && (
              <span className="bg-primary-400 text-slate-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {panelCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* CATEGORÍAS: siempre a la vista, se pueden elegir varias */}
      <div
        role="group"
        aria-label="Categorías"
        className="no-scrollbar flex gap-2 mt-4 pb-1 overflow-x-auto md:flex-wrap md:overflow-visible"
      >
        <CategoryChip
          label="Todas"
          count={facets.allCategories}
          active={filters.categories.length === 0}
          onClick={() =>
            update({ categories: [], subcategories: [] })
          }
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.name}
            count={facets.category.get(c.name) ?? 0}
            active={filters.categories.includes(c.name)}
            onClick={() => toggleCategory(c.name)}
          />
        ))}
      </div>

      {/* SUBCATEGORÍAS de las categorías elegidas */}
      {selectedWithSubs.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedWithSubs.map((c) => (
            <div
              key={c.id}
              role="group"
              aria-label={`Subcategorías de ${c.name}`}
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 dark:bg-dark-surface/60 border border-slate-200 dark:border-dark-border px-3 py-2.5"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                {c.name}
              </span>
              {c.subcategories.map((sub) => {
                const key = subKey(c.name, sub);
                return (
                  <SmallChip
                    key={key}
                    label={sub}
                    count={facets.sub.get(key) ?? 0}
                    active={filters.subcategories.includes(key)}
                    onClick={() => toggleSub(c.name, sub)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* RESUMEN: resultados + filtros activos */}
      {hasAnyFilter(filters) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
            {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
          </span>
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold bg-primary-400/10 text-primary-700 dark:text-primary-400 border border-primary-400/30"
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                aria-label={`Quitar filtro ${chip.label}`}
                title="Quitar filtro"
                className="p-0.5 rounded-full hover:bg-primary-400/20 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-2"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* PANEL DE FILTROS */}
      <div
        aria-hidden={!filtersOpen}
        className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr] opacity-100 visible mt-3" : "grid-rows-[0fr] opacity-0 invisible"}`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-2xl shadow-sm">
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda: acceso, fecha, autor y opciones */}
              <div className="space-y-5">
                <div>
                  <div className={sectionLabel}>Acceso</div>
                  <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-dark-bg">
                    {ACCESS_OPTIONS.map((o) => {
                      const active = filters.access === o.id;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => update({ access: o.id })}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            active
                              ? "bg-white dark:bg-dark-surface text-slate-900 dark:text-white shadow-sm"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                          }`}
                        >
                          {o.label}{" "}
                          <span className="tabular-nums font-semibold opacity-60">
                            {facets.access[o.id]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className={sectionLabel}>Publicado</div>
                  <div className="flex flex-wrap gap-2">
                    {PERIOD_OPTIONS.map((o) => (
                      <SmallChip
                        key={o.id}
                        label={o.label}
                        active={filters.period === o.id}
                        onClick={() => update({ period: o.id })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className={sectionLabel}>Autor</div>
                  <select
                    value={filters.author}
                    onChange={(e) => update({ author: e.target.value })}
                    className={selectClass}
                  >
                    <option value="all">Todos</option>
                    {authors.map((name) => (
                      <option key={name} value={name}>
                        {name} ({facets.author.get(name) ?? 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-slate-100 dark:border-dark-border pt-3">
                  <ToggleRow
                    label="Solo verificados"
                    checked={filters.verifiedOnly}
                    onChange={(v) => update({ verifiedOnly: v })}
                  />
                  <ToggleRow
                    label="Solo los de mi plan"
                    checked={filters.availableOnly}
                    onChange={(v) => update({ availableOnly: v })}
                  />
                  <ToggleRow
                    label="Solo mis favoritos"
                    checked={filters.favoritesOnly}
                    onChange={(v) => update({ favoritesOnly: v })}
                  />
                </div>
              </div>

              {/* Columna derecha: etiquetas */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Etiquetas (cualquiera)
                  </div>
                  {allTags.length > TAGS_COLLAPSED && (
                    <div className="relative">
                      <Search
                        size={12}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        value={tagQuery}
                        onChange={(e) => setTagQuery(e.target.value)}
                        placeholder="Buscar etiqueta"
                        className="w-36 pl-6 pr-2 py-1 rounded-md text-xs bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Todavía no hay etiquetas.
                    </p>
                  )}
                  {visibleTags.map((tag) => (
                    <SmallChip
                      key={tag}
                      label={tag}
                      count={facets.tag.get(tag) ?? 0}
                      active={filters.tags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    />
                  ))}
                  {tagQ && visibleTags.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Ninguna etiqueta coincide.
                    </p>
                  )}
                  {!tagQ && !showAllTags && hiddenTagCount > 0 && (
                    <button
                      onClick={() => setShowAllTags(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary-600 hover:bg-primary-400/10 transition-colors"
                    >
                      Ver todas (+{hiddenTagCount})
                    </button>
                  )}
                  {!tagQ && showAllTags && allTags.length > TAGS_COLLAPSED && (
                    <button
                      onClick={() => setShowAllTags(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-bg transition-colors"
                    >
                      Ver menos
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pie del panel */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 dark:border-dark-border">
              <button
                onClick={clearAll}
                disabled={!hasAnyFilter(filters)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:hover:text-slate-500 transition-colors"
              >
                Limpiar todo
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="h-10 px-5 rounded-xl bg-primary-400 hover:bg-primary-300 text-slate-900 text-sm font-bold shadow-sm transition-colors"
              >
                Ver {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorerToolbar;