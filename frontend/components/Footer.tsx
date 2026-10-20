import React from 'react';
import { Heart, Twitter, Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config?: SiteConfig;
  onNavigate: (view: 'CONTACT' | 'AUTHORS' | 'LEGAL_TERMS' | 'LEGAL_PRIVACY' | 'HOME') => void;
}

const Footer: React.FC<FooterProps> = ({ config, onNavigate }) => {
  const links = config?.socialLinks || {};

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-dark-border pt-16 pb-10 bg-slate-50/50 dark:bg-dark-bg/50">
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 px-6 lg:px-8">
          
          <div className="lg:w-1/3 space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary-400 text-slate-900 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">eD</div>
                <span className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">{config?.siteTitle || 'enDetalle'}</span>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
               La biblioteca técnica colaborativa para la nueva generación de arquitectos e ingenieros. Documentación verificada y detalles constructivos de alta precisión.
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 flex-1">
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-widest">Plataforma</h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                   <li><button onClick={() => onNavigate('HOME')} className="hover:text-primary-500 transition-colors">Explorador</button></li>
                   <li><button onClick={() => onNavigate('AUTHORS')} className="hover:text-primary-500 transition-colors">Autores Destacados</button></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-widest">Legal</h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                   <li><button onClick={() => onNavigate('LEGAL_TERMS')} className="hover:text-primary-500 transition-colors">Términos de Uso</button></li>
                   <li><button onClick={() => onNavigate('LEGAL_PRIVACY')} className="hover:text-primary-500 transition-colors">Política de Privacidad</button></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-widest">Contacto</h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                   <li className="flex items-start gap-3">
                      <Mail size={16} className="text-primary-500 mt-0.5 shrink-0" />
                      <button onClick={() => onNavigate('CONTACT')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Formulario de Contacto</button>
                   </li>
                </ul>
             </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-dark-border/50 px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-white dark:bg-dark-card px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-dark-border/50">
                <span>© 2025 {config?.siteTitle || 'enDetalle'}. Creado con</span>
                <Heart size={12} className="text-red-500 fill-red-500" />
            </div>
            <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">CMS v5.2</span>
          </div>

          <div className="flex gap-4">
             {links.twitter && <a href={links.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-200 dark:bg-dark-card flex items-center justify-center hover:bg-primary-400 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all"><Twitter size={16} /></a>}
             {links.github && <a href={links.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-200 dark:bg-dark-card flex items-center justify-center hover:bg-primary-400 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all"><Github size={16} /></a>}
             {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-200 dark:bg-dark-card flex items-center justify-center hover:bg-primary-400 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all"><Linkedin size={16} /></a>}
             {links.instagram && <a href={links.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-200 dark:bg-dark-card flex items-center justify-center hover:bg-primary-400 text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-all"><Instagram size={16} /></a>}
          </div>
       </div>
    </footer>
  );
};

export default Footer;
