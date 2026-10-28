import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

export default function EmptyState({
  icon = 'auto_stories',
  title,
  description,
  actionLabel,
  onAction,
  actionIcon = 'add'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-primary/20 rounded-3xl bg-surface-container-low/40 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
        <span className="material-symbols-outlined text-3xl" aria-hidden="true">
          {icon}
        </span>
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-bold text-on-surface mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-on-surface-variant max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm flex items-center gap-2 hover:bg-primary-container transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          {actionIcon && (
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              {actionIcon}
            </span>
          )}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
