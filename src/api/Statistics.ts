import api from "./axios.ts";
import type {RegionStatistic, StatisticSummary, YearlyStatistic} from "../types/statistics.ts";
import type {BloodTypeStat} from "../types/bloodType.ts";

// 전국 요약
export const getSummary = () => {
    return api.get<StatisticSummary>("/api/statistics/summary");
};

// 연도별 추이
export const getYearlyTrend = () => {
    return api.get<YearlyStatistic>("/api/statistics/yearly");
};

// 지역별 순위
export const getRegionRanking = (year: number) => {
    return api.get<RegionStatistic[]>("/api/statistics/regions", {
        params: { year },
    });
};

// 지역 상세
export const getRegionDeatil = (region: string) => {
    return api.get<RegionStatistic[]>(`/api/statistics/region/${region}`);
};

// 혈액형별 분포
export const getBloodTypeDistribution = () => {
    return api.get<BloodTypeStat[]>("/api/statistics/blood-types");
}

