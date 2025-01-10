const sharp = require('sharp');
const fs = require('fs');
const toIco = require('png-to-ico');

// Создаем SVG строку с логотипом (только иконка без текста)
const svgString = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#1a1a1a"/>
  <path
    d="M10 10c4 0 8 0 12 2M12 16c3 0 5 0 8 2M14 22c2 0 2 0 4 2"
    stroke="#ffffff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
`;

// Создаем временный SVG файл
fs.writeFileSync('temp-logo.svg', svgString);

// Расширенный массив размеров для всех типов иконок
const sizes = [
  { size: 16, name: 'favicon-16x16' },
  { size: 32, name: 'favicon-32x32' },
  { size: 128, name: 'favicon-128x128' },
  { size: 192, name: 'android-chrome-192x192' },
  { size: 256, name: 'favicon-256x256' },
  { size: 512, name: 'android-chrome-512x512' },
  { size: 180, name: 'apple-touch-icon' },
  {
    size: { width: 1280, height: 720 }, // 16:9 ratio
    name: 'media-thumbnail',
    special: true, // Flag to handle different aspect ratio
  },
];

// Modified SVG for media thumbnail (rectangular, different background)
const mediaThumbnailSvg = `
<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#1a1a1a"/>
  <path
    d="M540 310c160 0 320 0 480 80M620 460c120 0 200 0 320 80M700 610c80 0 80 0 160 80"
    stroke="#ffffff"
    strokeWidth="40"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
`;

// Write media thumbnail SVG
fs.writeFileSync('temp-media-thumbnail.svg', mediaThumbnailSvg);

// Генерируем все иконки
Promise.all([
  // Regular icons
  ...sizes
    .filter((config) => !config.special)
    .map((config) => {
      return sharp('temp-logo.svg')
        .resize(config.size, config.size)
        .png()
        .toFile(`public/${config.name}.png`);
    }),
  // Media thumbnail
  sharp('temp-media-thumbnail.svg')
    .resize(1280, 720)
    .png()
    .toFile('public/media-thumbnail.png'),
])
  .then(() => {
    // Создаем favicon.ico из PNG файлов
    return toIco(['public/favicon-16x16.png', 'public/favicon-32x32.png']);
  })
  .then((buf) => {
    fs.writeFileSync('public/favicon.ico', buf);
    // Удаляем временный файл
    fs.unlinkSync('temp-logo.svg');
    fs.unlinkSync('temp-media-thumbnail.svg');
    console.log('All icons generated successfully!');
  })
  .catch((err) => {
    console.error('Error generating icons:', err);
  });
