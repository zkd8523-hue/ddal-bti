import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { Result as ResultType, PersonalityType, Gender } from '../types';
import { getProductsForType } from '../data/products';
import { analytics } from '../utils/analytics';
import { isIOS, canUseWebShare, dataURLToBlob } from '../utils/deviceDetection';
import AdBanner from './AdBanner';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY || '4570e75c05df4248b7729c5bd0bf94af';

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
  gender?: Gender | null;
  isShared?: boolean;
  onRestart: () => void;
}

function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
  );
}

export default function Result({ result, gender, isShared = false, onRestart }: ResultProps) {
  const products = getProductsForType(result.type as PersonalityType, gender || undefined);

  const displayTitle = gender === 'female' ? result.femaleTitle : result.title;
  const displayEmoji = gender === 'female' ? result.femaleEmoji : result.emoji;

  // 이미지 저장을 위한 ref와 상태
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // SDK 로딩 대기 및 초기화
    const initKakao = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(KAKAO_APP_KEY);
            console.log('Kakao SDK 초기화 완료');
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
    if (!window.Kakao) {
      alert('❌ 카카오 SDK를 불러오지 못했습니다.\n페이지를 새로고침 해주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      alert('❌ 카카오 SDK가 초기화되지 않았습니다.\n잠시 후 다시 시도해주세요.');
      return;
    }

    if (!window.Kakao.Share) {
      alert('❌ 카카오 공유 기능을 사용할 수 없습니다.\n브라우저를 업데이트해주세요.');
      return;
    }

    try {
      // GA4 이벤트 추적
      analytics.trackKakaoShare(result.type as PersonalityType);

      const siteUrl = window.location.origin;
      const imageUrlHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'https://bam-bti.vercel.app' : siteUrl;
      const resultUrl = `${siteUrl}/?type=${result.type}${gender ? `&gender=${gender}` : ''}`;

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `[밤BTI] 나의 결과: ${displayTitle} ${displayEmoji}`,
          description: result.description[0].replace(/\*\*/g, ''),
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
              mobileWebUrl: siteUrl,
              webUrl: siteUrl,
            },
          },
        ],
      });
    } catch (error) {
      console.error('카카오 공유 실패:', error);
      alert('❌ 공유하기에 실패했습니다.\n잠시 후 다시 시도해주세요.');
    }
  };

  // 이미지 다운로드
  const handleDownloadImage = async () => {
    if (!resultCardRef.current) return;
    setIsDownloading(true);

    try {
      // 이미지를 data URL로 생성
      const dataUrl = await toPng(resultCardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#1F2937',
      });

      const fileName = `밤BTI-${result.type}-${displayTitle}.png`;

      // iOS: Web Share API 사용
      if (isIOS() && canUseWebShare()) {
        try {
          const blob = dataURLToBlob(dataUrl);
          const file = new File([blob], fileName, { type: 'image/png' });

          await navigator.share({
            files: [file],
            title: `밤BTI 결과: ${displayTitle}`,
            text: `나의 밤BTI 결과는 "${displayTitle}" ${displayEmoji}`,
          });

          analytics.trackNativeShare(result.type as PersonalityType);
          return;
        } catch (shareError) {
          // 사용자가 취소한 경우 조용히 처리
          if ((shareError as Error).name === 'AbortError') {
            console.log('사용자가 공유를 취소했습니다.');
            return;
          }
          console.error('Web Share API 실패:', shareError);
          // 폴백으로 계속 진행
        }
      }

      // Android/Desktop: 기존 다운로드 방식
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      analytics.trackImageDownload(result.type as PersonalityType);

    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 링크 복사
  const handleCopyLink = async () => {
    const siteUrl = window.location.origin;
    const resultUrl = `${siteUrl}/?type=${result.type}${gender ? `&gender=${gender}` : ''}`;

    try {
      await navigator.clipboard.writeText(resultUrl);
      alert('✅ 링크가 복사되었습니다!');
      analytics.trackLinkCopy(result.type as PersonalityType);
    } catch {
      // Clipboard API 미지원 브라우저 fallback
      const textarea = document.createElement('textarea');
      textarea.value = resultUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        alert('✅ 링크가 복사되었습니다!');
        analytics.trackLinkCopy(result.type as PersonalityType);
      } catch {
        alert('링크 복사에 실패했습니다. 직접 복사해주세요:\n' + resultUrl);
      }
      document.body.removeChild(textarea);
    }
  };

  // X 공유
  const handleTwitterShare = () => {
    const siteUrl = window.location.origin;
    const resultUrl = `${siteUrl}/?type=${result.type}${gender ? `&gender=${gender}` : ''}`;
    const text = `나의 밤BTI 결과는 "${displayTitle}" ${displayEmoji}\n\n`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(resultUrl)}`;
    window.open(twitterUrl, '_blank');

    analytics.trackTwitterShare(result.type as PersonalityType);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen px-6 py-12"
    >
      {/* 페이지 타이틀 */}
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-gray-400 mb-4"
      >
        {isShared ? '친구의 밤BTI 결과' : '나의 밤BTI는?'}
      </motion.p>

      {/* 결과 카드 */}
      <motion.div
        ref={resultCardRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl bg-gray-800 rounded-2xl p-8 neon-border"
      >
        {/* 헤더: 배지+타이틀 (왼쪽) + 이모지 (오른쪽) */}
        <div className="flex items-start justify-between mb-6">
          <div>
            {/* 타입 배지 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-full text-xl font-bold mb-4"
            >
              {result.type}
            </motion.div>

            {/* 타이틀 */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-bold neon-text break-keep"
            >
              {displayTitle}
            </motion.h1>
          </div>

          {/* 대표 캐릭터 이미지 */}
          <motion.img
            src={`/images/shares/${result.type}.png`}
            alt={displayTitle}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="w-40 h-40 md:w-56 md:h-56 select-none opacity-90 shrink-0 ml-2 rounded-2xl object-cover"
          />
        </div>

        {/* 특징 리스트 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mb-8"
        >
          {result.description.map((desc, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <span className="text-neon-purple text-xl">✦</span>
              <p className="text-gray-300 break-keep leading-relaxed">{renderBoldText(desc)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 축별 설명 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-gray-700 pt-6 space-y-2"
        >
          <p className="text-sm text-gray-400">📊 당신의 성향 분석</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm break-keep">
            {[result.traits.axis1, result.traits.axis2, result.traits.axis3, result.traits.axis4].map((trait, i) => {
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
        </motion.div>
      </motion.div>

      {/* 맞춤형 추천 상품 섹션 (공유받은 결과에서는 숨김) */}
      {!isShared && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-2xl mt-8"
        >
          <h3 className="text-lg font-bold text-gray-300 mb-4 break-keep">
            같은 [{displayTitle}]들이 선택한 HOT템 !
          </h3>
          <div className="space-y-3">
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
                className="flex items-center gap-3 p-4 md:gap-5 md:p-6 bg-gray-800 rounded-2xl border-2 border-neon-purple/50 animate-border-glow hover:shadow-[0_0_25px_rgba(157,78,221,0.5)] hover:border-neon-magenta transition-all duration-300 group"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-600 shadow-inner">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl md:text-6xl transform group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base md:text-xl text-white group-hover:text-neon-pink transition-colors line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-xs md:text-base text-gray-400 line-clamp-2 mt-1">{product.description}</p>
                </div>
                <span className="text-gray-500 text-lg md:text-2xl group-hover:text-neon-purple transition-colors ml-1">→</span>
              </motion.a>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-2 text-center">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
          </p>
        </motion.div>
      )}

      {/* 배너 광고 영역 (공유받은 결과에서는 숨김) */}
      {!isShared && <AdBanner variant="result" />}

      {/* 버튼 영역 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isShared ? 1.2 : 1.6 }}
        className="w-full max-w-2xl mt-8 space-y-4"
      >
        {!isShared && (
          <>
            {/* 이미지 저장 & 링크 복사 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="px-6 py-4 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
              >
                {isDownloading ? '⏳ 생성 중...' : (isIOS() ? '📤 이미지 공유' : '📥 이미지 저장')}
              </button>

              <button
                onClick={handleCopyLink}
                className="px-6 py-4 text-base font-bold bg-gray-700 text-white rounded-full hover:shadow-2xl transition-all duration-300"
              >
                🔗 링크 복사
              </button>
            </div>

            {/* 카카오톡 & X 공유 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleKakaoShare}
                className="px-6 py-4 text-base font-bold bg-[#FEE500] text-[#191919] rounded-full hover:shadow-2xl transition-all duration-300"
              >
                💬 카카오톡
              </button>

              <button
                onClick={handleTwitterShare}
                className="px-6 py-4 text-base font-bold bg-black text-white rounded-full hover:shadow-2xl transition-all duration-300"
              >
                🐦 X 공유
              </button>
            </div>
          </>
        )}

        <button
          onClick={onRestart}
          className="w-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-magenta rounded-full hover:shadow-2xl transition-all duration-300"
        >
          {isShared ? '🔥 나도 테스트하기' : '🔄 다시 테스트하기'}
        </button>
      </motion.div>
    </motion.div>
  );
}
