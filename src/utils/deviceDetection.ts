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
