import type { Question } from '../types';

export const questions: Question[] = [
  // 축 1: V(Visual) vs F(Fantasy) - 3문항
  {
    id: 1,
    axis: 1,
    question: '경건하고 거룩한(?) 의식을 치르기 전, 나의 사전 세팅은?',
    optionA: {
      text: '🕯️ 조명부터 소품까지 완벽 세팅',
      point: 'V'
    },
    optionB: {
      text: '💭 상상력 하나로 어디든 떠나기',
      point: 'F'
    }
  },
  {
    id: 2,
    axis: 1,
    question: '영화를 볼 때 더 흥분되는 장면은?',
    optionA: {
      text: '🎬 아름다운 비주얼의 베드신',
      point: 'V'
    },
    optionB: {
      text: '📖 대사로만 암시되는 은밀한 순간',
      point: 'F'
    }
  },
  {
    id: 3,
    axis: 1,
    question: '파트너에게 더 설레는 순간은?',
    optionA: {
      text: '👀 눈으로 확인되는 노골적 시선',
      point: 'V'
    },
    optionB: {
      text: '🌙 말하지 않아도 느껴지는 긴장감',
      point: 'F'
    }
  },

  // 축 2: S(Speed) vs M(Marathon) - 3문항
  {
    id: 4,
    axis: 2,
    question: '이상적인 하룻밤의 타임라인은?',
    optionA: {
      text: '⚡ 30분 안에 끝내는 짜릿한 스피드',
      point: 'S'
    },
    optionB: {
      text: '⏰ 몇 시간이고 천천히 즐기기',
      point: 'M'
    }
  },
  {
    id: 5,
    axis: 2,
    question: '전희에 대한 당신의 철학은?',
    optionA: {
      text: '🔥 빠르게 본론으로 직진',
      point: 'S'
    },
    optionB: {
      text: '🍷 분위기부터 천천히 달구기',
      point: 'M'
    }
  },
  {
    id: 6,
    axis: 2,
    question: '라운드 2에 대한 생각은?',
    optionA: {
      text: '✨ 한 번에 최고조로 끝내는 게 최고',
      point: 'S'
    },
    optionB: {
      text: '🔁 여러 번 반복할수록 좋다',
      point: 'M'
    }
  },

  // 축 3: A(Adventure) vs R(Routine) - 3문항
  {
    id: 7,
    axis: 3,
    question: '파트너가 \'검색 기록\'에서 발견한 걸 제안한다면?',
    optionA: {
      text: '🎢 매번 새로운 걸 시도하고 싶다',
      point: 'A'
    },
    optionB: {
      text: '🏡 검증된 루틴이 가장 편하다',
      point: 'R'
    }
  },
  {
    id: 8,
    axis: 3,
    question: '장소에 대한 선호는?',
    optionA: {
      text: '🌍 어디든 상관없어, 스릴이 중요',
      point: 'A'
    },
    optionB: {
      text: '🛏️ 익숙한 우리 집 침대가 최고',
      point: 'R'
    }
  },
  {
    id: 9,
    axis: 3,
    question: '"자기야, 오늘은 좀 다르게 해볼까?" 이 말을 들었을 때?',
    optionA: {
      text: '🎉 오! 재밌겠는데? 바로 OK',
      point: 'A'
    },
    optionB: {
      text: '🤔 음... 우리 원래 하던 게 좋은데',
      point: 'R'
    }
  },

  // 축 4: T(Tool) vs N(Natural) - 3문항
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
  {
    id: 11,
    axis: 4,
    question: '새 제품 출시 소식을 들었을 때?',
    optionA: {
      text: '💳 바로 카트에 담는다',
      point: 'T'
    },
    optionB: {
      text: '🤷 그런 거 없어도 충분한데',
      point: 'N'
    }
  },
  {
    id: 12,
    axis: 4,
    question: '완벽한 밤을 위해 필요한 것은?',
    optionA: {
      text: '🎁 신상 아이템 언박싱의 설렘',
      point: 'T'
    },
    optionB: {
      text: '💕 우리 둘만 있으면 충분해',
      point: 'N'
    }
  }
];
