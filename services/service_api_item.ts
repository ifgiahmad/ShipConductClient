import api from "@/lib/api";
import { MsItem } from "@/lib/types/MsItem.types";
import { ResultDTO } from "@/lib/types/Results.types";
import { AxiosResponse } from "axios";

export const getMsItem = async (): Promise<MsItem[]> => {
  const response = await api.get<MsItem[]>("api/item/getItem");
  return response.data;
};

export const getMsItemById = async (id: number): Promise<MsItem> => {
  const response = await api.get<MsItem>(`api/item/getItemById?Id=${id}`);
  return response.data;
};

/* export const saveMsItem = async (
  item: Partial<MsItem>
): Promise<AxiosResponse<MsItem>> => {
  try {
    const response = await api.post<MsItem>(`api/item/saveItem`, item);
    return response;
  } catch (error) {
    console.error("Error saving item:", error);
    throw error;
  }
}; */

export const saveMsItem = async (item: Partial<MsItem>): Promise<ResultDTO> => {
  try {
    const response = await api.post<ResultDTO>("api/item/saveItem", item);
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

export const uploadPhoto = async (
  item: Partial<MsItem>
): Promise<AxiosResponse<MsItem>> => {
  const formData = new FormData();

  if (item.photo) formData.append("file", item.photo);
  if (item.id) formData.append("id", item.id.toString());

  try {
    const response = await api.post(`api/item/savePhoto`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};
