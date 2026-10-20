import React, { useState } from "react";
import { AccessLevel, CategoryDef } from "../types";
import {
  Search,
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
} from "lucide-react";

interface SidebarProps {
  categories: CategoryDef[];
  selectedCategory: string | "all";
  onSelectCategory: (category: string | "all") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalItems: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAdmin: () => void;
  simulatedTier: AccessLevel;
  onToggleTier: () => void;
  onViewPlans: () => void;
  onOpenAuth: () => void;
  currentUser: any;
  authLoading?: boolean;
  onOpenDashboard: () => void;
  savedCount?: number;
  onOpenFavorites?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  isDarkMode,
  toggleDarkMode,
  onOpenAdmin,
  simulatedTier,
  onToggleTier,
  onViewPlans,
  onOpenAuth,
  currentUser,
  authLoading = false,
  onOpenDashboard,
  savedCount = 0,
  onOpenFavorites,
}) => {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const toggleExpand = (catId: string) => {
    setExpandedCat(expandedCat === catId ? null : catId);
    onSelectCategory(catId);
  };

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

      <div className="p-4 sticky top-0 z-10 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm border-b border-slate-100 dark:border-dark-border/50">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar detalle..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all"
          />
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
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group border border-transparent ${selectedCategory === "all" ? "bg-primary-50 dark:bg-primary-400/10 text-primary-700 dark:text-primary-400 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-bg"}`}
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
          const isSelected = selectedCategory === cat.name;
          const isExpanded = expandedCat === cat.name || isSelected;
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
                    className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg/50 shrink-0 space-y-3">
        {/* Tier Simulator - For Testing */}
        <div className="flex items-center gap-2 p-3 bg-white dark:bg-dark-card rounded-lg border border-slate-200 dark:border-dark-border">
          <User size={16} className="text-slate-400" />
          <div className="flex-1 text-xs font-bold dark:text-white">
            Test:{" "}
            <span className="text-primary-600 dark:text-primary-400">
              {simulatedTier}
            </span>
          </div>
          <button
            onClick={onToggleTier}
            className={`w-10 h-5 rounded-full p-1 transition-colors ${simulatedTier === "Pro" ? "bg-primary-400" : "bg-slate-300"}`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${simulatedTier === "Pro" ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors text-sm font-medium"
        >
          <Settings size={18} />
          <span>Panel Admin</span>
        </button>
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
