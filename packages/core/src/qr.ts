/**
 * A small QR code encoder (ISO/IEC 18004): byte mode, versions 1–40, error correction L/M/Q/H,
 * the mask with the lowest penalty. Enough for otpauth:// links, URLs and short texts; it runs
 * locally, so nothing leaves the app.
 */

export type QrLevel = "L" | "M" | "Q" | "H";

const LEVEL_BITS: Record<QrLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };
const LEVEL_INDEX: Record<QrLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };

// error correction codewords per block, and number of blocks, by level (L, M, Q, H) and version
// prettier-ignore
const ECC_PER_BLOCK: number[][] = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
// prettier-ignore
const BLOCKS: number[][] = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

/** Modules of all function patterns and data for a version. */
function rawModules(ver: number): number {
  let r = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const n = Math.floor(ver / 7) + 2;
    r -= (25 * n - 10) * n - 55;
    if (ver >= 7) r -= 36;
  }
  return r;
}
function dataCodewords(ver: number, lvl: number): number {
  return Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[lvl]![ver]! * BLOCKS[lvl]![ver]!;
}

/* Reed–Solomon over GF(256) with the polynomial 0x11d */
function mul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}
function divisor(degree: number): number[] {
  const r = new Array<number>(degree).fill(0);
  r[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < r.length; j++) {
      r[j] = mul(r[j]!, root);
      if (j + 1 < r.length) r[j] = r[j]! ^ r[j + 1]!;
    }
    root = mul(root, 0x02);
  }
  return r;
}
function remainder(data: number[], div: number[]): number[] {
  const r = new Array<number>(div.length).fill(0);
  for (const b of data) {
    const f = b ^ r.shift()!;
    r.push(0);
    div.forEach((c, i) => (r[i] = r[i]! ^ mul(c, f)));
  }
  return r;
}

function alignment(ver: number): number[] {
  if (ver === 1) return [];
  const n = Math.floor(ver / 7) + 2;
  const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
  const out = [6];
  for (let pos = ver * 4 + 10; out.length < n; pos -= step) out.splice(1, 0, pos);
  return out;
}

/**
 * Encodes text as a QR code: a square of booleans (true = dark), without the quiet zone.
 * Throws when the text does not fit version 40.
 */
export function qrMatrix(text: string, level: QrLevel = "M"): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  const lvl = LEVEL_INDEX[level];
  let ver = 1;
  for (; ; ver++) {
    if (ver > 40) throw new Error("Text too long for a QR code");
    const countBits = ver < 10 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(ver, lvl) * 8) break;
  }
  const size = ver * 4 + 17;

  // data bits: byte mode, count, bytes, terminator, padding
  const bits: number[] = [];
  const put = (v: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1);
  };
  put(0b0100, 4);
  put(bytes.length, ver < 10 ? 8 : 16);
  bytes.forEach((b) => put(b, 8));
  const cap = dataCodewords(ver, lvl) * 8;
  put(0, Math.min(4, cap - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));

  // blocks with error correction, interleaved
  const nBlocks = BLOCKS[lvl]![ver]!,
    eccLen = ECC_PER_BLOCK[lvl]![ver]!,
    raw = Math.floor(rawModules(ver) / 8),
    shortBlocks = nBlocks - (raw % nBlocks),
    shortLen = Math.floor(raw / nBlocks);
  const div = divisor(eccLen);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < nBlocks; i++) {
    const len = shortLen - eccLen + (i < shortBlocks ? 0 : 1);
    const d = data.slice(k, k + len);
    k += len;
    const ecc = remainder(d, div);
    if (i < shortBlocks) d.push(0);
    blocks.push(d.concat(ecc));
  }
  const codewords: number[] = [];
  for (let i = 0; i < blocks[0]!.length; i++)
    blocks.forEach((b, j) => {
      if (i !== shortLen - eccLen || j >= shortBlocks) codewords.push(b[i]!);
    });

  // function patterns
  const m: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fn: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    m[y]![x] = dark;
    fn[y]![x] = true;
  };
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy)),
          x = cx + dx,
          y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4);
      }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);
  const al = alignment(ver);
  al.forEach((ay, i) =>
    al.forEach((ax, j) => {
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === al.length - 1) ||
        (i === al.length - 1 && j === 0)
      )
        return;
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++)
          set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }),
  );
  const format = (mask: number) => {
    const d = (LEVEL_BITS[level] << 3) | mask;
    let r = d;
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412;
    const bit = (i: number) => ((b >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6));
    set(8, 8, bit(7));
    set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  format(0); // reserve the format areas
  if (ver >= 7) {
    let r = ver;
    for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
    const b = (ver << 12) | r;
    for (let i = 0; i < 18; i++) {
      const dark = ((b >>> i) & 1) !== 0,
        a = size - 11 + (i % 3),
        c = Math.floor(i / 3);
      set(a, c, dark);
      set(c, a, dark);
    }
  }

  // data in the zigzag
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j,
          up = ((right + 1) & 2) === 0,
          y = up ? size - 1 - vert : vert;
        if (!fn[y]![x] && i < codewords.length * 8) {
          m[y]![x] = ((codewords[i >>> 3]! >>> (7 - (i & 7))) & 1) !== 0;
          i++;
        }
      }
  }

  const masked = (mask: number) => {
    const out = m.map((row) => row.slice());
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if (fn[y]![x]) continue;
        const flip = [
          (x + y) % 2 === 0,
          y % 2 === 0,
          x % 3 === 0,
          (x + y) % 3 === 0,
          (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
          ((x * y) % 2) + ((x * y) % 3) === 0,
          (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
          (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
        ][mask];
        if (flip) out[y]![x] = !out[y]![x];
      }
    return out;
  };
  const penalty = (g: boolean[][]) => {
    let p = 0;
    const lines = (get: (a: number, b: number) => boolean) => {
      for (let a = 0; a < size; a++) {
        let run = 1;
        const seq: boolean[] = [];
        for (let b = 0; b < size; b++) {
          seq.push(get(a, b));
          if (b > 0 && get(a, b) === get(a, b - 1)) {
            run++;
            if (run === 5) p += 3;
            else if (run > 5) p++;
          } else run = 1;
        }
        // finder-like patterns: 1:1:3:1:1 with four light modules on one side
        const s = seq.map((v) => (v ? "1" : "0")).join("");
        for (const pat of ["10111010000", "00001011101"]) {
          let k = s.indexOf(pat);
          while (k !== -1) {
            p += 40;
            k = s.indexOf(pat, k + 1);
          }
        }
      }
    };
    lines((a, b) => g[a]![b]!);
    lines((a, b) => g[b]![a]!);
    for (let y = 0; y < size - 1; y++)
      for (let x = 0; x < size - 1; x++) {
        const c = g[y]![x];
        if (c === g[y]![x + 1] && c === g[y + 1]![x] && c === g[y + 1]![x + 1]) p += 3;
      }
    const dark = g.reduce((s, row) => s + row.filter(Boolean).length, 0);
    const total = size * size;
    p += Math.max(0, Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
    return p;
  };

  let best: boolean[][] = m,
    bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    format(mask);
    const g = masked(mask);
    // the format bits were written into m; copy them into the masked grid
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (fn[y]![x]) g[y]![x] = m[y]![x]!;
    const score = penalty(g);
    if (score < bestScore) {
      bestScore = score;
      best = g;
    }
  }
  return best;
}

/** SVG path data for a QR matrix: one 1×1 square per dark module, offset by the quiet zone. */
export function qrPath(matrix: boolean[][], quiet = 4): string {
  let d = "";
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
    }),
  );
  return d;
}
