import api from "./axios.ts";
import type {BloodCenter, BloodCenterNearby } from "../types/bloodCenter.ts";

// 좌표 있는 헌혈의 집 전체 조회 (지도 표시용)
export const getBloodCenter = () => {
    return api.get<BloodCenter[]>("/api/blood-centers");
};

// 주변 검색: 가까운 순 N개
export const getNearestBloodCenters = (lat: number, lon: number, limit = 10) => {
    return api.get<BloodCenterNearby[]>("/api/blood-centers/nearest", {
        params: { lat, lon, limit },
    });
};

// 주변 검색: 반경 이내 전부
export const getNearbyBloodCenters = (lat: number, lon: number, radius = 5) => {
    return api.get<BloodCenterNearby[]>("/api/blood-center/nearby", {
        params: { lat, lon, radius },
    });
};
