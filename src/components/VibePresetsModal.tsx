import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { VIBE_PRESETS } from '../data/presets';
import { VibePreset } from '../types';

interface VibePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: VibePreset) => void;
}

const CATEGORIES = [
  'All',
  'Cyberpunk',
  'Anime & Lo-Fi',
  'Minimalist',
  'Nature & Organic',
  'Abstract & OLED',
  'Dreamy & Surreal',
];

export const VibePresetsModal: React.FC<VibePresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const filtered =
    selectedCategory === 'All'
      ? VIBE_PRESETS
      : VIBE_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#0A0A0B] border border-[#1F1F23] rounded-md shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1F1F23] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#161618] border border-[#D4AF37]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-serif-editorial italic text-white">Curated Style Presets</h2>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#71717A]">
                Select an aesthetic to populate the prompt canvas
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

        {/* Category Pills */}
        <div className="px-5 py-3 border-b border-[#1F1F23] bg-[#050506] overflow-x-auto no-scrollbar flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1C1E] border border-[#8C7851]/40 text-[#D4AF37] shadow-sm'
                  : 'bg-[#161618] border border-[#27272A] text-[#71717A] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filtered.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group relative rounded-sm border border-[#27272A] hover:border-[#D4AF37]/50 bg-[#161618] hover:bg-[#1c1c21] p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {preset.title}
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0A0A0B] text-[#D4AF37] border border-[#8C7851]/30 font-mono">
                    {preset.category}
                  </span>
                </div>

                <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed font-serif-editorial italic">
                  "{preset.prompt}"
                </p>
              </div>

              {/* Tags and Action */}
              <div className="mt-3.5 pt-2.5 border-t border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {preset.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] text-[#71717A] bg-[#0A0A0B] px-1.5 py-0.5 rounded-sm border border-[#27272A]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <span>Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
