import api from "@/lib/api";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { AxiosResponse } from "axios";

export const getMsInterval = async (): Promise<MsInterval[]> => {
  const response = await api.get<MsInterval[]>("api/interval/getinterval");
  return response.data;
};

export const getMsIntervalById = async (id: number): Promise<MsInterval> => {
  const response = await api.get<MsInterval>(
    `api/interval/getintervalById?Id=${id}`
  );
  return response.data;
};

export const saveMsInterval = async (
  item: Partial<MsInterval>
): Promise<AxiosResponse<MsInterval>> => {
  try {
    const response = await api.post<MsInterval>(
      `api/interval/saveinterval`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving assessment category:", error);
    throw error;
  }
};
