/**
 * 소셜 로그인 관련 상수
 *
 */

// ======= 카카오 =======
const KAKAO_CLIENT_ID = "3c913e71fd750998d5331fc4a1539eb4";
const KAKAO_REDIRECT_URI = "http://localhost:5173/oauth/kakao";

// 카카오 로그인 페이지 URL
export const KAKAO_AUTH_URL =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${KAKAO_CLIENT_ID}` +
    `&redirect_uri=${KAKAO_REDIRECT_URI}` +
    `&response_type=code`;

// ======= GOOGLE =======
const GOOGLE_CLIENT_ID = "379402678659-mtrfl7b5giqegmhlun0o16fdjog0mmfs.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = "http://localhost:5173/oauth/google";
const GOOGLE_SCOPE = "email profile";

export const GOOGLE_AUTH_URL =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(GOOGLE_SCOPE)}`;

// ======= NAVER =======
const NAVER_CLIENT_ID = "KqK5ZqsGji5nsTjJbfsp";
const NAVER_REDIRECT_URI = "http://localhost:5173/oauth/naver";
// 네이버는 CSRF 방지용 state 값이 필요하다 (임의 문자열)
export const NAVER_STATE = "redall_naver_state";

export const NAVER_AUTH_URL =
  `https://nid.naver.com/oauth2.0/authorize` +
  `?client_id=${NAVER_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}` +
  `&response_type=code` +
  `&state=${NAVER_STATE}`;