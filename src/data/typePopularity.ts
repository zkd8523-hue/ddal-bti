import type { PersonalityType } from '../types';

// 축별 분포 (실제 데이터 수집 전까지 추정치)
// V=55% vs F=45%, S=60% vs M=40%, A=45% vs R=55%, T=35% vs N=65%
// 각 유형의 비율 = 해당 축 확률들의 곱 → 16개 합계 정확히 100%
const axisProb = {
  V: 0.55, F: 0.45,
  S: 0.60, M: 0.40,
  A: 0.45, R: 0.55,
  T: 0.35, N: 0.65,
} as const;

function calcPercentage(type: PersonalityType): number {
  const [a1, a2, a3, a4] = type.split('') as [keyof typeof axisProb, keyof typeof axisProb, keyof typeof axisProb, keyof typeof axisProb];
  const raw = axisProb[a1] * axisProb[a2] * axisProb[a3] * axisProb[a4] * 100;
  return Math.round(raw * 10) / 10;
}

const allTypes: PersonalityType[] = [
  'VSAT', 'VSAN', 'VSRT', 'VSRN',
  'VMAT', 'VMAN', 'VMRT', 'VMRN',
  'FSAT', 'FSAN', 'FSRT', 'FSRN',
  'FMAT', 'FMAN', 'FMRT', 'FMRN',
];

export const typePopularity: Record<PersonalityType, number> = Object.fromEntries(
  allTypes.map((t) => [t, calcPercentage(t)])
) as Record<PersonalityType, number>;

export function getPopularityLabel(type: PersonalityType): string {
  const pct = typePopularity[type];
  return pct !== undefined ? `${pct}%` : '';
}

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'legendary';

export function getRarityTier(type: PersonalityType): RarityTier {
  const pct = typePopularity[type] ?? 0;
  if (pct >= 9) return 'common';
  if (pct >= 6) return 'uncommon';
  if (pct >= 4) return 'rare';
  return 'legendary';
}
