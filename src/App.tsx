import React, { useState, useEffect } from 'react';
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
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, signOut, handleFirestoreError, OperationType } from './firebase';

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
  const [currentTab, setCurrentTab] = useState<'LIBRARY' | 'EXPLORE' | 'WRITING' | 'PROFILE'>('LIBRARY');
  const [selectedFilter, setSelectedFilter] = useState<'TUDO' | 'LENDO' | 'CONCLUÍDO' | 'FAVORITOS'>('TUDO');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form view attributes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<BookReview | null>(null);
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const t = TRANSLATIONS[language];

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  // Synchronize document.documentElement.lang with the currently active language so browsers correctly auto-translate
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US';
  }, [language]);

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
            const profile: UserProfile = {
              email: firebaseUser.email || data.email || 'usuario@bookshelf.com',
              name: data.name || firebaseUser.displayName || 'Leitor Apaixonado',
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || 'https://picsum.photos/seed/bookshelfavatar/150/150',
              uid: firebaseUser.uid,
              language: profileLanguage
            };
            setUser(profile);
            localStorage.setItem('bookshelf_user', JSON.stringify(profile));
            if (data.language) {
              setLanguage(data.language);
              localStorage.setItem('bookshelf_language', data.language);
            }
          } else {
            // Only sync from state or firebaseUser to prevent overwriting
            setUser((prev) => {
              const email = prev?.uid === userId ? prev.email : (firebaseUser.email || 'usuario@bookshelf.com');
              const name = prev?.uid === userId ? prev.name : (firebaseUser.displayName || 'Leitor Apaixonado');
              const avatarUrl = prev?.uid === userId ? prev.avatarUrl : (firebaseUser.photoURL || 'https://picsum.photos/seed/bookshelfavatar/150/150');
              const profile = { email, name, avatarUrl, uid: userId, language: language };
              
              setDoc(cloudProfileRef, { email, name, avatarUrl, language }).catch(err => {
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
        // Clean local identifiers for the session but leave the main translations in place
        localStorage.removeItem('bookshelf_user');
        localStorage.removeItem('bookshelf_reviews');
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
              prev.language !== cloudProfile.language
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
            language: language
          });
        }
      } catch (err) {
        console.warn("Could not retrieve cloud user profile, fallback is active:", err);
      }

      // 2. Fetch User evaluation listings from Cloud Firestore
      const reviewsPath = `users/${userId}/reviews`;
      try {
        const qSnapshot = await getDocs(collection(db, reviewsPath));
        if (!qSnapshot.empty) {
          const list: BookReview[] = [];
          qSnapshot.forEach((docSnap) => {
            list.push(docSnap.data() as BookReview);
          });
          // Sort list by creation date (descending)
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReviews(list);
          localStorage.setItem('bookshelf_reviews', JSON.stringify(list));
        } else {
          // If Firestore is empty, seed it with initial reviews data
          console.log("Seeding Firestore with elegant defaults template for user profile:", userId);
          const listWithUserId = INITIAL_REVIEWS.map(r => ({ ...r, userId }));
          
          for (const rev of listWithUserId) {
            const reviewDocRef = doc(db, reviewsPath, rev.id);
            await setDoc(reviewDocRef, rev);
          }
          
          setReviews(listWithUserId);
          localStorage.setItem('bookshelf_reviews', JSON.stringify(listWithUserId));
        }
      } catch (error) {
        console.warn("Could not fetch cloud data, loading local cache:", error);
        const savedReviews = localStorage.getItem('bookshelf_reviews');
        if (savedReviews) {
          try {
            setReviews(JSON.parse(savedReviews));
          } catch (e) {
            console.error(e);
            setReviews(INITIAL_REVIEWS);
          }
        } else {
          setReviews(INITIAL_REVIEWS);
        }
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
    const path = `users/${userId}/reviews`;
    
    let targetId = formData.id;
    let createdAt = new Date().toISOString();
    
    if (formData.id) {
       const original = reviews.find((r) => r.id === formData.id);
       if (original) {
         createdAt = original.createdAt;
       }
    } else {
       targetId = 'review-' + Date.now();
    }

    const reviewDocRef = doc(db, `users/${userId}/reviews`, targetId!);
    const rawReviewData = {
      id: targetId!,
      title: formData.title,
      author: formData.author,
      status: formData.status,
      rating: formData.rating,
      coverUrl: formData.coverUrl,
      reviewText: formData.reviewText,
      tags: formData.tags,
      isFavorite: formData.isFavorite,
      createdAt: createdAt,
      userId: userId
    };

    try {
      await setDoc(reviewDocRef, rawReviewData);
      
      let updatedReviews: BookReview[];
      if (formData.id) {
        updatedReviews = reviews.map((r) => r.id === formData.id ? rawReviewData : r);
        showToast(t.TOAST_EDITED);
      } else {
        updatedReviews = [rawReviewData, ...reviews];
        showToast(t.TOAST_SAVED);
      }
      
      setReviews(updatedReviews);
      localStorage.setItem('bookshelf_reviews', JSON.stringify(updatedReviews));
      setEditingReview(null);
      setIsFormOpen(false);
    } catch (error) {
      showToast(t.TOAST_SAVED_ERROR, true);
      handleFirestoreError(error, OperationType.WRITE, `${path}/${targetId}`);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    const path = `users/${userId}/reviews/${id}`;
    
    try {
      const reviewDocRef = doc(db, `users/${userId}/reviews`, id);
      await deleteDoc(reviewDocRef);
      
      const updated = reviews.filter((r) => r.id !== id);
      setReviews(updated);
      localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));
      showToast(t.TOAST_DELETED);
    } catch (error) {
      showToast(t.TOAST_DELETED_ERROR, true);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookStatus) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    const path = `users/${userId}/reviews/${id}`;
    
    try {
      const reviewDocRef = doc(db, `users/${userId}/reviews`, id);
      await updateDoc(reviewDocRef, { status: newStatus });
      
      const updated = reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
      setReviews(updated);
      localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));
      
      const localizedStatus = newStatus === 'LENDO' ? t.STATUS_LENDO : newStatus === 'CONCLUÍDO' ? t.STATUS_CONCLUIDO : t.STATUS_PAUSADO;
      showToast(`${t.TOAST_STATUS_UPDATED}: ${localizedStatus}`);
    } catch (error) {
      showToast(t.TOAST_UPDATE_ERROR, true);
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleFavoriteToggle = async (id: string) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    const path = `users/${userId}/reviews/${id}`;
    
    const target = reviews.find((r) => r.id === id);
    if (!target) return;
    const newFavorite = !target.isFavorite;
    
    try {
      const reviewDocRef = doc(db, `users/${userId}/reviews`, id);
      await updateDoc(reviewDocRef, { isFavorite: newFavorite });
      
      const updated = reviews.map((r) => (r.id === id ? { ...r, isFavorite: newFavorite } : r));
      setReviews(updated);
      localStorage.setItem('bookshelf_reviews', JSON.stringify(updated));
      showToast(newFavorite ? t.TOAST_FAV_ADDED : t.TOAST_FAV_REMOVED);
    } catch (error) {
      showToast(t.TOAST_UPDATE_ERROR, true);
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleAddPresetRecommendation = async (title: string, author: string, coverUrl: string) => {
    if (!user) return;
    const userId = user.uid || 'default-user';
    const id = 'recommendation-' + Date.now();
    const path = `users/${userId}/reviews/${id}`;
    
    const newReview: BookReview = {
      id,
      title,
      author,
      status: 'LENDO',
      rating: 4.5,
      coverUrl,
      reviewText: language === 'pt' ? 'Adicionado do Explorar.' : language === 'es' ? 'Agregado de Explorar.' : 'Added from Explore.',
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
      showToast(t.TOAST_RECOMMENDED_ADDED);
    } catch (error) {
      showToast(t.TOAST_UPDATE_ERROR, true);
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Filter & Search calculation logic
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.tags.some((tg) => tg.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rev.reviewText && rev.reviewText.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'TUDO') return true;
    if (selectedFilter === 'LENDO') return rev.status === 'LENDO';
    if (selectedFilter === 'CONCLUÍDO') return rev.status === 'CONCLUÍDO';
    if (selectedFilter === 'FAVORITOS') return rev.isFavorite;

    return true;
  });

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
    <div className="bg-[#171219] text-[#ebdfea] min-h-screen pb-28 relative animate-fadeIn">
      {/* Real-time Toast Notifications */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border backdrop-blur-md transition-all duration-300 ${
            toast.isError
              ? 'bg-[#ffebee]/95 text-[#c62828] border-[#ef9a9a]'
              : 'bg-[#f3e5f5]/95 text-[#6a1b9a] border-[#e1bee7] shadow-[#bf6fe5]/20 shadow-md'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-base" translate="no">
            {toast.isError ? 'error_outline' : 'done'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
      <AnimatePresence mode="wait">
        {isFormOpen ? (
          /* ========================================================
             FORM VIEW (Add / Edit Screen)
             ======================================================== */
          <motion.div
            key="edit-form-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="px-margin-mobile pt-4"
          >
            {/* Header Form Navigation */}
            <header className="flex justify-between items-center h-16 w-full max-w-2xl mx-auto mb-4 border-b border-outline-variant/10">
              <button
                onClick={() => {
                  setEditingReview(null);
                  setIsFormOpen(false);
                }}
                className="text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container active:scale-95 cursor-pointer focus:outline-none"
              >
                <span className="material-symbols-outlined notranslate" translate="no">arrow_back</span>
              </button>
              <h1 className="font-serif text-lg font-bold text-primary animate-fadeIn">
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
            transition={{ duration: 0.3 }}
          >
            {/* Main Header panel */}
            <header className="bg-surface sticky top-0 z-40 flex justify-between items-center px-margin-mobile w-full h-16 border-b border-outline-variant/15 select-none shadow-sm backdrop-blur-md bg-opacity-95">
              <div className="flex items-center gap-3">
                <div className="text-primary flex items-center animate-pulse">
                  <span className="material-symbols-outlined notranslate text-2xl" translate="no">menu_book</span>
                </div>
                <h1 className="font-serif text-xl font-bold text-primary">
                  {t.LIBRARY}
                </h1>
              </div>

              {/* Logging details / user avatar */}
              <div
                onClick={() => setCurrentTab('PROFILE')}
                className="flex items-center gap-2 cursor-pointer group hover:opacity-90 active:scale-95 transition-all"
                title="Minha Conta"
              >
                <div className="w-9 h-9 rounded-full bg-[#bf6fe5]/20 hover:scale-105 transition-transform overflow-hidden flex items-center justify-center border border-[#e9b3ff]/30">
                  <img
                    alt={user.name}
                    className="w-full h-full object-cover animate-fadeIn"
                    src={user.avatarUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </header>

            <main className="px-margin-mobile mt-6">
              <AnimatePresence mode="wait">
                {currentTab === 'LIBRARY' && (
                  /* ========================================================
                     LIBRARY TAB (Scrolling chips, Search, Review Cards, list block)
                     ======================================================== */
                  <motion.section
                    key="library-tab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Integrated Quick Search bar */}
                    <div className="relative max-w-2xl mx-auto mb-2 group">
                      <span className="material-symbols-outlined notranslate text-on-surface-variant/50 absolute left-4 top-1/2 -translate-y-1/2 text-sm group-focus-within:text-primary" translate="no">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder={t.SEARCH_PLACEHOLDER}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl pl-10 pr-10 py-3 text-xs focus:border-primary focus:outline-none transition-all placeholder:text-on-surface-variant/30 text-on-surface focus:ring-1 focus:ring-primary/25"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                        >
                          <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
                        </button>
                      )}
                    </div>

                    {/* Filter scrolling feed row */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 max-w-2xl mx-auto -mx-margin-mobile px-margin-mobile sm:mx-auto">
                      {(['TUDO', 'LENDO', 'CONCLUÍDO', 'FAVORITOS'] as const).map((filter) => {
                        const isSel = selectedFilter === filter;
                        let filterLabel = filter;
                        if (filter === 'TUDO') filterLabel = t.STATUS_TUDO;
                        else if (filter === 'LENDO') filterLabel = t.STATUS_LENDO;
                        else if (filter === 'CONCLUÍDO') filterLabel = t.STATUS_CONCLUIDO;
                        else if (filter === 'FAVORITOS') filterLabel = t.STATUS_FAVORITOS;

                        return (
                          <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-wider flex-shrink-0 transition-all active:scale-95 cursor-pointer border ${
                              isSel
                                ? 'bg-primary text-on-primary border-primary shadow-sm'
                                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-outline-variant/10'
                            }`}
                          >
                            {filterLabel}
                          </button>
                        );
                      })}
                    </div>

                    {/* Book Cards count feed */}
                    <div className="space-y-4 mt-2 max-w-2xl mx-auto">
                      {filteredReviews.length === 0 ? (
                        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 text-center">
                          <span className="material-symbols-outlined notranslate text-5xl text-outline-variant/60 block mb-2" translate="no">
                            explore_off
                          </span>
                          <p className="font-serif text-sm font-semibold text-on-surface">
                            {language === 'pt' ? 'Nenhum livro encontrado' : language === 'es' ? 'Libro no encontrado' : 'No books found'}
                          </p>
                          <p className="text-xs text-on-surface-variant/60 mt-1 max-w-xs mx-auto leading-normal">
                            {searchQuery
                              ? (language === 'pt' ? 'Experimente ajustar os termos de pesquisa ou remover os filtros aplicados.' : language === 'es' ? 'Pruebe a ajustar los términos de búsqueda o a eliminar los filtros.' : 'Try adjusting your search query or clear selected category filter.')
                              : t.EMPTY_LIBRARY_SUB}
                          </p>
                          {!searchQuery && (
                            <button
                              onClick={() => setIsFormOpen(true)}
                              className="mt-4 bg-primary text-on-primary hover:bg-primary-container transition-colors px-4 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer active:scale-95 shadow-sm"
                            >
                              {t.ADD_REVIEW}
                            </button>
                          )}
                        </div>
                      ) : (
                        filteredReviews.map((item) => (
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
                            language={language}
                          />
                        ))
                      )}
                    </div>
                  </motion.section>
                )}

                {currentTab === 'EXPLORE' && (
                  /* ========================================================
                     EXPLORE TAB (curated list suggestions)
                     ======================================================== */
                  <ExploreView onAddPresetToList={handleAddPresetRecommendation} language={language} />
                )}

                {currentTab === 'WRITING' && (
                  /* ========================================================
                     WRITING TAB (Draft workspace, notes, quote log book)
                     ======================================================== */
                  <WritingView language={language} />
                )}

                {currentTab === 'PROFILE' && (
                  /* ========================================================
                     PROFILE TAB (Brenda Ernesto summary page, counters, targets)
                     ======================================================== */
                  <ProfileView
                    profile={user}
                    reviews={reviews}
                    onLogout={handleLogout}
                    language={language}
                    onUpdateProfile={async (updatedUser) => {
                      setUser(updatedUser);
                      localStorage.setItem('bookshelf_user', JSON.stringify(updatedUser));
                      if (updatedUser.language) {
                        setLanguage(updatedUser.language);
                        localStorage.setItem('bookshelf_language', updatedUser.language);
                      }
                      
                      // Sincronizar alterações de perfil com Cloud Firestore em tempo real
                      if (updatedUser.uid) {
                        try {
                          const docRef = doc(db, 'users', updatedUser.uid);
                          await setDoc(docRef, {
                            email: updatedUser.email,
                            name: updatedUser.name,
                            avatarUrl: updatedUser.avatarUrl,
                            language: updatedUser.language || language
                          });
                        } catch (err) {
                          console.error("Falha ao sincronizar perfil com o Firestore:", err);
                        }
                      }
                    }}
                  />
                )}
              </AnimatePresence>
            </main>

            {/* Bottom floating plus button (FAB) trigger (only renders on Library library list view tab) */}
            {currentTab === 'LIBRARY' && (
              <button
                onClick={() => {
                  setEditingReview(null);
                  setIsFormOpen(true);
                }}
                className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-on-primary rounded-full fab-shadow flex items-center justify-center active:scale-95 transition-all cursor-pointer duration-300 hover:scale-105 z-50 hover:bg-white hover:text-on-primary-container animate-pulse"
                title={t.ADD_REVIEW}
              >
                <span className="material-symbols-outlined notranslate text-3xl font-bold" translate="no">add</span>
              </button>
            )}

            {/* Fixed Navigation Bottom bar */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#231e25] border-t border-outline-variant/15 flex justify-around items-center px-4 py-3.5 shadow-lg select-none">
              <button
                onClick={() => setCurrentTab('LIBRARY')}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-5 py-1.5 transition-all text-xs font-semibold focus:outline-none cursor-pointer ${
                  currentTab === 'LIBRARY'
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm scale-102'
                    : 'text-on-surface-variant hover:bg-surface-container-high/40'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-xl" translate="no" style={{ fontVariationSettings: currentTab === 'LIBRARY' ? "'FILL' 1" : "'FILL' 0" }}>auto_stories</span>
                <span className="text-[10px]">{t.LIBRARY}</span>
              </button>

              <button
                onClick={() => setCurrentTab('EXPLORE')}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-5 py-1.5 transition-all text-xs font-semibold focus:outline-none cursor-pointer ${
                  currentTab === 'EXPLORE'
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm scale-102'
                    : 'text-on-surface-variant hover:bg-surface-container-high/40'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-xl" translate="no" style={{ fontVariationSettings: currentTab === 'EXPLORE' ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
                <span className="text-[10px]">{t.EXPLORE}</span>
              </button>

              <button
                onClick={() => setCurrentTab('WRITING')}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-5 py-1.5 transition-all text-xs font-semibold focus:outline-none cursor-pointer ${
                  currentTab === 'WRITING'
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm scale-102'
                    : 'text-on-surface-variant hover:bg-surface-container-high/40'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-xl" translate="no" style={{ fontVariationSettings: currentTab === 'WRITING' ? "'FILL' 1" : "'FILL' 0" }}>edit_note</span>
                <span className="text-[10px]">{t.WRITING}</span>
              </button>

              <button
                onClick={() => setCurrentTab('PROFILE')}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-5 py-1.5 transition-all text-xs font-semibold focus:outline-none cursor-pointer ${
                  currentTab === 'PROFILE'
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm scale-102'
                    : 'text-on-surface-variant hover:bg-surface-container-high/40'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-xl" translate="no" style={{ fontVariationSettings: currentTab === 'PROFILE' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                <span className="text-[10px]">{t.PROFILE}</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
