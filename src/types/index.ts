// 4가지 축 타입 정의
export type Axis1 = 'V' | 'F'; // Visual vs Fantasy
export type Axis2 = 'S' | 'M'; // Speed vs Marathon
export type Axis3 = 'A' | 'R'; // Adventure vs Routine
export type Axis4 = 'T' | 'N'; // Tool vs Natural

export type PersonalityType = `${Axis1}${Axis2}${Axis3}${Axis4}`;

// 질문 데이터 타입
export interface Question {
  id: number;
  axis: 1 | 2 | 3 | 4; // 어느 축에 해당하는지
  question: string;
  optionA: {
    text: string;
    point: Axis1 | Axis2 | Axis3 | Axis4; // A 선택 시 추가되는 포인트
  };
  optionB: {
    text: string;
    point: Axis1 | Axis2 | Axis3 | Axis4; // B 선택 시 추가되는 포인트
  };
}

// 결과 데이터 타입
export interface Result {
  type: PersonalityType;
  title: string; // 캐릭터 별명
  emoji: string; // 대표 이모지
  description: string[]; // 특징 리스트
  imageUrl?: string; // 이미지 (추후 추가)
  traits: {
    axis1: string; // 축1 설명
    axis2: string; // 축2 설명
    axis3: string; // 축3 설명
    axis4: string; // 축4 설명
  };
}

// 답변 타입
export interface Answer {
  questionId: number;
  selectedPoint: string;
}

// 화면 상태 타입
export type Screen = 'home' | 'question' | 'loading' | 'result';
