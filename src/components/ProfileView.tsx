import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile, BookReview } from '../types';
import { TRANSLATIONS, Language } from '../translations';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface ProfileViewProps {
  profile: UserProfile;
  reviews: BookReview[];
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  language: Language;
  onImportReviews?: (imported: BookReview[]) => void;
}

const FLAG_ICONS: Record<Language, React.ReactNode> = {
  pt: (
    <svg className="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs shrink-0" viewBox="0 0 720 504">
      <rect width="720" height="504" fill="#009b3a"/>
      <polygon points="360,54 666,252 360,450 54,252" fill="#fedf00"/>
      <circle cx="360" cy="252" r="126" fill="#002776"/>
    </svg>
  ),
  en: (
    <svg className="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs shrink-0" viewBox="0 0 741 390">
      <rect width="741" height="390" fill="#b22234"/>
      <path d="M0,60H741M0,120H741M0,180H741M0,240H741M0,300H741M0,360H741" stroke="#ffffff" strokeWidth="30"/>
      <rect width="296" height="210" fill="#3c3b6e"/>
    </svg>
  ),
  es: (
    <svg className="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs shrink-0" viewBox="0 0 750 500">
      <rect width="750" height="500" fill="#aa151b"/>
      <rect width="750" height="250" y="125" fill="#f1bf00"/>
    </svg>
  )
};

const PRESET_AVATARS = [
  {
    name: 'Brenda',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWSCBTmJ0FIqYZ8VMlJNPdHE-RXTMApphYBjKCKzCOlf83ltyOtqj00E8v-nWIjIZA11QyELPx-KQiyiPPQPoYzs9VfvxDtxYFlgjxdUK2W72kkat0qC0SKOd_lN63L3WIbCa8872fQx06VI_XTL3B88iDUhdJjMSJo8CCbOlVsEK8_dTxl74tk7mEYC_zVaWa7ykTfSf1jyxgfJgDW96Q5OdSc376BRxgMA7GSrnPxpS1YsAHR1KcTb9LePZvhtrbUSzvUTyZeZwA'
  },
  {
    name: 'Clássico',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Leitora Violeta',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Estudante',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Aventureira',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pensador',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fantasia',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  }
];

const PRESET_BANNER_COLORS = [
  { name: 'Lilás', nameEn: 'Lilac', nameEs: 'Lila', value: '#bf6fe5' },
  { name: 'Vinho', nameEn: 'Wine', nameEs: 'Vino', value: '#501b3c' },
  { name: 'Oceano', nameEn: 'Ocean', nameEs: 'Océano', value: '#1a4c6e' },
  { name: 'Esmeralda', nameEn: 'Emerald', nameEs: 'Esmeralda', value: '#1a5c3e' },
  { name: 'Slate', nameEn: 'Slate', nameEs: 'Slate', value: '#374151' },
  { name: 'Ouro', nameEn: 'Gold', nameEs: 'Oro', value: '#b58b09' },
  { name: 'Sunset', nameEn: 'Sunset', nameEs: 'Sunset', value: '#b83b1d' }
];

const PRESET_BANNER_IMAGES = [
  { name: 'Biblioteca', nameEn: 'Library', nameEs: 'Biblioteca', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop' },
  { name: 'Páginas', nameEn: 'Pages', nameEs: 'Páginas', url: 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Escritório', nameEn: 'Office', nameEs: 'Oficina', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop' },
  { name: 'Espaço', nameEn: 'Space', nameEs: 'Espacio', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop' },
  { name: 'Aquarela', nameEn: 'Watercolor', nameEs: 'Acuarela', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop' }
];

const BANNER_REG = {
  pt: {
    SECTION_TITLE: "Banner de Fundo do Perfil",
    TYPE_LABEL: "Estilo do Banner:",
    TYPE_NONE: "Sem Banner (Cor tradicional)",
    TYPE_COLOR: "Cor Sólida",
    TYPE_IMAGE: "Foto ou Imagem",
    SOLID_HEX_LABEL: "Tom de Cor / Código Hex:",
    PHOTO_URL_LABEL: "Cole o link (URL) da imagem desejada:",
    PHOTO_UPLOAD_LABEL: "Ou envie um arquivo do seu aparelho:",
    PRESET_COLORS: "Paleta de Cores Recomendadas",
    PRESET_PHOTOS: "Biblioteca de Sugestões Gratuitas",
    APPLY_LABEL: "Aplicar Link",
    CHOOSE_FILE_LABEL: "Adicionar Foto"
  },
  en: {
    SECTION_TITLE: "Profile Background Banner",
    TYPE_LABEL: "Banner Style:",
    TYPE_NONE: "No Banner (Traditional theme)",
    TYPE_COLOR: "Solid Color",
    TYPE_IMAGE: "Picture or Photo",
    SOLID_HEX_LABEL: "Color Tone / Hex Code:",
    PHOTO_URL_LABEL: "Paste background image link (URL):",
    PHOTO_UPLOAD_LABEL: "Or upload a file from your device:",
    PRESET_COLORS: "Recommended Dynamic Colors",
    PRESET_PHOTOS: "Free Background Suggestions",
    APPLY_LABEL: "Apply Link",
    CHOOSE_FILE_LABEL: "Upload Picture"
  },
  es: {
    SECTION_TITLE: "Banner de Fondo de Perfil",
    TYPE_LABEL: "Estilo del Banner:",
    TYPE_NONE: "Sin Banner (Color tradicional)",
    TYPE_COLOR: "Color Sólido",
    TYPE_IMAGE: "Foto o Imagen",
    SOLID_HEX_LABEL: "Tono de Color / Código Hex:",
    PHOTO_URL_LABEL: "Pega el enlace (URL) de la imagen:",
    PHOTO_UPLOAD_LABEL: "O sube un archivo de tu dispositivo:",
    PRESET_COLORS: "Paleta de Colores Recomendados",
    PRESET_PHOTOS: "Sugerencias de Fondos Gratis",
    APPLY_LABEL: "Aplicar Enlace",
    CHOOSE_FILE_LABEL: "Subir Foto"
  }
};

export default function ProfileView({
  profile,
  reviews,
  onLogout,
  onUpdateProfile,
  language,
  onImportReviews
}: ProfileViewProps) {
  const isAdmin = profile.email?.toLowerCase() === 'brendaernesto27@gmail.com';
  const t = TRANSLATIONS[language];

  // Visit statistics for admin
  const [visitStats, setVisitStats] = useState<{ date: string; count: number }[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchVisits = async () => {
      setLoadingVisits(true);
      setStatsError(null);
      try {
        const visitsSnap = await getDocs(collection(db, 'visits'));
        const list: { date: string; count: number }[] = [];
        visitsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            date: docSnap.id,
            count: typeof data.count === 'number' ? data.count : 0
          });
        });
        list.sort((a, b) => b.date.localeCompare(a.date));
        setVisitStats(list);
      } catch (err) {
        console.error("Error loading visits:", err);
        setStatsError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingVisits(false);
      }
    };
    fetchVisits();
  }, [isAdmin]);

  const handleSendReportEmail = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const subject = encodeURIComponent(`📊 Relatório Diário de Acessos - Bookshelf (${todayStr})`);
    let reportBody = `Olá Brenda!\n\nAqui está o relatório consolidado de acessos diários do seu aplicativo Bookshelf.\n\n`;
    reportBody += `Histórico de Acessos Recentes:\n--------------------------------------------------\n`;
    if (visitStats.length === 0) {
      reportBody += `Nenhum acesso registrado ainda ou carregando dados...\n`;
    } else {
      visitStats.slice(0, 15).forEach((stat) => {
        const [yr, mo, dy] = stat.date.split('-');
        const formattedDate = yr && mo && dy ? `${dy}/${mo}/${yr}` : stat.date;
        reportBody += `📅 Data: ${formattedDate} | 👥 Acessos Únicos: ${stat.count}\n`;
      });
    }
    reportBody += `--------------------------------------------------\n`;
    reportBody += `Total acumulado monitorado: ${visitStats.reduce((acc, curr) => acc + curr.count, 0)} acessos.\n\nAtenciosamente,\nBookshelf 💜`;
    const body = encodeURIComponent(reportBody);
    window.location.href = `mailto:brendaernesto27@gmail.com?subject=${subject}&body=${body}`;
  };

  // Edit fields state
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);
  const [editBannerType, setEditBannerType] = useState<'none' | 'color' | 'image'>(profile.bannerType || 'none');
  const [editBannerValue, setEditBannerValue] = useState(profile.bannerValue || '');
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  // 6.2 Reading Goals State
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('bookshelf_goal');
    return saved ? parseInt(saved, 10) : 12;
  });
  const [dailyPagesGoal, setDailyPagesGoal] = useState(() => {
    const saved = localStorage.getItem('bookshelf_daily_pages_goal');
    return saved ? parseInt(saved, 10) : 20;
  });
  const [readingStreak, setReadingStreak] = useState(() => {
    const saved = localStorage.getItem('bookshelf_reading_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // 6.3 Level Modal State
  const [showLevelModal, setShowLevelModal] = useState(false);

  // 6.5 Data Export / Import State
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<BookReview[] | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg(null), 3800);
  };

  // Handle Escape key to close open modals (WCAG AA 2.1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showLevelModal) setShowLevelModal(false);
        if (isImportConfirmOpen) {
          setIsImportConfirmOpen(false);
          setPendingImportData(null);
        }
        if (confirmingLogout) setConfirmingLogout(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLevelModal, isImportConfirmOpen, confirmingLogout]);

  // Quotes count
  const [quotesCount, setQuotesCount] = useState(() => {
    try {
      const saved = localStorage.getItem('bookshelf_quotes');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  useEffect(() => {
    if (!profile.uid) return;
    const fetchQuotesCount = async () => {
      try {
        const snap = await getDocs(collection(db, `users/${profile.uid}/quotes`));
        setQuotesCount(snap.size);
      } catch (err) {
        console.warn("Could not retrieve quotes count from Firestore:", err);
      }
    };
    fetchQuotesCount();
  }, [profile.uid]);

  // 6.1 Statistics calculations
  const totalReviews = reviews.length;
  const readingCount = reviews.filter((r) => r.status === 'LENDO').length;
  const finishedCount = reviews.filter((r) => r.status === 'CONCLUÍDO').length;
  const pausedCount = reviews.filter((r) => r.status === 'PAUSADO').length;
  const favoritesCount = reviews.filter((r) => r.isFavorite).length;

  const totalPagesRead = useMemo(() => {
    return reviews.reduce((sum, r) => {
      if (typeof r.pagesRead === 'number' && r.pagesRead > 0) {
        return sum + r.pagesRead;
      }
      if (r.status === 'CONCLUÍDO') {
        return sum + (r.totalPages || 250);
      }
      return sum;
    }, 0);
  }, [reviews]);

  const avgRating = useMemo(() => {
    const rated = reviews.filter((r) => typeof r.rating === 'number' && r.rating > 0);
    if (rated.length === 0) return '—';
    const sum = rated.reduce((acc, r) => acc + r.rating, 0);
    return (sum / rated.length).toFixed(1);
  }, [reviews]);

  const topGenres = useMemo(() => {
    const counts: Record<string, number> = {};
    reviews.forEach((r) => {
      if (Array.isArray(r.tags)) {
        r.tags.forEach((tag) => {
          const clean = tag.trim().replace(/^#/, '');
          if (clean) {
            counts[clean] = (counts[clean] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [reviews]);

  // 6.2 Goal updates
  const handleUpdateGoal = (num: number) => {
    const newGoal = Math.max(1, goal + num);
    setGoal(newGoal);
    localStorage.setItem('bookshelf_goal', newGoal.toString());
  };

  const handleUpdateDailyPages = (num: number) => {
    const newDaily = Math.max(5, dailyPagesGoal + num);
    setDailyPagesGoal(newDaily);
    localStorage.setItem('bookshelf_daily_pages_goal', newDaily.toString());
  };

  const progressPercent = Math.min(100, Math.round((finishedCount / goal) * 100));

  // 6.3 Level System calculation
  // Baseline for Level 4 = 1200 XP. Level 5 target = 2000 XP.
  const detailedReviewsCount = reviews.filter((r) => r.reviewText && r.reviewText.trim().length > 20).length;
  const currentXp = 1200 + (finishedCount * 100) + (detailedReviewsCount * 40) + (quotesCount * 25) + (favoritesCount * 15);
  const nextLevelXp = 2000;
  const xpInCurrentTier = currentXp - 1200;
  const xpNeededInTier = nextLevelXp - 1200;
  const xpProgressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentTier / xpNeededInTier) * 100)));

  // 6.4 Monthly finished books for current year
  const currentYear = new Date().getFullYear();
  const monthlyFinished = useMemo(() => {
    const counts = Array(12).fill(0);
    reviews
      .filter((r) => r.status === 'CONCLUÍDO')
      .forEach((r) => {
        if (r.createdAt) {
          const d = new Date(r.createdAt);
          if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
            counts[d.getMonth()] += 1;
          }
        }
      });
    return counts;
  }, [reviews, currentYear]);

  const maxMonthValue = Math.max(1, ...monthlyFinished);
  const totalFinishedYear = monthlyFinished.reduce((a, b) => a + b, 0);

  // 6.5 Export & Import
  const handleExportJson = () => {
    try {
      const backupData = {
        version: 1,
        appName: 'Bookshelf',
        exportedAt: new Date().toISOString(),
        user: profile,
        readingGoal: goal,
        dailyPagesGoal,
        reviewsCount: reviews.length,
        reviews
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookshelf_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`${t.EXPORT_JSON}: OK!`);
    } catch (e) {
      console.error("Export JSON failed:", e);
      showToast(t.TOAST_SAVED_ERROR, true);
    }
  };

  const handleExportCsv = () => {
    try {
      const headers = ['ID', 'Title', 'Author', 'Status', 'Rating', 'PagesRead', 'TotalPages', 'Tags', 'IsFavorite', 'CreatedAt'];
      const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
      const rows = reviews.map((r) => [
        escapeCsv(r.id),
        escapeCsv(r.title || ''),
        escapeCsv(r.author || ''),
        escapeCsv(r.status || ''),
        r.rating || 0,
        r.pagesRead || 0,
        r.totalPages || 0,
        escapeCsv((r.tags || []).join(', ')),
        r.isFavorite ? 'SIM' : 'NAO',
        escapeCsv(r.createdAt || '')
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookshelf_livros_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`${t.EXPORT_CSV}: OK!`);
    } catch (e) {
      console.error("Export CSV failed:", e);
      showToast(t.TOAST_SAVED_ERROR, true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      try {
        const text = uploadEvent.target?.result as string;
        const parsed = JSON.parse(text);
        let items: BookReview[] | null = null;
        if (Array.isArray(parsed)) {
          items = parsed;
        } else if (parsed && Array.isArray(parsed.reviews)) {
          items = parsed.reviews;
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
          showToast(t.IMPORT_ERROR, true);
          return;
        }

        // Validate basic review item structure
        const isValid = items.every(
          (it) => it && typeof it === 'object' && typeof it.title === 'string'
        );
        if (!isValid) {
          showToast(t.IMPORT_ERROR, true);
          return;
        }

        setPendingImportData(items);
        setIsImportConfirmOpen(true);
      } catch (err) {
        console.error("Failed to parse import JSON:", err);
        showToast(t.IMPORT_ERROR, true);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;
    if (onImportReviews) {
      onImportReviews(pendingImportData);
    } else {
      localStorage.setItem('bookshelf_reviews', JSON.stringify(pendingImportData));
    }
    setIsImportConfirmOpen(false);
    setPendingImportData(null);
    showToast(t.IMPORT_SUCCESS);
  };

  // Avatar upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setEditAvatarUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast(t.NAME_EMPTY_ALERT, true);
      return;
    }
    onUpdateProfile({
      ...profile,
      name: editName.trim(),
      avatarUrl: editAvatarUrl,
      bannerType: editBannerType,
      bannerValue: editBannerValue
    });
    setIsEditing(false);
    setShowPresets(false);
    setShowUrlInput(false);
  };

  const changeLanguage = (lang: Language) => {
    onUpdateProfile({
      ...profile,
      language: lang
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-32 space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`fixed top-5 right-5 z-[120] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border animate-in slide-in-from-top duration-200 ${
            toastMsg.isError
              ? 'bg-error/90 text-on-error border-error/50'
              : 'bg-primary/95 text-on-primary border-[#bf6fe5]/40 backdrop-blur-md'
          }`}
        >
          <span className="material-symbols-outlined notranslate text-sm" translate="no">
            {toastMsg.isError ? 'error' : 'check_circle'}
          </span>
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* 6.3 Level Modal */}
      {showLevelModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowLevelModal(false)}
        >
          <div
            className="bg-surface-container-high border border-primary/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative glow */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#bf6fe5]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined notranslate text-xl" translate="no">
                    military_tech
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-on-surface">
                    {t.LEVEL_MODAL_TITLE}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant font-mono">
                    {t.LEVEL}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLevelModal(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                title={t.CLOSE_MODAL}
                aria-label={t.CLOSE_MODAL}
              >
                <span className="material-symbols-outlined notranslate text-lg" translate="no">
                  close
                </span>
              </button>
            </div>

            {/* Current XP & Progress Card */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 space-y-3 relative z-10">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    {t.CURRENT_XP}
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#f5dbff] text-shadow-sm">
                    {currentXp.toLocaleString()} XP
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant block font-mono">
                    {t.XP_TO_NEXT_LEVEL} 5
                  </span>
                  <span className="text-xs font-bold text-primary font-mono">
                    {nextLevelXp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden border border-outline-variant/15 p-0.5">
                  <div
                    className="bg-gradient-to-r from-primary to-[#bf6fe5] h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-on-surface-variant/80 px-0.5">
                  <span>{xpProgressPercent}% {t.GOAL_COMPLETED.toLowerCase()}</span>
                  <span>{(nextLevelXp - currentXp).toLocaleString()} XP restantes</span>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed pt-1 border-t border-outline-variant/10 italic">
                {t.ELITE_READER_DESC}
              </p>
            </div>

            {/* How to Earn XP */}
            <div className="space-y-2.5 relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb9ed] flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-sm text-primary" translate="no">
                  bolt
                </span>
                {t.HOW_TO_EARN_XP}
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-emerald-400 text-base" translate="no">
                      check_circle
                    </span>
                    <span className="text-on-surface font-medium">{t.XP_FINISH_BOOK}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-primary">+100 XP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#bf6fe5] text-base" translate="no">
                      rate_review
                    </span>
                    <span className="text-on-surface font-medium">{t.XP_WRITE_REVIEW}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-primary">+40 XP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-amber-400 text-base" translate="no">
                      format_quote
                    </span>
                    <span className="text-on-surface font-medium">{t.XP_SAVE_QUOTE}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-primary">+25 XP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-pink-400 text-base" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                    <span className="text-on-surface font-medium">{t.XP_FAVORITE_BOOK}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-primary">+15 XP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-orange-400 text-base" translate="no">
                      local_fire_department
                    </span>
                    <span className="text-on-surface font-medium">{t.XP_MAINTAIN_GOAL}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-primary">+10 XP</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLevelModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {t.CLOSE}
            </button>
          </div>
        </div>
      )}

      {/* 6.5 Import Confirmation Modal */}
      {isImportConfirmOpen && pendingImportData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImportConfirmOpen(false)}
        >
          <div
            className="bg-surface-container-high border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <span className="material-symbols-outlined notranslate text-2xl" translate="no">
                  warning
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-on-surface">
                  {t.CONFIRM_IMPORT_TITLE}
                </h3>
                <p className="text-[11px] text-amber-300/90 font-mono">
                  {pendingImportData.length} {t.TOTAL_BOOKS.toLowerCase()} identificados
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t.CONFIRM_IMPORT_MSG}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsImportConfirmOpen(false);
                  setPendingImportData(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors cursor-pointer"
              >
                {t.CANCEL}
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {t.CONFIRM_IMPORT_BUTTON}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for backup restoration */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card, Reading Statistics (6.1), Logout */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {/* Profile Header card & Editor block */}
          <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 relative overflow-hidden shadow-lg transition-all duration-300">
            {!isEditing ? (
              <div className="relative min-h-[220px] flex flex-col justify-center overflow-hidden">
                {profile.bannerType && profile.bannerType !== 'none' ? (
                  <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
                    {profile.bannerType === 'color' ? (
                      <div
                        className="w-full h-full transition-colors duration-500"
                        style={{ backgroundColor: profile.bannerValue || '#231e25' }}
                      />
                    ) : (
                      <img
                        src={profile.bannerValue || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop'}
                        alt="Banner"
                        className="w-full h-full object-cover animate-fadeIn transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/45 to-surface" />
                  </div>
                ) : (
                  <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none bg-gradient-to-br from-[#bf6fe5]/5 via-transparent to-[#bf6fe5]/10" />
                )}

                <div className="flex flex-col items-center text-center relative p-8 z-10 w-full">
                  <button
                    onClick={() => {
                      setEditName(profile.name);
                      setEditAvatarUrl(profile.avatarUrl);
                      setEditBannerType(profile.bannerType || 'none');
                      setEditBannerValue(profile.bannerValue || '');
                      setIsEditing(true);
                    }}
                    className="absolute top-4 right-4 bg-black/40 backdrop-blur-md hover:bg-black/65 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 z-25 border border-white/10"
                    title={t.EDIT_PROFILE}
                  >
                    <span className="material-symbols-outlined notranslate text-[13px]" translate="no">edit</span>
                    {t.EDIT_PROFILE}
                  </button>

                  <div className="border-4 border-[#bf6fe5]/40 shadow-xl z-10 w-24 h-24 rounded-full bg-surface-container overflow-hidden flex items-center justify-center transition-all hover:scale-105 duration-300">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    <h2 className="font-serif text-xl font-bold text-on-surface drop-shadow-sm flex items-center gap-1">
                      <span>{profile.name}</span>
                    </h2>
                    <span
                      className="material-symbols-outlined notranslate text-[#bf6fe5] text-lg select-none shrink-0"
                      title={language === 'pt' ? 'Leitor(a) Verificado(a)' : language === 'es' ? 'Lector(a) Verificado(a)' : 'Verified Reader'}
                      translate="no"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-mono mt-1 drop-shadow-xs">{profile.email}</p>

                  {/* 6.3 Interactive Level Badge Button */}
                  <button
                    type="button"
                    onClick={() => setShowLevelModal(true)}
                    className="group bg-[#bf6fe5]/25 hover:bg-[#bf6fe5]/40 text-[#f5dbff] text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full mt-4 border border-[#bf6fe5]/40 transition-all cursor-pointer shadow-sm backdrop-blur-sm flex items-center gap-1.5 active:scale-95"
                    title="Clique para ver seu XP e detalhes do nível"
                  >
                    <span className="material-symbols-outlined notranslate text-xs text-[#e9b3ff] group-hover:rotate-12 transition-transform" translate="no">
                      military_tech
                    </span>
                    <span>{t.LEVEL}</span>
                    <span className="material-symbols-outlined notranslate text-[12px] opacity-70 group-hover:translate-x-0.5 transition-transform" translate="no">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 p-6 animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/15">
                  <h3 className="font-serif text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">manage_accounts</span>
                    {t.CUSTOMIZE_SHELF}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowPresets(false);
                      setShowUrlInput(false);
                    }}
                    className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    title={t.CANCEL}
                  >
                    <span className="material-symbols-outlined notranslate text-base" translate="no">close</span>
                  </button>
                </div>

                {/* Photo edit layouts */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-surface border-2 border-primary overflow-hidden shadow-inner flex items-center justify-center relative">
                    <img
                      src={editAvatarUrl}
                      alt="Edit preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <label className="bg-primary text-on-primary hover:bg-primary-container hover:scale-[1.01] transition-all px-3 py-1.5 rounded-xl text-center text-[10px] font-semibold cursor-pointer shadow-sm active:scale-95 flex items-center gap-1">
                      <span className="material-symbols-outlined notranslate text-xs" translate="no">upload</span>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPresets(!showPresets);
                        setShowUrlInput(false);
                      }}
                      className="bg-surface-container hover:bg-surface-container-high transition-colors text-[#dfb9ed] border border-[#dfb9ed]/20 px-3 py-1.5 rounded-xl text-[10px] font-medium cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined notranslate text-xs" translate="no">palette</span>
                      Presets
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUrlInput(!showUrlInput);
                        setShowPresets(false);
                        setTempUrl(editAvatarUrl.startsWith('data:') ? '' : editAvatarUrl);
                      }}
                      className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-on-surface border border-outline-variant/30 px-3 py-1.5 rounded-xl text-[10px] font-medium cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined notranslate text-xs" translate="no">link</span>
                      {language === 'pt' ? 'Inserir Link' : language === 'es' ? 'Insertar Enlace' : 'Insert Link'}
                    </button>
                  </div>

                  {showPresets && (
                    <div className="w-full bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 animate-fadeIn">
                      <p className="text-[10px] uppercase font-bold text-primary mb-2 text-center tracking-wider">
                        {language === 'pt' ? 'Escolha uma Ilustração' : language === 'es' ? 'Elige una Ilustración' : 'Choose an Illustration'}:
                      </p>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {PRESET_AVATARS.map((p, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setEditAvatarUrl(p.url);
                              setShowPresets(false);
                            }}
                            className="flex-shrink-0 relative w-12 h-12 rounded-full overflow-hidden border-2 border-outline-variant/30 hover:border-primary transition-all hover:scale-105"
                          >
                            <img
                              src={p.url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showUrlInput && (
                    <div className="w-full flex gap-1.5 animate-fadeIn">
                      <input
                        type="text"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-surface-container border border-outline-variant/40 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempUrl.trim()) {
                            setEditAvatarUrl(tempUrl.trim());
                            setShowUrlInput(false);
                          }
                        }}
                        className="bg-primary text-on-primary px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer active:scale-95"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>

                {/* Banner Style Selection */}
                <div className="pt-2 border-t border-outline-variant/15 space-y-2.5">
                  <span className="text-[11px] font-bold text-primary block">
                    {BANNER_REG[language].SECTION_TITLE}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['none', 'color', 'image'] as const).map((bType) => (
                      <button
                        key={bType}
                        type="button"
                        onClick={() => setEditBannerType(bType)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all text-center border ${
                          editBannerType === bType
                            ? 'bg-primary/20 text-white border-primary shadow-xs'
                            : 'bg-surface-container text-on-surface-variant hover:text-white border-outline-variant/20'
                        }`}
                      >
                        {bType === 'none' ? BANNER_REG[language].TYPE_NONE : bType === 'color' ? BANNER_REG[language].TYPE_COLOR : BANNER_REG[language].TYPE_IMAGE}
                      </button>
                    ))}
                  </div>

                  {editBannerType === 'color' && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {PRESET_BANNER_COLORS.map((col, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditBannerValue(col.value)}
                          className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform hover:scale-110 ${
                            editBannerValue === col.value ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: col.value }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  )}

                  {editBannerType === 'image' && (
                    <div className="space-y-2 pt-1 animate-fadeIn">
                      <input
                        type="text"
                        value={editBannerValue.startsWith('data:') ? '' : editBannerValue}
                        onChange={(e) => setEditBannerValue(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      />
                      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {PRESET_BANNER_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditBannerValue(img.url)}
                            className="flex-shrink-0 relative w-16 h-10 rounded-lg overflow-hidden border border-outline-variant/20 hover:border-primary/50"
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Name Input Box */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-primary pl-0.5" htmlFor="name-input">
                    {t.YOUR_NAME}
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Ex: Brenda Ernesto"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowPresets(false);
                      setShowUrlInput(false);
                    }}
                    className="flex-1 bg-surface-container-high hover:bg-surface-container-highest py-2 rounded-xl text-[11px] font-bold text-center cursor-pointer text-on-surface"
                  >
                    {t.CANCEL}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-container text-on-primary py-2 rounded-xl text-[11px] font-bold text-center cursor-pointer shadow-md"
                  >
                    {t.SAVE_CHANGES}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* 6.1 Seção de Estatísticas de Leitura Completa */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-sm text-primary" translate="no">
                query_stats
              </span>
              {t.METRICS_TITLE}
            </h3>

            {/* Grid 2x3 de estatísticas principais */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Total de Livros */}
              <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 text-center">
                <span className="material-symbols-outlined notranslate text-primary text-xl" translate="no">
                  auto_stories
                </span>
                <p className="text-xl font-bold font-serif text-on-surface mt-1">{totalReviews}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {t.TOTAL_BOOKS}
                </p>
              </div>

              {/* 2. Livros Terminados */}
              <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 text-center">
                <span className="material-symbols-outlined notranslate text-emerald-400 text-xl" translate="no">
                  task_alt
                </span>
                <p className="text-xl font-bold font-serif text-[#dfb9ed] mt-1">{finishedCount}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {t.FINISHED}
                </p>
              </div>

              {/* 3. Páginas Lidas */}
              <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 text-center">
                <span className="material-symbols-outlined notranslate text-[#bf6fe5] text-xl" translate="no">
                  menu_book
                </span>
                <p className="text-xl font-bold font-serif text-[#f5dbff] mt-1">
                  {totalPagesRead.toLocaleString()}
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {t.PAGES_READ}
                </p>
              </div>

              {/* 4. Média das Notas */}
              <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 text-center">
                <span className="material-symbols-outlined notranslate text-amber-400 text-xl" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <p className="text-xl font-bold font-serif text-amber-200 mt-1">
                  {avgRating} {avgRating !== '—' && <span className="text-xs text-on-surface-variant/70 font-mono">/ 5</span>}
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {t.AVG_RATING}
                </p>
              </div>

              {/* 5. Streak de Dias Lendo */}
              <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 text-center col-span-2 sm:col-span-1">
                <span className="material-symbols-outlined notranslate text-orange-400 text-xl" translate="no">
                  local_fire_department
                </span>
                <p className="text-xl font-bold font-serif text-orange-200 mt-1">
                  {readingStreak} <span className="text-xs font-mono text-on-surface-variant">{t.DAYS_LABEL}</span>
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {t.READING_STREAK}
                </p>
              </div>

              {/* 6. Livros Lendo Agora */}
              <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 text-center col-span-2 sm:col-span-1">
                <span className="material-symbols-outlined notranslate text-[#ffb1c8] text-xl" translate="no">
                  bookmark
                </span>
                <p className="text-xl font-bold font-serif text-[#ffb1c8] mt-1">{readingCount}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {t.READING_NOW}
                </p>
              </div>
            </div>

            {/* Gêneros / Tags mais lidos */}
            <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20 space-y-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined notranslate text-xs text-primary" translate="no">
                  tag
                </span>
                {t.TOP_GENRES}
              </span>
              {topGenres.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {topGenres.map(([tagName, count], idx) => (
                    <span
                      key={idx}
                      className="bg-primary/15 hover:bg-primary/25 border border-primary/30 text-[#e9b3ff] px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>#{tagName}</span>
                      <span className="text-[10px] bg-primary/30 px-1.5 py-0.2 rounded-md font-mono text-white/90">
                        {count}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant/70 italic">
                  {t.NO_GENRES_YET}
                </p>
              )}
            </div>
          </section>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (!confirmingLogout) {
                setConfirmingLogout(true);
                setTimeout(() => setConfirmingLogout(false), 4500);
              } else {
                onLogout();
              }
            }}
            className={`w-full py-3 rounded-2xl transition-all font-bold text-center text-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer min-h-[44px] ${
              confirmingLogout
                ? 'bg-red-600/90 text-white border border-red-500 hover:bg-red-700/90'
                : 'hover:bg-error/15 text-error border border-error/30'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[16px]" translate="no">
              {confirmingLogout ? 'priority_high' : 'logout'}
            </span>
            {confirmingLogout ? t.LOGOUT_CONFIRM : t.LOGOUT_BUTTON}
          </button>
        </div>

        {/* Right Column: Reading Goals (6.2), Monthly Chart (6.4), Data (6.5), Theme, Language, Admin */}
        <div className="lg:col-span-7 space-y-6">
          {/* 6.2 Metas de Leitura (Meta anual e meta diária de páginas) */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/10">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-sm text-[#bf6fe5]" translate="no">
                  flag
                </span>
                {t.ANNUAL_GOAL}
              </h4>
              <span className="text-[10px] font-mono text-on-surface-variant/80">
                {currentYear}
              </span>
            </div>

            {/* Meta Anual de Livros */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-on-surface">Meta de Livros Lidos</p>
                  <p className="text-[11px] text-on-surface-variant italic">{t.ANNUAL_GOAL_SUB}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateGoal(-1)}
                    className="bg-surface-container hover:bg-surface-container-high h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform text-on-surface"
                    title="-1 livro"
                  >
                    -
                  </button>
                  <span className="font-serif text-sm font-bold text-on-surface min-w-[60px] text-center">
                    {goal} {t.BOOKS_GOAL_LABEL}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateGoal(1)}
                    className="bg-surface-container hover:bg-surface-container-high h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform text-on-surface"
                    title="+1 livro"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Annual Progress Meter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant pl-0.5">
                  <span>{t.PROGRESS_GOAL}:</span>
                  <span className="text-primary font-bold">
                    {finishedCount} {language === 'pt' ? 'de' : language === 'es' ? 'de' : 'of'} {goal} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden border border-outline-variant/15 p-0.5">
                  <div
                    className="bg-gradient-to-r from-primary-container via-[#bf6fe5] to-primary h-full rounded-full transition-all duration-1000 shadow-xs"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Meta Diária de Páginas (Opcional, com controles rápidos) */}
            <div className="pt-3 border-t border-outline-variant/10 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined notranslate text-xs text-orange-400" translate="no">
                      local_fire_department
                    </span>
                    {t.DAILY_PAGES_GOAL}
                  </p>
                  <p className="text-[11px] text-on-surface-variant italic">
                    Cultive o hábito diário de leitura
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateDailyPages(-5)}
                    className="bg-surface-container hover:bg-surface-container-high h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform text-on-surface"
                    title="-5 páginas"
                  >
                    -
                  </button>
                  <span className="font-serif text-sm font-bold text-orange-200 min-w-[70px] text-center font-mono">
                    {dailyPagesGoal} {t.PAGES_PER_DAY}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateDailyPages(5)}
                    className="bg-surface-container hover:bg-surface-container-high h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform text-on-surface"
                    title="+5 páginas"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6.4 Gráfico de Barras de Livros Terminados por Mês no Ano Atual (SVG Puro) */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined notranslate text-sm text-[#bf6fe5]" translate="no">
                    bar_chart
                  </span>
                  {t.MONTHLY_CHART_TITLE}
                </h4>
                <p className="text-[11px] text-on-surface-variant italic">
                  {t.MONTHLY_CHART_SUB} ({currentYear})
                </p>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/15 border border-primary/25 px-2.5 py-1 rounded-lg font-mono">
                {totalFinishedYear} {t.FINISHED.toLowerCase()}
              </span>
            </div>

            {/* Pure SVG Bar Chart */}
            <div className="w-full pt-2">
              <svg
                viewBox="0 0 480 180"
                className="w-full h-auto overflow-visible select-none"
                style={{ maxHeight: '200px' }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#bf6fe5" />
                    <stop offset="100%" stopColor="#510073" />
                  </linearGradient>
                  <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e9b3ff" />
                    <stop offset="100%" stopColor="#871baf" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="20" y1="30" x2="465" y2="30" stroke="#bf6fe5" strokeOpacity="0.12" strokeDasharray="3 3" />
                <line x1="20" y1="80" x2="465" y2="80" stroke="#bf6fe5" strokeOpacity="0.12" strokeDasharray="3 3" />
                <line x1="20" y1="130" x2="465" y2="130" stroke="#bf6fe5" strokeOpacity="0.18" />

                {/* 12 Month Bars */}
                {monthlyFinished.map((count, index) => {
                  const barWidth = 24;
                  const x = 30 + index * 36;
                  const maxHeight = 95;
                  const barHeight = count > 0 ? Math.max(12, (count / maxMonthValue) * maxHeight) : 3;
                  const y = 130 - barHeight;
                  const isCurrentMonth = index === new Date().getMonth();
                  const monthName = t.MONTH_NAMES_SHORT[index] || `M${index + 1}`;

                  return (
                    <g key={index} className="transition-all duration-300">
                      {/* Bar rectangle */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="4"
                        fill={count > 0 ? (isCurrentMonth ? "url(#activeBarGradient)" : "url(#barGradient)") : "#322736"}
                        opacity={count > 0 ? 0.95 : 0.4}
                        className="hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <title>{`${monthName}: ${count} ${language === 'pt' ? 'livros' : 'books'}`}</title>
                      </rect>

                      {/* Number badge on top if count > 0 */}
                      {count > 0 && (
                        <text
                          x={x + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fill="#f5dbff"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {count}
                        </text>
                      )}

                      {/* Month label along bottom */}
                      <text
                        x={x + barWidth / 2}
                        y="152"
                        textAnchor="middle"
                        fill={isCurrentMonth ? "#e9b3ff" : "#9e8b9f"}
                        fontSize="9.5"
                        fontWeight={isCurrentMonth ? "bold" : "normal"}
                      >
                        {monthName}
                      </text>

                      {/* Active indicator dot under current month */}
                      {isCurrentMonth && (
                        <circle
                          cx={x + barWidth / 2}
                          cy="164"
                          r="2"
                          fill="#bf6fe5"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* 6.5 Seção "Dados" (Exportar JSON, Exportar CSV e Importar Backup) */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-3.5 shadow-sm">
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-sm text-[#bf6fe5]" translate="no">
                  cloud_sync
                </span>
                {t.DATA_SECTION_TITLE}
              </h4>
              <p className="text-[11px] text-on-surface-variant italic mt-0.5">
                {t.DATA_SECTION_SUB}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* 1. Exportar JSON */}
              <button
                type="button"
                onClick={handleExportJson}
                className="py-3 px-3 rounded-xl border border-primary/30 bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex flex-col items-center gap-1.5 text-center cursor-pointer active:scale-95 group shadow-xs"
                title="Exportar arquivo completo JSON com configurações e avaliações"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-[#e9b3ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined notranslate text-base" translate="no">
                    data_object
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#f5dbff]">
                  {t.EXPORT_JSON}
                </span>
                <span className="text-[9px] text-on-surface-variant/70 font-mono">
                  .json completo
                </span>
              </button>

              {/* 2. Exportar CSV */}
              <button
                type="button"
                onClick={handleExportCsv}
                className="py-3 px-3 rounded-xl border border-emerald-500/30 bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex flex-col items-center gap-1.5 text-center cursor-pointer active:scale-95 group shadow-xs"
                title="Exportar tabela de livros em planilha CSV (Excel / Google Sheets)"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined notranslate text-base" translate="no">
                    table_chart
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-200">
                  {t.EXPORT_CSV}
                </span>
                <span className="text-[9px] text-on-surface-variant/70 font-mono">
                  Planilha .csv
                </span>
              </button>

              {/* 3. Importar Backup */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-3 rounded-xl border border-amber-500/30 bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex flex-col items-center gap-1.5 text-center cursor-pointer active:scale-95 group shadow-xs"
                title="Importar e restaurar dados de um arquivo JSON salvo anteriormente"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined notranslate text-base" translate="no">
                    upload_file
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-200">
                  {t.IMPORT_BACKUP}
                </span>
                <span className="text-[9px] text-on-surface-variant/70 font-mono">
                  Restaurar backup
                </span>
              </button>
            </div>
          </section>

          {/* Theme Selection */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] flex items-center gap-1.5 ml-0.5">
              <span className="material-symbols-outlined notranslate text-sm" translate="no">palette</span>
              {t.SELECT_THEME}
            </h3>
            <p className="text-[11px] text-on-surface-variant italic -mt-1 pl-1">
              {t.THEME_DESCRIPTION}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {(['dark', 'light'] as const).map((thm) => {
                const isSel = (profile?.theme || 'dark') === thm;
                return (
                  <button
                    key={thm}
                    type="button"
                    onClick={async () => {
                      if (profile) {
                        await onUpdateProfile({ ...profile, theme: thm });
                      }
                    }}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center gap-2 justify-center active:scale-95 cursor-pointer min-h-[44px] ${
                      isSel
                        ? 'bg-primary/20 hover:bg-primary/30 text-white border-[#bf6fe5] shadow-sm scale-[1.01]'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-white border-outline-variant/15'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base notranslate animate-fadeIn" translate="no">
                      {thm === 'dark' ? 'dark_mode' : 'light_mode'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">
                      {thm === 'dark' ? t.THEME_DARK : t.THEME_LIGHT}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Language Selection */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] flex items-center gap-1.5 ml-0.5">
              <span className="material-symbols-outlined notranslate text-sm" translate="no">language</span>
              {t.SELECT_LANGUAGE}
            </h3>
            <p className="text-[11px] text-on-surface-variant italic -mt-1 pl-1">
              {language === 'pt' ? 'Escolha o idioma preferido para a interface global e notificações.' : language === 'es' ? 'Selecciona el idioma preferido para la interfaz global y notificaciones.' : 'Select preferred language for global screens and alerts.'}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {(['pt', 'en', 'es'] as Language[]).map((lang) => {
                const isSel = language === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => changeLanguage(lang)}
                    className={`py-3 px-1 rounded-xl border text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1 justify-center active:scale-95 cursor-pointer min-h-[44px] ${
                      isSel
                        ? 'bg-primary/20 hover:bg-primary/30 text-white border-[#bf6fe5] shadow-sm scale-[1.01]'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-white border-outline-variant/15'
                    }`}
                  >
                    <div className="flex items-center justify-center h-4 mb-0.5">
                      {FLAG_ICONS[lang]}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider">
                      {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Literary Badges */}
          <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-sm" translate="no">stars</span>
              {t.LITERARY_BADGES}
            </h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined notranslate text-2xl text-primary bg-[#bf6fe5]/10 p-2 rounded-xl" translate="no">auto_stories</span>
                <div>
                  <p className="text-xs font-bold text-on-surface">{t.PIONEER}</p>
                  <p className="text-[10px] text-on-surface-variant">{t.PIONEER_SUB}</p>
                </div>
                <span className="material-symbols-outlined notranslate text-xs text-primary shrink-0 ml-auto" translate="no">check_circle</span>
              </div>

              <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined notranslate text-2xl text-primary bg-[#bf6fe5]/10 p-2 rounded-xl" translate="no">history_edu</span>
                <div>
                  <p className="text-xs font-bold text-on-surface">{t.CRITIC}</p>
                  <p className="text-[10px] text-on-surface-variant">
                    {t.CRITIC_SUB} {language === 'pt' ? '(Ou ao cadastrar 10 avaliações)' : language === 'es' ? '(O al registrar 10 reseñas)' : '(Or by saving 10 reviews)'}
                  </p>
                </div>
                {quotesCount > 0 || totalReviews >= 10 ? (
                  <span className="material-symbols-outlined notranslate text-xs text-primary shrink-0 ml-auto" translate="no">check_circle</span>
                ) : (
                  <span className="text-[9px] text-on-surface-variant/40 shrink-0 ml-auto italic">
                    {t.LOCKED} ({totalReviews}/10)
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Admin visit metrics panel */}
          {isAdmin && (
            <section className="bg-surface-container-low border border-[#bf6fe5]/40 p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined notranslate text-[#bf6fe5] text-2xl animate-pulse" translate="no">monitoring</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#ebdfea] tracking-wide uppercase">
                      {language === 'pt' ? 'Painel de Administração' : language === 'es' ? 'Panel de Administración' : 'Admin Panel'}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant font-mono">
                      {language === 'pt' ? 'Exclusivo para Brenda Ernesto' : language === 'es' ? 'Exclusivo para Brenda Ernesto' : 'Exclusive for Brenda Ernesto'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSendReportEmail}
                  disabled={loadingVisits || visitStats.length === 0}
                  className="bg-[#bf6fe5] hover:bg-[#a14ac9] disabled:bg-[#bf6fe5]/20 disabled:text-on-surface-variant/40 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer border-0"
                  title={language === 'pt' ? 'Enviar relatório de acessos por e-mail' : language === 'es' ? 'Enviar informe de accesos por e-mail' : 'Send access report via e-mail'}
                >
                  <span className="material-symbols-outlined notranslate text-[13px]" translate="no">mail</span>
                  {language === 'pt' ? 'Enviar Relatório' : language === 'es' ? 'Enviar Informe' : 'Send Report'}
                </button>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {language === 'pt'
                  ? 'Todos os acessos são registrados no banco de dados e consolidados abaixo. Você pode enviar o relatório diário para o seu e-mail pessoal com o botão acima a qualquer momento.'
                  : language === 'es'
                  ? 'Todos los accesos se registran en la base de datos y se consolidan a continuación. Puede enviar el informe diario a su correo electrónico personal con el botón superior en cualquier momento.'
                  : 'All page loads are registered in the database and consolidated below. You can send the daily digest report to your personal inbox anytime.'}
              </p>

              {loadingVisits ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#bf6fe5] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] text-on-surface-variant animate-pulse">
                    {language === 'pt' ? 'Carregando estatísticas...' : language === 'es' ? 'Cargando estadísticas...' : 'Loading statistics...'}
                  </p>
                </div>
              ) : statsError ? (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[11px] text-red-300">
                  {language === 'pt' ? 'Erro ao carregar do Firestore:' : language === 'es' ? 'Error al cargar de Firestore:' : 'Error loading from Firestore:'} {statsError}
                </div>
              ) : visitStats.length === 0 ? (
                <div className="bg-surface-container-lowest p-4 rounded-xl text-center text-[11px] text-on-surface-variant italic">
                  {language === 'pt' ? 'Nenhum acesso registrado até o momento.' : language === 'es' ? 'No hay accesos registrados todavía.' : 'No accesses recorded yet.'}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 bg-[#171219] px-3 py-1.5 rounded-t-xl text-[9px] uppercase tracking-wider font-extrabold text-primary pl-4">
                    <span>{language === 'pt' ? 'Data' : language === 'es' ? 'Fecha' : 'Date'}</span>
                    <span className="text-right pr-4">{language === 'pt' ? 'Acessos Exclusivos' : language === 'es' ? 'Accesos Únicos' : 'Unique Accesses'}</span>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto divide-y divide-[#171219]/20 rounded-b-xl border border-[#171219]/10 bg-surface-container-lowest scrollbar-thin">
                    {visitStats.map((stat, idx) => {
                      const [yr, mo, dy] = stat.date.split('-');
                      const displayDate = yr && mo && dy ? `${dy}/${mo}/${yr}` : stat.date;
                      return (
                        <div key={idx} className="grid grid-cols-2 px-4 py-2.5 text-xs font-mono items-center hover:bg-surface-container/20 transition-colors">
                          <span className="text-on-surface font-semibold">{displayDate}</span>
                          <span className="text-right text-[#bf6fe5] font-bold pr-4">{stat.count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center bg-surface-container-high/35 px-4 py-2 rounded-xl text-[10px] font-mono text-on-surface-variant border border-outline-variant/10 mt-1">
                    <span>Total Consolidado:</span>
                    <span className="font-bold text-[#bf6fe5]">{visitStats.reduce((acc, curr) => acc + curr.count, 0)} acessos</span>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
