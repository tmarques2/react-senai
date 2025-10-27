import batmanPoster from '../assets/images/poster_batman.svg';
import batmanBanner from '../assets/images/banner-batman.jpg';

import matrixPoster from '../assets/images/poster_matrix.svg';
import matrixBanner from '../assets/images/matrix.jpg';

import malevolaPoster from '../assets/images/poster_malevola.jpg';
import malevolaBanner from '../assets/images/banner_malevola.jpg';

import interstellarPoster from '../assets/images/interstelar-poster.jpg';
import jokerPoster from '../assets/images/joker-poster.jpg';
import dunePoster from '../assets/images/poster-duna.jpg';
import avengersPoster from '../assets/images/poster-vingadores.jpg';
import crepusculoPoster from '../assets/images/crepusculo-poster.jpg';

export const movieData = [
  {
    id: 1,
    title: "Batman: O Cavaleiro das Trevas",
    description: "Quando a ameaça conhecida como o Coringa emerge de seu passado misterioso, ele causa estragos e caos. O Cavaleiro das Trevas deve aceitar um dos maiores testes psicológicos e físicos de sua capacidade de lutar contra a injustiça.",
    rating: "14",
    genres: ["Ação", "Aventura", "Drama"],
    posterUrl: batmanPoster,
    backgroundUrl: batmanBanner
  },
  {
    id: 2,
    title: "Malévola",
    description: "Uma fada vingativa é levada a amaldiçoar uma princesa recém-nascida, apenas para descobrir que a criança pode ser a única pessoa que pode restaurar a paz em sua terra conturbada.",
    rating: "10",
    genres: ["Família", "Fantasia", "Aventura"],
    posterUrl: malevolaPoster,
    backgroundUrl: malevolaBanner
  },
  {
    id: 3,
    title: "The Matrix",
    description: "Um hacker de computador aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.",
    rating: "14",
    genres: ["Ação", "Sci-Fi"],
    posterUrl: matrixPoster,
    backgroundUrl: matrixBanner
  }
];

export const featuredData = [
  {
    id: 10,
    title: "Interstellar",
    posterUrl: interstellarPoster
  },
  {
    id: 11,
    title: "Coringa",
    posterUrl: jokerPoster
  },
  {
    id: 12,
    title: "Duna",
    posterUrl: dunePoster
  },
  {
    id: 13,
    title: "Vingadores - Ultimato",
    posterUrl: avengersPoster
  },
  {
    id: 14,
    title: "Crepúsculo",
    posterUrl: crepusculoPoster
  }
];