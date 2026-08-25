import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VibePromptInput } from './components/VibePromptInput';
import { WallpaperGrid } from './components/WallpaperGrid';
import { FullScreenViewer } from './components/FullScreenViewer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { VibePresetsModal } from './components/VibePresetsModal';
import { SettingsModal } from './components/SettingsModal';
import { AspectRatio, ImageSize, ModelOption, Wallpaper, GenerationBatch, VibePreset } from './types';
import { STARTER_WALLPAPERS } from './data/presets';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const STORAGE_KEY_FAVORITES = 'vibepaper_favorites_v1';
const STORAGE_KEY_BATCHES = 'vibepaper_batches_v1';

export default function App() {
  // Generator State
  const [prompt, setPrompt] = useState('Rainy cyberpunk lo-fi alleyway at midnight, neon reflections in puddles');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [model, setModel] = useState<ModelOption>('gemini-3-pro-image-preview');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Wallpapers & Batches
  const [currentWallpapers, setCurrentWallpapers] = useState<Wallpaper[]>(STARTER_WALLPAPERS);
  const [batches, setBatches] = useState<GenerationBatch[]>([]);
  const [favorites, setFavorites] = useState<Record<string, Wallpaper>>({});

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState<number | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Load persistence
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      const savedBatches = localStorage.getItem(STORAGE_KEY_BATCHES);
      if (savedBatches) {
        const parsed = JSON.parse(savedBatches);
        setBatches(parsed);
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
  }, []);

  // Save favorites
  const handleToggleFavorite = (wp: Wallpaper) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      if (updated[wp.id]) {
        delete updated[wp.id];
        showToast('Removed from favorites', 'success');
      } else {
        updated[wp.id] = { ...wp, isFavorite: true };
        showToast('Saved to favorites!', 'success');
      }
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  };

  const showToast = (message: string, type: 'error' | 'success' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Generate 4 wallpaper variations
  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setNotification(null);

    try {
      const response = await fetch('/api/generate-wallpapers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          imageSize,
          model,
          referenceImage: referenceImage || undefined,
          count: 4,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate wallpapers');
      }

      const generatedWallpapers: Wallpaper[] = data.wallpapers;

      if (generatedWallpapers && generatedWallpapers.length > 0) {
        setCurrentWallpapers(generatedWallpapers);

        const newBatch: GenerationBatch = {
          id: `batch_${Date.now()}`,
          prompt: prompt.trim(),
          timestamp: new Date().toISOString(),
          aspectRatio,
          imageSize,
          model,
          wallpapers: generatedWallpapers,
          referenceImage: referenceImage || undefined,
        };

        setBatches((prev) => {
          const updated = [newBatch, ...prev].slice(0, 30);
          try {
            localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        });

        showToast(`Generated ${generatedWallpapers.length} aesthetic variations!`, 'success');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast(
        err.message || 'Generation failed. Please try a different vibe description.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Remix trigger: sets current wallpaper as reference for next generation batch
  const handleRemixWallpaper = (wp: Wallpaper) => {
    setReferenceImage(wp.url);
    setPrompt(wp.prompt || prompt);
    setAspectRatio((wp.aspectRatio as AspectRatio) || aspectRatio);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Wallpaper set as Remix reference! Adjust prompt or tap Generate.', 'success');
  };

  const handleSelectPreset = (preset: VibePreset) => {
    setPrompt(preset.prompt);
    showToast(`Loaded "${preset.title}" vibe!`, 'success');
  };

  const activeWallpaper =
    activeWallpaperIndex !== null && currentWallpapers[activeWallpaperIndex]
      ? currentWallpapers[activeWallpaperIndex]
      : null;

  return (
    <div className="min-h-screen bg-[#050506] text-[#D4D4D8] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`max-w-md w-full px-4 py-3 rounded-sm shadow-2xl flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider backdrop-blur-xl border ${
              notification.type === 'error'
                ? 'bg-[#161618] text-rose-300 border-rose-900/60 shadow-rose-950/30'
                : 'bg-[#161618] text-[#D4AF37] border-[#8C7851]/60 shadow-black/80'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            )}
            <span className="flex-1 font-sans font-medium text-white normal-case tracking-normal">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        favoritesCount={Object.keys(favorites).length}
        historyCount={batches.length}
        imageSize={imageSize}
        aspectRatio={aspectRatio}
        model={model}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col">
        {/* Vibe Prompt Input Area */}
        <VibePromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          imageSize={imageSize}
          setImageSize={setImageSize}
          model={model}
          setModel={setModel}
          referenceImage={referenceImage}
          onClearReferenceImage={() => setReferenceImage(null)}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onOpenPresets={() => setIsPresetsOpen(true)}
        />

        {/* 4 Wallpaper Variations Grid */}
        <WallpaperGrid
          wallpapers={currentWallpapers}
          isLoading={isLoading}
          onSelectWallpaper={(wp, idx) => setActiveWallpaperIndex(idx)}
          onRemixWallpaper={handleRemixWallpaper}
          onToggleFavorite={handleToggleFavorite}
          favorites={Object.fromEntries(
            Object.entries(favorites).map(([id]) => [id, true])
          )}
          aspectRatio={aspectRatio}
          currentPrompt={prompt}
        />
      </main>

      {/* Full-Screen Wallpaper Modal Viewer */}
      {activeWallpaper && (
        <FullScreenViewer
          wallpaper={activeWallpaper}
          wallpapersList={currentWallpapers}
          currentIndex={activeWallpaperIndex ?? 0}
          onClose={() => setActiveWallpaperIndex(null)}
          onNavigate={(newIndex) => setActiveWallpaperIndex(newIndex)}
          onRemix={handleRemixWallpaper}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={Boolean(favorites[activeWallpaper.id])}
        />
      )}

      {/* History & Favorites Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        batches={batches}
        favorites={Object.values(favorites)}
        onSelectWallpaper={(wp) => {
          setCurrentWallpapers([wp]);
          setActiveWallpaperIndex(0);
          setIsHistoryOpen(false);
        }}
        onRemixWallpaper={(wp) => {
          handleRemixWallpaper(wp);
          setIsHistoryOpen(false);
        }}
        onClearHistory={() => {
          setBatches([]);
          localStorage.removeItem(STORAGE_KEY_BATCHES);
          showToast('Session history cleared', 'success');
        }}
      />

      {/* Presets Library Modal */}
      <VibePresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        imageSize={imageSize}
        setImageSize={setImageSize}
        model={model}
        setModel={setModel}
      />
    </div>
  );
}
