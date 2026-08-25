import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Heart,
  Smartphone,
  Share2,
  Sparkles,
  Check,
  Camera,
  Flashlight,
  Wifi,
  Battery,
  Lock,
} from 'lucide-react';
import { Wallpaper } from '../types';
import { downloadWallpaper } from '../utils/wallpaperUtils';

interface FullScreenViewerProps {
  wallpaper: Wallpaper | null;
  wallpapersList: Wallpaper[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onRemix: (wp: Wallpaper) => void;
  onToggleFavorite: (wp: Wallpaper) => void;
  isFavorite: boolean;
}

const VARIATION_LETTERS = ['Variation A', 'Variation B', 'Variation C', 'Variation D'];

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({
  wallpaper,
  wallpapersList,
  currentIndex,
  onClose,
  onNavigate,
  onRemix,
  onToggleFavorite,
  isFavorite,
}) => {
  const [showLockScreenMockup, setShowLockScreenMockup] = useState(false);
  const [showHomeScreenMockup, setShowHomeScreenMockup] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentDate, setCurrentDate] = useState('Monday, August 24');

  // Clock updates for realistic mobile lock screen preview
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation (Escape, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < wallpapersList.length - 1)
        onNavigate(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, wallpapersList.length, onClose, onNavigate]);

  if (!wallpaper) return null;

  const handleDownload = async () => {
    setDownloading(true);
    await downloadWallpaper(wallpaper.url, wallpaper.prompt);
    setTimeout(() => setDownloading(false), 800);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'VibePaper Wallpaper',
          text: `Check out this AI-generated wallpaper: "${wallpaper.prompt}"`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(wallpaper.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log('Share dismissed or failed', err);
    }
  };

  const totalVariations = wallpapersList.length;

  return (
    <div className="fixed inset-0 z-50 bg-[#050506] flex items-center justify-center select-none overflow-hidden touch-none">
      {/* Background Dim & Backdrop */}
      <div className="absolute inset-0 bg-[#050506]/95 backdrop-blur-xl" />

      {/* Main Wallpaper Container (Centered mobile phone aspect display) */}
      <div
        onClick={() => setHideUI((prev) => !prev)}
        className="relative w-full h-full max-w-[440px] max-h-screen sm:max-h-[92vh] sm:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-[#0A0A0B] border sm:border-[#27272A]"
      >
        {/* The Fullscreen Wallpaper Image */}
        <img
          src={wallpaper.url}
          alt={wallpaper.prompt}
          className="w-full h-full object-cover sm:rounded-2xl"
          referrerPolicy="no-referrer"
        />

        {/* Lock Screen Simulated Overlay */}
        {showLockScreenMockup && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 bg-black/30 backdrop-blur-[0.5px] pointer-events-none text-white animate-in fade-in duration-200">
            {/* Mobile Status Bar */}
            <div className="flex items-center justify-between text-xs font-semibold px-2 pt-2 text-white drop-shadow-md">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">5G</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Lock & Time Widget */}
            <div className="flex flex-col items-center text-center mt-8">
              <Lock className="w-4 h-4 mb-2 text-[#D4AF37] drop-shadow" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-300 drop-shadow">
                {currentDate}
              </span>
              <h1 className="text-7xl font-light font-display tracking-tight text-white drop-shadow-lg mt-1">
                {currentTime}
              </h1>
              <div className="mt-4 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] border border-[#8C7851]/40 shadow-lg">
                <span>VibePaper Simulator</span>
              </div>
            </div>

            {/* Bottom Torch & Camera Quick Toggles */}
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <Flashlight className="w-5 h-5 text-white" />
              </div>
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Home Screen App Grid Mockup Overlay */}
        {showHomeScreenMockup && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 bg-black/30 pointer-events-none text-white animate-in fade-in duration-200">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs font-semibold px-2 pt-2 text-white drop-shadow">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Home Screen Icons Matrix Mockup */}
            <div className="grid grid-cols-4 gap-4 px-2 my-auto">
              {['Photos', 'Music', 'Camera', 'Maps', 'Mail', 'Notes', 'Studio', 'Settings'].map(
                (appName) => (
                  <div key={appName} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-white/30 to-white/10" />
                    </div>
                    <span className="text-[10px] font-medium text-white drop-shadow-md">
                      {appName}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Bottom App Dock */}
            <div className="mx-2 p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 grid grid-cols-4 gap-3">
              {['Phone', 'Safari', 'Messages', 'Studio'].map((dockApp) => (
                <div key={dockApp} className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Left Navigation Chevron */}
        {currentIndex > 0 && !hideUI && (
          <button
            id="btn-prev-variation"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#0A0A0B]/80 hover:bg-[#161618] text-[#D4D4D8] hover:text-white backdrop-blur-md border border-[#27272A] hover:border-[#D4AF37]/50 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous variation"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Navigation Chevron */}
        {currentIndex < totalVariations - 1 && !hideUI && (
          <button
            id="btn-next-variation"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#0A0A0B]/80 hover:bg-[#161618] text-[#D4D4D8] hover:text-white backdrop-blur-md border border-[#27272A] hover:border-[#D4AF37]/50 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next variation"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Floating Top Bar (Controls) */}
      <div
        className={`absolute top-0 inset-x-0 z-40 p-4 flex items-center justify-between gap-2 max-w-4xl mx-auto transition-opacity duration-300 ${
          hideUI ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left: Close button */}
        <button
          id="btn-close-fullscreen"
          onClick={onClose}
          className="p-2.5 rounded-sm bg-[#0A0A0B]/90 hover:bg-[#161618] text-[#D4D4D8] hover:text-white backdrop-blur-md border border-[#27272A] hover:border-[#D4AF37]/50 shadow-xl transition-colors cursor-pointer"
          title="Close Fullscreen (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center: Variation Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0A0A0B]/90 backdrop-blur-md border border-[#27272A] text-xs font-mono text-[#D4D4D8]">
          <span className="font-bold text-[#D4AF37] uppercase tracking-wider">
            {VARIATION_LETTERS[currentIndex] || `Var ${currentIndex + 1}`}
          </span>
          <span className="text-[#52525B]">/</span>
          <span>{totalVariations}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Lock Screen preview toggle */}
          <button
            id="btn-toggle-lockscreen-mockup"
            onClick={() => {
              setShowHomeScreenMockup(false);
              setShowLockScreenMockup((prev) => !prev);
            }}
            className={`p-2.5 rounded-sm backdrop-blur-md border transition-colors cursor-pointer ${
              showLockScreenMockup
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                : 'bg-[#0A0A0B]/90 text-[#D4D4D8] hover:text-white border-[#27272A] hover:border-[#D4AF37]/50'
            }`}
            title="Toggle Lock Screen Simulator"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Favorite button */}
          <button
            id="btn-toggle-favorite-fullscreen"
            onClick={() => onToggleFavorite(wallpaper)}
            className={`p-2.5 rounded-sm backdrop-blur-md border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]'
                : 'bg-[#0A0A0B]/90 text-[#D4D4D8] hover:text-white border-[#27272A] hover:border-[#D4AF37]/50'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
          </button>

          {/* Share / Copy button */}
          <button
            id="btn-share-fullscreen"
            onClick={handleShare}
            className="p-2.5 rounded-sm bg-[#0A0A0B]/90 hover:bg-[#161618] text-[#D4D4D8] hover:text-white backdrop-blur-md border border-[#27272A] hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
            title="Share Vibe Prompt"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Bottom Bar: Prominent Download & Remix Actions */}
      <div
        className={`absolute bottom-0 inset-x-0 z-40 p-4 max-w-md mx-auto transition-all duration-300 ${
          hideUI ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-[#0A0A0B]/95 backdrop-blur-xl border border-[#27272A] rounded-md p-4 shadow-2xl flex flex-col gap-3">
          {/* Prompt Summary */}
          <div className="bg-[#161618] border border-[#27272A] p-2.5 rounded-sm">
            <p className="text-xs text-white line-clamp-2 font-serif-editorial italic">
              "{wallpaper.prompt}"
            </p>
          </div>

          {/* Primary Action Buttons: Download & Remix */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Remix Button */}
            <button
              id="btn-remix-fullscreen"
              onClick={() => {
                onRemix(wallpaper);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Remix Vibe</span>
            </button>

            {/* Download Button (Gold) */}
            <button
              id="btn-download-fullscreen"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#D4AF37] hover:bg-[#C49F27] text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 9:16</span>
                </>
              )}
            </button>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#71717A] px-0.5 pt-1 border-t border-[#1F1F23]">
            <span>
              Ratio: <strong className="text-white">{wallpaper.aspectRatio}</strong> • Size:{' '}
              <strong className="text-[#D4AF37]">{wallpaper.imageSize || '1K'}</strong>
            </span>
            <span>Tap to toggle UI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
