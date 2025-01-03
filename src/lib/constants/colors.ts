// Character-specific colors with matching text colors
export const CHARACTER_COLORS: Record<string, { bg: string; text: string; name: string }> = {
  'Quick': {
    bg: 'from-blue-500/20 to-blue-700/20',
    text: 'text-blue-200',
    name: 'text-blue-400'
  },
  'Buddy': {
    bg: 'from-green-500/20 to-green-700/20',
    text: 'text-green-200',
    name: 'text-green-400'
  },
  'Narrator': {
    bg: 'from-purple-500/20 to-purple-700/20',
    text: 'text-purple-200',
    name: 'text-purple-400'
  }
};

// Get colors for a character, with fallback
export function getCharacterColor(character: string): { bg: string; text: string; name: string } {
  return CHARACTER_COLORS[character] || {
    bg: 'from-gray-500/20 to-gray-700/20',
    text: 'text-gray-200',
    name: 'text-gray-400'
  };
} 