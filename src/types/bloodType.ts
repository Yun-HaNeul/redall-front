/**
 * 혈액형 타입
 */

export type BloodType = "A" | "B" | "O" | "AB";
export type RhType = "POSITIVE" | "NEGATIVE";

export interface BloodTypeInsight {
    bloodType: string;
    rhType: string;
    displayName: string;
    ratio: number;
    donationCount: number;
    isRare: boolean;
    message: string;
}

/**
 * 혈액형 분포 (전체)
 */
export interface BloodTypeStat {
    bloodType: string;
    rhType: string;
    displayName: string;
    donationCount: number;
    ratio: number;
}