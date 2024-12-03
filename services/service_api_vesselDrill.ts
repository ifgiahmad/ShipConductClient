import api from "@/lib/api";
import { TrVesselDrill } from "@/lib/types/TrVesselDrill.types";
import { AxiosResponse } from "axios";

interface SaveVesselDrillResponse {
  returnId: any;
  status: number;
  data: {
    returnId: number;
  };
}

export const getTrVesselDrill = async (): Promise<TrVesselDrill[]> => {
  const response = await api.get<TrVesselDrill[]>(
    "api/VesselDrill/getVesselDrill"
  );
  return response.data;
};

export const getTrVesselDrillById = async (
  id: number
): Promise<TrVesselDrill> => {
  const response = await api.get<TrVesselDrill>(
    `api/VesselDrill/getVesselDrillById?Id=${id}`
  );
  return response.data;
};

export const getTrVesselDrillByLink = async (
  link: string
): Promise<TrVesselDrill> => {
  const response = await api.get<TrVesselDrill>(
    `api/VesselDrill/getVesselDrillByLink?Link=${link}`
  );
  return response.data;
};

export const saveTrVesselDrill = async (
  item: Partial<TrVesselDrill>
): Promise<AxiosResponse<SaveVesselDrillResponse>> => {
  try {
    console.log(item);
    const response = await api.post<SaveVesselDrillResponse>(
      `api/VesselDrill/saveVesselDrill`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Assessment:", error);
    throw error;
  }
};
