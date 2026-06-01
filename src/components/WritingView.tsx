import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';

interface BookQuote {
  id: string;
  bookTitle: string;
  quoteText: string;
  page?: string;
  chapter?: string;
  savedAt: string;
}

interface WritingViewProps {
  language: Language;
}

export default function WritingView({ language }: WritingViewProps) {
  const [quotes, setQuotes] = useState<BookQuote[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [page, setPage] = useState('');
  const [chapter, setChapter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Load quotes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookshelf_quotes');
    if (saved) {
      try {
        setQuotes(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    } else {
      setQuotes([
        {
          id: 'demo-q1',
          bookTitle: language === 'en' ? 'The Great Gatsby' : language === 'es' ? 'El Gran Gatsby' : 'O Grande Gatsby',
          quoteText: language === 'en' 
            ? 'So we beat on, boats against the current, borne back ceaselessly into the past.'
            : language === 'es'
            ? 'Y así seguimos adelante, barcos que bavan contra la corriente, empujados incesantemente hacia el pasado.'
            : 'Assim prosseguimos, barcos contra a corrente, empurrados incessantemente de volta ao passado.',
          page: '182',
          chapter: '9',
          savedAt: new Date().toISOString()
        }
      ]);
    }
  }, [language]);

  const saveQuotesToLocalStorage = (newQuotes: BookQuote[]) => {
    setQuotes(newQuotes);
    localStorage.setItem('bookshelf_quotes', JSON.stringify(newQuotes));
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !quoteText.trim()) return;

    const newQuote: BookQuote = {
      id: 'quote-' + Date.now(),
      bookTitle: bookTitle.trim(),
      quoteText: quoteText.trim(),
      page: page.trim() || undefined,
      chapter: chapter.trim() || undefined,
      savedAt: new Date().toISOString()
    };

    const updated = [newQuote, ...quotes];
    saveQuotesToLocalStorage(updated);

    // Reset fields
    setBookTitle('');
    setQuoteText('');
    setPage('');
    setChapter('');

    setToastMessage(t.TOAST_QUOTE_ADDED);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteQuote = (id: string) => {
    const filtered = quotes.filter((q) => q.id !== id);
    saveQuotesToLocalStorage(filtered);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined notranslate text-primary" translate="no">edit_note</span>
          {t.JOURNAL_TITLE}
        </h2>
        <p className="text-xs text-on-surface-variant italic mt-1 pl-1">
          {t.JOURNAL_SUBTITLE}
        </p>
      </div>

      {toastMessage && (
        <div className="bg-[#e86295]/20 text-[#ffb1c8] border border-[#e86295]/35 p-3 rounded-xl text-xs text-center font-bold animate-pulse">
          📝 {toastMessage}
        </div>
      )}

      {/* Input box */}
      <section className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
        <form onSubmit={handleSaveQuote} className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1">
            {language === 'pt' ? 'Refletir sobre a Leitura' : language === 'es' ? 'Reflexionar sobre la Lectura' : 'Reflect on Reading'}
          </h3>
          
          <div>
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="book-ref">
              {language === 'pt' ? 'Livro Referência *' : language === 'es' ? 'Libro de Referencia *' : 'Reference Book *'}
            </label>
            <input
              id="book-ref"
              type="text"
              required
              placeholder="Ex: O Grande Gatsby"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="page-ref">
                {language === 'pt' ? 'Página' : language === 'es' ? 'Página' : 'Page'}
              </label>
              <input
                id="page-ref"
                type="text"
                placeholder="Ex: 42"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="chap-ref">
                {language === 'pt' ? 'Capítulo' : language === 'es' ? 'Capítulo' : 'Chapter'}
              </label>
              <input
                id="chap-ref"
                type="text"
                placeholder="Ex: Capítulo 3"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1" htmlFor="quote-ref">
              {language === 'pt' ? 'Trecho / Citação do Coração *' : language === 'es' ? 'Pasaje / Cita del Corazón *' : 'Quote / Passage from the Heart *'}
            </label>
            <textarea
              id="quote-ref"
              required
              rows={3}
              placeholder={t.INSERT_QUOTE_PLACEHOLDER}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-on-surface-variant/40"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#bf6fe5] hover:bg-[#a656cc] text-on-primary font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined notranslate text-sm" translate="no">bookmarks</span>
            {t.ADD_QUOTE}
          </button>
        </form>
      </section>

      {/* List box */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1">
          {t.SAVED_QUOTES} ({quotes.length})
        </h3>

        {quotes.length === 0 ? (
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 text-center text-xs text-on-surface-variant/40">
            {t.NO_QUOTES}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quotes.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 flex flex-col justify-between hover:border-primary/25 transition-colors relative group animate-in slide-in-from-left-4 duration-300"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-[10px] font-bold bg-[#bf6fe5]/10 text-[#e9b3ff] px-2 py-0.5 rounded uppercase font-sans truncate max-w-[85%]">
                      {item.bookTitle}
                    </span>
                    <button
                      onClick={() => handleDeleteQuote(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors focus:outline-none opacity-40 group-hover:opacity-100 cursor-pointer p-0.5"
                      title={t.DELETE}
                    >
                      <span className="material-symbols-outlined notranslate text-xs" translate="no">delete</span>
                    </button>
                  </div>

                  <p className="font-serif italic text-xs leading-relaxed text-on-surface pt-1 border-t border-outline-variant/10 text-justify">
                    "{item.quoteText}"
                  </p>
                </div>

                <div className="flex gap-2 text-[9px] text-[#dfb9ed] mt-3 font-semibold justify-end">
                  {item.page && <span>{language === 'pt' ? 'Pág.' : language === 'es' ? 'Pág.' : 'P.'} {item.page}</span>}
                  {item.chapter && (
                    <>
                      <span>•</span>
                      <span>{language === 'pt' ? 'Cap.' : language === 'es' ? 'Cap.' : 'Ch.'} {item.chapter}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
