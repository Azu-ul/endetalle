import React, { useEffect, useState } from "react";
import { AccessLevel, CategoryDef } from "../types";
import {
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  Sun,
  Moon,
  BrickWall,
  Footprints,
  ArrowUp,
  Bone,
  AlignJustify,
  Layers,
  Tent,
  Zap,
  SquareStack,
  Bookmark,
  Crown,
} from "lucide-react";

interface SidebarProps {
  categories: CategoryDef[];
  selectedCategories: string[];
  onSelectCategory: (category: string | "all") => void;
  selectedSubcategories?: string[]; // claves "Categoría::Subcategoría"
  onSelectSubcategory?: (category: string, sub: string) => void;
  totalItems: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAdmin: () => void;
  onViewPlans: () => void;
  onOpenAuth: () => void;
  currentUser: any;
  isSuperadmin?: boolean;
  authLoading?: boolean;
  onOpenDashboard: () => void;
  savedCount?: number;
  onOpenFavorites?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
  selectedSubcategories = [],
  onSelectSubcategory,
  isDarkMode,
  toggleDarkMode,
  onOpenAdmin,
  onViewPlans,
  onOpenAuth,
  currentUser,
  isSuperadmin = false,
  authLoading = false,
  onOpenDashboard,
  savedCount = 0,
  onOpenFavorites,
}) => {
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  const toggleExpand = (catName: string) => {
    const isOpen = expandedCats.includes(catName);
    const isSel = selectedCategories.includes(catName);
    if (isOpen && isSel) {
      // Abierta y seleccionada: se cierra, sin cambiar de vista ni de subcategoría
      setExpandedCats((prev) => prev.filter((c) => c !== catName));
    } else {
      // Cerrada, o abierta pero no seleccionada: se abre (si hace falta) y se selecciona
      setExpandedCats((prev) =>
        prev.includes(catName) ? prev : [...prev, catName],
      );
      if (!isSel) onSelectCategory(catName);
    }
  };

  // Si las categorías se seleccionan desde otro lado, se despliegan solas
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setExpandedCats((prev) => [
        ...prev,
        ...selectedCategories.filter((c) => !prev.includes(c)),
      ]);
    }
  }, [selectedCategories]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "fundaciones":
        return <SquareStack size={18} />;
      case "mamposterias":
        return <BrickWall size={18} />;
      case "solados":
        return <Footprints size={18} />;
      case "cielorrasos":
        return <ArrowUp size={18} />;
      case "estructuras":
        return <Bone size={18} />;
      case "escaleras":
        return <AlignJustify size={18} />; // Rotated icon simulation usually
      case "entrepisos":
        return <Layers size={18} />;
      case "cubiertas":
        return <Tent size={18} />;
      case "instalaciones":
        return <Zap size={18} />;
      case "premium":
        return <Crown size={18} />;
      default:
        return <LayoutGrid size={18} />;
    }
  };

  return (
    <aside className="h-full w-full md:w-72 bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border flex flex-col shadow-lg z-20 transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-dark-border flex items-center justify-between shrink-0">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onSelectCategory("all")}
        >
          <div className="w-9 h-9 bg-primary-400 text-slate-900 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-primary-400/20">
            eD
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-none tracking-tight">
              enDetalle
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 no-scrollbar pb-6 scroll-smooth pt-4">
        {authLoading ? (
          <div className="w-full h-14 mb-4 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
        ) : currentUser ? (
          <button
            onClick={onOpenDashboard}
            className="w-full flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-slate-900 font-bold uppercase">
              {currentUser.name[0]}
            </div>
            <div className="text-left overflow-hidden flex-1">
              <span className="block text-sm font-bold truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-primary-400 uppercase font-bold">
                {currentUser.plan}
                {currentUser.quotaLimit != null && (
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {currentUser.quotaUsed ?? 0} de {currentUser.quotaLimit}{" "}
                    vistos ·{" "}
                    {Math.max(
                      0,
                      currentUser.quotaLimit - (currentUser.quotaUsed ?? 0),
                    )}{" "}
                    restantes
                  </span>
                )}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 mb-4 rounded-xl bg-primary-400 text-slate-900 font-bold shadow-lg shadow-primary-400/20 hover:bg-primary-500 transition-colors"
          >
            <User size={18} /> Iniciar Sesión
          </button>
        )}

        <div className="px-3 py-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Explorar
          </p>
        </div>
        <button
          onClick={() => onSelectCategory("all")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group border border-transparent ${selectedCategories.length === 0 ? "bg-primary-50 dark:bg-primary-400/10 text-primary-700 dark:text-primary-400 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-bg"}`}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid size={18} />
            <span className="text-sm">Todo</span>
          </div>
        </button>

        {/* Mis Favoritos Button */}
        <button
          onClick={onOpenFavorites}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group border border-transparent text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400"
        >
          <div className="flex items-center gap-3">
            <Bookmark
              size={18}
              className={savedCount > 0 ? "text-amber-500 fill-amber-500" : ""}
            />
            <span className="text-sm font-medium">Mis Favoritos</span>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
              savedCount > 0
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                : "bg-slate-100 dark:bg-dark-bg text-slate-400"
            }`}
          >
            {savedCount}
          </span>
        </button>

        <button
          onClick={onViewPlans}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-bg"
        >
          <div className="flex items-center gap-3">
            <CreditCard size={18} />
            <span className="text-sm">Planes y Precios</span>
          </div>
        </button>

        <div className="my-2 border-t border-slate-100 dark:border-dark-border mx-3"></div>

        {/* HIERARCHICAL CATEGORIES */}
        {categories.map((cat) => {
          const isSelected = selectedCategories.includes(cat.name);
          const isExpanded = expandedCats.includes(cat.name);
          const hasSubs = cat.subcategories.length > 0;

          return (
            <div key={cat.id}>
              <button
                onClick={() => toggleExpand(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all border border-transparent ${isSelected ? "bg-slate-100 dark:bg-dark-bg text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-bg"}`}
              >
                <div className="flex items-center gap-3">
                  {getCategoryIcon(cat.id)}
                  <span className="text-sm truncate">{cat.name}</span>
                </div>
                {hasSubs && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                )}
              </button>
              {hasSubs && (
                <div
                  aria-hidden={!isExpanded}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="ml-6 mt-1 mb-1 pl-3 border-l border-slate-200 dark:border-dark-border space-y-0.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          tabIndex={isExpanded ? 0 : -1}
                          onClick={() => onSelectSubcategory?.(cat.name, sub)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${selectedSubcategories.includes(`${cat.name}::${sub}`) ? "text-primary-700 dark:text-primary-400 font-semibold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg/50 shrink-0 space-y-3">
        {isSuperadmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors text-sm font-medium"
          >
            <Settings size={18} />
            <span>Panel Admin</span>
          </button>
        )}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors text-sm font-medium shadow-sm"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;