import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { AspectRatio, ImageSize, ModelOption } from '../types';
import { ASPECT_RATIOS } from '../utils/wallpaperUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  imageSize: ImageSize;
  setImageSize: (v: ImageSize) => void;
  model: ModelOption;
  setModel: (v: ModelOption) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  aspectRatio,
  setAspectRatio,
  imageSize,
  setImageSize,
  model,
  setModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0A0A0B] border border-[#1F1F23] rounded-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1F1F23] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#161618] border border-[#D4AF37]/30 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-serif-editorial italic text-white">Renderer & Canvas Setup</h2>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#71717A]">
                Configure resolution, aspect ratios, and model fidelity
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

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Aspect Ratio Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Display Aspect Ratio
              </label>
              <span className="text-xs font-mono text-[#D4AF37]">{aspectRatio}</span>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-3 font-serif-editorial italic">
              Standard 9:16 vertical framing formatted for flagship mobile displays.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((item) => {
                const isSelected = aspectRatio === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setAspectRatio(item.value)}
                    className={`p-2.5 rounded-sm border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8C7851] bg-[#1A1C1E] text-[#D4AF37] shadow-sm'
                        : 'border-[#27272A] bg-[#161618] hover:bg-[#1c1c21] text-[#A1A1AA]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold">{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#71717A] line-clamp-1 leading-tight">
                      {item.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Size / Resolution Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Render Resolution
              </label>
              <span className="text-xs font-mono text-[#D4AF37]">{imageSize}</span>
            </div>
            <p className="text-xs text-[#A1A1AA] mb-3 font-serif-editorial italic">
              Target canvas fidelity. 4K delivers razor-sharp clarity for lock screen assets.
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { size: '1K', desc: '1080p HD' },
                  { size: '2K', desc: 'QHD Canvas' },
                  { size: '4K', desc: 'Ultra HD 4K' },
                ] as const
              ).map(({ size, desc }) => {
                const isSelected = imageSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`p-3 rounded-sm border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8C7851] bg-[#1A1C1E] text-[#D4AF37]'
                        : 'border-[#27272A] bg-[#161618] hover:bg-[#1c1c21] text-[#A1A1AA]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">{size}</span>
                    <span className="text-[10px] text-[#71717A]">{desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection Section */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-white block mb-2">
              AI Generation Engine
            </label>
            <div className="space-y-2.5">
              {[
                {
                  id: 'gemini-3-pro-image-preview',
                  name: 'Gemini 3 Pro Image (Ultra Editorial)',
                  desc: 'Uncompromising texture realism, atmospheric lighting, and high-fidelity nuance.',
                  badge: 'Premier',
                },
                {
                  id: 'gemini-3.1-flash-image-preview',
                  name: 'Gemini 3.1 Flash Image',
                  desc: 'Rapid iteration, vibrant color expression, and responsive prompt rendering.',
                  badge: 'Standard',
                },
              ].map((m) => {
                const isSelected = model === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id as ModelOption)}
                    className={`w-full p-3.5 rounded-sm border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8C7851] bg-[#1A1C1E] text-[#D4AF37]'
                        : 'border-[#27272A] bg-[#161618] hover:bg-[#1c1c21] text-[#A1A1AA]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{m.name}</span>
                        <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-[#0A0A0B] text-[#D4AF37] border border-[#8C7851]/30 font-medium">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] leading-relaxed font-serif-editorial italic">{m.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F1F23] bg-[#050506] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#C49F27] rounded-sm transition-colors cursor-pointer"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
