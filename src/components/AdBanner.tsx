import { motion } from 'framer-motion';

interface AdBannerProps {
  variant?: 'result' | 'loading';
}

export default function AdBanner({ variant = 'result' }: AdBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: variant === 'loading' ? 0.5 : 1.5 }}
      className="w-full max-w-2xl mx-auto mt-6"
    >
      {/* 광고 영역 - 실제 배너 이미지/스크립트로 교체 */}
      <div className="relative rounded-xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-lg p-2 flex-shrink-0 shadow-lg">
            <img 
              src="https://thumbnail7.coupangcdn.com/thumbnails/remote/490x490ex/image/retail/images/2020/03/12/17/9/69c1180b-22d7-4009-913b-55278c52980c.jpg" 
              alt="크리넥스" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs text-gray-500 mb-2">AD</p>
            <p className="text-gray-300 text-lg font-bold mb-2">
              🧻 16개 모든 유형의 완벽한 마무리를 위한 공통 필수템
            </p>
            <p className="text-gray-500 text-sm mb-6 md:mb-4">
              어차피 매일 쓰는 크리넥스, 지금 로켓배송 특가로 쟁여두세요!
            </p>
            <a
              href="https://link.coupang.com/a/d8jv4j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-2 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              보러가기
            </a>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 text-center py-1 bg-gray-900">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
        </p>
      </div>
    </motion.div>
  );
}
