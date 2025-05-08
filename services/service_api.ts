import api from "@/lib/api";
import { MsAssessmentCategory } from "@/lib/types/MsAssessmentCategory.types";
import { ResultDTO } from "@/lib/types/Results.types";
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
): Promise<ResultDTO> => {
  try {
    const response = await api.post<ResultDTO>(
      "api/assessmentCategory/saveAssessmentCategory",
      item
    );
    console.log(response);
    if (response.data.status === "OK") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to save item");
    }
  } catch (error) {
    console.error("Error saving item:", error);
    throw error;
  }
};

/* export const saveMsAssessmentCategory = async (
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
}; */

export const uploadPhoto = async (
  item: Partial<MsAssessmentCategory>
): Promise<AxiosResponse<MsAssessmentCategory>> => {
  const formData = new FormData();

  if (item.photo) formData.append("file", item.photo);
  if (item.id) formData.append("id", item.id.toString());

  try {
    const response = await api.post(
      `api/assessmentCategory/savePhotoAssesssmentCategory`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};
