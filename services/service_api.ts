import api from "@/lib/api";
import { MsAssessmentCategory } from "@/lib/types/MsAssessmentCategory.types";
import { AxiosResponse } from "axios";

// Fungsi untuk mengambil semua item
export const getMsAssessmentCategory = async (): Promise<
  MsAssessmentCategory[]
> => {
  const response = await api.get<MsAssessmentCategory[]>(
    "api/assessmentCategory/getAssessmentCategory"
  );
  return response.data;
};

export const getMsAssessmentCategoryByVslType = async (
  vslType: string
): Promise<MsAssessmentCategory[]> => {
  const response = await api.get<MsAssessmentCategory[]>(
    `api/assessmentCategory/getAssessmentCategoryByVslType?vslType=${vslType}`
  );
  return response.data;
};

export const getMsAssessmentCategoryById = async (
  id: number
): Promise<MsAssessmentCategory> => {
  const response = await api.get<MsAssessmentCategory>(
    `api/assessmentCategory/getAssessmentCategoryById?Id=${id}`
  );
  return response.data;
};

export const saveMsAssessmentCategory = async (
  item: Partial<MsAssessmentCategory>
): Promise<AxiosResponse<MsAssessmentCategory>> => {
  try {
    const response = await api.post<MsAssessmentCategory>(
      `api/assessmentCategory/saveAssessmentCategory`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving assessment category:", error);
    throw error;
  }
};
