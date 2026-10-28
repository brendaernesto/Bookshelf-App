import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { UserProfile, BookReview } from '../types';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { AnimatePresence, motion } from 'motion/react';
import BookCover from './BookCover';
import { DataService } from '../services/dataService';
import { SkeletonQuoteCard } from './common/Skeleton';

export interface BookQuote {
  id: string;
  bookTitle: string;
  quoteText: string;
  page?: string;
  chapter?: string;
  savedAt: string;
  userId?: string;
}

interface WritingViewProps {
  language: Language;
  user: UserProfile;
  libraryBooks?: BookReview[];
}

export default function WritingView({ language, user, libraryBooks = [] }: WritingViewProps) {
  const [quotes, setQuotes] = useState<BookQuote[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [page, setPage] = useState('');
  const [chapter, setChapter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingQuote, setEditingQuote] = useState<BookQuote | null>(null);

  // Validation errors
  const [bookTitleError, setBookTitleError] = useState<string | null>(null);
  const [quoteTextError, setQuoteTextError] = useState<string | null>(null);

  // Autocomplete state for Reference Book
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  // Autoresize textarea ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // New quote glow and scroll effect
  const [glowQuoteId, setGlowQuoteId] = useState<string | null>(null);

  // Filters & Search for saved quotes (Item 4.4)
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('ALL');
  const [quotesSearchQuery, setQuotesSearchQuery] = useState('');

  // Copy feedback state: tracks quote ID currently copied (Item 4.6)
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);

  // Generating card state (Item 4.5)
  const [generatingCardId, setGeneratingCardId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Auto-resize textarea whenever quoteText changes (Item 4.1)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(90, scrollH)}px`;
    }
  }, [quoteText]);

  // Handle click outside autocomplete dropdown (Item 4.2)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteContainerRef.current && !autocompleteContainerRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load quotes from Firestore with local storage fallback
  useEffect(() => {
    if (!user?.uid) return;

    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const result = await DataService.getQuotes(user.uid);
        if (result.success && result.data) {
          setQuotes(result.data);
        }
      } catch (err) {
        console.error("Error loading quotes: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, [user?.uid]);

  // Autocomplete matching books from user's library (Item 4.2)
  const bookSuggestions = useMemo(() => {
    if (!bookTitle || !bookTitle.trim()) {
      return libraryBooks.slice(0, 5);
    }
    const query = bookTitle.toLowerCase().trim();
    return libraryBooks.filter((b) =>
      b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [bookTitle, libraryBooks]);

  // Unique list of books in saved quotes for the filter dropdown (Item 4.4)
  const uniqueBooksInQuotes = useMemo(() => {
    const set = new Set<string>();
    quotes.forEach((q) => {
      if (q.bookTitle) set.add(q.bookTitle.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [quotes]);

  // Filtered quotes based on book dropdown and search query (Item 4.4)
  const filteredQuotes = useMemo(() => {
    let list = quotes;

    if (selectedBookFilter !== 'ALL') {
      list = list.filter((q) => q.bookTitle.trim().toLowerCase() === selectedBookFilter.trim().toLowerCase());
    }

    if (quotesSearchQuery.trim()) {
      const q = quotesSearchQuery.toLowerCase().trim();
      list = list.filter((item) =>
        item.quoteText.toLowerCase().includes(q) ||
        item.bookTitle.toLowerCase().includes(q) ||
        (item.chapter && item.chapter.toLowerCase().includes(q)) ||
        (item.page && item.page.toLowerCase().includes(q))
      );
    }

    return list;
  }, [quotes, selectedBookFilter, quotesSearchQuery]);

  // Validate form inline without alert() (Item 4.3)
  const validateForm = (): boolean => {
    let isValid = true;

    if (!bookTitle.trim()) {
      setBookTitleError(t.ERROR_BOOK_REQUIRED);
      isValid = false;
    } else {
      setBookTitleError(null);
    }

    if (!quoteText.trim()) {
      setQuoteTextError(t.ERROR_QUOTE_REQUIRED);
      isValid = false;
    } else {
      setQuoteTextError(null);
    }

    return isValid;
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.uid) return;

    const id = editingQuote ? editingQuote.id : 'quote-' + Date.now();
    const savedAt = editingQuote ? editingQuote.savedAt : new Date().toISOString();
    const path = `users/${user.uid}/quotes/${id}`;

    const newQuote: BookQuote = {
      id,
      bookTitle: bookTitle.trim(),
      quoteText: quoteText.trim(),
      savedAt,
      userId: user.uid,
      ...(page.trim() ? { page: page.trim() } : {}),
      ...(chapter.trim() ? { chapter: chapter.trim() } : {})
    };

    try {
      const res = await DataService.saveQuote(newQuote, user.uid);

      if (res.success && res.data) {
        let updated: BookQuote[];
        if (editingQuote) {
          updated = quotes.map((q) => (q.id === id ? res.data! : q));
          setToastMessage(t.TOAST_EDITED);
        } else {
          updated = [res.data, ...quotes];
          setToastMessage(t.TOAST_QUOTE_ADDED);
        }

        setQuotes(updated);

        // Reset fields & errors
        setBookTitle('');
        setQuoteText('');
        setPage('');
        setChapter('');
        setEditingQuote(null);
        setBookTitleError(null);
        setQuoteTextError(null);
        setIsAutocompleteOpen(false);

        // Trigger temporary glow pulse highlight and scroll into view (Item 4.3)
        setGlowQuoteId(id);
        setTimeout(() => {
          const el = document.getElementById(`quote-card-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        // Clear glow after 4 seconds
        setTimeout(() => {
          setGlowQuoteId((prev) => (prev === id ? null : prev));
        }, 4000);

        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setToastMessage(t.QUOTE_ERROR_SAVE);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.error("Failed to save quote: ", err);
      setToastMessage(t.QUOTE_ERROR_SAVE);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      await DataService.deleteQuote(id, user.uid);

      const filtered = quotes.filter((q) => q.id !== id);
      setQuotes(filtered);

      setToastMessage(t.TOAST_DELETED);
      setTimeout(() => setToastMessage(null), 3500);

      if (editingQuote?.id === id) {
        setEditingQuote(null);
        setBookTitle('');
        setQuoteText('');
        setPage('');
        setChapter('');
        setBookTitleError(null);
        setQuoteTextError(null);
      }
    } catch (err) {
      console.error("Failed to delete quote: ", err);
      setToastMessage(language === 'pt' ? 'Erro ao excluir anotação.' : language === 'es' ? 'Error al eliminar la anotación.' : 'Error deleting note.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleStartEditQuote = (quote: BookQuote) => {
    setEditingQuote(quote);
    setBookTitle(quote.bookTitle);
    setQuoteText(quote.quoteText);
    setPage(quote.page || '');
    setChapter(quote.chapter || '');
    setBookTitleError(null);
    setQuoteTextError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingQuote(null);
    setBookTitle('');
    setQuoteText('');
    setPage('');
    setChapter('');
    setBookTitleError(null);
    setQuoteTextError(null);
  };

  // Copy Quote to clipboard with 2s checkmark feedback (Item 4.6)
  const handleCopyQuote = async (quote: BookQuote) => {
    let copyString = `"${quote.quoteText}"\n— ${quote.bookTitle}`;
    if (quote.page) copyString += ` (${language === 'pt' ? 'pág.' : language === 'es' ? 'pág.' : 'p.'} ${quote.page})`;
    if (quote.chapter) copyString += ` (${language === 'pt' ? 'cap.' : language === 'es' ? 'cap.' : 'ch.'} ${quote.chapter})`;

    try {
      await navigator.clipboard.writeText(copyString);
      setCopiedQuoteId(quote.id);
      setTimeout(() => {
        setCopiedQuoteId((prev) => (prev === quote.id ? null : prev));
      }, 2000);
    } catch (err) {
      console.warn("Could not copy quote:", err);
    }
  };

  // Generate PNG card using HTML5 Canvas & trigger download (Item 4.5)
  const handleShareAsImage = async (quote: BookQuote) => {
    setGeneratingCardId(quote.id);

    try {
      // 1200 x 750 high resolution canvas
      const width = 1200;
      const height = 750;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background deep dark violet gradient (#150021 to #37004f to #1a0029)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#150021');
      bgGrad.addColorStop(0.5, '#35004c');
      bgGrad.addColorStop(1, '#1b002a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric radial violet glow in the center-top
      const glowGrad = ctx.createRadialGradient(width / 2, 200, 50, width / 2, 200, 550);
      glowGrad.addColorStop(0, 'rgba(191, 111, 229, 0.22)');
      glowGrad.addColorStop(1, 'rgba(81, 0, 115, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Elegant card border frame
      ctx.strokeStyle = 'rgba(191, 111, 229, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Inner faint corner accent dots
      ctx.fillStyle = '#bf6fe5';
      const corners = [
        [50, 50],
        [width - 50, 50],
        [50, height - 50],
        [width - 50, height - 50]
      ];
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Header badge & branding
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#dfb9ed';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '5px';
      const headerTitle = language === 'pt' ? 'BOOKSHELF • DIÁRIO DE CITAÇÕES' : language === 'es' ? 'BOOKSHELF • DIARIO DE CITAS' : 'BOOKSHELF • READING JOURNAL';
      ctx.fillText(headerTitle, width / 2, 90);

      // 4. Large decorative quotation mark
      ctx.font = 'italic 160px "Georgia", "Newsreader", serif';
      ctx.fillStyle = 'rgba(191, 111, 229, 0.16)';
      ctx.textAlign = 'left';
      ctx.fillText('“', 80, 220);

      // 5. Quote text with wrapping and adaptive font size
      ctx.textAlign = 'center';
      const maxQuoteWidth = 980;
      let quoteFontSize = 34;
      if (quote.quoteText.length > 350) quoteFontSize = 26;
      else if (quote.quoteText.length > 200) quoteFontSize = 29;

      ctx.font = `italic ${quoteFontSize}px "Newsreader", "Georgia", "Merriweather", serif`;
      ctx.fillStyle = '#f8edfb';

      // Text wrapping algorithm
      const words = quote.quoteText.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxQuoteWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Calculate vertical start to center quote block
      const lineHeight = quoteFontSize * 1.5;
      const totalQuoteBlockHeight = lines.length * lineHeight;
      let quoteStartY = 260;
      if (height / 2 - totalQuoteBlockHeight / 2 > 170) {
        quoteStartY = Math.max(190, height / 2 - totalQuoteBlockHeight / 2 - 20);
      }

      lines.forEach((line, idx) => {
        ctx.fillText(`“${idx === 0 ? '' : ''}${line}${idx === lines.length - 1 ? '”' : ''}`, width / 2, quoteStartY + idx * lineHeight);
      });

      // 6. Ornamental separator divider
      const dividerY = Math.min(height - 150, quoteStartY + lines.length * lineHeight + 35);
      const divGrad = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
      divGrad.addColorStop(0, 'rgba(191, 111, 229, 0)');
      divGrad.addColorStop(0.5, 'rgba(191, 111, 229, 0.7)');
      divGrad.addColorStop(1, 'rgba(191, 111, 229, 0)');
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 180, dividerY);
      ctx.lineTo(width / 2 + 180, dividerY);
      ctx.stroke();

      // Little diamond in center of divider
      ctx.fillStyle = '#e9b3ff';
      ctx.beginPath();
      ctx.moveTo(width / 2, dividerY - 5);
      ctx.lineTo(width / 2 + 5, dividerY);
      ctx.lineTo(width / 2, dividerY + 5);
      ctx.lineTo(width / 2 - 5, dividerY);
      ctx.closePath();
      ctx.fill();

      // 7. Reference Book Title
      ctx.font = 'bold 26px "Newsreader", "Georgia", serif';
      ctx.fillStyle = '#e9b3ff';
      ctx.fillText(quote.bookTitle, width / 2, dividerY + 45);

      // 8. Page & Chapter details
      const details: string[] = [];
      if (quote.page) details.push(`${language === 'pt' ? 'Página' : language === 'es' ? 'Página' : 'Page'} ${quote.page}`);
      if (quote.chapter) details.push(`${language === 'pt' ? 'Capítulo' : language === 'es' ? 'Capítulo' : 'Chapter'} ${quote.chapter}`);
      if (details.length > 0) {
        ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#dfb9ed';
        ctx.fillText(details.join('  •  '), width / 2, dividerY + 75);
      }

      // 9. Watermark footer
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = 'rgba(223, 185, 237, 0.6)';
      ctx.fillText('bookshelf.app', width / 2, height - 52);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeName = quote.bookTitle
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, '-')
          .replace(/-+/g, '-')
          .slice(0, 30);
        a.download = `citacao-${safeName || 'livro'}.png`;
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 'image/png');
    } catch (err) {
      console.error("Error generating quote image: ", err);
    } finally {
      setTimeout(() => setGeneratingCardId(null), 500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-32 space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined notranslate text-primary" translate="no">edit_note</span>
          {t.JOURNAL_TITLE}
        </h2>
        <p className="text-xs text-on-surface-variant italic mt-1 pl-1">
          {t.JOURNAL_SUBTITLE}
        </p>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="bg-[#bf6fe5]/20 text-[#e9b3ff] border border-[#bf6fe5]/35 p-3 rounded-2xl text-xs text-center font-bold shadow-md"
          >
            📝 {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reflection Form (sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <section className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 shadow-xs">
            <form onSubmit={handleSaveQuote} className="space-y-4" noValidate>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1 flex justify-between items-center">
                <span>
                  {editingQuote ? t.QUOTE_EDIT_TITLE : t.QUOTE_REFLECT_TITLE}
                </span>
                {editingQuote && (
                  <span className="text-[9px] bg-[#e86295]/20 text-[#ffb1c8] px-2 py-0.5 rounded-md font-sans font-bold">
                    {t.QUOTE_EDIT_MODE}
                  </span>
                )}
              </h3>

              {/* Reference Book Field with Autocomplete (Item 4.2) */}
              <div ref={autocompleteContainerRef} className="relative">
                <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="book-ref">
                  {t.QUOTE_REFERENCE_LABEL} <span className="text-error font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="book-ref"
                    type="text"
                    required
                    placeholder={t.PLACEHOLDER_BOOK_REF}
                    value={bookTitle}
                    onChange={(e) => {
                      setBookTitle(e.target.value);
                      if (bookTitleError) setBookTitleError(null);
                      setIsAutocompleteOpen(true);
                    }}
                    onFocus={() => setIsAutocompleteOpen(true)}
                    className={`w-full bg-surface-container border rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 transition-all ${
                      bookTitleError
                        ? 'border-error focus:ring-error/50 ring-1 ring-error/30'
                        : 'border-outline-variant/30 focus:border-primary focus:ring-primary'
                    }`}
                    autoComplete="off"
                  />
                  {bookTitle && (
                    <button
                      type="button"
                      onClick={() => {
                        setBookTitle('');
                        setIsAutocompleteOpen(true);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface p-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
                    </button>
                  )}
                </div>

                {/* Inline Validation Error below field (Item 4.3) */}
                {bookTitleError && (
                  <p className="text-error text-[10px] mt-1 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                    <span className="material-symbols-outlined notranslate text-[11px]" translate="no">error</span>
                    {bookTitleError}
                  </p>
                )}

                {/* Autocomplete Dropdown (Item 4.2) */}
                <AnimatePresence>
                  {isAutocompleteOpen && (bookSuggestions.length > 0 || (bookTitle.trim() && !bookSuggestions.some(b => b.title.toLowerCase() === bookTitle.trim().toLowerCase()))) && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.99 }}
                      transition={{ duration: 0.12 }}
                      className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container border border-primary/30 rounded-xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto divide-y divide-outline-variant/10 backdrop-blur-md"
                    >
                      <div className="px-3 py-1.5 bg-primary/10 text-[9px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined notranslate text-xs" translate="no">auto_stories</span>
                        <span>{t.MY_LIBRARY_BOOKS}</span>
                      </div>

                      {bookSuggestions.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => {
                            setBookTitle(book.title);
                            setIsAutocompleteOpen(false);
                            if (bookTitleError) setBookTitleError(null);
                          }}
                          className="px-3 py-2 hover:bg-surface-container-high transition-colors flex items-center gap-2.5 cursor-pointer group"
                        >
                          <BookCover
                            src={book.coverUrl}
                            alt={book.title}
                            title={book.title}
                            size="sm"
                            className="w-6 h-8 object-cover rounded shadow-xs shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                              {book.title}
                            </p>
                            <p className="text-[10px] text-on-surface-variant italic truncate">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Custom book typing option */}
                      {bookTitle.trim() && !bookSuggestions.some((b) => b.title.toLowerCase() === bookTitle.trim().toLowerCase()) && (
                        <div
                          onClick={() => {
                            setIsAutocompleteOpen(false);
                          }}
                          className="px-3 py-2 hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer text-primary"
                        >
                          <span className="material-symbols-outlined notranslate text-xs" translate="no">edit</span>
                          <span className="text-xs font-semibold">
                            {t.AUTOCOMPLETE_CUSTOM_BOOK}: <span className="italic font-serif font-bold text-on-surface">"{bookTitle}"</span>
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Page & Chapter Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="page-ref">
                    {t.QUOTE_PAGE_LABEL}
                  </label>
                  <input
                    id="page-ref"
                    type="text"
                    placeholder={t.PLACEHOLDER_PAGE}
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="chap-ref">
                    {t.QUOTE_CHAPTER_LABEL}
                  </label>
                  <input
                    id="chap-ref"
                    type="text"
                    placeholder={t.PLACEHOLDER_CHAPTER}
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Quote / Passage with Autoresize & Character Counter (Item 4.1) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant" htmlFor="quote-ref">
                    {t.QUOTE_TEXT_LABEL} <span className="text-error font-bold">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      quoteText.length >= 950
                        ? 'text-error font-bold'
                        : quoteText.length >= 800
                        ? 'text-accent'
                        : 'text-on-surface-variant/60'
                    }`}
                  >
                    {quoteText.length}/1000
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  id="quote-ref"
                  required
                  rows={3}
                  maxLength={1000}
                  placeholder={t.INSERT_QUOTE_PLACEHOLDER}
                  value={quoteText}
                  onChange={(e) => {
                    setQuoteText(e.target.value);
                    if (quoteTextError) setQuoteTextError(null);
                  }}
                  className={`w-full bg-surface-container border rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-1 transition-all placeholder:text-on-surface-variant/40 resize-none overflow-hidden ${
                    quoteTextError
                      ? 'border-error focus:ring-error/50 ring-1 ring-error/30'
                      : 'border-outline-variant/30 focus:border-primary focus:ring-primary'
                  }`}
                />

                {/* Inline Validation Error below field (Item 4.3) */}
                {quoteTextError && (
                  <p className="text-error text-[10px] mt-1 font-semibold flex items-center gap-1 animate-in fade-in duration-150">
                    <span className="material-symbols-outlined notranslate text-[11px]" translate="no">error</span>
                    {quoteTextError}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                {editingQuote && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    {t.QUOTE_CANCEL_EDIT}
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-[#bf6fe5] hover:bg-[#a656cc] text-on-primary font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined notranslate text-sm" translate="no">
                    {editingQuote ? 'done' : 'bookmarks'}
                  </span>
                  {editingQuote ? t.SAVE_CHANGES : t.ADD_QUOTE}
                </motion.button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Quotes feed, filter by book, and search (Item 4.4) */}
        <div className="lg:col-span-7 space-y-4">
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1 flex items-center gap-2">
                <span>{t.SAVED_QUOTES}</span>
                <span className="bg-[#bf6fe5]/20 text-[#e9b3ff] text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                  {filteredQuotes.length}{filteredQuotes.length !== quotes.length ? ` / ${quotes.length}` : ''}
                </span>
              </h3>

              {/* Filter by Book Dropdown (Item 4.4) */}
              {uniqueBooksInQuotes.length > 0 && (
                <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/20 rounded-xl px-2.5 py-1 text-xs">
                  <span className="material-symbols-outlined notranslate text-xs text-primary" translate="no">
                    filter_list
                  </span>
                  <select
                    value={selectedBookFilter}
                    onChange={(e) => setSelectedBookFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-primary focus:outline-none cursor-pointer max-w-[180px] truncate"
                    title={t.FILTER_BY_BOOK}
                  >
                    <option value="ALL" className="bg-surface-container text-on-surface">
                      {t.ALL_BOOKS_FILTER}
                    </option>
                    {uniqueBooksInQuotes.map((bTitle) => (
                      <option key={bTitle} value={bTitle} className="bg-surface-container text-on-surface">
                        {bTitle}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Search Input for Saved Quotes (Item 4.4) */}
            {quotes.length > 0 && (
              <div className="relative group">
                <span className="material-symbols-outlined notranslate text-on-surface-variant/50 absolute left-3 top-1/2 -translate-y-1/2 text-xs group-focus-within:text-primary transition-colors" translate="no">
                  search
                </span>
                <input
                  type="text"
                  placeholder={t.SEARCH_QUOTES_PLACEHOLDER}
                  value={quotesSearchQuery}
                  onChange={(e) => setQuotesSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-8 pr-8 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/35 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all"
                />
                {quotesSearchQuery && (
                  <button
                    onClick={() => setQuotesSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary p-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
                  </button>
                )}
              </div>
            )}

            {isLoading ? (
              <div
                role="status"
                aria-busy="true"
                aria-label={t.QUOTE_LOADING}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <SkeletonQuoteCard />
                <SkeletonQuoteCard />
              </div>
            ) : quotes.length === 0 ? (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 text-center text-xs text-on-surface-variant/40">
                {t.NO_QUOTES}
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="bg-surface-container-lowest/50 p-6 rounded-xl border border-outline-variant/15 text-center text-xs text-on-surface-variant/60 space-y-2">
                <p>{t.NO_QUOTES_MATCH}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookFilter('ALL');
                    setQuotesSearchQuery('');
                  }}
                  className="text-primary hover:underline text-xs font-bold cursor-pointer"
                >
                  {t.CLEAR_FILTER}
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredQuotes.map((item) => {
                    const isGlowing = glowQuoteId === item.id;
                    const isCopied = copiedQuoteId === item.id;
                    const isGenerating = generatingCardId === item.id;

                    return (
                      <motion.div
                        layout
                        key={item.id}
                        id={`quote-card-${item.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`bg-surface-container-lowest p-4 rounded-xl border flex flex-col justify-between hover:border-primary/40 transition-all relative group ${
                          isGlowing
                            ? 'ring-2 ring-[#bf6fe5] shadow-[0_0_24px_rgba(191,111,229,0.55)] border-primary bg-primary/10 animate-pulse'
                            : 'border-outline-variant/15 shadow-xs'
                        }`}
                      >
                        <div>
                          {/* Header: Book title and action buttons */}
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="text-[10px] font-bold bg-[#bf6fe5]/15 text-[#e9b3ff] px-2 py-0.5 rounded uppercase font-sans truncate max-w-[70%]">
                              {item.bookTitle}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Edit with >= 44x44px touch target on mobile */}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleStartEditQuote(item)}
                                className="text-on-surface-variant hover:text-[#e9b3ff] transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 rounded-lg hover:bg-surface-container flex items-center justify-center"
                                title={t.EDIT}
                                aria-label={t.EDIT}
                              >
                                <span className="material-symbols-outlined notranslate text-sm" translate="no">edit</span>
                              </motion.button>
                              {/* Delete with >= 44x44px touch target on mobile */}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleDeleteQuote(item.id)}
                                className="text-on-surface-variant hover:text-error transition-colors focus-visible:ring-2 focus-visible:ring-error cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 rounded-lg hover:bg-surface-container flex items-center justify-center"
                                title={t.DELETE}
                                aria-label={t.DELETE}
                              >
                                <span className="material-symbols-outlined notranslate text-sm" translate="no">delete</span>
                              </motion.button>
                            </div>
                          </div>

                          {/* Quote text in serif font */}
                          <p className="font-serif italic text-xs leading-relaxed text-on-surface pt-1 border-t border-outline-variant/10 text-justify">
                            "{item.quoteText}"
                          </p>
                        </div>

                        {/* Footer: page/chapter, copy quote, share as image */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/5 gap-2">
                          <div className="flex gap-2 text-[9px] text-[#dfb9ed] font-semibold">
                            {item.page && <span>{language === 'pt' ? 'Pág.' : language === 'es' ? 'Pág.' : 'P.'} {item.page}</span>}
                            {item.chapter && (
                              <>
                                <span>•</span>
                                <span>{language === 'pt' ? 'Cap.' : language === 'es' ? 'Cap.' : 'Ch.'} {item.chapter}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Copy Quote Button with 2s check feedback (Item 4.6) */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopyQuote(item)}
                              className={`p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isCopied
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'text-on-surface-variant/70 hover:text-primary hover:bg-surface-container'
                              }`}
                              title={isCopied ? t.QUOTE_COPIED : t.COPY_QUOTE}
                            >
                              <span className="material-symbols-outlined notranslate text-xs" translate="no">
                                {isCopied ? 'check' : 'content_copy'}
                              </span>
                              <span className="hidden sm:inline text-[9px]">
                                {isCopied ? t.QUOTE_COPIED : t.COPY_QUOTE}
                              </span>
                            </motion.button>

                            {/* Share as Image Button (Item 4.5) */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              disabled={isGenerating}
                              onClick={() => handleShareAsImage(item)}
                              className="p-1.5 rounded-lg text-[10px] font-bold bg-primary/15 hover:bg-primary/25 text-[#e9b3ff] border border-primary/25 hover:border-primary/50 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                              title={t.SHARE_IMAGE}
                            >
                              <span className="material-symbols-outlined notranslate text-xs" translate="no">
                                {isGenerating ? 'progress_activity' : 'photo_library'}
                              </span>
                              <span className="hidden sm:inline text-[9px]">
                                {isGenerating ? t.GENERATING_CARD : t.SHARE_IMAGE}
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
