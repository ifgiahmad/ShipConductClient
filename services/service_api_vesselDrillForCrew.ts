import api from "@/lib/api";
import { TrVesselDrill } from "@/lib/types/TrVesselDrill.types";
import { TrVesselDrillDetail } from "@/lib/types/TrVesselDrillDetail.types";
import { AxiosProgressEvent, AxiosResponse } from "axios";

interface SaveVesselDrillResponse {
  returnId: any;
  status: number;
  data: {
    returnId: number;
  };
}

export const getTrVesselDrillDetailForCrew = async (
  id: number
): Promise<TrVesselDrillDetail[]> => {
  const response = await api.get<TrVesselDrillDetail[]>(
    `api/vesselDrillForCrew/GetVesselDrillDetail?Id=${id}`
  );
  return response.data;
};

export const getTrVesselDrillDetailByIdForCrew = async (
  id: number
): Promise<TrVesselDrillDetail> => {
  const response = await api.get<TrVesselDrillDetail>(
    `api/vesselDrillForCrew/getVesselDrillDetailById?Id=${id}`
  );
  return response.data;
};

export const saveTrVesselDrillDetailForCrew = async (
  item: Partial<TrVesselDrillDetail>
): Promise<AxiosResponse<TrVesselDrillDetail>> => {
  try {
    console.log(item);
    const response = await api.post<TrVesselDrillDetail>(
      `api/vesselDrillForCrew/saveVesselDrillDetail`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Drill Detail:", error);
    throw error;
  }
};

/* export const uploadVideoForCrew = async (
  item: Partial<TrVesselDrillDetail>
): Promise<AxiosResponse<TrVesselDrillDetail>> => {
  const formData = new FormData();

  if (item.video) formData.append("file", item.video);
  if (item.doc) formData.append("doc", item.doc);
  if (item.id) formData.append("id", item.id.toString());
  if (item.videoDescription)
    formData.append("videoDescription", item.videoDescription.toString());
  console.log(formData);
  try {
    const response = await api.post(
      `api/vesselDrillForCrew/saveVideo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}; */

/* export const uploadVideoForCrew = async (
  item: Partial<TrVesselDrillDetail>,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<TrVesselDrillDetail>> => {
  const formData = new FormData();
  console.log(item);
  if (item.video) formData.append("file", item.video);
  if (item.doc) formData.append("doc", item.doc);
  if (item.doc2) formData.append("doc2", item.doc2);
  if (item.doc3) formData.append("doc3", item.doc3);
  if (item.doc4) formData.append("doc4", item.doc4);
  if (item.doc5) formData.append("doc5", item.doc5);
  if (item.id) formData.append("id", item.id.toString());
  if (item.videoDescription)
    formData.append("videoDescription", item.videoDescription.toString());

  try {
    console.log(formData);
    const response = await api.post(
      `api/vesselDrillForCrew/saveVideo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress, // <= tambahkan ini
      }
    );
    return response;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}; */

export const uploadVideoForCrew = async (
  item: Partial<TrVesselDrillDetail>,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<AxiosResponse<TrVesselDrillDetail>> => {
  const formData = new FormData();

  // Append file and other fields to FormData
  if (item.video) formData.append("file", item.video);
  if (item.doc) formData.append("doc", item.doc);
  if (item.doc2) formData.append("doc2", item.doc2);
  if (item.doc3) formData.append("doc3", item.doc3);
  if (item.doc4) formData.append("doc4", item.doc4);
  if (item.doc5) formData.append("doc5", item.doc5);
  if (item.id) formData.append("id", item.id.toString());
  if (item.videoDescription)
    formData.append("videoDescription", item.videoDescription.toString());

  // Optional: log form data for debugging
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}:`, value);
  // }

  try {
    const response = await api.post<TrVesselDrillDetail>(
      "api/vesselDrillForCrew/saveVideo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );

    return response;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

export const getTrVesselDrillByLinkForCrew = async (
  link: string
): Promise<TrVesselDrill> => {
  const response = await api.get<TrVesselDrill>(
    `api/vesselDrillForCrew/getVesselDrillByLink?Link=${link}`
  );
  return response.data;
};

export const saveTrVesselDrillForCrew = async (
  item: Partial<TrVesselDrill>
): Promise<AxiosResponse<SaveVesselDrillResponse>> => {
  try {
    console.log(item);
    const response = await api.post<SaveVesselDrillResponse>(
      `api/vesselDrillForCrew/saveVesselDrill`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Drill:", error);
    throw error;
  }
};

export const getPreviousLastVesselDrillByVslCodeForCrew = async (
  vslCode: string
): Promise<TrVesselDrill> => {
  const response = await api.get<TrVesselDrill>(
    `api/vesselDrillForCrew/getPreviousLastVesselDrillByVslCode?vslCode=${vslCode}`
  );
  return response.data;
};
