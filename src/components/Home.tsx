import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { results } from '../data/results';

/* 개별 자릿수 플립 애니메이션 */
function FlipDigit({ char, place }: { char: string; place: number }) {
  return (
    <span className="inline-block relative overflow-hidden" style={{ width: char === ',' ? '0.35em' : '0.6em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${place}-${char}`}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block w-full text-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FlipCounter({ value }: { value: number }) {
  const chars = value.toLocaleString('ko-KR').split('');
  return (
    <span className="inline-flex" aria-label={value.toLocaleString('ko-KR')}>
      {chars.map((char, i) => (
        <FlipDigit key={chars.length - i} char={char} place={chars.length - i} />
      ))}
    </span>
  );
}

/* 반응 말풍선 데이터 */
const reactions = [
  '아 이거 찐이다 ㅋㅋㅋ',
  '왜 이렇게 정확해...',
  '단톡방 터짐 ㅋㅋ',
  '나 이거 3번 함...',
];

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  const [count, setCount] = useState(2847);
  const [cardIndex, setCardIndex] = useState(0);
  const [reactionIndex, setReactionIndex] = useState(0);

  // 미니 카드용 결과 4개 랜덤 선택 (마운트 시 1회)
  const previewResults = useMemo(() => {
    const shuffled = [...results].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  // 참여자 카운터
  useEffect(() => {
    let first = true;
    const tick = () => {
      const delay = first
        ? 1000 + Math.random() * 500
        : 3000 + Math.random() * 5000;
      first = false;
      const timer = setTimeout(() => {
        setCount((c) => c + (Math.random() < 0.7 ? 1 : 2));
        tick();
      }, delay);
      return timer;
    };
    const timer = tick();
    return () => clearTimeout(timer);
  }, []);

  // 미니 카드 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCardIndex((i) => (i + 1) % previewResults.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [previewResults.length]);

  // 반응 말풍선 자동 전환
  useEffect(() => {
    const timer = setInterval(() => {
      setReactionIndex((i) => (i + 1) % reactions.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const currentCard = previewResults[cardIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.4 }}
        className="text-3xl mb-2"
      >
        🌙
      </motion.p>

      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="mb-1 text-center select-none"
      >
        <span className="inline-flex items-baseline gap-0.5">
          <span className="text-6xl md:text-8xl font-black font-suit bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-pink-200 drop-shadow-[0_0_25px_rgba(244,114,182,0.5)]">
            밤
          </span>
          <span className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-neon-purple via-neon-magenta to-neon-pink neon-text">
            bti
          </span>
        </span>
      </motion.h1>

      {/* E-1: 서브카피 */}
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-xl md:text-2xl text-gray-300 mb-3 text-center break-keep font-pretendard"
      >
        <span className="text-base md:text-xl opacity-70">'</span>16가지 밤 캐릭터중 난 어떤 유형일까?<span className="text-base md:text-xl opacity-70">'</span>
      </motion.p>

      {/* A-2: 미니 결과 카드 슬라이드 (share 이미지 활용) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="w-full max-w-xs h-24 mb-5 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3.5">
              <img
                src={`/images/shares/${currentCard.type}.png`}
                alt={currentCard.title}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-base font-bold text-white truncate">{currentCard.title}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {currentCard.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-14 py-5 text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-300 text-white rounded-full neon-border hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
      >
        🚀 60초 테스트 시작
      </motion.button>

      {/* Social Proof - 사회적 증거 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-3 text-sm text-gray-400"
      >
        🔥 지난 7일동안 <FlipCounter value={count} />명이 해봤어요
      </motion.p>

    </motion.div>
  );
}
