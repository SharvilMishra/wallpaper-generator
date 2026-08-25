import React, { useState } from 'react';
import {
  X,
  History,
  Heart,
  Download,
  Trash2,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { GenerationBatch, Wallpaper } from '../types';
import { downloadWallpaper } from '../utils/wallpaperUtils';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  batches: GenerationBatch[];
  favorites: Wallpaper[];
  onSelectWallpaper: (wp: Wallpaper) => void;
  onRemixWallpaper: (wp: Wallpaper) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  batches,
  favorites,
  onSelectWallpaper,
  onRemixWallpaper,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  if (!isOpen) return null;

  const allHistoryWallpapers = batches.flatMap((b) => b.wallpapers);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0B] border-l border-[#1F1F23] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#1F1F23] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-[#161618] border border-[#D4AF37]/30 flex items-center justify-center">
                <History className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-base font-serif-editorial italic text-white">
                  Archive & Favorites
                </h2>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#71717A]">
                  Session Wallpaper Logs
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-white hover:bg-[#161618] rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="p-3 bg-[#050506] border-b border-[#1F1F23] grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center justify-center gap-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#1A1C1E] border border-[#8C7851]/40 text-[#D4AF37] shadow-sm'
                  : 'text-[#71717A] hover:text-white border border-transparent'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({allHistoryWallpapers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center justify-center gap-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#1A1C1E] border border-[#8C7851]/40 text-[#D4AF37] shadow-sm'
                  : 'text-[#71717A] hover:text-white border border-transparent'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Saved ({favorites.length})</span>
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'history' ? (
              batches.length === 0 ? (
                <div className="text-center py-16 text-[#52525B]">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#71717A]" />
                  <p className="text-sm font-serif-editorial italic text-[#A1A1AA]">No batch history in this session yet.</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#52525B] mt-1">Generated wallpapers will appear here</p>
                </div>
              ) : (
                batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="bg-[#161618] border border-[#27272A] rounded-sm p-3.5 space-y-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif-editorial italic text-white line-clamp-1 max-w-[200px]">
                        "{batch.prompt}"
                      </span>
                      <span className="text-[10px] text-[#71717A] font-mono">
                        {new Date(batch.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* 4 variations thumbnail strip */}
                    <div className="grid grid-cols-4 gap-2">
                      {batch.wallpapers.map((wp, idx) => (
                        <div
                          key={wp.id || `thumb_${idx}`}
                          onClick={() => onSelectWallpaper(wp)}
                          className="relative aspect-[9/16] rounded-sm overflow-hidden border border-[#27272A] hover:border-[#D4AF37]/60 transition-all cursor-pointer group bg-black"
                        >
                          <img
                            src={wp.url}
                            alt={wp.prompt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            ) : favorites.length === 0 ? (
              <div className="text-center py-16 text-[#52525B]">
                <Heart className="w-8 h-8 mx-auto mb-2 text-[#71717A]" />
                <p className="text-sm font-serif-editorial italic text-[#A1A1AA]">No bookmarked wallpapers.</p>
                <p className="text-[10px] uppercase tracking-widest text-[#52525B] mt-1">
                  Tap the heart icon on any card to save it
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {favorites.map((wp) => (
                  <div
                    key={wp.id}
                    className="relative aspect-[9/16] rounded-sm overflow-hidden border border-[#27272A] bg-black group shadow-xl"
                  >
                    <img
                      src={wp.url}
                      alt={wp.prompt}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          onClick={() => downloadWallpaper(wp.url, wp.prompt)}
                          className="p-1.5 rounded-sm bg-[#D4AF37] text-black hover:bg-[#C49F27]"
                          title="Download"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectWallpaper(wp)}
                          className="flex-1 py-1.5 px-2 text-[9px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white rounded-sm backdrop-blur-sm text-center"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            onRemixWallpaper(wp);
                            onClose();
                          }}
                          className="py-1.5 px-2 text-[9px] font-bold uppercase tracking-wider bg-white hover:bg-zinc-200 text-black rounded-sm"
                        >
                          Remix
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {batches.length > 0 && activeTab === 'history' && (
            <div className="p-3.5 border-t border-[#1F1F23] flex justify-end bg-[#050506]">
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-white hover:bg-[#161618] rounded-sm transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#71717A]" />
                <span>Clear Archive</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
