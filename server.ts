import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy Google Gen AI client helper
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

interface GenerateRequest {
  prompt: string;
  aspectRatio?: string;
  imageSize?: '1K' | '2K' | '4K';
  model?: string;
  referenceImage?: string; // Base64 data url
  count?: number;
}

const VARIATION_MODIFIERS = [
  'cinematic depth, atmospheric lighting, ultra high resolution phone wallpaper composition',
  'alternative angle and rich color harmony, striking visual balance, clean aesthetic wallpaper framing',
  'minimalist focal contrast, subtle atmospheric details, serene negative space, aesthetic wallpaper style',
  'vibrant mood, glowing ambient highlights, intricate textures, pristine phone wallpaper design',
];

// Single image generator helper
async function generateSingleWallpaper({
  ai,
  modelName,
  basePrompt,
  modifier,
  aspectRatio,
  imageSize,
  referenceImage,
  index,
}: {
  ai: GoogleGenAI;
  modelName: string;
  basePrompt: string;
  modifier: string;
  aspectRatio: string;
  imageSize: '1K' | '2K' | '4K';
  referenceImage?: string;
  index: number;
}) {
  const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

  let fullPrompt = `${basePrompt}. Style nuance: ${modifier}. Optimized for mobile phone wallpaper display, no text, no watermarks.`;

  if (referenceImage) {
    const cleanBase64 = referenceImage.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const mimeMatch = referenceImage.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    });

    fullPrompt = `Remix and create a creative variation of this reference image based on the following vibe: ${basePrompt}. Keep the core aesthetic vibe, tone and composition inspired by the reference while introducing fresh artistic variation #${index + 1} (${modifier}). Perfect for a mobile wallpaper without text or watermarks.`;
  }

  parts.push({
    text: fullPrompt,
  });

  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: parts,
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '2:3' | '3:2' | '21:9',
        imageSize: imageSize,
      },
    },
  });

  let imageUrl: string | null = null;
  const candidateParts = response.candidates?.[0]?.content?.parts || [];

  for (const part of candidateParts) {
    if (part.inlineData && part.inlineData.data) {
      const mime = part.inlineData.mimeType || 'image/png';
      imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
    throw new Error(`Variation ${index + 1} did not return image data`);
  }

  return {
    id: `wp_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`,
    url: imageUrl,
    prompt: basePrompt,
    aspectRatio,
    imageSize,
    model: modelName,
    createdAt: new Date().toISOString(),
    variationIndex: index,
    isRemix: Boolean(referenceImage),
  };
}

// Wallpaper generation endpoint
app.post('/api/generate-wallpapers', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      aspectRatio = '9:16',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      referenceImage,
      count = 4,
    } = req.body as GenerateRequest;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();
    const effectiveCount = Math.min(Math.max(1, count), 4);
    const targetModel = model || 'gemini-3-pro-image-preview';

    // Generate variations concurrently
    const generationPromises = Array.from({ length: effectiveCount }).map((_, idx) => {
      const modifier = VARIATION_MODIFIERS[idx % VARIATION_MODIFIERS.length];
      return generateSingleWallpaper({
        ai,
        modelName: targetModel,
        basePrompt: prompt.trim(),
        modifier,
        aspectRatio,
        imageSize,
        referenceImage,
        index: idx,
      }).catch((err) => {
        console.error(`Variation ${idx + 1} failed:`, err);
        return null;
      });
    });

    const results = await Promise.all(generationPromises);
    const wallpapers = results.filter((wp): wp is NonNullable<typeof wp> => wp !== null);

    if (wallpapers.length === 0) {
      return res.status(500).json({
        error: 'Failed to generate wallpapers. Please check your prompt or API quota and try again.',
      });
    }

    return res.json({
      success: true,
      wallpapers,
      count: wallpapers.length,
      requestedCount: effectiveCount,
      aspectRatio,
      imageSize,
      model: targetModel,
    });
  } catch (error: any) {
    console.error('Error generating wallpapers:', error);
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred while generating wallpapers.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VibePaper server running on http://localhost:${PORT}`);
  });
}

startServer();
