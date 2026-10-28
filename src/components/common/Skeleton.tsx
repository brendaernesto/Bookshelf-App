import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-surface-container-highest/60 ${className}`}
    />
  );
}

export function SkeletonBookCard() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando livro..."
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-surface-container-low/70 border border-primary/10 shadow-sm"
    >
      {/* Book Cover skeleton */}
      <div className="w-28 sm:w-32 h-40 sm:h-44 rounded-xl bg-surface-container-highest/60 animate-pulse shrink-0 self-center sm:self-start" />

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonQuoteCard() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando citação..."
      className="p-5 rounded-2xl bg-surface-container-low/60 border border-primary/10 space-y-3"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonStatsGrid() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando estatísticas..."
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-4 rounded-2xl bg-surface-container-low/50 border border-primary/10 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
}
