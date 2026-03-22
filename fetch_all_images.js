import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

puppeteerExtra.use(StealthPlugin());

// 다운로드할 상품 목록: { 검색 키워드, 저장 파일명 }
const products = [
  // === 남성/공통 - 이미지 미연결 ===
  { query: '프리미엄 대용량 물티슈', filename: 'wettissue.png' },
  { query: '아로마 롤온 라벤더 오일', filename: 'aromaoil.png' },
  { query: '맥세이프 스마트폰 바닥형 그립톡', filename: 'griptok.png' },
  { query: '나그참파 인센스 스틱 홀더', filename: 'incense.png' },
  { query: '수면용 일회용 온열 안대', filename: 'eyemask.png' },
  { query: '초대형 U자 바디필로우', filename: 'bodypillow.png' },

  // === 남성 - 이미지 불일치 수정 ===
  { query: '텐가 에그 TENGA EGG', filename: 'tengaegg.png' },

  // === 여성 전용 - 이미지 미연결 ===
  { query: '홈플래닛 미니 무선 마사지건', filename: 'massagegun.png' },
  { query: '닥터데이즈 마사지젤', filename: 'docgel.png' },
  { query: '디센느 스탠드 태블릿 거치대', filename: 'tabletstand.png' },
  { query: 'Y존 밸런스 케어 페미닌 티슈', filename: 'feminetissue.png' },
  { query: 'VANKYO 미니 빔 프로젝터', filename: 'projector.png' },
  { query: '우드윅 미니자 캔들', filename: 'candle.png' },
  { query: '입문용 안대 수면안대', filename: 'blindfold.png' },
  { query: '살냄새 매혹 고체향수', filename: 'solidperfume.png' },
  { query: '실크 새틴 슬립 파자마 원피스', filename: 'silkpajama.png' },
  { query: '해피스팀 아로마 온열 안대', filename: 'steameyemask.png' },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    let finalUrl = url;
    if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;

    const client = finalUrl.startsWith('https') ? https : http;
    client.get(finalUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  const browser = await puppeteerExtra.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const results = { success: [], failed: [] };
  console.log('=== 네이버 쇼핑 검색으로 상품 이미지 다운로드 ===\n');

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const filepath = path.join('public', 'images', product.filename);
    console.log(`[${i + 1}/${products.length}] ${product.query}`);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      // 네이버 쇼핑 검색
      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(product.query)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));

      // 첫 번째 상품 이미지 추출
      const imageUrl = await page.evaluate(() => {
        // 네이버 쇼핑 상품 이미지 셀렉터
        const selectors = [
          '.product_img_area__cUrfY img',
          '.product_img__3KXAC',
          '.thumbnail_thumb__Bxb6Z img',
          '.basicList_img_area__uKMTp img',
          'a.thumbnail_anchor__T5rRb img',
          '.product_list img',
        ];
        for (const sel of selectors) {
          const img = document.querySelector(sel);
          if (img) {
            return img.src || img.dataset.src || img.getAttribute('data-lazy-src');
          }
        }
        // 폴백: 큰 이미지 찾기
        const imgs = Array.from(document.querySelectorAll('img'));
        for (const img of imgs) {
          if (img.src && img.naturalWidth > 100 && !img.src.includes('logo') && !img.src.includes('static') && img.src.includes('shopping')) {
            return img.src;
          }
        }
        return null;
      });

      await page.close();

      if (!imageUrl) {
        console.log('  ❌ 이미지를 찾을 수 없음');
        results.failed.push(product);
        continue;
      }

      // 네이버 이미지 URL에서 리사이즈 파라미터 제거 (원본 크기로)
      let cleanUrl = imageUrl.replace(/\?.*$/, '');
      if (cleanUrl.startsWith('//')) cleanUrl = 'https:' + cleanUrl;

      console.log(`  이미지: ${cleanUrl.substring(0, 80)}...`);
      await downloadImage(cleanUrl, filepath);
      console.log(`  ✅ 저장: ${filepath}`);
      results.success.push(product);

      // 딜레이
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    } catch (err) {
      console.log(`  ❌ 실패: ${err.message}`);
      results.failed.push(product);
    }
  }

  await browser.close();

  console.log('\n========== 결과 요약 ==========');
  console.log(`✅ 성공: ${results.success.length}개`);
  console.log(`❌ 실패: ${results.failed.length}개`);
  if (results.failed.length > 0) {
    console.log('\n실패 목록:');
    results.failed.forEach(p => console.log(`  - ${p.query} (${p.filename})`));
  }
})();
