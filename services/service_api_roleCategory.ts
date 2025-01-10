import api from "@/lib/api";
import { MsRoleCategory } from "@/lib/types/MsRoleCategory.types";
import { AxiosResponse } from "axios";

export const getMsRoleCategory = async (): Promise<MsRoleCategory[]> => {
  const response = await api.get<MsRoleCategory[]>(
    "api/RoleCategory/getRoleCategory"
  );
  return response.data;
};

export const getMsRoleCategoryById = async (
  id: number
): Promise<MsRoleCategory> => {
  const response = await api.get<MsRoleCategory>(
    `api/RoleCategory/getRoleCategoryById?Id=${id}`
  );
  return response.data;
};

export const saveMsRoleCategory = async (
  item: Partial<MsRoleCategory>
): Promise<AxiosResponse<MsRoleCategory>> => {
  try {
    const response = await api.post<MsRoleCategory>(
      `api/RoleCategory/saveRoleCategory`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving assessment category:", error);
    throw error;
  }
};
