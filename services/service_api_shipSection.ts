import api from "@/lib/api";
import { MsShipSection } from "@/lib/types/MsShipSection.types";
import { AxiosResponse } from "axios";
export const getMsShipSection = async (): Promise<MsShipSection[]> => {
  const response = await api.get<MsShipSection[]>(
    "api/shipSection/getShipSection"
  );
  return response.data;
};

export const getMsShipSectionByVslType = async (
  vslType: string
): Promise<MsShipSection[]> => {
  const response = await api.get<MsShipSection[]>(
    `api/shipSection/getShipSectionByVslType?vslType=${vslType}`
  );
  return response.data;
};

export const getMsShipSectionById = async (
  id: number
): Promise<MsShipSection> => {
  const response = await api.get<MsShipSection>(
    `api/shipSection/getshipSectionById?Id=${id}`
  );
  return response.data;
};

export const saveMsShipSection = async (
  item: Partial<MsShipSection>
): Promise<AxiosResponse<MsShipSection>> => {
  try {
    const response = await api.post<MsShipSection>(
      `api/shipSection/saveshipSection`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving assessment category:", error);
    throw error;
  }
};
