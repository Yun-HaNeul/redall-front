import api from "./axios.ts";
import type {Donation, DonationAvailability, DonationRequest, DonationSummary} from "../types/donation.ts";

// 내 헌혈 기록 목록
export const getMyDonations = () => {
    return api.get<Donation[]>("/api/donations");
};

// 등록
export const createDonation = (data: DonationRequest) => {
    return api.post<Donation>("/api/donations", data);
};

// 수정
export const updateDonation = (id: number, data: DonationRequest) => {
    return api.put<Donation>(`/api/donations/${id}`, data);
};

// 삭제
export const deleteDonation = (id: number) => {
    return api.delete(`/api/donations/${id}`);
};

// 가능일 계산
export const getAvailability = () => {
    return api.get<DonationAvailability[]>("/api/donations/availability");
}

// 요약
export const getDonationSummary = () => {
    return api.get<DonationSummary>("/api/donations/summary")
}