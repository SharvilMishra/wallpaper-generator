import React from 'react';
import { Sparkles, History, SlidersHorizontal } from 'lucide-react';
import { ImageSize, AspectRatio } from '../types';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenPresets: () => void;
  onOpenSettings: () => void;
  favoritesCount: number;
  historyCount: number;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  model: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenPresets,
  onOpenSettings,
  favoritesCount,
  historyCount,
  imageSize,
  aspectRatio,
  model,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#1F1F23] px-4 py-3.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#161618] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif-editorial italic text-white tracking-tight">
                VibePaper<span className="text-[#D4AF37]">.</span>
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#1A1C1E] text-[#D4AF37] border border-[#8C7851]/30">
                Studio 9:16
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#71717A] hidden sm:block">
              Sophisticated Wallpaper Generator
            </p>
          </div>
        </div>

        {/* Quick Config & History Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick presets button */}
          <button
            id="btn-open-presets"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#D4D4D8] bg-[#161618] hover:bg-[#1c1c21] border border-[#27272A] hover:border-[#D4AF37]/40 rounded-sm transition-all cursor-pointer"
            title="Explore Vibe Presets"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden xs:inline text-[11px] uppercase tracking-wider text-[#A1A1AA]">Vibes</span>
          </button>

          {/* Quick Settings Pill */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#D4D4D8] bg-[#161618] hover:bg-[#1c1c21] border border-[#27272A] hover:border-[#D4AF37]/40 rounded-sm transition-all cursor-pointer"
            title="Adjust Quality & Aspect Ratio"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-mono text-[11px] text-white">{aspectRatio}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0A0A0B] text-[#D4AF37] border border-[#8C7851]/30 font-mono font-bold">
              {imageSize}
            </span>
          </button>

          {/* History / Collection Button */}
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className="relative p-2 text-[#D4D4D8] bg-[#161618] hover:bg-[#1c1c21] border border-[#27272A] hover:border-[#D4AF37]/40 rounded-sm transition-all cursor-pointer"
            title="Wallpaper History & Favorites"
            aria-label="View history"
          >
            <History className="w-4 h-4 text-[#A1A1AA] hover:text-white" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-[10px] font-bold text-black rounded-full flex items-center justify-center ring-2 ring-[#050506]">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
