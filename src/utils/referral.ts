const VISITOR_ID_KEY = 'bambti_visitor_id';
const REFERRER_ID_KEY = 'bambti_referrer_id';
const REFERRAL_TRACKED_KEY = 'bambti_referral_tracked';

let inMemoryVisitorId: string | null = null;
let inMemoryReferrerId: string | null = null;

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  try {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => chars[b % chars.length]).join('');
  } catch {
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    if (!inMemoryVisitorId) {
      inMemoryVisitorId = generateId();
    }
    return inMemoryVisitorId;
  }
}

/** URL의 ref 파라미터를 읽어 localStorage에 저장 (첫 터치 귀속) */
export function captureReferrer(): string | null {
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref');

  try {
    if (refParam && !localStorage.getItem(REFERRER_ID_KEY)) {
      localStorage.setItem(REFERRER_ID_KEY, refParam);
    }
    return localStorage.getItem(REFERRER_ID_KEY);
  } catch {
    if (refParam && !inMemoryReferrerId) {
      inMemoryReferrerId = refParam;
    }
    return inMemoryReferrerId;
  }
}

export function getReferrerId(): string | null {
  try {
    return localStorage.getItem(REFERRER_ID_KEY);
  } catch {
    return inMemoryReferrerId;
  }
}

/** referral_arrival 이벤트 중복 발생 방지 */
export function isReferralTracked(): boolean {
  try {
    return localStorage.getItem(REFERRAL_TRACKED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markReferralTracked(): void {
  try {
    localStorage.setItem(REFERRAL_TRACKED_KEY, 'true');
  } catch {
    // ignore
  }
}
