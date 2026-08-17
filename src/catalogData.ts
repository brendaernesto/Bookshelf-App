export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  snippet: string;
  tags: string[];
  buyLink?: string;
  buyLinkText?: string;
}

export const POPULAR_GLOBAL_CATALOG: CatalogBook[] = [
  // Fantasia & Ficção / Fantasy
  {
    id: 'cat-hp-1',
    title: 'Harry Potter e a Pedra Filosofal',
    author: 'J.K. Rowling',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Harry Potter descobre no seu 11º aniversário que é um bruxo e parte para a mágica Escola de Hogwarts.',
    tags: ['#Fantasia', '#Magia', '#Bruxos', '#Aventura'],
    buyLink: 'https://www.google.com/search?q=comprar+harry+potter+e+a+pedra+filosofal',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-hp-2',
    title: 'Harry Potter e o Prisioneiro de Azkaban',
    author: 'J.K. Rowling',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Sirius Black escapa da prisão dos bruxos e os segredos do passado dos pais de Harry começam a vir à tona.',
    tags: ['#Fantasia', '#Magia', '#Mistério'],
    buyLink: 'https://www.google.com/search?q=comprar+harry+potter+e+o+prisioneiro+de+azkaban',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-lotr-1',
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    author: 'J.R.R. Tolkien',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'O jovem hobbit Frodo Bolseiro recebe a perigosa missão de destruir o Um Anel nas chamas da Montanha da Perdição.',
    tags: ['#AltaFantasia', '#Tolkien', '#Aventura', '#Clássico'],
    buyLink: 'https://www.google.com/search?q=comprar+a+sociedade+do+anel',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-lotr-2',
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    coverUrl: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'Bilbo Bolseiro é arrastado para uma expedição épica para recuperar o reino dos anões guardado pelo dragão Smaug.',
    tags: ['#Fantasia', '#Aventura', '#Tolkien'],
    buyLink: 'https://www.google.com/search?q=comprar+o+hobbit',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-duna-1',
    title: 'Duna',
    author: 'Frank Herbert',
    coverUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'Uma obra-prima da ficção científica que explora o planeta desértico Arrakis, a misteriosa especiaria mélânge e o destino de Paul Atreides.',
    tags: ['#FicçãoCientífica', '#SciFi', '#Espaço', '#Império'],
    buyLink: 'https://www.google.com/search?q=comprar+livro+duna',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-nome-vento',
    title: 'O Nome do Vento',
    author: 'Patrick Rothfuss',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'A jornada autobiográfica de Kvothe, desde sua infância em uma trupe de artistas até se tornar o mago mais notório do mundo.',
    tags: ['#Fantasia', '#Magia', '#Música'],
    buyLink: 'https://www.google.com/search?q=comprar+o+nome+do+vento',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-percy-1',
    title: 'Percy Jackson e o Ladrão de Raios',
    author: 'Rick Riordan',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'Percy Jackson descobre que é um semideus filho de Poseidon e é acusado injustamente de roubar o raio-mestre de Zeus.',
    tags: ['#Mitologia', '#Aventura', '#Jovens'],
    buyLink: 'https://www.google.com/search?q=comprar+o+ladrao+de+raios',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-1984',
    title: '1984',
    author: 'George Orwell',
    coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Um clássico distópico atemporal sobre vigilância totalitária, censura, controle de pensamento e o Grande Irmão.',
    tags: ['#Distopia', '#Clássico', '#Filosofia'],
    buyLink: 'https://www.google.com/search?q=comprar+1984+george+orwell',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-revolucao-bichos',
    title: 'A Revolução dos Bichos',
    author: 'George Orwell',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'Uma fábula alegórica brilhante e satírica sobre o poder, corrupção e revoluções políticas.',
    tags: ['#Clássico', '#Política', '#Sátira'],
    buyLink: 'https://www.google.com/search?q=comprar+a+revolucao+dos+bichos',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-pequeno-principe',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Uma poética lição de humanidade, amor e amizade sobre um principezinho vindo do asteroide B 612.',
    tags: ['#Poesia', '#Clássico', '#Filosofia'],
    buyLink: 'https://www.google.com/search?q=comprar+o+pequeno+principe',
    buyLinkText: 'Comprar Livro'
  },

  // Literatura Brasileira / Brazilian Classics & Modern
  {
    id: 'cat-dom-casmurro',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Bentinho e os famosos olhos de ressaca de Capitu em um dos maiores mistérios e romances psicológicos da literatura brasileira.',
    tags: ['#LiteraturaBR', '#Clássico', '#Realismo'],
    buyLink: 'https://www.google.com/search?q=comprar+dom+casmurro',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-bras-cubas',
    title: 'Memórias Póstumas de Brás Cubas',
    author: 'Machado de Assis',
    coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Narrado por um defunto autor, a obra revolucionou o romance ocidental com ironia, perspicácia e críticas sociais.',
    tags: ['#LiteraturaBR', '#Clássico', '#Realismo'],
    buyLink: 'https://www.google.com/search?q=comprar+memorias+postumas+de+bras+cubas',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-torto-arado',
    title: 'Torto Arado',
    author: 'Itamar Vieira Junior',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'A emocionante história das irmãs Bibiana e Belonísia no sertão baiano, um dos maiores fenômenos contemporâneos.',
    tags: ['#LiteraturaBR', '#Contemporâneo', '#Cultura'],
    buyLink: 'https://www.google.com/search?q=comprar+torto+arado',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-hora-estrela',
    title: 'A Hora da Estrela',
    author: 'Clarice Lispector',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'A comovente e profunda história da jovem alagoana Macabéa no Rio de Janeiro, narrada pelo escritor Rodrigo S.M.',
    tags: ['#LiteraturaBR', '#ClariceLispector', '#Clássico'],
    buyLink: 'https://www.google.com/search?q=comprar+a+hora+da+estrela',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-capitaes-areia',
    title: 'Capitães da Areia',
    author: 'Jorge Amado',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'O cotidiano e as aventuras de um grupo de menores abandonados nas ruas de Salvador liderados por Pedro Bala.',
    tags: ['#LiteraturaBR', '#JorgeAmado', '#Drama'],
    buyLink: 'https://www.google.com/search?q=comprar+capitaes+da+areia',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-grande-sertao',
    title: 'Grande Sertão: Veredas',
    author: 'João Guimarães Rosa',
    coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'O jagunço Riobaldo narra suas memórias e o amor enigmático por Diadorim pelos caminhos do sertão mineiro.',
    tags: ['#LiteraturaBR', '#ObraPrima', '#Clássico'],
    buyLink: 'https://www.google.com/search?q=comprar+grande+sertao+veredas',
    buyLinkText: 'Comprar Livro'
  },

  // Romance & Drama Popular
  {
    id: 'cat-assim-acaba',
    title: 'É Assim que Acaba',
    author: 'Colleen Hoover',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
    rating: 4.7,
    snippet: 'Lily Bloom supera uma infância difícil e enfrenta escolhas dolorosas sobre amor, força e coragem ao lado de Ryle e Atlas.',
    tags: ['#Romance', '#Drama', '#Bestseller'],
    buyLink: 'https://www.google.com/search?q=comprar+e+assim+que+acaba',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-hipotese-amor',
    title: 'A Hipótese do Amor',
    author: 'Ali Hazelwood',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=300&auto=format&fit=crop',
    rating: 4.6,
    snippet: 'Olive Smith forja um namoro de mentira com o temido professor Adam Carlsen nos corredores da pós-graduação em Stanford.',
    tags: ['#Romance', '#ComédiaRomântica', '#Acadêmico'],
    buyLink: 'https://www.google.com/search?q=comprar+a+hipotese+do+amor',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-orgulho-preconceito',
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'A espirituosa Elizabeth Bennet e o orgulhoso Sr. Darcy em uma história apaixonante sobre julgamentos e sentimentos.',
    tags: ['#Clássico', '#Romance', '#JaneAusten'],
    buyLink: 'https://www.google.com/search?q=comprar+orgulho+e+preconceito',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-cem-anos-solidao',
    title: 'Cem Anos de Solidão',
    author: 'Gabriel García Márquez',
    coverUrl: 'https://images.unsplash.com/photo-1474932430478-367db26836c1?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'As sete gerações da família Buendía na mágica e inesquecível aldeia de Macondo.',
    tags: ['#RealismoMágico', '#Clássico', '#Nobel'],
    buyLink: 'https://www.google.com/search?q=comprar+cem+anos+de+solidao',
    buyLinkText: 'Comprar Livro'
  },

  // Não Ficção / Desenvolvimento / Tecnologia
  {
    id: 'cat-habitos-atomicos',
    title: 'Hábitos Atômicos',
    author: 'James Clear',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Um método comprovado e prático para criar bons hábitos, quebrar os maus e alcançar resultados surpreendentes.',
    tags: ['#Desenvolvimento', '#Produtividade', '#Hábitos'],
    buyLink: 'https://www.google.com/search?q=comprar+habitos+atomicos',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-pai-rico',
    title: 'Pai Rico, Pai Pobre',
    author: 'Robert T. Kiyosaki',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop',
    rating: 4.7,
    snippet: 'Lições fundamentais sobre inteligência financeira, investimentos e mentalidade sobre o dinheiro.',
    tags: ['#Finanças', '#EducaçãoFinanceira', '#Investimentos'],
    buyLink: 'https://www.google.com/search?q=comprar+pai+rico+pai+pobre',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-clean-code',
    title: 'Código Limpo (Clean Code)',
    author: 'Robert C. Martin (Uncle Bob)',
    coverUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'Habilidades práticas do Agile Software para criar código legível, testável e manutenível.',
    tags: ['#Programação', '#Software', '#CleanCode'],
    buyLink: 'https://www.google.com/search?q=comprar+codigo+limpo+robert+martin',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-psicologia-financeiro',
    title: 'A Psicologia Financeira',
    author: 'Morgan Housel',
    coverUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'Lições atemporais sobre como o comportamento humano e as emoções influenciam o sucesso com o dinheiro.',
    tags: ['#Finanças', '#Psicologia', '#Investimentos'],
    buyLink: 'https://www.google.com/search?q=comprar+a+psicologia+financeira',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-sapiens',
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop',
    rating: 4.9,
    snippet: 'Como uma espécie insignificante de macacos se tornou a dominadora do planeta Terra através da imaginação.',
    tags: ['#História', '#Antropologia', '#Filosofia'],
    buyLink: 'https://www.google.com/search?q=comprar+sapiens+yuval+harari',
    buyLinkText: 'Comprar Livro'
  },
  {
    id: 'cat-rapido-devagar',
    title: 'Rápido e Devagar: Duas Formas de Pensar',
    author: 'Daniel Kahneman',
    coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=300&auto=format&fit=crop',
    rating: 4.8,
    snippet: 'O vencedor do Nobel examina a mente humana e os dois sistemas que conduzem o modo como tomamos decisões.',
    tags: ['#Psicologia', '#Ciência', '#Economia'],
    buyLink: 'https://www.google.com/search?q=comprar+rapido+e+devagar+kahneman',
    buyLinkText: 'Comprar Livro'
  }
];

/**
 * Searches the catalog with high-speed fuzzy/sub-string matching
 */
export function searchLocalCatalog(query: string, limit: number = 8): CatalogBook[] {
  if (!query || !query.trim()) return [];
  const cleanQ = query.toLowerCase().trim();
  const tokens = cleanQ.split(/\s+/).filter(t => t.length > 0);

  return POPULAR_GLOBAL_CATALOG.filter((book) => {
    const titleLower = book.title.toLowerCase();
    const authorLower = book.author.toLowerCase();
    const tagsLower = book.tags.map(t => t.toLowerCase()).join(' ');

    // Match if all tokens appear somewhere in title, author, or tags
    return tokens.every(token => 
      titleLower.includes(token) || 
      authorLower.includes(token) || 
      tagsLower.includes(token)
    );
  }).slice(0, limit);
}
