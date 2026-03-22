import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GoogleAdBannerProps {
  adSlot: string;
}

export default function GoogleAdBanner({ adSlot }: GoogleAdBannerProps) {
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) return;

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle;
        if (adsbygoogle) {
          adsbygoogle.push({});
          isAdLoaded.current = true;
        }
      }
    } catch (err) {
      console.error('AdSense Banner load error:', err);
    }
  }, []);

  const isProd = import.meta.env.PROD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.7 }}
      className="w-full max-w-2xl mx-auto mt-6 mb-8"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6936468170635504"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest={isProd ? 'off' : 'on'}
      />
    </motion.div>
  );
}
