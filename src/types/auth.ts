/**
 * 인증 관련 타입 정의
 */

// 회원가입 요청
export interface SignupRequest {
    username: string;
    password: string;
    email: string;
    name: string;
}

// 로그인 요청
export interface LoginRequest {
    username: string;
    password: string;
}

// 로그인 응답 (JWT)
export interface LoginResponse {
    accessTokem: string;
    refreshToken: string;
    mustChangePassword: boolean;
}

/**
 * 내 정보 조회 응답 ( 로그인한 사용자 정보)
 */
export interface MeResponse {
    id: string;
    username: string;
    name: string;
    email: string | null;   // 소셜 로그인 사용자는 이메일이 없을 수 있어서 null
    roles: string[];
}


// 소셜 로그인 provider
export type OAuthProvider = "KAKAO" | "GOOGLE" | "NAVER";
