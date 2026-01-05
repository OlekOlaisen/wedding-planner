const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [192, 512];
const inputSvg = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generated ${outputPath}`);
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

