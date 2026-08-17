import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookReview } from '../types';
import { TRANSLATIONS, Language } from '../translations';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { POPULAR_GLOBAL_CATALOG, searchLocalCatalog, CatalogBook } from '../catalogData';
import { AnimatePresence, motion } from 'motion/react';

interface ExploreViewProps {
  onAddPresetToList: (title: string, author: string, coverUrl: string) => void;
  language: Language;
  initialSearchQuery?: string;
}

const LOCALIZED_TRENDING: Record<Language, Array<{
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  tags: string[];
  review: string;
}>> = {
  pt: [
    {
      title: 'O Nome do Vento',
      author: 'Patrick Rothfuss',
      coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
      rating: 4.8,
      tags: ['#Fantasia', '#Magia', '#Música'],
      review: 'Uma lenda contada em primeira pessoa. Kvothe é cativante e a escrita do Patrick é pura melodia.'
    },
    {
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
      rating: 4.9,
      tags: ['#RealismoMágico', '#Clássico', '#Família'],
      review: 'A incrível dinastia Buendía em Macondo. Uma verdadeira obra de arte da literatura mundial.'
    },
    {
      title: 'Duna',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
      rating: 4.7,
      tags: ['#SciFi', '#Espaço', '#Império'],
      review: 'Uma ficção científica épica que mistura ecologia, política, religião e destino em um deserto implacável.'
    }
  ],
  en: [
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
      rating: 4.8,
      tags: ['#Fantasy', '#Magic', '#Music'],
      review: 'A legend told in the first person. Kvothe is captivating, and Patrick\'s writing is pure melody.'
    },
    {
      title: 'One Hundred Years of Solitude',
      author: 'Gabriel García Márquez',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
      rating: 4.9,
      tags: ['#MagicRealism', '#Classic', '#Family'],
      review: 'The incredible story of the Buendía dynasty in Macondo. A masterpiece of world literature.'
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
      rating: 4.7,
      tags: ['#SciFi', '#Space', '#Empire'],
      review: 'An epic science fiction work blending ecology, politics, religion, and destiny on an unforgiving desert planet.'
    }
  ],
  es: [
    {
      title: 'El Nombre del Viento',
      author: 'Patrick Rothfuss',
      coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
      rating: 4.8,
      tags: ['#Fantasía', '#Magia', '#Música'],
      review: 'Una leyenda narrada en primera persona. Kvothe es cautivador y la prosa de Patrick es pura música.'
    },
    {
      title: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
      rating: 4.9,
      tags: ['#RealismoMágico', '#Clásico', '#Familia'],
      review: 'La asombrosa dinastía Buendía en Macondo. Una obra cumbre de la literatura universal.'
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
      rating: 4.7,
      tags: ['#SciFi', '#Espacio', '#Imperio'],
      review: 'Una ciencia ficción clásica que entrelaza ecología, política, religión y destino en un planeta desértico.'
    }
  ]
};

const LOCALIZED_QUOTES: Record<Language, Array<{ text: string; author: string }>> = {
  pt: [
    { text: "Muitos homens cometem o erro de achar que a inteligência é como a visão, algo que se tem ou não se tem. Na verdade é mais como treinar ou praticar o arco.", author: "Patrick Rothfuss (O Nome do Vento)" },
    { text: "O homem que não lê bons livros não tem nenhuma vantagem sobre o homem que não sabe ler.", author: "Mark Twain" },
    { text: "Se você quer descobrir o que há por trás de uma pessoa, basta perguntar quais são seus livros favoritos.", author: "Provérbio Brise" },
    { text: "Ler é sonhar de olhos abertos.", author: "Anônimo" }
  ],
  en: [
    { text: "Many men make the mistake of thinking that intelligence is like sight, something you either have or you do not have. In truth, it is more like archery training or practicing.", author: "Patrick Rothfuss (The Name of the Wind)" },
    { text: "The man who does not read good books has no advantage over the man who cannot read.", author: "Mark Twain" },
    { text: "If you want to discover what lies behind a person, simply ask what their favorite books are.", author: "Brise Proverb" },
    { text: "To read is to dream with open eyes.", author: "Anonymous" }
  ],
  es: [
    { text: "Muchos hombres cometen el error de pensar que la inteligencia es como la vista, algo que se tiene o no se tiene. En realidad, es más como el tiro con arco: requiere práctica y entrenamiento.", author: "Patrick Rothfuss (El Nombre del Viento)" },
    { text: "El hombre que no lee buenos libros no tiene ninguna ventaja sobre el que no sabe leer.", author: "Mark Twain" },
    { text: "Si quieres descubrir lo que hay detrás de alguien, simplemente pregúntale cuáles son sus libros favoritos.", author: "Proverbio Brisiano" },
    { text: "Leer es soñar con los ojos abiertos.", author: "Anónimo" }
  ]
};

export default function ExploreView({ onAddPresetToList, language, initialSearchQuery = '' }: ExploreViewProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Global Book Search States
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [searchedBooks, setSearchedBooks] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [cachedFirestoreBooks, setCachedFirestoreBooks] = useState<any[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Localized messages for the Search subsection
  const SEARCH_T = {
    pt: {
      TITLE: 'Busca Global de Livros',
      SUBTITLE: 'Encontre qualquer obra disponível mundialmente e adicione instantaneamente à sua estante.',
      PLACEHOLDER: 'Busque por título, autor, assunto ou ISBN...',
      BUTTON_SEARCH: 'Buscar',
      SEARCHING: 'Procurando obras no acervo mundial...',
      NO_RESULTS: 'Nenhum livro encontrado mundialmente com esse termo. Tente outro termo.',
      RESULTS_FOUND: 'Resultados Encontrados',
      ENTER_TERM: 'Digite o título de um livro para ver sugestões instantâneas.',
      RATING_LABEL: 'Média de avaliações globais',
      INSTANT_SUGGESTIONS: 'Sugestões Instantâneas',
      QUICK_TOPICS: 'Tópicos & Obras Populares:',
      CLICK_TO_ADD: 'Adicionar à Estante',
      CLEAR_SEARCH: 'Limpar busca'
    },
    en: {
      TITLE: 'Global Book Search',
      SUBTITLE: 'Find any book available worldwide and instantly add it to your shelf.',
      PLACEHOLDER: 'Search by title, author, subject, or ISBN...',
      BUTTON_SEARCH: 'Search',
      SEARCHING: 'Searching books globally...',
      NO_RESULTS: 'No books found globally for this query. Try different keywords.',
      RESULTS_FOUND: 'Search Results',
      ENTER_TERM: 'Type a book title to see instant suggestions.',
      RATING_LABEL: 'Global average rating',
      INSTANT_SUGGESTIONS: 'Instant Suggestions',
      QUICK_TOPICS: 'Popular Books & Topics:',
      CLICK_TO_ADD: 'Add to Shelf',
      CLEAR_SEARCH: 'Clear search'
    },
    es: {
      TITLE: 'Búsqueda Global de Libros',
      SUBTITLE: 'Encuentra cualquier obra disponible mundialmente y agrégala instantáneamente a tu estantería.',
      PLACEHOLDER: 'Busca por título, autor, tema o ISBN...',
      BUTTON_SEARCH: 'Buscar',
      SEARCHING: 'Buscando libros en el catálogo mundial...',
      NO_RESULTS: 'No se encontraron libros mundialmente. Intente con otras palabras.',
      RESULTS_FOUND: 'Resultados Encontrados',
      ENTER_TERM: 'Escribe el título de un libro para ver sugerencias instantáneas.',
      RATING_LABEL: 'Calificación promedio global',
      INSTANT_SUGGESTIONS: 'Sugerencias Instantáneas',
      QUICK_TOPICS: 'Libros y Temas Populares:',
      CLICK_TO_ADD: 'Agregar a la Estantería',
      CLEAR_SEARCH: 'Limpiar búsqueda'
    }
  }[language] || {
    TITLE: 'Busca Global de Livros',
    SUBTITLE: 'Encontre qualquer obra disponível mundialmente e adicione instantaneamente à sua estante.',
    PLACEHOLDER: 'Busque por título, autor, assunto ou ISBN...',
    BUTTON_SEARCH: 'Buscar',
    SEARCHING: 'Procurando obras no acervo mundial...',
    NO_RESULTS: 'Nenhum livro encontrado mundialmente com esse termo. Tente outro termo.',
    RESULTS_FOUND: 'Resultados Encontrados',
    ENTER_TERM: 'Digite o título de um livro para ver sugestões instantâneas.',
    RATING_LABEL: 'Média de avaliações globais',
    INSTANT_SUGGESTIONS: 'Sugestões Instantâneas',
    QUICK_TOPICS: 'Tópicos & Obras Populares:',
    CLICK_TO_ADD: 'Adicionar à Estante',
    CLEAR_SEARCH: 'Limpar busca'
  };

  const t = TRANSLATIONS[language];
  const quotesList = LOCALIZED_QUOTES[language] || LOCALIZED_QUOTES.pt;
  const trendingBooks = LOCALIZED_TRENDING[language] || LOCALIZED_TRENDING.pt;

  // Pre-load cached books from Firestore on mount for fast local lookups
  useEffect(() => {
    const fetchCached = async () => {
      try {
        const qSnapshot = await getDocs(collection(db, 'books'));
        const loaded: any[] = [];
        qSnapshot.forEach((docSnap) => {
          loaded.push(docSnap.data());
        });
        setCachedFirestoreBooks(loaded);
      } catch (e) {
        console.warn("Could not pre-load cached books:", e);
      }
    };
    fetchCached();
  }, []);

  // Handle click outside to dismiss suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time suggestions computed instantly in 0ms as the user types
  const instantSuggestions = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return [];
    const queryClean = searchTerm.toLowerCase().trim();

    // 1. Match from rich curated catalog
    const fromCatalog = searchLocalCatalog(queryClean, 6);

    // 2. Match from Firestore cache
    const fromCache: CatalogBook[] = [];
    cachedFirestoreBooks.forEach((item) => {
      const matchT = item.title?.toLowerCase().includes(queryClean);
      const matchA = item.author?.toLowerCase().includes(queryClean);
      const matchTag = Array.isArray(item.tags) && item.tags.some((tg: string) => tg.toLowerCase().includes(queryClean));
      if (matchT || matchA || matchTag) {
        if (!fromCatalog.some(c => c.title.toLowerCase() === item.title?.toLowerCase())) {
          fromCache.push({
            id: item.id || `cached-${Date.now()}-${Math.random()}`,
            title: item.title,
            author: item.author,
            coverUrl: item.coverUrl,
            rating: item.rating || 4.5,
            snippet: item.snippet || '',
            tags: item.tags || [],
            buyLink: item.buyLink,
            buyLinkText: item.buyLinkText
          });
        }
      }
    });

    return [...fromCatalog, ...fromCache].slice(0, 6);
  }, [searchTerm, cachedFirestoreBooks]);

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotesList.length);
  };

  const executeSearch = async (termToSearch?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = (termToSearch !== undefined ? termToSearch : searchTerm).trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);
    setIsFocused(false); // close autocomplete panel on explicit search

    // 1. Immediately provide local matches so UI updates in 0 milliseconds!
    const immediateLocal = searchLocalCatalog(query, 10);
    if (immediateLocal.length > 0) {
      setSearchedBooks(immediateLocal);
    }

    try {
      // 2. Local-first database lookups: Query cached/fed books in Firestore
      let cachedMatches: any[] = [];
      try {
        const qSnapshot = await getDocs(collection(db, 'books'));
        qSnapshot.forEach((docSnap) => {
          const item = docSnap.data();
          const matchesTitle = item.title?.toLowerCase().includes(query.toLowerCase());
          const matchesAuthor = item.author?.toLowerCase().includes(query.toLowerCase());
          const matchesTags = Array.isArray(item.tags) && item.tags.some((tg: string) => tg.toLowerCase().includes(query.toLowerCase()));
          if (matchesTitle || matchesAuthor || matchesTags) {
            cachedMatches.push({
              id: item.id,
              title: item.title,
              author: item.author,
              coverUrl: item.coverUrl,
              rating: item.rating || 4.2,
              snippet: item.snippet || '',
              tags: item.tags || [],
              buyLink: item.buyLink || '',
              buyLinkText: item.buyLinkText || ''
            });
          }
        });
      } catch (cacheErr) {
        console.warn("Could not retrieve books from Firestore cache local store:", cacheErr);
      }

      // 3. Fast server-side search with memory caching & Google search grounding
      const apiRes = await fetch(`/api/books/search?q=${encodeURIComponent(query)}&lang=${language}`);
      if (!apiRes.ok) {
        let serverErrMessage = '';
        try {
          const errPayload = await apiRes.json();
          serverErrMessage = errPayload.error || errPayload.message;
        } catch (_) {}

        throw new Error(
          serverErrMessage || (language === 'pt' 
            ? 'Erro ao consultar o servidor especializado em livros.' 
            : language === 'es' 
              ? 'Error al consultar el servidor especializado en libros.' 
              : 'Failed to access web book search.')
        );
      }

      const apiData = await apiRes.json();
      const serverBooks = apiData.books || [];

      // 4. Feed search grounding data back into Firestore database asynchronously
      const newlyIntegrated: any[] = [];
      for (const rawBook of serverBooks) {
        const cleanId = rawBook.id || `book-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const cleanBook = {
          id: cleanId,
          title: rawBook.title || 'Título Indisponível',
          author: rawBook.author || 'Autor Desconhecido',
          coverUrl: rawBook.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
          rating: Number(rawBook.rating) || 4.2,
          snippet: rawBook.snippet || '',
          tags: Array.isArray(rawBook.tags) ? rawBook.tags : ['#WebFinder', '#Global'],
          buyLink: rawBook.buyLink || '',
          buyLinkText: rawBook.buyLinkText || (language === 'pt' ? 'Ver Site de Venda' : language === 'es' ? 'Ver Sitio de Venta' : 'Visit Store'),
          createdAt: new Date().toISOString()
        };

        try {
          setDoc(doc(db, 'books', cleanBook.id), {
            id: cleanBook.id,
            title: cleanBook.title,
            author: cleanBook.author,
            coverUrl: cleanBook.coverUrl,
            rating: cleanBook.rating,
            snippet: cleanBook.snippet,
            tags: cleanBook.tags,
            buyLink: cleanBook.buyLink,
            buyLinkText: cleanBook.buyLinkText,
            createdAt: cleanBook.createdAt
          });
        } catch (dbErr) {
          console.warn(`Could not sync grounded book "${cleanBook.title}" to Firestore:`, dbErr);
        }

        newlyIntegrated.push(cleanBook);
      }

      // 5. Merge server list, immediate catalog matches, and database local matches (deduping)
      const mergedBooks = [...newlyIntegrated];
      
      immediateLocal.forEach((locB) => {
        const alreadyHas = mergedBooks.some(
          x => x.title.toLowerCase() === locB.title.toLowerCase()
        );
        if (!alreadyHas) {
          mergedBooks.push(locB);
        }
      });

      cachedMatches.forEach((cachedB) => {
        const alreadyHas = mergedBooks.some(
          x => x.id === cachedB.id || x.title.toLowerCase() === cachedB.title.toLowerCase()
        );
        if (!alreadyHas) {
          mergedBooks.push(cachedB);
        }
      });

      setSearchedBooks(mergedBooks);
    } catch (err: any) {
      console.warn('Global grounding search query failed:', err);
      // If server fails, fallback cleanly to local catalog matches
      if (immediateLocal.length > 0) {
        setSearchedBooks(immediateLocal);
      } else {
        setSearchError(err.message || 'Error connecting to search services.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce typing to auto-search in the background seamlessly
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      if (searchTerm.trim().length === 0) {
        setSearchedBooks([]);
        setHasSearched(false);
      }
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(searchTerm);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // If an initial search query was provided (e.g. from Library tab redirection), trigger search immediately
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery.trim()) {
      setSearchTerm(initialSearchQuery);
      executeSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleQuickAdd = (title: string, author: string, coverUrl: string) => {
    onAddPresetToList(title, author, coverUrl);
    
    let addedMsg = `"${title}" foi adicionado com sucesso!`;
    if (language === 'en') {
      addedMsg = `"${title}" added successfully to your Bookshelf!`;
    } else if (language === 'es') {
      addedMsg = `¡"${title}" ha sido añadido con éxito!`;
    }
    
    setFeedbackMsg(addedMsg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  const handleSelectSuggestion = (book: CatalogBook) => {
    setSearchTerm(book.title);
    setIsFocused(false);
    executeSearch(book.title);
  };

  const POPULAR_QUICK_CHIPS = [
    { label: '🧙‍♂️ Harry Potter', query: 'Harry Potter' },
    { label: '🪐 Duna', query: 'Duna' },
    { label: '🗡️ O Nome do Vento', query: 'O Nome do Vento' },
    { label: '👑 Senhor dos Anéis', query: 'Senhor dos Anéis' },
    { label: '🇧🇷 Dom Casmurro', query: 'Dom Casmurro' },
    { label: '✨ Pequeno Príncipe', query: 'Pequeno Príncipe' },
    { label: '🏛️ 1984', query: '1984' },
    { label: '💻 Clean Code', query: 'Clean Code' },
    { label: '⚡ Hábitos Atômicos', query: 'Hábitos Atômicos' },
    { label: '📖 Torto Arado', query: 'Torto Arado' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-6 animate-in fade-in duration-300">
      
      {/* Quote of the Day Block */}
      <section className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-center relative overflow-hidden group">
        <div className="absolute top-2 left-3 text-primary/10 text-7xl font-serif pointer-events-none select-none">“</div>
        <div className="relative z-10">
          <p className="font-serif italic text-xs leading-relaxed text-on-surface">
            "{quotesList[quoteIndex]?.text}"
          </p>
          <p className="font-sans text-[10px] text-primary/80 font-bold mt-2 uppercase tracking-wider">
            — {quotesList[quoteIndex]?.author}
          </p>
          <button
            onClick={rotateQuote}
            className="mt-3 text-[10px] font-bold text-accent px-3 py-1 bg-background rounded-full hover:bg-surface-container-high transition-colors focus:outline-none cursor-pointer"
          >
            {t.NEXT_INSPIRATION}
          </button>
        </div>
      </section>

      {/* GLOBAL BOOK DISCOVERY SEARCH COMPONENT */}
      <section className="bg-surface-container-low p-5 rounded-2xl border border-[#bf6fe5]/30 space-y-4 shadow-md" id="global-book-search-section">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#ebdfea] tracking-wide uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined notranslate text-[#bf6fe5] text-lg" translate="no">globe_uk</span>
            {SEARCH_T.TITLE}
          </h4>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            {SEARCH_T.SUBTITLE}
          </p>
        </div>

        {/* Search Input Container with Instant Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="relative space-y-2">
          <form onSubmit={(e) => executeSearch(undefined, e)} className="flex gap-2 relative">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined notranslate text-on-surface-variant/50 group-focus-within:text-primary text-base absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" translate="no">
                search
              </span>
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsFocused(false);
                  }
                }}
                placeholder={SEARCH_T.PLACEHOLDER}
                className="w-full bg-surface-container-lowest text-xs text-on-surface placeholder:text-on-surface-variant/40 pl-9 pr-10 py-3 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-[#bf6fe5] focus:ring-2 focus:ring-[#bf6fe5]/25 transition-all font-sans"
                id="global-search-query-input"
                autoComplete="off"
              />

              {/* Clear and loading indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {isSearching && (
                  <div className="w-3.5 h-3.5 border-2 border-[#bf6fe5] border-t-transparent rounded-full animate-spin"></div>
                )}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSearchedBooks([]);
                      setHasSearched(false);
                      setIsFocused(false);
                    }}
                    title={SEARCH_T.CLEAR_SEARCH}
                    className="text-on-surface-variant/40 hover:text-primary p-0.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">close</span>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className="bg-[#bf6fe5] hover:bg-[#a14ac9] active:scale-95 disabled:bg-[#bf6fe5]/25 disabled:text-on-surface-variant/40 disabled:scale-100 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border-0 shrink-0"
            >
              <span className="material-symbols-outlined notranslate text-sm" translate="no">travel_explore</span>
              <span>{SEARCH_T.BUTTON_SEARCH}</span>
            </button>
          </form>

          {/* Real-time Instant Suggestions Autocomplete Dropdown */}
          <AnimatePresence>
            {isFocused && searchTerm.trim().length >= 1 && instantSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container border border-[#bf6fe5]/40 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-lg divide-y divide-outline-variant/10"
              >
                <div className="px-3.5 py-2 bg-[#bf6fe5]/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#e9b3ff] uppercase tracking-wider">
                    <span className="material-symbols-outlined notranslate text-xs text-[#bf6fe5]" translate="no">bolt</span>
                    {SEARCH_T.INSTANT_SUGGESTIONS}
                  </div>
                  <span className="text-[9px] text-on-surface-variant/60 font-mono">
                    {instantSuggestions.length} resultados rápidos
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/5 scrollbar-thin">
                  {instantSuggestions.map((book) => (
                    <div
                      key={book.id}
                      className="p-2.5 hover:bg-surface-container-high transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                      onClick={() => handleSelectSuggestion(book)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="w-8 h-11 object-cover rounded shadow-sm shrink-0 bg-surface-container-highest"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-serif text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {book.title}
                          </h5>
                          <p className="text-[10px] text-on-surface-variant italic truncate mt-0.5">
                            {book.author}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[8px] font-bold bg-[#bf6fe5]/20 text-[#e9b3ff] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              ★ {book.rating.toFixed(1)}
                            </span>
                            {book.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-[8px] text-on-surface-variant/70 font-mono hidden sm:inline">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Quick Add Button directly from suggestions */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(book.title, book.author, book.coverUrl);
                        }}
                        title={SEARCH_T.CLICK_TO_ADD}
                        className="shrink-0 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 border border-primary/30 hover:border-transparent"
                      >
                        <span className="material-symbols-outlined notranslate text-[12px]" translate="no">add</span>
                        <span className="hidden sm:inline">{t.ADD_TO_SHELF}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Popular Discovery Chips */}
          <div className="pt-1">
            <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined notranslate text-xs text-primary" translate="no">auto_awesome</span>
              {SEARCH_T.QUICK_TOPICS}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchTerm(chip.query);
                    setIsFocused(false);
                    executeSearch(chip.query);
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
                    searchTerm.toLowerCase() === chip.query.toLowerCase()
                      ? 'bg-primary text-on-primary border-primary font-bold shadow-sm'
                      : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-primary/40 hover:bg-surface-container-high'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Catalog Search Results Area */}
        {isSearching && searchedBooks.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-[#bf6fe5] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[11px] text-on-surface-variant animate-pulse">{SEARCH_T.SEARCHING}</p>
          </div>
        ) : searchError ? (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[11px] text-red-300">
            {searchError}
          </div>
        ) : hasSearched && searchedBooks.length === 0 ? (
          <div className="bg-surface-container-lowest/50 p-6 rounded-xl text-center text-xs text-on-surface-variant/70 italic border border-outline-variant/10">
            {SEARCH_T.NO_RESULTS}
          </div>
        ) : searchedBooks.length > 0 ? (
          <div className="space-y-3 pt-2 border-t border-outline-variant/10">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#dfb9ed] pl-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-xs text-primary" translate="no">verified</span>
                {SEARCH_T.RESULTS_FOUND} ({searchedBooks.length})
              </h5>
              {isSearching && (
                <span className="text-[9px] text-[#bf6fe5] animate-pulse font-mono">Atualizando...</span>
              )}
            </div>
            
            <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
              {searchedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10 flex gap-3.5 hover:border-[#bf6fe5]/40 transition-colors"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-18 object-cover rounded shadow-sm shrink-0 bg-surface-container-high"
                  />

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-xs font-bold text-on-surface truncate pr-1" title={book.title}>
                          {book.title}
                        </h4>
                        <span 
                          className="text-[9px] font-bold bg-[#bf6fe5]/20 text-[#e9b3ff] px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0"
                          title={SEARCH_T.RATING_LABEL}
                        >
                          ★ {book.rating ? Number(book.rating).toFixed(1) : '4.5'}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant italic mt-0.5 truncate" title={book.author}>{book.author}</p>
                      <p className="text-[10px] text-on-surface-variant/70 line-clamp-2 mt-1 leading-relaxed">
                        {book.snippet}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1.5 gap-2 border-t border-outline-variant/5">
                      <div className="flex gap-1 truncate max-w-[45%]">
                        {book.tags && Array.isArray(book.tags) && book.tags.map((tg: string, i: number) => (
                          <span key={i} className="text-[8px] bg-surface-container text-[#dfb9ed] px-1 py-0.2 rounded font-mono">
                            {tg}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {book.buyLink && (
                          <a
                            href={book.buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#bf6fe5]/15 hover:bg-[#bf6fe5]/25 border border-[#bf6fe5]/30 text-[#e9b3ff] text-[9px] font-bold px-2 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-0.5 hover:text-white"
                            title={book.buyLinkText}
                          >
                            <span className="material-symbols-outlined notranslate text-[11px]" translate="no">shopping_bag</span>
                            <span>{book.buyLinkText || 'Loja'}</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl)}
                          className="shrink-0 bg-primary hover:bg-primary-container text-on-primary text-[9px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-0.5 shadow-sm border-0"
                        >
                          <span className="material-symbols-outlined notranslate text-[11px]" translate="no">add</span>
                          {t.ADD_TO_SHELF}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-variant/60 font-serif italic text-center py-2">
            {SEARCH_T.ENTER_TERM}
          </p>
        )}
      </section>

      {/* Success alert message */}
      {feedbackMsg && (
        <div className="bg-[#bf6fe5]/15 text-[#e9b3ff] border border-[#bf6fe5]/30 p-3 rounded-xl text-xs text-center font-bold animate-in zoom-in-75 duration-200">
          ✨ {feedbackMsg}
        </div>
      )}

      {/* Discovery books */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
          {t.RECOMMENDED_BOOKS}
        </h3>

        <div className="space-y-4">
          {trendingBooks.map((book, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 flex gap-4 hover:border-primary/40 transition-colors"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-16 h-24 object-cover rounded-lg shadow-sm shrink-0"
              />

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-serif text-sm font-bold text-on-surface truncate">{book.title}</h4>
                    <span className="text-[10px] font-bold bg-[#bf6fe5]/20 text-[#e9b3ff] px-2 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                      ★ {book.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant italic mt-0.5">{book.author}</p>
                  <p className="text-[11px] text-on-surface-variant/80 line-clamp-2 mt-1 leading-normal">
                    {book.review}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2 pt-1 gap-2 border-t border-outline-variant/10">
                  <div className="flex gap-1 truncate max-w-[60%]">
                    {book.tags.map((tg, i) => (
                      <span key={i} className="text-[9px] bg-surface-container text-[#dfb9ed] px-1.5 py-0.5 rounded">
                        {tg}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl)}
                    className="shrink-0 bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold px-3 py-1 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined notranslate text-[12px]" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                    {t.ADD_TO_SHELF}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Facts Block */}
      <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-2">
        <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <span className="material-symbols-outlined notranslate text-sm" translate="no">psychology</span>
          {t.DID_YOU_KNOW}
        </h4>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          {t.DID_YOU_KNOW_TEXT}
        </p>
      </section>
    </div>
  );
}
