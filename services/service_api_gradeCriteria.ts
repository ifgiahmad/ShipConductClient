import api from "@/lib/api";
import { MsGradeCriteria } from "@/lib/types/MsGradeCriteria.types";
import { AxiosResponse } from "axios";

export const getMsGradeCriteria = async (): Promise<MsGradeCriteria[]> => {
  const response = await api.get<MsGradeCriteria[]>(
    "api/gradeCriteria/getGradeCriteria"
  );
  return response.data;
};

export const getMsGradeCriteriaById = async (
  id: number
): Promise<MsGradeCriteria> => {
  const response = await api.get<MsGradeCriteria>(
    `api/gradeCriteria/getGradeCriteriaById?Id=${id}`
  );
  return response.data;
};

export const getMsGradeCriteriaByGrade = async (
  grade: number,
  categorySection: string
): Promise<MsGradeCriteria[]> => {
  const encodedShipSection = encodeURIComponent(categorySection);
  const response = await api.get<MsGradeCriteria[]>(
    `api/gradeCriteria/getGradeCriteriaByGrade?grade=${grade}&categorySection=${encodedShipSection}`
  );
  return response.data;
};

export const saveMsGradeCriteria = async (
  item: Partial<MsGradeCriteria>
): Promise<AxiosResponse<MsGradeCriteria>> => {
  try {
    const response = await api.post<MsGradeCriteria>(
      `api/gradeCriteria/saveGradeCriteria`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving assessment category:", error);
    throw error;
  }
};
