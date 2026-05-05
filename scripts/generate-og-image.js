import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const outputPath = join(__dirname, '..', 'public', 'og-image.png');

// Create SVG with the design
const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:#2dd4bf;stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#2dd4bf;stop-opacity:0" />
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.5" fill="#262626" />
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-gradient)" />
  <rect width="${width}" height="${height}" fill="url(#dots)" />
  <rect width="${width}" height="${height}" fill="url(#glow)" />
  
  <!-- Terminal prompt indicator -->
  <g transform="translate(80, 140)">
    <text x="0" y="0" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="24" fill="#2dd4bf" font-weight="bold">
      $ whoami
    </text>
  </g>
  
  <!-- Content container -->
  <g transform="translate(80, 220)">
    <!-- Name -->
    <text x="0" y="0" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="72" font-weight="bold" fill="#ffffff">
      Othniel Agera
    </text>
    
    <!-- Title/Role -->
    <text x="0" y="60" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="28" fill="#2dd4bf">
      Backend Engineer
    </text>
    
    <!-- Tagline -->
    <text x="0" y="110" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="20" fill="#737373">
      Distributed Systems • Performance Optimization • Scalable Architectures
    </text>
  </g>
  
  <!-- Decorative element - teal line -->
  <line x1="80" y1="380" x2="400" y2="380" stroke="#2dd4bf" stroke-width="2" opacity="0.5" />
  
  <!-- URL -->
  <text x="${width - 80}" y="${height - 40}" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="18" fill="#525252" text-anchor="end">
    otagera.xyz
  </text>
</svg>
`;

async function generateOGImage() {
  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✓ OG image generated at: ${outputPath}`);
    console.log('  Size: 1200x630px');
  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
