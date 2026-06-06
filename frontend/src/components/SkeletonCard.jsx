import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-800/50 dark:bg-slate-900">
      {/* Shimmer Image */}
      <div className="animate-shimmer h-48 w-full bg-slate-250 dark:bg-slate-800"></div>
      
      {/* Shimmer Details */}
      <div className="p-5 space-y-4">
        <div className="animate-shimmer h-5 w-2/3 rounded-lg bg-slate-250 dark:bg-slate-800"></div>
        <div className="flex gap-4">
          <div className="animate-shimmer h-4 w-16 rounded-md bg-slate-250 dark:bg-slate-800"></div>
          <div className="animate-shimmer h-4 w-12 rounded-md bg-slate-250 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
