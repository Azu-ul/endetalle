
import React from 'react';
import { CheckCircle2, X, Zap, Crown, GraduationCap, ShieldCheck, Download, Users, ArrowDown, HelpCircle, Star } from 'lucide-react';
import { PricingPlan } from '../types';

interface SubscriptionPageProps {
  plans: PricingPlan[];
  onSubscribe: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ plans, onSubscribe }) => {
  
  const scrollToPlans = () => {
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-in fade-in duration-700">
        
        {/* HERO SECTION - FUNNEL TOP */}
        <div className="relative py-20 lg:py-32 bg-slate-900 overflow-hidden -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-16">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full border border-primary-500/20 text-sm font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    <ShieldCheck size={16} /> Verificado por Expertos
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                    Domina el Arte de <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Construir Mejor</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    Accede a la biblioteca más completa de detalles constructivos, normativas y herramientas IA. Ahorra cientos de horas en documentación.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={scrollToPlans} className="bg-primary-400 hover:bg-primary-500 text-slate-900 text-lg font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-400/20 hover:scale-105 transition-all">
                        Ver Planes y Precios
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white text-lg font-bold px-8 py-4 rounded-xl backdrop-blur-sm border border-white/10 transition-colors">
                        Explorar Gratis
                    </button>
                </div>
                
                <div className="mt-16 flex justify-center gap-8 lg:gap-16 text-slate-500">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">+10k</span>
                        <span className="text-sm font-medium">Arquitectos</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">500+</span>
                        <span className="text-sm font-medium">Detalles DWG</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">24/7</span>
                        <span className="text-sm font-medium">Soporte IA</span>
                    </div>
                </div>
            </div>
        </div>

        {/* FEATURES GRID - WHY US */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">¿Por qué elegir enDetalle?</h2>
                <p className="text-slate-500 dark:text-slate-400">Todo lo que necesitas para profesionalizar tus entregas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-xl flex items-center justify-center mb-6">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Técnicamente Verificado</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        Cada detalle es revisado por ingenieros y arquitectos senior. Cumplimiento normativo asegurado.
                    </p>
                </div>
                <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                        <Download size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Formatos Editables</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        Descarga directa en DWG y SketchUp. Listos para insertar en tus planos sin marcas de agua.
                    </p>
                </div>
                <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Comunidad Activa</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        Accede a soporte directo de los autores y resuelve dudas constructivas en minutos.
                    </p>
                </div>
            </div>
        </div>

        {/* TESTIMONIALS - SOCIAL PROOF */}
        <div className="bg-slate-50 dark:bg-dark-bg/50 py-20 mb-24 -mx-6 md:-mx-10 px-6 md:px-10">
             <div className="max-w-7xl mx-auto">
                 <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Lo que dicen los profesionales</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border/50">
                         <div className="flex gap-1 text-primary-400 mb-4">
                             <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                         </div>
                         <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"Antes tardaba horas dibujando zapatas y encuentros complejos. Ahora descargo, adapto y entrego. Ha cambiado mi flujo de trabajo."</p>
                         <div className="flex items-center gap-4">
                             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover" />
                             <div>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-sm">Arq. Laura Méndez</h4>
                                 <p className="text-xs text-slate-500">Estudio L&M</p>
                             </div>
                         </div>
                     </div>
                     <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border/50">
                         <div className="flex gap-1 text-primary-400 mb-4">
                             <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                         </div>
                         <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"La calidad técnica es superior a cualquier bloque CAD gratuito que encuentres online. Vale cada centavo de la suscripción."</p>
                         <div className="flex items-center gap-4">
                             <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover" />
                             <div>
                                 <h4 className="font-bold text-slate-900 dark:text-white text-sm">Ing. Carlos Ruiz</h4>
                                 <p className="text-xs text-slate-500">Director de Obra</p>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* PRICING SECTION - THE CONVERSION POINT */}
        <div id="pricing-section" className="max-w-7xl mx-auto px-6 pb-24">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Planes Simples y Transparentes</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400">Invierte en tu carrera profesional hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {plans.map((plan) => (
                    <div 
                        key={plan.id}
                        className={`p-8 rounded-3xl border shadow-sm hover:shadow-xl transition-all relative ${
                            plan.isRecommended 
                                ? 'bg-white dark:bg-dark-surface border-2 border-primary-400 scale-105 z-10 shadow-2xl' 
                                : plan.highlightColor === 'slate' 
                                    ? 'bg-slate-900 text-white border-slate-800' 
                                    : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border'
                        }`}
                    >
                        {plan.isRecommended && (
                            <div className="absolute top-0 right-0 bg-primary-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                RECOMENDADO
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                            <div className={`p-2 rounded-lg ${
                                plan.highlightColor === 'slate' ? 'bg-slate-800' : 'bg-slate-100 dark:bg-primary-900/20'
                            }`}>
                                {plan.price === 0 ? <Zap size={24} className={plan.highlightColor === 'slate' ? 'text-white' : 'text-slate-500'} /> :
                                 plan.price > 20 ? <Crown size={24} className={plan.highlightColor === 'slate' ? 'text-yellow-400' : 'text-primary-500'} /> :
                                 <GraduationCap size={24} className="text-primary-600 dark:text-primary-400" />
                                }
                            </div>
                            <span className={`font-bold ${plan.highlightColor === 'slate' ? 'text-white' : 'text-slate-500 dark:text-primary-400'}`}>{plan.name}</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-bold">${plan.price}</span>
                            <span className={`text-sm ${plan.highlightColor === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>/{plan.interval}</span>
                        </div>

                        <p className={`text-sm mb-8 h-10 ${plan.highlightColor === 'slate' ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className={`flex items-center gap-3 text-sm ${
                                    plan.highlightColor === 'slate' ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    <CheckCircle2 size={18} className={plan.highlightColor === 'slate' ? 'text-primary-400' : 'text-green-500'} /> 
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={onSubscribe} 
                            className={`w-full py-3 rounded-xl font-bold transition-colors ${
                                plan.isRecommended 
                                    ? 'bg-primary-400 hover:bg-primary-500 text-slate-900 shadow-lg shadow-primary-400/20'
                                    : plan.highlightColor === 'slate'
                                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                                        : 'border-2 border-slate-200 dark:border-dark-border text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-dark-bg'
                            }`}
                        >
                            {plan.price === 0 ? 'Plan Actual' : 'Comenzar Ahora'}
                        </button>
                    </div>
                ))}

            </div>
        </div>

        {/* FAQ - REMOVING FRICTION */}
        <div className="max-w-3xl mx-auto px-6 mb-20">
            <h2 className="text-2xl font-bold text-center dark:text-white mb-8">Preguntas Frecuentes</h2>
            <div className="space-y-4">
                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm"><HelpCircle size={16} /> ¿Puedo cancelar en cualquier momento?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sí, no hay contratos de permanencia. Puedes cancelar tu suscripción desde tu panel de usuario cuando quieras.</p>
                </div>
                <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm"><HelpCircle size={16} /> ¿Son compatibles con AutoCAD antiguo?</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Nuestros archivos DWG se guardan en versiones compatibles desde AutoCAD 2013 en adelante para máxima compatibilidad.</p>
                </div>
            </div>
        </div>

    </div>
  );
};

export default SubscriptionPage;
