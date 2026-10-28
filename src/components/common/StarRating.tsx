import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  ratingWord?: string;
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  ariaLabel = 'Avaliação por estrelas',
  ratingWord = 'estrelas'
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const activeValue = hoverValue !== null ? hoverValue : value;

  const sizeClasses = {
    sm: { star: 'text-sm', container: 'w-4 h-4' },
    md: { star: 'text-lg', container: 'w-6 h-6' },
    lg: { star: 'text-2xl', container: 'w-8 h-8' }
  }[size];

  // Handle keyboard navigation for interactive ratings (WCAG AA)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly || !onChange) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, Math.round((value + 0.5) * 2) / 2);
      onChange(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(0, Math.round((value - 0.5) * 2) / 2);
      onChange(prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(5);
    }
  };

  return (
    <div
      role={readOnly ? 'img' : 'slider'}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={value}
      aria-valuetext={`${value} ${ratingWord}`}
      tabIndex={readOnly ? undefined : 0}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center gap-1 ${
        readOnly ? '' : 'cursor-pointer p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-container'
      }`}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const halfStar = starIndex - 0.5;
        const fullStar = starIndex;

        let icon = 'star';
        let isFilled = false;
        let isHalf = false;

        if (activeValue >= fullStar) {
          isFilled = true;
          icon = 'star';
        } else if (activeValue >= halfStar) {
          isHalf = true;
          icon = 'star_half';
        } else {
          icon = 'star';
        }

        return (
          <div
            key={starIndex}
            className={`relative inline-flex items-center justify-center ${sizeClasses.container}`}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
          >
            {/* Interactive hit areas */}
            {!readOnly && onChange && (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`${halfStar} ${ratingWord}`}
                  title={`${halfStar} ${ratingWord}`}
                  className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoverValue(halfStar)}
                  onClick={() => onChange(halfStar)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`${fullStar} ${ratingWord}`}
                  title={`${fullStar} ${ratingWord}`}
                  className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoverValue(fullStar)}
                  onClick={() => onChange(fullStar)}
                />
              </>
            )}

            <span
              className={`material-symbols-outlined transition-colors select-none ${sizeClasses.star} ${
                isFilled || isHalf
                  ? 'text-amber-400 font-fill'
                  : 'text-zinc-600 dark:text-zinc-600 light:text-zinc-300'
              }`}
              style={{
                fontVariationSettings: isFilled || isHalf ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300"
              }}
              aria-hidden="true"
            >
              {icon}
            </span>
          </div>
        );
      })}
    </div>
  );
}
