export type AspectRatio = '9:16' | '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '16:9' | '21:9';

export type ImageSize = '1K' | '2K' | '4K';

export type ModelOption = 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview';

export interface Wallpaper {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  imageSize: ImageSize;
  model: string;
  createdAt: string;
  variationIndex?: number;
  isRemix?: boolean;
  referenceThumbnail?: string;
  isFavorite?: boolean;
}

export interface GenerationBatch {
  id: string;
  prompt: string;
  timestamp: string;
  aspectRatio: string;
  imageSize: ImageSize;
  model: string;
  wallpapers: Wallpaper[];
  referenceImage?: string;
}

export interface VibePreset {
  id: string;
  title: string;
  prompt: string;
  category: 'Cyberpunk' | 'Nature & Organic' | 'Anime & Lo-Fi' | 'Minimalist' | 'Abstract & OLED' | 'Dreamy & Surreal';
  tags: string[];
  gradientPreview: string;
}
