import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DetailView from "./components/DetailView";
import UserProfile from "./components/UserProfile";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import SEOHead from "./components/SEOHead";
import Paywall from "./components/Paywall";
import SubscriptionPage from "./components/SubscriptionPage";
import MessagesPanel from "./components/MessagesPanel";
import ContactPage from "./components/ContactPage";
import AuthorsPage from "./components/AuthorsPage";
import LegalPage from "./components/LegalPage";
import AuthPage from "./components/AuthPage";
import UserDashboard from "./components/UserDashboard";
import {
  AuthApi,
  SiteApi,
  DetailsApi,
  toClientUser,
  toConfig,
  toCategory,
  toPlan,
  toDetail,
} from "./services/api";

import { PersistenceService } from "./services/persistence";
import {
  ConstructionDetail,
  Author,
  ClientUser,
  ErrorReport,
  Comment,
  SiteConfig,
  AccessLevel,
  PricingPlan,
  Tag,
  CategoryDef,
} from "./types";
import { DEFAULT_AVATAR } from "./data/content";
import {
  Menu,
  X,
  CheckCircle2,
  ArrowUpRight,
  Lock,
  ShieldAlert,
  ChevronRight,
  Calendar,
  Bookmark,
} from "lucide-react";

type ViewState =
  | "HOME"
  | "DETAIL"
  | "PROFILE"
  | "ADMIN"
  | "SUBSCRIPTION"
  | "MESSAGES"
  | "CONTACT"
  | "AUTHORS"
  | "LEGAL_TERMS"
  | "LEGAL_PRIVACY"
  | "AUTH"
  | "USER_DASHBOARD";

function App() {
  const [view, setView] = useState<ViewState>("HOME");
  const [details, setDetails] = useState<ConstructionDetail[]>([]);
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [config, setConfig] = useState<SiteConfig>(
    PersistenceService.getConfig(),
  );
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [categories, setCategories] = useState<CategoryDef[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedDetail, setSelectedDetail] =
    useState<ConstructionDetail | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">(
    "all",
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<
    "login" | "plan" | "quota"
  >("plan");
  const [sortBy, setSortBy] = useState<"popular" | "date">("popular");

  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setClients(PersistenceService.getClients());
    setReports(PersistenceService.getReports());
    setComments(PersistenceService.getComments());
    SiteApi.categories()
      .then((c) => setCategories(c.map(toCategory)))
      .catch(console.error);
    SiteApi.plans()
      .then((p) => setPlans(p.map(toPlan)))
      .catch(console.error);
    SiteApi.settings()
      .then((s) => setConfig(toConfig(s)))
      .catch(console.error);
    setTags(PersistenceService.getTags());
    setFavoriteIds(PersistenceService.getFavorites());
  }, []);

  useEffect(() => {
    setFavoriteIds(PersistenceService.getFavorites(currentUser?.id));
  }, [currentUser]);

  useEffect(() => {
    if (favoriteToast) {
      const timer = setTimeout(() => setFavoriteToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [favoriteToast]);

  useEffect(() => {
    AuthApi.me()
      .then((u) => setCurrentUser(toClientUser(u)))
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    DetailsApi.list()
      .then((r) => setDetails(r.data.map(toDetail)))
      .catch(console.error);
  }, [authLoading, currentUser?.id]);

  const handleToggleFavorite = (detailId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = PersistenceService.toggleFavorite(detailId, currentUser?.id);
    setFavoriteIds(result.favorites);
    setFavoriteToast(
      result.isFavorite
        ? "★ Guardado en tus favoritos"
        : "Eliminado de favoritos",
    );
  };

  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [isDarkMode]);

  // CATEGORY HANDLING
  const activeCategoryDef = useMemo(() => {
    if (selectedCategory === "all") return null;
    return categories.find((c) => c.name === selectedCategory) || null;
  }, [categories, selectedCategory]);

  const filteredDetails = useMemo(() => {
    let list = details.filter(
      (detail) => detail.status === "Published" || view === "ADMIN",
    );

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    // Filter by Subcategory
    if (selectedSubcategory) {
      list = list.filter((d) => d.subcategory === selectedSubcategory);
    }

    // Search
    if (searchTerm) {
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort
    if (sortBy === "date") {
      list.sort(
        (a, b) =>
          new Date(b.publishedDate || 0).getTime() -
          new Date(a.publishedDate || 0).getTime(),
      );
    } else {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return list;
  }, [
    details,
    view,
    sortBy,
    selectedCategory,
    selectedSubcategory,
    searchTerm,
  ]);

  const topAuthors = useMemo(() => {
    const map = new Map<string, Author>();
    details.forEach((d) => {
      if (!map.has(d.author.name)) map.set(d.author.name, d.author);
    });
    return Array.from(map.values());
  }, [details]);

  const handleSelectCategory = (cat: string | "all") => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null); // Reset subcategory on main change
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setView("HOME");
  };

  const handleOpenDetail = async (detail: ConstructionDetail) => {
    try {
      const res = await DetailsApi.show(detail.slug!);
      setSelectedDetail(toDetail(res));

      if (!res.access.allowed) {
        setPaywallReason(res.access.reason ?? "plan");
        setShowPaywall(true);
        return;
      }

      setView("DETAIL");
      if (currentUser) {
        AuthApi.me()
          .then((u) => setCurrentUser(toClientUser(u)))
          .catch(() => {});
      }
    } catch {
      alert("No se pudo abrir el detalle. Probá de nuevo.");
    }
  };

  const handleOpenProfile = (author: Author) => {
    setSelectedAuthor(author);
    setView("PROFILE");
  };

  const handleGoBack = () => {
    setView("HOME");
    setSelectedDetail(null);
    setSelectedAuthor(null);
  };

  const handleExploreNew = () => {
    setSortBy("date");
    setView("HOME");
  };

  const handleNavigate = (target: ViewState) => {
    setView(target);
    window.scrollTo(0, 0);
  };

  const handleAddDetail = (newDetail: ConstructionDetail) => {
    const updated = [newDetail, ...details];
    setDetails(updated);
    PersistenceService.saveDetails(updated);
  };

  const handleUpdateDetail = (updatedDetail: ConstructionDetail) => {
    const updated = details.map((d) =>
      d.id === updatedDetail.id ? updatedDetail : d,
    );
    setDetails(updated);
    PersistenceService.saveDetails(updated);
  };

  const handleDeleteDetail = (id: string) => {
    const updated = details.filter((d) => d.id !== id);
    setDetails(updated);
    PersistenceService.saveDetails(updated);
  };

  const handleReportError = (detailId: string, description: string) => {
    const newReport: ErrorReport = {
      id: `r-${Date.now()}`,
      detailId,
      detailTitle: details.find((d) => d.id === detailId)?.title || "Unknown",
      description,
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    PersistenceService.saveReports(updated);
  };

  const handleResolveReport = (reportId: string) => {
    const updated = reports.map((r) =>
      r.id === reportId ? { ...r, status: "Resolved" as const } : r,
    );
    setReports(updated);
    PersistenceService.saveReports(updated);
  };

  const handleAddComment = (detailId: string, text: string) => {
    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      detailId,
      authorName: currentUser ? currentUser.name : "Visitante",
      authorAvatar: currentUser ? currentUser.avatarUrl : DEFAULT_AVATAR,
      text,
      timestamp: "Ahora mismo",
      role: currentUser
        ? currentUser.plan === "Free"
          ? "Usuario"
          : currentUser.plan
        : undefined,
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    PersistenceService.saveComments(updated);
  };

  const handleSaveConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    PersistenceService.saveConfig(newConfig);
  };

  const handleSavePlans = (newPlans: PricingPlan[]) => {
    setPlans(newPlans);
    PersistenceService.savePlans(newPlans);
  };

  const handleSubscribe = () => {
    if (!currentUser) {
      setView("AUTH");
      return;
    }
    alert("El pago con Mercado Pago y PayPal se habilita en el próximo paso.");
  };

  const handleSaveCategories = (cats: string[]) => {
    // Compatibility shim
  };

  const handleSaveTags = (t: Tag[]) => {
    setTags(t);
    PersistenceService.saveTags(t);
  };

  const handleLogin = (user: ClientUser) => {
    setCurrentUser(user);
    setView("USER_DASHBOARD");
  };

  const handleUpdateUser = (updatedData: any) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updatedData });
      alert("Perfil actualizado correctamente");
    }
  };

  if (config.maintenanceMode && view !== "ADMIN") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white text-center p-4">
        <SEOHead title="Mantenimiento | enDetalle" />
        <ShieldAlert size={64} className="text-primary-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">
          {config.siteTitle} en Mantenimiento
        </h1>
        <button
          onClick={() => setView("ADMIN")}
          className="mt-8 text-sm text-slate-600 hover:text-white underline"
        >
          Acceso Admin
        </button>
      </div>
    );
  }

  const savedDetails = useMemo(() => {
    return details.filter((d) => favoriteIds.includes(d.id));
  }, [details, favoriteIds]);

  const effectiveUser: ClientUser = useMemo(() => {
    if (currentUser) return currentUser;
    return {
      id: "guest",
      name: "Usuario Invitado",
      email: "invitado@endetalle.io",
      plan: "Free",
      status: "Active",
      subscriptionStart: new Date().toISOString().split("T")[0],
      subscriptionEnd: "2026-12-31",
      monthlyFee: 0,
      avatarUrl: DEFAULT_AVATAR,
      profession: "Profesional de la Construcción",
      favoriteDetailIds: favoriteIds,
    };
  }, [currentUser, favoriteIds]);

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-dark-bg text-slate-100" : "bg-slate-50 text-slate-800"}`}
    >
      <SEOHead
        title={
          selectedDetail
            ? `${selectedDetail.seoTitle || selectedDetail.title} | ${config.siteTitle}`
            : config.siteTitle
        }
        description={
          selectedDetail?.metaDescription ||
          "Biblioteca de detalles constructivos."
        }
        image={selectedDetail?.imageUrl}
      />

      {showPaywall && selectedDetail && (
        <Paywall
          detail={selectedDetail}
          reason={paywallReason}
          config={config}
          onSubscribe={() => {
            setShowPaywall(false);
            setView("SUBSCRIPTION");
          }}
          onLogin={() => {
            setShowPaywall(false);
            setView("AUTH");
          }}
          onClose={() => setShowPaywall(false)}
        />
      )}

      {/* Floating Favorite Toast */}
      {favoriteToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <Bookmark
            size={18}
            className="text-amber-400 fill-amber-400 shrink-0"
          />
          <span className="text-sm font-semibold">{favoriteToast}</span>
        </div>
      )}

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white dark:bg-dark-surface p-2.5 rounded-lg shadow-md border border-slate-200 dark:border-dark-border"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalItems={filteredDetails.length}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenAdmin={() => {
            setView("ADMIN");
            setIsMobileMenuOpen(false);
          }}
          onViewPlans={() => setView("SUBSCRIPTION")}
          onOpenAuth={() => setView("AUTH")}
          currentUser={currentUser}
          authLoading={authLoading}
          onOpenDashboard={() => setView("USER_DASHBOARD")}
          savedCount={favoriteIds.length}
          onOpenFavorites={() => {
            setView("USER_DASHBOARD");
            setIsMobileMenuOpen(false);
          }}
        />
      </div>

      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth">
        <div className="p-6 md:p-10 min-h-screen pb-0 flex flex-col">
          <div className="flex-1">
            {view === "HOME" && (
              <div className="max-w-[1800px] mx-auto">
                {/* GLOBAL HERO - Only show when no search and ALL categories selected */}
                {!searchTerm && selectedCategory === "all" && (
                  <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-black border border-slate-200 dark:border-dark-border mb-12 shadow-2xl h-[400px] group">
                    <img
                      src={config.headerImageUrl}
                      className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 md:px-20">
                      <span className="text-primary-400 font-bold tracking-widest uppercase mb-4 text-sm animate-in slide-in-from-left-4 duration-500">
                        Biblioteca Técnica v7.0
                      </span>
                      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 max-w-2xl leading-tight animate-in slide-in-from-bottom-4 duration-700">
                        {config.homeTitle || config.siteTitle}
                      </h1>
                      <p className="text-xl text-slate-300 max-w-xl mb-8 leading-relaxed animate-in slide-in-from-bottom-5 duration-700 delay-100">
                        {config.homeSubtitle ||
                          "La plataforma colaborativa definitiva para arquitectos e ingenieros."}
                      </p>
                      <button
                        onClick={handleExploreNew}
                        className="bg-primary-400 hover:bg-primary-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg w-fit flex items-center gap-3 transition-all hover:gap-4 shadow-lg shadow-primary-400/20 animate-in zoom-in-95 duration-500 delay-200"
                      >
                        Explorar Novedades <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* CATEGORY HERO - Show when a specific category is selected */}
                {activeCategoryDef && (
                  <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-dark-border mb-12 shadow-xl h-[250px] animate-in fade-in slide-in-from-top-4">
                    <img
                      src={activeCategoryDef.imageUrl}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
                      <h1 className="text-4xl font-bold text-white mb-2">
                        {activeCategoryDef.name}
                      </h1>
                      <p className="text-slate-200 text-lg">
                        Explorando detalles y documentación técnica.
                      </p>

                      {/* Subcategory Pills */}
                      {activeCategoryDef.subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                          <button
                            onClick={() => setSelectedSubcategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${!selectedSubcategory ? "bg-white text-slate-900 border-white" : "bg-transparent text-white border-white/30 hover:bg-white/10"}`}
                          >
                            Todos
                          </button>
                          {activeCategoryDef.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubcategory(sub)}
                              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${selectedSubcategory === sub ? "bg-primary-400 text-slate-900 border-primary-400" : "bg-transparent text-white border-white/30 hover:bg-white/10"}`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {searchTerm
                      ? `Resultados para "${searchTerm}"`
                      : selectedCategory !== "all"
                        ? selectedSubcategory
                          ? `${selectedCategory} > ${selectedSubcategory}`
                          : selectedCategory
                        : sortBy === "date"
                          ? "Novedades Recientes"
                          : "Más Populares"}
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500">
                      {filteredDetails.length}
                    </span>
                  </h2>
                  <div className="flex bg-white dark:bg-dark-surface p-1 rounded-xl border border-slate-200 dark:border-dark-border">
                    <button
                      onClick={() => setSortBy("popular")}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${sortBy === "popular" ? "bg-slate-100 dark:bg-dark-bg text-primary-600" : "text-slate-500"}`}
                    >
                      Populares
                    </button>
                    <button
                      onClick={() => setSortBy("date")}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${sortBy === "date" ? "bg-slate-100 dark:bg-dark-bg text-primary-600" : "text-slate-500"}`}
                    >
                      Recientes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDetails.map((detail) => (
                    <div
                      key={detail.id}
                      onClick={() => handleOpenDetail(detail)}
                      className="group cursor-pointer relative bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 aspect-[9/16]"
                    >
                      <img
                        src={detail.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity" />

                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <img
                              src={detail.author.avatarUrl}
                              className="w-8 h-8 rounded-full border border-white/30"
                            />
                            {detail.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-primary-400 rounded-full p-0.5">
                                <CheckCircle2
                                  size={8}
                                  className="text-slate-900"
                                />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-white/90 drop-shadow-md truncate max-w-[100px]">
                            {detail.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 uppercase tracking-wide">
                            {detail.category.split(" ")[0]}
                          </span>
                          <button
                            onClick={(e) => handleToggleFavorite(detail.id, e)}
                            className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95 shadow-md ${
                              favoriteIds.includes(detail.id)
                                ? "bg-amber-400 text-slate-900 border-amber-400 shadow-amber-400/40"
                                : "bg-black/50 hover:bg-black/80 text-white/90 border-white/20 hover:text-white"
                            }`}
                            title={
                              favoriteIds.includes(detail.id)
                                ? "Quitar de favoritos"
                                : "Guardar como Favorito"
                            }
                          >
                            <Bookmark
                              size={14}
                              fill={
                                favoriteIds.includes(detail.id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <div className="bg-primary-400 text-slate-900 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                          {detail.locked ? (
                            <Lock size={24} />
                          ) : (
                            <ArrowUpRight size={28} strokeWidth={2.5} />
                          )}
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <h3 className="font-bold text-xl text-white mb-2 leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors">
                          {detail.title}
                        </h3>
                        <div className="flex justify-between items-end">
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {detail.description}
                          </p>
                          <div className="flex gap-2">
                            {detail.requiredPlanName && (
                              <span className="bg-slate-800 text-primary-400 text-[10px] font-bold px-2 py-1 rounded border border-primary-400/30 flex items-center gap-1">
                                <Lock size={10} />{" "}
                                {detail.requiredPlanName.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === "DETAIL" && selectedDetail && (
              <DetailView
                detail={selectedDetail}
                onBack={handleGoBack}
                onAuthorClick={handleOpenProfile}
                onReportError={handleReportError}
                comments={comments.filter(
                  (c) => c.detailId === selectedDetail.id,
                )}
                onAddComment={handleAddComment}
                currentUser={currentUser}
                relatedDetails={details
                  .filter(
                    (d) =>
                      d.category === selectedDetail.category &&
                      d.id !== selectedDetail.id,
                  )
                  .slice(0, 4)}
                onSelectDetail={handleOpenDetail}
                isFavorite={favoriteIds.includes(selectedDetail.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {view === "PROFILE" && selectedAuthor && (
              <UserProfile
                author={selectedAuthor}
                authorDetails={details.filter(
                  (d) => d.author.name === selectedAuthor.name,
                )}
                onBack={handleGoBack}
                onSelectDetail={handleOpenDetail}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {view === "SUBSCRIPTION" && (
              <SubscriptionPage plans={plans} onSubscribe={handleSubscribe} />
            )}
            {view === "MESSAGES" && <MessagesPanel />}
            {view === "CONTACT" && <ContactPage />}
            {view === "AUTHORS" && (
              <AuthorsPage
                authors={topAuthors}
                details={details}
                onAuthorClick={handleOpenProfile}
              />
            )}
            {view === "LEGAL_TERMS" && (
              <LegalPage
                title="Términos de Uso"
                content={config.termsContent || ""}
              />
            )}
            {view === "LEGAL_PRIVACY" && (
              <LegalPage
                title="Política de Privacidad"
                content={config.privacyContent || ""}
              />
            )}
            {view === "AUTH" && (
              <AuthPage onLogin={handleLogin} onClose={() => setView("HOME")} />
            )}
            {view === "USER_DASHBOARD" && (
              <UserDashboard
                user={effectiveUser}
                savedDetails={savedDetails}
                onLogout={() => {
                  AuthApi.logout().catch(() => {});
                  setCurrentUser(null);
                  setView("HOME");
                }}
                onUpdateUser={handleUpdateUser}
                onSelectDetail={handleOpenDetail}
                onToggleFavorite={handleToggleFavorite}
                onExploreLibrary={() => setView("HOME")}
              />
            )}
          </div>
          <Footer config={config} onNavigate={handleNavigate} />
        </div>
      </main>

      {view === "ADMIN" && (
        <AdminPanel
          details={details}
          clients={clients}
          reports={reports}
          config={config}
          plans={plans}
          categories={categories.map((c) => c.name)}
          tags={tags}
          onAdd={handleAddDetail}
          onUpdate={handleUpdateDetail}
          onDelete={handleDeleteDetail}
          onResolveReport={handleResolveReport}
          onSaveConfig={handleSaveConfig}
          onSavePlans={handleSavePlans}
          onSaveCategories={() => {}}
          onSaveTags={handleSaveTags}
          onClose={() => setView("HOME")}
        />
      )}
    </div>
  );
}

export default App;
