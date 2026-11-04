const SOUND_CONFIG = {
  boot: { url: '/sounds/sound1.mp3', volume: 0.6 },
  search: { url: '/sounds/sound2.mp3', volume: 0.6 },
  moveHorizontal: { url: '/sounds/sound3.mp3', volume: 0.3 },
  moveVertical: { url: '/sounds/sound4.mp3', volume: 0.2 },
  select: { url: '/sounds/sound5.mp3', volume: 0.5 },
  back: { url: '/sounds/sound6.mp3', volume: 0.5 },
  numpad: { url: '/sounds/sound7.mp3', volume: 0.3 },
  powerOff: { url: '/sounds/sound8.mp3', volume: 0.6 },
  bgm: { url: '/sounds/sound9.mp3', volume: 0.15 },
};

const audioCache: Partial<Record<keyof typeof SOUND_CONFIG, HTMLAudioElement>> =
  {};
let bgmInstance: HTMLAudioElement | null = null;

export const playSound = (
  globalVolume: number,
  isAudioEnabled: boolean,
  name: keyof typeof SOUND_CONFIG,
) => {
  if (!isAudioEnabled || globalVolume === 0) return;

  if (!audioCache[name]) {
    audioCache[name] = new Audio(SOUND_CONFIG[name].url);
  }

  const sound = audioCache[name]!;
  sound.currentTime = 0;

  sound.volume = SOUND_CONFIG[name].volume * globalVolume;

  sound.play().catch(() => {});
};

export const manageBGM = (
  globalVolume: number,
  isAudioEnabled: boolean,
  isOn: boolean,
) => {
  if (!bgmInstance) {
    bgmInstance = new Audio(SOUND_CONFIG.bgm.url);
    bgmInstance.loop = true;
  }

  bgmInstance.volume = SOUND_CONFIG.bgm.volume * globalVolume;

  if (isOn && isAudioEnabled && globalVolume > 0) {
    bgmInstance.play().catch(() => {});
  } else {
    bgmInstance.pause();
  }
};

const CRY_VOLUME = 0.09;

let currentCry: HTMLAudioElement | null = null;

export const playCry = (
  cryUrl: string,
  globalVolume: number,
  isAudioEnabled: boolean,
) => {
  if (!isAudioEnabled || !cryUrl) return;

  if (currentCry) {
    currentCry.pause();
    currentCry.currentTime = 0;
  }

  currentCry = new Audio(cryUrl);

  currentCry.volume = CRY_VOLUME * globalVolume;

  currentCry.play().catch(() => {});
};
