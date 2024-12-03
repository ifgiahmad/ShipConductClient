import api from "@/lib/api";
import { MsVessel, MsVesselType } from "@/lib/types/Master.types";
import { MsShipSection } from "@/lib/types/MsShipSection.types";

export const getMsVessel = async (): Promise<MsVessel[]> => {
  const response = await api.get<MsVessel[]>("api/master/getVessel");
  return response.data;
};

export const getMsVesselType = async (): Promise<MsVesselType[]> => {
  const response = await api.get<MsVesselType[]>("api/master/getVesselType");
  return response.data;
};
