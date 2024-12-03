import api from "@/lib/api";
import { MsItem } from "@/lib/types/MsItem.types";
import { AxiosResponse } from "axios";

export const getMsItem = async (): Promise<MsItem[]> => {
  const response = await api.get<MsItem[]>("api/itemForCrew/getitem");
  return response.data;
};

export const getMsItemById = async (id: number): Promise<MsItem> => {
  const response = await api.get<MsItem>(
    `api/itemForCrew/getitemById?Id=${id}`
  );
  return response.data;
};

export const getMsItemByCodeNameItem = async (
  itemCode: string,
  itemName: string
): Promise<MsItem> => {
  const encodedItemCode = encodeURIComponent(itemCode);
  const encodedItemName = encodeURIComponent(itemName);
  const response = await api.get<MsItem>(
    `api/itemForCrew/getItemByCodeNameItem?itemCode=${encodedItemCode}&itemName=${encodedItemName}`
  );
  return response.data;
};
