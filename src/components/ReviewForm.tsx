import React, { useState, useEffect } from 'react';
import { BookReview, BookStatus } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ReviewFormProps {
  editingReview: BookReview | null;
  onSave: (review: Omit<BookReview, 'id' | 'createdAt'> & { id?: string }) => void;
  onCancel: () => void;
  language: Language;
}

const PRESET_COVERS = [
  {
    name: 'Lavanda & Clássico',
    nameEn: 'Lavender & Classic',
    nameEs: 'Lavanda y Clásico',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTXCIyG5WW-24p-44X2ePkg4M7doclvwQ8yByAWDrebYKNMFtWVl8eKqI6eKTFjpWIgIAhGQzTx_X2YXxvt8QjloVNbYvRddc4k1PQFq_2b56Gd8HYwSkxDqv2YXUmgHq1_Dfe4hfMWHv-u3p50oljC-w1ZoPVoPnp9163cfBTUlr_8siUXgKBSLLD07KEwCyTuRDI98sPBj3ovWHoeYsuo7pwP7umUyCW9anZJNU0JjDE8K0GJqUYojYTsBjvpq1VwVmogUsNjYvg'
  },
  {
    name: 'Névoa Mística',
    nameEn: 'Mystic Mist',
    nameEs: 'Niebla Mística',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvsQ8Wg4gAC9qA_SbxQuHqnMk7dpfO0KkinBqB_99b6jmVo02n7Af30wH59pZYkfKs1Cd5QlKlTIxD0QACE-SPvMFDWdeRGJ0nLdWxUXOxGnMCix9b43w9BSuk00Ub1Onrmej8gvvECHTHb6VCQsSftkepX8-J9aABs3RQJbg5nvSC8gZn9REenMZJXpft4-o4O83oyz_vdLyHIyYq0R52i7LQsYoPWp6U2hhyKUHThVfVoYNlG_xsCJEe5R72pQFdGQczjBEr-dYc'
  },
  {
    name: 'Biblioteca Antiga',
    nameEn: 'Ancient Library',
    nameEs: 'Biblioteca Antigua',
    url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Estrela Sombria',
    nameEn: 'Dark Star',
    nameEs: 'Estrella Sombría',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Grimório Violeta',
    nameEn: 'Violet Grimoire',
    nameEs: 'Grimorio Violeta',
    url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop'
  }
];

export default function ReviewForm({
  editingReview,
  onSave,
  onCancel,
  language
}: ReviewFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('LENDO');
  const [rating, setRating] = useState(0);
  const [coverUrl, setCoverUrl] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const t = TRANSLATIONS[language];

  // Initialize form if editing
  useEffect(() => {
    if (editingReview) {
      setTitle(editingReview.title);
      setAuthor(editingReview.author);
      setStatus(editingReview.status);
      setRating(editingReview.rating);
      setCoverUrl(editingReview.coverUrl);
      setReviewText(editingReview.reviewText);
      setTags(editingReview.tags || []);
    } else {
      // Defaults for a new review
      setTitle('');
      setAuthor('');
      setStatus('LENDO');
      setRating(0);
      setCoverUrl('');
      setReviewText('');
      setTags([]);
    }
  }, [editingReview]);

  // Handle image file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag management
  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag) {
      const formattedTag = cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Keyboard navigation for tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(language === 'pt' ? 'Por favor, informe ao menos o título do livro.' : language === 'es' ? 'Por favor, ingrese al menos el título del libro.' : 'Please enter at least the book title.');
      return;
    }
    onSave({
      id: editingReview?.id,
      title: title.trim(),
      author: author.trim(),
      status,
      rating,
      coverUrl,
      reviewText: reviewText.trim(),
      tags,
      isFavorite: editingReview ? editingReview.isFavorite : false
    });
  };

  // Star select helper
  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 animate-in fade-in duration-300">
      {/* Top Banner Screen Title */}
      <h2 className="text-xl font-bold font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4 flex items-center gap-2">
        <span className="material-symbols-outlined notranslate text-primary" translate="no">edit_note</span>
        {editingReview ? t.EDIT_REVIEW : t.NEW_REVIEW}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Attachment Area */}
        <section className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col items-center">
          <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
            {language === 'pt' ? 'Capa da Obra' : language === 'es' ? 'Portada de la Obra' : 'Book Cover'}
          </label>
          
          <div className="flex gap-4 items-center w-full max-w-md justify-center flex-wrap sm:flex-nowrap">
            {/* Visual Preview */}
            <div className="relative w-36 h-48 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container transition-all overflow-hidden flex flex-col items-center justify-center text-center p-2">
              {coverUrl ? (
                <>
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverUrl('')}
                    className="absolute top-1.5 right-1.5 bg-background/90 text-error h-6 w-6 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                    title={language === 'pt' ? 'Remover capa' : language === 'es' ? 'Eliminar portada' : 'Remove cover'}
                  >
                    <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-on-surface-variant">
                  <span className="material-symbols-outlined notranslate text-4xl text-primary mb-1" translate="no">add_photo_alternate</span>
                  <p className="font-sans text-[10px] text-on-surface-variant/70 leading-relaxed px-2">
                    {language === 'pt' ? 'Nenhuma capa' : language === 'es' ? 'Sin portada' : 'No cover added'}
                  </p>
                </div>
              )}
            </div>

            {/* Input Controls */}
            <div className="flex flex-col gap-2 w-full max-w-xs shrink-0">
              <label className="bg-primary text-on-primary hover:bg-primary-container hover:scale-[1.01] transition-all px-4 py-2.5 rounded-xl text-center text-xs font-semibold cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-sm" translate="no">upload</span>
                {language === 'pt' ? 'Upload de Imagem' : language === 'es' ? 'Subir Imagen' : 'Upload Image'}
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
                className="bg-surface-container hover:bg-surface-container-high transition-colors text-[#dfb9ed] border border-[#dfb9ed]/20 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined notranslate text-sm" translate="no">palette</span>
                {language === 'pt' ? 'Usar Capas Ilustrativas' : language === 'es' ? 'Usar Portadas Ilustrativas' : 'Use Preset Covers'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(!showUrlInput);
                  setShowPresets(false);
                }}
                className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-on-surface border border-outline-variant/30 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined notranslate text-sm" translate="no">link</span>
                {language === 'pt' ? 'Inserir Link da Imagem' : language === 'es' ? 'Insertar Enlace de Imagen' : 'Insert Image Link'}
              </button>
            </div>
          </div>

          {/* Preset covers sub-menus */}
          {showPresets && (
            <div className="mt-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 w-full animate-fadeIn max-w-lg">
              <p className="text-[11px] font-bold text-primary mb-2 text-center uppercase tracking-wider">
                {language === 'pt' ? 'Selecione uma Imagem Temática' : language === 'es' ? 'Seleccione una Imagen Temática' : 'Select a Thematic Image'}:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_COVERS.map((cov, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCoverUrl(cov.url);
                      setShowPresets(false);
                    }}
                    className="flex flex-col items-center hover:scale-105 transition-transform cursor-pointer relative group"
                  >
                    <img
                      src={cov.url}
                      alt={cov.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-24 object-cover rounded-md border border-outline-variant shadow-sm group-hover:border-primary"
                    />
                    <span className="text-[9px] text-on-surface-variant text-center leading-normal truncate w-full mt-1">
                      {language === 'pt' ? cov.name : language === 'es' ? cov.nameEs : cov.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Link URL sub-menu */}
          {showUrlInput && (
            <div className="mt-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 w-full animate-fadeIn max-w-lg">
              <label className="block text-[10px] uppercase font-bold text-primary mb-1 pl-1">
                {language === 'pt' ? 'Cole o link da capa (HTTP/HTTPS):' : language === 'es' ? 'Pegue el enlace de la portada:' : 'Paste cover link (HTTP/HTTPS):'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={coverUrl.startsWith('data:') ? '' : coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="flex-grow bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="bg-primary text-on-primary text-xs px-3 py-1 rounded-xl font-bold cursor-pointer hover:bg-primary-container"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Textual Identification Form */}
        <section className="space-y-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <div>
            <label className="block font-sans text-xs font-semibold text-primary mb-1 ml-1" htmlFor="title-inp">
              {language === 'pt' ? 'Título da Obra *' : language === 'es' ? 'Título de la Obra *' : 'Book Title *'}
            </label>
            <input
              id="title-inp"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O Nome do Vento"
              className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:outline-none py-2 px-1 text-on-surface placeholder:text-on-surface-variant/30 text-lg font-serif transition-colors"
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-semibold text-primary mb-1 ml-1" htmlFor="author-inp">
              {language === 'pt' ? 'Nome do Autor' : language === 'es' ? 'Nombre del Autor' : 'Author Name'}
            </label>
            <input
              id="author-inp"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: Patrick Rothfuss"
              className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:outline-none py-2 px-1 text-on-surface placeholder:text-on-surface-variant/30 text-base transition-colors"
            />
          </div>
        </section>

        {/* Status Selection Row */}
        <section className="space-y-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <label className="block font-sans text-xs font-semibold text-primary ml-1 uppercase tracking-wider">
            {language === 'pt' ? 'Status de Leitura' : language === 'es' ? 'Estado de Lectura' : 'Reading Status'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['LENDO', 'CONCLUÍDO', 'PAUSADO'] as BookStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`py-3 rounded-xl font-semibold text-xs transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                  status === st
                    ? 'bg-primary border-primary text-on-primary shadow-md'
                    : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-base" translate="no">
                  {st === 'LENDO' ? 'bookmark' : st === 'CONCLUÍDO' ? 'verified' : 'contrast_rtl_off'}
                </span>
                <span>
                  {st === 'LENDO' ? t.STATUS_LENDO : st === 'CONCLUÍDO' ? t.STATUS_CONCLUIDO : t.STATUS_PAUSADO}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Star Interactive Rating Selector */}
        <section className="space-y-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <label className="block font-sans text-xs font-semibold text-primary ml-1 uppercase tracking-wider">
            {language === 'pt' ? 'Sua Avaliação (Estrelas)' : language === 'es' ? 'Tu Calificación (Estrellas)' : 'Your Rating (Stars)'}
          </label>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 whitespace-nowrap">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isActive = rating >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => handleStarClick(starValue)}
                    className="hover:scale-110 active:scale-90 transition-transform focus:outline-none cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined notranslate text-4xl ${isActive ? 'text-primary' : 'text-outline-variant'}`}
                      translate="no"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Support half-steps if slider or button is clicked */}
            <div className="flex flex-col">
              <span className="text-xl font-bold font-serif text-secondary leading-none">
                {rating.toFixed(1)} / 5.0
              </span>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setRating(Math.max(0, rating - 0.5))}
                  className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-[10px] text-on-surface px-1.5 py-0.5 rounded cursor-pointer font-bold leading-normal"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => setRating(Math.min(5, rating + 0.5))}
                  className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-[10px] text-on-surface px-1.5 py-0.5 rounded cursor-pointer font-bold leading-normal"
                >
                  +0.5
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Tags, Genres and Tropes */}
        <section className="space-y-3 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <label className="block font-sans text-xs font-semibold text-primary ml-1" htmlFor="tag-field">
            {language === 'pt' ? 'Gêneros, Tags e Tropes' : language === 'es' ? 'Géneros, Tags y Claves' : 'Genres, Tags and Topics'}
          </label>

          {/* Chips list container */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 py-1">
              {tags.map((tg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-semibold animate-in zoom-in-75 duration-150 border border-outline-variant/10"
                >
                  <span>{tg}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(i)}
                    className="hover:text-error transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tag insertion input */}
          <div className="flex gap-2">
            <input
              id="tag-field"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={language === 'pt' ? 'Adicionar tag (ex: #Romance, #Fantasia)' : language === 'es' ? 'Añadir tag (ej: #Romance, #Fantasía)' : 'Add tag (e.g. #Romance, #Fantasy)'}
              className="flex-grow bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 p-2.5 rounded-xl transition-all font-semibold text-xs cursor-pointer flex items-center justify-center border border-outline-variant/20"
            >
              <span className="material-symbols-outlined notranslate text-sm" translate="no">add_circle</span>
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant/60 italic pl-1">
            {language === 'pt' 
              ? 'Dica: Digite a tag e pressione Enter, vírgula ou clique no botão + para adicionar.' 
              : language === 'es'
              ? 'Consejo: Escribe el tag y presiona Enter o haz clic en + para añadir.'
              : 'Tip: Type the tag and press Enter, comma or click + to add.'}
          </p>
        </section>

        {/* Text Area for Review Text */}
        <section className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
          <label className="block font-sans text-xs font-semibold text-primary mb-2 ml-1" htmlFor="review-inp">
            {language === 'pt' ? 'Sua Resenha Personalizada' : language === 'es' ? 'Tu Reseña Personalizada' : 'Your Custom Review'}
          </label>
          <textarea
            id="review-inp"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={language === 'pt' ? 'O que você achou dessa leitura?' : language === 'es' ? '¿Qué te pareció este libro?' : 'What did you think of this read?'}
            rows={5}
            className="w-full bg-transparent border-0 focus:ring-0 text-xs text-on-surface placeholder:text-on-surface-variant/40 resize-none px-1 py-1 leading-relaxed focus:outline-none"
          />
        </section>

        {/* Back and Confirm Button triggers */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-surface-container-high hover:bg-surface-container-highest hover:text-white transition-all py-3 rounded-full text-xs font-bold text-center cursor-pointer active:scale-95 text-on-surface"
          >
            {t.CANCEL}
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-container text-on-primary hover:scale-[1.01] transition-all py-3 rounded-full text-xs font-bold text-center cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined notranslate text-sm" translate="no">save</span>
            {t.SAVE_REVIEW_BUTTON}
          </button>
        </div>
      </form>
    </div>
  );
}
