import api from "@/lib/api";
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import { VwAssessmentDetailCompare } from "@/lib/types/VwAssessmentDetailCompare";
import { AxiosResponse } from "axios";

export const getTrVesselAssessmentDetail = async (
  id: number
): Promise<TrVesselAssessmentDetail[]> => {
  const response = await api.get<TrVesselAssessmentDetail[]>(
    `api/vesselAssessment/GetVesselAssessmentDetail?Id=${id}`
  );
  return response.data;
};

export const getTrVesselAssessmentDetailById = async (
  id: number
): Promise<TrVesselAssessmentDetail> => {
  const response = await api.get<TrVesselAssessmentDetail>(
    `api/vesselAssessment/getVesselAssessmentDetailById?Id=${id}`
  );
  return response.data;
};

export const getPreviousTrVesselAssessmentDetail = async (
  id: number
): Promise<VwAssessmentDetailCompare> => {
  const response = await api.get<VwAssessmentDetailCompare>(
    `api/vesselAssessment/getPreviousVesselAssessmentDetailById?Id=${id}`
  );
  return response.data;
};

export const saveTrVesselAssessmentDetail = async (
  item: Partial<TrVesselAssessmentDetail>
): Promise<AxiosResponse<TrVesselAssessmentDetail>> => {
  try {
    console.log(item);
    const response = await api.post<TrVesselAssessmentDetail>(
      `api/vesselAssessment/saveVesselAssessmentDetail`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Assessment Detail:", error);
    throw error;
  }
};

export const uploadPhoto = async (
  item: Partial<TrVesselAssessmentDetail>
): Promise<AxiosResponse<TrVesselAssessmentDetail>> => {
  const formData = new FormData();
  if (item.photo) formData.append("file", item.photo);
  if (item.photo2) formData.append("file2", item.photo2);
  if (item.photo3) formData.append("file3", item.photo3);
  if (item.id) formData.append("id", item.id.toString());
  if (item.photoDescription)
    formData.append("photoDescription", item.photoDescription.toString());
  console.log(formData);

  try {
    const response = await api.post(
      `api/vesselAssessment/savephoto`,
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
