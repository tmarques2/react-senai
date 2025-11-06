// src/data/movieData.js (VERSÃO CORRETA E FINAL)

import batmanPoster from '../assets/images/poster-batman.jpg';
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

// Este é o carrossel TOP 3 (Hero)
export const movieData = [
  {
    // Batman agora aponta para o ID 3
    id: 3, 
    title: "Batman: O Cavaleiro das Trevas",
    description: "Quando a ameaça conhecida como o Coringa emerge de seu passado misterioso, ele causa estragos e caos. O Cavaleiro das Trevas deve aceitar um dos maiores testes psicológicos e físicos de sua capacidade de lutar contra a injustiça.",
    rating: "14",
    genres: ["Ação", "Aventura", "Drama"],
    posterUrl: batmanPoster,
    backgroundUrl: batmanBanner
  },
  {
    // Malévola agora aponta para o ID 28
    id: 28, 
    title: "Malévola",
    description: "Uma fada vingativa é levada a amaldiçoar uma princesa recém-nascida, apenas para descobrir que a criança pode ser a única pessoa que pode restaurar a paz em sua terra conturbada.",
    rating: "10",
    genres: ["Família", "Fantasia", "Aventura"],
    posterUrl: malevolaPoster,
    backgroundUrl: malevolaBanner
  },
  {
    // Matrix agora aponta para o ID 6
    id: 6, 
    title: "The Matrix",
    description: "Um hacker de computador aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.",
    rating: "14",
    genres: ["Ação", "Sci-Fi"],
    posterUrl: matrixPoster,
    backgroundUrl: matrixBanner
  }
];

// Esta é a fileira "Destaques"
export const featuredData = [
  {
    // Interestelar aponta para o ID 11
    id: 11, 
    title: "Interstellar",
    posterUrl: interstellarPoster
  },
  {
    // Coringa aponta para o ID 29
    id: 29, 
    title: "Coringa",
    posterUrl: jokerPoster
  },
  {
    // Duna aponta para o ID 30
    id: 30, 
    title: "Duna",
    posterUrl: dunePoster
  },
  {
    // Vingadores aponta para o ID 31
    id: 31, 
    title: "Vingadores - Ultimato",
    posterUrl: avengersPoster
  },
  {
    // Crepúsculo aponta para o ID 23
    id: 23, 
    title: "Crepúsculo",
    posterUrl: crepusculoPoster
  }
];