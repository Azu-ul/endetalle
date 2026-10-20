
import React from 'react';
import { Scale } from 'lucide-react';

interface LegalPageProps {
  title: string;
  content: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, content }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary-400/20 text-primary-600 dark:text-primary-400 rounded-xl">
                <Scale size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h1>
        </div>
        
        <div className="bg-white dark:bg-dark-surface p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-line text-slate-600 dark:text-slate-300">
                {content}
            </div>
        </div>
    </div>
  );
};

export default LegalPage;
