import type { PersonalityType } from '../types';

export interface Product {
  name: string;
  description: string;
  emoji: string;
  link: string;
  imageUrl?: string; // 상품 이미지 URL (쿠팡에서 복사 가능)
}

const COMMON_ITEM: Product = {
  name: '크리넥스 3겹 미용티슈 Box',
  description: '모든 사람에게 필요한 공통 필수템',
  emoji: '🧻',
  link: 'https://link.coupang.com/a/d8jAEd',
  imageUrl: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/490x490ex/image/retail/images/2020/03/12/17/9/69c1180b-22d7-4009-913b-55278c52980c.jpg',
};

export const productsByType: Record<string, Product[]> = {
  default: [
    { name: '대용량 미용 티슈', description: '모두에게 필요한 생필품', emoji: '🧻', link: '#' },
    { name: '수면 온열 안대', description: '피로한 눈을 위한 휴식', emoji: '🎭', link: '#' },
    COMMON_ITEM,
  ],
  VSAT: [
    { name: '침대용 스마트폰 자바라 거치대', description: '양손의 완벽한 자유를 위하여', emoji: '📱', link: 'https://link.coupang.com/a/d8jxNg' },
    { name: '최신 자동회전 오토 스피너', description: '하이테크가 선사하는 문명의 맛', emoji: '⚙️', link: '#' },
    COMMON_ITEM,
  ],
  VSAN: [
    { name: '텐가 일회용 포켓 젤 세트', description: '빠르고 간편하게 쓰고 딱 버리는 꿀템', emoji: '💧', link: 'https://link.coupang.com/a/d8jJp9' },
    { name: '대용량 뽑아쓰는 물티슈', description: '1분 컷 이후의 가장 빠른 현생 복귀', emoji: '🧻', link: '#' },
    COMMON_ITEM,
  ],
  VSRT: [
    { name: '텐가 에그 6종 버라이어티', description: '가성비와 호기심을 완벽히 자극하는 입문템', emoji: '🥚', link: 'https://link.coupang.com/a/d8jJ4B' },
    { name: '저가형 다이브 VR 글래스', description: '가장 저렴하게 맛보는 새로운 시각적 충격', emoji: '🥽', link: '#' },
    COMMON_ITEM,
  ],
  VSRN: [
    { name: '프리미엄 대용량 물티슈 Box', description: '어차피 매일 쓰는데 로켓으로 미리 쟁여두기', emoji: '🧻', link: 'https://link.coupang.com/a/d8jKpQ' },
    { name: '가성비 대용량 바디 로션', description: '건조함은 적이다. 맨몸의 필수품', emoji: '🧴', link: '#' },
    COMMON_ITEM,
  ],
  VMAT: [
    { name: '스마트폰 장착용 VR 글래스', description: '2만 원으로 신세계를 경험해 보는 마법', emoji: '🥽', link: 'https://link.coupang.com/a/d8jLqJ' },
    { name: '100% 암막 커튼 세트', description: '대낮에도 심야 넷플릭스 영화관 연출', emoji: '🌃', link: '#' },
    COMMON_ITEM,
  ],
  VMAN: [
    { name: '스마트폰 장착용 VR 다이브', description: '화면만 뚫어져라 쳐다보는 안구를 위해', emoji: '🥽', link: 'https://link.coupang.com/a/d8jLqJ' },
    { name: '누워서 보는 90도 굴절 안경', description: '썸네일 고르느라 목 아픈 유저의 구원템', emoji: '👓', link: '#' },
    COMMON_ITEM,
  ],
  VMRT: [
    { name: '오로라 달 무드등 프로젝터', description: '내 방 천장을 은밀한 오마카세 공간으로', emoji: '🌙', link: 'https://link.coupang.com/a/d8jINH' },
    { name: '프리미엄 워터베이스 마사지 젤', description: '오랜 시간 마르지 않는 촉촉한 큐레이팅', emoji: '💦', link: '#' },
    COMMON_ITEM,
  ],
  VMRN: [
    { name: '러쉬 힐링 배스밤 입욕제', description: '오직 맨몸뚱이의 감각을 극대화시켜주는 마법', emoji: '🛁', link: 'https://link.coupang.com/a/d8jHYu' },
    { name: '암막 수면 안대', description: '화면 이외의 모든 시각적 잡동사니 차단', emoji: '🕶️', link: '#' },
    COMMON_ITEM,
  ],
  FSAT: [
    { name: '수면용 초소형 노이즈차단 이어폰', description: '옆으로 누워도 귀가 안 아픈 ASMR 몰입템', emoji: '🎧', link: '#' },
    { name: '소형 퀵타임 바이브레이터', description: '망상의 끝을 가장 빠르고 확실하게 찍어줌', emoji: '⚡', link: '#' },
    COMMON_ITEM,
  ],
  FSAN: [
    { name: '라벤더 릴렉싱 아로마 롤온', description: '뇌내 상상력의 촉각을 돕는 가성비 향기 테라피', emoji: '🌸', link: 'https://link.coupang.com/a/d8jMe5' },
    { name: '포근한 극세사 수면 담요', description: '온몸을 부드럽게 감싸는 기분 좋은 촉감', emoji: '🛌', link: '#' },
    COMMON_ITEM,
  ],
  FSRT: [
    { name: '맥세이프 스마트폰 바닥형 그립톡', description: '폰을 세워두고 두 손자유 상상 플레이를 위해', emoji: '📱', link: 'https://link.coupang.com/a/d8jM0f' },
    { name: '원터치 온열 마사지기', description: '복잡한 세팅 없이 버튼 한방에 따뜻한 루틴 시작', emoji: '🔥', link: '#' },
    COMMON_ITEM,
  ],
  FSRN: [
    { name: '나그참파 인센스 스틱 & 홀더', description: '나만의 거룩하고 퓨어한 절간 냄새 세팅', emoji: '🥢', link: 'https://link.coupang.com/a/d8jNx0' },
    { name: '천연 프리미엄 핸드크림', description: '민감한 곳에 닿는 거친 손을 부드럽게 케어', emoji: '🤲', link: '#' },
    COMMON_ITEM,
  ],
  FMAT: [
    { name: '수면용 일회용 온열 안대', description: '눈을 감고 상상력을 증폭시키는 마법', emoji: '🎭', link: 'https://link.coupang.com/a/d8jOA9' },
    { name: '스마트홈 와이파이 멀티탭', description: '침대에서 벗어나지 않고 모든 조명과 기기를 통제', emoji: '🔌', link: '#' },
    COMMON_ITEM,
  ],
  FMAN: [
    { name: '초대형 U자/I자 촉감 바디필로우', description: '혼자서 환상 여행을 할 때 껴안기 좋은 애착 파트너', emoji: '🫂', link: 'https://link.coupang.com/a/d8jN7S' },
    { name: '심신 안정 아로마 가습기', description: '안개처럼 퍼지는 수증기로 몽환적인 쾌감 연출', emoji: '💨', link: '#' },
    COMMON_ITEM,
  ],
  FMRT: [
    { name: '메가미 일회용 수면 온열 안대', description: '눈이 눌리지 않는 쾌적한 100% 완전한 어둠', emoji: '🎭', link: 'https://link.coupang.com/a/d8jOA9' },
    { name: '하이엔드 스마트 체스처 기구', description: '망상 끝판왕을 위한 마지막 1%를 채워주는 무기', emoji: '👑', link: '#' },
    COMMON_ITEM,
  ],
  FMRN: [
    { name: '미세 거품 프리미엄 배스밤', description: '상상 속 대하사극의 주인공이 되게 해줌', emoji: '🛁', link: 'https://link.coupang.com/a/d8jDNB' },
    { name: '올리브영 1위 마사지 바디오일', description: '맨살의 터치감을 예술로 끌어올려 주는 부드러움', emoji: '🧴', link: 'https://link.coupang.com/a/d8jPaa' },
    COMMON_ITEM,
  ]
};

export function getProductsForType(type: PersonalityType): Product[] {
  return productsByType[type] || productsByType.default;
}
