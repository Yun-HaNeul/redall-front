/**
 * 헌혈 통계 타입
 */

// 전국 요약 (물방울 + 요약카드)
export interface StatisticSummary {
    year: number;
    donationRate: number;
    donationCount: number;
    popultaion: number;
    previousCount: number | null;
    changePercent: number | null;
}

// 연도별 추이
export interface YearlyStatistic {
    year: number;
    donationRate: number;
    donationCount: number;
}

// 지역별 통계 (순위 + 상세)
export interface RegionStatistic {
    region: string;
    year: number;
    donationCount: number;
    donationRate: number;
    population: number;
}