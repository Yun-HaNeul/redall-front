import type {BloodType, BloodTypeInsight, RhType} from "../types/bloodType.ts";
import api from "./axios.ts";

/**
 * 혈액형 등록/수정
 * @param bloodType
 * @param rhType
 */
export const updateBloodType = (bloodType: BloodType, rhType: RhType) => {
    return api.put("/api/blood-type", { bloodType, rhType });
};

/**
 * 내 혈액형 인사이트 (미등록이면 204 -> 빈 응답)
 */
export const getBloodTypeInsight = () => {
    return api.get<BloodTypeInsight>("/api/blood-type/insight");
};