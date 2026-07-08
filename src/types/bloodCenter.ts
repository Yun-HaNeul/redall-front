/**
 * 헌혈의 집 타입
 */
export interface BloodCenter {
    id: number;
    bloodBankName: string;
    name: string;
    code: string;
    address: string;
    tel: string;
    lat: number;
    lon: number;
}

// 주변 검색 결과 (거리 포함)
export interface BloodCenterNearby extends BloodCenter {
    distanceKm: number;
}