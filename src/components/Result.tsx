import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { Result as ResultType } from '../types';
import type { PersonalityType } from '../types';
import { getProductsForType } from '../data/products';
import AdBanner from './AdBanner';

declare global {
  interface Window {
    Kakao: any;
  }
}

// TODO: 카카오 디벨로퍼스에서 발급받은 JavaScript 키로 교체하세요
const KAKAO_APP_KEY = 'YOUR_KAKAO_APP_KEY';

interface ResultProps {
  result: ResultType;
  onRestart: () => void;
}

function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
  );
}

export default function Result({ result, onRestart }: ResultProps) {
  const products = getProductsForType(result.type as PersonalityType);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY);
    }
  }, []);

  const handleInstagramShare = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: '#111827',
        pixelRatio: 2,
      });

      // 모바일: Web Share API로 공유 시트 열기
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'ddalbti-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `[딸BTI] ${result.type} - ${result.title}`,
        });
      } else {
        // PC: 이미지 다운로드
        const link = document.createElement('a');
        link.download = 'ddalbti-result.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('이미지가 저장되었습니다!\n인스타그램 스토리에 올려보세요.');
      }
    } catch (err) {
      console.error('이미지 캡쳐 실패:', err);
      alert('이미지 캡쳐에 실패했습니다. 스크린샷을 이용해주세요.');
    }
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      alert('카카오 SDK를 불러오지 못했습니다.');
      return;
    }

    const siteUrl = window.location.origin;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `[딸BTI] 나의 결과: ${result.type}`,
        description: `"${result.title}" - ${result.description[0]}`,
        imageUrl: `${siteUrl}/favicon.svg`,
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
        나의 딸BTI는?
      </motion.p>

      {/* 결과 카드 */}
      <motion.div
        ref={cardRef}
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
              className="text-3xl md:text-4xl font-bold neon-text"
            >
              {result.title}
            </motion.h1>
          </div>

          {/* 대표 이모지 */}
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="text-6xl md:text-8xl select-none opacity-90 shrink-0 ml-4"
          >
            {result.emoji}
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
        <h3 className="text-lg font-bold text-gray-300 mb-4">
          🎁 {result.type} 유형 맞춤 추천템
        </h3>
        <div className="space-y-3">
          {products.map((product, index) => (
            <motion.a
              key={index}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-neon-magenta transition-all duration-200 group"
            >
              <span className="text-3xl">{product.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-white group-hover:text-neon-pink transition-colors">
                  {product.name}
                </p>
                <p className="text-sm text-gray-400">{product.description}</p>
              </div>
              <span className="text-gray-500 group-hover:text-neon-purple transition-colors">→</span>
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
