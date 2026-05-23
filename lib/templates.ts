export interface Template {
  id: string;
  name: string;
  description: string;
  layout: 'strip' | 'grid2x2' | 'grid3x2' | 'single' | 'strip3';
  photoCount: number;
  frameColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fonts: string;
  hasLogo: boolean;
  hasDate: boolean;
  hasFrame: boolean;
  frameWidth: number;
  aspectRatio?: string;
  overlayOpacity?: number;
  overlayImage?: string;
  slotsJson?: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'classic-strip',
    name: '🤍 Classic Strip',
    description: 'Strip 4 foto vertikal klasik ala photobooth retro dengan background putih bersih',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#e91e8c',
    fonts: 'Georgia',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 20,
  },
  {
    id: 'dark-elegant',
    name: '✨ Dark Elegant',
    description: 'Strip elegan dengan background gelap mewah dan aksen emas berkilau',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#d4af37',
    backgroundColor: '#1a1a2e',
    textColor: '#d4af37',
    accentColor: '#f4e157',
    fonts: 'Playfair Display',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 16,
  },
  {
    id: 'pink-love',
    name: '💗 Pink Love',
    description: 'Template romantis dengan tema pink pastel yang manis dan elegan',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#ff69b4',
    backgroundColor: '#fff0f5',
    textColor: '#c2185b',
    accentColor: '#ff4081',
    fonts: 'Dancing Script',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 18,
  },
  {
    id: 'grid-modern',
    name: '⬛ Grid Modern',
    description: 'Grid 2x2 minimalis dengan desain modern dan warna clean',
    layout: 'grid2x2',
    photoCount: 4,
    frameColor: '#2d2d2d',
    backgroundColor: '#f5f5f5',
    textColor: '#2d2d2d',
    accentColor: '#6200ea',
    fonts: 'Inter',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 12,
  },
  {
    id: 'neon-party',
    name: '💚 Neon Party',
    description: 'Tema pesta seru dengan efek neon hijau menyala di background gelap',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#00ff88',
    backgroundColor: '#0d0d0d',
    textColor: '#00ff88',
    accentColor: '#ff00ff',
    fonts: 'Courier New',
    hasLogo: true,
    hasDate: false,
    hasFrame: true,
    frameWidth: 14,
  },
  {
    id: 'vintage-film',
    name: '🎞️ Vintage Film',
    description: 'Estetika film analog klasik dengan warna hangat dan tekstur retro',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#8b7355',
    backgroundColor: '#f5e6c8',
    textColor: '#3e2723',
    accentColor: '#795548',
    fonts: 'Courier New',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 24,
  },
  {
    id: 'midnight-blue',
    name: '🌙 Midnight Blue',
    description: 'Template dengan gradien biru tengah malam yang dramatis dan elegan',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#4158d0',
    backgroundColor: '#0f0c29',
    textColor: '#c9d6ff',
    accentColor: '#a78bfa',
    fonts: 'Inter',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 16,
  },
  {
    id: 'summer-vibes',
    name: '🌅 Summer Vibes',
    description: 'Warna cerah musim panas dengan gradien orange-kuning yang menyenangkan',
    layout: 'strip',
    photoCount: 4,
    frameColor: '#ff6b35',
    backgroundColor: '#fff9f0',
    textColor: '#d84315',
    accentColor: '#ff9800',
    fonts: 'Inter',
    hasLogo: true,
    hasDate: true,
    hasFrame: true,
    frameWidth: 18,
  },
];
