import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { Result as ResultType, PersonalityType } from '../types';
import { results as allResults } from '../data/results';
import { getProductsForType } from '../data/products';
import { analytics } from '../utils/analytics';
import { getVisitorId } from '../utils/referral';
import { dataURLToBlob, canShareFiles } from '../utils/deviceDetection';
import AdBanner from './AdBanner';
import { getPopularityLabel, getRarityTier } from '../data/typePopularity';



const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY || 'bb1fd31c096bfbc922047336876b1746';

const axisOpposites: Record<string, string> = {
  '시각파 (Visual)': '상상파 (Fantasy)',
  '상상파 (Fantasy)': '시각파 (Visual)',
  '스피드 (Speed)': '마라톤 (Marathon)',
  '마라톤 (Marathon)': '스피드 (Speed)',
  '모험형 (Adventure)': '루틴형 (Routine)',
  '루틴형 (Routine)': '모험형 (Adventure)',
  '장비파 (Tool)': '순정파 (Natural)',
  '순정파 (Natural)': '장비파 (Tool)',
};

interface ResultProps {
  result: ResultType;
  isShared?: boolean;
  onRestart: () => void;
}

function countMatchingAxes(typeA: string, typeB: string): number {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (typeA[i] === typeB[i]) count++;
  }
  return count;
}

// 축별 차이 비트마스크 → 15가지 고유 궁합 멘트
const compatibilityDescs: Record<number, string> = {
  1:  '콘텐츠 고를 때만 티격태격하는 베프',
  2:  '하나만 빼면 완벽한데, 그게 속도야…',
  4:  '평소엔 잘 맞다가 루틴 문제로 살짝 삐끗',
  8:  '장비 취향 빼면 영혼의 단짝',
  3:  '반은 같고 반은 달라서 매번 새로운 사이',
  5:  '자극 원천도 탐험심도 다른 신선한 조합',
  9:  '리듬은 맞는데 취향이 다른 묘한 관계',
  6:  '기본 코드는 같은데 실전 스타일은 정반대',
  10: '핵심은 통하는데 디테일에서 갈리는 케미',
  12: '큰 그림은 같은데 실행 방식이 정반대',
  7:  '장비 취향만 같은 의외의 한 끗',
  11: '탐험 성향만 통하는 극과 극',
  13: '속도감만 맞는 기묘한 동질감',
  14: '자극 취향만 같고 나머진 미지의 세계',
  15: '완전한 정반대, 만나면 불꽃 튀는 관계',
};

function getCompatibilityDesc(myType: string, otherType: string): string {
  let mask = 0;
  for (let i = 0; i < 4; i++) {
    if (myType[i] !== otherType[i]) mask |= (1 << i);
  }
  return compatibilityDescs[mask] || '';
}

const compatibilityGroups = [
  { key: 'best', label: '찰떡궁합', emoji: '💕', match: (n: number) => n === 3 },
  { key: 'good', label: '은근 통하는 사이', emoji: '🤝', match: (n: number) => n === 2 },
  { key: 'opposite', label: '정반대 매력', emoji: '🔥', match: (n: number) => n <= 1 },
] as const;

function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
  );
}

export default function Result({ result, isShared = false, onRestart }: ResultProps) {
  const products = getProductsForType(result.type as PersonalityType);

  const displayTitle = result.title;
  const displayEmoji = result.emoji;

  // 이미지 저장을 위한 ref와 상태
  const resultCardRef = useRef<HTMLDivElement>(null);
  const storyCardRef = useRef<HTMLDivElement>(null);
  const exploreDetailRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [selectedExploreType, setSelectedExploreType] = useState<PersonalityType | null>(null);

  const selectedExploreResult = selectedExploreType
    ? allResults.find((r) => r.type === selectedExploreType) || null
    : null;

  // 결과 화면 진입 시 추가 이벤트 추적
  useEffect(() => {
    if (result.type && products.length > 0) {
      analytics.trackResultViewed(result.type as PersonalityType);
      
      // 상품 노출 추적 (한 번만 실행되도록 products 의존성 관리)
      products.forEach((product, index) => {
        analytics.trackProductImpression(product.name, result.type as PersonalityType, index + 1);
      });
    }
  }, [result.type, products.length]);

  useEffect(() => {
    // SDK 로딩 대기 및 초기화
    const initKakao = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(KAKAO_APP_KEY);
            console.log('Kakao SDK 초기화 완료, 키:', KAKAO_APP_KEY.slice(0, 8) + '...', '버전:', window.Kakao.VERSION);
          } catch (error) {
            console.error('Kakao SDK 초기화 실패:', error);
          }
        }
      } else {
        // SDK 로딩 대기
        setTimeout(initKakao, 100);
      }
    };

    initKakao();
  }, []);

  const handleKakaoShare = () => {
    const kakao = window.Kakao;

    if (!kakao) {
      alert('❌ 카카오 SDK를 불러오지 못했습니다. 페이지를 새로고침 해주세요.');
      return;
    }

    // 초기화되지 않은 경우에만 초기화 (cleanup 없이)
    if (!kakao.isInitialized()) {
      try {
        kakao.init(KAKAO_APP_KEY);
        console.log('Kakao SDK 초기화 완료');
      } catch (error) {
        console.error('Kakao SDK 초기화 실패:', error);
        alert('카카오 SDK 초기화에 실패했습니다. 페이지를 새로고침 해주세요.');
        return;
      }
    }

    if (!kakao.Share) {
      alert('❌ 카카오 공유 기능을 로드하지 못했습니다. 브라우저를 업데이트하거나 네트워크를 확인해주세요.');
      return;
    }

    try {
      // GA4 이벤트 추적
      analytics.trackKakaoShare(result.type as PersonalityType);
      const visitorId = getVisitorId();
      analytics.trackViralShare(visitorId, 'kakao', result.type as PersonalityType);

      const siteUrl = window.location.origin;
      // 로컬 테스트 중에도 이미지는 실제 배포된 서버의 것을 사용해야 카카오톡에서 보입니다.
      const imageUrlHost = siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')
        ? 'https://bam-bti.vercel.app'
        : siteUrl;

      const resultUrl = `${siteUrl}/?type=${result.type}&ref=${visitorId}&utm_source=kakao&utm_medium=social&utm_campaign=share`;

      console.log('카카오 공유 시도:', {
        siteUrl, imageUrlHost, resultUrl,
        sdkVersion: kakao.VERSION,
        isInitialized: kakao.isInitialized(),
        appKey: KAKAO_APP_KEY.slice(0, 8) + '...',
      });

      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `[밤bti] 나의 결과: ${displayTitle} ${displayEmoji}`,
          description: `${result.description[0].replace(/\*\*/g, '')}`,
          imageUrl: `${imageUrlHost}/images/shares/${result.type}.png?v=2`,
          link: {
            mobileWebUrl: resultUrl,
            webUrl: resultUrl,
          },
        },
        buttons: [
          {
            title: '결과 자세히 보기',
            link: {
              mobileWebUrl: resultUrl,
              webUrl: resultUrl,
            },
          },
          {
            title: '나도 테스트하기',
            link: {
              mobileWebUrl: `${siteUrl}/?ref=${visitorId}&utm_source=kakao&utm_medium=social&utm_campaign=share_test`,
              webUrl: `${siteUrl}/?ref=${visitorId}&utm_source=kakao&utm_medium=social&utm_campaign=share_test`,
            },
          },
        ],
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('카카오 공유 실패 상세 에러:', error);
      alert(`❌ 공유하기에 실패했습니다.\n사유: ${errorMessage}\n브라우저의 팝업 차단 설정을 확인해 보세요.`);
    }
  };

  // 인스타그램 스토리 공유 (Web Share API) / 폴백: 이미지 다운로드
  const handleInstagramShare = async () => {
    if (!resultCardRef.current) return;
    setIsDownloading(true);

    try {
      const targetRef = storyCardRef.current || resultCardRef.current;
      if (!targetRef) return;

      const dataUrl = await toPng(targetRef, {
        quality: 0.95,
        pixelRatio: 3,
        backgroundColor: '#111827',
      });

      const fileName = `밤bti-${result.type}-${displayTitle}.png`;
      const blob = dataURLToBlob(dataUrl);
      const file = new File([blob], fileName, { type: 'image/png' });

      const visitorId = getVisitorId();

      // 모바일: Web Share API로 인스타 스토리 등에 바로 공유
      if (canShareFiles() && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `나의 밤bti 결과: ${displayTitle}`,
          text: `나의 밤bti는 "${displayTitle}" ${displayEmoji}\n테스트 해보기 👉 ${window.location.origin}/?ref=${visitorId}&utm_source=instagram&utm_medium=social&utm_campaign=share`,
        });
        analytics.trackInstagramShare(result.type as PersonalityType);
        analytics.trackViralShare(visitorId, 'instagram', result.type as PersonalityType);
      } else {
        // 데스크톱 등 미지원: 이미지 다운로드 폴백
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = blobUrl;
        link.click();
        URL.revokeObjectURL(blobUrl);
        analytics.trackImageDownload(result.type as PersonalityType);
        analytics.trackViralShare(visitorId, 'image_download', result.type as PersonalityType);
      }
    } catch (error: unknown) {
      // 사용자가 공유 취소한 경우는 무시
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('공유/이미지 생성 실패:', error);
      alert('공유에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  // X 공유
  const handleTwitterShare = () => {
    const siteUrl = window.location.origin;
    const visitorId = getVisitorId();
    // /api/share를 통해 X 크롤러가 유형별 OG 이미지를 인식하도록 함
    const shareUrl = `${siteUrl}/api/share?type=${result.type}&ref=${visitorId}&utm_source=twitter&utm_medium=social&utm_campaign=share`;
    const text = `나의 밤bti 결과는 "${displayTitle}" ${displayEmoji}\n\n#밤bti #bambti`;

    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    
    // 팝업 차단 고려: 직접 location.href를 쓰기보다는 window.open을 먼저 시도 후 실패 시 현재 창 전환
    const win = window.open(twitterUrl, '_blank');
    if (!win) {
      window.location.href = twitterUrl;
    }

    analytics.trackTwitterShare(result.type as PersonalityType);
    analytics.trackViralShare(visitorId, 'twitter', result.type as PersonalityType);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-6 py-6 md:py-12"
    >
      {/* 페이지 타이틀 */}
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-gray-400 mb-4"
      >
        {isShared ? '친구의 밤bti 결과' : '나의 밤bti는?'}
      </motion.p>

      {/* 결과 카드 */}
      <motion.div
        ref={resultCardRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 md:p-10 neon-border relative overflow-hidden"
      >
        {/* 배경 글로우 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-magenta/10 rounded-full blur-[80px] pointer-events-none" />

        {/* 상단: 이미지 + 타이틀 영역 */}
        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          {/* 캐릭터 이미지 */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="relative mb-6"
          >
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-30 scale-105"
              style={{ background: 'linear-gradient(to top right, rgb(244, 114, 182), rgb(253, 164, 175))' }}
            />
            <img
              src={`/images/shares/${result.type}.png`}
              alt={displayTitle}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="relative w-44 h-44 md:w-64 md:h-64 select-none rounded-3xl object-cover shadow-2xl border-2 border-white/10"
            />
          </motion.div>

          {/* 별명 */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-black neon-text break-keep mb-3"
          >
            {displayTitle}
          </motion.h1>

          {/* 부제 */}
          {result.subtitle && (
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-base md:text-sm text-gray-400 italic mb-3"
            >
              "{result.subtitle}"
            </motion.p>
          )}

          {/* 인구 퍼센티지 */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="px-4 py-1.5 bg-neon-purple/15 border border-neon-purple/30 rounded-full text-sm text-gray-300">
              전체 인구의 <span className="text-sm font-bold text-neon-purple">{getPopularityLabel(result.type as PersonalityType)}</span>
            </span>
            {getRarityTier(result.type as PersonalityType) === 'legendary' && (
              <span className="px-3 py-1 bg-neon-magenta/15 border border-neon-magenta/30 rounded-full text-xs text-neon-magenta font-semibold">희귀 유형</span>
            )}
          </motion.div>
        </div>

        {/* 구분선 */}
        <div
          className="relative z-10 w-16 h-px mx-auto mb-6"
          style={{ background: 'linear-gradient(to right, transparent, rgba(244, 114, 182, 0.5), transparent)' }}
        />

        {/* 특징 리스트 */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 space-y-2"
        >
          {result.description.map((desc, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-start space-x-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5"
            >
              <span className="text-neon-purple text-base mt-0.5 shrink-0">✦</span>
              <p className="text-gray-300 text-sm md:text-sm break-keep leading-relaxed">{renderBoldText(desc)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 키워드 해시태그 */}
        {result.keywords && result.keywords.length > 0 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="relative z-10 flex flex-nowrap gap-1.5 justify-center mt-6 px-2"
          >
            {result.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-[10px] font-semibold bg-neon-purple/10 text-neon-purple border border-neon-purple/30 rounded-full whitespace-nowrap flex-shrink-0"
              >
                #{keyword}
              </span>
            ))}
          </motion.div>
        )}

        {/* 축별 설명 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 mt-8 pt-6 border-t border-white/5"
        >
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">성향 분석</p>
          <div className="grid grid-cols-2 gap-2 text-sm break-keep">
            {[result.traits.axis1, result.traits.axis2, result.traits.axis3, result.traits.axis4].map((trait, i) => {
              const opposite = axisOpposites[trait];
              return (
                <div key={i} className="flex items-center gap-1.5 bg-white/[0.03] rounded-lg px-3 py-2">
                  <span className="text-white font-semibold text-xs">{trait.split(' (')[0]}</span>
                  {opposite && (
                    <>
                      <span className="text-gray-700">/</span>
                      <span className="text-gray-600 text-xs">{opposite.split(' (')[0]}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* 공유 버튼 영역 */}
      {!isShared && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-2xl mt-6 space-y-3"
        >
          <p className="text-center text-sm text-gray-500 mb-1">
            👇 친구한테 보내면 대화가 이상해지는 버튼
          </p>
          <button
            onClick={handleKakaoShare}
            className="w-full px-6 py-3 text-base font-bold bg-[#FEE500] text-[#191919] rounded-full hover:shadow-2xl transition-all duration-300"
          >
            <span>💬 카톡으로 결과 공유하기</span>
            <span className="block text-sm font-medium text-[#191919]/50 mt-0.5">내 친구들은 어떤 유형일까?</span>
          </button>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={handleInstagramShare}
              disabled={isDownloading}
              className="px-2 md:px-6 py-3 text-sm font-bold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {isDownloading ? '⏳ 생성 중' : '📸 인스타 스토리'}
            </button>

            <button
              onClick={handleTwitterShare}
              className="px-2 md:px-6 py-3 text-sm font-bold bg-gray-800 text-gray-300 rounded-full border border-gray-700 hover:border-gray-500 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              🐦 X 공유
            </button>
          </div>
        </motion.div>
      )}

      {/* 맞춤형 추천 상품 섹션 (공유받은 결과에서는 숨김) */}
      {!isShared && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-2xl mt-8 mb-4"
        >
          <div className="flex items-center gap-2 mb-6 px-1">
            <span className="text-neon-purple animate-pulse">✨</span>
            <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 break-keep">
              오직 [{displayTitle}]님만을 위한 특별한 추천
            </h3>
          </div>
          
          <div className="space-y-4">
            {products.map((product, index) => (
              <motion.a
                key={index}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackProductClick(product.name, product.link, result.type as PersonalityType, index + 1)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 md:p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 hover:border-neon-purple/50 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden animate-card-glow product-card-glow"
              >
                {/* 배경 광 효과 */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                  style={{ background: 'linear-gradient(to right, rgba(244, 114, 182, 0), rgba(244, 114, 182, 0.05), rgba(244, 114, 182, 0))' }}
                />
                
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800/50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 shadow-xl transition-transform duration-500 group-hover:scale-105">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl transform group-hover:scale-110 transition-transform duration-500 opacity-90">{product.emoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base md:text-lg text-white group-hover:text-neon-purple transition-colors line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 line-clamp-2 mt-1 font-light leading-relaxed">
                    {product.description}
                  </p>
                  {product.price && (
                    <p className="text-xs md:text-sm mt-1.5">
                      {product.originalPrice ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                          <span className="text-neon-purple font-semibold ml-1.5">{product.price}</span>
                          {product.discountPercent && (
                            <span className="text-neon-magenta text-xs ml-1">{product.discountPercent}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-neon-purple font-semibold">{product.price}</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-neon-purple group-hover:text-white transition-all">
                  <span className="text-sm font-bold opacity-70 group-hover:opacity-100">→</span>
                </div>
              </motion.a>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-4 text-center opacity-70 italic">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
          </p>
        </motion.div>
      )}

      {/* 배너 광고 영역 (공유받은 결과에서는 숨김) */}
      {!isShared && <AdBanner variant="result" resultType={result.type as PersonalityType} />}

      {/* 나와의 궁합 섹션 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="w-full max-w-2xl mt-8"
      >
        <p className="text-sm text-gray-400 mb-2 px-1">친구의 유형은 어떨까?</p>
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="text-neon-purple">🔍</span>
          <h3 className="text-lg md:text-xl font-bold text-white">
            나와의 궁합
          </h3>
        </div>

        {/* 궁합 그룹 아코디언 */}
        <div className="space-y-3">
          {compatibilityGroups.map((group) => {
            const groupResults = allResults.filter(
              (r) => r.type !== result.type && group.match(countMatchingAxes(result.type, r.type))
            );
            if (groupResults.length === 0) return null;
            const isOpen = openGroup === group.key;

            return (
              <div key={group.key}>
                {/* 그룹 헤더 */}
                <button
                  onClick={() => {
                    setOpenGroup(isOpen ? null : group.key);
                    setSelectedExploreType(null);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                    isOpen
                      ? 'bg-gray-800 border-neon-purple/40'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{group.emoji}</span>
                    <span className="text-white font-bold text-base">{group.label}</span>
                    <span className="text-xs text-gray-500">{groupResults.length}개 유형</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 text-sm"
                  >
                    ▼
                  </motion.span>
                </button>

                {/* 그룹 내용 (아코디언) */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        {groupResults.map((r) => {
                          const isSelected = r.type === selectedExploreType;
                          return (
                            <button
                              key={r.type}
                              onClick={() => {
                                const next = isSelected ? null : (r.type as PersonalityType);
                                setSelectedExploreType(next);
                                if (next) {
                                  setTimeout(() => {
                                    exploreDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                  }, 100);
                                }
                              }}
                              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                                isSelected
                                  ? 'bg-neon-purple/20 border-neon-purple shadow-lg shadow-neon-purple/20'
                                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800/80'
                              }`}
                            >
                              <div className="text-2xl mb-1">{r.emoji}</div>
                              <p className="text-xs text-gray-400 font-mono">{r.type}</p>
                              <p className="text-sm text-white font-semibold truncate">
                                {r.title}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-1 truncate">{getCompatibilityDesc(result.type, r.type)}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* 선택된 유형 상세 정보 */}
                      <AnimatePresence mode="wait">
                        {selectedExploreResult && (
                          <motion.div
                            ref={exploreDetailRef}
                            key={selectedExploreResult.type}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-6 bg-gray-800 rounded-2xl border border-neon-purple/30">
                              <div className="flex items-center gap-4 mb-4">
                                <img
                                  src={`/images/shares/${selectedExploreResult.type}.png`}
                                  alt={selectedExploreResult.title}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  className="w-20 h-20 rounded-xl object-cover shadow-lg"
                                />
                                <div>
                                  <span
                                    className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-1"
                                    style={{ background: 'linear-gradient(to right, rgb(244, 114, 182), rgb(253, 164, 175))' }}
                                  >
                                    {selectedExploreResult.type}
                                  </span>
                                  <h4 className="text-xl font-bold text-white">
                                    {selectedExploreResult.title}
                                  </h4>
                                  <p className="text-sm text-gray-400 italic">"{selectedExploreResult.subtitle}"</p>
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                {selectedExploreResult.description.map((desc, index) => (
                                  <div key={index} className="flex items-start space-x-2">
                                    <span className="text-neon-purple text-sm mt-0.5 shrink-0">✦</span>
                                    <p className="text-gray-300 text-sm break-keep leading-relaxed">{renderBoldText(desc)}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="border-t border-gray-700 pt-4">
                                <p className="text-xs text-gray-400 mb-2">📊 성향 분석</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm break-keep">
                                  {[selectedExploreResult.traits.axis1, selectedExploreResult.traits.axis2, selectedExploreResult.traits.axis3, selectedExploreResult.traits.axis4].map((trait, i) => {
                                    const opposite = axisOpposites[trait];
                                    return (
                                      <div key={i} className="flex items-center gap-2">
                                        <span className="text-white font-semibold">{trait}</span>
                                        {opposite && (
                                          <>
                                            <span className="text-gray-600">/</span>
                                            <span className="text-gray-600 opacity-90">{opposite}</span>
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 버튼 영역 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isShared ? 1.2 : 1.6 }}
        className="w-full max-w-2xl mt-8 space-y-4"
      >
        <button
          onClick={onRestart}
          className="w-full px-8 py-4 text-lg font-bold rounded-full hover:shadow-2xl transition-all duration-300"
          style={{
            background: 'linear-gradient(to right, rgb(244, 114, 182), rgb(253, 164, 175))'
          }}
        >
          {isShared ? '🔥 나도 테스트하기' : '🔄 다시 테스트하기'}
        </button>
      </motion.div>
      {/* 인스타그램 스토리용 숨겨진 카드 (이미지 저장 시에만 사용) */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        <div
          ref={storyCardRef}
          style={{ width: '1080px', height: '1920px' }}
          className="bg-[#0f172a] flex flex-col items-center justify-center p-20 relative overflow-hidden"
        >
          {/* 배경 그라데이션 광효과 (더 몽환적으로) */}
          <div className="absolute top-[-5%] left-[-10%] w-[800px] h-[800px] bg-neon-purple/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-5%] right-[-10%] w-[800px] h-[800px] bg-neon-magenta/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/carbon-fibre.png')] opacity-10" />

          {/* 메인 콘텐츠 */}
          <div className="z-10 flex flex-col items-center w-full" style={{ maxWidth: '940px' }}>
            {/* 로고 */}
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-[56px] font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-pink-200 drop-shadow-[0_0_25px_rgba(244,114,182,0.5)]">밤</span>
              <span
                className="text-[48px] font-extrabold tracking-tight neon-text"
                style={{
                  background: 'linear-gradient(to right, rgb(244, 114, 182), rgb(253, 164, 175), rgb(254, 205, 211))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >bti</span>
            </div>

            {/* 인구 퍼센티지 */}
            <p className="text-[36px] text-neon-purple font-bold mb-8">
              전체 인구의 {getPopularityLabel(result.type as PersonalityType)}
            </p>

            {/* 캐릭터 이미지 */}
            <div className="relative mb-10">
              <div
                className="absolute inset-0 rounded-[40px] blur-3xl opacity-40 scale-110"
                style={{ background: 'linear-gradient(to top right, rgb(244, 114, 182), rgb(253, 164, 175))' }}
              />
              <div className="relative w-[620px] h-[620px] rounded-[40px] overflow-hidden border-[5px] border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
                <img
                  src={`/images/shares/${result.type}.png`}
                  alt={displayTitle}
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
              </div>
            </div>

            {/* 별명 */}
            <h1 className="text-[96px] font-black text-white neon-text mb-4 tracking-tight drop-shadow-2xl whitespace-nowrap leading-tight text-center">
              {displayTitle}
            </h1>

            {/* 부제 */}
            <p className="text-[40px] text-neon-pink font-bold italic tracking-wide opacity-90 break-keep text-center mb-10">
              "{result.subtitle}"
            </p>

            {/* 특성 1줄 */}
            <div className="w-full px-6">
              <div className="bg-white/[0.06] py-5 px-8 rounded-2xl border border-white/10">
                <p className="text-[28px] text-gray-200 font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-neon-purple">✦</span> {result.description[0].replace(/\*\*/g, '')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
