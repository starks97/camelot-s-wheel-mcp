export function preciseRound(num: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
}
