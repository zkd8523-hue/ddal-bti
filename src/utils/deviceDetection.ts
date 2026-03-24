/**
 * iOS 기기 감지 (iPhone, iPad, iPod)
 * iOS 13+ iPad는 userAgent에서 "Mac"으로 표시되므로 터치 감지 추가
 */
export function isIOS(): boolean {
  const isIOSUserAgent = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isIPadOS = navigator.userAgent.includes('Mac') && 'ontouchend' in document;
  return isIOSUserAgent || isIPadOS;
}

/**
 * Web Share API 지원 여부 확인
 */
export function canUseWebShare(): boolean {
  return typeof navigator.share === 'function';
}

/**
 * 모바일 기기 감지
 */
export function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}

/**
 * Web Share API 파일 공유 지원 여부 확인
 * 모바일에서만 인스타 스토리 등으로 직접 공유 가능
 */
export function canShareFiles(): boolean {
  return isMobile() && typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
}

/**
 * data URL을 Blob으로 변환
 * Web Share API는 Blob/File 객체만 허용
 */
export function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
