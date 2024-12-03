import api from "@/lib/api";
import { TrVesselDrillDetail } from "@/lib/types/TrVesselDrillDetail.types";
import { AxiosResponse } from "axios";

export const getTrVesselDrillDetail = async (
  id: number
): Promise<TrVesselDrillDetail[]> => {
  const response = await api.get<TrVesselDrillDetail[]>(
    `api/vesselDrill/GetVesselDrillDetail?Id=${id}`
  );
  return response.data;
};

export const getTrVesselDrillDetailById = async (
  id: number
): Promise<TrVesselDrillDetail> => {
  const response = await api.get<TrVesselDrillDetail>(
    `api/vesselDrill/getVesselDrillDetailById?Id=${id}`
  );
  return response.data;
};

export const saveTrVesselDrillDetail = async (
  item: Partial<TrVesselDrillDetail>
): Promise<AxiosResponse<TrVesselDrillDetail>> => {
  try {
    console.log(item);
    const response = await api.post<TrVesselDrillDetail>(
      `api/vesselDrill/saveVesselDrillDetail`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Drill Detail:", error);
    throw error;
  }
};

export const uploadVideo = async (
  item: Partial<TrVesselDrillDetail>
): Promise<AxiosResponse<TrVesselDrillDetail>> => {
  const formData = new FormData();

  if (item.video) formData.append("file", item.video);
  if (item.id) formData.append("id", item.id.toString());
  if (item.videoDescription)
    formData.append("videoDescription", item.videoDescription.toString());
  console.log(formData);

  try {
    const response = await api.post(`api/VesselDrill/savevideo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
