import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Calendar,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { AuthApi, ApiError, toClientUser } from "../services/api";

interface AuthPageProps {
  onLogin: (userData: any) => void;
  onClose: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "Estudiante",
    interests: [] as string[],
    birthDate: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const interestsList = [
    "Hormigón",
    "Estructuras Metálicas",
    "Sostenibilidad",
    "Diseño Interior",
    "Paisajismo",
    "BIM",
    "Restauración",
  ];

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user =
        mode === "login"
          ? await AuthApi.login(formData.email, formData.password)
          : await AuthApi.register({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              profession: formData.profession,
              birth_date: formData.birthDate || null,
              interests: formData.interests,
            });
      onLogin(toClientUser(user));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(Object.values(err.errors)[0]?.[0] ?? err.message);
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface w-full max-w-4xl rounded-3xl shadow-2xl flex overflow-hidden border border-slate-200 dark:border-dark-border relative animate-in fade-in zoom-in-95 duration-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
        >
          <ArrowRight size={20} />
        </button>

        {/* Left Side - Visual */}
        <div className="hidden md:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 text-center">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="relative z-10 text-white">
            <div className="w-16 h-16 bg-primary-400 text-slate-900 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg shadow-primary-400/30 mx-auto mb-6">
              eD
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Construye tu futuro profesional
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Únete a la comunidad técnica más grande y accede a recursos
              verificados por expertos.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {mode === "login"
                ? "Bienvenido de nuevo"
                : "Crear cuenta profesional"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {mode === "login"
                ? "Ingresa tus credenciales para acceder."
                : "Completa tu perfil para personalizar tu experiencia."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-400 outline-none dark:text-white"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Email Profesional
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-400 outline-none dark:text-white"
                  placeholder="nombre@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-400 outline-none dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                      Profesión
                    </label>
                    <div className="relative">
                      <Briefcase
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <select
                        value={formData.profession}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profession: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-400 outline-none dark:text-white appearance-none"
                      >
                        <option>Estudiante</option>
                        <option>Arquitecto</option>
                        <option>Ingeniero</option>
                        <option>Constructor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                      Fecha Nacimiento
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-400 outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                    Intereses (Selecciona al menos 1)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          formData.interests.includes(interest)
                            ? "bg-primary-400 text-slate-900 shadow-sm"
                            : "bg-slate-100 dark:bg-dark-bg text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-dark-border"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 mt-4"
            >
              {loading
                ? "Procesando..."
                : mode === "login"
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary-600 dark:text-primary-400 font-bold ml-1 hover:underline"
              >
                {mode === "login" ? "Regístrate gratis" : "Inicia sesión aquí"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
