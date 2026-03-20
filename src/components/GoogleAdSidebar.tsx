import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GoogleAdSidebarProps {
  position: 'left' | 'right';
  adSlot: string;
}

export default function GoogleAdSidebar({ position, adSlot }: GoogleAdSidebarProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // AdSense 광고 로드
    try {
      if (typeof window !== 'undefined') {
        // AdSense 스크립트가 로드되었는지 확인
        const adsbygoogle = (window as any).adsbygoogle;
        if (adsbygoogle) {
          adsbygoogle.push({});
        }
      }
    } catch (err) {
      console.error('AdSense load error:', err);
    }
  }, []);

  // 개발/프로덕션 환경 구분
  const isProd = import.meta.env.PROD;

  return (
    <motion.aside
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'}
                  h-screen w-40 lg:w-48 xl:w-60 hidden lg:flex items-center justify-center p-4 z-10`}
    >
      <div ref={adRef} className="w-full h-auto">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-6936468170635504"
          data-ad-slot={adSlot}
          data-ad-format="vertical"
          data-full-width-responsive="false"
          data-adtest={isProd ? 'off' : 'on'}
        />
      </div>
    </motion.aside>
  );
}
