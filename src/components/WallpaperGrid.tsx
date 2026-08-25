import React from 'react';
import {
  Download,
  RefreshCw,
  Heart,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { Wallpaper, AspectRatio } from '../types';
import { getAspectRatioClass, downloadWallpaper } from '../utils/wallpaperUtils';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  isLoading: boolean;
  onSelectWallpaper: (wp: Wallpaper, index: number) => void;
  onRemixWallpaper: (wp: Wallpaper) => void;
  onToggleFavorite: (wp: Wallpaper) => void;
  favorites: Record<string, boolean>;
  aspectRatio: AspectRatio;
  currentPrompt: string;
}

const LOADING_STEPS = [
  'Interpreting vibe nuances with Gemini AI...',
  'Composing 4 unique visual perspectives...',
  'Simulating depth, lighting & grain texture...',
  'Upscaling to studio-grade resolution...',
];

const VARIATION_LETTERS = ['Variation A', 'Variation B', 'Variation C', 'Variation D'];

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  isLoading,
  onSelectWallpaper,
  onRemixWallpaper,
  onToggleFavorite,
  favorites,
  aspectRatio,
}) => {
  const [loadingStepIndex, setLoadingStepIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const aspectClass = getAspectRatioClass(aspectRatio);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-[#1F1F23]">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#71717A] font-semibold">
            {isLoading ? 'Processing Neural Batch' : 'Batch Variations'}
          </h2>
          <p className="text-white font-serif-editorial italic text-sm">
            {isLoading
              ? 'Rendering 4 aesthetic variations...'
              : wallpapers.length > 0
              ? `Four 9:16 variations generated (${aspectRatio})`
              : 'Four variations ready to render'}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#52525B] font-mono hidden sm:inline">
          Tap card for full preview & remix
        </span>
      </div>

      {/* Grid: 2 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
        {isLoading
          ? // Sophisticated Skeleton Cards
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`loading_${i}`}
                className={`relative ${aspectClass} rounded-md overflow-hidden bg-[#161618] border border-[#27272A] shadow-2xl flex flex-col items-center justify-center p-4`}
              >
                {/* Subtle gradient pulse */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#27272A_0%,_transparent_70%)] animate-pulse" />
                
                <div className="relative z-10 flex flex-col items-center text-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#0A0A0B] border border-[#D4AF37]/30 flex items-center justify-center shadow-inner animate-spin-slow">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  
                  <div className="w-10 h-0.5 bg-[#D4AF37]/60 mt-1 mb-0.5" />
                  
                  <span className="text-[10px] uppercase tracking-wider font-bold text-white">
                    {VARIATION_LETTERS[i]}
                  </span>
                  
                  <span className="text-[10px] text-[#71717A] max-w-[120px] leading-tight line-clamp-2 font-serif-editorial italic">
                    {LOADING_STEPS[loadingStepIndex]}
                  </span>
                </div>

                {/* Micro gold progress line */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#27272A] overflow-hidden">
                  <div className="h-full bg-[#D4AF37] animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            ))
          : // Actual Wallpaper Cards
            wallpapers.map((wp, idx) => {
              const isFav = Boolean(favorites[wp.id] || wp.isFavorite);
              return (
                <div
                  key={wp.id || `wp_${idx}`}
                  id={`wallpaper-card-${idx}`}
                  className={`group relative ${aspectClass} rounded-md overflow-hidden bg-[#161618] border border-[#27272A] hover:border-[#D4AF37]/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  {/* Wallpaper Image */}
                  <img
                    src={wp.url}
                    alt={wp.prompt || `Wallpaper variation ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-[#050506]/80 text-[#D4D4D8] backdrop-blur-sm border border-[#27272A]">
                      {VARIATION_LETTERS[idx] ? VARIATION_LETTERS[idx].replace('Variation ', 'Var ') : `#${idx + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      {wp.isRemix && (
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-black">
                          Remix
                        </span>
                      )}
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[#050506]/80 text-[#D4AF37] border border-[#8C7851]/30">
                        {wp.imageSize || '1K'}
                      </span>
                    </div>
                  </div>

                  {/* Tap-to-expand hit area */}
                  <button
                    onClick={() => onSelectWallpaper(wp, idx)}
                    className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none flex items-center justify-center bg-transparent group-hover:bg-black/40 transition-colors"
                    aria-label={`View variation ${idx + 1} full screen`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 w-10 h-10 rounded-full bg-[#0A0A0B]/90 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-xl">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Bottom Actions Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 flex items-center justify-between gap-1.5 pointer-events-auto">
                    {/* Favorite */}
                    <button
                      id={`btn-fav-${idx}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(wp);
                      }}
                      className={`p-2 rounded-sm backdrop-blur-md transition-colors cursor-pointer ${
                        isFav
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                          : 'bg-[#161618]/90 text-[#A1A1AA] hover:text-white border border-[#27272A] hover:bg-[#1f1f23]'
                      }`}
                      title={isFav ? 'Remove Favorite' : 'Save to Favorites'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFav ? 'fill-[#D4AF37]' : ''}`}
                      />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Remix button */}
                      <button
                        id={`btn-remix-card-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemixWallpaper(wp);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-white hover:bg-zinc-200 text-black text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                        title="Remix this wallpaper vibe"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Remix</span>
                      </button>

                      {/* Download button */}
                      <button
                        id={`btn-download-card-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadWallpaper(wp.url, wp.prompt);
                        }}
                        className="p-1.5 rounded-sm bg-[#D4AF37] hover:bg-[#C49F27] text-black transition-colors cursor-pointer"
                        title="Download 9:16 wallpaper"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
