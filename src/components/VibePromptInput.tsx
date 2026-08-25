import React, { useRef, useEffect } from 'react';
import {
  Wand2,
  X,
  Shuffle,
  RefreshCw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { AspectRatio, ImageSize, ModelOption } from '../types';
import { ASPECT_RATIOS } from '../utils/wallpaperUtils';

interface VibePromptInputProps {
  prompt: string;
  setPrompt: (v: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  imageSize: ImageSize;
  setImageSize: (v: ImageSize) => void;
  model: ModelOption;
  setModel: (v: ModelOption) => void;
  referenceImage: string | null;
  onClearReferenceImage: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  onOpenPresets: () => void;
}

const QUICK_VIBES = [
  'Rainy cyberpunk lo-fi street at dusk, neon reflections in puddles',
  'Lush Ghibli summer meadow with golden afternoon sunlight',
  'Dark obsidian liquid waves with delicate 24k gold veins',
  'Tokyo midnight drizzle with moody crimson taillight bokeh',
  'Ethereal emerald aurora borealis dancing over snowy peaks',
  'Minimalist monochrome foggy alpine pine forest with negative space',
  'Iridescent fluid silk ribbons floating in deep black OLED void',
];

export const VibePromptInput: React.FC<VibePromptInputProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  imageSize,
  setImageSize,
  model,
  setModel,
  referenceImage,
  onClearReferenceImage,
  onGenerate,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        onGenerate();
      }
    }
  };

  const handleRandomVibe = () => {
    const random = QUICK_VIBES[Math.floor(Math.random() * QUICK_VIBES.length)];
    setPrompt(random);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2">
      <div className="bg-[#0A0A0B] border border-[#1F1F23] rounded-md p-4 sm:p-5 shadow-2xl transition-all">
        {/* Remix active banner if referenceImage is present */}
        {referenceImage && (
          <div className="mb-4 p-3 bg-[#161618] border border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 rounded-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-9 h-14 rounded-sm overflow-hidden border border-[#D4AF37]/50 shrink-0 bg-black shadow-md">
                <img
                  src={referenceImage}
                  alt="Remix Reference"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 inset-x-0 bg-[#D4AF37] text-[8px] text-center font-bold text-black py-0.5 uppercase tracking-tighter">
                  REF
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Remix Reference Active
                  </p>
                </div>
                <p className="text-[11px] text-[#A1A1AA] truncate font-serif-editorial italic">
                  Next batch of 4 variations will be inspired by this visual composition
                </p>
              </div>
            </div>
            <button
              onClick={onClearReferenceImage}
              className="p-1.5 text-[#71717A] hover:text-white hover:bg-[#1f1f23] rounded-sm transition-colors cursor-pointer shrink-0"
              title="Cancel Remix Reference"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Label */}
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="vibe-prompt-textarea"
            className="block text-[10px] uppercase tracking-[0.2em] text-[#71717A] font-semibold"
          >
            Vibe Prompt & Nuance Description
          </label>
          <span className="text-[10px] uppercase tracking-widest text-[#52525B]">
            9:16 Mobile Aspect
          </span>
        </div>

        {/* Text Input Box */}
        <div className="relative bg-[#161618] border border-[#27272A] focus-within:border-[#D4AF37]/50 focus-within:ring-1 focus-within:ring-[#D4AF37]/20 p-3.5 rounded-md transition-all">
          <textarea
            ref={textareaRef}
            id="vibe-prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your wallpaper aesthetic (e.g., 'Rainy cyberpunk lo-fi street at dusk, neon reflections in puddles, grain texture, cinematic lighting')..."
            rows={2}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-[#52525B] resize-none focus:outline-none pr-8 leading-relaxed font-serif-editorial italic"
          />
          {prompt.length > 0 && (
            <button
              onClick={() => setPrompt('')}
              className="absolute top-3 right-3 p-1 text-[#71717A] hover:text-white transition-colors cursor-pointer"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Style Presets Carousel */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] font-semibold">
              Style Inspirations
            </span>
          </div>

          <div className="-mx-1 px-1 overflow-x-auto no-scrollbar flex items-center gap-2 py-0.5">
            <button
              onClick={handleRandomVibe}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1C1E] border border-[#8C7851]/40 text-[#D4AF37] text-[11px] font-medium rounded-full transition-all shrink-0 cursor-pointer hover:bg-[#D4AF37]/10"
              title="Surprise with random aesthetic"
            >
              <Shuffle className="w-3 h-3 text-[#D4AF37]" />
              <span className="uppercase tracking-wider text-[10px] font-bold">Surprise</span>
            </button>

            {QUICK_VIBES.map((vibe) => (
              <button
                key={vibe}
                onClick={() => {
                  setPrompt(vibe);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="px-3 py-1 text-[11px] font-normal text-[#A1A1AA] hover:text-white bg-[#161618] hover:bg-[#1c1c21] border border-[#27272A] rounded-full transition-all shrink-0 cursor-pointer whitespace-nowrap"
              >
                {vibe.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Settings & Primary Action */}
        <div className="mt-4 pt-3.5 border-t border-[#1F1F23] flex flex-wrap items-center justify-between gap-3">
          {/* Controls Cluster */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Aspect Ratio Selector */}
            <div className="relative">
              <label htmlFor="select-aspect-ratio" className="sr-only">Aspect Ratio</label>
              <select
                id="select-aspect-ratio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="bg-[#161618] border border-[#27272A] hover:border-[#D4AF37]/40 text-[#D4D4D8] font-mono text-xs rounded-sm px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                title="Select Aspect Ratio (Default 9:16 for Phone)"
              >
                {ASPECT_RATIOS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} {item.value === '9:16' ? '(Phone 9:16)' : `(${item.sublabel})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Resolution Selector */}
            <div className="flex items-center bg-[#161618] border border-[#27272A] rounded-sm p-0.5">
              {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                <button
                  key={size}
                  id={`btn-size-${size}`}
                  onClick={() => setImageSize(size)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-sm transition-all cursor-pointer ${
                    imageSize === size
                      ? 'bg-[#D4AF37] text-black shadow-sm'
                      : 'text-[#71717A] hover:text-white'
                  }`}
                  title={`${size} Resolution`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Model Selector */}
            <div className="relative">
              <label htmlFor="select-model" className="sr-only">AI Model</label>
              <select
                id="select-model"
                value={model}
                onChange={(e) => setModel(e.target.value as ModelOption)}
                className="bg-[#161618] border border-[#27272A] hover:border-[#D4AF37]/40 text-[#D4D4D8] text-xs rounded-sm px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-[#D4AF37]/50 transition-colors max-w-[170px] sm:max-w-none truncate"
                title="Select Image Generation Model"
              >
                <option value="gemini-3-pro-image-preview">Gemini 3 Pro (Studio Quality)</option>
                <option value="gemini-3.1-flash-image-preview">Gemini 3.1 Flash (Fast)</option>
              </select>
            </div>
          </div>

          {/* Primary Generate Button (Gold luxury action) */}
          <button
            id="btn-generate-wallpapers"
            onClick={onGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#D4AF37] hover:bg-[#C49F27] disabled:opacity-40 disabled:cursor-not-allowed rounded-sm shadow-xl transition-all cursor-pointer active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Rendering 4 Variations...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate Variations</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
