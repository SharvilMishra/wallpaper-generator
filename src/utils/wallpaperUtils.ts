import { AspectRatio } from '../types';

export const ASPECT_RATIOS: Array<{
  value: AspectRatio;
  label: string;
  sublabel: string;
  iconRatio: string;
}> = [
  { value: '9:16', label: '9:16', sublabel: 'Phone Wallpaper (Default)', iconRatio: 'w-3 h-5' },
  { value: '1:1', label: '1:1', sublabel: 'Square / Avatar', iconRatio: 'w-4 h-4' },
  { value: '2:3', label: '2:3', sublabel: 'Classic Portrait', iconRatio: 'w-3.5 h-5' },
  { value: '3:2', label: '3:2', sublabel: 'Classic Photo', iconRatio: 'w-5 h-3.5' },
  { value: '3:4', label: '3:4', sublabel: 'Tablet Portrait', iconRatio: 'w-3.5 h-4.5' },
  { value: '4:3', label: '4:3', sublabel: 'Tablet Landscape', iconRatio: 'w-4.5 h-3.5' },
  { value: '16:9', label: '16:9', sublabel: 'Desktop / Widescreen', iconRatio: 'w-5 h-3' },
  { value: '21:9', label: '21:9', sublabel: 'Ultra-Wide Cinematic', iconRatio: 'w-6 h-2.5' },
];

export function getAspectRatioClass(ratio: string): string {
  switch (ratio) {
    case '9:16':
      return 'aspect-[9/16]';
    case '1:1':
      return 'aspect-square';
    case '2:3':
      return 'aspect-[2/3]';
    case '3:2':
      return 'aspect-[3/2]';
    case '3:4':
      return 'aspect-[3/4]';
    case '4:3':
      return 'aspect-[4/3]';
    case '16:9':
      return 'aspect-[16/9]';
    case '21:9':
      return 'aspect-[21/9]';
    default:
      return 'aspect-[9/16]';
  }
}

/**
 * Downloads a wallpaper image (base64 or remote URL)
 */
export async function downloadWallpaper(url: string, filenamePrompt: string = 'wallpaper') {
  try {
    const cleanPrompt = filenamePrompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30);
    const filename = `vibepaper-${cleanPrompt || 'vibe'}-${Date.now()}.png`;

    if (url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }

    // For remote URL, fetch as blob
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    return true;
  } catch (err) {
    console.error('Error downloading wallpaper:', err);
    // Fallback: open image in new tab if allowed
    const win = window.open(url, '_blank');
    if (!win) {
      window.location.href = url;
    }
    return false;
  }
}
