import type { PersonalityType, Gender } from '../types';

export interface Product {
  name: string;
  description: string;
  emoji: string;
  link: string;
  imageUrl?: string;
}

// 공통 마감 아이템: 러브젤 (수익률 높음)
const COMMON_GEL: Product = {
  name: '스탠다드 러브젤',
  description: '더 부드럽고 완벽한 마무리를 위한 선택',
  emoji: '💜',
  link: 'https://link.coupang.com/a/d8jAEd',
  imageUrl: '/images/gel.png',
};

// 기존 남성/공통 상품 맵
export const productsByType: Record<string, Product[]> = {
  default: [
    COMMON_GEL,
  ],
  VSAT: [
    { name: '침대용 스마트폰 자바라 거치대', description: '양손의 완벽한 자유를 위하여', emoji: '📱', link: 'https://link.coupang.com/a/d8jxNg', imageUrl: '/images/holder.png' },
    COMMON_GEL,
  ],
  VSAN: [
    { name: '텐가 에그', description: '빠르고 간편하게 쓰고 딱 버리는 꿀템', emoji: '💧', link: 'https://link.coupang.com/a/d8jJp9', imageUrl: '/images/pocketgel.png' },
    COMMON_GEL,
  ],
  VSRT: [
    { name: '텐가 에그 6종 버라이어티 세트', description: '가성비와 호기심을 완벽히 자극하는 입문템', emoji: '🥚', link: 'https://link.coupang.com/a/d8jJ4B', imageUrl: '/images/egg.png' },
    COMMON_GEL,
  ],
  VSRN: [
    COMMON_GEL,
  ],
  VMAT: [
    { name: '스마트폰 전용 VR 글래스 (다이브)', description: '2만 원으로 신세계를 경험해 보는 마법', emoji: '🥽', link: 'https://link.coupang.com/a/d8jLqJ', imageUrl: '/images/vr.png' },
    COMMON_GEL,
  ],
  VMAN: [
    COMMON_GEL,
  ],
  VMRT: [
    { name: '방구석 오로라 조명 / 달 무드등', description: '내 방 천장을 은밀한 오마카세 공간으로', emoji: '🌙', link: 'https://link.coupang.com/a/d8jINH', imageUrl: '/images/moodlight.png' },
    COMMON_GEL,
  ],
  VMRN: [
    { name: '러쉬 Best 섹스밤 입욕제', description: '오직 나만을 위한 럭셔리한 휴식 시간', emoji: '🛁', link: 'https://link.coupang.com/a/d8jHYu', imageUrl: '/images/bathbomb.png' },
    COMMON_GEL,
  ],
  FSAT: [
    { name: '수면용 초소형 노이즈차단 무선 이어폰', description: '옆으로 누워도 귀가 안 아픈 ASMR 몰입템', emoji: '🎧', link: '#' },
    COMMON_GEL,
  ],
  FSAN: [
    { name: '아로마 롤온 / 라벤더 오일', description: '뇌내 상상력의 촉각을 돕는 향기 테라피', emoji: '🌸', link: 'https://link.coupang.com/a/d8jMe5' },
    COMMON_GEL,
  ],
  FSRT: [
    { name: '맥세이프 스마트폰 바닥형 그립톡', description: '폰을 세워두고 두 손자유 상상 플레이를 위해', emoji: '📱', link: 'https://link.coupang.com/a/d8jM0f' },
    COMMON_GEL,
  ],
  FSRN: [
    { name: '나그참파 인센스 스틱 & 홀더', description: '나만의 거룩하고 퓨어한 절간 냄새 세팅', emoji: '🥢', link: 'https://link.coupang.com/a/d8jNx0' },
    COMMON_GEL,
  ],
  FMAT: [
    { name: '수면용 일회용 온열 안대', description: '눈을 감고 상상력을 증폭시키는 마법', emoji: '🎭', link: 'https://link.coupang.com/a/d8jOA9' },
    COMMON_GEL,
  ],
  FMAN: [
    { name: '초대형 U자 촉감 바디필로우', description: '혼자서 환상 여행을 할 때 껴안기 좋은 애착 파트너', emoji: '🫂', link: 'https://link.coupang.com/a/d8jN7S' },
    COMMON_GEL,
  ],
  FMRT: [
    { name: '일회용 수면 온열 안대 (12매입)', description: '눈이 눌리지 않는 쾌적한 100% 완전한 어둠', emoji: '🎭', link: 'https://link.coupang.com/a/d8jOA9' },
    COMMON_GEL,
  ],
  FMRN: [
    { name: '올리브영 1위 마사지 바디오일', description: '맨살의 터치감을 예술로 끌어올려 주는 부드러움', emoji: '🧴', link: 'https://link.coupang.com/a/d8jPaa', imageUrl: '/images/massageoil.png' },
    { name: '힐링 배스밤 입욕제', description: '분위기를 한층 고조시키는 소품', emoji: '🛁', link: 'https://link.coupang.com/a/d8jDNB', imageUrl: '/images/bathbomb.png' },
    COMMON_GEL,
  ]
};

// 신규 여성 전용 상품 맵
export const femaleProductsByType: Record<string, Product[]> = {
  default: [
    COMMON_GEL,
  ],
  VSAT: [
    { name: '홈플래닛 미니 무선 전동 마사지건', description: '파우치에 쏙 들어가는 트렌디한 짜릿함', emoji: '🔫', link: 'https://link.coupang.com/a/d8T2Bf' },
    COMMON_GEL,
  ],
  VSAN: [
    { name: '1+1 닥터데이즈 마사지젤', description: '건조함 없이 촉촉한 본능적인 마무리', emoji: '💧', link: 'https://link.coupang.com/a/d8T5gy' },
    COMMON_GEL,
  ],
  VSRT: [
    { name: '디센느 스탠드 태블릿 핸드폰 거치대', description: '양손의 완벽한 자유를 선사하는 확실한 도구', emoji: '📱', link: 'https://link.coupang.com/a/d8T5DR' },
    COMMON_GEL,
  ],
  VSRN: [
    COMMON_GEL,
  ],
  VMAT: [
    { name: '방구석 오로라 조명 / 달 무드등', description: '내 방 천장을 은밀한 오마카세 공간으로', emoji: '🌌', link: 'https://link.coupang.com/a/d8jINH', imageUrl: '/images/moodlight.png' },
    COMMON_GEL,
  ],
  VMAN: [
    { name: 'VANKYO 스마트폰 미러링 미니 빔 프로젝터', description: '작은 화면은 답답하니까, 룸 스케일 프라이빗 영화관', emoji: '📽️', link: 'https://link.coupang.com/a/d8T6OL' },
    COMMON_GEL,
  ],
  VMRT: [
    { name: '러쉬 Best 섹스밤 입욕제', description: '오직 나만을 위한 럭셔리한 휴식 시간', emoji: '🛁', link: 'https://link.coupang.com/a/d8jHYu', imageUrl: '/images/bathbomb.png' },
    COMMON_GEL,
  ],
  VMRN: [
    { name: '우드윅 미니자 스콜자 캔들', description: '흔들리는 불꽃과 향기로 채우는 로맨스의 극대화', emoji: '🕯️', link: 'https://link.coupang.com/a/d8T7YL' },
    COMMON_GEL,
  ],
  FSAT: [
    { name: '입문용 짜릿 안대', description: '상상력을 현실의 스킨십으로 끌어오는 마법', emoji: '🎭', link: 'https://link.coupang.com/a/d8T9bR' },
    COMMON_GEL,
  ],
  FSAN: [
    { name: '살냄새 매혹 고체향수', description: '피부 체온에 녹아 즉각 상상력을 유발하는 아찔함', emoji: '🌸', link: 'https://link.coupang.com/a/d8T9yG' },
    COMMON_GEL,
  ],
  FSRT: [
    { name: '로맨틱 실크 새틴 슬립 파자마 원피스', description: '맨살에 스치기만 해도 기분 좋은 실크의 촉감', emoji: '🕊️', link: 'https://link.coupang.com/a/d8T93v' },
    COMMON_GEL,
  ],
  FSRN: [
    { name: '해피스팀 아로마 온열 안대', description: '따뜻한 온기와 아로마 향으로 극대화되는 뇌내 비행', emoji: '♨️', link: 'https://link.coupang.com/a/d8UarR' },
    COMMON_GEL,
  ],
  FMAT: [
    { name: '러쉬 Best 섹스밤 입욕제', description: '서사의 주인공에게 걸맞은 사치스러운 거품 목욕', emoji: '🛁', link: 'https://link.coupang.com/a/d8jHYu', imageUrl: '/images/bathbomb.png' },
    COMMON_GEL,
  ],
  FMAN: [
    { name: '초대형 U자 촉감 바디필로우', description: '혼자서 환상 여행을 할 때 껴안기 좋은 애착 파트너', emoji: '🫂', link: 'https://link.coupang.com/a/d8jN7S' },
    COMMON_GEL,
  ],
  FMRT: [
    { name: '올리브영 1위 마사지 바디오일', description: '맨살의 터치감을 예술로 끌어올려 주는 부드러움', emoji: '🧴', link: 'https://link.coupang.com/a/d8jPaa', imageUrl: '/images/massageoil.png' },
    COMMON_GEL,
  ],
  FMRN: [
    { name: '나그참파 인센스 스틱 & 홀더', description: '나만의 깊은 감정선으로 차분하게 빠져드는 이너피스', emoji: '🥢', link: 'https://link.coupang.com/a/d8jNx0' },
    COMMON_GEL,
  ]
};

export function getProductsForType(type: PersonalityType, gender?: Gender): Product[] {
  const productMap = gender === 'female' ? femaleProductsByType : productsByType;
  const products = productMap[type] || productMap.default;
  // 공통 마감 아이템을 제외한 고유 상품 필터링 (핫리로드 대비 이름으로 비교)
  const specificProducts = products.filter(p => p.name !== COMMON_GEL.name);
  
  // 고유 상품이 있으면 그 중 첫 번째 1종만 반환, 없으면 기본 상품 1종 반환
  return specificProducts.length > 0 ? [specificProducts[0]] : [products[0]];
}
