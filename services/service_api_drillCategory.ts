import api from "@/lib/api";
import { MsDrillCategory } from "@/lib/types/MsDrillCategory.types";
import { AxiosResponse } from "axios";

// Fungsi untuk mengambil semua item
export const getMsDrillCategory = async (): Promise<MsDrillCategory[]> => {
  const response = await api.get<MsDrillCategory[]>(
    "api/drillCategory/getDrillCategory"
  );
  return response.data;
};

export const getMsDrillCategoryByVslType = async (
  vslType: string
): Promise<MsDrillCategory[]> => {
  const response = await api.get<MsDrillCategory[]>(
    `api/drillCategory/getDrillCategoryByVslType?vslType=${vslType}`
  );
  return response.data;
};

export const getMsDrillCategoryById = async (
  id: number
): Promise<MsDrillCategory> => {
  const response = await api.get<MsDrillCategory>(
    `api/drillCategory/getDrillCategoryById?Id=${id}`
  );
  return response.data;
};

export const saveMsDrillCategory = async (
  item: Partial<MsDrillCategory>
): Promise<AxiosResponse<MsDrillCategory>> => {
  try {
    const response = await api.post<MsDrillCategory>(
      `api/drillCategory/saveDrillCategory`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Drill category:", error);
    throw error;
  }
};
