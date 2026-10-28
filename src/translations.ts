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
  LOGIN_WITH_APPLE: string;
  LOGIN_WITH_OUTLOOK: string;
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
  SELECT_THEME: string;
  THEME_LIGHT: string;
  THEME_DARK: string;
  THEME_DESCRIPTION: string;

  // Additional Helper Labels & Tooltips
  UNKNOWN_AUTHOR: string;
  NO_REVIEW_TEXT: string;
  SHOW_LESS: string;
  SHOW_MORE: string;
  YES_DELETE: string;
  EDIT_REVIEW: string;
  NEW_REVIEW: string;
  SAVE_REVIEW_BUTTON: string;
  
  // Specific Visual & i18n Keys
  SEARCH_BUTTON_TOOLTIP_EMPTY: string;
  SEARCH_BUTTON_TOOLTIP_ACTIVE: string;
  FAVORITE_ADD_TOOLTIP: string;
  FAVORITE_REMOVE_TOOLTIP: string;
  NO_COVER: string;
  PLACEHOLDER_BOOK_REF: string;
  PLACEHOLDER_PAGE: string;
  PLACEHOLDER_CHAPTER: string;
  QUOTE_EDIT_MODE: string;
  QUOTE_CANCEL_EDIT: string;
  QUOTE_EDIT_TITLE: string;
  QUOTE_REFLECT_TITLE: string;
  QUOTE_REFERENCE_LABEL: string;
  QUOTE_PAGE_LABEL: string;
  QUOTE_CHAPTER_LABEL: string;
  QUOTE_TEXT_LABEL: string;
  QUOTE_LOADING: string;
  QUOTE_ERROR_SAVE: string;
  NO_BOOKS_FOUND: string;
  NO_BOOKS_MATCHING: string;
  SEARCH_GLOBAL_PROMPT: string;
  ADDED_FROM_EXPLORE: string;
  TOAST_BOOK_ADDED_DETAILS: string;
  PRESET_COVER_TITLE: string;
  UPLOAD_COVER: string;
  USE_PRESET_COVERS: string;
  INSERT_IMAGE_LINK: string;
  SELECT_THEMATIC_IMAGE: string;
  PASTE_COVER_LINK: string;
  BOOK_TITLE_LABEL: string;
  AUTHOR_NAME_LABEL: string;
  PLACEHOLDER_BOOK_TITLE: string;
  PLACEHOLDER_BOOK_AUTHOR: string;
  GENRES_TAGS_LABEL: string;
  ADD_TAG_PLACEHOLDER: string;
  TAG_TIP: string;
  YOUR_CUSTOM_REVIEW: string;
  REVIEW_PLACEHOLDER: string;

  // Library Enhancements (Step 3)
  SORT_BY: string;
  SORT_RATING: string;
  SORT_DATE: string;
  SORT_TITLE: string;
  SORT_AUTHOR: string;
  STATUS_QUERO_LER: string;
  STATUS_LENDO_LABEL: string;
  STATUS_TERMINADO_LABEL: string;
  TAB_ALL: string;
  TAB_READING: string;
  TAB_FINISHED: string;
  TAB_FAVORITES: string;
  WRITE_REVIEW: string;
  UNDO: string;
  BOOK_DELETED_TOAST: string;
  FILTERED_BY_TAG: string;
  CLEAR_FILTER: string;
  NO_BOOKS_FOR_QUERY: string;
  NO_BOOKS_FOR_TAG: string;
  PAGES_PROGRESS: string;
  PAGES_OF: string;
  EDIT_PROGRESS: string;
  TOTAL_PAGES: string;
  SAVE_PROGRESS: string;
  MORE_ACTIONS: string;
  ACTION_UNDONE: string;

  // Quotes Journal & Explore Enhancements (Step 4 & 5)
  CHARACTERS: string;
  REQUIRED_FIELD: string;
  ERROR_QUOTE_REQUIRED: string;
  ERROR_BOOK_REQUIRED: string;
  AUTOCOMPLETE_CUSTOM_BOOK: string;
  MY_LIBRARY_BOOKS: string;
  FILTER_BY_BOOK: string;
  ALL_BOOKS_FILTER: string;
  SEARCH_QUOTES_PLACEHOLDER: string;
  NO_QUOTES_MATCH: string;
  SHARE_IMAGE: string;
  GENERATING_CARD: string;
  COPY_QUOTE: string;
  QUOTE_COPIED: string;
  YEAR_LABEL: string;
  TRY_AGAIN: string;
  IN_YOUR_SHELF: string;
  SELECT_STATUS_PROMPT: string;
  SEARCH_ERROR_OCCURRED: string;
  NAVIGATE_SUGGESTIONS_HINT: string;

  // Profile Enhancements (Step 6)
  PAGES_READ: string;
  AVG_RATING: string;
  TOP_GENRES: string;
  READING_STREAK: string;
  DAYS_LABEL: string;
  NO_GENRES_YET: string;
  DAILY_PAGES_GOAL: string;
  PAGES_PER_DAY: string;
  GOAL_COMPLETED: string;
  BOOKS_GOAL_LABEL: string;
  LEVEL_MODAL_TITLE: string;
  CURRENT_XP: string;
  XP_TO_NEXT_LEVEL: string;
  HOW_TO_EARN_XP: string;
  XP_FINISH_BOOK: string;
  XP_WRITE_REVIEW: string;
  XP_SAVE_QUOTE: string;
  XP_FAVORITE_BOOK: string;
  XP_MAINTAIN_GOAL: string;
  ELITE_READER_DESC: string;
  MONTHLY_CHART_TITLE: string;
  MONTHLY_CHART_SUB: string;
  DATA_SECTION_TITLE: string;
  DATA_SECTION_SUB: string;
  EXPORT_JSON: string;
  EXPORT_CSV: string;
  IMPORT_BACKUP: string;
  CONFIRM_IMPORT_TITLE: string;
  CONFIRM_IMPORT_MSG: string;
  CONFIRM_IMPORT_BUTTON: string;
  IMPORT_SUCCESS: string;
  IMPORT_ERROR: string;
  MONTH_NAMES_SHORT: string[];

  // Accessibility & Polishing (Step 7 & 8)
  UNFAVORITE: string;
  CLOSE_MODAL: string;
  ADJUST_PAGES_MINUS: string;
  ADJUST_PAGES_PLUS: string;
  CLEAR_SEARCH_BUTTON: string;
  TOGGLE_THEME: string;
  LOADING_DATA: string;
  OFFLINE_MODE_NOTICE: string;
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
    LOGIN_WITH_APPLE: 'Entrar com a Apple',
    LOGIN_WITH_OUTLOOK: 'Entrar com o Outlook',
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
    SELECT_THEME: 'Tema do Aplicativo',
    THEME_LIGHT: 'Tema Claro (Lilás & Violeta)',
    THEME_DARK: 'Tema Escuro (Espacial)',
    THEME_DESCRIPTION: 'Alterne entre o tema espacial escuro ou o tema suave lilás e violeta.',

    UNKNOWN_AUTHOR: 'Autor Desconhecido',
    NO_REVIEW_TEXT: 'Nenhuma resenha inserida ainda. Toque em Editar para escrever uma.',
    SHOW_LESS: 'Ver menos',
    SHOW_MORE: 'Ver mais...',
    YES_DELETE: 'Sim, Excluir',
    EDIT_REVIEW: 'Editar Avaliação',
    NEW_REVIEW: 'Nova Avaliação',
    SAVE_REVIEW_BUTTON: 'Salvar Avaliação',

    // Specific Visual & i18n Keys
    SEARCH_BUTTON_TOOLTIP_EMPTY: 'Digite o título, autor ou assunto para buscar',
    SEARCH_BUTTON_TOOLTIP_ACTIVE: 'Buscar obras no acervo mundial',
    FAVORITE_ADD_TOOLTIP: 'Adicionar aos favoritos',
    FAVORITE_REMOVE_TOOLTIP: 'Remover dos favoritos',
    NO_COVER: 'Sem Capa',
    PLACEHOLDER_BOOK_REF: 'Ex: O Grande Gatsby',
    PLACEHOLDER_PAGE: 'Ex: 42',
    PLACEHOLDER_CHAPTER: 'Ex: Capítulo 3',
    QUOTE_EDIT_MODE: 'Modo de Edição',
    QUOTE_CANCEL_EDIT: 'Cancelar / Sair',
    QUOTE_EDIT_TITLE: 'Editar Anotação',
    QUOTE_REFLECT_TITLE: 'Refletir sobre a Leitura',
    QUOTE_REFERENCE_LABEL: 'Livro Referência *',
    QUOTE_PAGE_LABEL: 'Página',
    QUOTE_CHAPTER_LABEL: 'Capítulo',
    QUOTE_TEXT_LABEL: 'Trecho / Citação do Coração *',
    QUOTE_LOADING: 'Carregando anotações...',
    QUOTE_ERROR_SAVE: 'Erro ao salvar anotação.',
    NO_BOOKS_FOUND: 'Nenhum livro encontrado',
    NO_BOOKS_MATCHING: 'Nenhum livro encontrado na sua estante com esses termos.',
    SEARCH_GLOBAL_PROMPT: 'Buscar no Acervo Global 🌐',
    ADDED_FROM_EXPLORE: 'Adicionado do Explorar.',
    TOAST_BOOK_ADDED_DETAILS: 'Livro adicionado! Configure seus detalhes ou escreva sua resenha.',
    PRESET_COVER_TITLE: 'Capa da Obra',
    UPLOAD_COVER: 'Upload de Imagem',
    USE_PRESET_COVERS: 'Usar Capas Ilustrativas',
    INSERT_IMAGE_LINK: 'Inserir Link da Imagem',
    SELECT_THEMATIC_IMAGE: 'Selecione uma Imagem Temática',
    PASTE_COVER_LINK: 'Cole o link da capa (HTTP/HTTPS):',
    BOOK_TITLE_LABEL: 'Título da Obra *',
    AUTHOR_NAME_LABEL: 'Nome do Autor',
    PLACEHOLDER_BOOK_TITLE: 'Ex: O Nome do Vento',
    PLACEHOLDER_BOOK_AUTHOR: 'Ex: Patrick Rothfuss',
    GENRES_TAGS_LABEL: 'Gêneros, Tags e Tropes',
    ADD_TAG_PLACEHOLDER: 'Adicionar tag (ex: #Romance, #Fantasia)',
    TAG_TIP: 'Dica: Digite a tag e pressione Enter, vírgula ou clique no botão + para adicionar.',
    YOUR_CUSTOM_REVIEW: 'Sua Resenha Personalizada',
    REVIEW_PLACEHOLDER: 'O que você achou dessa leitura?',

    // Library Enhancements (Step 3)
    SORT_BY: 'Ordenar por',
    SORT_RATING: 'Maior Nota',
    SORT_DATE: 'Mais Recentes',
    SORT_TITLE: 'Título (A-Z)',
    SORT_AUTHOR: 'Autor (A-Z)',
    STATUS_QUERO_LER: 'Quero ler',
    STATUS_LENDO_LABEL: 'Lendo',
    STATUS_TERMINADO_LABEL: 'Terminei',
    TAB_ALL: 'Tudo',
    TAB_READING: 'Lendo',
    TAB_FINISHED: 'Terminei',
    TAB_FAVORITES: 'Favoritos',
    WRITE_REVIEW: 'Escrever review',
    UNDO: 'Desfazer',
    BOOK_DELETED_TOAST: 'Livro excluído',
    FILTERED_BY_TAG: 'Filtrando por tag',
    CLEAR_FILTER: 'Limpar filtro',
    NO_BOOKS_FOR_QUERY: 'Nenhum livro encontrado para',
    NO_BOOKS_FOR_TAG: 'Nenhum livro com a tag',
    PAGES_PROGRESS: 'Páginas lidas',
    PAGES_OF: 'de',
    EDIT_PROGRESS: 'Atualizar progresso',
    TOTAL_PAGES: 'Total de páginas',
    SAVE_PROGRESS: 'Salvar progresso',
    MORE_ACTIONS: 'Mais opções',
    ACTION_UNDONE: 'Ação desfeita com sucesso!',

    // Quotes Journal & Explore Enhancements (Step 4 & 5)
    CHARACTERS: 'caracteres',
    REQUIRED_FIELD: 'Campo obrigatório',
    ERROR_QUOTE_REQUIRED: 'Por favor, digite a citação ou passagem.',
    ERROR_BOOK_REQUIRED: 'Por favor, informe o livro de referência.',
    AUTOCOMPLETE_CUSTOM_BOOK: 'Usar livro digitado',
    MY_LIBRARY_BOOKS: 'Livros da sua estante',
    FILTER_BY_BOOK: 'Filtrar por livro',
    ALL_BOOKS_FILTER: 'Todos os livros',
    SEARCH_QUOTES_PLACEHOLDER: 'Buscar nas citações salvas...',
    NO_QUOTES_MATCH: 'Nenhuma citação encontrada com os filtros atuais.',
    SHARE_IMAGE: 'Compartilhar como imagem',
    GENERATING_CARD: 'Gerando cartão...',
    COPY_QUOTE: 'Copiar citação',
    QUOTE_COPIED: 'Citação copiada!',
    YEAR_LABEL: 'Ano',
    TRY_AGAIN: 'Tentar novamente',
    IN_YOUR_SHELF: 'Na sua estante',
    SELECT_STATUS_PROMPT: 'Adicionar como:',
    SEARCH_ERROR_OCCURRED: 'Ocorreu um erro ao consultar o catálogo de livros.',
    NAVIGATE_SUGGESTIONS_HINT: 'Use ↑ ↓ para navegar e Enter para selecionar',

    // Profile Enhancements (Step 6)
    PAGES_READ: 'Páginas Lidas',
    AVG_RATING: 'Média das Notas',
    TOP_GENRES: 'Gêneros Mais Lidos',
    READING_STREAK: 'Dias Lendo',
    DAYS_LABEL: 'dias',
    NO_GENRES_YET: 'Adicione tags aos seus livros',
    DAILY_PAGES_GOAL: 'Meta Diária de Leitura',
    PAGES_PER_DAY: 'páginas/dia',
    GOAL_COMPLETED: 'Concluído',
    BOOKS_GOAL_LABEL: 'livros',
    LEVEL_MODAL_TITLE: 'Seu Nível & Pontos de XP',
    CURRENT_XP: 'XP Atual',
    XP_TO_NEXT_LEVEL: 'para o Nível',
    HOW_TO_EARN_XP: 'Como Ganhar Mais XP',
    XP_FINISH_BOOK: 'Terminar um livro (+100 XP)',
    XP_WRITE_REVIEW: 'Escrever uma resenha (+40 XP)',
    XP_SAVE_QUOTE: 'Salvar citação no diário (+25 XP)',
    XP_FAVORITE_BOOK: 'Favoritar um livro (+15 XP)',
    XP_MAINTAIN_GOAL: 'Atingir meta diária (+10 XP)',
    ELITE_READER_DESC: 'Você atingiu a categoria de Leitor de Elite! Continue acumulando leituras para alcançar novos patamares na comunidade.',
    MONTHLY_CHART_TITLE: 'Livros Concluídos por Mês',
    MONTHLY_CHART_SUB: 'Ritmo de leitura ao longo do ano atual',
    DATA_SECTION_TITLE: 'Dados & Backup da Estante',
    DATA_SECTION_SUB: 'Exporte sua biblioteca para segurança pessoal ou importe dados anteriores a qualquer instante.',
    EXPORT_JSON: 'Exportar JSON',
    EXPORT_CSV: 'Exportar CSV',
    IMPORT_BACKUP: 'Importar Backup',
    CONFIRM_IMPORT_TITLE: 'Restaurar Backup da Estante',
    CONFIRM_IMPORT_MSG: 'Tem certeza de que deseja restaurar este backup? Todos os livros e dados atuais serão substituídos pelos do arquivo.',
    CONFIRM_IMPORT_BUTTON: 'Sim, Restaurar Dados',
    IMPORT_SUCCESS: 'Estante restaurada com sucesso!',
    IMPORT_ERROR: 'Arquivo de backup inválido. Verifique o formato JSON exportado.',
    MONTH_NAMES_SHORT: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],

    UNFAVORITE: 'Remover dos favoritos',
    CLOSE_MODAL: 'Fechar modal',
    ADJUST_PAGES_MINUS: 'Subtrair 10 páginas',
    ADJUST_PAGES_PLUS: 'Adicionar 10 páginas',
    CLEAR_SEARCH_BUTTON: 'Limpar texto de pesquisa',
    TOGGLE_THEME: 'Alternar tema de cores',
    LOADING_DATA: 'Carregando acervo...',
    OFFLINE_MODE_NOTICE: 'Você está no modo offline. As alterações serão sincronizadas assim que a conexão retornar.'
  },
  en: {
    LIBRARY: 'Library',
    EXPLORE: 'Explore',
    WRITING: 'Writing',
    PROFILE: 'Profile',

    SEARCH_PLACEHOLDER: 'Search books, authors or personal notes on my shelf...',
    APP_SLOGAN: 'Your silent sanctuary to organize and cultivate readings',
    WELCOME_BACK: 'Welcome Back',
    LOGIN_SUBTITLE: 'Sign in to access your digital bookshelf of reviews and quotes.',
    LOGIN_WITH_GOOGLE: 'Continue with Google',
    LOGIN_WITH_APPLE: 'Continue with Apple',
    LOGIN_WITH_OUTLOOK: 'Continue with Outlook',
    OR_USE_NAME: 'or enter name',
    CREATE_CUSTOM_SHELF: 'Create Custom Shelf',
    YOUR_NAME: 'Your Name / Nickname',
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
    READ_MORE: 'Read Full Log',
    CLOSE: 'Close',
    EMPTY_LIBRARY: 'Empty Shelf',
    EMPTY_LIBRARY_SUB: 'Start by logging your current reading or discover books in Explore!',

    FORM_ADD_TITLE: 'New Book Record',
    FORM_EDIT_TITLE: 'Edit Book Record',
    BOOK_TITLE: 'Book Title',
    BOOK_AUTHOR: 'Author',
    BOOK_STATUS: 'Reading Status',
    BOOK_RATING: 'Rating / Stars',
    BOOK_COVER_URL: 'Cover Link (optional)',
    BOOK_COVER_PRESET: 'Pick a Beautiful Cover',
    BOOK_REVIEW_TEXT: 'Literary Review & Notes',
    BOOK_TAGS: 'Genres / Keywords (comma separated)',
    BOOK_FAVORITE: 'Mark as Favorite Book',
    CANCEL: 'Cancel',
    SAVE: 'Save Review',
    SAVE_CHANGES: 'Save Changes',

    QUOTE_DAY_TITLE: 'Inspiring Quote',
    NEXT_INSPIRATION: 'Next inspiration',
    ADD_TO_SHELF: 'Add to Shelf',
    DID_YOU_KNOW: 'Did you know?',
    DID_YOU_KNOW_TEXT: 'Reading just **15 minutes every day** can reduce stress by up to **68%** and expose you to around **1 million words per year**!',
    RECOMMENDED_BOOKS: 'Recommended & Popular Books',

    JOURNAL_TITLE: 'Quotes & Fragments Journal',
    JOURNAL_SUBTITLE: 'Save memorable passages, deep philosophies, or insights gathered from the pages you read.',
    INSERT_QUOTE_PLACEHOLDER: 'Write the quote or excerpt here...',
    SOURCE: 'Source (e.g. The Name of the Wind, page 120)',
    ADD_QUOTE: 'Add to Journal',
    SAVED_QUOTES: 'Fragments Kept in Heart',
    NO_QUOTES: 'No quotes recorded yet',
    NO_QUOTES_SUB: 'Cherish favorite phrases as you travel through literature.',

    EDIT_PROFILE: 'Edit Profile',
    CUSTOMIZE_SHELF: 'Customize My Shelf',
    METRICS_TITLE: 'My Shelf Metrics',
    TOTAL_BOOKS: 'Total Books',
    FINISHED: 'Finished / Read',
    READING_NOW: 'Reading Now',
    FAVORITES_COUNT: 'My Favorites',
    ANNUAL_GOAL: 'Annual Reading Goal',
    ANNUAL_GOAL_SUB: 'Books finished so far vs annual goal',
    PROGRESS_GOAL: 'Goal progress',
    LITERARY_BADGES: 'Literary Badges',
    PIONEER: 'Reading Pioneer',
    PIONEER_SUB: 'Awarded after logging your first book review in Bookshelf.',
    CRITIC: 'Intellectual Critic',
    CRITIC_SUB: 'Awarded when capturing memorable passages in your Writing journal.',
    LEVEL: 'Elite Reader • Level 4',
    UNLOCKED: 'Unlocked',
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
    SELECT_THEME: 'App Theme',
    THEME_LIGHT: 'Light Theme (Lilac & Violet)',
    THEME_DARK: 'Dark Theme (Cosmic)',
    THEME_DESCRIPTION: 'Choose between the cosmic dark theme and the soft lilac & dark violet theme.',

    UNKNOWN_AUTHOR: 'Unknown Author',
    NO_REVIEW_TEXT: 'No review text has been added yet. Tap Edit to start writing.',
    SHOW_LESS: 'Show less',
    SHOW_MORE: 'Show more...',
    YES_DELETE: 'Yes, Delete',
    EDIT_REVIEW: 'Edit Review',
    NEW_REVIEW: 'New Review',
    SAVE_REVIEW_BUTTON: 'Save Review',

    // Specific Visual & i18n Keys
    SEARCH_BUTTON_TOOLTIP_EMPTY: 'Type a title, author, or keyword to search',
    SEARCH_BUTTON_TOOLTIP_ACTIVE: 'Search books across global catalog',
    FAVORITE_ADD_TOOLTIP: 'Add to favorites',
    FAVORITE_REMOVE_TOOLTIP: 'Remove from favorites',
    NO_COVER: 'No Cover',
    PLACEHOLDER_BOOK_REF: 'Ex: The Great Gatsby',
    PLACEHOLDER_PAGE: 'Ex: 42',
    PLACEHOLDER_CHAPTER: 'Ex: Chapter 3',
    QUOTE_EDIT_MODE: 'Edit Mode',
    QUOTE_CANCEL_EDIT: 'Cancel / Exit',
    QUOTE_EDIT_TITLE: 'Edit Note',
    QUOTE_REFLECT_TITLE: 'Reflect on Reading',
    QUOTE_REFERENCE_LABEL: 'Reference Book *',
    QUOTE_PAGE_LABEL: 'Page',
    QUOTE_CHAPTER_LABEL: 'Chapter',
    QUOTE_TEXT_LABEL: 'Quote / Passage from the Heart *',
    QUOTE_LOADING: 'Loading notes...',
    QUOTE_ERROR_SAVE: 'Error saving note.',
    NO_BOOKS_FOUND: 'No books found',
    NO_BOOKS_MATCHING: 'No books found in your shelf matching this query.',
    SEARCH_GLOBAL_PROMPT: 'Search in Global Catalog 🌐',
    ADDED_FROM_EXPLORE: 'Added from Explore.',
    TOAST_BOOK_ADDED_DETAILS: 'Book added! Configure its details or write your review.',
    PRESET_COVER_TITLE: 'Book Cover',
    UPLOAD_COVER: 'Upload Image',
    USE_PRESET_COVERS: 'Use Preset Covers',
    INSERT_IMAGE_LINK: 'Insert Image Link',
    SELECT_THEMATIC_IMAGE: 'Select a Thematic Image',
    PASTE_COVER_LINK: 'Paste cover link (HTTP/HTTPS):',
    BOOK_TITLE_LABEL: 'Book Title *',
    AUTHOR_NAME_LABEL: 'Author Name',
    PLACEHOLDER_BOOK_TITLE: 'Ex: The Name of the Wind',
    PLACEHOLDER_BOOK_AUTHOR: 'Ex: Patrick Rothfuss',
    GENRES_TAGS_LABEL: 'Genres, Tags and Topics',
    ADD_TAG_PLACEHOLDER: 'Add tag (e.g. #Romance, #Fantasy)',
    TAG_TIP: 'Tip: Type the tag and press Enter, comma or click + to add.',
    YOUR_CUSTOM_REVIEW: 'Your Custom Review',
    REVIEW_PLACEHOLDER: 'What did you think of this read?',

    // Library Enhancements (Step 3)
    SORT_BY: 'Sort by',
    SORT_RATING: 'Highest Rating',
    SORT_DATE: 'Recently Added',
    SORT_TITLE: 'Title (A-Z)',
    SORT_AUTHOR: 'Author (A-Z)',
    STATUS_QUERO_LER: 'Want to read',
    STATUS_LENDO_LABEL: 'Reading',
    STATUS_TERMINADO_LABEL: 'Finished',
    TAB_ALL: 'All',
    TAB_READING: 'Reading',
    TAB_FINISHED: 'Finished',
    TAB_FAVORITES: 'Favorites',
    WRITE_REVIEW: 'Write review',
    UNDO: 'Undo',
    BOOK_DELETED_TOAST: 'Book deleted',
    FILTERED_BY_TAG: 'Filtered by tag',
    CLEAR_FILTER: 'Clear filter',
    NO_BOOKS_FOR_QUERY: 'No books found for',
    NO_BOOKS_FOR_TAG: 'No books with tag',
    PAGES_PROGRESS: 'Pages read',
    PAGES_OF: 'of',
    EDIT_PROGRESS: 'Update progress',
    TOTAL_PAGES: 'Total pages',
    SAVE_PROGRESS: 'Save progress',
    MORE_ACTIONS: 'More options',
    ACTION_UNDONE: 'Action undone successfully!',

    // Quotes Journal & Explore Enhancements (Step 4 & 5)
    CHARACTERS: 'characters',
    REQUIRED_FIELD: 'Required field',
    ERROR_QUOTE_REQUIRED: 'Please write the quote or passage.',
    ERROR_BOOK_REQUIRED: 'Please specify the reference book.',
    AUTOCOMPLETE_CUSTOM_BOOK: 'Use entered book',
    MY_LIBRARY_BOOKS: 'Books from your shelf',
    FILTER_BY_BOOK: 'Filter by book',
    ALL_BOOKS_FILTER: 'All books',
    SEARCH_QUOTES_PLACEHOLDER: 'Search saved quotes...',
    NO_QUOTES_MATCH: 'No quotes match current filters.',
    SHARE_IMAGE: 'Share as image',
    GENERATING_CARD: 'Generating card...',
    COPY_QUOTE: 'Copy quote',
    QUOTE_COPIED: 'Quote copied!',
    YEAR_LABEL: 'Year',
    TRY_AGAIN: 'Try again',
    IN_YOUR_SHELF: 'In your shelf',
    SELECT_STATUS_PROMPT: 'Add as:',
    SEARCH_ERROR_OCCURRED: 'An error occurred while querying the book catalog.',
    NAVIGATE_SUGGESTIONS_HINT: 'Use ↑ ↓ to navigate and Enter to select',

    // Profile Enhancements (Step 6)
    PAGES_READ: 'Pages Read',
    AVG_RATING: 'Average Rating',
    TOP_GENRES: 'Top Genres',
    READING_STREAK: 'Reading Streak',
    DAYS_LABEL: 'days',
    NO_GENRES_YET: 'Add tags to your books',
    DAILY_PAGES_GOAL: 'Daily Reading Goal',
    PAGES_PER_DAY: 'pages/day',
    GOAL_COMPLETED: 'Completed',
    BOOKS_GOAL_LABEL: 'books',
    LEVEL_MODAL_TITLE: 'Your Level & XP Progress',
    CURRENT_XP: 'Current XP',
    XP_TO_NEXT_LEVEL: 'to Level',
    HOW_TO_EARN_XP: 'How to Earn XP',
    XP_FINISH_BOOK: 'Finish a book (+100 XP)',
    XP_WRITE_REVIEW: 'Write a review (+40 XP)',
    XP_SAVE_QUOTE: 'Save a quote in journal (+25 XP)',
    XP_FAVORITE_BOOK: 'Favorite a book (+15 XP)',
    XP_MAINTAIN_GOAL: 'Hit daily goal (+10 XP)',
    ELITE_READER_DESC: 'You have reached the Elite Reader tier! Keep reading and writing notes to climb further.',
    MONTHLY_CHART_TITLE: 'Books Finished per Month',
    MONTHLY_CHART_SUB: 'Reading velocity throughout the current year',
    DATA_SECTION_TITLE: 'Data Management & Backup',
    DATA_SECTION_SUB: 'Export your library for personal backup or import previous archives anytime.',
    EXPORT_JSON: 'Export JSON',
    EXPORT_CSV: 'Export CSV',
    IMPORT_BACKUP: 'Import Backup',
    CONFIRM_IMPORT_TITLE: 'Restore Bookshelf Backup',
    CONFIRM_IMPORT_MSG: 'Are you sure you want to restore this backup? All current library data will be replaced by the imported file.',
    CONFIRM_IMPORT_BUTTON: 'Yes, Restore Data',
    IMPORT_SUCCESS: 'Bookshelf restored successfully!',
    IMPORT_ERROR: 'Invalid backup file. Please verify JSON file format.',
    MONTH_NAMES_SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    UNFAVORITE: 'Remove from favorites',
    CLOSE_MODAL: 'Close modal window',
    ADJUST_PAGES_MINUS: 'Subtract 10 pages',
    ADJUST_PAGES_PLUS: 'Add 10 pages',
    CLEAR_SEARCH_BUTTON: 'Clear search input',
    TOGGLE_THEME: 'Toggle color theme',
    LOADING_DATA: 'Loading library books...',
    OFFLINE_MODE_NOTICE: 'You are currently in offline mode. Changes are saved locally and will sync when reconnected.'
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
    LOGIN_WITH_APPLE: 'Iniciar sesión con Apple',
    LOGIN_WITH_OUTLOOK: 'Iniciar sesión con Outlook',
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
    SELECT_THEME: 'Tema de la Aplicación',
    THEME_LIGHT: 'Tema Claro (Lila y Violeta)',
    THEME_DARK: 'Tema Oscuro (Espacial)',
    THEME_DESCRIPTION: 'Selecciona entre el tema espacial oscuro o el tema lila y violeta suave.',

    UNKNOWN_AUTHOR: 'Autor Desconhecido',
    NO_REVIEW_TEXT: 'Aun no hay reseña redactada. Toca Editar para empezar a escribir.',
    SHOW_LESS: 'Ver menos',
    SHOW_MORE: 'Ver más...',
    YES_DELETE: 'Sí, Eliminar',
    EDIT_REVIEW: 'Editar Reseña',
    NEW_REVIEW: 'Nueva Reseña',
    SAVE_REVIEW_BUTTON: 'Guardar Reseña',

    // Specific Visual & i18n Keys
    SEARCH_BUTTON_TOOLTIP_EMPTY: 'Escribe un título, autor o tema para buscar',
    SEARCH_BUTTON_TOOLTIP_ACTIVE: 'Buscar libros en el catálogo mundial',
    FAVORITE_ADD_TOOLTIP: 'Añadir a favoritos',
    FAVORITE_REMOVE_TOOLTIP: 'Eliminar de favoritos',
    NO_COVER: 'Sin Portada',
    PLACEHOLDER_BOOK_REF: 'Ej: El Gran Gatsby',
    PLACEHOLDER_PAGE: 'Ej: 42',
    PLACEHOLDER_CHAPTER: 'Ej: Capítulo 3',
    QUOTE_EDIT_MODE: 'Modo de Edición',
    QUOTE_CANCEL_EDIT: 'Cancelar / Salir',
    QUOTE_EDIT_TITLE: 'Editar Anotación',
    QUOTE_REFLECT_TITLE: 'Reflexionar sobre la Lectura',
    QUOTE_REFERENCE_LABEL: 'Libro de Referencia *',
    QUOTE_PAGE_LABEL: 'Página',
    QUOTE_CHAPTER_LABEL: 'Capítulo',
    QUOTE_TEXT_LABEL: 'Pasaje / Cita del Corazón *',
    QUOTE_LOADING: 'Cargando anotaciones...',
    QUOTE_ERROR_SAVE: 'Error al guardar la anotación.',
    NO_BOOKS_FOUND: 'Ningún libro encontrado',
    NO_BOOKS_MATCHING: 'No se encontraron libros en tu estantería con estos términos.',
    SEARCH_GLOBAL_PROMPT: 'Buscar en el Catálogo Global 🌐',
    ADDED_FROM_EXPLORE: 'Agregado de Explorar.',
    TOAST_BOOK_ADDED_DETAILS: '¡Libro agregado! Configura sus detalles o escribe tu reseña.',
    PRESET_COVER_TITLE: 'Portada de la Obra',
    UPLOAD_COVER: 'Subir Imagen',
    USE_PRESET_COVERS: 'Usar Portadas Ilustrativas',
    INSERT_IMAGE_LINK: 'Insertar Enlace de Imagen',
    SELECT_THEMATIC_IMAGE: 'Seleccione una Imagen Temática',
    PASTE_COVER_LINK: 'Pegue el enlace de la portada (HTTP/HTTPS):',
    BOOK_TITLE_LABEL: 'Título de la Obra *',
    AUTHOR_NAME_LABEL: 'Nombre del Autor',
    PLACEHOLDER_BOOK_TITLE: 'Ej: El Nombre del Viento',
    PLACEHOLDER_BOOK_AUTHOR: 'Ej: Patrick Rothfuss',
    GENRES_TAGS_LABEL: 'Géneros, Tags y Claves',
    ADD_TAG_PLACEHOLDER: 'Añadir tag (ej: #Romance, #Fantasía)',
    TAG_TIP: 'Consejo: Escribe el tag y presiona Enter o haz clic en + para añadir.',
    YOUR_CUSTOM_REVIEW: 'Tu Reseña Personalizada',
    REVIEW_PLACEHOLDER: '¿Qué te pareció este libro?',

    // Library Enhancements (Step 3)
    SORT_BY: 'Ordenar por',
    SORT_RATING: 'Mayor Calificación',
    SORT_DATE: 'Más Recientes',
    SORT_TITLE: 'Título (A-Z)',
    SORT_AUTHOR: 'Autor (A-Z)',
    STATUS_QUERO_LER: 'Quiero leer',
    STATUS_LENDO_LABEL: 'Leyendo',
    STATUS_TERMINADO_LABEL: 'Terminado',
    TAB_ALL: 'Todo',
    TAB_READING: 'Leyendo',
    TAB_FINISHED: 'Terminados',
    TAB_FAVORITES: 'Favoritos',
    WRITE_REVIEW: 'Escribir reseña',
    UNDO: 'Deshacer',
    BOOK_DELETED_TOAST: 'Libro eliminado',
    FILTERED_BY_TAG: 'Filtrando por etiqueta',
    CLEAR_FILTER: 'Limpiar filtro',
    NO_BOOKS_FOR_QUERY: 'No se encontraron libros para',
    NO_BOOKS_FOR_TAG: 'No hay libros con la etiqueta',
    PAGES_PROGRESS: 'Páginas leídas',
    PAGES_OF: 'de',
    EDIT_PROGRESS: 'Actualizar progreso',
    TOTAL_PAGES: 'Total de páginas',
    SAVE_PROGRESS: 'Guardar progreso',
    MORE_ACTIONS: 'Más opciones',
    ACTION_UNDONE: '¡Acción deshecha con éxito!',

    // Quotes Journal & Explore Enhancements (Step 4 & 5)
    CHARACTERS: 'caracteres',
    REQUIRED_FIELD: 'Campo obligatorio',
    ERROR_QUOTE_REQUIRED: 'Por favor, escribe la cita o pasaje.',
    ERROR_BOOK_REQUIRED: 'Por favor, indica el libro de referencia.',
    AUTOCOMPLETE_CUSTOM_BOOK: 'Usar libro escrito',
    MY_LIBRARY_BOOKS: 'Libros de tu estantería',
    FILTER_BY_BOOK: 'Filtrar por libro',
    ALL_BOOKS_FILTER: 'Todos los libros',
    SEARCH_QUOTES_PLACEHOLDER: 'Buscar en citas guardadas...',
    NO_QUOTES_MATCH: 'No se encontraron citas con los filtros actuales.',
    SHARE_IMAGE: 'Compartir como imagen',
    GENERATING_CARD: 'Generando tarjeta...',
    COPY_QUOTE: 'Copiar cita',
    QUOTE_COPIED: '¡Cita copiada!',
    YEAR_LABEL: 'Año',
    TRY_AGAIN: 'Reintentar',
    IN_YOUR_SHELF: 'En tu estantería',
    SELECT_STATUS_PROMPT: 'Añadir como:',
    SEARCH_ERROR_OCCURRED: 'Ocurrió un error al consultar el catálogo de libros.',
    NAVIGATE_SUGGESTIONS_HINT: 'Usa ↑ ↓ para navegar y Enter para seleccionar',

    // Profile Enhancements (Step 6)
    PAGES_READ: 'Páginas Leídas',
    AVG_RATING: 'Calificación Promedio',
    TOP_GENRES: 'Géneros Más Leídos',
    READING_STREAK: 'Días Leyendo',
    DAYS_LABEL: 'días',
    NO_GENRES_YET: 'Añade etiquetas a tus libros',
    DAILY_PAGES_GOAL: 'Meta Diaria de Lectura',
    PAGES_PER_DAY: 'páginas/día',
    GOAL_COMPLETED: 'Completado',
    BOOKS_GOAL_LABEL: 'libros',
    LEVEL_MODAL_TITLE: 'Tu Nivel y Puntos de XP',
    CURRENT_XP: 'XP Actual',
    XP_TO_NEXT_LEVEL: 'para el Nivel',
    HOW_TO_EARN_XP: 'Cómo Ganar Más XP',
    XP_FINISH_BOOK: 'Terminar un libro (+100 XP)',
    XP_WRITE_REVIEW: 'Escribir una reseña (+40 XP)',
    XP_SAVE_QUOTE: 'Guardar cita en el diario (+25 XP)',
    XP_FAVORITE_BOOK: 'Marcar libro como favorito (+15 XP)',
    XP_MAINTAIN_GOAL: 'Alcanzar meta diaria (+10 XP)',
    ELITE_READER_DESC: '¡Has alcanzado la categoría de Lector Élite! Continúa leyendo para alcanzar nuevas metas en la comunidad.',
    MONTHLY_CHART_TITLE: 'Libros Terminados por Mes',
    MONTHLY_CHART_SUB: 'Ritmo de lectura a lo largo del año actual',
    DATA_SECTION_TITLE: 'Gestión de Datos y Copias',
    DATA_SECTION_SUB: 'Exporta tu biblioteca para seguridad personal o importa copias previas en cualquier momento.',
    EXPORT_JSON: 'Exportar JSON',
    EXPORT_CSV: 'Exportar CSV',
    IMPORT_BACKUP: 'Importar Copia',
    CONFIRM_IMPORT_TITLE: 'Restaurar Copia de Seguridad',
    CONFIRM_IMPORT_MSG: '¿Estás seguro de que deseas restaurar esta copia? Todos los libros y datos actuales serán reemplazados por los del archivo.',
    CONFIRM_IMPORT_BUTTON: 'Sí, Restaurar Datos',
    IMPORT_SUCCESS: '¡Estantería restaurada con éxito!',
    IMPORT_ERROR: 'Archivo de copia no válido. Verifica el formato JSON exportado.',
    MONTH_NAMES_SHORT: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],

    UNFAVORITE: 'Quitar de favoritos',
    CLOSE_MODAL: 'Cerrar ventana modal',
    ADJUST_PAGES_MINUS: 'Restar 10 páginas',
    ADJUST_PAGES_PLUS: 'Sumar 10 páginas',
    CLEAR_SEARCH_BUTTON: 'Limpiar búsqueda',
    TOGGLE_THEME: 'Alternar tema de color',
    LOADING_DATA: 'Cargando biblioteca...',
    OFFLINE_MODE_NOTICE: 'Estás en modo sin conexión. Los cambios se guardan localmente.'
  }
};
