import axios from "axios";

/**
 * 백엔드 API를 호출하기 위한 axios 인스턴스
 * baseURL을 한 번 정해두면, 이후 호출시 경로만 사용
 *
 */

const api = axios.create({
    baseURL: "http://localhost:8082",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * 요청 인터센터: 모든 요청에 JWU 토큰을 자동으로 붙임
 * 로그인 후 저장해둔 accessToken이 있을 시 Authorization 헤더에 담음
 * -> 매 요청마다 직접 헤더에 넣지 않아도 됨
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;