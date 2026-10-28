import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookReview, BookStatus, UserProfile } from './types';
import { INITIAL_REVIEWS } from './initialData';
import { TRANSLATIONS, Language } from './translations';
import LoginView from './components/LoginView';
import ReviewCard from './components/ReviewCard';
import ReviewForm from './components/ReviewForm';
import ExploreView from './components/ExploreView';
import WritingView from './components/WritingView';
import ProfileView from './components/ProfileView';

// Firebase Firestore and Auth imports
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, signOut, handleFirestoreError, OperationType } from './firebase';
import { DataService } from './services/dataService';
import ToastNotification from './components/common/ToastNotification';
import { SkeletonBookCard } from './components/common/Skeleton';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('bookshelf_language') as Language;
    if (saved && ['pt', 'en', 'es'].includes(saved)) {
      return saved;
    }
    return 'pt';
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('bookshelf_theme') as 'dark' | 'light';
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      return savedTheme;
    }
    const savedUser = localStorage.getItem('bookshelf_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.theme && ['dark', 'light'].includes(parsed.theme)) {
          return parsed.theme;
        }
      } catch (e) {}
    }
    return 'dark';
  });
  const [currentTab, setCurrentTab] = useState<'LIBRARY' | 'EXPLORE' | 'WRITING' | 'PROFILE'>('LIBRARY');
  const [selectedFilter, setSelectedFilter] = useState<'TUDO' | 'LENDO' | 'CONCLUÍDO' | 'FAVORITOS'>('TUDO');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title' | 'author'>('date');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');

  // 6-second safe delete with undo state
  const [undoState, setUndoState] = useState<{
    review: BookReview;
    index: number;
    timerId: any;
  } | null>(null);
  
  // Form view attributes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  // Debounce search query by 250ms (Item 3.8)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const t = TRANSLATIONS[language];

  // Record daily visitor accesses to Firebase Firestore database
  useEffect(() => {
    const recordPageVisit = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const sessionKey = `bookshelf_visit_${todayStr}`;
        if (!sessionStorage.getItem(sessionKey)) {
          const visitRef = doc(db, 'visits', todayStr);
          await setDoc(visitRef, {
            count: increment(1),
            date: todayStr
          }, { merge: true });
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (err) {
        console.warn("Could not record daily visit stats:", err);
      }
    };
    recordPageVisit();
  }, []);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  // Synchronize document.documentElement.lang with the currently active language so browsers correctly auto-translate
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US';
  }, [language]);

  // Synchronize dynamic theme (light vs dark mode)
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('bookshelf_theme', theme);
  }, [theme]);

  // Instant keyboard shortcuts for desktop & tablet power users (1=Library, 2=Explore, 3=Writing, 4=Profile, /=Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === '1') {
        setCurrentTab('LIBRARY');
      } else if (e.key === '2') {
        setCurrentTab('EXPLORE');
      } else if (e.key === '3') {
        setCurrentTab('WRITING');
      } else if (e.key === '4') {
        setCurrentTab('PROFILE');
      } else if (e.key === '/' && currentTab === 'LIBRARY' && !isFormOpen) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, isFormOpen]);

  // Load user info from localStorage on mount & subscribe to real Firebase Auth changes
  useEffect(() => {
    // 1. Recover instantly from localStorage for responsive paint
    const savedUser = localStorage.getItem('bookshelf_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error(err);
      }
    }

    // 2. Setup Firebase-level Auth session listeners
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        const cloudProfileRef = doc(db, 'users', userId);
        try {
          const profileSnap = await getDoc(cloudProfileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            const profileLanguage = data.language || language;
            const profileTheme = data.theme || theme;
            const profile: UserProfile = {
              email: firebaseUser.email || data.email || 'usuario@bookshelf.com',
              name: data.name || firebaseUser.displayName || 'Leitor Apaixonado',
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || 'https://picsum.photos/seed/bookshelfavatar/150/150',
              uid: firebaseUser.uid,
              language: profileLanguage,
              bannerType: data.bannerType || 'none',
              bannerValue: data.bannerValue || '',
              theme: profileTheme
            };
            setUser(profile);
            localStorage.setItem('bookshelf_user', JSON.stringify(profile));
            if (data.language) {
              setLanguage(data.language);
              localStorage.setItem('bookshelf_language', data.language);
            }
            if (data.theme) {
              setTheme(data.theme);
              localStorage.setItem('bookshelf_theme', data.theme);
            }
          } else {
            // Only sync from state or firebaseUser to prevent overwriting
            setUser((prev) => {
              const email = prev?.uid === userId ? prev.email : (firebaseUser.email || 'usuario@bookshelf.com');
              const name = prev?.uid === userId ? prev.name : (firebaseUser.displayName || 'Leitor Apaixonado');
              const avatarUrl = prev?.uid === userId ? prev.avatarUrl : (firebaseUser.photoURL || 'https://picsum.photos/seed/bookshelfavatar/150/150');
              const bannerType = prev?.uid === userId ? (prev.bannerType || 'none') : 'none';
              const bannerValue = prev?.uid === userId ? (prev.bannerValue || '') : '';
              const profile: UserProfile = { email, name, avatarUrl, uid: userId, language: language, bannerType, bannerValue, theme };
              
              setDoc(cloudProfileRef, { email, name, avatarUrl, language, bannerType, bannerValue, theme }).catch(err => {
                console.error("Erro ao salvar cadastro inicial no Firestore:", err);
              });
              
              localStorage.setItem('bookshelf_user', JSON.stringify(profile));
              return profile;
            });
          }
        } catch (err) {
          console.warn("Falha ao ler perfil do Firestore durante alteração de login:", err);
          setUser((prev) => {
            if (prev && prev.uid === userId) return prev;
            const profile: UserProfile = {
              email: firebaseUser.email || 'usuario@bookshelf.com',
              name: firebaseUser.displayName || 'Leitor Apaixonado',
              avatarUrl: firebaseUser.photoURL || 'https://picsum.photos/seed/bookshelfavatar/150/150',
              uid: firebaseUser.uid,
              language: language
            };
            localStorage.setItem('bookshelf_user', JSON.stringify(profile));
            return profile;
          });
        }
      } else {
        // No authenticated session is active: clear active user context
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize user profile and reviews with Cloud Firestore in real time
  useEffect(() => {
    if (!user) {
      setReviews([]);
      return;
    }

    const userId = user.uid || 'default-user';
    
    const syncData = async () => {
      // 1. Sync User Profile from Firestore to synchronize avatars and custom names
      const cloudProfileRef = doc(db, 'users', userId);
      try {
        const profileSnap = await getDoc(cloudProfileRef);
        if (profileSnap.exists()) {
          const cloudProfile = profileSnap.data() as UserProfile;
          setUser((prev) => {
            if (!prev) return null;
            // Only update if there's an actual change to prevent render loops
            if (
              prev.name !== cloudProfile.name ||
              prev.avatarUrl !== cloudProfile.avatarUrl ||
              prev.language !== cloudProfile.language ||
              prev.bannerType !== cloudProfile.bannerType ||
              prev.bannerValue !== cloudProfile.bannerValue
            ) {
              const merged = { ...prev, ...cloudProfile };
              localStorage.setItem('bookshelf_user', JSON.stringify(merged));
              if (cloudProfile.language) {
                setLanguage(cloudProfile.language);
                localStorage.setItem('bookshelf_language', cloudProfile.language);
              }
              return merged;
            }
            return prev;
          });
        } else {
          // Document does not exist yet: Seed the initial user state
          await setDoc(cloudProfileRef, {
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            language: language,
            bannerType: user.bannerType || 'none',
            bannerValue: user.bannerValue || ''
          });
        }
      } catch (err) {
        console.warn("Could not retrieve cloud user profile, fallback is active:", err);
      }

      // 2. Fetch User evaluation listings via Centralized DataService (Item 8.1)
      setIsLoadingBooks(true);
      try {
        const booksResult = await DataService.getBooks(userId);
        if (booksResult.success && booksResult.data) {
          setReviews(booksResult.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.warn("[App] Could not fetch data via DataService:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    syncData();
  }, [user?.uid]);

  // Sync state functions
  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('bookshelf_user', JSON.stringify(profile));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Falha de desconexão segura com Firebase auth:", err);
    }
    setUser(null);
    localStorage.removeItem('bookshelf_user');
    localStorage.removeItem('bookshelf_reviews');
    setCurrentTab('LIBRARY');
  };

  const handleSaveReview = async (formData: Omit<BookReview, 'id' | 'createdAt'> & { id?: string }) => {
    if (!user) return;
    const userId = user.uid || 'default-user';

    try {
      const res = await DataService.saveBook(formData, userId);
      if (res.success && res.data) {
        let updatedReviews: BookReview[];
        if (formData.id) {
          updatedReviews = reviews.map((r) => (r.id === formData.id ? res.data! : r));
          showToast(t.TOAST_EDITED);
        } else {
          updatedReviews = [res.data, ...reviews];
          showToast(t.TOAST_SAVED);
        }
        setReviews(updatedReviews);
        setEditingReview(null);
        setIsFormOpen(false);
      } else {
        showToast(t.TOAST_SAVED_ERROR, true);
      }
    } catch (error) {
      showToast(t.TOAST_SAVED_ERROR, true);
    }
  };

  // Safe Delete with 6-second Undo (Item 3.2)
  const handleDeleteReview = (id: string) => {
    if (!user) return;
    const targetIndex = reviews.findIndex((r) => r.id === id);
    if (targetIndex === -1) return;
    const targetReview = reviews[targetIndex];

    // If there's an active undo timer from a previous delete, finalize that deletion immediately
    if (undoState) {
      clearTimeout(undoState.timerId);
      const userId = user.uid || 'default-user';
      deleteDoc(doc(db, `users/${userId}/reviews`, undoState.review.id)).catch((err) => {
        console.warn("Could not commit previous deletion:", err);
      });
    }

    // Immediately remove from state & local storage for instant responsiveness
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));

    // Schedule actual permanent Firestore deletion after 6 seconds via DataService
    const timerId = setTimeout(async () => {
      try {
        const userId = user.uid || 'default-user';
        await DataService.deleteBook(targetReview.id, userId);
      } catch (error) {
        console.warn("Could not delete from Firestore:", error);
      }
      setUndoState((curr) => (curr?.review.id === targetReview.id ? null : curr));
    }, 6000);

    setUndoState({
      review: targetReview,
      index: targetIndex,
      timerId
    });
  };

  const handleUndoDelete = () => {
    if (!undoState) return;
    clearTimeout(undoState.timerId);

    // Restore review back to reviews array at previous index
    const restored = [...reviews];
    restored.splice(undoState.index, 0, undoState.review);
    setReviews(restored);
    localStorage.setItem('bookshelf_reviews', JSON.stringify(restored));
    setUndoState(null);
    showToast(t.ACTION_UNDONE);
  };

  // Interactive Star Rating Change directly on card (Item 3.10)
  const handleRatingChange = async (id: string, newRating: number) => {
    if (!user) return;
    const userId = user.uid || 'default-user';

    // Optimistic UI update
    const updated = reviews.map((r) => (r.id === id ? { ...r, rating: newRating } : r));
    setReviews(updated);
    localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));

    const res = await DataService.updateBookPartial(id, { rating: newRating }, userId);
    if (!res.success) {
      showToast(t.TOAST_UPDATE_ERROR, true);
    }
  };

  // Reading Progress Update for LENDO directly on card (Item 3.3)
  const handleUpdateProgress = async (id: string, pagesRead: number, totalPages: number) => {
    if (!user) return;
    const userId = user.uid || 'default-user';

    // Optimistic UI update
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, pagesRead, totalPages } : r
    );
    setReviews(updated);
    localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));

    const res = await DataService.updateBookPartial(id, { pagesRead, totalPages }, userId);
    if (res.success) {
      showToast(t.SAVE_PROGRESS);
    } else {
      showToast(t.TOAST_UPDATE_ERROR, true);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookStatus) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    
    const updated = reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setReviews(updated);
    localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));
    
    const localizedStatus = newStatus === 'LENDO' ? t.STATUS_LENDO : newStatus === 'CONCLUÍDO' ? t.STATUS_CONCLUIDO : t.STATUS_PAUSADO;
    showToast(`${t.TOAST_STATUS_UPDATED}: ${localizedStatus}`);

    const res = await DataService.updateBookPartial(id, { status: newStatus }, userId);
    if (!res.success) {
      showToast(t.TOAST_UPDATE_ERROR, true);
    }
  };

  const handleFavoriteToggle = async (id: string) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    
    const target = reviews.find((r) => r.id === id);
    if (!target) return;
    const newFavorite = !target.isFavorite;
    
    const updated = reviews.map((r) => (r.id === id ? { ...r, isFavorite: newFavorite } : r));
    setReviews(updated);
    localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));
    showToast(newFavorite ? t.TOAST_FAV_ADDED : t.TOAST_FAV_REMOVED);

    const res = await DataService.updateBookPartial(id, { isFavorite: newFavorite }, userId);
    if (!res.success) {
      showToast(t.TOAST_UPDATE_ERROR, true);
    }
  };

  const handleAddPresetRecommendation = async (
    title: string,
    author: string,
    coverUrl: string,
    status: BookStatus = 'LENDO'
  ) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    const id = 'recommendation-' + Date.now();
    const path = `users/${userId}/reviews/${id}`;
    
    const newReview: BookReview = {
      id,
      title,
      author,
      status: status,
      rating: 4.5,
      coverUrl,
      reviewText: t.ADDED_FROM_EXPLORE,
      tags: ['#Sugerido', '#LeituraFutura'],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      userId: userId
    };
    
    try {
      const reviewDocRef = doc(db, `users/${userId}/reviews`, id);
      await setDoc(reviewDocRef, newReview);
      
      const updated = [newReview, ...reviews];
      setReviews(updated);
      localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));
      
      showToast(t.TOAST_BOOK_ADDED_DETAILS);
    } catch (error) {
      showToast(t.TOAST_UPDATE_ERROR, true);
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Real-time tab counts calculation (Item 3.6)
  const tabCounts = useMemo(() => {
    return {
      all: reviews.length,
      reading: reviews.filter((r) => r.status === 'LENDO').length,
      finished: reviews.filter((r) => r.status === 'CONCLUÍDO').length,
      favorites: reviews.filter((r) => r.isFavorite).length
    };
  }, [reviews]);

  // Filter & Search calculation logic with debounce (250ms), tag filtering, and sorting (Items 3.7 & 3.8)
  const filteredReviews = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    
    // 1. Status / Favorite tab filter
    let list = reviews.filter((rev) => {
      if (selectedFilter === 'LENDO') return rev.status === 'LENDO';
      if (selectedFilter === 'CONCLUÍDO') return rev.status === 'CONCLUÍDO';
      if (selectedFilter === 'FAVORITOS') return rev.isFavorite;
      return true; // 'TUDO'
    });

    // 2. Clickable tag filter (Item 3.7)
    if (selectedTag) {
      const cleanActiveTag = selectedTag.toLowerCase().replace(/^#/, '');
      list = list.filter((rev) =>
        rev.tags && rev.tags.some((tg) => tg.toLowerCase().replace(/^#/, '') === cleanActiveTag)
      );
    }

    // 3. Debounced search query match (Item 3.8)
    if (query) {
      list = list.filter((rev) => {
        const matchesTitle = rev.title.toLowerCase().includes(query);
        const matchesAuthor = rev.author.toLowerCase().includes(query);
        const matchesTags = rev.tags && rev.tags.some((tg) => tg.toLowerCase().includes(query));
        const matchesReview = rev.reviewText ? rev.reviewText.toLowerCase().includes(query) : false;
        return matchesTitle || matchesAuthor || matchesTags || matchesReview;
      });
    }

    // 4. Sorting: rating, date, title, author (Item 3.7)
    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'author') {
        return (a.author || '').localeCompare(b.author || '');
      }
      // Default: date added (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [reviews, debouncedSearchQuery, selectedFilter, selectedTag, sortBy]);

  // If user is not logged in, render the login shield view
  if (!user) {
    return (
      <LoginView
        onLogin={handleLogin}
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          localStorage.setItem('bookshelf_language', lang);
        }}
      />
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-28 relative font-sans">
      {/* Real-time Toast Notifications with role="status" and aria-live="polite" (Item 7.6) */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
        closeAriaLabel={t.CLOSE_MODAL}
      />

      {/* 6-Second Safe Delete Undo Toast (Item 3.2) */}
      <AnimatePresence>
        {undoState && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-surface-container-highest text-on-surface border border-outline-variant/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md w-[calc(100%-2rem)] backdrop-blur-md overflow-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined notranslate text-base" translate="no">
                delete
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-on-surface">
                {t.BOOK_DELETED_TOAST}: <span className="font-bold text-primary">"{undoState.review.title}"</span>
              </p>
              <p className="text-[10px] text-on-surface-variant/70">
                {language === 'pt' ? 'Clique em Desfazer para restaurar' : language === 'es' ? 'Haga clic en Deshacer para restaurar' : 'Click Undo to restore'}
              </p>
            </div>
            <button
              onClick={handleUndoDelete}
              className="px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
            >
              {t.UNDO}
            </button>
            {/* Animated 6-second countdown bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-[#bf6fe5]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {isFormOpen ? (
          /* ========================================================
             FORM VIEW (Add / Edit Screen)
             ======================================================== */
          <motion.div
            key="edit-form-screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 sm:px-6 pt-4 max-w-3xl mx-auto gpu-accelerated"
          >
            {/* Header Form Navigation */}
            <header className="flex justify-between items-center h-16 w-full max-w-3xl mx-auto mb-4 border-b border-outline-variant/10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setEditingReview(null);
                  setIsFormOpen(false);
                }}
                className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container cursor-pointer focus:outline-none min-h-[44px] min-w-[44px]"
                aria-label={t.CANCEL}
              >
                <span className="material-symbols-outlined notranslate" translate="no">arrow_back</span>
              </motion.button>
              <h1 className="font-serif text-lg font-bold text-primary">
                {editingReview ? t.FORM_EDIT_TITLE : t.FORM_ADD_TITLE}
              </h1>
              <div className="w-10"></div> {/* Balanced spacing helper */}
            </header>

            <ReviewForm
              editingReview={editingReview}
              onSave={handleSaveReview}
              onCancel={() => {
                setEditingReview(null);
                setIsFormOpen(false);
              }}
              language={language}
            />
          </motion.div>
        ) : (
          /* ========================================================
             MAIN DASHBOARD APP (Includes Header, Tabs and Bottom Navigation)
             ======================================================== */
          <motion.div
            key="dashboard-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="gpu-accelerated"
          >
            {/* Main Header panel with Top Bar Contract: Zone 1 (Brand), Zone 2 (Desktop Nav), Zone 3 (Action & Profile) */}
            <header className="bg-surface/95 sticky top-0 z-40 w-full border-b border-outline-variant/15 select-none shadow-xs backdrop-blur-md transition-colors">
              <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Zone 1: Brand title */}
                <div 
                  onClick={() => setCurrentTab('LIBRARY')}
                  className="flex items-center gap-2.5 cursor-pointer group whitespace-nowrap shrink-0"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined notranslate text-xl" translate="no">menu_book</span>
                  </div>
                  <h1 className="font-serif text-xl font-bold text-primary tracking-tight">
                    Bookshelf
                  </h1>
                </div>

                {/* Zone 2: Desktop Navigation Links (hidden on mobile, sleek on md/lg/xl) */}
                <nav className="hidden md:flex items-center gap-1 bg-surface-container-low/90 p-1 rounded-2xl border border-outline-variant/15 shadow-inner">
                  {(
                    [
                      { id: 'LIBRARY', icon: 'auto_stories', label: t.LIBRARY },
                      { id: 'EXPLORE', icon: 'explore', label: t.EXPLORE },
                      { id: 'WRITING', icon: 'edit_note', label: t.WRITING },
                      { id: 'PROFILE', icon: 'person', label: t.PROFILE }
                    ] as const
                  ).map((tab) => {
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className="relative px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="desktop-nav-active-pill"
                            className="absolute inset-0 bg-primary rounded-xl shadow-xs"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}
                        <span
                          className={`material-symbols-outlined notranslate text-base relative z-10 transition-colors ${
                            isActive ? 'text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                          translate="no"
                        >
                          {tab.icon}
                        </span>
                        <span
                          className={`relative z-10 font-bold transition-colors ${
                            isActive ? 'text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Zone 3: Primary Action & Profile Avatar */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingReview(null);
                      setIsFormOpen(true);
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer active:scale-95 transition-all shadow-xs min-h-[40px]"
                  >
                    <span className="material-symbols-outlined notranslate text-sm font-bold" translate="no">add</span>
                    <span>{t.ADD_REVIEW}</span>
                  </motion.button>

                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentTab('PROFILE')}
                    className="flex items-center gap-2 cursor-pointer group hover:opacity-90 transition-all p-0.5"
                    title={t.PROFILE}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#bf6fe5]/20 hover:scale-105 transition-transform overflow-hidden flex items-center justify-center border border-[#e9b3ff]/30 shadow-xs">
                      <img
                        alt={user.name}
                        className="w-full h-full object-cover"
                        src={user.avatarUrl}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </header>

            <main className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 mt-6">
              <AnimatePresence mode="wait" initial={false}>
                {currentTab === 'LIBRARY' && (
                  /* ========================================================
                     LIBRARY TAB (Scrolling chips, Search, Review Cards, responsive grid)
                     ======================================================== */
                  <motion.section
                    key="library-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 gpu-accelerated"
                  >
                    {/* Integrated Quick Search bar (centered max-w-xl, debounced with 250ms) */}
                    <div className="relative max-w-xl mx-auto mb-2 group">
                      <span className="material-symbols-outlined notranslate text-on-surface-variant/50 absolute left-4 top-1/2 -translate-y-1/2 text-sm group-focus-within:text-primary transition-colors" translate="no">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder={t.SEARCH_PLACEHOLDER}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl pl-10 pr-12 py-3 text-xs focus:border-primary focus:outline-none transition-all placeholder:text-on-surface-variant/60 text-on-surface focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl"
                          title={t.CLEAR_SEARCH_BUTTON}
                          aria-label={t.CLEAR_SEARCH_BUTTON}
                        >
                          <span className="material-symbols-outlined notranslate text-sm" translate="no">close</span>
                        </button>
                      )}
                    </div>

                    {/* Filter scrolling feed row with real-time count badges & centered layout (Item 3.6 & 3.9) */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 max-w-xl mx-auto justify-center px-2">
                      {(
                        [
                          { id: 'TUDO', label: `${t.TAB_ALL} (${tabCounts.all})` },
                          { id: 'LENDO', label: `${t.TAB_READING} (${tabCounts.reading})` },
                          { id: 'CONCLUÍDO', label: `${t.TAB_FINISHED} (${tabCounts.finished})` },
                          { id: 'FAVORITOS', label: `${t.TAB_FAVORITES} (${tabCounts.favorites})` }
                        ] as const
                      ).map((filter) => {
                        const isSel = selectedFilter === filter.id;

                        return (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className="relative rounded-full px-4 sm:px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider flex-shrink-0 cursor-pointer focus:outline-none transition-colors min-h-[40px]"
                          >
                            {isSel && (
                              <motion.div
                                layoutId="active-filter-indicator"
                                className="absolute inset-0 bg-primary rounded-full shadow-xs"
                                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                              />
                            )}
                            <span className={`relative z-10 transition-colors duration-150 ${isSel ? 'text-on-primary font-extrabold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                              {filter.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Sorting & Tag Filter Toolbar (Item 3.7) */}
                    <div className="max-w-xl mx-auto flex flex-wrap items-center justify-between gap-2 pt-1 pb-1 text-xs">
                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-1.5 bg-surface-container/70 border border-outline-variant/20 rounded-xl px-3 py-1.5">
                        <span className="material-symbols-outlined notranslate text-sm text-primary" translate="no">
                          sort
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase">
                          {t.SORT_BY}:
                        </span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-transparent text-xs font-semibold text-primary focus:outline-none cursor-pointer pr-1"
                        >
                          <option value="date" className="bg-surface-container text-on-surface">
                            {t.SORT_DATE}
                          </option>
                          <option value="rating" className="bg-surface-container text-on-surface">
                            {t.SORT_RATING}
                          </option>
                          <option value="title" className="bg-surface-container text-on-surface">
                            {t.SORT_TITLE}
                          </option>
                          <option value="author" className="bg-surface-container text-on-surface">
                            {t.SORT_AUTHOR}
                          </option>
                        </select>
                      </div>

                      {/* Active Tag Filter Indicator & Clear button (Item 3.7) */}
                      {selectedTag && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-xs text-primary"
                        >
                          <span className="material-symbols-outlined notranslate text-xs" translate="no">
                            label
                          </span>
                          <span className="font-bold">
                            {selectedTag.startsWith('#') ? selectedTag : `#${selectedTag}`}
                          </span>
                          <button
                            onClick={() => setSelectedTag(null)}
                            className="ml-1 hover:bg-primary/20 rounded-full p-0.5 cursor-pointer text-primary"
                            title={t.CLEAR_FILTER}
                          >
                            <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Book Cards Grid: 1 col on mobile, 2 col on lg (>=1024px) (Item 3.9) */}
                    {isLoadingBooks ? (
                      /* Skeleton Loading state (Item 7.9) */
                      <div
                        role="status"
                        aria-busy="true"
                        aria-label={t.LOADING_DATA}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 max-w-5xl mx-auto"
                      >
                        <SkeletonBookCard />
                        <SkeletonBookCard />
                        <SkeletonBookCard />
                        <SkeletonBookCard />
                      </div>
                    ) : (
                      <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 max-w-5xl mx-auto">
                        {filteredReviews.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.16 }}
                          className="col-span-full bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 text-center max-w-md mx-auto w-full my-4"
                        >
                          <span className="material-symbols-outlined notranslate text-5xl text-outline-variant/60 block mb-2" translate="no">
                            explore_off
                          </span>
                          <p className="font-serif text-sm font-semibold text-on-surface">
                            {debouncedSearchQuery ? (
                              <span>{t.NO_BOOKS_FOR_QUERY} <span className="text-primary italic">"{debouncedSearchQuery}"</span></span>
                            ) : selectedTag ? (
                              <span>{t.NO_BOOKS_FOR_TAG} <span className="text-primary italic">"{selectedTag}"</span></span>
                            ) : (
                              t.NO_BOOKS_FOUND
                            )}
                          </p>
                          <p className="text-xs text-on-surface-variant/60 mt-1 max-w-xs mx-auto leading-normal">
                            {debouncedSearchQuery || selectedTag ? (
                              <button
                                onClick={() => {
                                  setSearchQuery('');
                                  setSelectedTag(null);
                                }}
                                className="text-primary font-semibold hover:underline mt-1 block mx-auto cursor-pointer"
                              >
                                {t.CLEAR_FILTER}
                              </button>
                            ) : (
                              t.EMPTY_LIBRARY_SUB
                            )}
                          </p>
                          {debouncedSearchQuery ? (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setExploreSearchQuery(debouncedSearchQuery);
                                setCurrentTab('EXPLORE');
                              }}
                              className="mt-4 bg-[#bf6fe5] text-white hover:bg-[#a14ac9] transition-all px-4 py-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer shadow-md flex items-center gap-1.5 mx-auto"
                            >
                              <span className="material-symbols-outlined notranslate text-sm" translate="no">globe_uk</span>
                              <span>{t.SEARCH_GLOBAL_PROMPT}</span>
                            </motion.button>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsFormOpen(true)}
                              className="mt-4 bg-primary text-on-primary hover:bg-primary-container transition-colors px-4 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer shadow-sm mx-auto"
                            >
                              {t.ADD_REVIEW}
                            </motion.button>
                          )}
                        </motion.div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredReviews.map((item) => (
                            <ReviewCard
                              key={item.id}
                              review={item}
                              onEdit={(rev) => {
                                setEditingReview(rev);
                                setIsFormOpen(true);
                              }}
                              onDelete={handleDeleteReview}
                              onStatusChange={handleStatusChange}
                              onFavoriteToggle={handleFavoriteToggle}
                              onRatingChange={handleRatingChange}
                              onUpdateProgress={handleUpdateProgress}
                              onTagClick={(tag) => setSelectedTag(selectedTag === tag ? null : tag)}
                              activeTag={selectedTag}
                              searchQuery={debouncedSearchQuery}
                              language={language}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </motion.div>
                    )}
                  </motion.section>
                )}

                {currentTab === 'EXPLORE' && (
                  /* ========================================================
                     EXPLORE TAB (curated list suggestions)
                     ======================================================== */
                  <motion.div
                    key="explore-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="gpu-accelerated"
                  >
                    <ExploreView
                      onAddPresetToList={handleAddPresetRecommendation}
                      language={language}
                      initialSearchQuery={exploreSearchQuery}
                      libraryBooks={reviews}
                    />
                  </motion.div>
                )}

                {currentTab === 'WRITING' && (
                  /* ========================================================
                     WRITING TAB (Draft workspace, notes, quote log book)
                     ======================================================== */
                  <motion.div
                    key="writing-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="gpu-accelerated"
                  >
                    <WritingView
                      language={language}
                      user={user}
                      libraryBooks={reviews}
                    />
                  </motion.div>
                )}

                {currentTab === 'PROFILE' && (
                  /* ========================================================
                     PROFILE TAB (Brenda Ernesto summary page, counters, targets)
                     ======================================================== */
                  <motion.div
                    key="profile-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="gpu-accelerated"
                  >
                    <ProfileView
                      profile={user}
                      reviews={reviews}
                      onLogout={handleLogout}
                      language={language}
                      onImportReviews={async (imported) => {
                        setReviews(imported);
                        localStorage.setItem('bookshelf_reviews', JSON.stringify(imported));
                        if (user?.uid) {
                          try {
                            for (const rev of imported) {
                              const docRef = doc(db, `users/${user.uid}/reviews`, rev.id);
                              await setDoc(docRef, rev);
                            }
                          } catch (err) {
                            console.error("Falha ao sincronizar livros importados com o Firestore:", err);
                          }
                        }
                      }}
                      onUpdateProfile={async (updatedUser) => {
                        setUser(updatedUser);
                        localStorage.setItem('bookshelf_user', JSON.stringify(updatedUser));
                        if (updatedUser.language) {
                          setLanguage(updatedUser.language);
                          localStorage.setItem('bookshelf_language', updatedUser.language);
                        }
                        if (updatedUser.theme) {
                          setTheme(updatedUser.theme);
                          localStorage.setItem('bookshelf_theme', updatedUser.theme);
                        }
                        
                        // Sincronizar alterações de perfil com Cloud Firestore em tempo real
                        if (updatedUser.uid) {
                          try {
                            const docRef = doc(db, 'users', updatedUser.uid);
                            await setDoc(docRef, {
                              email: updatedUser.email,
                              name: updatedUser.name,
                              avatarUrl: updatedUser.avatarUrl,
                              language: updatedUser.language || language,
                              bannerType: updatedUser.bannerType || 'none',
                              bannerValue: updatedUser.bannerValue || '',
                              theme: updatedUser.theme || theme
                            });
                          } catch (err) {
                            console.error("Falha ao sincronizar perfil com o Firestore:", err);
                          }
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Bottom floating plus button (FAB) trigger (only renders on Library list view tab on mobile) */}
            <AnimatePresence>
              {currentTab === 'LIBRARY' && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => {
                    setEditingReview(null);
                    setIsFormOpen(true);
                  }}
                  className="fixed right-4 sm:right-6 bottom-20 sm:bottom-24 w-14 h-14 bg-primary text-on-primary rounded-full fab-shadow flex items-center justify-center cursor-pointer z-50 hover:bg-white hover:text-on-primary-container md:hidden"
                  title={t.ADD_REVIEW}
                  aria-label={t.ADD_REVIEW}
                >
                  <span className="material-symbols-outlined notranslate text-3xl font-bold" translate="no">add</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile Touch Navigation Bottom bar (hidden on desktop/tablet, active on mobile with safe-area) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#231e25]/95 backdrop-blur-lg border-t border-outline-variant/15 flex justify-around items-center px-4 pt-1.5 pb-safe shadow-lg select-none md:hidden">
              {(
                [
                  { id: 'LIBRARY', icon: 'auto_stories', label: t.LIBRARY },
                  { id: 'EXPLORE', icon: 'explore', label: t.EXPLORE },
                  { id: 'WRITING', icon: 'edit_note', label: t.WRITING },
                  { id: 'PROFILE', icon: 'person', label: t.PROFILE }
                ] as const
              ).map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className="relative flex flex-col items-center justify-center py-1 px-3 text-xs font-semibold focus:outline-none cursor-pointer group min-h-[44px] min-w-[56px]"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottom-nav-active-pill"
                        className="absolute inset-0 bg-primary-container/80 rounded-2xl shadow-xs"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span
                      className={`material-symbols-outlined notranslate text-xl relative z-10 transition-transform duration-150 ${
                        isActive ? 'text-on-primary-container scale-110' : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                      translate="no"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {tab.icon}
                    </span>
                    <span
                      className={`text-[10px] relative z-10 tracking-tight transition-colors duration-150 ${
                        isActive ? 'text-on-primary-container font-bold' : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
