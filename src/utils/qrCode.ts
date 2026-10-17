/**
 * Lightweight Zero-Dependency SVG QR Code Generator (Works 100% Offline)
 * Encodes alphanumeric / byte URLs into standard Model 2 QR SVG matrices.
 */

// Simple, robust QR Code generator for URLs and offline LAN addresses
// Based on standard ISO/IEC 18004 QR specification

class QRBitBuffer {
  buffer: number[] = [];
  length: number = 0;

  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num: number, length: number): void {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }
}

// Polynomial & Galois Field math for Reed-Solomon Error Correction
const EXP_TABLE = new Uint8Array(256);
const LOG_TABLE = new Uint8Array(256);

for (let i = 0, x = 1; i < 256; i++) {
  EXP_TABLE[i] = x;
  LOG_TABLE[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function glog(n: number) {
  if (n < 1) throw new Error('glog(' + n + ')');
  return LOG_TABLE[n];
}

function gexp(n: number) {
  while (n < 0) n += 255;
  while (n >= 256) n -= 255;
  return EXP_TABLE[n];
}

class Polynomial {
  tr: number[];

  constructor(num: number[], shift = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.tr = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) this.tr[i] = num[i + offset];
    for (let i = num.length - offset; i < this.tr.length; i++) this.tr[i] = 0;
  }

  get(index: number) {
    return this.tr[index];
  }

  getLength() {
    return this.tr.length;
  }

  multiply(e: Polynomial): Polynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
      }
    }
    return new Polynomial(num);
  }

  mod(e: Polynomial): Polynomial {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = glog(this.get(0)) - glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= gexp(glog(e.get(i)) + ratio);
    }
    return new Polynomial(num).mod(e);
  }
}

// Generate Error Correction Polynomial
function getErrorCorrectionPolynomial(errorCorrectionLength: number): Polynomial {
  let poly = new Polynomial([1], 0);
  for (let i = 0; i < errorCorrectionLength; i++) {
    poly = poly.multiply(new Polynomial([1, gexp(i)], 0));
  }
  return poly;
}

export function generateQRCodeSVG(text: string, size = 200, foregroundColor = '#38bdf8', backgroundColor = 'transparent'): string {
  // UTF-8 bytes
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push((code >> 6) | 192, (code & 63) | 128);
    } else {
      bytes.push((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
    }
  }

  // Version 4 QR Code (33x33 modules) capacity: 78 data bytes with Low ECC
  // Version 5 (37x37) capacity: 106 data bytes with Low ECC
  let version = 4;
  let totalDataBytes = 78;
  let ecBytesPerBlock = 20;

  if (bytes.length > 70) {
    version = 6;
    totalDataBytes = 136;
    ecBytesPerBlock = 28;
  } else if (bytes.length > 40) {
    version = 5;
    totalDataBytes = 106;
    ecBytesPerBlock = 24;
  }

  const moduleCount = version * 4 + 17;

  // Build bitstream: 8-bit byte mode (0100) + character count indicator + data + terminator
  const buffer = new QRBitBuffer();
  buffer.put(0x4, 4); // 8-bit byte mode
  buffer.put(bytes.length, 8); // length
  for (let i = 0; i < bytes.length; i++) {
    buffer.put(bytes[i], 8);
  }

  // Terminator
  while (buffer.length % 8 !== 0) {
    buffer.putBit(false);
  }

  // Pad bytes (0xEC, 0x11)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (buffer.length < totalDataBytes * 8) {
    buffer.put(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Generate RS Error Correction
  const rawData: number[] = [];
  for (let i = 0; i < totalDataBytes; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      if (buffer.get(i * 8 + b)) {
        byte |= 1 << (7 - b);
      }
    }
    rawData.push(byte);
  }

  const rsPoly = getErrorCorrectionPolynomial(ecBytesPerBlock);
  const dataPoly = new Polynomial(rawData, rsPoly.getLength() - 1);
  const modPoly = dataPoly.mod(rsPoly);

  const ecData: number[] = [];
  for (let i = 0; i < rsPoly.getLength() - 1; i++) {
    const modIndex = i + modPoly.getLength() - (rsPoly.getLength() - 1);
    ecData.push(modIndex >= 0 ? modPoly.get(modIndex) : 0);
  }

  const totalCodewords = [...rawData, ...ecData];

  // Initialize Matrix
  const matrix: (boolean | null)[][] = Array.from({ length: moduleCount }, () =>
    Array(moduleCount).fill(null)
  );

  // Position detection pattern helper
  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      if (row + r < 0 || moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c < 0 || moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          matrix[row + r][col + c] = true;
        } else {
          matrix[row + r][col + c] = false;
        }
      }
    }
  };

  // 3 Finder patterns
  addFinderPattern(0, 0);
  addFinderPattern(moduleCount - 7, 0);
  addFinderPattern(0, moduleCount - 7);

  // Timing patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
  }

  // Alignment pattern for version >= 2
  if (version >= 2) {
    const alignPos = moduleCount - 7;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (matrix[alignPos + r][alignPos + c] === null) {
          matrix[alignPos + r][alignPos + c] =
            r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0);
        }
      }
    }
  }

  // Format info area reservation
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[moduleCount - 8 + i][8] === null) matrix[moduleCount - 8 + i][8] = false;
    if (matrix[8][moduleCount - 8 + i] === null) matrix[8][moduleCount - 8 + i] = false;
  }

  // Dark module
  matrix[4 * version + 9][8] = true;

  // Place codewords
  let codewordIdx = 0;
  let bitIdx = 7;
  let upward = true;

  for (let c = moduleCount - 1; c > 0; c -= 2) {
    if (c === 6) c--; // Skip vertical timing pattern column

    for (let count = 0; count < moduleCount; count++) {
      const r = upward ? moduleCount - 1 - count : count;

      for (let dc = 0; dc < 2; dc++) {
        const col = c - dc;
        if (matrix[r][col] === null) {
          let bit = false;
          if (codewordIdx < totalCodewords.length) {
            bit = ((totalCodewords[codewordIdx] >>> bitIdx) & 1) === 1;
          }

          // Apply standard mask pattern 0: (row + col) % 2 === 0
          const mask = (r + col) % 2 === 0;
          matrix[r][col] = bit !== mask;

          bitIdx--;
          if (bitIdx < 0) {
            bitIdx = 7;
            codewordIdx++;
          }
        }
      }
    }
    upward = !upward;
  }

  // Format Info for Low ECC (L) and Mask 0: 0x77c4
  const formatInfo = 0x77c4;
  for (let i = 0; i < 15; i++) {
    const bit = ((formatInfo >> i) & 1) === 1;
    // Top-left
    if (i < 6) matrix[i][8] = bit;
    else if (i < 8) matrix[i + 1][8] = bit;
    else matrix[8][15 - i] = bit;

    // Bottom-left / Top-right
    if (i < 8) matrix[8][moduleCount - 1 - i] = bit;
    else matrix[moduleCount - 15 + i][8] = bit;
  }

  // Render SVG Path
  const padding = 2;
  const viewBoxSize = moduleCount + padding * 2;
  let pathD = '';

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        pathD += `M${c + padding},${r + padding}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${size}" height="${size}" shape-rendering="crispEdges">
    ${backgroundColor !== 'transparent' ? `<rect width="100%" height="100%" fill="${backgroundColor}" rx="8"/>` : ''}
    <path d="${pathD}" fill="${foregroundColor}" />
  </svg>`;
}
