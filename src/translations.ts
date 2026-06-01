export type Language = 'pt' | 'en' | 'es';

export interface TranslationSet {
  // Navigation
  LIBRARY: string;
  EXPLORE: string;
  WRITING: string;
  PROFILE: string;

  // Header & Search
  SEARCH_PLACEHOLDER: string;
  APP_SLOGAN: string;
  WELCOME_BACK: string;
  LOGIN_SUBTITLE: string;
  LOGIN_WITH_GOOGLE: string;
  OR_USE_NAME: string;
  CREATE_CUSTOM_SHELF: string;
  YOUR_NAME: string;
  EMAIL_OPTIONAL: string;
  CONNECTING: string;
  CONNECT: string;

  // Status & Filter Tabs
  ALL: string;
  STATUS_LENDO: string;
  STATUS_CONCLUIDO: string;
  STATUS_PAUSADO: string;
  STATUS_FAVORITOS: string;
  STATUS_TUDO: string;

  // Library & Card Actions
  ADD_REVIEW: string;
  DELETE: string;
  EDIT: string;
  FAVORITE: string;
  RATING: string;
  READ_MORE: string;
  CLOSE: string;
  EMPTY_LIBRARY: string;
  EMPTY_LIBRARY_SUB: string;

  // Form
  FORM_ADD_TITLE: string;
  FORM_EDIT_TITLE: string;
  BOOK_TITLE: string;
  BOOK_AUTHOR: string;
  BOOK_STATUS: string;
  BOOK_RATING: string;
  BOOK_COVER_URL: string;
  BOOK_COVER_PRESET: string;
  BOOK_REVIEW_TEXT: string;
  BOOK_TAGS: string;
  BOOK_FAVORITE: string;
  CANCEL: string;
  SAVE: string;
  SAVE_CHANGES: string;

  // Explore
  QUOTE_DAY_TITLE: string;
  NEXT_INSPIRATION: string;
  ADD_TO_SHELF: string;
  DID_YOU_KNOW: string;
  DID_YOU_KNOW_TEXT: string;
  RECOMMENDED_BOOKS: string;

  // Writing / Journal
  JOURNAL_TITLE: string;
  JOURNAL_SUBTITLE: string;
  INSERT_QUOTE_PLACEHOLDER: string;
  SOURCE: string;
  ADD_QUOTE: string;
  SAVED_QUOTES: string;
  NO_QUOTES: string;
  NO_QUOTES_SUB: string;

  // Profile
  EDIT_PROFILE: string;
  CUSTOMIZE_SHELF: string;
  METRICS_TITLE: string;
  TOTAL_BOOKS: string;
  FINISHED: string;
  READING_NOW: string;
  FAVORITES_COUNT: string;
  ANNUAL_GOAL: string;
  ANNUAL_GOAL_SUB: string;
  PROGRESS_GOAL: string;
  LITERARY_BADGES: string;
  PIONEER: string;
  PIONEER_SUB: string;
  CRITIC: string;
  CRITIC_SUB: string;
  LEVEL: string;
  UNLOCKED: string;
  LOCKED: string;

  // Toast
  TOAST_SAVED: string;
  TOAST_EDITED: string;
  TOAST_DELETED: string;
  TOAST_STATUS_UPDATED: string;
  TOAST_FAV_ADDED: string;
  TOAST_FAV_REMOVED: string;
  TOAST_RECOMMENDED_ADDED: string;
  TOAST_SAVED_ERROR: string;
  TOAST_DELETED_ERROR: string;
  TOAST_UPDATE_ERROR: string;
  TOAST_QUOTE_ADDED: string;

  // Logout Confirm
  LOGOUT_BUTTON: string;
  LOGOUT_CONFIRM: string;
  NAME_EMPTY_ALERT: string;
  SELECT_LANGUAGE: string;

  // Additional Helper Labels
  UNKNOWN_AUTHOR: string;
  NO_REVIEW_TEXT: string;
  SHOW_LESS: string;
  SHOW_MORE: string;
  YES_DELETE: string;
  EDIT_REVIEW: string;
  NEW_REVIEW: string;
  SAVE_REVIEW_BUTTON: string;
}

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  pt: {
    LIBRARY: 'Biblioteca',
    EXPLORE: 'Explorar',
    WRITING: 'Escrever',
    PROFILE: 'Perfil',

    SEARCH_PLACEHOLDER: 'Pesquisar obras, autores ou notas na minha estante...',
    APP_SLOGAN: 'Seu refúgio silencioso para organizar e cultivar leituras',
    WELCOME_BACK: 'Bem-vindo de volta',
    LOGIN_SUBTITLE: 'Conecte-se para acessar sua estante digital de resenhas e anotações.',
    LOGIN_WITH_GOOGLE: 'Entrar com o Google',
    OR_USE_NAME: 'ou use nome',
    CREATE_CUSTOM_SHELF: 'Criar Estante Personalizada',
    YOUR_NAME: 'Seu Nome / Apelido',
    EMAIL_OPTIONAL: 'E-mail (opcional)',
    CONNECTING: 'Conectando...',
    CONNECT: 'Conectar',

    ALL: 'Todos',
    STATUS_LENDO: 'LENDO',
    STATUS_CONCLUIDO: 'CONCLUÍDO',
    STATUS_PAUSADO: 'PAUSADO',
    STATUS_FAVORITOS: 'FAVORITOS',
    STATUS_TUDO: 'TUDO',

    ADD_REVIEW: 'Nova Avaliação',
    DELETE: 'Excluir',
    EDIT: 'Editar',
    FAVORITE: 'Favoritar',
    RATING: 'Minha Nota',
    READ_MORE: 'Ler Registro Completo',
    CLOSE: 'Fechar',
    EMPTY_LIBRARY: 'Estante Vazia',
    EMPTY_LIBRARY_SUB: 'Comece adicionando uma avaliação do seu livro atual ou explore as recomendações!',

    FORM_ADD_TITLE: 'Novo Registro de Obra',
    FORM_EDIT_TITLE: 'Editar Registro de Obra',
    BOOK_TITLE: 'Nome da Obra',
    BOOK_AUTHOR: 'Autor(a)',
    BOOK_STATUS: 'Status de Leitura',
    BOOK_RATING: 'Avaliação / Estrelas',
    BOOK_COVER_URL: 'Link da Capa (opcional)',
    BOOK_COVER_PRESET: 'Usar Capa Elegante Pronta',
    BOOK_REVIEW_TEXT: 'Critica Literária & Notas Pessoais',
    BOOK_TAGS: 'Gêneros / Palavras-chave (separadas por vírgulas)',
    BOOK_FAVORITE: 'Marcar como Obra Favorita',
    CANCEL: 'Cancelar',
    SAVE: 'Salvar Avaliação',
    SAVE_CHANGES: 'Salvar Alterações',

    QUOTE_DAY_TITLE: 'Citação Inspiradora',
    NEXT_INSPIRATION: 'Próxima inspiração',
    ADD_TO_SHELF: 'Adicionar à Estante',
    DID_YOU_KNOW: 'Você sabia?',
    DID_YOU_KNOW_TEXT: 'Estudos mostram que ler apenas **15 minutos por dia** pode reduzir o estresse em até **68%** e expor você a cerca de **1 milhão de palavras novas por ano**!',
    RECOMMENDED_BOOKS: 'Obras Recomendadas e Populares',

    JOURNAL_TITLE: 'Diário de Citações e Fragmentos',
    JOURNAL_SUBTITLE: 'Guarde frases marcantes, pensamentos filosóficos ou insights que cruzaram seus caminhos nas páginas dos livros.',
    INSERT_QUOTE_PLACEHOLDER: 'Escreva a citação ou passagem aqui...',
    SOURCE: 'Origem da citação (Ex: O Nome do Vento, pág. 120)',
    ADD_QUOTE: 'Adicionar ao Diário',
    SAVED_QUOTES: 'Fragmentos Guardados no Coração',
    NO_QUOTES: 'Nenhum fragmento guardado ainda',
    NO_QUOTES_SUB: 'Cultive suas frases prediletas enquanto desfruta de suas aventuras digitais.',

    EDIT_PROFILE: 'Editar Perfil',
    CUSTOMIZE_SHELF: 'Customizar Minha Estante',
    METRICS_TITLE: 'Métricas da Minha Estante',
    TOTAL_BOOKS: 'Total de Livros',
    FINISHED: 'Lidos / Concluídos',
    READING_NOW: 'Lendo no Momento',
    FAVORITES_COUNT: 'Meus Favoritos',
    ANNUAL_GOAL: 'Meta Anual de Leituras',
    ANNUAL_GOAL_SUB: 'Livros lidos até agora vs meta anual',
    PROGRESS_GOAL: 'Progresso da meta',
    LITERARY_BADGES: 'Distintivos Literários',
    PIONEER: 'Pioneiro da Leitura',
    PIONEER_SUB: 'Conquistado ao registrar a primeiríssima resenha na plataforma.',
    CRITIC: 'Crítico Intelectual',
    CRITIC_SUB: 'Conquistado ao adicionar citações marcantes no Diário de Ofício.',
    LEVEL: 'Leitor Elite • Nível 4',
    UNLOCKED: 'Conquistado',
    LOCKED: 'Bloqueado',

    TOAST_SAVED: 'Avaliação salva com sucesso!',
    TOAST_EDITED: 'Avaliação editada com sucesso!',
    TOAST_DELETED: 'Avaliação excluída com sucesso!',
    TOAST_STATUS_UPDATED: 'Status atualizado',
    TOAST_FAV_ADDED: 'Adicionado aos favoritos! ❤️',
    TOAST_FAV_REMOVED: 'Removido dos favoritos.',
    TOAST_RECOMMENDED_ADDED: 'Livro adicionado com sucesso! 🎉',
    TOAST_SAVED_ERROR: 'Erro ao salvar avaliação. Verifique sua conexão.',
    TOAST_DELETED_ERROR: 'Erro ao excluir avaliação.',
    TOAST_UPDATE_ERROR: 'Erro ao atualizar dados.',
    TOAST_QUOTE_ADDED: 'Frase adicionada ao seu diário! ✍️',

    LOGOUT_BUTTON: 'Sair da Minha Conta',
    LOGOUT_CONFIRM: 'Confirmar: Deseja realmente sair?',
    NAME_EMPTY_ALERT: 'O nome do usuário não pode ficar em branco.',
    SELECT_LANGUAGE: 'Idioma do Aplicativo',

    UNKNOWN_AUTHOR: 'Autor Desconhecido',
    NO_REVIEW_TEXT: 'Nenhuma resenha inserida ainda. Toque em Editar para escrever uma.',
    SHOW_LESS: 'Ver menos',
    SHOW_MORE: 'Ver mais...',
    YES_DELETE: 'Sim, Excluir',
    EDIT_REVIEW: 'Editar Avaliação',
    NEW_REVIEW: 'Nova Avaliação',
    SAVE_REVIEW_BUTTON: 'Salvar Avaliação'
  },
  en: {
    LIBRARY: 'Library',
    EXPLORE: 'Explore',
    WRITING: 'Journal',
    PROFILE: 'Profile',

    SEARCH_PLACEHOLDER: 'Search books, authors or review notes...',
    APP_SLOGAN: 'Your silent sanctuary to organize and cultivate readings',
    WELCOME_BACK: 'Welcome back',
    LOGIN_SUBTITLE: 'Sign in to access your digital bookshelf of reviews and annotations.',
    LOGIN_WITH_GOOGLE: 'Sign in with Google',
    OR_USE_NAME: 'or enter your name',
    CREATE_CUSTOM_SHELF: 'Create Custom Bookshelf',
    YOUR_NAME: 'Your Name / Pen Name',
    EMAIL_OPTIONAL: 'Email (optional)',
    CONNECTING: 'Connecting...',
    CONNECT: 'Connect',

    ALL: 'All',
    STATUS_LENDO: 'READING',
    STATUS_CONCLUIDO: 'FINISHED',
    STATUS_PAUSADO: 'ON HOLD',
    STATUS_FAVORITOS: 'FAVORITES',
    STATUS_TUDO: 'ALL',

    ADD_REVIEW: 'New Review',
    DELETE: 'Delete',
    EDIT: 'Edit',
    FAVORITE: 'Favorite',
    RATING: 'My Rating',
    READ_MORE: 'Read Complete Entry',
    CLOSE: 'Close',
    EMPTY_LIBRARY: 'Empty Bookshelf',
    EMPTY_LIBRARY_SUB: 'Start by adding a review of your active book or explore curated recommendations!',

    FORM_ADD_TITLE: 'New Book Entry',
    FORM_EDIT_TITLE: 'Edit Book Entry',
    BOOK_TITLE: 'Book Title',
    BOOK_AUTHOR: 'Author',
    BOOK_STATUS: 'Reading Status',
    BOOK_RATING: 'Rating / Stars',
    BOOK_COVER_URL: 'Cover Link / URL (optional)',
    BOOK_COVER_PRESET: 'Use a Ready-Made Template Cover',
    BOOK_REVIEW_TEXT: 'Literary Critique & Personal Notes',
    BOOK_TAGS: 'Genres / Tags (comma separated)',
    BOOK_FAVORITE: 'Set as Favorite Book',
    CANCEL: 'Cancel',
    SAVE: 'Save Review',
    SAVE_CHANGES: 'Save Changes',

    QUOTE_DAY_TITLE: 'Inspiring Quote',
    NEXT_INSPIRATION: 'Next inspiration',
    ADD_TO_SHELF: 'Add to Library',
    DID_YOU_KNOW: 'Did you know?',
    DID_YOU_KNOW_TEXT: 'Studies show that reading just **15 minutes a day** can reduce stress by up to **68%** and expose you to about **1 million new words per year**!',
    RECOMMENDED_BOOKS: 'Curated and Trending Reads',

    JOURNAL_TITLE: 'Diary of Quotes and Fragments',
    JOURNAL_SUBTITLE: 'Save noteworthy phrases, philosophical thoughts or deep insights that crossed your path in the pages of books.',
    INSERT_QUOTE_PLACEHOLDER: 'Write the quote or snippet here...',
    SOURCE: 'Quote source (e.g.: The Name of the Wind, page 120)',
    ADD_QUOTE: 'Add to Journal',
    SAVED_QUOTES: 'Fragments Kept in Mind',
    NO_QUOTES: 'No text fragments saved yet',
    NO_QUOTES_SUB: 'Cultivate your favorite lines while enjoying your digital adventures.',

    EDIT_PROFILE: 'Edit Profile',
    CUSTOMIZE_SHELF: 'Customize My Bookshelf',
    METRICS_TITLE: 'Bookshelf Stat Metrics',
    TOTAL_BOOKS: 'Total Books',
    FINISHED: 'Finished / Read',
    READING_NOW: 'Reading Now',
    FAVORITES_COUNT: 'My Favorites',
    ANNUAL_GOAL: 'Annual Reading Goal',
    ANNUAL_GOAL_SUB: 'Books read so far vs annual goal',
    PROGRESS_GOAL: 'Goal progress',
    LITERARY_BADGES: 'Literary Badges',
    PIONEER: 'Reading Pioneer',
    PIONEER_SUB: 'Achieved by logging your very first book review on the platform.',
    CRITIC: 'Intellectual Critic',
    CRITIC_SUB: 'Achieved by adding noteworthy quotes in your Reading Journal.',
    LEVEL: 'Elite Reader • Level 4',
    UNLOCKED: 'Achieved',
    LOCKED: 'Locked',

    TOAST_SAVED: 'Review saved successfully!',
    TOAST_EDITED: 'Review updated successfully!',
    TOAST_DELETED: 'Review deleted successfully!',
    TOAST_STATUS_UPDATED: 'Reading status updated',
    TOAST_FAV_ADDED: 'Added to favorites! ❤️',
    TOAST_FAV_REMOVED: 'Removed from favorites.',
    TOAST_RECOMMENDED_ADDED: 'Book added successfully! 🎉',
    TOAST_SAVED_ERROR: 'Error saving review. Please check connection.',
    TOAST_DELETED_ERROR: 'Error deleting review.',
    TOAST_UPDATE_ERROR: 'Error updating data.',
    TOAST_QUOTE_ADDED: 'Phrase added to your journal! ✍️',

    LOGOUT_BUTTON: 'Sign Out of Account',
    LOGOUT_CONFIRM: 'Confirm: Are you sure you want to sign out?',
    NAME_EMPTY_ALERT: 'UserName cannot be left blank.',
    SELECT_LANGUAGE: 'App Language',

    UNKNOWN_AUTHOR: 'Unknown Author',
    NO_REVIEW_TEXT: 'No review text has been added yet. Tap Edit to start writing.',
    SHOW_LESS: 'Show less',
    SHOW_MORE: 'Show more...',
    YES_DELETE: 'Yes, Delete',
    EDIT_REVIEW: 'Edit Review',
    NEW_REVIEW: 'New Review',
    SAVE_REVIEW_BUTTON: 'Save Review'
  },
  es: {
    LIBRARY: 'Biblioteca',
    EXPLORE: 'Explorar',
    WRITING: 'Diario',
    PROFILE: 'Perfil',

    SEARCH_PLACEHOLDER: 'Buscar obras, autores o críticas en mi estantería...',
    APP_SLOGAN: 'Tu refugio silencioso para organizar y cultivar lecturas',
    WELCOME_BACK: 'Bienvenido de nuevo',
    LOGIN_SUBTITLE: 'Inicia sesión para acceder a tu estantería digital de reseñas y notas.',
    LOGIN_WITH_GOOGLE: 'Entrar con Google',
    OR_USE_NAME: 'o ingresa tu nombre',
    CREATE_CUSTOM_SHELF: 'Crear Estantería Personalizada',
    YOUR_NAME: 'Tu Nombre / Alias',
    EMAIL_OPTIONAL: 'Correo electrónico (opcional)',
    CONNECTING: 'Conectando...',
    CONNECT: 'Conectar',

    ALL: 'Todos',
    STATUS_LENDO: 'LEYENDO',
    STATUS_CONCLUIDO: 'COMPLETADO',
    STATUS_PAUSADO: 'EN PAUSA',
    STATUS_FAVORITOS: 'FAVORITOS',
    STATUS_TUDO: 'TODO',

    ADD_REVIEW: 'Nueva Reseña',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
    FAVORITE: 'Fijar Favorito',
    RATING: 'Mi Calificación',
    READ_MORE: 'Leer Registro Completo',
    CLOSE: 'Cerrar',
    EMPTY_LIBRARY: 'Estantería Vacía',
    EMPTY_LIBRARY_SUB: '¡Comienza agregando una reseña de tu libro actual o explora recomendaciones!',

    FORM_ADD_TITLE: 'Nuevo Registro de Obra',
    FORM_EDIT_TITLE: 'Editar Registro de Obra',
    BOOK_TITLE: 'Título del Libro',
    BOOK_AUTHOR: 'Autor(a)',
    BOOK_STATUS: 'Estado de la Lectura',
    BOOK_RATING: 'Calificación / Estrellas',
    BOOK_COVER_URL: 'Enlace de la Portada (opcional)',
    BOOK_COVER_PRESET: 'Usar Portada Elegante Preestablecida',
    BOOK_REVIEW_TEXT: 'Crítica Literaria & Notas Personales',
    BOOK_TAGS: 'Géneros / Etiquetas (separadas por comas)',
    BOOK_FAVORITE: 'Marcar como Obra Favorita',
    CANCEL: 'Cancelar',
    SAVE: 'Guardar Reseña',
    SAVE_CHANGES: 'Guardar Cambios',

    QUOTE_DAY_TITLE: 'Cita Inspiradora',
    NEXT_INSPIRATION: 'Próxima inspiración',
    ADD_TO_SHELF: 'Añadir a Estantería',
    DID_YOU_KNOW: '¿Sabías que?',
    DID_YOU_KNOW_TEXT: '¡Estudios de lectura demuestran que leer tan solo **15 minutos al día** reduce el estrés hasta un **68%** y te expone a cerca de **1 millón de palabras nuevas al año**!',
    RECOMMENDED_BOOKS: 'Obras Recomendadas y Populares',

    JOURNAL_TITLE: 'Diario de Citas y Fragmentos',
    JOURNAL_SUBTITLE: 'Guarda frases memorables, pensamientos filosóficos o ideas profundas encontradas en las páginas de tus libros.',
    INSERT_QUOTE_PLACEHOLDER: 'Escribe la cita o fragmento aquí...',
    SOURCE: 'Origen de la cita (Ej: El Nombre del Viento, pág. 120)',
    ADD_QUOTE: 'Añadir al Diario',
    SAVED_QUOTES: 'Fragmentos Guardados en el Corazón',
    NO_QUOTES: 'Ningún fragmento guardado aún',
    NO_QUOTES_SUB: 'Cultiva tus pasajes favoritos mientras disfrutas de tus aventuras de lectura.',

    EDIT_PROFILE: 'Editar Perfil',
    CUSTOMIZE_SHELF: 'Personalizar Mi Estantería',
    METRICS_TITLE: 'Métricas de Mi Estantería',
    TOTAL_BOOKS: 'Total de Libros',
    FINISHED: 'Leídos / Concluidos',
    READING_NOW: 'Leyendo Ahora',
    FAVORITES_COUNT: 'Mis Favoritos',
    ANNUAL_GOAL: 'Meta Anual de Lecturas',
    ANNUAL_GOAL_SUB: 'Libros leídos hasta ahora vs meta anual',
    PROGRESS_GOAL: 'Progreso de la meta',
    LITERARY_BADGES: 'Medallas Literarias',
    PIONEER: 'Pionero de la Lectura',
    PIONEER_SUB: 'Conquistado al registrar tu primerísima reseña en la plataforma.',
    CRITIC: 'Crítico Intelectual',
    CRITIC_SUB: 'Conquistado al añadir citas inspiradoras en tu Diario de Oficio.',
    LEVEL: 'Lector Elite • Nivel 4',
    UNLOCKED: 'Conquistado',
    LOCKED: 'Bloqueado',

    TOAST_SAVED: '¡Reseña guardada con éxito!',
    TOAST_EDITED: '¡Reseña modificada con éxito!',
    TOAST_DELETED: '¡Reseña eliminada con éxito!',
    TOAST_STATUS_UPDATED: 'Estado de lectura actualizado',
    TOAST_FAV_ADDED: '¡Añadido a favoritos! ❤️',
    TOAST_FAV_REMOVED: 'Eliminado de favoritos.',
    TOAST_RECOMMENDED_ADDED: '¡Libro agregado con éxito! 🎉',
    TOAST_SAVED_ERROR: 'Error al guardar la reseña. Verifica tu conexión.',
    TOAST_DELETED_ERROR: 'Error al eliminar la reseña.',
    TOAST_UPDATE_ERROR: 'Error al actualizar los datos.',
    TOAST_QUOTE_ADDED: '¡Pasaje guardada en tu diario! ✍️',

    LOGOUT_BUTTON: 'Cerrar Sesión / Salir',
    LOGOUT_CONFIRM: 'Confirmar: ¿Deseas realmente salir?',
    NAME_EMPTY_ALERT: 'El nombre de usuario no puede quedar vacío.',
    SELECT_LANGUAGE: 'Idioma del Aplicativo',

    UNKNOWN_AUTHOR: 'Autor Desconocido',
    NO_REVIEW_TEXT: 'Aun no hay reseña redactada. Toca Editar para empezar a escribir.',
    SHOW_LESS: 'Ver menos',
    SHOW_MORE: 'Ver más...',
    YES_DELETE: 'Sí, Eliminar',
    EDIT_REVIEW: 'Editar Reseña',
    NEW_REVIEW: 'Nueva Reseña',
    SAVE_REVIEW_BUTTON: 'Guardar Reseña'
  }
};
