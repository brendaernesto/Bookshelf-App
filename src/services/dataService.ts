/**
 * Centralized Data Storage and Service Layer
 * Supports Firestore synchronization with resilient localStorage caching,
 * automated schema versioning, and non-destructive migrations.
 */

import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BookReview, BookStatus, UserProfile } from '../types';
import { BookQuote } from '../components/WritingView';
import { sanitizeText, sanitizeUrl, sanitizeTags } from '../utils/sanitize';

export const CURRENT_SCHEMA_VERSION = 2;
const SCHEMA_KEY = 'bookshelf_schema_version';
const REVIEWS_STORAGE_KEY = 'bookshelf_reviews';
const QUOTES_STORAGE_KEY = 'bookshelf_quotes';
const USER_STORAGE_KEY = 'bookshelf_user';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fromCache?: boolean;
}

/**
 * Migration helper to ensure existing local data conforms to current schema without data loss.
 */
export function runMigrations(): void {
  try {
    const rawVersion = localStorage.getItem(SCHEMA_KEY);
    const existingVersion = rawVersion ? parseInt(rawVersion, 10) : 1;

    if (existingVersion < CURRENT_SCHEMA_VERSION) {
      console.log(`[DataService] Migrating database from version ${existingVersion} to ${CURRENT_SCHEMA_VERSION}...`);

      // Migration from Version 1 -> Version 2:
      // Ensure reviews have status, pagesRead, totalPages, isFavorite, and sanitized values
      const rawReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (rawReviews) {
        try {
          const parsed = JSON.parse(rawReviews);
          if (Array.isArray(parsed)) {
            const migrated = parsed.map((item: any) => ({
              id: item.id || `migrated-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              title: sanitizeText(item.title || 'Sem título'),
              author: sanitizeText(item.author || 'Autor Desconhecido'),
              status: (['LENDO', 'CONCLUÍDO', 'PAUSADO'].includes(item.status) ? item.status : 'LENDO') as BookStatus,
              rating: typeof item.rating === 'number' ? Math.max(0, Math.min(5, item.rating)) : 0,
              coverUrl: sanitizeUrl(item.coverUrl, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop'),
              reviewText: sanitizeText(item.reviewText || ''),
              tags: sanitizeTags(item.tags || []),
              isFavorite: Boolean(item.isFavorite),
              createdAt: item.createdAt || new Date().toISOString(),
              userId: item.userId || 'default-user',
              pagesRead: typeof item.pagesRead === 'number' ? item.pagesRead : 0,
              totalPages: typeof item.totalPages === 'number' ? item.totalPages : 0
            }));
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(migrated));
          }
        } catch (e) {
          console.warn('[DataService] Failed to parse legacy reviews during migration:', e);
        }
      }

      // Ensure quotes have valid fields
      const rawQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (rawQuotes) {
        try {
          const parsedQuotes = JSON.parse(rawQuotes);
          if (Array.isArray(parsedQuotes)) {
            const migratedQuotes = parsedQuotes.map((q: any) => ({
              id: q.id || `quote-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              bookTitle: sanitizeText(q.bookTitle || 'Sem título'),
              quoteText: sanitizeText(q.quoteText || ''),
              page: q.page ? sanitizeText(q.page) : undefined,
              chapter: q.chapter ? sanitizeText(q.chapter) : undefined,
              savedAt: q.savedAt || new Date().toISOString(),
              userId: q.userId || 'default-user'
            }));
            localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(migratedQuotes));
          }
        } catch (e) {
          console.warn('[DataService] Failed to parse legacy quotes during migration:', e);
        }
      }

      localStorage.setItem(SCHEMA_KEY, CURRENT_SCHEMA_VERSION.toString());
      console.log(`[DataService] Migration to schema version ${CURRENT_SCHEMA_VERSION} completed successfully.`);
    }
  } catch (err) {
    console.warn('[DataService] Migration failed gracefully, existing data preserved:', err);
  }
}

// Automatically execute schema verification on module load
runMigrations();

/**
 * Data Service methods for Book Reviews
 */
export const DataService = {
  /**
   * Retrieves user reviews, querying Firestore when authenticated and falling back to local cache
   */
  async getBooks(userId: string): Promise<StorageResult<BookReview[]>> {
    if (!userId) {
      return { success: false, error: 'User ID is required', data: [] };
    }

    const reviewsPath = `users/${userId}/reviews`;
    try {
      const qSnapshot = await getDocs(collection(db, reviewsPath));
      const list: BookReview[] = [];
      qSnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as BookReview);
      });

      // Sort descending by creation date
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list));
      return { success: true, data: list, fromCache: false };
    } catch (err) {
      console.warn('[DataService] Cloud fetch failed, serving from local cache:', err);
      try {
        const cached = localStorage.getItem(REVIEWS_STORAGE_KEY);
        const data: BookReview[] = cached ? JSON.parse(cached) : [];
        return { success: true, data, fromCache: true };
      } catch (cacheErr) {
        return { success: false, error: 'Falha ao carregar livros do cache', data: [] };
      }
    }
  },

  /**
   * Saves or updates a book review in Firestore and updates the local cache
   */
  async saveBook(
    bookData: Omit<BookReview, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
    userId: string
  ): Promise<StorageResult<BookReview>> {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const targetId = bookData.id || `review-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const createdAt = bookData.createdAt || new Date().toISOString();

    const cleanBook: BookReview = {
      id: targetId,
      title: sanitizeText(bookData.title),
      author: sanitizeText(bookData.author),
      status: bookData.status,
      rating: Math.max(0, Math.min(5, Number(bookData.rating) || 0)),
      coverUrl: sanitizeUrl(bookData.coverUrl, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop'),
      reviewText: sanitizeText(bookData.reviewText),
      tags: sanitizeTags(bookData.tags || []),
      isFavorite: Boolean(bookData.isFavorite),
      createdAt: createdAt,
      userId: userId,
      pagesRead: typeof bookData.pagesRead === 'number' ? Math.max(0, bookData.pagesRead) : 0,
      totalPages: typeof bookData.totalPages === 'number' ? Math.max(0, bookData.totalPages) : 0
    };

    const docPath = `users/${userId}/reviews/${targetId}`;

    try {
      await setDoc(doc(db, `users/${userId}/reviews`, targetId), cleanBook);

      // Update local storage cache
      try {
        const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
        let list: BookReview[] = raw ? JSON.parse(raw) : [];
        const index = list.findIndex(r => r.id === targetId);
        if (index >= 0) {
          list[index] = cleanBook;
        } else {
          list = [cleanBook, ...list];
        }
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list));
      } catch (cacheErr) {
        console.warn('[DataService] Failed to update local cache:', cacheErr);
      }

      return { success: true, data: cleanBook };
    } catch (error) {
      console.warn('[DataService] Error syncing book to Firestore:', error);
      // Ensure local cache is preserved
      try {
        const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
        let list: BookReview[] = raw ? JSON.parse(raw) : [];
        const index = list.findIndex(r => r.id === targetId);
        if (index >= 0) {
          list[index] = cleanBook;
        } else {
          list = [cleanBook, ...list];
        }
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}

      if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
        handleFirestoreError(error, OperationType.WRITE, docPath);
      }
      return { success: true, data: cleanBook, fromCache: true };
    }
  },

  /**
   * Deletes a book review from Firestore and local cache
   */
  async deleteBook(bookId: string, userId: string): Promise<StorageResult<boolean>> {
    if (!userId || !bookId) {
      return { success: false, error: 'User ID and Book ID are required' };
    }

    const docPath = `users/${userId}/reviews/${bookId}`;

    // Remove from local cache immediately
    try {
      const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (raw) {
        const list: BookReview[] = JSON.parse(raw);
        const filtered = list.filter(r => r.id !== bookId);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('[DataService] Error removing from local cache:', e);
    }

    try {
      await deleteDoc(doc(db, `users/${userId}/reviews`, bookId));
      return { success: true, data: true };
    } catch (error) {
      console.warn('[DataService] Cloud delete failed:', error);
      handleFirestoreError(error, OperationType.DELETE, docPath);
      return { success: false, error: 'Falha ao excluir na nuvem' };
    }
  },

  /**
   * Updates partial fields of a book review (e.g. status, rating, progress, favorite)
   */
  async updateBookPartial(
    bookId: string,
    updates: Partial<BookReview>,
    userId: string
  ): Promise<StorageResult<boolean>> {
    if (!userId || !bookId) {
      return { success: false, error: 'User ID and Book ID are required' };
    }

    // Sanitize any updated string fields
    const sanitizedUpdates: Partial<BookReview> = { ...updates };
    if (updates.title) sanitizedUpdates.title = sanitizeText(updates.title);
    if (updates.author) sanitizedUpdates.author = sanitizeText(updates.author);
    if (updates.reviewText) sanitizedUpdates.reviewText = sanitizeText(updates.reviewText);
    if (updates.tags) sanitizedUpdates.tags = sanitizeTags(updates.tags);

    // Update local storage optimistically
    try {
      const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (raw) {
        const list: BookReview[] = JSON.parse(raw);
        const updated = list.map(r => r.id === bookId ? { ...r, ...sanitizedUpdates } : r);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {}

    try {
      const ref = doc(db, `users/${userId}/reviews`, bookId);
      await updateDoc(ref, sanitizedUpdates as any);
      return { success: true, data: true };
    } catch (error) {
      console.warn('[DataService] Could not update partial fields in cloud:', error);
      return { success: false, error: 'Falha ao atualizar na nuvem' };
    }
  },

  /**
   * Retrieves quotes belonging strictly to the authenticated user
   */
  async getQuotes(userId: string): Promise<StorageResult<BookQuote[]>> {
    if (!userId) {
      return { success: false, error: 'User ID is required', data: [] };
    }

    const path = `users/${userId}/quotes`;
    try {
      const snap = await getDocs(collection(db, path));
      const list: BookQuote[] = [];
      snap.forEach(docSnap => list.push(docSnap.data() as BookQuote));
      list.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(list));
      return { success: true, data: list, fromCache: false };
    } catch (err) {
      console.warn('[DataService] Cloud fetch for quotes failed, reading local cache:', err);
      try {
        const cached = localStorage.getItem(QUOTES_STORAGE_KEY);
        const data: BookQuote[] = cached ? JSON.parse(cached) : [];
        return { success: true, data, fromCache: true };
      } catch (e) {
        return { success: false, error: 'Falha ao carregar citações', data: [] };
      }
    }
  },

  /**
   * Saves or updates a quote with strict validation and sanitization
   */
  async saveQuote(quote: BookQuote, userId: string): Promise<StorageResult<BookQuote>> {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const cleanQuote: BookQuote = {
      id: quote.id || `quote-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookTitle: sanitizeText(quote.bookTitle),
      quoteText: sanitizeText(quote.quoteText),
      page: quote.page ? sanitizeText(quote.page) : undefined,
      chapter: quote.chapter ? sanitizeText(quote.chapter) : undefined,
      savedAt: quote.savedAt || new Date().toISOString(),
      userId: userId
    };

    const docPath = `users/${userId}/quotes/${cleanQuote.id}`;

    // Update local cache
    try {
      const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
      let list: BookQuote[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(q => q.id === cleanQuote.id);
      if (idx >= 0) {
        list[idx] = cleanQuote;
      } else {
        list = [cleanQuote, ...list];
      }
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}

    try {
      await setDoc(doc(db, `users/${userId}/quotes`, cleanQuote.id), cleanQuote);
      return { success: true, data: cleanQuote };
    } catch (err) {
      console.warn('[DataService] Error saving quote to Firestore:', err);
      if (err instanceof Error && err.message.toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
      return { success: true, data: cleanQuote, fromCache: true };
    }
  },

  /**
   * Deletes a quote from cloud and local cache
   */
  async deleteQuote(quoteId: string, userId: string): Promise<StorageResult<boolean>> {
    if (!userId || !quoteId) return { success: false, error: 'Missing parameters' };

    try {
      const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (raw) {
        const list: BookQuote[] = JSON.parse(raw);
        localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(list.filter(q => q.id !== quoteId)));
      }
    } catch (e) {}

    try {
      await deleteDoc(doc(db, `users/${userId}/quotes`, quoteId));
      return { success: true, data: true };
    } catch (err) {
      console.warn('[DataService] Cloud quote delete error:', err);
      return { success: false, error: 'Falha ao deletar citação' };
    }
  },

  /**
   * Profile synchronization
   */
  async getUserProfile(userId: string): Promise<StorageResult<UserProfile>> {
    try {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
        return { success: true, data };
      }
    } catch (e) {
      console.warn('[DataService] Cloud profile fetch error:', e);
    }

    try {
      const cached = localStorage.getItem(USER_STORAGE_KEY);
      if (cached) {
        return { success: true, data: JSON.parse(cached), fromCache: true };
      }
    } catch (e) {}

    return { success: false, error: 'Perfil não encontrado' };
  },

  async saveUserProfile(profile: UserProfile): Promise<StorageResult<UserProfile>> {
    if (!profile.uid) return { success: false, error: 'User UID missing' };

    const sanitizedProfile: UserProfile = {
      ...profile,
      name: sanitizeText(profile.name),
      email: sanitizeText(profile.email),
      avatarUrl: sanitizeUrl(profile.avatarUrl, 'https://picsum.photos/seed/bookshelfavatar/150/150')
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitizedProfile));

    try {
      const ref = doc(db, 'users', profile.uid);
      await setDoc(ref, sanitizedProfile, { merge: true });
      return { success: true, data: sanitizedProfile };
    } catch (e) {
      console.warn('[DataService] Could not persist profile to Firestore:', e);
      return { success: false, error: 'Falha ao salvar perfil na nuvem', data: sanitizedProfile };
    }
  }
};
