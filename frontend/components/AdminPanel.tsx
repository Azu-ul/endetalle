import React, { useState, useMemo, useEffect } from "react";
import {
  ConstructionDetail,
  ClientUser,
  ErrorReport,
  SiteConfig,
  PricingPlan,
  Tag,
  CategoryDef,
  PublicationStatus,
  AccessLevel,
  Author,
} from "../types";
import { DEFAULT_AVATAR } from "../data/content";
import {
  Trash2,
  X,
  Save,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  UserCheck,
  AlertCircle,
  ShoppingCart,
  UploadCloud,
  Download,
  HardDrive,
  Database,
  Search,
  CheckSquare,
  Square,
  Eye,
  ArrowRight,
  MoreVertical,
  Shield,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Globe,
  Lock,
  MessageSquare,
  Send,
  Activity,
  Smartphone,
  Monitor,
  LayoutGrid,
  List,
  Plus,
  Edit3,
  Image as ImageIcon,
  Briefcase,
  Calendar,
} from "lucide-react";
import { PersistenceService } from "../services/persistence";

interface AdminPanelProps {
  details?: ConstructionDetail[];
  clients?: ClientUser[];
  reports?: ErrorReport[];
  config: SiteConfig;
  plans?: PricingPlan[];
  categories?: string[];
  tags?: Tag[];
  onAdd: (detail: ConstructionDetail) => void;
  onUpdate: (detail: ConstructionDetail) => void;
  onDelete: (id: string) => void;
  onResolveReport: (id: string) => void;
  onSaveConfig: (config: SiteConfig) => void;
  onSavePlans: (plans: PricingPlan[]) => void;
  onSaveCategories: (cats: string[]) => void;
  onSaveTags: (tags: Tag[]) => void;
  onClose: () => void;
}

type AdminView =
  | "dashboard"
  | "content"
  | "staff"
  | "clients"
  | "reports"
  | "settings"
  | "commerce"
  | "taxonomy"
  | "system"
  | "details_editor";

const AdminPanel: React.FC<AdminPanelProps> = ({
  details = [],
  clients = [],
  reports = [],
  config,
  plans = [],
  categories = [],
  tags = [],
  onAdd,
  onUpdate,
  onDelete,
  onResolveReport,
  onSaveConfig,
  onSavePlans,
  onSaveCategories,
  onSaveTags,
  onClose,
}) => {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  // Forms & State
  const [configForm, setConfigForm] = useState<SiteConfig>(config);
  const [plansForm, setPlansForm] = useState<PricingPlan[]>(plans || []);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Details Editor State
  const [editingDetail, setEditingDetail] = useState<ConstructionDetail | null>(
    null,
  );

  // Content View Mode
  const [contentViewMode, setContentViewMode] = useState<"grid" | "list">(
    "grid",
  );

  // CRM Inspector State
  const [selectedUser, setSelectedUser] = useState<ClientUser | Author | null>(
    null,
  );
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState<any>({});

  // --- STATS CALCULATION (Safe) ---
  const stats = useMemo(() => {
    const safeDetails = details || [];
    const safeClients = clients || [];
    const safeReports = reports || [];

    const activeClientsList = safeClients.filter((c) => c.status === "Active");
    const mrr = activeClientsList.reduce(
      (acc, curr) => acc + (curr.monthlyFee || 0),
      0,
    );

    // Simulate Traffic Data for Chart (Smooth Curve)
    const trafficPoints = [40, 55, 45, 60, 58, 75, 65, 80, 85, 82, 90, 95];

    // Last Registered Users
    const recentUsers = [...safeClients]
      .sort(
        (a, b) =>
          new Date(b.subscriptionStart).getTime() -
          new Date(a.subscriptionStart).getTime(),
      )
      .slice(0, 3);

    return {
      total: safeDetails.length,
      likes: safeDetails.reduce((acc, curr) => acc + (curr.likes || 0), 0),
      verified: safeDetails.filter((d) => d.isVerified).length,
      activeClients: activeClientsList.length,
      pendingReports: safeReports.filter((r) => r.status === "Pending").length,
      mrr: mrr,
      projectedAnnual: mrr * 12,
      trafficPoints,
      recentUsers,
      onlineUsers: Math.floor(Math.random() * 20) + 5,
      onlineStaff: Math.floor(Math.random() * 5) + 1,
      newVisits: Math.floor(Math.random() * 200) + 100,
    };
  }, [details, clients, reports]);

  // --- HANDLERS ---
  const handleSaveSettings = () => {
    onSaveConfig(configForm);
    alert("Configuración guardada correctamente");
  };

  const handleSavePlans = () => {
    onSavePlans(plansForm);
    alert("Planes actualizados");
  };

  const handleUpdatePlan = (
    index: number,
    field: keyof PricingPlan,
    value: any,
  ) => {
    const updated = [...plansForm];
    updated[index] = { ...updated[index], [field]: value };
    setPlansForm(updated);
  };

  const handleAddPlan = () => {
    const newPlan: PricingPlan = {
      id: `p-${Date.now()}`,
      name: "Nuevo Plan",
      price: 0,
      interval: "mo",
      description: "Descripción del plan...",
      features: ["Característica 1"],
      highlightColor: "slate",
    };
    setPlansForm([...plansForm, newPlan]);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("¿Eliminar este plan?")) {
      setPlansForm(plansForm.filter((p) => p.id !== id));
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const handleCreateNewDetail = () => {
    setEditingDetail({
      id: `d-${Date.now()}`,
      title: "",
      category: "Fundaciones",
      description: "",
      imageUrl: "",
      specs: [],
      materials: [],
      drawings: [],
      author: {
        name: "Admin",
        role: "Administrador",
        avatarUrl: DEFAULT_AVATAR,
      },
      isVerified: true,
      likes: 0,
      status: "Draft",
      accessLevel: "Public",
      publishedDate: new Date().toISOString().split("T")[0],
    });
    setCurrentView("details_editor");
  };

  const handleEditDetail = (detail: ConstructionDetail) => {
    setEditingDetail({ ...detail });
    setCurrentView("details_editor");
  };

  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDetail) return;

    if (details.some((d) => d.id === editingDetail.id)) {
      onUpdate(editingDetail);
    } else {
      onAdd(editingDetail);
    }
    setCurrentView("content");
    setEditingDetail(null);
  };

  // --- BACKUP HANDLERS ---
  const handleBackupDownload = () => {
    const backupString = PersistenceService.createBackup();
    const blob = new Blob([backupString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `endetalle-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBackupRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (
        content &&
        confirm(
          "ADVERTENCIA: Esto sobrescribirá todos los datos actuales. ¿Desea continuar?",
        )
      ) {
        const success = PersistenceService.restoreBackup(content);
        if (success) {
          alert("Restauración completada. Recargando...");
          window.location.reload();
        } else {
          alert("Error al restaurar archivo.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas borrar TODA la base de datos y volver a los valores de fábrica? Esta acción no se puede deshacer.",
      )
    ) {
      PersistenceService.resetDatabase();
    }
  };

  // --- CRM HELPERS ---
  const handleOpenUserInspector = (user: ClientUser | Author) => {
    setSelectedUser(user);
    setUserForm({ ...user });
    setIsEditingUser(false);
  };

  // --- RENDER HELPERS ---
  const renderSidebarItem = (
    view: AdminView,
    icon: React.ReactNode,
    label: string,
    badge?: number,
  ) => (
    <button
      onClick={() => {
        setCurrentView(view);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium mb-1 ${
        currentView === view ||
        (view === "content" && currentView === "details_editor")
          ? "bg-primary-400 text-slate-900 shadow-lg shadow-primary-400/20 font-bold"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge ? (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-bold ${currentView === view ? "bg-slate-900 text-primary-400" : "bg-primary-500 text-slate-900"}`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );

  // SVG Chart Helper
  const renderTrafficChart = () => {
    const points = stats.trafficPoints;
    const width = 1000;
    const height = 300;
    const stepX = width / (points.length - 1);

    let pathD = `M0,${height} `;
    points.forEach((p, i) => {
      const x = i * stepX;
      const y = height - p * 3; // Scale visually
      pathD += `L${x},${y} `;
    });
    pathD += `L${width},${height} Z`;

    let linePath = "";
    points.forEach((p, i) => {
      const x = i * stepX;
      const y = height - p * 3;
      linePath += `${i === 0 ? "M" : "L"}${x},${y} `;
    });

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible preserve-3d"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="url(#chartGradient)" />
        <path
          d={linePath}
          fill="none"
          stroke="#facc15"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={i * stepX}
            cy={height - p * 3}
            r="6"
            fill="#facc15"
            className="animate-pulse origin-center"
          />
        ))}
      </svg>
    );
  };

  const renderSlideOver = () => {
    if (!selectedUser) return null;
    const isClient = "plan" in selectedUser; // Check if it's a ClientUser

    return (
      <div className="absolute top-0 right-0 h-full w-96 bg-white dark:bg-dark-surface shadow-2xl border-l border-slate-200 dark:border-dark-border z-20 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-xl dark:text-white">
              Ficha de Usuario
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <img
              src={selectedUser.avatarUrl}
              className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-slate-100 dark:border-dark-bg"
            />
            <h2 className="text-xl font-bold dark:text-white">
              {selectedUser.name}
            </h2>
            <p className="text-sm text-slate-500">
              {isClient
                ? (selectedUser as ClientUser).profession
                : (selectedUser as Author).role}
            </p>

            {!isEditingUser ? (
              <button
                onClick={() => setIsEditingUser(true)}
                className="mt-4 px-4 py-2 bg-slate-100 dark:bg-dark-bg text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200"
              >
                <Edit3 size={14} /> Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsEditingUser(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsEditingUser(false)}
                  className="px-3 py-1.5 bg-primary-400 rounded text-sm font-bold"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>

          {isClient ? (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Suscripción
                </h4>
                <div className="flex justify-between mb-1">
                  <span className="text-sm dark:text-slate-300">
                    Plan Actual
                  </span>
                  <span className="text-sm font-bold text-primary-500">
                    {(selectedUser as ClientUser).plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm dark:text-slate-300">Estado</span>
                  <span className="text-sm font-bold text-green-500">
                    {(selectedUser as ClientUser).status}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Contacto
                </h4>
                <p className="text-sm dark:text-slate-300 break-all">
                  {(selectedUser as ClientUser).email}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                  Desempeño
                </h4>
                <div className="flex justify-between mb-1">
                  <span className="text-sm dark:text-slate-300">Equipo</span>
                  <span className="text-sm font-bold dark:text-white">
                    {(selectedUser as Author).team}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-slate-50 dark:bg-dark-bg w-full max-w-[95vw] h-[90vh] rounded-3xl shadow-2xl border border-slate-700 flex overflow-hidden relative">
        {/* SIDEBAR */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col hidden lg:flex shrink-0 overflow-y-auto">
          <div className="flex items-center gap-3 mb-10 text-white px-2">
            <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center text-slate-900 font-bold shadow shadow-primary-400/50">
              C
            </div>
            <span className="font-bold text-lg tracking-tight">
              CMS Admin v7.3
            </span>
          </div>
          <nav className="flex-1 space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                General
              </div>
              {renderSidebarItem(
                "dashboard",
                <LayoutDashboard size={18} />,
                "Dashboard",
              )}
              {renderSidebarItem("content", <FileText size={18} />, "Detalles")}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                Comunidad
              </div>
              {renderSidebarItem(
                "clients",
                <UserCheck size={18} />,
                "Clientes",
                stats.activeClients,
              )}
              {renderSidebarItem("staff", <Users size={18} />, "Staff")}
              {renderSidebarItem(
                "reports",
                <AlertCircle size={18} />,
                "Reportes",
                stats.pendingReports,
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                Negocio
              </div>
              {renderSidebarItem(
                "commerce",
                <ShoppingCart size={18} />,
                "Planes y Precios",
              )}
              {renderSidebarItem(
                "settings",
                <Settings size={18} />,
                "Configuración",
              )}
              {renderSidebarItem(
                "system",
                <HardDrive size={18} />,
                "Backup / Sistema",
              )}
            </div>
          </nav>
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium mt-4"
          >
            <X size={18} />
            <span>Cerrar Panel</span>
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-dark-surface overflow-hidden relative">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <span className="font-bold">CMS Admin</span>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div
            className={`flex-1 p-6 md:p-8 relative scrollbar-thin ${currentView === "dashboard" ? "overflow-y-auto lg:overflow-hidden" : "overflow-y-auto"}`}
          >
            {/* --- DASHBOARD VIEW --- */}
            {currentView === "dashboard" && (
              <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 lg:h-full lg:flex lg:flex-col">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      Visión General
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Bienvenido de nuevo. Aquí tienes lo que sucede hoy.
                    </p>
                  </div>
                </div>

                {/* ONLINE ACTIVITY WIDGET */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-around items-center shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-400">
                      {stats.onlineUsers}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Usuarios Online
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {stats.onlineStaff}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Staff Online
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {stats.newVisits}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Nuevas Visitas
                    </div>
                  </div>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                        <ShoppingCart size={20} />
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        +12%
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        ${stats.mrr}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Ingreso Mensual
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                        <Users size={20} />
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                        +5
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {stats.activeClients}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Usuarios Activos
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                        <FileText size={20} />
                      </div>
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                        Total
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {stats.total}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Detalles Constructivos
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between relative overflow-hidden">
                    {stats.pendingReports > 0 && (
                      <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full absolute top-4 right-4 shadow-[0_0_10px_red]"></div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-xl">
                        <AlertCircle size={20} />
                      </div>
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                        {stats.pendingReports}
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        {stats.pendingReports}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Reportes Pendientes
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:flex-1 lg:min-h-0">
                  <div className="lg:col-span-2 bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col h-96 lg:h-auto lg:min-h-0">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                        <Activity className="text-primary-500" size={20} />{" "}
                        Tráfico en Tiempo Real
                      </h3>
                    </div>
                    <div className="flex-1 min-h-0 w-full relative">
                      {renderTrafficChart()}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold dark:text-white mb-4">
                      Últimos Registros
                    </h3>
                    <div className="space-y-4">
                      {stats.recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            className="w-10 h-10 rounded-full bg-slate-200 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold dark:text-white truncate">
                              {user.name}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">
                              {user.profession}
                            </p>
                          </div>
                          <span className="text-xs bg-slate-100 dark:bg-dark-bg px-2 py-1 rounded font-bold">
                            {user.plan}
                          </span>
                        </div>
                      ))}
                      {stats.recentUsers.length === 0 && (
                        <p className="text-slate-400 text-sm">
                          No hay registros recientes.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- CONTENT VIEW --- */}
            {currentView === "content" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">
                    Gestión de Detalles
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setContentViewMode("grid")}
                      className={`p-2 rounded-lg ${contentViewMode === "grid" ? "bg-primary-400 text-slate-900" : "bg-slate-100 text-slate-500"}`}
                    >
                      <LayoutGrid size={20} />
                    </button>
                    <button
                      onClick={() => setContentViewMode("list")}
                      className={`p-2 rounded-lg ${contentViewMode === "list" ? "bg-primary-400 text-slate-900" : "bg-slate-100 text-slate-500"}`}
                    >
                      <List size={20} />
                    </button>
                    <button
                      onClick={handleCreateNewDetail}
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                      <Plus size={16} /> Nuevo
                    </button>
                  </div>
                </div>

                {contentViewMode === "list" ? (
                  <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border">
                        <tr>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                            Detalle
                          </th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                            Categoría
                          </th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                            Autor
                          </th>
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                        {(details || []).map((detail) => (
                          <tr
                            key={detail.id}
                            className="hover:bg-slate-50 dark:hover:bg-dark-bg/50"
                          >
                            <td className="p-4 font-bold dark:text-white">
                              {detail.title}
                            </td>
                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                              {detail.category}
                            </td>
                            <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                              {detail.author.name}
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => handleEditDetail(detail)}
                                className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => onDelete(detail.id)}
                                className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {(details || []).map((detail) => (
                      <div
                        key={detail.id}
                        className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border overflow-hidden group"
                      >
                        <div className="h-32 overflow-hidden bg-slate-200 relative">
                          <img
                            src={detail.imageUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={() => handleEditDetail(detail)}
                              className="p-1 bg-white/90 rounded text-blue-600 hover:text-blue-700"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => onDelete(detail.id)}
                              className="p-1 bg-white/90 rounded text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                            {detail.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {detail.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- EDITOR VIEW --- */}
            {currentView === "details_editor" && editingDetail && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold dark:text-white">
                    Editor de Detalles
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentView("content")}
                      className="text-slate-500 font-medium hover:underline"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDetail}
                      className="bg-primary-400 text-slate-900 px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                    >
                      <Save size={18} /> Guardar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Título
                        </label>
                        <input
                          value={editingDetail.title}
                          onChange={(e) =>
                            setEditingDetail({
                              ...editingDetail,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Descripción
                        </label>
                        <textarea
                          rows={4}
                          value={editingDetail.description}
                          onChange={(e) =>
                            setEditingDetail({
                              ...editingDetail,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white resize-none"
                        />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border space-y-4">
                      <h3 className="font-bold border-b pb-2 mb-4 dark:text-white">
                        Especificaciones (Separar por comas)
                      </h3>
                      <textarea
                        rows={3}
                        value={editingDetail.specs.join(", ")}
                        onChange={(e) =>
                          setEditingDetail({
                            ...editingDetail,
                            specs: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Estado
                        </label>
                        <select
                          value={editingDetail.status}
                          onChange={(e) =>
                            setEditingDetail({
                              ...editingDetail,
                              status: e.target.value as PublicationStatus,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        >
                          <option value="Draft">Borrador</option>
                          <option value="Published">Publicado</option>
                          <option value="Archived">Archivado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Acceso
                        </label>
                        <select
                          value={editingDetail.accessLevel}
                          onChange={(e) =>
                            setEditingDetail({
                              ...editingDetail,
                              accessLevel: e.target.value as AccessLevel,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        >
                          <option value="Public">Público</option>
                          <option value="Pro">Pro</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Categoría
                        </label>
                        <select
                          value={editingDetail.category}
                          onChange={(e) =>
                            setEditingDetail({
                              ...editingDetail,
                              category: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        >
                          {(categories || []).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Imagen Principal (URL)
                        </label>
                        <input
                          value={editingDetail.imageUrl}
                          onChange={(e) =>
                            setEditingDetail({
                              ...editingDetail,
                              imageUrl: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white text-xs"
                        />
                        {editingDetail.imageUrl && (
                          <img
                            src={editingDetail.imageUrl}
                            className="mt-2 rounded-lg w-full h-32 object-cover border"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- CLIENTS VIEW --- */}
            {currentView === "clients" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Gestión de Clientes
                </h2>
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border">
                      <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                          Nombre
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                          Email
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                          Plan
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                      {(clients || []).map((client) => (
                        <tr
                          key={client.id}
                          onClick={() => handleOpenUserInspector(client)}
                          className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 cursor-pointer"
                        >
                          <td className="p-4 font-bold dark:text-white flex items-center gap-3">
                            <img
                              src={client.avatarUrl}
                              className="w-8 h-8 rounded-full"
                            />
                            {client.name}
                          </td>
                          <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                            {client.email}
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded">
                              {client.plan}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded ${client.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                              {client.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- STAFF VIEW --- */}
            {currentView === "staff" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Miembros del Staff
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(
                    Array.from(new Set(details.map((d) => d.author.name)))
                      .map(
                        (name) =>
                          details.find((d) => d.author.name === name)?.author,
                      )
                      .filter(Boolean) as any[]
                  ).map((author, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleOpenUserInspector(author)}
                      className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all"
                    >
                      <img
                        src={author.avatarUrl}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">
                          {author.name}
                        </h3>
                        <p className="text-sm text-primary-500 font-medium">
                          {author.role}
                        </p>
                        <p className="text-xs text-slate-400">{author.team}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- REPORTS VIEW --- */}
            {currentView === "reports" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Reportes de Errores
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {(reports || []).map((report) => {
                    const daysPending = Math.floor(
                      (new Date().getTime() -
                        new Date(report.submittedAt).getTime()) /
                        (1000 * 3600 * 24),
                    );
                    return (
                      <div
                        key={report.id}
                        className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row justify-between items-start gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${report.status === "Pending" ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"}`}
                            >
                              {report.status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              <Calendar size={12} /> {report.submittedAt}
                            </span>
                            {report.status === "Pending" && (
                              <span className="text-xs text-red-400 font-bold">
                                ({daysPending} días en espera)
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg dark:text-white mb-1">
                            {report.detailTitle}{" "}
                            <span className="text-sm font-normal text-slate-400">
                              (ID: {report.detailId})
                            </span>
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-dark-bg p-3 rounded-lg border border-slate-100 dark:border-dark-border/50 text-sm italic">
                            "{report.description}"
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <button
                            onClick={() => {
                              const d = details.find(
                                (x) => x.id === report.detailId,
                              );
                              if (d) handleEditDetail(d);
                              else
                                alert(
                                  "Detalle no encontrado (pudo ser borrado)",
                                );
                            }}
                            className="px-4 py-2 bg-primary-400 text-slate-900 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-500"
                          >
                            <Edit3 size={16} /> Revisar y Editar Detalle
                          </button>
                          {report.status === "Pending" && (
                            <button
                              onClick={() => onResolveReport(report.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-600"
                            >
                              <CheckSquare size={16} /> Marcar Resuelto
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- COMMERCE VIEW --- */}
            {currentView === "commerce" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">
                    Planes y Precios
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddPlan}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm"
                    >
                      <Plus size={16} /> Crear Plan
                    </button>
                    <button
                      onClick={handleSavePlans}
                      className="bg-primary-400 text-slate-900 px-6 py-2 rounded-xl font-bold flex items-center gap-2 text-sm"
                    >
                      <Save size={18} /> Guardar Cambios
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {plansForm.map((plan, idx) => (
                    <div
                      key={plan.id}
                      className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border relative group"
                    >
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="flex justify-between mb-4 pr-10">
                        <input
                          value={plan.name}
                          onChange={(e) =>
                            handleUpdatePlan(idx, "name", e.target.value)
                          }
                          className="font-bold text-lg bg-transparent border-b border-dashed border-slate-300 focus:border-primary-400 outline-none dark:text-white w-full mr-2"
                        />
                      </div>
                      <div className="flex items-center mb-4">
                        ${" "}
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) =>
                            handleUpdatePlan(
                              idx,
                              "price",
                              Number(e.target.value),
                            )
                          }
                          className="w-20 font-bold text-2xl bg-transparent border-b border-dashed border-slate-300 focus:border-primary-400 outline-none dark:text-white ml-2"
                        />
                        <span className="text-slate-400 ml-2">
                          / {plan.interval}
                        </span>
                      </div>
                      <textarea
                        value={plan.description}
                        onChange={(e) =>
                          handleUpdatePlan(idx, "description", e.target.value)
                        }
                        className="w-full bg-slate-50 dark:bg-dark-bg p-3 rounded-lg text-sm resize-none mb-4 dark:text-white"
                        rows={2}
                      />

                      <div className="bg-slate-50 dark:bg-dark-bg p-3 rounded-lg">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                          Características (Separadas por comas)
                        </label>
                        <textarea
                          value={plan.features.join(", ")}
                          onChange={(e) =>
                            handleUpdatePlan(
                              idx,
                              "features",
                              e.target.value.split(",").map((s) => s.trim()),
                            )
                          }
                          className="w-full bg-transparent text-sm resize-none outline-none dark:text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- SETTINGS VIEW --- */}
            {currentView === "settings" && (
              <div className="max-w-4xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold dark:text-white">
                    Configuración del Sitio
                  </h2>
                  <button
                    onClick={handleSaveSettings}
                    className="bg-primary-400 text-slate-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-500 shadow-lg shadow-primary-400/20"
                  >
                    <Save size={20} /> Guardar Todo
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Visuals */}
                  <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-8">
                    <h3 className="text-lg font-bold dark:text-white mb-6 border-b border-slate-100 dark:border-dark-border pb-2">
                      Identidad Visual
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Título Principal (Hero)
                        </label>
                        <input
                          value={configForm.homeTitle || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              homeTitle: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Subtítulo
                        </label>
                        <input
                          value={configForm.homeSubtitle || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              homeSubtitle: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Imagen de Cabecera (URL)
                        </label>
                        <input
                          value={configForm.headerImageUrl || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              headerImageUrl: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Paywall Texts */}
                  <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-8">
                    <h3 className="text-lg font-bold dark:text-white mb-6 border-b border-slate-100 dark:border-dark-border pb-2">
                      Textos Paywall (Pro)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Título del Modal
                        </label>
                        <input
                          value={configForm.paywallTitle || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              paywallTitle: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                          placeholder="Desbloquea este Detalle Constructivo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Descripción
                        </label>
                        <textarea
                          rows={2}
                          value={configForm.paywallDescription || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              paywallDescription: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white resize-none"
                          placeholder="Accede a planimetría..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Texto del Botón
                        </label>
                        <input
                          value={configForm.paywallButtonText || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              paywallButtonText: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                          placeholder="Obtener Acceso Pro"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legal & Social */}
                  <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-8">
                    <h3 className="text-lg font-bold dark:text-white mb-6 border-b border-slate-100 dark:border-dark-border pb-2">
                      Legal y Contacto
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Texto Footer
                        </label>
                        <input
                          value={configForm.footerText || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              footerText: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          placeholder="Twitter URL"
                          value={configForm.socialLinks?.twitter || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              socialLinks: {
                                ...configForm.socialLinks,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        />
                        <input
                          placeholder="Instagram URL"
                          value={configForm.socialLinks?.instagram || ""}
                          onChange={(e) =>
                            setConfigForm({
                              ...configForm,
                              socialLinks: {
                                ...configForm.socialLinks,
                                instagram: e.target.value,
                              },
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SYSTEM VIEW --- */}
            {currentView === "system" && (
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                  <Database size={32} /> Sistema y Respaldo
                </h2>
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-8 space-y-8">
                  <div className="flex gap-6 items-center">
                    <button
                      onClick={handleBackupDownload}
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90"
                    >
                      <Download size={20} /> Descargar Copia de Seguridad
                    </button>
                    <label className="cursor-pointer bg-slate-100 dark:bg-dark-bg border border-slate-300 dark:border-dark-border text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                      <UploadCloud size={20} /> Restaurar Backup
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleBackupRestore}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="pt-8 border-t dark:border-dark-border">
                    <button
                      onClick={handleFactoryReset}
                      className="text-red-500 font-bold border border-red-200 px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Resetear a Valores de Fábrica
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* SLIDE OVER */}
      {renderSlideOver()}
    </div>
  );
};

export default AdminPanel;