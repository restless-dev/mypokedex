import { create } from 'zustand';

import {
  fetchGeneration,
  getGenerationByPokemonId,
  type PokemonData,
} from '../services/pokeapi';
import { playSound, manageBGM } from '../utils/audio';

interface PokedexState {
  activeIndex: number;
  generation: number;
  generationCache: Record<number, PokemonData[]>;
  generationList: PokemonData[];
  globalVolume: number;
  is3DEnabled: boolean;
  isAudioEnabled: boolean;
  isOn: boolean;
  searchBuffer: string;
  status: 'idle' | 'loading' | 'booting' | 'error';
  viewMode: 'info' | 'stats';
  viewState: 'LIST' | 'DETAIL';

  activePokemon: () => PokemonData | null;
  appendSearch: (num: string) => void;
  backspaceSearch: () => void;
  decreaseVolume: () => void;
  increaseVolume: () => void;
  loadGeneration: (gen: number, targetId?: number) => Promise<void>;
  nextGen: () => void;
  nextPokemon: () => void;
  prevGen: () => void;
  prevPokemon: () => void;
  setViewMode: (mode: 'info' | 'stats') => void;
  submitSearch: () => Promise<void>;
  toggle3D: () => void;
  toggleAudio: () => void;
  togglePower: () => void;
  toggleViewState: () => void;
}

export const usePokedexStore = create<PokedexState>((set, get) => ({
  activeIndex: 0,
  generation: 1,
  generationCache: {},
  generationList: [],
  globalVolume: 1.0,
  is3DEnabled: true,
  isAudioEnabled: true,
  isOn: false,
  searchBuffer: '',
  status: 'idle',
  viewMode: 'info',
  viewState: 'LIST',

  activePokemon: () => {
    const { generationList, activeIndex } = get();
    return generationList[activeIndex] || null;
  },

  togglePower: () => {
    const { globalVolume, isOn, isAudioEnabled, loadGeneration } = get();
    if (!isOn) {
      playSound(globalVolume, isAudioEnabled, 'boot');
      set({ isOn: true, status: 'booting', viewState: 'LIST' });
      manageBGM(globalVolume, isAudioEnabled, true);
      setTimeout(() => loadGeneration(1), 1500);
    } else {
      playSound(globalVolume, isAudioEnabled, 'powerOff');
      set({
        isOn: false,
        generationList: [],
        searchBuffer: '',
        status: 'idle',
        activeIndex: 0,
      });
      manageBGM(globalVolume, isAudioEnabled, false);
    }
  },

  toggleAudio: () => {
    const { globalVolume, isOn } = get();
    const newState = !get().isAudioEnabled;
    set({ isAudioEnabled: newState });
    manageBGM(globalVolume, newState, isOn);
  },

  toggle3D: () => set({ is3DEnabled: !get().is3DEnabled }),
  setViewMode: (mode) => {
    const { globalVolume, isAudioEnabled } = get();
    playSound(globalVolume, isAudioEnabled, 'numpad');
    set({ viewMode: mode });
  },

  increaseVolume: () => {
    const { globalVolume, isAudioEnabled, isOn } = get();
    const newVol = Math.min(1.2, globalVolume + 0.1);

    set({ globalVolume: newVol });
    manageBGM(newVol, isAudioEnabled, isOn);
  },

  decreaseVolume: () => {
    const { globalVolume, isAudioEnabled, isOn } = get();
    const newVol = Math.max(0.0, globalVolume - 0.1);

    set({ globalVolume: newVol });
    manageBGM(newVol, isAudioEnabled, isOn);
  },

  toggleViewState: () => {
    const {
      generationList,
      globalVolume,
      isAudioEnabled,
      isOn,
      status,
      viewState,
    } = get();
    if (!isOn || status !== 'idle' || generationList.length === 0) return;

    const isGoingToDetail = viewState === 'LIST';
    playSound(
      globalVolume,
      isAudioEnabled,
      isGoingToDetail ? 'select' : 'back',
    ); // SOUND 5 OR 6

    set({ viewState: isGoingToDetail ? 'DETAIL' : 'LIST' });
  },

  nextPokemon: () => {
    const {
      activeIndex,
      generationList,
      globalVolume,
      isAudioEnabled,
      isOn,
      status,
    } = get();
    if (!isOn || status !== 'idle' || generationList.length === 0) return;
    playSound(globalVolume, isAudioEnabled, 'moveHorizontal'); // SOUND 3
    set({
      activeIndex: (activeIndex + 1) % generationList.length,
      searchBuffer: '',
    });
  },

  prevPokemon: () => {
    const {
      activeIndex,
      generationList,
      globalVolume,
      isAudioEnabled,
      isOn,
      status,
    } = get();
    if (!isOn || status !== 'idle' || generationList.length === 0) return;
    playSound(globalVolume, isAudioEnabled, 'moveHorizontal'); // SOUND 3
    set({
      activeIndex:
        (activeIndex - 1 + generationList.length) % generationList.length,
      searchBuffer: '',
    });
  },

  nextGen: () => {
    const {
      generation,
      globalVolume,
      isAudioEnabled,
      isOn,
      loadGeneration,
      status,
    } = get();
    if (!isOn || status !== 'idle') return;
    playSound(globalVolume, isAudioEnabled, 'moveVertical'); // SOUND 4
    loadGeneration(generation >= 9 ? 1 : generation + 1);
  },

  prevGen: () => {
    const {
      generation,
      globalVolume,
      isAudioEnabled,
      isOn,
      loadGeneration,
      status,
    } = get();
    if (!isOn || status !== 'idle') return;
    playSound(globalVolume, isAudioEnabled, 'moveVertical'); // SOUND 4
    loadGeneration(generation <= 1 ? 9 : generation - 1);
  },

  appendSearch: (num: string) => {
    const { globalVolume, isAudioEnabled, isOn, searchBuffer } = get();
    if (!isOn) return;
    playSound(globalVolume, isAudioEnabled, 'numpad'); // SOUND 7
    if (searchBuffer.length < 4) set({ searchBuffer: searchBuffer + num });
  },

  backspaceSearch: () => {
    const { globalVolume, isAudioEnabled, isOn, searchBuffer } = get();
    if (!isOn) return;
    playSound(globalVolume, isAudioEnabled, 'numpad'); // SOUND 7
    set({ searchBuffer: searchBuffer.slice(0, -1) });
  },

  submitSearch: async () => {
    const {
      generationList,
      globalVolume,
      isAudioEnabled,
      isOn,
      loadGeneration,
      searchBuffer,
    } = get();
    if (!isOn || searchBuffer.length === 0) return;

    playSound(globalVolume, isAudioEnabled, 'search');

    const targetId = parseInt(searchBuffer, 10);
    if (targetId > 0 && targetId <= 1025) {
      set({ searchBuffer: '' });

      const targetGen = getGenerationByPokemonId(targetId);

      if (get().generation === targetGen.gen && generationList.length > 0) {
        const index = generationList.findIndex((p) => p.id === targetId);
        if (index !== -1) {
          set({ activeIndex: index, viewState: 'DETAIL' });
        }
      } else {
        await loadGeneration(targetGen.gen, targetId);
      }
    } else {
      set({ status: 'error', searchBuffer: '' });
      setTimeout(() => set({ status: 'idle' }), 2000);
    }
  },

  loadGeneration: async (genNum: number, targetId?: number) => {
    set({ status: 'loading', searchBuffer: '' });

    try {
      const { generationCache } = get();
      let data = generationCache[genNum];

      if (!data) {
        data = await fetchGeneration(genNum);

        set((state) => ({
          generationCache: {
            ...state.generationCache,
            [genNum]: data,
          },
        }));
      }

      let targetIndex = 0;
      if (targetId) {
        targetIndex = data.findIndex((p) => p.id === targetId);
        targetIndex = targetIndex === -1 ? 0 : targetIndex;
      }

      set({
        generationList: data,
        generation: genNum,
        activeIndex: targetIndex,
        status: 'idle',
        viewState: targetId ? 'DETAIL' : 'LIST',
      });
    } catch (err) {
      console.error('Failed to load generation:', err);
      set({ status: 'error', generationList: [] });
      setTimeout(() => set({ status: 'idle' }), 2000);
    }
  },
}));
