import React, { useState } from 'react';
import { UserProfile, BookReview } from '../types';
import { TRANSLATIONS, Language } from '../translations';

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

export default function ProfileView({ profile, reviews, onLogout, onUpdateProfile, language }: ProfileViewProps) {
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
      avatarUrl: editAvatarUrl
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
      <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 relative">
        {!isEditing ? (
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => {
                setEditName(profile.name);
                setEditAvatarUrl(profile.avatarUrl);
                setIsEditing(true);
              }}
              className="absolute top-4 right-4 bg-primary/10 hover:bg-primary/25 text-primary text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title={t.EDIT_PROFILE}
            >
              <span className="material-symbols-outlined notranslate text-[13px]" translate="no">edit</span>
              {t.EDIT_PROFILE}
            </button>

            <div className="w-20 h-20 rounded-full bg-primary-container/30 border-2 border-[#bf6fe5] overflow-hidden shadow-md flex items-center justify-center">
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
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 animate-fadeIn">
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
