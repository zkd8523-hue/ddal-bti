import type { VercelRequest, VercelResponse } from '@vercel/node';

const typeData: Record<string, { title: string; emoji: string; subtitle: string }> = {
  VSAT: { title: '폭주기관차 토끼', emoji: '🐰', subtitle: '보고, 지르고, 실험하고 — 잠은 나중에' },
  VSAN: { title: '본능 저격수 여우', emoji: '🦊', subtitle: '직감이 곧 법이다, 손끝이 곧 무기다' },
  VSRT: { title: '명작 컬렉터 부엉이', emoji: '🦉', subtitle: '검증된 명작, 최신 장비, 완벽한 루틴' },
  VSRN: { title: '프로 효율러 고양이', emoji: '😼', subtitle: '화면 하나, 손 하나, 그걸로 충분하다' },
  VMAT: { title: '방구석 무드디렉터 베어', emoji: '🐻', subtitle: '세팅 1시간, 본게임 2시간, 후회 0시간' },
  VMAN: { title: '도파민 서퍼 미어캣', emoji: '🦦', subtitle: '고르는 재미가 반, 감상이 나머지 반' },
  VMRT: { title: '침대 위 미식가 펭귄', emoji: '🐧', subtitle: '같은 명작도 새 장비면 새 경험이니까' },
  VMRN: { title: '사골국 순정 판다', emoji: '🐼', subtitle: '조용히, 천천히, 나만의 속도로' },
  FSAT: { title: '풀착장 우주 퍼그', emoji: '🐶', subtitle: '상상은 빠르게, 실행은 더 빠르게' },
  FSAN: { title: '전두엽 풀악셀 치타', emoji: '🐆', subtitle: '머릿속 시나리오가 곧 최고의 콘텐츠' },
  FSRT: { title: '템빨 마법사 댕댕이', emoji: '🐕', subtitle: '뇌내 극장은 언제나 같은 명작을 상영 중' },
  FSRN: { title: '자연인 몽상가 나무늘보', emoji: '🦥', subtitle: '고요한 밤, 깊은 상상, 완벽한 루틴' },
  FMAT: { title: '세계관 창조주 고양이', emoji: '🐈', subtitle: '눈 감으면 펼쳐지는 나만의 대서사시' },
  FMAN: { title: '무한리필 몽상가 햄스터', emoji: '🐹', subtitle: '이야기의 끝이 보이지 않는 밤이 좋다' },
  FMRT: { title: '망상 끝판왕 사자', emoji: '🦁', subtitle: '매일 같은 판타지, 매일 같은 행복' },
  FMRN: { title: '슬로우 모션 거북이', emoji: '🐢', subtitle: '상상만으로 충분한 밤의 미니멀리스트' },
};

const SITE_URL = 'https://bam-bti.vercel.app';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const type = (typeof req.query.type === 'string' ? req.query.type : '').toUpperCase();
  const data = typeData[type];

  if (!data) {
    // 유효하지 않은 타입이면 메인 페이지로 리다이렉트
    res.redirect(302, SITE_URL);
    return;
  }

  const title = `[밤BTI] 나의 결과: ${data.title} ${data.emoji}`;
  const description = `"${data.subtitle}" — 숨기고 있을 뿐, 유형은 있어!`;
  const imageUrl = `${SITE_URL}/images/shares/${type}.png`;

  // ref, UTM 파라미터 패스스루 (바이럴 계수 추적용)
  const redirectParams = new URLSearchParams();
  redirectParams.set('type', type);
  const ref = typeof req.query.ref === 'string' ? req.query.ref : '';
  if (ref) redirectParams.set('ref', ref);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const val = typeof req.query[key] === 'string' ? req.query[key] : '';
    if (val) redirectParams.set(key, val as string);
  }
  const pageUrl = `${SITE_URL}/?${redirectParams.toString()}`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- 사용자 브라우저는 실제 결과 페이지로 리다이렉트 -->
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <p>리다이렉트 중입니다... <a href="${pageUrl}">여기를 클릭하세요</a></p>
  <script>window.location.replace("${pageUrl}");</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.status(200).send(html);
}
