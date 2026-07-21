const fs = require('fs');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="96" fill="#2563EB"/>
  <path d="M256 120c-8.8 0-16 7.2-16 16v104H136c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16h104v104c0 8.8 7.2 16 16 16h40c8.8 0 16-7.2 16-16V312h104c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H312V136c0-8.8-7.2-16-16-16h-40z" fill="white"/>
</svg>`;

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), svg);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), svg);

console.log('Icon placeholders created.');
