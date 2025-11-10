// src/components/SearchBar/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react'; // 1. Importe o useRef
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'react-feather';
import './SearchBar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 2. Novo estado para rastrear o item selecionado pelo teclado
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = nenhum
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearchTerm = searchParams.get('search');
  
  // 3. Refs para o scroll automático do dropdown
  const listRef = useRef(null);
  const activeItemRef = useRef(null);

  // Efeito para buscar sugestões (autocomplete)
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setActiveIndex(-1); // Reseta o índice
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`http://localhost:8081/listarfilmes?search=${encodeURIComponent(searchTerm)}`);
          if (!response.ok) throw new Error('Falha ao buscar sugestões');
          const data = await response.json();
          setSuggestions(data.slice(0, 5));
        } catch (error) {
          console.error("Erro nas sugestões:", error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      };
      fetchSuggestions();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efeito para Sincronizar o input com a URL
  useEffect(() => {
    setSearchTerm(urlSearchTerm || '');
  }, [urlSearchTerm]);

  // 4. NOVO EFEITO: Scroll automático da lista
  useEffect(() => {
    if (activeIndex < 0 || !activeItemRef.current || !listRef.current) {
      return;
    }
    // Lógica para rolar o item ativo para a visão
    const item = activeItemRef.current;
    const list = listRef.current;
    
    const itemTop = item.offsetTop;
    const itemHeight = item.offsetHeight;
    const listTop = list.scrollTop;
    const listHeight = list.clientHeight;

    if (itemTop < listTop) {
      // Se o item está acima da área visível
      list.scrollTop = itemTop;
    } else if (itemTop + itemHeight > listTop + listHeight) {
      // Se o item está abaixo da área visível
      list.scrollTop = itemTop + itemHeight - listHeight;
    }
  }, [activeIndex]);
  // --- FIM DO NOVO EFEITO ---

  // 5. NOVA FUNÇÃO: Manipulador de Teclado
  const handleKeyDown = (e) => {
    // Se não houver sugestões, não faz nada
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Impede o cursor de ir para o fim do input
      // Move para baixo, com "wrap around"
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault(); // Impede o cursor de ir para o início
      // Move para cima, com "wrap around"
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } 
    else if (e.key === 'Enter') {
      if (activeIndex > -1) {
        // Se um item está selecionado, impede o submit do form
        e.preventDefault(); 
        // E navega para o item selecionado
        handleSuggestionClick(suggestions[activeIndex].id_filme);
      }
      // Se activeIndex for -1, o 'Enter' funciona normalmente (submete o form)
    } 
    else if (e.key === 'Escape') {
      // Fecha o dropdown
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };
  // --- FIM DA NOVA FUNÇÃO ---

  // Funções de clique/submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    setActiveIndex(-1); // Reseta
    if (searchTerm.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/catalogo');
    }
  };

  const handleSuggestionClick = (filmeId) => {
    navigate(`/filme/${filmeId}`);
    setSearchTerm('');
    setSuggestions([]);
    setActiveIndex(-1); // Reseta
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setActiveIndex(-1); // Reseta
    navigate('/catalogo');
  };

  return (
    <div className="searchBar-wrapper">
      <form className="searchBar" onSubmit={handleSearchSubmit}>
        <Search
          color="#fff"
          size={20}
          className="searchIcon"
          onClick={handleSearchSubmit}
        />
        <input
          type="text"
          placeholder="Buscar filmes"
          className="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // 6. Adiciona o listener de teclado aqui
        />
        {searchTerm && (
          <X
            color="#fff"
            size={20}
            className="search-clear-icon"
            onMouseDown={(e) => {
              e.preventDefault();
              handleClearSearch();
            }}
          />
        )}
      </form>

      {(suggestions.length > 0 || isSearching) && (
        // 7. Adiciona a ref ao 'ul'
        <ul className="search-suggestions" ref={listRef}>
          {isSearching && suggestions.length === 0 && (
            <li className="searching-notice">Buscando...</li>
          )}
          {suggestions.map((filme, index) => (
            <li
              key={filme.id_filme}
              // 8. Adiciona a classe e a ref ao 'li'
              className={index === activeIndex ? 'suggestion-active' : ''}
              ref={index === activeIndex ? activeItemRef : null}
              onMouseDown={() => handleSuggestionClick(filme.id_filme)}
            >
              <img
                src={filme.poster}
                alt={filme.titulo}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x60/222/fff?text=Poster"; }}
              />
              <span>{filme.titulo} ({filme.ano})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;