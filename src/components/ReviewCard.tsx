import React, { useState } from 'react';
import { BookReview, BookStatus } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ReviewCardProps {
  key?: string | number;
  review: BookReview;
  onEdit: (review: BookReview) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
  onFavoriteToggle: (id: string) => void;
  language: Language;
}

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
  onStatusChange,
  onFavoriteToggle,
  language
}: ReviewCardProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const t = TRANSLATIONS[language];

  // Helper to render beautiful stars based on value (0 to 5)
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="material-symbols-outlined notranslate text-sm text-primary" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="material-symbols-outlined notranslate text-sm text-primary" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>
            star_half
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined notranslate text-sm text-outline-variant" translate="no">
            star
          </span>
        );
      }
    }
    return stars;
  };

  const getStatusStyle = (status: BookStatus) => {
    switch (status) {
      case 'CONCLUÍDO':
        return 'bg-primary-container/20 text-primary border border-primary/20';
      case 'LENDO':
        return 'bg-secondary-container/50 text-[#dfb9ed] border border-secondary-container/30';
      case 'PAUSADO':
        return 'bg-tertiary-container/20 text-tertiary border border-tertiary-container/20';
      default:
        return 'bg-surface-container-highest text-on-surface';
    }
  };

  const getStatusLabel = (status: BookStatus) => {
    switch (status) {
      case 'CONCLUÍDO':
        return t.STATUS_CONCLUIDO;
      case 'LENDO':
        return t.STATUS_LENDO;
      case 'PAUSADO':
        return t.STATUS_PAUSADO;
      default:
        return status;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl custom-shadow border border-outline-variant/20 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-outline-variant/60">
      <div className="flex p-4 gap-4 relative">
        {/* Cover Thumbnail */}
        <div className="w-24 h-36 rounded-lg overflow-hidden bg-surface-container-highest flex-shrink-0 relative group">
          {review.coverUrl ? (
            <img
              src={review.coverUrl}
              alt={review.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-primary bg-surface-container-low border border-primary/10">
              <span className="material-symbols-outlined notranslate text-4xl" translate="no" style={{ fontVariationSettings: "'FILL' 0" }}>
                auto_stories
              </span>
              <span className="text-[10px] text-on-surface-variant/75 mt-1">
                {language === 'pt' ? 'Sem Capa' : language === 'es' ? 'Sin Portada' : 'No Cover'}
              </span>
            </div>
          )}

          {/* Favorite heart overlay */}
          <button
            onClick={() => onFavoriteToggle(review.id)}
            className="absolute top-1.5 right-1.5 bg-background/80 hover:bg-background h-7 w-7 rounded-full flex items-center justify-center transition-colors shadow-sm focus:outline-none cursor-pointer active:scale-90"
            title={review.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <span
              className={`material-symbols-outlined notranslate text-sm ${review.isFavorite ? 'text-tertiary' : 'text-on-surface-variant'}`}
              translate="no"
              style={{ fontVariationSettings: review.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Info Column */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="font-serif text-lg text-on-surface font-semibold leading-tight truncate">
                {review.title}
              </h3>
              <p className="font-sans text-xs text-on-surface-variant italic truncate mt-0.5">
                {review.author || t.UNKNOWN_AUTHOR}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider shrink-0 uppercase ${getStatusStyle(review.status)}`}>
              {getStatusLabel(review.status)}
            </span>
          </div>

          {/* Rating stars */}
          <div className="flex items-center gap-1.5 my-1.5">
            <div className="flex gap-0.5">{renderStars(review.rating)}</div>
            <span className="text-[11px] font-bold text-[#dfb9ed]">{review.rating.toFixed(1)}</span>
          </div>

          {/* Review text with optional expand/collapse */}
          <div className="relative">
            <p
              onClick={() => setIsExpanded(!isExpanded)}
              className={`font-sans text-xs text-on-surface-variant leading-relaxed cursor-pointer hover:text-on-surface transition-colors ${
                isExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {review.reviewText || t.NO_REVIEW_TEXT}
            </p>
            {review.reviewText && review.reviewText.length > 90 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[10px] text-primary hover:underline block mt-1 font-semibold focus:outline-none cursor-pointer"
              >
                {isExpanded ? t.SHOW_LESS : t.SHOW_MORE}
              </button>
            )}
          </div>

          {/* Mini-Badges / Tags list */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {review.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-surface-container text-[#dfb9ed] text-[10px] px-2 py-0.5 rounded-md hover:bg-surface-container-high transition-colors"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar Dropdowns */}
      {showStatusDropdown && (
        <div className="border-t border-outline-variant/20 bg-surface-container p-2 flex gap-2 items-center justify-center animate-fadeIn">
          <span className="text-[10px] font-bold text-on-surface-variant/85 uppercase mr-2">
            {language === 'pt' ? 'Mudar para:' : language === 'es' ? 'Cambiar a:' : 'Change to:'}
          </span>
          {(['LENDO', 'CONCLUÍDO', 'PAUSADO'] as BookStatus[]).map((st) => (
            <button
              key={st}
              disabled={review.status === st}
              onClick={() => {
                onStatusChange(review.id, st);
                setShowStatusDropdown(false);
              }}
              className={`text-[10px] font-bold px-3 py-1 rounded transition-all active:scale-95 cursor-pointer ${
                review.status === st
                  ? 'bg-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed'
                  : 'bg-[#171219] hover:bg-primary/20 text-[#e9b3ff] hover:text-white border border-[#e9b3ff]/20'
              }`}
            >
              {st === 'LENDO' ? t.STATUS_LENDO : st === 'CONCLUÍDO' ? t.STATUS_CONCLUIDO : t.STATUS_PAUSADO}
            </button>
          ))}
          <button
            onClick={() => setShowStatusDropdown(false)}
            className="text-[10px] text-error bg-error/10 hover:bg-error/20 p-1.5 rounded-full transition-colors font-bold shrink-0 ml-auto"
          >
            <span className="material-symbols-outlined notranslate text-[14px]" translate="no">close</span>
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="border-t border-outline-variant/20 bg-error-container/20 p-3 flex flex-col sm:flex-row gap-3 items-center justify-between animate-fadeIn">
          <span className="text-xs font-semibold text-error text-center sm:text-left">
            {language === 'pt' 
              ? `Deseja excluir permanentemente "${review.title}"?` 
              : language === 'es'
              ? `¿Desea eliminar permanentemente "${review.title}"?`
              : `Permanently delete "${review.title}"?`}
          </span>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-lg transition-colors font-semibold text-on-surface cursor-pointer focus:outline-none"
            >
              {t.CANCEL}
            </button>
            <button
              onClick={() => {
                onDelete(review.id);
                setShowDeleteConfirm(false);
              }}
              className="text-xs bg-error hover:bg-opacity-95 text-[#171219] px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer active:scale-95 focus:outline-none"
            >
              {t.YES_DELETE}
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="border-t border-outline-variant/20 flex divide-x divide-outline-variant/20 bg-[#171219]/30">
        <button
          onClick={() => {
            onEdit(review);
            setShowStatusDropdown(false);
            setShowDeleteConfirm(false);
          }}
          className="flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 text-primary hover:bg-surface-container-low transition-colors cursor-pointer active:bg-surface-container"
        >
          <span className="material-symbols-outlined notranslate text-[16px] text-primary" translate="no" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
          {t.EDIT}
        </button>
        <button
          onClick={() => {
            setShowStatusDropdown(!showStatusDropdown);
            setShowDeleteConfirm(false);
          }}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 text-primary hover:bg-surface-container-low transition-colors cursor-pointer active:bg-surface-container ${
            showStatusDropdown ? 'bg-surface-container-low text-white font-bold' : ''
          }`}
        >
          <span className="material-symbols-outlined notranslate text-[16px] text-primary animate-spin duration-1000" translate="no" style={{ animationIterationCount: showStatusDropdown ? 'infinite' : '0' }}>sync</span>
          {language === 'pt' ? 'Status' : language === 'es' ? 'Estado' : 'Status'}
        </button>
        <button
          onClick={() => {
            setShowDeleteConfirm(!showDeleteConfirm);
            setShowStatusDropdown(false);
          }}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 text-error hover:bg-error/10 transition-colors cursor-pointer active:bg-error/20 ${
            showDeleteConfirm ? 'bg-error-container/20 text-white font-bold' : ''
          }`}
        >
          <span className="material-symbols-outlined notranslate text-xs text-error" translate="no" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
          {t.DELETE}
        </button>
      </div>
    </div>
  );
}
