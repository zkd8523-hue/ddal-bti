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
  const storyCardRef = useRef<HTMLDivElement>(null);
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
      // 인스타그램 스토리용 ref가 있으면 그것을, 없으면 기본 ref를 사용
      const targetRef = storyCardRef.current || resultCardRef.current;
      if (!targetRef) return;

      // 이미지를 data URL로 생성 (인스타그램 스토리 비율 9:16 고려)
      const dataUrl = await toPng(targetRef, {
        quality: 0.95,
        pixelRatio: 3, // 고해상도를 위해 3으로 상향
        backgroundColor: '#111827',
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
        {/* 헤더: 배지+타이틀+설명 (모바일 세로, PC 가로) */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          {/* 모바일에서는 이미지 먼저 (순서 변경용 md:order-last 등 사용 가능하지만 직관적으로 배치) */}
          <div className="block md:hidden mb-2">
            <motion.img
              src={`/images/shares/${result.type}.png`}
              alt={displayTitle}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="w-48 h-48 select-none opacity-95 shrink-0 rounded-2xl object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1 min-w-0 w-full flex flex-col items-center md:items-start text-center md:text-left">
            {/* 타입 배지 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-full text-xl font-bold mb-3"
            >
              {result.type}
            </motion.div>

            {/* 타이틀 */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-4xl font-bold neon-text break-keep mb-4"
            >
              {displayTitle}
            </motion.h1>

            {/* 부제 */}
            {result.subtitle && (
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-base md:text-sm text-gray-400 italic mb-6"
              >
                "{result.subtitle}"
              </motion.p>
            )}

            {/* 특징 리스트 */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 w-full"
            >
              {result.description.map((desc, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start space-x-2 text-left md:text-left"
                >
                  <span className="text-neon-purple text-lg mt-0.5 shrink-0">✦</span>
                  <p className="text-gray-300 text-base md:text-sm break-keep leading-relaxed">{renderBoldText(desc)}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* PC용 대표 캐릭터 이미지 (오른쪽 배치 고정) */}
          <div className="hidden md:block">
            <motion.img
              src={`/images/shares/${result.type}.png`}
              alt={displayTitle}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="md:w-52 md:h-52 select-none opacity-95 shrink-0 rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>

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
          className="w-full max-w-2xl mt-12 mb-4"
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
                className="flex items-center gap-4 p-4 md:p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 hover:border-neon-purple/50 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
              >
                {/* 배경 광 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
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
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="px-2 md:px-6 py-4 text-sm md:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-2xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {isDownloading ? '⏳ 생성 중' : (isIOS() ? '📤 이미지 공유' : '📥 이미지 저장')}
              </button>

              <button
                onClick={handleCopyLink}
                className="px-2 md:px-6 py-4 text-sm md:text-base font-bold bg-gray-700 text-white rounded-full hover:shadow-2xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                🔗 링크 복사
              </button>
            </div>

            {/* 카카오톡 & X 공유 */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={handleKakaoShare}
                className="px-2 md:px-6 py-4 text-sm md:text-base font-bold bg-[#FEE500] text-[#191919] rounded-full hover:shadow-2xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                💬 카카오톡
              </button>

              <button
                onClick={handleTwitterShare}
                className="px-2 md:px-6 py-4 text-sm md:text-base font-bold bg-black text-white rounded-full hover:shadow-2xl transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

          {/* 메인 콘텐츠 컨테이너 (중앙 집중형) */}
          <div className="z-10 flex flex-col items-center w-full max-w-4xl">
            {/* 1. 헤더: 나의 밤BTI 결과 */}
            <p className="text-4xl text-gray-400 font-medium tracking-widest mb-4 opacity-80 uppercase">
              My Bam-BTI Result
            </p>
            
            {/* 2. 영문 타입 (FMAT 등) */}
            <div className="text-[120px] font-black tracking-tighter leading-none mb-12 italic bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              {result.type}
            </div>

            {/* 3. 사진 (메인 캐릭터) */}
            <div className="relative mb-14">
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple to-neon-magenta rounded-[40px] blur-3xl opacity-40 scale-110" />
              <div className="relative w-[650px] h-[650px] rounded-[40px] overflow-hidden border-[6px] border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group">
                <img
                  src={`/images/shares/${result.type}.png`}
                  alt={displayTitle}
                  className="w-full h-full object-cover scale-105"
                />
                {/* 비네팅 효과 */}
                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />
              </div>
            </div>

            {/* 4. 별명 (폭주기관차 토끼 등) */}
            <div className="text-center mb-10">
              <h1 className="text-9xl font-black text-white neon-text mb-4 tracking-tight drop-shadow-2xl">
                {displayTitle}
              </h1>
              <p className="text-4xl text-neon-pink font-bold italic tracking-wide opacity-90">
                "{result.subtitle}"
              </p>
            </div>

            {/* 5. 부연설명 (핵심 2-3개만) */}
            <div className="w-full space-y-8 px-12 mt-4">
              {result.description.slice(0, 3).map((desc, index) => (
                <div key={index} className="flex items-center justify-center gap-6 bg-white/5 py-6 px-10 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                  <span className="text-neon-purple text-5xl">✦</span>
                  <p className="text-[34px] text-gray-100 font-semibold leading-relaxed break-keep text-center">
                    {desc.replace(/\*\*/g, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 깔끔한 하단 로고 느낌의 텍스트만 (삭제된 푸터 대신) */}
          <div className="absolute bottom-20 z-10 opacity-30">
            <p className="text-3xl font-light tracking-[1em] text-white">BAM-BTI.VERCEL.APP</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
