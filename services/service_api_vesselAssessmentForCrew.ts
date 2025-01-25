import api from "@/lib/api";
import { TrVesselAssessment } from "@/lib/types/TrVesselAssessment.types";
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import { AxiosResponse } from "axios";
import heic2any from "heic2any";

interface SaveVesselAssessmentResponse {
  returnId: any;
  status: number;
  data: {
    returnId: number;
  };
}

export const getTrVesselAssessmentDetailForCrew = async (
  id: number
): Promise<TrVesselAssessmentDetail[]> => {
  const response = await api.get<TrVesselAssessmentDetail[]>(
    `api/vesselAssessmentForCrew/GetVesselAssessmentDetail?Id=${id}`
  );
  return response.data;
};

export const getTrVesselAssessmentDetailByIdForCrew = async (
  id: number
): Promise<TrVesselAssessmentDetail> => {
  const response = await api.get<TrVesselAssessmentDetail>(
    `api/vesselAssessmentForCrew/getVesselAssessmentDetailById?Id=${id}`
  );
  return response.data;
};

export const saveTrVesselAssessmentDetailForCrew = async (
  item: Partial<TrVesselAssessmentDetail>
): Promise<AxiosResponse<TrVesselAssessmentDetail>> => {
  try {
    console.log(item);
    const response = await api.post<TrVesselAssessmentDetail>(
      `api/vesselAssessmentForCrew/saveVesselAssessmentDetail`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Assessment Detail:", error);
    throw error;
  }
};

export const uploadPhotoForCrew = async (
  item: Partial<TrVesselAssessmentDetail>
): Promise<AxiosResponse<TrVesselAssessmentDetail>> => {
  const formData = new FormData();

  /*  if (item.photo) formData.append("file", item.photo); */

  if (item.photo) {
    const file = item.photo as File;
    if (
      file.type === "image/heic" ||
      file.name.endsWith(".heic") ||
      file.name.endsWith(".HEIC")
    ) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });

        const convertedFile = new File(
          [convertedBlob as Blob],
          file.name.replace(/\.heic$/, ".jpg"),
          { type: "image/jpeg" }
        );

        formData.append("file", convertedFile);
      } catch (error) {
        console.error("Error converting HEIC to JPEG:", error);
        throw new Error("Failed to convert HEIC file to JPEG.");
      }
    } else {
      formData.append("file", file);
      console.log(file);
      console.log("ayay");
    }
  }

  if (item.id) formData.append("id", item.id.toString());
  if (item.photoDescription)
    formData.append("photoDescription", item.photoDescription.toString());
  console.log(formData);

  try {
    const response = await api.post(
      `api/vesselAssessmentForCrew/savephoto`,
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

export const getTrVesselAssessmentByLinkForCrew = async (
  link: string
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessmentForCrew/getVesselAssessmentByLink?Link=${link}`
  );
  return response.data;
};

export const getPreviousLastVesselAssessmentByVslCodeForCrew = async (
  vslCode: string
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessmentForCrew/getPreviousLastVesselAssessmentByVslCode?vslCode=${vslCode}`
  );
  return response.data;
};

export const getPreviousVesselAssessmentDetailLowForCrew = async (
  id: number
): Promise<TrVesselAssessmentDetail[]> => {
  const response = await api.get<TrVesselAssessmentDetail[]>(
    `api/vesselAssessmentForCrew/getPreviousVesselAssessmentDetailLow?Id=${id}`
  );
  return response.data;
};

export const saveTrVesselAssessmentForCrew = async (
  item: Partial<TrVesselAssessment>
): Promise<AxiosResponse<SaveVesselAssessmentResponse>> => {
  try {
    console.log(item);
    const response = await api.post<SaveVesselAssessmentResponse>(
      `api/vesselAssessmentForCrew/saveVesselAssessment`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Assessment:", error);
    throw error;
  }
};
