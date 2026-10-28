import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookReview, BookStatus } from '../types';
import { TRANSLATIONS, Language } from '../translations';
import BookCover from './BookCover';
import HighlightText from './HighlightText';

interface ReviewCardProps {
  key?: React.Key;
  review: BookReview;
  onEdit: (review: BookReview) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
  onFavoriteToggle: (id: string) => void;
  onRatingChange?: (id: string, newRating: number) => void;
  onUpdateProgress?: (id: string, pagesRead: number, totalPages: number) => void;
  onTagClick?: (tag: string) => void;
  activeTag?: string | null;
  searchQuery?: string;
  language: Language;
}

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
  onStatusChange,
  onFavoriteToggle,
  onRatingChange,
  onUpdateProgress,
  onTagClick,
  activeTag,
  searchQuery = '',
  language
}: ReviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // Progress edit state
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [pagesReadInput, setPagesReadInput] = useState<number>(review.pagesRead || 0);
  const [totalPagesInput, setTotalPagesInput] = useState<number>(review.totalPages || 0);

  const menuRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Sync progress inputs when review prop changes
  useEffect(() => {
    setPagesReadInput(review.pagesRead || 0);
    setTotalPagesInput(review.totalPages || 0);
  }, [review.pagesRead, review.totalPages]);

  // Click outside or press Escape to close kebab menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  // Handle saving reading progress
  const handleSaveProgress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const read = Math.max(0, Number(pagesReadInput) || 0);
    const total = Math.max(0, Number(totalPagesInput) || 0);
    if (onUpdateProgress) {
      onUpdateProgress(review.id, read, total);
    }
    setIsEditingProgress(false);
  };

  // Quick adjust pages read (+10 / -10)
  const handleQuickAdjust = (delta: number) => {
    const current = Number(pagesReadInput) || 0;
    const max = Number(totalPagesInput) || 9999;
    const next = Math.max(0, Math.min(max > 0 ? max : 9999, current + delta));
    setPagesReadInput(next);
    if (onUpdateProgress) {
      onUpdateProgress(review.id, next, totalPagesInput);
    }
  };

  // Interactive Half-Star Rating Renderer (0.5 to 5.0)
  const effectiveRating = hoverRating !== null ? hoverRating : review.rating;
  
  const handleStarClick = (value: number) => {
    if (onRatingChange) {
      onRatingChange(review.id, value);
    }
  };

  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const halfValue = i - 0.5;
      const fullValue = i;

      let icon = 'star';
      let isFilled = false;
      let isHalf = false;

      if (effectiveRating >= fullValue) {
        isFilled = true;
        icon = 'star';
      } else if (effectiveRating >= halfValue) {
        isHalf = true;
        icon = 'star_half';
      } else {
        icon = 'star';
      }

      stars.push(
        <div
          key={i}
          className="relative inline-flex items-center justify-center w-5 h-5 cursor-pointer select-none group/star"
          onMouseLeave={() => setHoverRating(null)}
        >
          {/* Left half hit target */}
          <button
            type="button"
            className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer focus:outline-none"
            aria-label={`${halfValue} ${t.RATING}`}
            onMouseEnter={() => setHoverRating(halfValue)}
            onClick={() => handleStarClick(halfValue)}
          />
          {/* Right half hit target */}
          <button
            type="button"
            className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer focus:outline-none"
            aria-label={`${fullValue} ${t.RATING}`}
            onMouseEnter={() => setHoverRating(fullValue)}
            onClick={() => handleStarClick(fullValue)}
          />

          {/* Visual star icon */}
          <span
            className={`material-symbols-outlined notranslate text-base transition-colors ${
              isFilled || isHalf ? 'text-primary' : 'text-outline-variant/60'
            }`}
            translate="no"
            style={{ fontVariationSettings: isFilled || isHalf ? "'FILL' 1" : "'FILL' 0" }}
          >
            {icon}
          </span>
        </div>
      );
    }
    return stars;
  };

  // Reading progress calculation
  const pagesRead = review.pagesRead || 0;
  const totalPages = review.totalPages || 0;
  const progressPercent = totalPages > 0 ? Math.min(100, Math.round((pagesRead / totalPages) * 100)) : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface-container-lowest rounded-2xl custom-shadow border border-outline-variant/20 overflow-visible transition-colors hover:border-outline-variant/50 gpu-accelerated flex flex-col justify-between h-full relative"
    >
      <div className="flex p-3.5 sm:p-4 gap-3 sm:gap-4 relative flex-1">
        {/* Cover Thumbnail with responsive dimensions & elegant fallback */}
        <div className="w-20 sm:w-24 h-32 sm:h-40 rounded-xl overflow-hidden bg-surface-container-highest flex-shrink-0 relative group">
          <BookCover
            src={review.coverUrl}
            alt={review.title}
            title={review.title}
            size="lg"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
          />

          {/* Favorite heart overlay with ergonomic touch hitbox (>= 44x44px) and semi-transparent dark backdrop */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => onFavoriteToggle(review.id)}
            className="absolute top-1.5 right-1.5 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-primary cursor-pointer z-10 border border-white/10"
            title={review.isFavorite ? t.UNFAVORITE : t.FAVORITE}
            aria-label={review.isFavorite ? t.UNFAVORITE : t.FAVORITE}
          >
            <span
              className={`material-symbols-outlined notranslate text-lg transition-transform duration-150 ${
                review.isFavorite ? 'text-[#ff6b8b] scale-110 drop-shadow-sm' : 'text-white/90 drop-shadow-xs hover:text-white'
              }`}
              translate="no"
              style={{ fontVariationSettings: review.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </motion.button>
        </div>

        {/* Info Column */}
        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div>
            {/* Header: Title, Author, Desktop Quick Actions & Kebab Menu */}
            <div className="flex justify-between items-start gap-1 relative">
              <div className="min-w-0 flex-1 pr-1">
                <h3 className="font-serif text-base sm:text-lg text-on-surface font-semibold leading-tight line-clamp-2" title={review.title}>
                  <HighlightText text={review.title} query={searchQuery} />
                </h3>
                <p className="font-sans text-xs text-on-surface-variant italic truncate mt-0.5">
                  <HighlightText text={review.author || t.UNKNOWN_AUTHOR} query={searchQuery} />
                </p>
              </div>

              {/* Top-Right Action Controls (3.1 Compact card: desktop small icons + kebab menu) */}
              <div className="flex items-center gap-0.5 shrink-0 relative" ref={menuRef}>
                {/* Desktop small icon shortcuts with >= 44x44px touch targets */}
                <div className="hidden sm:flex items-center gap-0.5">
                  <button
                    onClick={() => onEdit(review)}
                    title={t.EDIT}
                    aria-label={t.EDIT}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="material-symbols-outlined notranslate text-base" translate="no">edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(review.id)}
                    title={t.DELETE}
                    aria-label={t.DELETE}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-error"
                  >
                    <span className="material-symbols-outlined notranslate text-base" translate="no">delete</span>
                  </button>
                </div>

                {/* Kebab ⋯ menu button with >= 44x44px touch area */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label={t.MORE_ACTIONS}
                  title={t.MORE_ACTIONS}
                  aria-expanded={showMenu}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="material-symbols-outlined notranslate text-lg" translate="no">more_vert</span>
                </button>

                {/* Kebab Dropdown Menu */}
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-10 w-40 bg-surface-container-high/95 backdrop-blur-md rounded-xl shadow-xl border border-outline-variant/30 py-1.5 z-30 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEdit(review);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-left text-on-surface hover:bg-primary/15 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined notranslate text-base" translate="no">edit</span>
                        <span>{t.EDIT}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onDelete(review.id);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-left text-error hover:bg-error/15 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined notranslate text-base" translate="no">delete</span>
                        <span>{t.DELETE}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Direct Status Selector (3.3: Quero ler / Lendo / Terminei) */}
            <div className="mt-2.5">
              <div className="inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant/20 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => onStatusChange(review.id, 'PAUSADO')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    review.status === 'PAUSADO'
                      ? 'bg-tertiary-container/40 text-tertiary shadow-xs font-extrabold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t.STATUS_QUERO_LER}
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(review.id, 'LENDO')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    review.status === 'LENDO'
                      ? 'bg-secondary-container text-[#dfb9ed] shadow-xs font-extrabold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t.STATUS_LENDO_LABEL}
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(review.id, 'CONCLUÍDO')}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    review.status === 'CONCLUÍDO'
                      ? 'bg-primary-container/40 text-primary shadow-xs font-extrabold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t.STATUS_TERMINADO_LABEL}
                </button>
              </div>
            </div>

            {/* Reading Progress Indicator & Quick Inline Editor for "LENDO" (3.3) */}
            {review.status === 'LENDO' && (
              <div className="mt-2.5 bg-surface-container/50 rounded-xl p-2 border border-outline-variant/15">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingProgress(!isEditingProgress)}
                    className="text-on-surface font-semibold flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                    title={t.EDIT_PROGRESS}
                  >
                    <span className="material-symbols-outlined notranslate text-xs text-primary" translate="no">
                      menu_book
                    </span>
                    <span>
                      {pagesRead} {t.PAGES_OF} {totalPages > 0 ? totalPages : '—'} ({progressPercent}%)
                    </span>
                    <span className="material-symbols-outlined notranslate text-[12px] text-on-surface-variant/70" translate="no">
                      {isEditingProgress ? 'expand_less' : 'edit'}
                    </span>
                  </button>

                  {/* Quick +10 / -10 buttons with minimum 44px touch target on mobile */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickAdjust(-10)}
                      disabled={pagesRead <= 0}
                      className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:px-2 sm:py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs sm:text-[10px] font-bold text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
                      title={t.ADJUST_PAGES_MINUS}
                      aria-label={t.ADJUST_PAGES_MINUS}
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdjust(10)}
                      className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:px-2 sm:py-0.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs sm:text-[10px] font-bold text-primary cursor-pointer flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
                      title={t.ADJUST_PAGES_PLUS}
                      aria-label={t.ADJUST_PAGES_PLUS}
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-[#bf6fe5] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Inline Quick Progress Editor */}
                <AnimatePresence>
                  {isEditingProgress && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      onSubmit={handleSaveProgress}
                      className="overflow-hidden pt-2 mt-2 border-t border-outline-variant/15 flex items-center gap-2"
                    >
                      <div className="flex-1 flex items-center gap-1">
                        <label className="text-[10px] text-on-surface-variant shrink-0">{t.PAGES_PROGRESS}:</label>
                        <input
                          type="number"
                          min="0"
                          value={pagesReadInput}
                          onChange={(e) => setPagesReadInput(Number(e.target.value))}
                          className="w-14 bg-surface-container-highest px-1.5 py-1 rounded text-xs text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-1">
                        <label className="text-[10px] text-on-surface-variant shrink-0">{t.TOTAL_PAGES}:</label>
                        <input
                          type="number"
                          min="0"
                          value={totalPagesInput}
                          onChange={(e) => setTotalPagesInput(Number(e.target.value))}
                          className="w-14 bg-surface-container-highest px-1.5 py-1 rounded text-xs text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-2 py-1 bg-primary text-on-primary rounded text-[10px] font-bold hover:bg-primary-container cursor-pointer shrink-0"
                      >
                        {t.SAVE}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Rating Stars with half-stars, clickable directly on card (3.10) */}
            <div className="flex items-center gap-1.5 my-2">
              <div className="flex items-center gap-0.5">{renderInteractiveStars()}</div>
              <span className="text-xs font-bold text-[#dfb9ed] ml-1">
                {effectiveRating.toFixed(1)}
              </span>
            </div>

            {/* Review text or prominent "Escrever review" button (3.4 & 3.5) */}
            <div className="relative mt-1">
              {review.reviewText && review.reviewText.trim().length > 0 ? (
                <>
                  <motion.div
                    layout
                    className={`font-sans text-xs text-on-surface-variant leading-relaxed transition-colors ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    <HighlightText text={review.reviewText} query={searchQuery} />
                  </motion.div>
                  {review.reviewText.length > 90 && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="min-h-[44px] py-2 flex items-center gap-1 text-xs text-primary hover:text-[#dfb9ed] font-semibold focus:outline-none cursor-pointer transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? t.SHOW_LESS : t.READ_MORE}</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="material-symbols-outlined notranslate text-base"
                        translate="no"
                      >
                        expand_more
                      </motion.span>
                    </button>
                  )}
                </>
              ) : (
                /* Empty review state: prominent "Escrever review" button (3.5) */
                <div className="pt-1">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => onEdit(review)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/15 hover:bg-primary/25 text-primary border border-primary/25 transition-all cursor-pointer min-h-[44px] active:scale-95 shadow-xs"
                  >
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">edit_note</span>
                    <span>{t.WRITE_REVIEW}</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Clickable Tags list (3.7) */}
            {review.tags && review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {review.tags.map((tag, idx) => {
                  const isTagActive = activeTag && (activeTag === tag || activeTag === tag.replace(/^#/, ''));
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onTagClick?.(tag)}
                      title={`${t.FILTERED_BY_TAG}: ${tag}`}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition-all cursor-pointer border ${
                        isTagActive
                          ? 'bg-primary text-on-primary border-primary font-bold shadow-xs'
                          : 'bg-surface-container text-[#dfb9ed] border-transparent hover:bg-surface-container-high hover:border-outline-variant/30'
                      }`}
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
