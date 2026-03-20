import type { PersonalityType } from '../types';

export interface Product {
  name: string;
  description: string;
  emoji: string;
  link: string; // 쿠팡 파트너스 링크 (추후 실제 링크로 교체)
}

export const productsByType: Record<string, Product[]> = {
  default: [
    { name: '대용량 미용 티슈', description: '모두에게 필요한 생필품', emoji: '🧻', link: '#' },
    { name: '수면 온열 안대', description: '피로한 눈을 위한 휴식', emoji: '🎭', link: '#' },
    { name: '아로마 무드등', description: '은은한 밤의 분위기', emoji: '💡', link: '#' },
  ],
  VSAT: [
    { name: '침대용 스마트폰 자바라 거치대', description: '양손의 완벽한 자유를 위하여', emoji: '📱', link: '#' },
    { name: '최신 자동회전 오토 스피너', description: '하이테크가 선사하는 문명의 맛', emoji: '⚙️', link: '#' },
    { name: '초고속 멀티 충전 케이블', description: '중요한 순간에 배터리는 끊기면 안 되니까', emoji: '⚡', link: '#' },
  ],
  VSAN: [
    { name: '일회용 포켓 젤 세트', description: '빠르고 간편하게 쓰고 딱 버리는 꿀템', emoji: '💧', link: '#' },
    { name: '대용량 뽑아쓰는 물티슈', description: '1분 컷 이후의 가장 빠른 현생 복귀', emoji: '🧻', link: '#' },
    { name: '스마트폰 핑거 스트랩', description: '한 손으로 폰을 완벽하게 컨트롤', emoji: '🖐️', link: '#' },
  ],
  VSRT: [
    { name: '텐가 에그 6종 버라이어티', description: '가성비와 호기심을 완벽히 자극하는 입문템', emoji: '🥚', link: '#' },
    { name: '저가형 다이브 VR 글래스', description: '가장 저렴하게 맛보는 새로운 시각적 충격', emoji: '🥽', link: '#' },
    { name: '단단한 모니터 암 스탠드', description: '언제나 그 각도, 그 위치에 흔들림 없이', emoji: '🖥️', link: '#' },
  ],
  VSRN: [
    { name: '크리넥스 3겹 미용티슈 Box', description: '어차피 매일 쓰는데 로켓으로 미리 쟁여두기', emoji: '🧻', link: '#' },
    { name: '가성비 대용량 바디 로션', description: '건조함은 적이다. 맨몸의 필수품', emoji: '🧴', link: '#' },
    { name: '남녀 공용 쿨링 청결제', description: '효율충의 가장 깔끔한 마무리', emoji: '🚿', link: '#' },
  ],
  VMAT: [
    { name: '앱 연동 스마트 LED 무드등', description: '버튼 하나로 내 방을 클럽으로 세팅', emoji: '💡', link: '#' },
    { name: '100% 암막 커튼 세트', description: '대낮에도 심야 넷플릭스 영화관 연출', emoji: '🌃', link: '#' },
    { name: '블루투스 리모컨 스위치', description: '침대에서 일어나지 않고 모든 것을 통제', emoji: '🎮', link: '#' },
  ],
  VMAN: [
    { name: '누워서 보는 90도 굴절 안경', description: '썸네일 고르느라 목 아픈 유저의 구원템', emoji: '👓', link: '#' },
    { name: '일회용 무방부제 인공눈물', description: '화면만 뚫어져라 쳐다보는 안구를 위해', emoji: '👁️', link: '#' },
    { name: '눈 피로 방지 온열 마스크', description: '수백 번의 파도타기 후 꿀 같은 휴식', emoji: '😴', link: '#' },
  ],
  VMRT: [
    { name: '고음질 미니 블루투스 스피커', description: '애착 영상의 사운드를 빵빵하게 앰프업', emoji: '🎵', link: '#' },
    { name: '프리미엄 워터베이스 마사지 젤', description: '오랜 시간 마르지 않는 촉촉한 큐레이팅', emoji: '💦', link: '#' },
    { name: '오로라 달 무드등 프로젝터', description: '내 방 천장을 은밀한 오마카세 공간으로', emoji: '🌙', link: '#' },
  ],
  VMRN: [
    { name: '암막 수면 안대', description: '화면 이외의 모든 시각적 잡동사니 완전 차단', emoji: '🕶️', link: '#' },
    { name: '저자극 유기농 바디 오일', description: '오직 맨몸뚱이의 손맛을 극대화시켜주는 윤활유', emoji: '🌿', link: '#' },
    { name: '체압 분산 메모리폼 쿠션', description: '장시간 한 자세를 유지하기 위한 척추 보호템', emoji: '🛌', link: '#' },
  ],
  FSAT: [
    { name: '수면용 초소형 노이즈차단 이어폰', description: '옆으로 누워도 귀가 안 아픈 ASMR 몰입템', emoji: '🎧', link: '#' },
    { name: '소형 퀵타임 바이브레이터', description: '망상의 끝을 가장 빠르고 확실하게 찍어줌', emoji: '⚡', link: '#' },
    { name: '미니 전동 마사지건', description: '강력한 파워로 순식간에 끝장내는 타격감', emoji: '🔨', link: '#' },
  ],
  FSAN: [
    { name: '라벤더 릴렉싱 아로마 롤온', description: '뇌내 상상력의 촉각을 돕는 가성비 향기 테라피', emoji: '🌸', link: '#' },
    { name: '포근한 극세사 수면 담요', description: '온몸을 부드럽게 감싸는 기분 좋은 촉감', emoji: '🛌', link: '#' },
    { name: '19금 오디오북 1개월 구독권', description: '웹소설가의 상상력에 기름을 부어주는 불쏘시개', emoji: '📚', link: '#' },
  ],
  FSRT: [
    { name: '맥세이프 스마트폰 바닥형 그립톡', description: '폰을 세워두고 두 손자유 상상 플레이를 위해', emoji: '📱', link: '#' },
    { name: '원터치 온열 마사지기', description: '복잡한 세팅 없이 버튼 한방에 따뜻한 루틴 시작', emoji: '🔥', link: '#' },
    { name: '메가미 일회용 수면 안대', description: '눈을 감고 치트키 망상을 펼치기 가장 좋은 온도', emoji: '🎭', link: '#' },
  ],
  FSRN: [
    { name: '나그참파 인센스 스틱 & 홀더', description: '나만의 거룩하고 퓨어한 절간 냄새 세팅', emoji: '🥢', link: '#' },
    { name: '천연 프리미엄 핸드크림', description: '민감한 곳에 닿는 거친 손을 부드럽게 케어', emoji: '🤲', link: '#' },
    { name: '명상용 미니 싱잉볼 세트', description: '이너피스와 깊은 상상을 돕는 청아한 소리', emoji: '🥣', link: '#' },
  ],
  FMAT: [
    { name: '강력 차음 방문 문풍지', description: '은밀한 5D 소리가 거실로 새어나가는 것 원천 차단', emoji: '🚪', link: '#' },
    { name: '스마트홈 와이파이 멀티탭', description: '침대에서 벗어나지 않고 모든 조명과 기기를 통제', emoji: '🔌', link: '#' },
    { name: '디밍 조절 스마트 전구', description: '터치 하나로 몽환적인 놀이공원 분위기 마스터', emoji: '💡', link: '#' },
  ],
  FMAN: [
    { name: '초대형 U자/I자 촉감 바디필로우', description: '혼자서 환상 여행을 할 때 껴안기 좋은 애착 파트너', emoji: '🫂', link: '#' },
    { name: '심신 안정 아로마 가습기', description: '안개처럼 퍼지는 수증기로 몽환적인 쾌감 연출', emoji: '💨', link: '#' },
    { name: '호텔식 프리미엄 구스 이불', description: '우주선에 탑승한 듯 포근하고 안전한 나만의 나락', emoji: '☁️', link: '#' },
  ],
  FMRT: [
    { name: '프리미엄 3D 암막 수면 안대', description: '눈이 눌리지 않는 쾌적한 100% 완전한 어둠', emoji: '🙈', link: '#' },
    { name: '하이엔드 스마트 체스처 기구', description: '망상 끝판왕을 위한 마지막 1%를 채워주는 무기', emoji: '👑', link: '#' },
    { name: '각도 조절 릴렉스 체어/쿠션', description: '어떤 자세로 상상해도 허리를 완벽하게 지원', emoji: '💺', link: '#' },
  ],
  FMRN: [
    { name: '은은한 향기의 캔들 워머', description: '불 꺼놓고 분위기 즐기는 낭만주의자의 필수품', emoji: '🕯️', link: '#' },
    { name: '올리브영 1위 마사지 바디 오일', description: '맨살의 터치감을 예술로 끌어올려 주는 부드러움', emoji: '🧴', link: '#' },
    { name: '미세 거품 프리미엄 입욕제', description: '상상 속 대하사극의 목욕씬을 현실로 만들어 줌', emoji: '🛁', link: '#' },
  ]
};

export function getProductsForType(type: PersonalityType): Product[] {
  return productsByType[type] || productsByType.default;
}
