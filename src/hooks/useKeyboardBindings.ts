import { useEffect } from 'react';
import { usePokedexStore } from '../store/usePokedexStore';

export const useKeyboardBindings = () => {
  const {
    isOn,
    togglePower,
    nextPokemon,
    prevPokemon,
    nextGen,
    prevGen,
    appendSearch,
    backspaceSearch,
    submitSearch,
    toggleViewState,
    searchBuffer,
  } = usePokedexStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        if (!isOn) {
          togglePower();
        } else if (searchBuffer.length > 0) {
          submitSearch();
        } else {
          toggleViewState();
        }
        return;
      }

      if (!isOn) return;

      switch (e.key) {
        case 'ArrowRight':
          nextPokemon();
          break;
        case 'ArrowLeft':
          prevPokemon();
          break;
        case 'ArrowUp':
          nextGen();
          break;
        case 'ArrowDown':
          prevGen();
          break;
        case 'Backspace':
          backspaceSearch();
          break;
        default:
          if (/^[0-9]$/.test(e.key)) {
            appendSearch(e.key);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOn,
    togglePower,
    nextPokemon,
    prevPokemon,
    nextGen,
    prevGen,
    appendSearch,
    backspaceSearch,
    submitSearch,
    toggleViewState,
    searchBuffer,
  ]);
};
