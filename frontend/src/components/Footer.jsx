import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/50 py-8 dark:bg-slate-950 dark:border-slate-800/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
              <ChefHat className="h-4 w-4" />
            </span>
            <span className="font-bold text-slate-800 dark:text-white">
              Cook<span className="text-amber-500">Verse</span> AI
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CookVerse AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
