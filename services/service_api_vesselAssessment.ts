import api from "@/lib/api";
import { TrVesselAssessment } from "@/lib/types/TrVesselAssessment.types";
import { AxiosResponse } from "axios";

interface SaveVesselAssessmentResponse {
  returnId: any;
  status: number;
  data: {
    returnId: number;
  };
}

export const getTrVesselAssessment = async (): Promise<
  TrVesselAssessment[]
> => {
  const response = await api.get<TrVesselAssessment[]>(
    "api/vesselAssessment/getVesselAssessment"
  );
  return response.data;
};

export const getTrVesselAssessmentById = async (
  id: number
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessment/getVesselAssessmentById?Id=${id}`
  );
  return response.data;
};

export const getTrVesselAssessmentByLink = async (
  link: string
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessment/getVesselAssessmentByLink?Link=${link}`
  );
  return response.data;
};

export const getTrVesselAssessmentByNameAndPeriod = async (
  vslName: string,
  month: number,
  year: number
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessment/getVesselAssessmentByNameAndPeriod?vslName=${vslName}&month=${month}&year=${year}`
  );
  return response.data;
};

export const saveTrVesselAssessment = async (
  item: Partial<TrVesselAssessment>
): Promise<AxiosResponse<SaveVesselAssessmentResponse>> => {
  try {
    console.log(item);
    const response = await api.post<SaveVesselAssessmentResponse>(
      `api/vesselAssessment/saveVesselAssessment`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Assessment:", error);
    throw error;
  }
};
