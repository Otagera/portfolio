import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import matter from 'gray-matter';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'og-images');
const writingDir = join(__dirname, '..', 'src', 'content', 'writing');

const width = 1200;
const height = 630;

function wrapText(text, maxWidth, fontSize, maxLines = 3) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    // Approximate width: each character is ~0.6 * fontSize
    if (testLine.length * fontSize * 0.6 <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  
  // Truncate if too many lines
  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    // Add ellipsis to last line
    const lastLine = truncated[truncated.length - 1];
    if (lastLine.length > 3) {
      truncated[truncated.length - 1] = lastLine.substring(0, lastLine.length - 3) + '...';
    }
    return truncated;
  }
  
  return lines;
}

function escapeXml(text) {
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&apos;');
}

async function generateBlogOGImage(post) {
  const { title, date, readTime, tags } = post.data;
  const slug = post.slug;
  
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
  
  // Wrap title if too long (max 3 lines)
  const titleLines = wrapText(title, width - 160, 60, 3);
  const titleY = 200; // Fixed position below $cat line (120 + 24px font + margin)
  
  // Calculate meta info position based on title lines
  const titleHeight = titleLines.length * 70;
  const metaY = titleY + titleHeight + 40; // 40px gap after title
  const tagsY = metaY + 50; // 50px gap after meta
  
  // Truncate tags if too long
  let tagsText = tags ? tags.slice(0, 3).join(' • ') : '';
  if (tagsText.length > 50) {
    tagsText = tagsText.substring(0, 47) + '...';
  }
  
  // Calculate decorative line position (below tags if exist, otherwise below meta)
  const lineY = tagsText ? tagsY + 40 : metaY + 40;
  
  // Build SVG
  let svg = `
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
  
  <!-- Writing label -->
  <g transform="translate(80, 120)">
    <text x="0" y="0" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="24" fill="#2dd4bf" font-weight="bold">
      $ cat writing/${slug}.md
    </text>
  </g>
  
  <!-- Title -->
  <g transform="translate(80, ${titleY})">
`;
  
  // Add title lines
  titleLines.forEach((line, i) => {
    const y = i * 70;
    svg += `
    <text x="0" y="${y}" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="60" font-weight="bold" fill="#ffffff">
      ${escapeXml(line)}
    </text>
`;
  });
  
  svg += `
  </g>
  
  <!-- Meta info -->
  <g transform="translate(80, ${metaY})">
    <text x="0" y="0" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="20" fill="#737373">
      ${formattedDate} • ${readTime} read
    </text>
  </g>
`;
  
  // Tags
  if (tagsText) {
    svg += `
  <g transform="translate(80, ${tagsY})">
    <text x="0" y="0" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="18" fill="#2dd4bf" opacity="0.8">
      # ${escapeXml(tagsText)}
    </text>
  </g>
`;
  }
  
  // Decorative line
  svg += `
  <line x1="80" y1="${lineY}" x2="500" y2="${lineY}" stroke="#2dd4bf" stroke-width="2" opacity="0.5" />
  
  <!-- URL -->
  <text x="${width - 80}" y="${height - 40}" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="18" fill="#525252" text-anchor="end">
    otagera.xyz/writing/${slug}
  </text>
</svg>
`;
  
  const outputPath = join(outputDir, `${slug}.png`);
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`✓ Generated: og-images/${slug}.png`);
}

async function main() {
  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // Get all markdown files from writing directory (excluding _drafts)
  const files = readdirSync(writingDir).filter(f => f.endsWith('.md'));
  
  console.log(`Generating OG images for ${files.length} blog posts...\n`);
  
  for (const file of files) {
    const filePath = join(writingDir, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    // Skip drafts in production
    if (data.draft && process.env.NODE_ENV === 'production') {
      continue;
    }
    
    const slug = file.replace(/\.md$/, '').toLowerCase();
    const post = { slug, data };
    
    await generateBlogOGImage(post);
  }
  
  console.log('\n✓ All blog OG images generated!');
}

main().catch(console.error);
