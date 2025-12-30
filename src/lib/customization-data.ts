// Customization options for personalized bracelets

export type CustomizationType = 'engraving' | 'charm' | 'color' | 'bead';

export interface CharmOption {
  id: string;
  name: string;
  emoji: string;
  category: 'ocean' | 'animals' | 'symbols' | 'nature';
  price: number;
  description: string;
}

export interface EngravingOption {
  maxLength: number;
  pricePerChar: number;
  baseCost: number;
  allowedChars: RegExp;
  fonts: string[];
}

export interface BeadColor {
  id: string;
  name: string;
  hex: string;
  category: 'ocean' | 'earth' | 'sunset' | 'neutral';
}

// Charm catalog
export const CHARM_OPTIONS: CharmOption[] = [
  // Ocean Theme
  { id: 'turtle', name: 'Sea Turtle', emoji: '🐢', category: 'ocean', price: 3, description: 'Symbol of longevity and protection' },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', category: 'ocean', price: 3, description: 'Joy and playfulness' },
  { id: 'whale', name: 'Whale', emoji: '🐋', category: 'ocean', price: 3, description: 'Wisdom and emotional depth' },
  { id: 'shell', name: 'Seashell', emoji: '🐚', category: 'ocean', price: 2, description: 'Ocean memories' },
  { id: 'wave', name: 'Wave', emoji: '🌊', category: 'ocean', price: 2, description: 'Go with the flow' },
  { id: 'starfish', name: 'Starfish', emoji: '⭐', category: 'ocean', price: 2, description: 'Regeneration and healing' },
  { id: 'anchor', name: 'Anchor', emoji: '⚓', category: 'ocean', price: 3, description: 'Stability and hope' },
  { id: 'fish', name: 'Tropical Fish', emoji: '🐠', category: 'ocean', price: 2, description: 'Freedom and happiness' },

  // Animals
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'animals', price: 3, description: 'Transformation' },
  { id: 'bird', name: 'Bird', emoji: '🕊️', category: 'animals', price: 2, description: 'Freedom and peace' },
  { id: 'paw', name: 'Paw Print', emoji: '🐾', category: 'animals', price: 2, description: 'Pet lovers' },

  // Symbols
  { id: 'heart', name: 'Heart', emoji: '❤️', category: 'symbols', price: 2, description: 'Love and compassion' },
  { id: 'infinity', name: 'Infinity', emoji: '♾️', category: 'symbols', price: 3, description: 'Endless possibilities' },
  { id: 'star', name: 'Star', emoji: '✨', category: 'symbols', price: 2, description: 'Guidance and hope' },
  { id: 'moon', name: 'Moon', emoji: '🌙', category: 'symbols', price: 2, description: 'Intuition and dreams' },
  { id: 'sun', name: 'Sun', emoji: '☀️', category: 'symbols', price: 2, description: 'Energy and vitality' },

  // Nature
  { id: 'flower', name: 'Flower', emoji: '🌸', category: 'nature', price: 2, description: 'Beauty and growth' },
  { id: 'leaf', name: 'Leaf', emoji: '🍃', category: 'nature', price: 2, description: 'Nature connection' },
  { id: 'palm', name: 'Palm Tree', emoji: '🌴', category: 'nature', price: 3, description: 'Tropical vibes' },
];

// Engraving settings
export const ENGRAVING_OPTIONS: EngravingOption = {
  maxLength: 15,
  pricePerChar: 0.5,
  baseCost: 5,
  allowedChars: /^[A-Za-z0-9\s\-\.\,\!\?\'\"&]+$/,
  fonts: ['Script', 'Block', 'Italic'],
};

// Bead color options
export const BEAD_COLORS: BeadColor[] = [
  // Ocean
  { id: 'deep-blue', name: 'Deep Blue', hex: '#1e3a5f', category: 'ocean' },
  { id: 'turquoise', name: 'Turquoise', hex: '#40e0d0', category: 'ocean' },
  { id: 'sea-green', name: 'Sea Green', hex: '#2e8b57', category: 'ocean' },
  { id: 'aqua', name: 'Aqua', hex: '#00ffff', category: 'ocean' },
  { id: 'navy', name: 'Navy', hex: '#000080', category: 'ocean' },

  // Earth
  { id: 'terracotta', name: 'Terracotta', hex: '#e2725b', category: 'earth' },
  { id: 'sand', name: 'Sand', hex: '#c2b280', category: 'earth' },
  { id: 'forest', name: 'Forest', hex: '#228b22', category: 'earth' },
  { id: 'brown', name: 'Brown', hex: '#8b4513', category: 'earth' },

  // Sunset
  { id: 'coral', name: 'Coral', hex: '#ff7f50', category: 'sunset' },
  { id: 'pink', name: 'Pink', hex: '#ff69b4', category: 'sunset' },
  { id: 'orange', name: 'Orange', hex: '#ff8c00', category: 'sunset' },
  { id: 'gold', name: 'Gold', hex: '#ffd700', category: 'sunset' },

  // Neutral
  { id: 'white', name: 'White', hex: '#ffffff', category: 'neutral' },
  { id: 'black', name: 'Black', hex: '#000000', category: 'neutral' },
  { id: 'gray', name: 'Gray', hex: '#808080', category: 'neutral' },
  { id: 'silver', name: 'Silver', hex: '#c0c0c0', category: 'neutral' },
];

// Calculate total customization price
export function calculateCustomizationPrice(
  engraving: string | null,
  charms: string[],
  font?: string
): number {
  let total = 0;

  // Engraving cost
  if (engraving && engraving.trim().length > 0) {
    total += ENGRAVING_OPTIONS.baseCost;
    total += engraving.length * ENGRAVING_OPTIONS.pricePerChar;
  }

  // Charms cost
  charms.forEach(charmId => {
    const charm = CHARM_OPTIONS.find(c => c.id === charmId);
    if (charm) {
      total += charm.price;
    }
  });

  return Math.round(total * 100) / 100;
}
