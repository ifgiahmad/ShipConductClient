import api from "@/lib/api";
import { MsCategorySection } from "@/lib/types/MsCategorySection";
import { AxiosResponse } from "axios";

export const getMsCategorySection = async (): Promise<MsCategorySection[]> => {
  const response = await api.get<MsCategorySection[]>(
    "api/CategorySection/getCategorySection"
  );
  return response.data;
};

export const getMsCategorySectionById = async (
  id: number
): Promise<MsCategorySection> => {
  const response = await api.get<MsCategorySection>(
    `api/CategorySection/getCategorySectionById?Id=${id}`
  );
  return response.data;
};

export const saveMsCategorySection = async (
  item: Partial<MsCategorySection>
): Promise<AxiosResponse<MsCategorySection>> => {
  try {
    const response = await api.post<MsCategorySection>(
      `api/CategorySection/saveCategorySection`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving assessment category:", error);
    throw error;
  }
};
