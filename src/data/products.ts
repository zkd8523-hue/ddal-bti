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
    { name: '대용량 미용 티슈', description: '모두에게 필요한 생필품', emoji: '🧻', link: '#' },
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
    { name: '프리미엄 대용량 물티슈', description: '어차피 매일 쓰는데 로켓으로 미리 쟁여두기', emoji: '🧻', link: 'https://link.coupang.com/a/d8jKpQ' },
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
    { name: '프리미엄 배스밤 입욕제 세트', description: '오직 나만을 위한 럭셔리한 휴식 시간', emoji: '🛁', link: 'https://link.coupang.com/a/d8jHYu', imageUrl: '/images/bathbomb.png' },
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
    { name: '초대형 U자/I자 촉감 바디필로우', description: '혼자서 환상 여행을 할 때 껴안기 좋은 애착 파트너', emoji: '🫂', link: 'https://link.coupang.com/a/d8jN7S' },
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
    { name: '대용량 미용 티슈', description: '모두에게 필요한 생필품', emoji: '🧻', link: '#' },
    COMMON_GEL,
  ],
  VSAT: [
    { name: '은밀한 핸디 무선 소형 마사지기', description: '파우치에 쏙 들어가는 트렌디한 짜릿함', emoji: '💋', link: 'https://link.coupang.com/a/d8pwL9' },
    COMMON_GEL,
  ],
  VSAN: [
    { name: '프리미엄 수용성 바디 마사지 젤', description: '건조함 없이 촉촉한 본능적인 마무리', emoji: '💧', link: 'https://link.coupang.com/a/d8pwQ2' },
    COMMON_GEL,
  ],
  VSRT: [
    { name: '침대용 프리미엄 메탈 자바라 거치대', description: '양손의 완벽한 자유를 선사하는 확실한 도구', emoji: '📱', link: 'https://link.coupang.com/a/d8pwYn' },
    COMMON_GEL,
  ],
  VSRN: [
    { name: 'Y존 밸런스 페미닌 티슈', description: '언제나 쾌적하고 상쾌한 루틴의 마무리를 위하여', emoji: '🧼', link: 'https://link.coupang.com/a/d8pxba' },
    COMMON_GEL,
  ],
  VMAT: [
    { name: '오로라 은하수 무드등 조명', description: '내 방 천장을 가장 은밀한 몽환의 숲으로', emoji: '🌌', link: 'https://link.coupang.com/a/d8pxj4' },
    COMMON_GEL,
  ],
  VMAN: [
    { name: '스마트폰 미러링 미니 빔 프로젝터', description: '작은 화면은 답답하니까, 룸 스케일 프라이빗 영화관', emoji: '📽️', link: 'https://link.coupang.com/a/d8pxqw' },
    COMMON_GEL,
  ],
  VMRT: [
    { name: '프리미엄 호텔식 순면 샤워 가운 (로브)', description: '은밀한 오마카세의 시작을 알리는 의식', emoji: '🛁', link: 'https://link.coupang.com/a/d8pxxz' },
    COMMON_GEL,
  ],
  VMRN: [
    { name: '타닥타닥 우드윅 (장작 타는 소리) 캔들', description: '흔들리는 불꽃과 향기로 채우는 로맨스의 극대화', emoji: '🕯️', link: 'https://link.coupang.com/a/d8pxEh' },
    COMMON_GEL,
  ],
  FSAT: [
    { name: '새틴 수면 안대 & 소프트 깃털 터치 소품 세트', description: '상상력을 현실의 스킨십으로 끌어오는 마법', emoji: '🎭', link: 'https://link.coupang.com/a/d8pxLn' },
    COMMON_GEL,
  ],
  FSAN: [
    { name: '살냄새 스킨십 페로몬 고체 향수', description: '피부 체온에 녹아 즉각 상상력을 유발하는 아찔함', emoji: '🌸', link: 'https://link.coupang.com/a/d8pxSU' },
    COMMON_GEL,
  ],
  FSRT: [
    { name: '로맨틱 실크 새틴 슬립 파자마 원피스', description: '맨살에 스치기만 해도 기분 좋은 실크의 촉감', emoji: '🕊️', link: 'https://link.coupang.com/a/d8px1w' },
    COMMON_GEL,
  ],
  FSRN: [
    { name: '아로마 온열 수면 안대', description: '따뜻한 온기와 아로마 향으로 극대화되는 뇌내 비행', emoji: '♨️', link: 'https://link.coupang.com/a/d8px8X' },
    COMMON_GEL,
  ],
  FMAT: [
    { name: '프리미엄 에센셜 힐링 배스밤 세트', description: '서사의 주인공에게 걸맞은 사치스러운 거품 목욕', emoji: '🫧', link: 'https://link.coupang.com/a/d8pyfe' },
    COMMON_GEL,
  ],
  FMAN: [
    { name: '안락함 200% 초대형 U자 바디필로우', description: '기나긴 망상 속 주인공의 넓은 품처럼 포근하게', emoji: '🧸', link: 'https://link.coupang.com/a/d8pynB' },
    COMMON_GEL,
  ],
  FMRT: [
    { name: '워머 캔들 & 일랑일랑 에센셜 오일', description: '서사를 음미하며 몸 전체에 퍼지는 최상급 릴렉싱', emoji: '💆‍♀️', link: 'https://link.coupang.com/a/d8pyuQ' },
    COMMON_GEL,
  ],
  FMRN: [
    { name: '나그참파 인센스 스틱 & 세라믹 홀더', description: '나만의 깊은 감정선으로 차분하게 빠져드는 이너피스', emoji: '🌿', link: 'https://link.coupang.com/a/d8pyBC' },
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
