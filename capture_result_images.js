import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

puppeteerExtra.use(StealthPlugin());

// 16가지 유형
const types = [
  'VSAT', 'VSAN', 'VSRT', 'VSRN',
  'VMAT', 'VMAN', 'VMRT', 'VMRN',
  'FSAT', 'FSAN', 'FSRT', 'FSRN',
  'FMAT', 'FMAN', 'FMRT', 'FMRN'
];

// 배포된 사이트 URL (또는 로컬: http://localhost:5173)
const BASE_URL = 'https://bam-bti.vercel.app';

(async () => {
  console.log('🎨 결과 화면 스크린샷 캡처 시작...\n');

  const browser = await puppeteerExtra.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const outputDir = path.join('public', 'images', 'shares_captured');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    console.log(`[${i + 1}/${types.length}] ${type} 캡처 중...`);

    try {
      const page = await browser.newPage();

      // 뷰포트 설정 (모바일 크기)
      await page.setViewport({
        width: 640,
        height: 1200,
        deviceScaleFactor: 2  // Retina 해상도
      });

      // 결과 페이지로 이동
      const url = `${BASE_URL}/?type=${type}`;
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 결과 카드가 로딩될 때까지 대기
      await page.waitForSelector('.neon-border', { timeout: 10000 });

      // 애니메이션 완료 대기
      await new Promise(r => setTimeout(r, 3000));

      // 결과 카드 요소 찾기
      const element = await page.$('.neon-border');

      if (!element) {
        console.log(`  ❌ 결과 카드를 찾을 수 없음`);
        failCount++;
        await page.close();
        continue;
      }

      // 스크린샷 캡처
      const outputPath = path.join(outputDir, `${type}.png`);
      await element.screenshot({
        path: outputPath,
        type: 'png',
      });

      console.log(`  ✅ 저장 완료: ${outputPath}`);
      successCount++;

      await page.close();

      // 딜레이 (서버 부하 방지)
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.log(`  ❌ 실패: ${err.message}`);
      failCount++;
    }
  }

  await browser.close();

  console.log('\n========== 결과 요약 ==========');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log(`\n📁 출력 위치: ${outputDir}`);
  console.log(`\n💡 확인 후 만족스러우면:`);
  console.log(`   mv ${outputDir}/* public/images/shares/`);
})();
