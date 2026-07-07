/**
 * 인증 관련 유틸 함수
 * localStorage 의 JWT를 다루는 로직을 한 곳에 모음
 */
// 로그인 여부 확인
export const isLoggedIn = (): boolean => {
    return !!localStorage.getItem("accessToken");
};

// 토큰 저장
export const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

// 로그아웃 (토큰 삭제)
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}