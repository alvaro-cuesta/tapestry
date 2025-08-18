// SplitMix32 from https://stackoverflow.com/a/47593316
export function newRand(seed: number) {
  let a = seed;

  return () => {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);

    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export function randInt(
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  rand: () => number = Math.random,
) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function randItem<T>(
  arr: [T, ...T[]] | readonly [T, ...T[]],
  rand: () => number,
): T;
export function randItem<T>(
  arr: T[] | readonly T[],
  rand: () => number,
): T | undefined;
export function randItem<T>(
  arr: T[] | readonly T[],
  rand: () => number,
): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return arr[randInt(0, arr.length - 1, rand)]!;
}
