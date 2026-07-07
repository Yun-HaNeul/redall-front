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

// 소셜 로그인 provider
export type OAuthProvider = "KAKAO" | "GOOGLE" | "NAVER";