
import React from 'react';
import { Author, ConstructionDetail } from '../types';
import { ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

interface AuthorsPageProps {
  authors: Author[];
  details: ConstructionDetail[];
  onAuthorClick: (author: Author) => void;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({ authors, details, onAuthorClick }) => {
  
  const getAuthorStats = (authorName: string) => {
      const authorDetails = details.filter(d => d.author.name === authorName);
      const totalLikes = authorDetails.reduce((acc, curr) => acc + curr.likes, 0);
      const totalViews = Math.floor(totalLikes * 12.5);
      return { posts: authorDetails.length, likes: totalLikes, views: totalViews };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase text-sm">Comunidad Experta</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2 mb-6">Autores Destacados</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
                Conoce a los arquitectos e ingenieros que están construyendo la biblioteca técnica más grande del mundo.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author, idx) => {
                const stats = getAuthorStats(author.name);
                return (
                <div key={idx} className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200 dark:border-dark-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                            <img src={author.avatarUrl} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-dark-bg shadow-md group-hover:scale-105 transition-transform" />
                            <div className="absolute -bottom-2 -right-2 bg-primary-400 p-1.5 rounded-full border-2 border-white dark:border-dark-bg">
                                <ShieldCheck size={16} className="text-slate-900" />
                            </div>
                        </div>
                        <button className="p-2 bg-slate-50 dark:bg-dark-bg rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary-400 hover:text-slate-900 transition-colors">
                            <UserPlus size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">{author.name}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{author.role}</p>
                    
                    {author.team && (
                        <div className="bg-slate-50 dark:bg-dark-bg px-3 py-2 rounded-lg inline-block text-xs font-bold text-slate-600 dark:text-slate-300 mb-6">
                            {author.team}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-dark-border pt-4 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.posts}</span>
                            <span className="text-xs uppercase font-bold text-slate-400">Posts</span>
                        </div>
                        <div className="h-8 w-px bg-slate-100 dark:bg-dark-border"></div>
                         <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.views > 1000 ? (stats.views/1000).toFixed(1) + 'k' : stats.views}</span>
                            <span className="text-xs uppercase font-bold text-slate-400">Vistas</span>
                        </div>
                        <button onClick={() => onAuthorClick(author)} className="text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            Perfil <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )})}
        </div>
    </div>
  );
};

export default AuthorsPage;
