import type { Answer, PersonalityType, Axis1, Axis2, Axis3, Axis4 } from '../types';

export function calculateResult(answers: Answer[]): PersonalityType {
  const counts = {
    V: 0, F: 0,  // Axis 1
    S: 0, M: 0,  // Axis 2
    A: 0, R: 0,  // Axis 3
    T: 0, N: 0,  // Axis 4
  };

  // 각 답변의 포인트를 집계
  answers.forEach((answer) => {
    const point = answer.selectedPoint as keyof typeof counts;
    counts[point]++;
  });

  // 각 축별로 더 높은 점수를 가진 타입 선택
  const axis1: Axis1 = counts.V >= counts.F ? 'V' : 'F';
  const axis2: Axis2 = counts.S >= counts.M ? 'S' : 'M';
  const axis3: Axis3 = counts.A >= counts.R ? 'A' : 'R';
  const axis4: Axis4 = counts.T >= counts.N ? 'T' : 'N';

  return `${axis1}${axis2}${axis3}${axis4}`;
}
