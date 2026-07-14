/**
 * 헌혈 기록 타입
 */

export type DonationType =
    | "WHOLE_BLOOD"
    | "PLASMA"
    | "PLATELET"
    | "PLATELET_PLASMA";

// 헌혈 기록
export interface Donation {
    id: number;
    donationDate: string;
    donationType: DonationType;
    donationTypeName: string;
    bloodCenterId: number | null;
    placeName: string;
    memo: string | null;
}

// 등록/수정 요청
export interface DonationRequest {
    donationDate: string;
    donationType: DonationType;
    bloodCenterId: number | null;
    placeName?: string | null;
    memo?: string | null;
}

// 가능일 계산 결과
export interface DonationAvailability {
    type: DonationType;
    typeName: string;
    canDonate: boolean;
    availableDate: string;
    dDay : number;
    countThieYear: number;
    yearlyLimit: number;
    limitReached: boolean;
    reason: string | null;
}

// 요약
export interface DonationSummary {
    totalCount: number;
    lastDonationDate: string | null;
    lastDonationType: string | null;
}