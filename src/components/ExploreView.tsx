import React, { useState } from 'react';
import { BookReview } from '../types';
import { TRANSLATIONS, Language } from '../translations';

interface ExploreViewProps {
  onAddPresetToList: (title: string, author: string, coverUrl: string) => void;
  language: Language;
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

export default function ExploreView({ onAddPresetToList, language }: ExploreViewProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const t = TRANSLATIONS[language];
  const quotesList = LOCALIZED_QUOTES[language] || LOCALIZED_QUOTES.pt;
  const trendingBooks = LOCALIZED_TRENDING[language] || LOCALIZED_TRENDING.pt;

  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotesList.length);
  };

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
    }, 3000);
  };

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
