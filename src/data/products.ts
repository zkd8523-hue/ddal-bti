import type { PersonalityType } from '../types';

export interface Product {
  name: string;
  description: string;
  emoji: string;
  link: string;
  imageUrl?: string;
}

// 공통 마감 아이템 1: 러브젤 (수익률 높음)
const COMMON_GEL: Product = {
  name: '러브젤 / 윤활제',
  description: '더 부드럽고 완벽한 마무리를 위한 선택',
  emoji: '💜',
  link: 'https://link.coupang.com/a/d8jAEd',
  imageUrl: '/images/gel.png',
};

// 공통 마감 아이템 2: 크리넥스/물티슈 (실용성 높음)
const COMMON_TISSUE: Product = {
  name: '크리넥스 3겹 미용티슈 Box',
  description: '16개 모든 유형에게 필요한 공통 생필품',
  emoji: '🧻',
  link: 'https://link.coupang.com/a/d8jKpQ',
  imageUrl: '/images/tissue.png',
};

export const productsByType: Record<string, Product[]> = {
  default: [
    { name: '대용량 미용 티슈', description: '모두에게 필요한 생필품', emoji: '🧻', link: '#' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VSAT: [
    { name: '침대용 스마트폰 자바라 거치대', description: '양손의 완벽한 자유를 위하여', emoji: '📱', link: 'https://link.coupang.com/a/d8jxNg' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VSAN: [
    { name: '텐가 일회용 포켓 젤 세트', description: '빠르고 간편하게 쓰고 딱 버리는 꿀템', emoji: '💧', link: 'https://link.coupang.com/a/d8jJp9' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VSRT: [
    { name: '텐가 에그 6종 버라이어티 세트', description: '가성비와 호기심을 완벽히 자극하는 입문템', emoji: '🥚', link: 'https://link.coupang.com/a/d8jJ4B' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VSRN: [
    { name: '크리넥스 3겹 미용티슈 / 물티슈', description: '어차피 매일 쓰는데 로켓으로 미리 쟁여두기', emoji: '🧻', link: 'https://link.coupang.com/a/d8jKpQ' },
    COMMON_GEL,
    { name: '남녀 공용 쿨링 청결제', description: '가성비 불도저의 깔끔한 마무리', emoji: '🚿', link: '#' },
  ],
  VMAT: [
    { name: '스마트폰 전용 VR 글래스', description: '2만 원으로 신세계를 경험해 보는 마법', emoji: '🥽', link: 'https://link.coupang.com/a/d8jLqJ' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VMAN: [
    { name: '누워서 보는 90도 굴절 안경', description: '썸네일 고르느라 목 아픈 유저의 구원템', emoji: '👓', link: 'https://link.coupang.com/a/d8jLqJ' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VMRT: [
    { name: '방구석 오로라 조명 / 달 무드등', description: '내 방 천장을 은밀한 오마카세 공간으로', emoji: '🌙', link: 'https://link.coupang.com/a/d8jINH' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  VMRN: [
    { name: '프리미엄 배스밤 입욕제 세트', description: '오직 나만을 위한 럭셔리한 휴식 시간', emoji: '🛁', link: 'https://link.coupang.com/a/d8jHYu', imageUrl: '/images/bathbomb.png' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FSAT: [
    { name: '수면용 초소형 노이즈차단 이어폰', description: '옆으로 누워도 귀가 안 아픈 ASMR 몰입템', emoji: '🎧', link: '#' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FSAN: [
    { name: '아로마 롤온 / 라벤더 오일', description: '뇌내 상상력의 촉각을 돕는 향기 테라피', emoji: '🌸', link: 'https://link.coupang.com/a/d8jMe5' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FSRT: [
    { name: '맥세이프 스마트폰 바닥형 그립톡', description: '폰을 세워두고 두 손자유 상상 플레이를 위해', emoji: '📱', link: 'https://link.coupang.com/a/d8jM0f' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FSRN: [
    { name: '나그참파 인센스 스틱 & 홀더', description: '나만의 거룩하고 퓨어한 절간 냄새 세팅', emoji: '🥢', link: 'https://link.coupang.com/a/d8jNx0' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FMAT: [
    { name: '수면용 일회용 온열 안대', description: '눈을 감고 상상력을 증폭시키는 마법', emoji: '🎭', link: 'https://link.coupang.com/a/d8jOA9' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FMAN: [
    { name: '초대형 U자/I자 촉감 바디필로우', description: '혼자서 환상 여행을 할 때 껴안기 좋은 파트너', emoji: '🫂', link: 'https://link.coupang.com/a/d8jN7S' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FMRT: [
    { name: '일회용 수면 온열 안대 (12매입)', description: '눈이 눌리지 않는 쾌적한 100% 완전한 어둠', emoji: '🎭', link: 'https://link.coupang.com/a/d8jOA9' },
    COMMON_GEL,
    COMMON_TISSUE,
  ],
  FMRN: [
    { name: '힐링 배스밤 & 마사지 바디오일', description: '맨살의 터치감을 예술로 끌어올려 주는 부드러움', emoji: '🚿', link: 'https://link.coupang.com/a/d8jPaa', imageUrl: '/images/bathbomb.png' },
    COMMON_GEL,
    COMMON_TISSUE,
  ]
};

export function getProductsForType(type: PersonalityType): Product[] {
  return productsByType[type] || productsByType.default;
}
