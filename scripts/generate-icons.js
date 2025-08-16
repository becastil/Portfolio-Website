/**
 * Icon Generation Script
 * Generates all required PWA icons from a source image
 * Requires: npm install sharp pwa-asset-generator
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Icon sizes configuration
const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

// Maskable icon sizes
const maskableIconSizes = [
  { size: 192, name: 'icon-maskable-192x192.png' },
  { size: 512, name: 'icon-maskable-512x512.png' }
];

// Generate placeholder SVG icon
async function generatePlaceholderIcon() {
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#gradient)"/>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="white">BC</text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

// Generate maskable icon with safe area
async function generateMaskableIcon(sourceBuffer, size) {
  // Add 20% padding for safe area
  const padding = Math.floor(size * 0.1);
  const innerSize = size - (padding * 2);
  
  return sharp(sourceBuffer)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 102, g: 126, b: 234, alpha: 1 }
    })
    .png()
    .toBuffer();
}

// Generate Safari pinned tab SVG
async function generateSafariPinnedTab() {
  const svg = `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2h5c1.7 0 3 1.3 3 3s-1.3 3-3 3H4v2h4c1.1 0 2 .9 2 2s-.9 2-2 2H2V2zm2 2v2h3c.6 0 1-.4 1-1s-.4-1-1-1H4zm0 4v2h4c.6 0 1-.4 1-1s-.4-1-1-1H4z" fill="#000"/>
      <path d="M11 6c0-2.2-1.8-4-4-4h6v12h-2V6z" fill="#000" opacity="0.5"/>
    </svg>
  `;
  
  return svg;
}

// Generate Windows browserconfig.xml
async function generateBrowserConfig() {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icons/mstile-70x70.png"/>
      <square150x150logo src="/icons/mstile-150x150.png"/>
      <square310x310logo src="/icons/mstile-310x310.png"/>
      <wide310x150logo src="/icons/mstile-310x150.png"/>
      <TileColor>#1a1a1a</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
  
  return xml;
}

// Main generation function
async function generateIcons() {
  try {
    // Create icons directory
    const iconsDir = path.join(__dirname, '..', 'public', 'icons');
    await fs.mkdir(iconsDir, { recursive: true });
    
    // Generate source icon
    console.log('Generating placeholder icon...');
    const sourceBuffer = await generatePlaceholderIcon();
    
    // Save source as base icon
    await sharp(sourceBuffer)
      .png()
      .toFile(path.join(iconsDir, 'icon-source.png'));
    
    // Generate standard icons
    console.log('Generating standard icons...');
    for (const config of iconSizes) {
      const outputPath = path.join(iconsDir, config.name);
      await sharp(sourceBuffer)
        .resize(config.size, config.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({
          compressionLevel: 9,
          quality: 100
        })
        .toFile(outputPath);
      console.log(`✓ Generated ${config.name}`);
    }
    
    // Generate maskable icons
    console.log('Generating maskable icons...');
    for (const config of maskableIconSizes) {
      const outputPath = path.join(iconsDir, config.name);
      const maskableBuffer = await generateMaskableIcon(sourceBuffer, config.size);
      await fs.writeFile(outputPath, maskableBuffer);
      console.log(`✓ Generated ${config.name}`);
    }
    
    // Generate Windows tiles
    console.log('Generating Windows tiles...');
    const windowsTiles = [
      { width: 70, height: 70, name: 'mstile-70x70.png' },
      { width: 150, height: 150, name: 'mstile-150x150.png' },
      { width: 310, height: 310, name: 'mstile-310x310.png' },
      { width: 310, height: 150, name: 'mstile-310x150.png' }
    ];
    
    for (const tile of windowsTiles) {
      const outputPath = path.join(iconsDir, tile.name);
      await sharp(sourceBuffer)
        .resize(tile.width, tile.height, {
          fit: 'contain',
          background: { r: 26, g: 26, b: 26, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${tile.name}`);
    }
    
    // Generate Safari pinned tab
    console.log('Generating Safari pinned tab...');
    const safariSvg = await generateSafariPinnedTab();
    await fs.writeFile(path.join(iconsDir, 'safari-pinned-tab.svg'), safariSvg);
    console.log('✓ Generated safari-pinned-tab.svg');
    
    // Generate browserconfig.xml
    console.log('Generating browserconfig.xml...');
    const browserConfig = await generateBrowserConfig();
    await fs.writeFile(path.join(__dirname, '..', 'public', 'browserconfig.xml'), browserConfig);
    console.log('✓ Generated browserconfig.xml');
    
    // Generate favicon.ico (multi-resolution)
    console.log('Generating favicon.ico...');
    await sharp(sourceBuffer)
      .resize(32, 32)
      .toFile(path.join(__dirname, '..', 'public', 'favicon.ico'));
    console.log('✓ Generated favicon.ico');
    
    console.log('\n✅ All icons generated successfully!');
    
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };