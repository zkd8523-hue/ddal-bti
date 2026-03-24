import type { Question } from '../types';

export const questions: Question[] = [
  // 1. [Axis 1: V/F]
  {
    id: 1,
    axis: 1,
    question: '꿈에서 깼을 때 기억나는 건?',
    optionA: {
      text: '👀 생생한 장면',
      point: 'V'
    },
    optionB: {
      text: '💭 모호한 감정과 분위기',
      point: 'F'
    }
  },
  // 2. [Axis 1: V/F]
  {
    id: 2,
    axis: 1,
    question: '영화를 볼 때 더 끌리는 장면은?',
    optionA: {
      text: '🎬 아름다운 비주얼의 베드신',
      point: 'V'
    },
    optionB: {
      text: '📖 대화로 암시되는 은밀한 긴장감',
      point: 'F'
    }
  },
  // 3. [Axis 2: S/M]
  {
    id: 5,
    axis: 2,
    question: '의식을 시작할 때, 당신의 스타일은?',
    optionA: {
      text: '🔥 바로 본론 직진, 워밍업 따위 필요 없다',
      point: 'S'
    },
    optionB: {
      text: '🍷 조명 끄고, 분위기부터 천천히',
      point: 'M'
    }
  },
  // 4. [Axis 3: A/R]
  {
    id: 7,
    axis: 3,
    question: '판타지 속 나의 포지션은?',
    optionA: {
      text: '🎭 매번 다른 역할을 시도해본다',
      point: 'A'
    },
    optionB: {
      text: '👑 나만의 확고한 포지션이 있다',
      point: 'R'
    }
  },
  // 5. [Axis 2: S/M]
  {
    id: 4,
    axis: 2,
    question: '이상적인 하룻밤의 타임라인은?',
    optionA: {
      text: '⚡ 10분이면 충분',
      point: 'S'
    },
    optionB: {
      text: '⏰ 30분은 기본이지',
      point: 'M'
    }
  },
  // 6. [Axis 4: T/N]
  {
    id: 10,
    axis: 4,
    question: '침대 옆 비밀 서랍을 열었더니?',
    optionA: {
      text: '✨ 각종 도구와 아이템으로 가득',
      point: 'T'
    },
    optionB: {
      text: '🌿 아무것도 없는 미니멀리즘',
      point: 'N'
    }
  },
  // 7. [Axis 3: A/R]
  {
    id: 9,
    axis: 3,
    question: '오늘따라 평소와 다른 걸 해볼까 싶을 때?',
    optionA: {
      text: '🎉 새로운 시도는 언제나 환영이지!',
      point: 'A'
    },
    optionB: {
      text: '🤔 그래도 역시 검증된 게 최고지!',
      point: 'R'
    }
  },
  // 8. [Axis 4: T/N]
  {
    id: 11,
    axis: 4,
    question: '카페에서 음료 고를 때?',
    optionA: {
      text: '📱 리뷰부터 검색한다',
      point: 'T'
    },
    optionB: {
      text: '👆 그냥 끌리는 거',
      point: 'N'
    }
  },
  // 9. [Axis 3: A/R]
  {
    id: 8,
    axis: 3,
    question: '플레이리스트 스타일은?',
    optionA: {
      text: '🔀 셔플이 기본',
      point: 'A'
    },
    optionB: {
      text: '🔁 같은 노래 무한반복',
      point: 'R'
    }
  },
  // 10. [Axis 1: V/F]
  {
    id: 3,
    axis: 1,
    question: '내가 더 선호하는 콘텐츠는?',
    optionA: {
      text: '📸 이미지나 영상',
      point: 'V'
    },
    optionB: {
      text: '✍️ 글이나 오디오',
      point: 'F'
    }
  },
  // 11. [Axis 4: T/N]
  {
    id: 12,
    axis: 4,
    question: '혼자만의 시간, 분위기 세팅은?',
    optionA: {
      text: '🕯️ 조명, 음악, 향까지 완벽하게',
      point: 'T'
    },
    optionB: {
      text: '💤 그냥 눕는다',
      point: 'N'
    }
  },
  // 12. [Axis 2: S/M]
  {
    id: 6,
    axis: 2,
    question: '쇼핑할 때?',
    optionA: {
      text: '🎯 필요한 것만 사고 바로 나온다',
      point: 'S'
    },
    optionB: {
      text: '🛍️ 구경하는 재미가 반',
      point: 'M'
    }
  }
];
