export const COLORS = [
  'red.500',
  'red.600',
  'orange.500',
  'orange.600',
  'yellow.500',
  'yellow.600',
  'green.500',
  'green.600',
  'teal.500',
  'teal.600',
  'blue.500',
  'blue.600',
  'cyan.500',
  'cyan.600',
  'purple.500',
  'purple.600',
  'pink.500',
  'pink.600',
];

export const GENRE_COLORS = {
  rock: 'red.500',
  jazz: 'purple.500',
  classical: 'blue.500',
  electronic: 'green.500',
  pop: 'pink.500',
  default: (tag) => {
    if (!tag) return COLORS[0];
    // Use the first 7 characters (or less if the tag is shorter) to determine color index
    const charSum = tag
      .slice(0, 7)
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return COLORS[charSum % COLORS.length];
  },
};

export const getGenreColor = (tag) => {
  return GENRE_COLORS[tag?.toLowerCase()] || GENRE_COLORS.default(tag);
};
