import React from "react";
import {
  Lock,
  CheckCircle2,
  Crown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ConstructionDetail, SiteConfig } from "../types";

interface PaywallProps {
  detail: ConstructionDetail;
  reason: "login" | "plan" | "quota";
  config: SiteConfig;
  onSubscribe: () => void;
  onLogin: () => void;
  onClose: () => void;
}

const Paywall: React.FC<PaywallProps> = ({
  detail,
  reason,
  config,
  onSubscribe,
  onLogin,
  onClose,
}) => {
  const copy = {
    login: {
      title: "Iniciá sesión para ver este detalle",
      text: "Creá tu cuenta gratuita o ingresá para acceder a la biblioteca técnica.",
      button: "Iniciar Sesión",
      action: onLogin,
    },
    quota: {
      title: "Llegaste al límite de tu plan",
      text: "Ya consultaste todos los detalles incluidos en tu plan. Cambiá de plan para seguir explorando.",
      button: "Ver Planes de Suscripción",
      action: onSubscribe,
    },
    plan: {
      title: config.paywallTitle || "Desbloqueá este Detalle Constructivo",
      text:
        config.paywallDescription ||
        "Accedé a planimetría DWG, especificaciones técnicas completas y soporte experto con un plan superior.",
      button: config.paywallButtonText || "Ver Planes de Suscripción",
      action: onSubscribe,
    },
  }[reason];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-dark-surface w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200 dark:border-dark-border">
        {/* Header */}
        <div className="relative h-40 bg-slate-900 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-40">
            <img
              src={detail.imageUrl}
              className="w-full h-full object-cover blur-sm scale-110"
            />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-primary-400 flex items-center justify-center mb-3 shadow-lg shadow-primary-400/30">
              <Lock size={32} className="text-primary-400" />
            </div>
            <div className="bg-primary-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              {reason === 'login' ? 'Solo para miembros' : `Contenido ${detail.requiredPlanName ?? 'Pro'}`}
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {copy.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            {copy.text}
          </p>

          <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
              <span className="text-sm dark:text-slate-300 font-medium">
                Descarga de archivos CAD/BIM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
              <span className="text-sm dark:text-slate-300 font-medium">
                Soporte directo de autores
              </span>
            </div>
          </div>

          <button
            onClick={copy.action}
            className="w-full bg-primary-400 hover:bg-primary-500 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-400/20 mb-3 hover:scale-[1.02]"
          >
            <Crown size={20} />{" "}
            {copy.button}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
          >
            Quizás más tarde
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-dark-bg p-4 flex items-center justify-center gap-2 text-xs text-slate-400 border-t dark:border-dark-border">
          <ShieldCheck size={14} /> Garantía de satisfacción de 30 días
        </div>
      </div>
    </div>
  );
};

export default Paywall;
