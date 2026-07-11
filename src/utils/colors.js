export const COLORS = [
  '#E53E3E', // red.500
  '#C53030', // red.600
  '#DD6B20', // orange.500
  '#C05621', // orange.600
  '#D69E2E', // yellow.500
  '#B7791F', // yellow.600
  '#38A169', // green.500
  '#2F855A', // green.600
  '#319795', // teal.500
  '#2C7A7B', // teal.600
  '#3182CE', // blue.500
  '#2B6CB0', // blue.600
  '#00B5D8', // cyan.500
  '#00A3C4', // cyan.600
  '#805AD5', // purple.500
  '#6B46C1', // purple.600
  '#D53F8C', // pink.500
  '#B83280', // pink.600
];

export const GENRE_COLORS = {
  rock: '#E53E3E',
  jazz: '#805AD5',
  classical: '#3182CE',
  electronic: '#38A169',
  pop: '#D53F8C',
  default: (tag) => {
    if (!tag) return COLORS[0];
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
