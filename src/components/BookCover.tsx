import React, { useState } from 'react';

interface BookCoverProps {
  src?: string;
  alt: string;
  title: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function getBookInitials(title: string): string {
  if (!title) return 'BK';
  // Remove non-alphanumeric punctuation but keep unicode letters
  const clean = title.replace(/[^\p{L}\p{N}\s]/gu, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (clean.length >= 2) {
    return clean.slice(0, 2).toUpperCase();
  }
  return (clean || 'BK').toUpperCase();
}

export default function BookCover({
  src,
  alt,
  title,
  className = '',
  size = 'md'
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);

  // If there's no source URL or image failed to load, display the elegant violet gradient placeholder
  if (!src || hasError) {
    const iconSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl' : 'text-xl';
    const initialsSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-sm' : 'text-xs';

    return (
      <div
        className={`bg-gradient-to-br from-[#510073] via-[#2d0f3b] to-[#171219] border border-[#bf6fe5]/30 flex flex-col items-center justify-center text-center select-none relative overflow-hidden p-1 shadow-inner ${className}`}
        title={title}
      >
        {/* Soft atmospheric radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#bf6fe5]/25 via-transparent to-transparent pointer-events-none" />

        <span
          className={`material-symbols-outlined notranslate text-[#e9b3ff] drop-shadow-sm shrink-0 ${iconSize}`}
          translate="no"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          menu_book
        </span>

        <span
          className={`font-serif font-bold text-[#f5dbff] tracking-wider drop-shadow-md mt-0.5 leading-none ${initialsSize}`}
        >
          {getBookInitials(title)}
        </span>

        {size !== 'sm' && (
          <span className="font-sans text-[8px] text-[#e1bee7]/70 line-clamp-1 truncate w-full mt-1 px-1">
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={className}
    />
  );
}
