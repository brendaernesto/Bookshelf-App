export type BookStatus = 'LENDO' | 'CONCLUÍDO' | 'PAUSADO';

export interface BookReview {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  rating: number;
  coverUrl: string;
  reviewText: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  userId?: string;
}

export interface UserProfile {
  email: string;
  name: string;
  avatarUrl: string;
  uid?: string;
  language?: 'pt' | 'en' | 'es';
  bannerType?: 'none' | 'color' | 'image';
  bannerValue?: string;
}
