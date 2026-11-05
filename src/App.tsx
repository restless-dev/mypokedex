import { type HTMLMotionProps, motion } from 'framer-motion';
import { type CSSProperties, useEffect, useState } from 'react';
import { usePokedexStore } from './store/usePokedexStore';
import { useTypewriter } from './hooks/useTypewriter';
import { useKeyboardBindings } from './hooks/useKeyboardBindings';
import { manageBGM, playCry } from './utils/audio';

interface LoadingSpriteProps extends HTMLMotionProps<'img'> {
  src: string;
  alt: string;
  className?: string;
  filterClass?: string;
  style?: CSSProperties;
}

const formatId = (id: number) => id.toString().padStart(3, '0');

const getSpriteSize = (heightInMeters: number, isCenter: boolean = false) => {
  const base = isCenter ? 30 : 25;
  const multiplier = isCenter ? 26 : 8;
  const max = isCenter ? 75 : 35;

  const pct = Math.min(max, Math.max(base, base + heightInMeters * multiplier));
  return `${pct}%`;
};

const LoadingSprite = ({
  src,
  alt,
  className,
  filterClass,
  style,
  ...props
}: LoadingSpriteProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={style}
    >
      {!isLoaded && (
        <div className="pointer-events-none absolute z-20 h-[3cqw] w-[3cqw] animate-spin rounded-full border-[2px] border-[#11365f]/30 border-t-[#11365f]"></div>
      )}
      <img
        src={src}
        alt={`${alt} shadow`}
        className={`pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.1] object-contain transition-opacity duration-300 [image-rendering:pixelated] ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ filter: 'url(#silhouette-tint)' }}
      />
      <motion.img
        {...props}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`relative z-10 h-full w-full object-contain transition-opacity duration-300 [image-rendering:pixelated] ${filterClass || ''} ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default function App() {
  const {
    activeIndex,
    activePokemon,
    appendSearch,
    decreaseVolume,
    generation,
    generationList,
    globalVolume,
    increaseVolume,
    is3DEnabled,
    isAudioEnabled,
    isOn,
    nextGen,
    nextPokemon,
    prevGen,
    prevPokemon,
    searchBuffer,
    status,
    submitSearch,
    toggle3D,
    toggleAudio,
    togglePower,
    toggleViewState,
    viewMode,
    viewState,
  } = usePokedexStore();

  const [zoomLevel, setZoomLevel] = useState(1);
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.25));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.75));

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  );

  const [showTutorial, setShowTutorial] = useState(false);
  const [showTutorialIndicator, setShowTutorialIndicator] = useState(true);

  if (isOn && showTutorialIndicator) {
    setShowTutorialIndicator(false);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pokemon = activePokemon();
  useKeyboardBindings();
  useEffect(() => {
    if (isOn && isAudioEnabled && viewState === 'DETAIL' && pokemon?.cryUrl) {
      playCry(pokemon.cryUrl, globalVolume, isAudioEnabled);
    }
  }, [
    globalVolume,
    isAudioEnabled,
    isOn,
    pokemon?.cryUrl,
    pokemon?.id,
    viewState,
  ]);
  const flavorText = useTypewriter(pokemon?.flavorText || '', 30);
  const len = generationList.length;
  const prev = len > 0 ? generationList[(activeIndex - 1 + len) % len] : null;
  const next = len > 0 ? generationList[(activeIndex + 1) % len] : null;

  useEffect(() => {
    if (isOn && isAudioEnabled && viewState === 'DETAIL' && pokemon?.cryUrl) {
      playCry(pokemon.cryUrl, globalVolume, isAudioEnabled);
    }
  }, [
    globalVolume,
    isAudioEnabled,
    isOn,
    pokemon?.cryUrl,
    pokemon?.id,
    viewState,
  ]);

  useEffect(() => {
    manageBGM(globalVolume, isAudioEnabled, isOn);
  }, [globalVolume, isAudioEnabled, isOn]);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center overflow-hidden p-2 select-none sm:p-1"
      style={{
        background:
          'radial-gradient(circle at center, #175a83 0%, #12365f 65%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/doodles.png)',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center center',
          backgroundSize: 'auto',
        }}
      ></div>
      <svg width="0" height="0" className="pointer-events-none absolute">
        <filter id="silhouette-tint">
          <feColorMatrix
            type="matrix"
            values=" 0.0  0.0  0.0  0.0  0.0 0.0  0.0  0.0  0.0  0.0 0.0  0.0  0.0  0.0  0.0 0.0  0.0  0.0  1.0  0.0"
          />
        </filter>
      </svg>
      <div className="z-10 mb-[10%] flex w-full max-w-5xl flex-col items-center gap-4 sm:gap-3">
        <div className="relative z-50 aspect-[6/1] w-[40%] max-w-[400px] shrink-0">
          <img
            src="/toolbar-bg.png"
            alt="Toolbar"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-between px-[17%] py-[4.1%]">
            <button
              onClick={() => {
                setShowTutorial(!showTutorial);
                setShowTutorialIndicator(false);
              }}
              className={`relative ml-[3%] flex aspect-square h-full cursor-pointer items-center justify-center rounded-full border border-black/10 text-white drop-shadow-sm transition-colors hover:bg-white/10 active:bg-black/10 ${showTutorial ? 'bg-white/20' : ''}`}
              title="Tutorial"
            >
              {showTutorialIndicator && (
                <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-white/80"></span>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-question-lg relative z-10 h-[75%] w-[75%] active:text-white/80"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"
                />
              </svg>
            </button>

            <div className="ml-[4.5%] flex aspect-[2.2/1] h-full justify-between">
              <button
                onClick={handleZoomOut}
                className="flex aspect-square h-full cursor-pointer items-center justify-center rounded-md border border-black/10 text-white drop-shadow-sm transition-colors hover:bg-white/10 active:bg-black/10"
                title="Zoom Out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="bi bi-zoom-out h-[60%] w-[60%] active:text-white/80"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975zM7 10h8v2H7z"
                  />
                </svg>
              </button>

              <button
                onClick={handleZoomIn}
                className="mr-[2.5%] flex aspect-square h-full cursor-pointer items-center justify-center rounded-md border border-black/10 text-white drop-shadow-sm transition-colors hover:bg-white/10 active:bg-black/10"
                title="Zoom In"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="bi bi-zoom-in h-[60%] w-[60%] active:text-white/80"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975zM10 10V7h2v3h3v2h-3v3h-2v-3H7v-2z"
                  />
                </svg>
              </button>
            </div>

            <div className="h-full w-[1%]"></div>

            <div className="mr-[2.5%] flex aspect-[2.2/1] h-full justify-between">
              <button
                onClick={decreaseVolume}
                className="flex aspect-square h-full cursor-pointer items-center justify-center rounded-md border border-black/10 text-white drop-shadow-sm transition-colors hover:bg-white/10 active:bg-black/10"
                title="Volume Down"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[55%] w-[55%] active:text-white/80"
                  viewBox="0 0 48 48"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  >
                    <path d="M24 6v36c-7 0-12.201-9.16-12.201-9.16H6a2 2 0 0 1-2-2V17.01a2 2 0 0 1 2-2h5.799S17 6 24 6Z" />
                    <path strokeLinecap="round" d="M32 24h12" />
                  </g>
                </svg>
              </button>

              <button
                onClick={increaseVolume}
                className="mr-[3%] flex aspect-square h-full cursor-pointer items-center justify-center rounded-md border border-black/10 text-white drop-shadow-sm transition-colors hover:bg-white/10 active:bg-black/10"
                title="Volume Up"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[55%] w-[55%] active:text-white/80"
                  viewBox="0 0 48 48"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="4"
                  >
                    <path d="M24 6v36c-7 0-12.201-9.16-12.201-9.16H6a2 2 0 0 1-2-2V17.01a2 2 0 0 1 2-2h5.799S17 6 24 6Z" />
                    <path strokeLinecap="round" d="M32 24h12m-6-6v12" />
                  </g>
                </svg>
              </button>
            </div>

            <button
              onClick={() =>
                window.open(
                  'https://github.com/restless-dev/mypokedex',
                  '_blank',
                )
              }
              className="mr-[1%] flex aspect-square h-full cursor-pointer items-center justify-center rounded-full border border-white/10 text-white drop-shadow-sm transition-colors hover:bg-white/10 active:bg-black/10"
              title="GitHub Repository"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[99%] w-[99%] rounded-full border border-black/30 active:text-white/80"
                viewBox="0 0 25 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="@container relative aspect-[13/9] w-full drop-shadow-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
          }}
        >
          <img
            src="/pokedex-shell.png"
            alt="Pokedex Shell"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain"
          />

          <div className="absolute inset-0 z-10">
            <button
              onClick={togglePower}
              className={`absolute top-[5.8%] left-[6.85%] aspect-square w-[8.5%] cursor-pointer rounded-full transition-all active:scale-95 ${
                isOn
                  ? 'border-btn-blue/25 bg-btn-blue/25 border-[3px] shadow-[0_0_20px_rgba(40,170,250,0.8),_inset_-3px_-3px_6px_rgba(0,0,0,0.4),_inset_3px_3px_6px_rgba(255,255,255,0.8)]'
                  : 'border-btn-dark bg-btn-blue/0 animate-pulse border-[3px] shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.6)]'
              }`}
              title="POWER"
            ></button>

            <div className="absolute top-[5%] left-[18.2%] flex w-[15%] gap-[10.8%]">
              <div
                className={`h-6 w-6 rounded-full border border-black/50 shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.5)] transition-colors duration-200 ${status === 'error' ? 'bg-red-500/50 shadow-[0_0_10px_red]' : 'bg-red-900/50'}`}
              ></div>
              <div
                className={`h-6 w-6 rounded-full border border-black/50 shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.5)] transition-colors duration-200 ${status === 'loading' ? 'bg-yellow-400/50 shadow-[0_0_10px_yellow]' : 'bg-yellow-900/50'}`}
              ></div>
              <div
                className={`h-6 w-6 rounded-full border border-black/50 shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.5)] transition-colors duration-200 ${isOn && status === 'idle' ? 'bg-green-400/50 shadow-[0_0_10px_green]' : 'bg-green-900/50'}`}
              ></div>
            </div>

            <div
              className={`absolute top-[30%] left-[8.9%] z-10 flex h-[29%] w-[33%] flex-col overflow-hidden rounded-md border-2 border-black/50 transition-colors duration-500 ${isOn ? 'scanlines bg-[#041818]' : 'bg-black shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]'}`}
            >
              {isOn && status === 'booting' && (
                <div className="font-pixel z-10 flex h-full w-full animate-pulse flex-col items-center justify-center text-[1.5cqw] tracking-tight text-white">
                  BOOTING...
                </div>
              )}

              {isOn && status === 'loading' && (
                <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden">
                  <div className="bg-white/50] absolute top-0 h-1 w-full animate-[scan_1.5s_linear_infinite]"></div>
                  <p className="font-pixel animate-pulse text-[1.5cqw] text-white">
                    SEARCHING...
                  </p>
                  <style>{`@keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }`}</style>
                </div>
              )}

              {isOn && status === 'error' && (
                <div className="z-10 flex h-full items-center justify-center">
                  <p className="font-pixel animate-pulse text-[1.5cqw] text-white">
                    NOT FOUND
                  </p>
                </div>
              )}

              {isOn && status === 'idle' && pokemon && (
                <>
                  {viewState === 'LIST' ? (
                    <div className="relative z-10 h-full w-full">
                      <img
                        src="/screen-list.png"
                        alt="List UI"
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
                      />

                      <div className="absolute right-[1%] left-[7%] z-20 flex h-[15%] items-center justify-between px-[4%]">
                        <div className="flex items-center">
                          <span className="font-pixel text-[1.1cqw] tracking-widest text-[#a9d7b2]">
                            GEN {generation}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-pixel text-[1.1cqw] tracking-widest text-[#a9d7b2]">
                            Num. {formatId(pokemon.id)}
                          </span>
                        </div>
                      </div>

                      <div className="relative top-[22%] right-0 left-0 z-20 flex h-[55%] items-center justify-between overflow-hidden">
                        <div
                          className="flex h-full flex-1 cursor-pointer items-center justify-center"
                          onClick={prevPokemon}
                        >
                          {prev && (
                            <LoadingSprite
                              src={is3DEnabled ? prev.sprite : prev.sprite2d}
                              alt={prev.name}

                              className="scale-125 transition-all hover:brightness-75"
                              filterClass="brightness-50 saturate-50"
                              style={{
                                width: is3DEnabled
                                  ? getSpriteSize(prev.height, false)
                                  : '50%',
                                height: is3DEnabled
                                  ? getSpriteSize(prev.height, false)
                                  : '50%',
                              }}
                            />
                          )}
                        </div>

                        <div className="relative flex h-full flex-1 items-center justify-center">
                          <div className="pointer-events-none absolute flex h-full w-full items-center justify-center">
                            <svg
                              className="radar-ring"
                              style={{ width: '85%', height: '85%' }}
                              viewBox="0 0 130 130"
                            >
                              <circle
                                cx="65"
                                cy="65"
                                r="60"
                                stroke="rgba(0,220,220,0.4)"
                                strokeWidth="1"
                                fill="none"
                                strokeDasharray="4 4"
                              />
                              <circle
                                cx="65"
                                cy="65"
                                r="52"
                                stroke="rgba(0,220,220,0.2)"
                                strokeWidth="1"
                                fill="none"
                              />
                              <circle
                                cx="65"
                                cy="65"
                                r="44"
                                stroke="rgba(0,220,220,0.12)"
                                strokeWidth="1"
                                fill="none"
                                strokeDasharray="2 6"
                              />
                              <line
                                x1="65"
                                y1="5"
                                x2="65"
                                y2="25"
                                stroke="rgba(0,220,220,0.35)"
                                strokeWidth="1"
                              />
                              <line
                                x1="65"
                                y1="105"
                                x2="65"
                                y2="125"
                                stroke="rgba(0,220,220,0.35)"
                                strokeWidth="1"
                              />
                              <line
                                x1="5"
                                y1="65"
                                x2="25"
                                y2="65"
                                stroke="rgba(0,220,220,0.35)"
                                strokeWidth="1"
                              />
                              <line
                                x1="105"
                                y1="65"
                                x2="125"
                                y2="65"
                                stroke="rgba(0,220,220,0.35)"
                                strokeWidth="1"
                              />
                            </svg>
                          </div>

                          <LoadingSprite
                            key={`${pokemon.id}-${is3DEnabled}`}
                            src={
                              is3DEnabled ? pokemon.sprite : pokemon.sprite2d
                            }
                            alt={pokemon.name}

                            className="animate-in fade-in slide-in-from-bottom-2 relative z-10 mr-[1cqw] mb-[1cqw] scale-125 duration-300"
                            style={{
                              width: is3DEnabled
                                ? getSpriteSize(pokemon.height, true)
                                : '90%',
                              height: is3DEnabled
                                ? getSpriteSize(pokemon.height, true)
                                : '90%',
                            }}
                          />
                        </div>

                        <div
                          className="flex h-full flex-1 cursor-pointer items-center justify-center"
                          onClick={nextPokemon}
                        >
                          {next && (
                            <LoadingSprite
                              src={is3DEnabled ? next.sprite : next.sprite2d}
                              alt={next.name}

                              className="scale-125 transition-all hover:brightness-75"
                              filterClass="brightness-50 saturate-50"
                              style={{
                                width: is3DEnabled
                                  ? getSpriteSize(next.height, false)
                                  : '50%',
                                height: is3DEnabled
                                  ? getSpriteSize(next.height, false)
                                  : '50%',
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="absolute right-[4%] bottom-[3%] left-[4%] z-20 flex h-[15%] items-center justify-between px-[-1%]">
                        <button
                          className="flex h-[80%] w-[5%] cursor-pointer items-center justify-start border-none bg-transparent p-0 outline-none"
                          onClick={prevPokemon}
                          title="Previous"
                        ></button>

                        <div className="flex flex-col items-center text-center">
                          <span className="font-pixel text-[1.2cqw] tracking-widest text-[#a9d7b2]">
                            {pokemon.name}
                          </span>
                        </div>

                        <button
                          className="flex h-[80%] w-[5%] cursor-pointer items-center justify-end border-none bg-transparent p-0 outline-none"
                          onClick={nextPokemon}
                          title="Next"
                        ></button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in zoom-in-95 relative z-10 h-full w-full duration-200">
                      <img
                        src="/screen-detail.png"
                        alt="Detail UI"
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
                      />

                      <div className="absolute top-[1.5%] right-[3%] left-[9%] z-20 flex h-[12%] items-center justify-between px-[2%]">
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[1.1cqw] tracking-widest text-[#a9d7b2]">
                            GEN {generation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[1.1cqw] tracking-widest text-[#a9d7b2]">
                            Num. {formatId(pokemon.id)}
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-[18%] left-[4%] z-20 flex h-[55%] w-[40%] items-center justify-center">
                        <svg
                          className="radar-ring pointer-events-none absolute h-[10cqw] w-[10cqw]"
                          viewBox="0 0 130 130"
                        >
                          <circle
                            cx="65"
                            cy="65"
                            r="50"
                            stroke="rgba(0,220,220,0.3)"
                            strokeWidth="1"
                            fill="none"
                            strokeDasharray="4 4"
                          />
                          <circle
                            cx="65"
                            cy="65"
                            r="35"
                            stroke="rgba(0,220,220,0.15)"
                            strokeWidth="1"
                            fill="none"
                          />
                          <line
                            x1="65"
                            y1="15"
                            x2="65"
                            y2="115"
                            stroke="rgba(0,220,220,0.2)"
                            strokeWidth="1"
                          />
                          <line
                            x1="15"
                            y1="65"
                            x2="115"
                            y2="65"
                            stroke="rgba(0,220,220,0.2)"
                            strokeWidth="1"
                          />
                        </svg>

                        <LoadingSprite
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                          src={is3DEnabled ? pokemon.sprite : pokemon.sprite2d}
                          alt={pokemon.name}
                          className="relative z-10 mt-[1cqw] ml-[2.2cqw] scale-220 object-contain"
                          style={{
                            width: is3DEnabled
                              ? getSpriteSize(next.height, false)
                              : '50%',
                            height: is3DEnabled
                              ? getSpriteSize(next.height, false)
                              : '50%',
                          }}
                        />
                      </div>

                      <div className="absolute bottom-[4%] left-[7%] z-20 flex h-[15%] w-[40%] items-center justify-center text-center">
                        <span className="font-pixel mt-0.5 truncate px-1 text-[1cqw] font-bold tracking-wide text-[#a9d7b2]">
                          {pokemon.name}
                        </span>
                      </div>

                      <div className="absolute top-[19%] right-[3.5%] z-20 flex h-[76%] w-[38%] flex-col p-[2%]">
                        <h3 className="font-pixel mt-2 mb-2 shrink-0 pb-1 text-[1cqw] font-bold tracking-tight text-[#11365f]">
                          BASIC STATS
                        </h3>

                        <div className="flex flex-1 flex-col justify-between py-1 font-bold">
                          {pokemon.stats.map((stat, i) => {
                            const pct = Math.min((stat.value / 150) * 100, 100);
                            const isSp = stat.name.includes('SP.');
                            const barColor = isSp ? '#ff9900' : '#ffdd00';

                            return (
                              <div
                                key={stat.name}
                                className="flex items-center"
                              >
                                <span className="font-pixel w-[6cqw] text-left text-[0.8cqw] leading-none tracking-tighter text-[#11365f]/90">
                                  {stat.name}
                                </span>

                                <div className="h-[0.75cqw] flex-1 border border-[#11365f]/90 bg-[#11365f]/90 p-[0.1cqw]">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{
                                      duration: 0.2,
                                      delay: i * 0.1,
                                      ease: 'easeOut',
                                    }}
                                    className="h-full"
                                    style={{
                                      backgroundColor: barColor,
                                      boxShadow: `0 0 4px ${barColor}80`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="absolute top-[72.2%] left-[7.5%] flex w-[5.5%] flex-col items-center gap-1">
              <button
                onClick={toggleViewState}
                className="bg-btn-dark/50 aspect-square w-full scale-105 cursor-pointer rounded-full opacity-50 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.5),_2px_2px_4px_rgba(0,0,0,0.3)] transition-transform active:scale-95 active:opacity-75"
                title="SELECT"
              ></button>
              <span className="mt-[0.25cqw] ml-[0.15cqw] text-[1.45cqw] font-bold tracking-wider text-black/80 antialiased">
                SELECT
              </span>
            </div>

            <div className="absolute top-[70.5%] left-[34%] aspect-square w-[11%] opacity-25 drop-shadow-md">
              <button
                onClick={nextGen}
                className="absolute top-0 left-1/3 z-20 h-1/3 w-1/3 cursor-pointer rounded-t-sm hover:bg-white/10 active:bg-black/40"
                title="Next Gen"
              ></button>
              <button
                onClick={prevGen}
                className="absolute bottom-0 left-1/3 z-20 h-1/3 w-1/3 cursor-pointer rounded-b-sm hover:bg-white/10 active:bg-black/40"
                title="Prev Gen"
              ></button>
              <button
                onClick={prevPokemon}
                className="absolute top-1/3 left-0 z-20 h-1/3 w-1/3 cursor-pointer rounded-l-sm hover:bg-white/10 active:bg-black/40"
                title="Prev Pokémon"
              ></button>
              <button
                onClick={nextPokemon}
                className="absolute top-1/3 right-0 z-20 h-1/3 w-1/3 cursor-pointer rounded-r-sm hover:bg-white/10 active:bg-black/40"
                title="Next Pokémon"
              ></button>
            </div>

            <div
              className={`font-lcd absolute top-[82.6%] left-[16.75%] z-10 flex h-[10.65%] w-[16%] flex-col justify-center rounded-md border-[3px] border-black/80 bg-clip-padding px-2 text-[2cqw] leading-none shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] transition-colors duration-300 ${isOn ? 'bg-screen-lcd/90 text-black' : 'bg-screen-lcd/89 text-black/20'}`}
            >
              {isOn &&
                (searchBuffer.length > 0 ? (
                  <span className="animate-pulse">&gt; {searchBuffer}_</span>
                ) : status === 'error' ? (
                  <>
                    <span>{currentTime}</span>
                    <span className="mt-1 animate-pulse text-[1.1cqw] font-bold text-red-900">
                      A ERROR HAS OCCURED
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[2cqw] font-bold tracking-wide text-black/70">
                      {currentTime}
                    </span>
                    <span className="mt-[0.5cqw] animate-pulse text-[1.3cqw] font-bold tracking-wide text-black/70">
                      ALL SYSTEMS OK
                    </span>
                  </>
                ))}
            </div>

            <div
              className={`absolute top-[27.6%] right-[5.7%] z-10 h-[22.5%] w-[35.8%] overflow-hidden rounded-xl border-[3px] border-black/80 bg-black p-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transition-colors duration-300 ${!isOn}`}
            >
              <div className="pointer-events-none absolute inset-0 z-10"></div>

              {isOn &&
                !pokemon &&
                status !== 'loading' &&
                status !== 'booting' && (
                  <p className="font-lcd relative z-0 mt-4 text-[2.2cqw] leading-relaxed tracking-widest text-white">
                    SYSTEM READY
                  </p>
                )}

              {isOn && pokemon && (
                <div className="font-lcd relative z-0 flex h-full flex-col text-white">
                  <div
                    className="flex-1 overflow-y-auto pl-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style>{`.overflow-y-auto::-webkit-scrollbar { display: none; }`}</style>

                    {viewMode === 'info' && (
                      <p className="text-[1.76cqw] font-bold tracking-wider">
                        {flavorText}
                        <span className="animate-pulse"> _</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute top-[54.4%] right-[6.1%] grid h-[13.3%] w-[34.9%] grid-cols-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  onClick={() => appendSearch(num.toString())}
                  className="active:bg-btn-dark/5 flex h-full w-full scale-100 scale-102 cursor-pointer items-center justify-center rounded-[6%] text-[1.7cqw] font-extrabold text-white/75 transition-all hover:bg-white/10 active:scale-98"
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="absolute top-[71.5%] right-[5.7%] flex h-[8%] w-[36%] items-center justify-between">
              <div className="mb-[0.5%] ml-[1.9%] flex h-[88%] w-[56%] gap-[3%] transition">
                <button
                  onClick={toggle3D}
                  className={`relative flex h-full w-full flex-1 cursor-pointer flex-row items-center justify-center gap-[2.2cqw] rounded transition-all active:scale-95 ${is3DEnabled ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                >
                  <div
                    className={`ml-[-27%] h-[0.8cqw] w-[0.8cqw] rounded-full border border-black/25 transition-all duration-300 ${is3DEnabled && isOn ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-900 shadow-inner'}`}
                  ></div>

                  <span className="text-[1.45cqw] font-bold tracking-wider text-black/50">
                    3D
                  </span>
                </button>

                <button
                  onClick={toggleAudio}
                  className={`relative flex h-full w-full flex-1 cursor-pointer flex-row items-center justify-center gap-[1.5cqw] rounded transition-all active:scale-95 ${isAudioEnabled ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
                >
                  <div
                    className={`ml-[-25%] h-[0.8cqw] w-[0.8cqw] rounded-full border border-black/25 transition-all duration-300 ${isAudioEnabled && isOn ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-900 shadow-inner'}`}
                  ></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-music-note-beamed text-black/50"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2" />
                    <path fill="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z" />
                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={submitSearch}
                className="relative mb-[3%] ml-[2%] flex aspect-square h-[128%] w-[20%] shrink-0 cursor-pointer items-center justify-center rounded-full text-black/70 transition-all hover:bg-white/20 hover:text-black/60 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-search text-black/50"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>{' '}
              </button>
            </div>

            <div
              className={`absolute top-[81.5%] right-[5.8%] z-10 flex h-[8.7%] w-[35.4%] gap-[4.4%] transition-opacity duration-300 ${!isOn}`}
            >
              <div className="bg-screen-terminal relative flex h-[101%] flex-1 items-center overflow-hidden rounded-lg border-[2px] border-black/80 px-[4%] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="font-pixel text-[1.4cqw] tracking-widest text-white">
                  {pokemon?.types[0] || ''}
                </span>
              </div>

              <div className="bg-screen-terminal relative ml-[0.5%] flex h-full w-full flex-1 items-center overflow-hidden rounded-lg border-[2px] border-black/80 px-[4%] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                {pokemon?.types[1] && (
                  <>
                    <span className="font-pixel text-[1.4cqw] tracking-widest text-white">
                      {pokemon.types[1]}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            onClick={() => setShowTutorial(false)}
            className={`absolute inset-0 z-50 flex cursor-pointer items-center justify-center transition-opacity duration-300 ${
              showTutorial ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <img
              src="/tutorial-overlay.png"
              alt="Pokédex Tutorial"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
