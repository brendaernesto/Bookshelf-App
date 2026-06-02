import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { UserProfile } from '../types';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

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
  user: UserProfile;
}

export default function WritingView({ language, user }: WritingViewProps) {
  const [quotes, setQuotes] = useState<BookQuote[]>([]);
  const [bookTitle, setBookTitle] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [page, setPage] = useState('');
  const [chapter, setChapter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingQuote, setEditingQuote] = useState<BookQuote | null>(null);

  const t = TRANSLATIONS[language];

  // Load quotes from Firestore with local storage cache fallback
  useEffect(() => {
    if (!user?.uid) return;

    const loadQuotes = async () => {
      setIsLoading(true);
      try {
        const path = `users/${user.uid}/quotes`;
        const snap = await getDocs(collection(db, path));
        const list: BookQuote[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as BookQuote);
        });
        
        // Sort by savedAt (descending)
        list.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        setQuotes(list);
        
        // Match local cache
        localStorage.setItem('bookshelf_quotes', JSON.stringify(list));
      } catch (err) {
        console.error("Error loading quotes from Firestore: ", err);
        // Fallback to local storage if offline or permission error cached info
        const saved = localStorage.getItem('bookshelf_quotes');
        if (saved) {
          try {
            setQuotes(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, [user?.uid]);

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !quoteText.trim() || !user?.uid) return;

    const id = editingQuote ? editingQuote.id : 'quote-' + Date.now();
    const savedAt = editingQuote ? editingQuote.savedAt : new Date().toISOString();
    const path = `users/${user.uid}/quotes/${id}`;

    const newQuote: any = {
      id,
      bookTitle: bookTitle.trim(),
      quoteText: quoteText.trim(),
      savedAt,
      userId: user.uid
    };

    if (page.trim()) newQuote.page = page.trim();
    if (chapter.trim()) newQuote.chapter = chapter.trim();

    try {
      await setDoc(doc(db, `users/${user.uid}/quotes`, id), newQuote);

      let updated: BookQuote[];
      if (editingQuote) {
        updated = quotes.map((q) => q.id === id ? newQuote : q);
        setToastMessage(t.TOAST_EDITED);
      } else {
        updated = [newQuote, ...quotes];
        setToastMessage(t.TOAST_QUOTE_ADDED);
      }

      setQuotes(updated);
      localStorage.setItem('bookshelf_quotes', JSON.stringify(updated));

      // Reset fields & edit state
      setBookTitle('');
      setQuoteText('');
      setPage('');
      setChapter('');
      setEditingQuote(null);

      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Failed to save quote: ", err);
      setToastMessage(language === 'pt' ? 'Erro ao salvar anotação.' : language === 'es' ? 'Error al guardar la anotación.' : 'Error saving note.');
      setTimeout(() => setToastMessage(null), 3500);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!user?.uid) return;
    const path = `users/${user.uid}/quotes/${id}`;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/quotes`, id));
      
      const filtered = quotes.filter((q) => q.id !== id);
      setQuotes(filtered);
      localStorage.setItem('bookshelf_quotes', JSON.stringify(filtered));

      setToastMessage(t.TOAST_DELETED);
      setTimeout(() => setToastMessage(null), 3500);
      
      // If we were editing the deleted quote, cancel edit mode
      if (editingQuote?.id === id) {
        setEditingQuote(null);
        setBookTitle('');
        setQuoteText('');
        setPage('');
        setChapter('');
      }
    } catch (err) {
      console.error("Failed to delete quote: ", err);
      setToastMessage(language === 'pt' ? 'Erro ao excluir anotação.' : language === 'es' ? 'Error al eliminar la anotación.' : 'Error deleting note.');
      setTimeout(() => setToastMessage(null), 3500);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleStartEditQuote = (quote: BookQuote) => {
    setEditingQuote(quote);
    setBookTitle(quote.bookTitle);
    setQuoteText(quote.quoteText);
    setPage(quote.page || '');
    setChapter(quote.chapter || '');
    // Scroll smoothly up to the reflection form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingQuote(null);
    setBookTitle('');
    setQuoteText('');
    setPage('');
    setChapter('');
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
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1 flex justify-between items-center">
            <span>
              {editingQuote
                ? (language === 'pt' ? 'Editar Anotação' : language === 'es' ? 'Editar Anotación' : 'Edit Note')
                : (language === 'pt' ? 'Refletir sobre a Leitura' : language === 'es' ? 'Reflexionar sobre la Lectura' : 'Reflect on Reading')}
            </span>
            {editingQuote && (
              <span className="text-[9px] bg-[#e86295]/20 text-[#ffb1c8] px-2 py-0.5 rounded-md animate-pulse font-sans font-bold">
                {language === 'pt' ? 'Modo de Edição' : language === 'es' ? 'Modo de Edición' : 'Edit Mode'}
              </span>
            )}
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

          <div className="flex gap-2.5">
            {editingQuote && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1"
              >
                {language === 'pt' ? 'Cancelar / Sair' : language === 'es' ? 'Cancelar / Salir' : 'Cancel / Exit'}
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-[#bf6fe5] hover:bg-[#a656cc] text-on-primary font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined notranslate text-sm" translate="no">
                {editingQuote ? 'done' : 'bookmarks'}
              </span>
              {editingQuote
                ? (language === 'pt' ? 'Salvar Alterações' : language === 'es' ? 'Guardar Cambios' : 'Save Changes')
                : t.ADD_QUOTE
              }
            </button>
          </div>
        </form>
      </section>

      {/* List box */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1">
          {t.SAVED_QUOTES} ({quotes.length})
        </h3>

        {isLoading ? (
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 text-center text-xs text-on-surface-variant/50 animate-pulse">
            {language === 'pt' ? 'Carregando anotações...' : language === 'es' ? 'Cargando anotaciones...' : 'Loading notes...'}
          </div>
        ) : quotes.length === 0 ? (
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
                    <span className="text-[10px] font-bold bg-[#bf6fe5]/10 text-[#e9b3ff] px-2 py-0.5 rounded uppercase font-sans truncate max-w-[70%]">
                      {item.bookTitle}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEditQuote(item)}
                        className="text-on-surface-variant hover:text-[#e9b3ff] transition-colors focus:outline-none opacity-40 group-hover:opacity-100 cursor-pointer p-0.5"
                        title={language === 'pt' ? 'Editar' : language === 'es' ? 'Editar' : 'Edit'}
                      >
                        <span className="material-symbols-outlined notranslate text-xs" translate="no">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors focus:outline-none opacity-40 group-hover:opacity-100 cursor-pointer p-0.5"
                        title={t.DELETE}
                      >
                        <span className="material-symbols-outlined notranslate text-xs" translate="no">delete</span>
                      </button>
                    </div>
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
