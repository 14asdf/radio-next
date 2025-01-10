const sharp = require('sharp');
const fs = require('fs');
const toIco = require('png-to-ico');

// Создаем SVG строку с логотипом (только иконка без текста)
const svgString = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="256" fill="#F5F5F5"/>
  <path
    d="M160 160c64 0 128 0 192 32M192 256c48 0 80 0 128 32M224 352c32 0 32 0 64 32"
    stroke="black"
    strokeWidth="32"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
`;

// Add new SVG for media session (non-rounded, dark background)
const mediaSessionSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1a1a1a"/>
  <path
    d="M160 160c64 0 128 0 192 32M192 256c48 0 80 0 128 32M224 352c32 0 32 0 64 32"
    stroke="#ffffff"
    strokeWidth="32"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>`;

// Write both SVG files
fs.writeFileSync('temp-logo.svg', svgString);
fs.writeFileSync('temp-media-logo.svg', mediaSessionSvg);

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
  { size: 512, name: 'media-session', special: true },
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
  // Media session icon
  sharp('temp-media-logo.svg')
    .resize(512, 512)
    .png()
    .toFile('public/media-session.png'),
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
    fs.unlinkSync('temp-media-logo.svg');
    console.log('All icons generated successfully!');
  })
  .catch((err) => {
    console.error('Error generating icons:', err);
  });
