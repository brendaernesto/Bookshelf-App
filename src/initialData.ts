import { BookReview } from './types';

export const INITIAL_REVIEWS: BookReview[] = [
  {
    id: 'gatsby-1925',
    title: 'O Grande Gatsby',
    author: 'F. Scott Fitzgerald',
    status: 'CONCLUÍDO',
    rating: 4.5,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTXCIyG5WW-24p-44X2ePkg4M7doclvwQ8yByAWDrebYKNMFtWVl8eKqI6eKTFjpWIgIAhGQzTx_X2YXxvt8QjloVNbYvRddc4k1PQFq_2b56Gd8HYwSkxDqv2YXUmgHq1_Dfe4hfMWHv-u3p50oljC-w1ZoPVoPnp9163cfBTUlr_8siUXgKBSLLD07KEwCyTuRDI98sPBj3ovWHoeYsuo7pwP7umUyCW9anZJNU0JjDE8K0GJqUYojYTsBjvpq1VwVmogUsNjYvg',
    reviewText: 'Uma análise brilhante sobre o sonho americano e a decadência social dos anos 20... O glamour e a tragédia de Jay Gatsby misturados com maestria.',
    tags: ['#Clássico', '#Drama', '#Anos20'],
    isFavorite: true,
    createdAt: new Date('2026-05-15T10:00:00Z').toISOString()
  },
  {
    id: 'shadow-and-bone-g',
    title: 'Shadow and Bone',
    author: 'Leigh Bardugo',
    status: 'LENDO',
    rating: 4.0,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvsQ8Wg4gAC9qA_SbxQuHqnMk7dpfO0KkinBqB_99b6jmVo02n7Af30wH59pZYkfKs1Cd5QlKlTIxD0QACE-SPvMFDWdeRGJ0nLdWxUXOxGnMCix9b43w9BSuk00Ub1Onrmej8gvvECHTHb6VCQsSftkepX8-J9aABs3RQJbg5nvSC8gZn9REenMZJXpft4-o4O83oyz_vdLyHIyYq0R52i7LQsYoPWp6U2hhyKUHThVfVoYNlG_xsCJEe5R72pQFdGQczjBEr-dYc',
    reviewText: 'Estou adorando o sistema de magia e o mundo Grisha. A Alina é uma protagonista interessante e cheia de potencial. A estética sombria e o mistério me fisgaram!',
    tags: ['#Fantasia', '#Grishaverse', '#Magia'],
    isFavorite: true,
    createdAt: new Date('2026-05-20T14:30:00Z').toISOString()
  },
  {
    id: 'entre-mundos-ao3',
    title: 'Entre Mundos',
    author: 'Autor Desconhecido (AO3)',
    status: 'PAUSADO',
    rating: 3.0,
    coverUrl: '', // Will render beautiful auto_stories icon block
    reviewText: 'Fanfic interessante, mas o ritmo está um pouco lento no momento. Vou esperar acumular capítulos para ler tudo de uma vez.',
    tags: ['#Fanfic', '#AO3', '#Multiverso'],
    isFavorite: false,
    createdAt: new Date('2026-05-28T09:15:00Z').toISOString()
  }
];
