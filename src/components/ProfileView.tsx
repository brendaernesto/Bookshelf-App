import React, { useState, useEffect } from 'react';
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
}

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

export default function ProfileView({ profile, reviews, onLogout, onUpdateProfile, language }: ProfileViewProps) {
  const isAdmin = profile.email?.toLowerCase() === 'brendaernesto27@gmail.com';
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
        // Sort by date descending
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
    
    let reportBody = `Olá Brenda!\n\n`;
    reportBody += `Aqui está o relatório consolidado de acessos diários do seu aplicativo Bookshelf.\n\n`;
    reportBody += `Histórico de Acessos Recentes:\n`;
    reportBody += `--------------------------------------------------\n`;
    
    if (visitStats.length === 0) {
      reportBody += `Nenhum acesso registrado ainda ou carregando dados...\n`;
    } else {
      visitStats.slice(0, 15).forEach(stat => {
        const [yr, mo, dy] = stat.date.split('-');
        const formattedDate = yr && mo && dy ? `${dy}/${mo}/${yr}` : stat.date;
        reportBody += `📅 Data: ${formattedDate} | 👥 Acessos Únicos: ${stat.count}\n`;
      });
    }
    
    reportBody += `--------------------------------------------------\n`;
    reportBody += `Total acumulado monitorado: ${visitStats.reduce((acc, curr) => acc + curr.count, 0)} acessos.\n\n`;
    reportBody += `O Bookshelf agora está disponível globalmente em qualquer navegador ao redor do mundo!\n\n`;
    reportBody += `Atenciosamente,\nSeu Assistente de IA Bookshelf 💜`;
    
    const body = encodeURIComponent(reportBody);
    window.location.href = `mailto:brendaernesto27@gmail.com?subject=${subject}&body=${body}`;
  };

  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('bookshelf_goal');
    return saved ? parseInt(saved) : 12;
  });

  const t = TRANSLATIONS[language];

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

  const totalReviews = reviews.length;
  const [quotesCount] = useState(() => {
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
  const readingCount = reviews.filter((r) => r.status === 'LENDO').length;
  const finishedCount = reviews.filter((r) => r.status === 'CONCLUÍDO').length;
  const pausedCount = reviews.filter((r) => r.status === 'PAUSADO').length;
  const favoritesCount = reviews.filter((r) => r.isFavorite).length;

  const handleUpdateGoal = (num: number) => {
    const newGoal = Math.max(1, goal + num);
    setGoal(newGoal);
    localStorage.setItem('bookshelf_goal', newGoal.toString());
  };

  const progressPercent = Math.min(100, Math.round((finishedCount / goal) * 100));

  // Local file upload processing
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
      alert(t.NAME_EMPTY_ALERT);
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
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-6 animate-in fade-in duration-300">
      
      {/* Profile Header card & Editor block */}
      <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 relative overflow-hidden">
        {!isEditing ? (
          <div>
            {/* Optional Background Banner */}
            {profile.bannerType && profile.bannerType !== 'none' ? (
              <div className="h-32 w-full relative">
                {profile.bannerType === 'color' ? (
                  <div className="w-full h-full text-white font-serif flex items-center justify-center font-bold text-xs" style={{ backgroundColor: profile.bannerValue || '#231e25' }}></div>
                ) : (
                  <img
                    src={profile.bannerValue || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop'}
                    alt="Banner"
                    className="w-full h-full object-cover animate-fadeIn"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/90 via-transparent to-black/15"></div>
              </div>
            ) : null}

            <div className={`flex flex-col items-center text-center relative ${profile.bannerType && profile.bannerType !== 'none' ? 'p-6 pt-0' : 'p-6'}`}>
              <button
                onClick={() => {
                  setEditName(profile.name);
                  setEditAvatarUrl(profile.avatarUrl);
                  setEditBannerType(profile.bannerType || 'none');
                  setEditBannerValue(profile.bannerValue || '');
                  setIsEditing(true);
                }}
                className="absolute top-4 right-4 bg-primary/10 backdrop-blur-md hover:bg-primary/25 text-primary text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 z-20"
                title={t.EDIT_PROFILE}
              >
                <span className="material-symbols-outlined notranslate text-[13px]" translate="no">edit</span>
                {t.EDIT_PROFILE}
              </button>

              <div className={`${profile.bannerType && profile.bannerType !== 'none' ? '-mt-12 border-4 border-surface-container-low shadow-xl' : 'border-2 border-[#bf6fe5] shadow-md'} z-10 w-20 h-20 rounded-full bg-[#1e1124] overflow-hidden flex items-center justify-center transition-all`}>
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-serif text-lg font-bold text-on-surface mt-3">{profile.name}</h2>
              <p className="text-xs text-on-surface-variant font-mono">{profile.email}</p>

              <span className="bg-[#bf6fe5]/15 text-[#e9b3ff] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mt-3 border border-[#bf6fe5]/15">
                {t.LEVEL}
              </span>
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
                className="text-on-surface-variant hover:text-error transition-colors"
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

              {/* Photo customization choices */}
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

              {/* Presets subview */}
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
                        className="flex-shrink-0 focus:outline-none focus:scale-105 hover:scale-105 transition-transform"
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full border border-[#bf6fe5]/30 object-cover hover:border-primary"
                        />
                        <span className="text-[8px] text-on-surface-variant text-center block max-w-[48px] truncate mt-0.5">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* URL insertion subview */}
              {showUrlInput && (
                <div className="w-full bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 space-y-1.5 animate-fadeIn">
                  <label className="block text-[9px] uppercase font-bold text-primary">
                    {language === 'pt' ? 'Cole o link (URL) da foto' : language === 'es' ? 'Pegue el enlace (URL) de la foto' : 'Paste picture link (URL)'}:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://exemplo.com/foto.jpg"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      className="flex-grow bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempUrl.trim()) {
                          setEditAvatarUrl(tempUrl.trim());
                        }
                        setShowUrlInput(false);
                      }}
                      className="bg-[#bf6fe5] text-on-primary text-[10px] uppercase font-bold px-3 py-1 rounded-xl cursor-pointer"
                    >
                      {language === 'pt' ? 'Aplicar' : language === 'es' ? 'Aplicar' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NEW Background Banner Customize Subpanel */}
            <div className="bg-[#211a22] border border-outline-variant/15 rounded-xl p-4 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e1bee7] border-b border-outline-variant/10 pb-2">
                <span className="material-symbols-outlined text-base notranslate text-[#bf6fe5]" translate="no">image</span>
                {BANNER_REG[language].SECTION_TITLE}
              </div>

              {/* Segmented Select Control */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-primary block">
                  {BANNER_REG[language].TYPE_LABEL}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditBannerType('none');
                    }}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border shrink-0 ${
                      editBannerType === 'none'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-outline-variant/10'
                    }`}
                  >
                    {BANNER_REG[language].TYPE_NONE}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditBannerType('color');
                      if (!editBannerValue || editBannerValue.startsWith('http') || editBannerValue.startsWith('data:')) {
                        setEditBannerValue('#bf6fe5');
                      }
                    }}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border shrink-0 ${
                      editBannerType === 'color'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-outline-variant/10'
                    }`}
                  >
                    {BANNER_REG[language].TYPE_COLOR}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditBannerType('image');
                      if (!editBannerValue || (!editBannerValue.startsWith('http') && !editBannerValue.startsWith('data:'))) {
                        setEditBannerValue(PRESET_BANNER_IMAGES[0].url);
                      }
                    }}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border shrink-0 ${
                      editBannerType === 'image'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-outline-variant/10'
                    }`}
                  >
                    {BANNER_REG[language].TYPE_IMAGE}
                  </button>
                </div>
              </div>

              {/* Type Settings Editor Panels */}
              {editBannerType === 'color' && (
                <div className="space-y-3 pt-1 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant block">
                      {BANNER_REG[language].SOLID_HEX_LABEL}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editBannerValue}
                        onChange={(e) => setEditBannerValue(e.target.value)}
                        placeholder="#bf6fe5"
                        className="bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary flex-grow font-mono"
                      />
                      <div
                        className="w-8 h-8 rounded-xl border border-outline-variant/50 self-center shrink-0 shadow-inner"
                        style={{ backgroundColor: editBannerValue || '#000000' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-primary block">
                      {BANNER_REG[language].PRESET_COLORS}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_BANNER_COLORS.map((c, idx) => {
                        const nameLocalized = language === 'pt' ? c.name : language === 'es' ? c.nameEs : c.nameEn;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditBannerValue(c.value)}
                            className="w-7 h-7 rounded-full border border-white/10 relative cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: c.value }}
                            title={nameLocalized}
                          >
                            {editBannerValue === c.value && (
                              <span className="material-symbols-outlined text-[13px] text-white font-bold notranslate" translate="no">check</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {editBannerType === 'image' && (
                <div className="space-y-3 pt-1 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant block">
                      {BANNER_REG[language].PHOTO_URL_LABEL}
                    </label>
                    <input
                      type="text"
                      value={(editBannerValue.startsWith('data:') || !editBannerValue.startsWith('http')) ? '' : editBannerValue}
                      onChange={(e) => setEditBannerValue(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-on-surface-variant block">
                      {BANNER_REG[language].PHOTO_UPLOAD_LABEL}
                    </label>
                    <label className="inline-flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high transition-colors text-[#e1bee7] border border-outline-variant/10 px-3.5 py-1.5 rounded-xl text-[10px] font-semibold cursor-pointer shadow-sm active:scale-95">
                      <span className="material-symbols-outlined text-xs notranslate" translate="no">cloud_upload</span>
                      {BANNER_REG[language].CHOOSE_FILE_LABEL}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (loadEvent) => {
                              if (loadEvent.target?.result) {
                                setEditBannerValue(loadEvent.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-primary block">
                      {BANNER_REG[language].PRESET_PHOTOS}:
                    </span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {PRESET_BANNER_IMAGES.map((img, idx) => {
                        const isSel = editBannerValue === img.url;
                        const nameLocalized = language === 'pt' ? img.name : language === 'es' ? img.nameEs : img.nameEn;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditBannerValue(img.url)}
                            className={`flex-shrink-0 relative w-16 h-10 rounded-lg overflow-hidden border transition-all ${
                              isSel ? 'border-primary scale-[1.02] ring-1 ring-primary' : 'border-outline-variant/20 hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={nameLocalized}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/10 transition-colors flex items-center justify-center">
                              <span className="text-[8px] text-white font-bold tracking-tight text-center px-0.5 truncate max-w-full drop-shadow-md">
                                {nameLocalized}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
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

            {/* Action footer triggers */}
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

      {/* NEW Interactive App Language Selection Section */}
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
                onClick={() => changeLanguage(lang)}
                className={`py-3 px-1 rounded-xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1 justify-center active:scale-95 cursor-pointer ${
                  isSel
                    ? 'bg-primary/20 hover:bg-primary/30 text-white border-[#bf6fe5] shadow-sm scale-[1.01]'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-white border-outline-variant/15'
                }`}
              >
                <span className="text-sm font-sans">
                  {lang === 'pt' ? '🇧🇷' : lang === 'en' ? '🇺🇸' : '🇪🇸'}
                </span>
                <span className="text-[10px] uppercase tracking-wider">
                  {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Reading Statistics Container */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#dfb9ed] ml-1">{t.METRICS_TITLE}</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 text-center">
            <span className="material-symbols-outlined notranslate text-primary text-xl" translate="no" style={{ fontVariationSettings: "'FILL' 0" }}>auto_stories</span>
            <p className="text-xl font-bold font-serif text-on-surface mt-1">{totalReviews}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.TOTAL_BOOKS}</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 text-center">
            <span className="material-symbols-outlined notranslate text-primary text-xl" translate="no" style={{ fontVariationSettings: "'FILL' 0" }}>verified</span>
            <p className="text-xl font-bold font-serif text-[#dfb9ed] mt-1">{finishedCount}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.FINISHED}</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 text-center">
            <span className="material-symbols-outlined notranslate text-primary text-xl" translate="no" style={{ fontVariationSettings: "'FILL' 0" }}>bookmark</span>
            <p className="text-xl font-bold font-serif text-[#ffb1c8] mt-1">{readingCount}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.READING_NOW}</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 text-center">
            <span className="material-symbols-outlined notranslate text-primary text-xl" translate="no" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <p className="text-xl font-bold font-serif text-tertiary mt-1">{favoritesCount}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.FAVORITES_COUNT}</p>
          </div>
        </div>
      </section>

      {/* Annual Reading Goal interactive module */}
      <section className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider">{t.ANNUAL_GOAL}</h4>
            <p className="text-[11px] text-on-surface-variant italic">{t.ANNUAL_GOAL_SUB}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateGoal(-1)}
              className="bg-surface-container hover:bg-surface-container-high h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90"
            >
              -
            </button>
            <span className="font-serif text-sm font-bold text-on-surface">
              {goal} {language === 'pt' ? 'livros' : language === 'es' ? 'libros' : 'books'}
            </span>
            <button
              onClick={() => handleUpdateGoal(1)}
              className="bg-surface-container hover:bg-surface-container-high h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* Goal progress meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant pl-0.5">
            <span>{t.PROGRESS_GOAL}:</span>
            <span className="text-primary font-bold">
              {finishedCount} {language === 'pt' ? 'de' : language === 'es' ? 'de' : 'of'} {goal} {language === 'pt' ? 'lidos' : language === 'es' ? 'leídos' : 'read'} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden border border-outline-variant/10">
            <div
              className="bg-gradient-to-r from-primary-container to-primary h-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Reading Badges / Accomplishments */}
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

      {/* EXCLUSIVE OWNER ADMIN VISIT METRICS PANEL */}
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
              : 'All page loads are registered in the database and consolidated below. You can send the daily digest report to your personal inbox anytime.'
            }
          </p>

          {loadingVisits ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#bf6fe5] border-t-transparent rounded-full animate-spin"></div>
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

      {/* Logout Row */}
      <button
        onClick={() => {
          if (!confirmingLogout) {
            setConfirmingLogout(true);
            setTimeout(() => setConfirmingLogout(false), 4500);
          } else {
            onLogout();
          }
        }}
        className={`w-full py-3 rounded-full transition-all font-bold text-center text-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
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
  );
}
