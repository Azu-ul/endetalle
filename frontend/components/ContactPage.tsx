import React from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { SiteConfig } from "../types";

interface ContactPageProps {
  config?: SiteConfig;
}

const ContactPage: React.FC<ContactPageProps> = ({ config }) => {
  const address = config?.address || "Mar del Plata, Buenos Aires, Argentina";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed&hl=es`;

  return (
    <div className="pb-20 animate-in slide-in-from-right duration-500">
      {/* Hero Map Section */}
      <div className="h-[400px] w-full relative bg-slate-200 overflow-hidden">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-dark-bg to-transparent pointer-events-none" />
        <div className="absolute bottom-10 left-6 md:left-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-800 bg-white/80 dark:bg-white/80 backdrop-blur px-6 py-2 rounded-xl inline-block">
            Contáctanos
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-400/10 text-primary-500 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Estudio
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {address}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-400/10 text-primary-500 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Email
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  hola@endetalle.com
                  <br />
                  soporte@endetalle.com
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-400/10 text-primary-500 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Horario
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Lun - Vie: 9am - 6pm
                  <br />
                  Sab: 10am - 1pm
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Envíanos un mensaje
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 outline-none"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 outline-none"
                    placeholder="juan@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Asunto
                </label>
                <select className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 outline-none">
                  <option>Consulta General</option>
                  <option>Soporte Técnico</option>
                  <option>Suscripciones</option>
                  <option>Prensa / Colaboraciones</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 outline-none resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-primary-400 hover:bg-primary-500 text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-primary-400/20 w-full md:w-auto"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
