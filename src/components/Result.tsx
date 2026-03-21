import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Result as ResultType, PersonalityType, Gender } from '../types';
import { getProductsForType } from '../data/products';
import { analytics } from '../utils/analytics';
import AdBanner from './AdBanner';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

if (!KAKAO_APP_KEY) {
  console.error('KAKAO_APP_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

interface ResultProps {
  result: ResultType;
  gender?: Gender | null;
  onRestart: () => void;
}

function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
  );
}

export default function Result({ result, gender, onRestart }: ResultProps) {
  const products = getProductsForType(result.type as PersonalityType, gender || undefined);

  const displayTitle = gender === 'female' ? result.femaleTitle : result.title;
  const displayEmoji = gender === 'female' ? result.femaleEmoji : result.emoji;

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

  const handleInstagramShare = async () => {
    // GA4 이벤트 추적
    analytics.trackInstagramShare(result.type as PersonalityType);

    const cleanDesc = result.description[0].replace(/\*\*/g, '');
    const shareText = `[밤BTI] 나의 결과: ${displayTitle} ${displayEmoji}\n${cleanDesc}\n\n당신도 테스트해보세요! ${window.location.origin}`;

    // 클립보드 복사 시도
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('📋 링크가 클립보드에 복사되었습니다!\n인스타그램 스토리에서 붙여넣으세요.');
      } else {
        // Fallback for browsers without clipboard API
        alert('📋 다음 텍스트를 복사해주세요:\n\n' + shareText);
      }
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      alert('📋 클립보드 복사에 실패했습니다. 수동으로 복사해주세요.');
    }

    // 인스타그램 앱 열기
    window.location.href = 'instagram://app';

    // 앱이 안 열리면 (PC 등) 웹으로 이동
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank');
    }, 1500);
  };

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

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `[밤BTI] 나의 결과: ${displayTitle} ${displayEmoji}`,
          description: result.description[0].replace(/\*\*/g, ''),
          imageUrl: `${siteUrl}/og-image-v3.png`,
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
        buttons: [
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
        나의 밤BTI는?
      </motion.p>

      {/* 결과 카드 */}
      <motion.div
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

          {/* 대표 이모지 */}
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="text-6xl md:text-8xl select-none opacity-90 shrink-0 ml-4"
          >
            {displayEmoji}
          </motion.span>
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
              <p className="text-gray-300">{renderBoldText(desc)}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
            <p>• {result.traits.axis1}</p>
            <p>• {result.traits.axis2}</p>
            <p>• {result.traits.axis3}</p>
            <p>• {result.traits.axis4}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 맞춤형 추천 상품 섹션 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-2xl mt-8"
      >
        <h3 className="text-lg font-bold text-gray-300 mb-4 break-keep">
          🎁 [{displayTitle}] 님을 더욱 즐겁게 할 맞춤 추천템
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
              className="flex items-center space-x-5 p-5 md:p-6 bg-gray-800 rounded-2xl border-2 border-neon-purple/50 shadow-[0_0_15px_rgba(157,78,221,0.2)] hover:shadow-[0_0_25px_rgba(157,78,221,0.5)] hover:border-neon-magenta transition-all duration-300 group"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-600 shadow-inner">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl transform group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg md:text-xl text-white group-hover:text-neon-pink transition-colors truncate">
                  {product.name}
                </p>
                <p className="text-sm md:text-base text-gray-400 line-clamp-2 mt-1.5">{product.description}</p>
              </div>
              <span className="text-gray-500 text-xl md:text-2xl group-hover:text-neon-purple transition-colors ml-2">→</span>
            </motion.a>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
        </p>
      </motion.div>

      {/* 배너 광고 영역 */}
      <AdBanner variant="result" />

      {/* 버튼 영역 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="w-full max-w-2xl mt-8 space-y-4"
      >
        <button
          onClick={handleKakaoShare}
          className="w-full px-8 py-4 text-lg font-bold bg-[#FEE500] text-[#191919] rounded-full hover:shadow-2xl transition-all duration-300"
        >
          💬 카카오톡으로 공유하기
        </button>

        <button
          onClick={handleInstagramShare}
          className="w-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          📸 인스타그램 스토리 공유
        </button>

        <button
          onClick={onRestart}
          className="w-full px-8 py-4 text-lg font-bold bg-gray-800 hover:bg-gray-700 rounded-full border-2 border-gray-700 hover:border-neon-purple transition-all duration-300"
        >
          🔄 다시 테스트하기
        </button>
      </motion.div>
    </motion.div>
  );
}
