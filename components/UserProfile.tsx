import React from 'react';
import { Author, ConstructionDetail } from '../types';
import { ArrowLeft, MapPin, Link as LinkIcon, Mail, ShieldCheck, CheckCircle2, ArrowUpRight, Bookmark } from 'lucide-react';

interface UserProfileProps {
  author: Author;
  authorDetails: ConstructionDetail[];
  onBack: () => void;
  onSelectDetail: (detail: ConstructionDetail) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (detailId: string, e?: React.MouseEvent) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  author, 
  authorDetails, 
  onBack, 
  onSelectDetail,
  favoriteIds = [],
  onToggleFavorite
}) => {
  return (
    <div className="pb-20 animate-in slide-in-from-right duration-500">
      
      {/* Navigation */}
      <div className="mb-6 sticky top-0 z-30 pt-4 pb-2 bg-slate-50/95 dark:bg-dark-bg/95 backdrop-blur">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Volver</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="relative bg-white dark:bg-dark-surface rounded-3xl overflow-hidden border border-slate-200 dark:border-dark-border shadow-sm mb-10">
        {/* Cover Image */}
        <div className="h-48 bg-slate-900 relative overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-40" 
                alt="Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-6">
                {/* Avatar */}
                <div className="relative">
                    <img 
                        src={author.avatarUrl} 
                        alt={author.name} 
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-surface object-cover shadow-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-primary-400 text-slate-900 p-1.5 rounded-full border-4 border-white dark:border-dark-surface">
                        <ShieldCheck size={18} />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-slate-900 dark:text-white mb-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        {author.name}
                        <CheckCircle2 size={20} className="text-primary-400" />
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{author.role}</p>
                    {author.team && <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mt-1">{author.team}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-primary-400 hover:bg-primary-500 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-primary-400/20">
                        Seguir
                    </button>
                    <button className="flex-1 md:flex-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                        Mensaje
                    </button>
                </div>
            </div>

            {/* Stats & Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-dark-border/50">
                <div className="flex gap-8">
                    <div>
                        <span className="block text-2xl font-bold text-slate-900 dark:text-white">{authorDetails.length}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Publicaciones</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-slate-900 dark:text-white">12.5k</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Seguidores</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-slate-900 dark:text-white">4.9</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Rating</span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>Barcelona, España</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <LinkIcon size={16} />
                        <a href="#" className="hover:text-primary-500 transition-colors">www.architecture-portfolio.com</a>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Author's Posts Grid */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pl-1">Publicaciones Destacadas</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {authorDetails.map((detail) => (
            <div 
              key={detail.id}
              onClick={() => onSelectDetail(detail)}
              className="group bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col relative"
            >
              <div className="relative aspect-[9/16] overflow-hidden bg-slate-900">
                <img 
                  src={detail.imageUrl} 
                  alt={detail.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                     <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                        {detail.category.split(' ')[0]}
                     </span>
                     {onToggleFavorite && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           onToggleFavorite(detail.id, e);
                         }}
                         className={`p-2 rounded-full backdrop-blur-md border transition-all hover:scale-110 active:scale-95 shadow-md ${
                           favoriteIds.includes(detail.id)
                             ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-amber-400/30'
                             : 'bg-black/50 hover:bg-black/80 text-white border-white/20'
                         }`}
                         title={favoriteIds.includes(detail.id) ? "Quitar de favoritos" : "Guardar como Favorito"}
                       >
                         <Bookmark size={15} fill={favoriteIds.includes(detail.id) ? "currentColor" : "none"} />
                       </button>
                     )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-primary-400 text-slate-900 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <ArrowUpRight size={32} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 text-white">
                   <h3 className="text-lg font-bold leading-tight mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
                     {detail.title}
                   </h3>
                </div>
              </div>
            </div>
        ))}
      </div>

    </div>
  );
};

export default UserProfile;