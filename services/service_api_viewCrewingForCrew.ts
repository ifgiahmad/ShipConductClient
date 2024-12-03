import api from "@/lib/api";
import { AxiosResponse } from "axios";

export const getVesselCrew = async (
  idPelaut: string,
  ktp: string
): Promise<string> => {
  const response = await api.get<string>(
    `api/viewCrewing/getVesselCrew?idPelaut=${idPelaut}&ktp=${ktp}`
  );
  return response.data;
};
