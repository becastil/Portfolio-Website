/**
 * Image Optimization Pipeline
 * Optimizes all images for web performance
 * Generates multiple formats (WebP, AVIF) and responsive sizes
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const { promisify } = require('util');

const globAsync = promisify(glob);

// Configuration
const config = {
  inputDir: path.join(__dirname, '..', 'assets', 'images'),
  outputDir: path.join(__dirname, '..', 'public', 'images'),
  formats: ['webp', 'avif', 'original'],
  sizes: [
    { width: 320, suffix: '-320w' },
    { width: 640, suffix: '-640w' },
    { width: 768, suffix: '-768w' },
    { width: 1024, suffix: '-1024w' },
    { width: 1366, suffix: '-1366w' },
    { width: 1920, suffix: '-1920w' },
    { width: 2560, suffix: '-2560w' }
  ],
  quality: {
    jpeg: 85,
    webp: 85,
    avif: 80,
    png: 100
  },
  skipOptimization: ['*.svg', '*.gif']
};

// Create output directory structure
async function createOutputDirs() {
  await fs.mkdir(config.outputDir, { recursive: true });
  
  for (const format of config.formats) {
    if (format !== 'original') {
      await fs.mkdir(path.join(config.outputDir, format), { recursive: true });
    }
  }
  
  await fs.mkdir(path.join(config.outputDir, 'responsive'), { recursive: true });
}

// Get image metadata
async function getImageMetadata(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return metadata;
  } catch (error) {
    console.error(`Error reading metadata for ${imagePath}:`, error);
    return null;
  }
}

// Optimize single image
async function optimizeImage(inputPath, outputPath, options = {}) {
  const { width, format, quality } = options;
  
  let pipeline = sharp(inputPath);
  
  // Resize if width specified
  if (width) {
    pipeline = pipeline.resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside'
    });
  }
  
  // Apply format-specific optimizations
  switch (format) {
    case 'jpeg':
    case 'jpg':
      pipeline = pipeline.jpeg({
        quality: quality || config.quality.jpeg,
        progressive: true,
        mozjpeg: true
      });
      break;
    
    case 'png':
      pipeline = pipeline.png({
        quality: quality || config.quality.png,
        compressionLevel: 9,
        progressive: true
      });
      break;
    
    case 'webp':
      pipeline = pipeline.webp({
        quality: quality || config.quality.webp,
        effort: 6,
        lossless: false
      });
      break;
    
    case 'avif':
      pipeline = pipeline.avif({
        quality: quality || config.quality.avif,
        effort: 4,
        lossless: false
      });
      break;
  }
  
  // Save optimized image
  await pipeline.toFile(outputPath);
  
  // Get file sizes for reporting
  const originalStats = await fs.stat(inputPath);
  const optimizedStats = await fs.stat(outputPath);
  const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(2);
  
  return {
    original: originalStats.size,
    optimized: optimizedStats.size,
    savings: `${savings}%`
  };
}

// Generate responsive images
async function generateResponsiveImages(inputPath, imageName) {
  const metadata = await getImageMetadata(inputPath);
  if (!metadata) return;
  
  const results = [];
  const ext = path.extname(imageName);
  const nameWithoutExt = path.basename(imageName, ext);
  
  for (const size of config.sizes) {
    // Skip if image is smaller than target size
    if (metadata.width <= size.width) continue;
    
    // Generate original format
    const outputName = `${nameWithoutExt}${size.suffix}${ext}`;
    const outputPath = path.join(config.outputDir, 'responsive', outputName);
    
    const result = await optimizeImage(inputPath, outputPath, {
      width: size.width,
      format: ext.substring(1).toLowerCase()
    });
    
    results.push({
      path: outputPath,
      width: size.width,
      ...result
    });
    
    // Generate WebP version
    if (config.formats.includes('webp')) {
      const webpOutputName = `${nameWithoutExt}${size.suffix}.webp`;
      const webpOutputPath = path.join(config.outputDir, 'responsive', webpOutputName);
      
      await optimizeImage(inputPath, webpOutputPath, {
        width: size.width,
        format: 'webp'
      });
    }
    
    // Generate AVIF version
    if (config.formats.includes('avif')) {
      const avifOutputName = `${nameWithoutExt}${size.suffix}.avif`;
      const avifOutputPath = path.join(config.outputDir, 'responsive', avifOutputName);
      
      await optimizeImage(inputPath, avifOutputPath, {
        width: size.width,
        format: 'avif'
      });
    }
  }
  
  return results;
}

// Generate picture element HTML
function generatePictureElement(imageName, alt = '') {
  const ext = path.extname(imageName);
  const nameWithoutExt = path.basename(imageName, ext);
  
  const srcsets = {
    avif: [],
    webp: [],
    original: []
  };
  
  // Build srcsets for each format
  for (const size of config.sizes) {
    srcsets.avif.push(`/images/responsive/${nameWithoutExt}${size.suffix}.avif ${size.width}w`);
    srcsets.webp.push(`/images/responsive/${nameWithoutExt}${size.suffix}.webp ${size.width}w`);
    srcsets.original.push(`/images/responsive/${nameWithoutExt}${size.suffix}${ext} ${size.width}w`);
  }
  
  return `
<picture>
  <source
    type="image/avif"
    srcset="${srcsets.avif.join(', ')}"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  >
  <source
    type="image/webp"
    srcset="${srcsets.webp.join(', ')}"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  >
  <img
    src="/images/responsive/${nameWithoutExt}-1024w${ext}"
    srcset="${srcsets.original.join(', ')}"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    alt="${alt}"
    loading="lazy"
    decoding="async"
    width="1024"
    height="auto"
  >
</picture>`;
}

// Process all images
async function processAllImages() {
  try {
    console.log('🎨 Starting image optimization pipeline...\n');
    
    // Create output directories
    await createOutputDirs();
    
    // Find all images
    const imagePatterns = ['*.jpg', '*.jpeg', '*.png', '*.webp'];
    const allImages = [];
    
    for (const pattern of imagePatterns) {
      const images = await globAsync(path.join(config.inputDir, pattern));
      allImages.push(...images);
    }
    
    if (allImages.length === 0) {
      console.log('No images found to optimize.');
      return;
    }
    
    console.log(`Found ${allImages.length} images to process.\n`);
    
    const totalStats = {
      originalSize: 0,
      optimizedSize: 0,
      count: 0
    };
    
    // Process each image
    for (const imagePath of allImages) {
      const imageName = path.basename(imagePath);
      console.log(`Processing: ${imageName}`);
      
      try {
        // Generate responsive versions
        const results = await generateResponsiveImages(imagePath, imageName);
        
        // Generate alternative formats for full-size image
        const metadata = await getImageMetadata(imagePath);
        
        if (metadata) {
          // WebP version
          if (config.formats.includes('webp')) {
            const webpPath = path.join(config.outputDir, 'webp', imageName.replace(/\.[^.]+$/, '.webp'));
            const webpResult = await optimizeImage(imagePath, webpPath, { format: 'webp' });
            console.log(`  ✓ WebP: ${webpResult.savings} saved`);
          }
          
          // AVIF version
          if (config.formats.includes('avif')) {
            const avifPath = path.join(config.outputDir, 'avif', imageName.replace(/\.[^.]+$/, '.avif'));
            const avifResult = await optimizeImage(imagePath, avifPath, { format: 'avif' });
            console.log(`  ✓ AVIF: ${avifResult.savings} saved`);
          }
          
          // Optimized original
          const originalPath = path.join(config.outputDir, imageName);
          const originalResult = await optimizeImage(imagePath, originalPath, {
            format: path.extname(imageName).substring(1).toLowerCase()
          });
          console.log(`  ✓ Original: ${originalResult.savings} saved`);
          
          totalStats.originalSize += originalResult.original;
          totalStats.optimizedSize += originalResult.optimized;
          totalStats.count++;
        }
        
        // Generate picture element example
        const pictureHTML = generatePictureElement(imageName, `Optimized ${imageName}`);
        
        // Save picture element example
        const examplesDir = path.join(config.outputDir, 'examples');
        await fs.mkdir(examplesDir, { recursive: true });
        await fs.writeFile(
          path.join(examplesDir, `${path.basename(imageName, path.extname(imageName))}.html`),
          pictureHTML
        );
        
      } catch (error) {
        console.error(`  ✗ Error processing ${imageName}:`, error.message);
      }
      
      console.log('');
    }
    
    // Summary
    const totalSavings = ((1 - totalStats.optimizedSize / totalStats.originalSize) * 100).toFixed(2);
    console.log('='.repeat(50));
    console.log('📊 Optimization Summary:');
    console.log(`  Images processed: ${totalStats.count}`);
    console.log(`  Original size: ${(totalStats.originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Optimized size: ${(totalStats.optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total savings: ${totalSavings}%`);
    console.log('='.repeat(50));
    
    // Generate image map JSON
    const imageMap = {
      images: allImages.map(img => path.basename(img)),
      formats: config.formats,
      sizes: config.sizes,
      generated: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(config.outputDir, 'image-map.json'),
      JSON.stringify(imageMap, null, 2)
    );
    
    console.log('\n✅ Image optimization complete!');
    console.log(`📁 Output directory: ${config.outputDir}`);
    
  } catch (error) {
    console.error('Fatal error during image optimization:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  processAllImages();
}

module.exports = {
  optimizeImage,
  generateResponsiveImages,
  generatePictureElement,
  processAllImages
};