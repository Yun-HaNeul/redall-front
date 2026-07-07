import type {LoginRequest, LoginResponse, OAuthProvider, SignupRequest} from "../types/auth.ts";
import api from "./axios.ts";

/**
 * 인증 관련 API 함수 모음
 *
 */
// 회원가입
export const signup = (data: SignupRequest) => {
    return api.post("/api/auth/signup", data);
};

// 로그인 -> JWT 응답
export const login = (data: LoginRequest) => {
    return api.post<LoginResponse>("/api/auth/login", data);
}

// 소셜 로그인
export const oauthLogin = (provider: OAuthProvider, accessToken: string) => {
    return api.post<LoginResponse>("/api/auth/oauth/login", {
        provider,
        accessToken,
    });
};

// 카카오 리다이렉트 로그인 (인가 코드 전달)
export const kakaoLogin = (code: string) => {
    return api.post<LoginResponse>("/api/auth/oauth/kakao", { code });
}

//  구글 리다이렉트 로그인 (인가 코드 전달)
export const googleLogin = (code: string) => {
    return api.post<LoginResponse>("/api/auth/oauth/google", { code });
}

// 네이버 리다이렉트 로그인 (state 필요)
export const naverLogin = (code: string, state: string) => {
    return api.post<LoginResponse>("/api/auth/oauth/naver", { code, state })
}

// 비밀번호 찾기 (임시 비번 발급)
export const resetPassword = (email: string) => {
    return api.post("/api/auth/password/reset", {email});
};