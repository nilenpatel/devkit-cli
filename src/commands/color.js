function hexToRgb(hex) {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b };
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function color(args) {
  if (args.length === 0) {
    console.error('  Usage: devkit color <hex> (e.g., devkit color #ff6b35)');
    process.exit(1);
  }

  const hex = args[0];
  const rgb = hexToRgb(hex);

  if (!rgb) {
    console.error(`  Invalid hex color: "${hex}"`);
    process.exit(1);
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const ansiColor = `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
  const reset = '\x1b[0m';
  const block = `${ansiColor}        ${reset}`;

  console.log('');
  console.log(`  ${block}  HEX: ${hex.startsWith('#') ? hex : '#' + hex}`);
  console.log(`  ${block}  RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`);
  console.log(`  ${block}  HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%`);
  console.log('');
}

module.exports = color;
