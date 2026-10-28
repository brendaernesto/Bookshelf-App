import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookReview, BookStatus } from '../types';
import { TRANSLATIONS, Language } from '../translations';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { searchLocalCatalog, CatalogBook } from '../catalogData';
import { AnimatePresence, motion } from 'motion/react';
import BookCover from './BookCover';

interface ExploreViewProps {
  onAddPresetToList: (title: string, author: string, coverUrl: string, status?: BookStatus) => void;
  language: Language;
  initialSearchQuery?: string;
  libraryBooks?: BookReview[];
}

const LOCALIZED_TRENDING: Record<Language, Array<{
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  year: number;
  tags: string[];
  review: string;
}>> = {
  pt: [
    {
      title: 'O Nome do Vento',
      author: 'Patrick Rothfuss',
      coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
      rating: 4.8,
      year: 2007,
      tags: ['#Fantasia', '#Magia', '#Música'],
      review: 'Uma lenda contada em primeira pessoa. Kvothe é cativante e a escrita do Patrick é pura melodia.'
    },
    {
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
      rating: 4.9,
      year: 1967,
      tags: ['#RealismoMágico', '#Clássico', '#Família'],
      review: 'A incrível dinastia Buendía em Macondo. Uma verdadeira obra de arte da literatura mundial.'
    },
    {
      title: 'Duna',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
      rating: 4.7,
      year: 1965,
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
      year: 2007,
      tags: ['#Fantasy', '#Magic', '#Music'],
      review: 'A legend told in the first person. Kvothe is captivating, and Patrick\'s writing is pure melody.'
    },
    {
      title: 'One Hundred Years of Solitude',
      author: 'Gabriel García Márquez',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
      rating: 4.9,
      year: 1967,
      tags: ['#MagicRealism', '#Classic', '#Family'],
      review: 'The incredible story of the Buendía dynasty in Macondo. A masterpiece of world literature.'
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
      rating: 4.7,
      year: 1965,
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
      year: 2007,
      tags: ['#Fantasía', '#Magia', '#Música'],
      review: 'Una leyenda narrada en primera persona. Kvothe es cautivador y la prosa de Patrick es pura música.'
    },
    {
      title: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
      rating: 4.9,
      year: 1967,
      tags: ['#RealismoMágico', '#Clásico', '#Familia'],
      review: 'La asombrosa dinastía Buendía en Macondo. Una obra cumbre de la literatura universal.'
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
      rating: 4.7,
      year: 1965,
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

// Known publication years for popular works
const KNOWN_YEARS: Record<string, number> = {
  'harry potter e a pedra filosofal': 1997,
  'harry potter and the sorcerer\'s stone': 1997,
  'harry potter e o prisioneiro de azkaban': 1999,
  'harry potter and the prisoner of azkaban': 1999,
  'o senhor dos anéis: a sociedade do anel': 1954,
  'the lord of the rings: the fellowship of the ring': 1954,
  'o hobbit': 1937,
  'the hobbit': 1937,
  'duna': 1965,
  'dune': 1965,
  'o nome do vento': 2007,
  'the name of the wind': 2007,
  'cem anos de solidão': 1967,
  'one hundred years of solitude': 1967,
  'dom casmurro': 1899,
  'memórias póstumas de brás cubas': 1881,
  'o pequeno príncipe': 1943,
  'the little prince': 1943,
  '1984': 1949,
  'clean code': 2008,
  'código limpo': 2008,
  'hábitos atômicos': 2018,
  'atomic habits': 2018,
  'torto arado': 2019,
  'the great gatsby': 1925,
  'o grande gatsby': 1925,
  'to kill a mockingbird': 1960,
  'o sol é para todos': 1960
};

export default function ExploreView({
  onAddPresetToList,
  language,
  initialSearchQuery = '',
  libraryBooks = []
}: ExploreViewProps) {
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

  // Arrow key navigation state in autocomplete (Item 5.3)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Status picker popup state: tracks which book ID has the quick status popup open (Item 5.2)
  const [openStatusPickerBookId, setOpenStatusPickerBookId] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statusPickerRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];
  const quotesList = LOCALIZED_QUOTES[language] || LOCALIZED_QUOTES.pt;
  const trendingBooks = LOCALIZED_TRENDING[language] || LOCALIZED_TRENDING.pt;

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

  // Helper to determine if a book is already in the user's shelf (Item 5.4 & 5.5)
  const isBookInShelf = (bookTitle: string): boolean => {
    if (!libraryBooks || libraryBooks.length === 0) return false;
    const clean = bookTitle.toLowerCase().trim();
    return libraryBooks.some((b) => {
      const bTitle = b.title.toLowerCase().trim();
      if (bTitle === clean) return true;
      const normA = bTitle.replace(/[^a-z0-9]/g, '');
      const normB = clean.replace(/[^a-z0-9]/g, '');
      return normA === normB && normA.length > 2;
    });
  };

  // Helper to extract or derive publication year (Item 5.2)
  const getBookYear = (book: any): number | string => {
    if (book.year) return book.year;
    const cleanTitle = (book.title || '').toLowerCase().trim();
    if (KNOWN_YEARS[cleanTitle]) return KNOWN_YEARS[cleanTitle];
    for (const [key, val] of Object.entries(KNOWN_YEARS)) {
      if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
        return val;
      }
    }
    // Default reasonable release year if undefined
    return 2021;
  };

  // Pre-load cached books from Firestore on mount
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

  // Handle click outside to dismiss suggestions and status dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
      if (statusPickerRef.current && !statusPickerRef.current.contains(event.target as Node)) {
        setOpenStatusPickerBookId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time suggestions computed instantly (Item 5.2)
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
            buyLinkText: item.buyLinkText,
            year: item.year || getBookYear(item)
          });
        }
      }
    });

    return [...fromCatalog, ...fromCache].slice(0, 6);
  }, [searchTerm, cachedFirestoreBooks]);

  // Reset highlighted suggestion index when suggestions list changes (Item 5.3)
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [instantSuggestions]);

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
    setIsFocused(false);
    setHighlightedIndex(-1);

    // 1. Immediate local matches for instant responsiveness
    const immediateLocal = searchLocalCatalog(query, 10).map((b) => ({
      ...b,
      year: b.year || getBookYear(b)
    }));

    if (immediateLocal.length > 0) {
      setSearchedBooks(immediateLocal);
    }

    try {
      // 2. Local-first database lookups in Firestore
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
              buyLinkText: item.buyLinkText || '',
              year: item.year || getBookYear(item)
            });
          }
        });
      } catch (cacheErr) {
        console.warn("Could not retrieve books from Firestore cache local store:", cacheErr);
      }

      // 3. Server-side book search with search grounding
      const apiRes = await fetch(`/api/books/search?q=${encodeURIComponent(query)}&lang=${language}`);
      if (!apiRes.ok) {
        let serverErrMessage = '';
        try {
          const errPayload = await apiRes.json();
          serverErrMessage = errPayload.error || errPayload.message;
        } catch (_) {}

        throw new Error(
          serverErrMessage || t.SEARCH_ERROR_OCCURRED
        );
      }

      const apiData = await apiRes.json();
      const serverBooks = apiData.books || [];

      // 4. Feed search grounding data into Firestore asynchronously
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
          year: rawBook.year || getBookYear(rawBook),
          createdAt: new Date().toISOString()
        };

        try {
          setDoc(doc(db, 'books', cleanBook.id), cleanBook);
        } catch (dbErr) {
          console.warn(`Could not sync book "${cleanBook.title}" to Firestore:`, dbErr);
        }

        newlyIntegrated.push(cleanBook);
      }

      // 5. Merge server results, catalog matches, and cached matches
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
      if (immediateLocal.length > 0) {
        setSearchedBooks(immediateLocal);
      } else {
        setSearchError(err.message || t.SEARCH_ERROR_OCCURRED);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce typing to auto-search in the background seamlessly (300ms) (Item 5.2)
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
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Initial search query support
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery.trim()) {
      setSearchTerm(initialSearchQuery);
      executeSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Handle Quick Add to shelf with chosen status (Item 5.2)
  const handleQuickAdd = (
    title: string,
    author: string,
    coverUrl: string,
    status: BookStatus = 'LENDO'
  ) => {
    onAddPresetToList(title, author, coverUrl, status);
    setOpenStatusPickerBookId(null);

    const localizedStatus =
      status === 'LENDO'
        ? t.STATUS_LENDO_LABEL
        : status === 'CONCLUÍDO'
        ? t.STATUS_TERMINADO_LABEL
        : t.STATUS_QUERO_LER;

    let addedMsg = `"${title}" (${localizedStatus}) adicionado à estante!`;
    if (language === 'en') {
      addedMsg = `"${title}" (${localizedStatus}) added to your shelf!`;
    } else if (language === 'es') {
      addedMsg = `¡"${title}" (${localizedStatus}) añadido a tu estantería!`;
    }

    setFeedbackMsg(addedMsg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  const handleSelectSuggestion = (book: CatalogBook) => {
    setSearchTerm(book.title);
    setIsFocused(false);
    setHighlightedIndex(-1);
    executeSearch(book.title);
  };

  // Keyboard navigation through suggestions dropdown (Item 5.3)
  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || instantSuggestions.length === 0) {
      if (e.key === 'Enter') {
        executeSearch(searchTerm);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % instantSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? instantSuggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < instantSuggestions.length) {
        handleSelectSuggestion(instantSuggestions[highlightedIndex]);
      } else {
        executeSearch(searchTerm);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setHighlightedIndex(-1);
    }
  };

  const popularQuickChips = useMemo(() => {
    const list: Record<Language, Array<{ label: string; query: string; icon: string }>> = {
      pt: [
        { label: 'Dom Casmurro', query: 'Dom Casmurro', icon: 'auto_stories' },
        { label: 'Pequeno Príncipe', query: 'Pequeno Príncipe', icon: 'stars' },
        { label: '1984', query: '1984', icon: 'history_edu' },
        { label: 'Clean Code', query: 'Clean Code', icon: 'terminal' },
        { label: 'Hábitos Atômicos', query: 'Hábitos Atômicos', icon: 'bolt' },
        { label: 'Torto Arado', query: 'Torto Arado', icon: 'menu_book' },
        { label: 'O Nome do Vento', query: 'O Nome do Vento', icon: 'auto_stories' },
        { label: 'Duna', query: 'Duna', icon: 'travel_explore' }
      ],
      en: [
        { label: 'The Great Gatsby', query: 'The Great Gatsby', icon: 'auto_stories' },
        { label: 'The Little Prince', query: 'The Little Prince', icon: 'stars' },
        { label: '1984', query: '1984', icon: 'history_edu' },
        { label: 'Clean Code', query: 'Clean Code', icon: 'terminal' },
        { label: 'Atomic Habits', query: 'Atomic Habits', icon: 'bolt' },
        { label: 'The Name of the Wind', query: 'The Name of the Wind', icon: 'menu_book' },
        { label: 'Dune', query: 'Dune', icon: 'travel_explore' },
        { label: 'To Kill a Mockingbird', query: 'To Kill a Mockingbird', icon: 'bookmark' }
      ],
      es: [
        { label: 'Cien Años de Soledad', query: 'Cien Años de Soledad', icon: 'auto_stories' },
        { label: 'El Principito', query: 'El Principito', icon: 'stars' },
        { label: '1984', query: '1984', icon: 'history_edu' },
        { label: 'Código Limpio', query: 'Clean Code', icon: 'terminal' },
        { label: 'Hábitos Atómicos', query: 'Hábitos Atómicos', icon: 'bolt' },
        { label: 'El Nombre del Viento', query: 'El Nombre del Viento', icon: 'menu_book' },
        { label: 'Dune', query: 'Dune', icon: 'travel_explore' },
        { label: 'Don Quijote', query: 'Don Quijote', icon: 'bookmark' }
      ]
    };
    return list[language] || list.pt;
  }, [language]);

  return (
    <div className="w-full max-w-6xl mx-auto pb-32 space-y-6 animate-in fade-in duration-200">

      {/* Quote of the Day Block with Fade Transition & Button Style (Item 5.1) */}
      <section className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-center relative overflow-hidden group shadow-xs">
        <div className="absolute top-2 left-3 text-primary/10 text-7xl font-serif pointer-events-none select-none">“</div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="min-h-[56px] flex flex-col justify-center"
            >
              <p className="font-serif italic text-xs leading-relaxed text-on-surface">
                "{quotesList[quoteIndex]?.text}"
              </p>
              <p className="font-sans text-[10px] text-[#dfb9ed] font-bold mt-2 uppercase tracking-wider">
                — {quotesList[quoteIndex]?.author}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Button "Next inspiration": refresh icon, subtle border, hover, active scale (Item 5.1 & 7.7) */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={rotateQuote}
            className="mt-3 text-xs font-bold text-accent px-4 py-2 bg-surface-container border border-[#bf6fe5]/30 rounded-full hover:bg-[#bf6fe5]/20 hover:border-[#bf6fe5]/60 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-primary cursor-pointer inline-flex items-center gap-2 shadow-xs min-h-[44px]"
            title={t.NEXT_INSPIRATION}
            aria-label={t.NEXT_INSPIRATION}
          >
            <span className="material-symbols-outlined notranslate text-sm text-[#bf6fe5] group-hover:rotate-180 transition-transform duration-300" translate="no">
              sync
            </span>
            <span>{t.NEXT_INSPIRATION}</span>
          </motion.button>
        </div>
      </section>

      {/* GLOBAL BOOK DISCOVERY SEARCH COMPONENT (Items 5.2 - 5.5) */}
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
              <span className="material-symbols-outlined notranslate text-on-surface-variant/60 group-focus-within:text-primary text-base absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" translate="no">
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
                onKeyDown={handleSearchInputKeyDown}
                placeholder={SEARCH_T.PLACEHOLDER}
                className="w-full bg-surface-container-lowest text-xs text-on-surface placeholder:text-on-surface-variant/60 pl-9 pr-12 py-3 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-[#bf6fe5] focus-visible:ring-2 focus-visible:ring-primary transition-all font-sans min-h-[44px]"
                id="global-search-query-input"
                autoComplete="off"
              />

              {/* Clear and loading indicator */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-[#bf6fe5] border-t-transparent rounded-full animate-spin"></div>
                )}
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSearchedBooks([]);
                      setHasSearched(false);
                      setIsFocused(false);
                      setHighlightedIndex(-1);
                    }}
                    title={SEARCH_T.CLEAR_SEARCH}
                    aria-label={SEARCH_T.CLEAR_SEARCH}
                    className="text-on-surface-variant hover:text-primary p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="material-symbols-outlined notranslate text-base" translate="no">close</span>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              title={
                !searchTerm.trim()
                  ? t.SEARCH_BUTTON_TOOLTIP_EMPTY
                  : t.SEARCH_BUTTON_TOOLTIP_ACTIVE
              }
              aria-label={SEARCH_T.BUTTON_SEARCH}
              aria-disabled={isSearching || !searchTerm.trim()}
              className={`font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 border-0 shrink-0 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary ${
                !searchTerm.trim() || isSearching
                  ? 'bg-[#bf6fe5]/25 text-on-surface-variant/40 cursor-not-allowed hover:bg-[#bf6fe5]/25 shadow-none'
                  : 'bg-[#bf6fe5] hover:bg-[#a656cc] text-on-primary cursor-pointer active:scale-95 hover:shadow-lg'
              }`}
            >
              <span className="material-symbols-outlined notranslate text-sm" translate="no">
                {isSearching ? 'progress_activity' : 'travel_explore'}
              </span>
              <span>{SEARCH_T.BUTTON_SEARCH}</span>
            </button>
          </form>

          {/* Real-time Instant Suggestions Autocomplete Dropdown with Keyboard Navigation (Items 5.2 & 5.3) */}
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
                  {instantSuggestions.map((book, idx) => {
                    const inShelf = isBookInShelf(book.title);
                    const isHighlighted = idx === highlightedIndex;

                    return (
                      <div
                        key={book.id}
                        className={`p-2.5 transition-colors flex items-center justify-between gap-3 group cursor-pointer ${
                          isHighlighted
                            ? 'bg-[#bf6fe5]/20 ring-1 ring-inset ring-[#bf6fe5]/50'
                            : 'hover:bg-surface-container-high'
                        }`}
                        onClick={() => handleSelectSuggestion(book)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <BookCover
                            src={book.coverUrl}
                            alt={book.title}
                            title={book.title}
                            size="sm"
                            className="w-8 h-11 object-cover rounded shadow-sm shrink-0"
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
                              {book.year && (
                                <span className="text-[8px] text-on-surface-variant/70 font-mono">
                                  {book.year}
                                </span>
                              )}
                              {book.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[8px] text-on-surface-variant/70 font-mono hidden sm:inline">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Quick Add or Already in Shelf badge (Item 5.4) */}
                        {inShelf ? (
                          <span className="shrink-0 bg-surface-container text-on-surface-variant/60 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-outline-variant/15 select-none">
                            <span className="material-symbols-outlined notranslate text-xs text-primary" translate="no">done</span>
                            <span className="hidden sm:inline">{t.IN_YOUR_SHELF}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAdd(book.title, book.author, book.coverUrl, 'LENDO');
                            }}
                            title={SEARCH_T.CLICK_TO_ADD}
                            className="shrink-0 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 border border-primary/30 hover:border-transparent"
                          >
                            <span className="material-symbols-outlined notranslate text-[12px]" translate="no">add</span>
                            <span className="hidden sm:inline">{t.ADD_TO_SHELF}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Keyboard navigation hint (Item 5.3) */}
                <div className="px-3 py-1.5 bg-surface-container-highest/40 text-[9px] text-on-surface-variant/60 flex items-center justify-between font-mono">
                  <span>{t.NAVIGATE_SUGGESTIONS_HINT}</span>
                  <span className="text-[8px] bg-surface-container px-1 rounded border border-outline-variant/15">Esc fecha</span>
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
              {popularQuickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchTerm(chip.query);
                    setIsFocused(false);
                    setHighlightedIndex(-1);
                    executeSearch(chip.query);
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1.5 ${
                    searchTerm.toLowerCase() === chip.query.toLowerCase()
                      ? 'bg-primary text-on-primary border-primary font-bold shadow-sm'
                      : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-primary/40 hover:bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined notranslate text-[12px] ${
                      searchTerm.toLowerCase() === chip.query.toLowerCase() ? 'text-on-primary' : 'text-primary'
                    }`}
                    translate="no"
                  >
                    {chip.icon}
                  </span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Catalog Search Results Area */}
        {/* Loading Skeletons State (Item 5.2) */}
        {isSearching && searchedBooks.length === 0 ? (
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-2 text-xs text-[#bf6fe5] font-semibold animate-pulse">
              <div className="w-3.5 h-3.5 border-2 border-[#bf6fe5] border-t-transparent rounded-full animate-spin"></div>
              <span>{SEARCH_T.SEARCHING}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/10 flex gap-3 animate-pulse">
                  <div className="w-12 h-18 bg-surface-container-high/60 rounded shadow-sm shrink-0"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-surface-container-high/70 rounded w-3/4"></div>
                    <div className="h-2.5 bg-surface-container-high/40 rounded w-1/2"></div>
                    <div className="h-2 bg-surface-container-high/30 rounded w-full"></div>
                    <div className="h-2 bg-surface-container-high/20 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchError ? (
          /* Error State with "Tentar novamente" button (Item 5.2) */
          <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-xl text-center space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-center gap-1.5 text-red-300 text-xs font-semibold">
              <span className="material-symbols-outlined notranslate text-base" translate="no">error</span>
              <span>{searchError}</span>
            </div>
            <button
              onClick={() => executeSearch(searchTerm)}
              className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border border-red-500/30"
            >
              <span className="material-symbols-outlined notranslate text-xs" translate="no">refresh</span>
              <span>{t.TRY_AGAIN}</span>
            </button>
          </div>
        ) : hasSearched && searchedBooks.length === 0 ? (
          /* Empty State (Item 5.2) */
          <div className="bg-surface-container-lowest/50 p-6 rounded-xl text-center text-xs text-on-surface-variant/70 italic border border-outline-variant/10">
            {SEARCH_T.NO_RESULTS}
          </div>
        ) : searchedBooks.length > 0 ? (
          /* Search Results List (Item 5.2, 5.4) */
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

            <div className="max-h-[490px] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3 scrollbar-thin">
              {searchedBooks.map((book) => {
                const inShelf = isBookInShelf(book.title);
                const bookYear = getBookYear(book);
                const isPickerOpen = openStatusPickerBookId === book.id;

                return (
                  <div
                    key={book.id}
                    className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/10 flex gap-3 hover:border-[#bf6fe5]/40 transition-colors shadow-xs relative"
                  >
                    <BookCover
                      src={book.coverUrl}
                      alt={book.title}
                      title={book.title}
                      size="md"
                      className="w-12 h-18 object-cover rounded shadow-sm shrink-0"
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

                        {/* Author and Year info (Item 5.2) */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[10px] text-on-surface-variant italic truncate max-w-[70%]" title={book.author}>
                            {book.author}
                          </p>
                          {bookYear && (
                            <span className="text-[9px] text-[#dfb9ed] font-mono bg-surface-container px-1 py-0.2 rounded shrink-0">
                              {bookYear}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-on-surface-variant/70 line-clamp-2 mt-1 leading-relaxed">
                          {book.snippet}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-1.5 gap-2 border-t border-outline-variant/5">
                        <div className="flex gap-1 truncate max-w-[40%]">
                          {book.tags && Array.isArray(book.tags) && book.tags.slice(0, 2).map((tg: string, i: number) => (
                            <span key={i} className="text-[8px] bg-surface-container text-[#dfb9ed] px-1 py-0.2 rounded font-mono">
                              {tg}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 relative">
                          {book.buyLink && (
                            <a
                              href={book.buyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#bf6fe5]/15 hover:bg-[#bf6fe5]/25 border border-[#bf6fe5]/30 text-[#e9b3ff] text-[9px] font-bold px-2 py-1 rounded-lg transition-all active:scale-95 flex items-center gap-0.5 hover:text-white"
                              title={book.buyLinkText}
                            >
                              <span className="material-symbols-outlined notranslate text-[11px]" translate="no">shopping_bag</span>
                              <span className="hidden sm:inline">{book.buyLinkText || 'Loja'}</span>
                            </a>
                          )}

                          {/* Shelf Button with In-Shelf check (Item 5.4) & Quick Status Selector (Item 5.2) */}
                          {inShelf ? (
                            <button
                              disabled
                              className="shrink-0 bg-surface-container text-on-surface-variant/50 text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-outline-variant/15 cursor-not-allowed select-none"
                              title={t.IN_YOUR_SHELF}
                            >
                              <span className="material-symbols-outlined notranslate text-[11px] text-primary" translate="no">
                                done_all
                              </span>
                              <span>{t.IN_YOUR_SHELF}</span>
                            </button>
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  setOpenStatusPickerBookId(isPickerOpen ? null : book.id);
                                }}
                                className="shrink-0 bg-primary hover:bg-primary-container text-on-primary text-[9px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm border-0"
                              >
                                <span className="material-symbols-outlined notranslate text-[11px]" translate="no">add</span>
                                <span>{t.ADD_TO_SHELF}</span>
                                <span className="material-symbols-outlined notranslate text-[10px]" translate="no">arrow_drop_down</span>
                              </button>

                              {/* Quick status selector dropdown popup (Item 5.2) */}
                              <AnimatePresence>
                                {isPickerOpen && (
                                  <motion.div
                                    ref={statusPickerRef}
                                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 bottom-full mb-1.5 bg-surface-container border border-primary/30 rounded-xl shadow-2xl z-50 py-1 w-36 divide-y divide-outline-variant/10 backdrop-blur-md"
                                  >
                                    <div className="px-2.5 py-1 text-[8px] font-bold text-on-surface-variant/70 uppercase">
                                      {t.SELECT_STATUS_PROMPT}
                                    </div>
                                    <div className="py-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl, 'PAUSADO')}
                                        className="w-full text-left px-2.5 py-1.5 hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-[10px] text-on-surface cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined notranslate text-xs text-amber-400" translate="no">bookmark</span>
                                        <span>{t.STATUS_QUERO_LER}</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl, 'LENDO')}
                                        className="w-full text-left px-2.5 py-1.5 hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-[10px] text-on-surface font-semibold text-primary cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined notranslate text-xs text-[#bf6fe5]" translate="no">auto_stories</span>
                                        <span>{t.STATUS_LENDO_LABEL}</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl, 'CONCLUÍDO')}
                                        className="w-full text-left px-2.5 py-1.5 hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-[10px] text-on-surface cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined notranslate text-xs text-emerald-400" translate="no">check_circle</span>
                                        <span>{t.STATUS_TERMINADO_LABEL}</span>
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        <div className="bg-[#bf6fe5]/15 text-[#e9b3ff] border border-[#bf6fe5]/30 p-3 rounded-xl text-xs text-center font-bold animate-in zoom-in-75 duration-200 shadow-md">
          ✨ {feedbackMsg}
        </div>
      )}

      {/* Curated and Trending Reads with Quick-Add & Already In Shelf Indicator (Item 5.5) */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined notranslate text-base" translate="no">auto_stories</span>
          {t.RECOMMENDED_BOOKS}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingBooks.map((book, idx) => {
            const inShelf = isBookInShelf(book.title);
            const trendingPickerKey = `trending-${idx}`;
            const isPickerOpen = openStatusPickerBookId === trendingPickerKey;

            return (
              <div
                key={idx}
                className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex gap-4 hover:border-primary/40 transition-colors shadow-xs"
              >
                <BookCover
                  src={book.coverUrl}
                  alt={book.title}
                  title={book.title}
                  size="md"
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

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[11px] text-on-surface-variant italic truncate">{book.author}</p>
                      {book.year && (
                        <span className="text-[9px] text-[#dfb9ed] font-mono bg-surface-container px-1 py-0.2 rounded shrink-0">
                          {book.year}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-on-surface-variant/80 line-clamp-2 mt-1 leading-normal">
                      {book.review}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-1 gap-2 border-t border-outline-variant/10">
                    <div className="flex gap-1 truncate max-w-[50%]">
                      {book.tags.map((tg, i) => (
                        <span key={i} className="text-[9px] bg-surface-container text-[#dfb9ed] px-1.5 py-0.5 rounded">
                          {tg}
                        </span>
                      ))}
                    </div>

                    {/* Quick-add button & indicator if already added (Item 5.5) */}
                    {inShelf ? (
                      <span className="shrink-0 bg-surface-container text-on-surface-variant/50 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-outline-variant/15 select-none">
                        <span className="material-symbols-outlined notranslate text-[12px] text-primary" translate="no">done_all</span>
                        <span>{t.IN_YOUR_SHELF}</span>
                      </span>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => {
                            setOpenStatusPickerBookId(isPickerOpen ? null : trendingPickerKey);
                          }}
                          className="shrink-0 bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold px-3 py-1 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined notranslate text-[12px]" translate="no">add</span>
                          <span>{t.ADD_TO_SHELF}</span>
                          <span className="material-symbols-outlined notranslate text-[10px]" translate="no">arrow_drop_down</span>
                        </button>

                        {/* Status picker dropdown */}
                        <AnimatePresence>
                          {isPickerOpen && (
                            <motion.div
                              ref={statusPickerRef}
                              initial={{ opacity: 0, y: -4, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.95 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 bottom-full mb-1.5 bg-surface-container border border-primary/30 rounded-xl shadow-2xl z-50 py-1 w-36 divide-y divide-outline-variant/10 backdrop-blur-md"
                            >
                              <div className="px-2.5 py-1 text-[8px] font-bold text-on-surface-variant/70 uppercase">
                                {t.SELECT_STATUS_PROMPT}
                              </div>
                              <div className="py-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl, 'PAUSADO')}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-[10px] text-on-surface cursor-pointer"
                                >
                                  <span className="material-symbols-outlined notranslate text-xs text-amber-400" translate="no">bookmark</span>
                                  <span>{t.STATUS_QUERO_LER}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl, 'LENDO')}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-[10px] text-on-surface font-semibold text-primary cursor-pointer"
                                >
                                  <span className="material-symbols-outlined notranslate text-xs text-[#bf6fe5]" translate="no">auto_stories</span>
                                  <span>{t.STATUS_LENDO_LABEL}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdd(book.title, book.author, book.coverUrl, 'CONCLUÍDO')}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-[10px] text-on-surface cursor-pointer"
                                >
                                  <span className="material-symbols-outlined notranslate text-xs text-emerald-400" translate="no">check_circle</span>
                                  <span>{t.STATUS_TERMINADO_LABEL}</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
