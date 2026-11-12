import { shuffleSeeded } from "@/lib/seededRandom";

export function shuffleIndicesSeeded(length: number, seed: string): number[] {
  const indices = Array.from({ length }, (_, index) => index);
  return shuffleSeeded(indices, seed);
}

export function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  return indices;
}
