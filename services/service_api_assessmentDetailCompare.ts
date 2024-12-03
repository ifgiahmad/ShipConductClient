import api from "@/lib/api";
import {
  AssessmentDetailCompareGroupByItem,
  VwAssessmentDetailCompare,
} from "@/lib/types/VwAssessmentDetailCompare";

/* export const getAssessmentDetailCompareByVslCode = async (
  vslCode: string
): Promise<AssessmentDetailCompareGroupByItem[]> => {
  const response = await api.get<AssessmentDetailCompareGroupByItem[]>(
    `api/assessmentDetailCompare/getAssessmentDetailCompareByVslCode?vslCode=${vslCode}`
  );
  return response.data;
}; */

export const getAssessmentDetailCompareByVslCode = async (
  vslCode: string
): Promise<VwAssessmentDetailCompare[]> => {
  const response = await api.get<VwAssessmentDetailCompare[]>(
    `api/assessmentDetailCompare/getAssessmentDetailCompareByVslCode?vslCode=${vslCode}`
  );
  return response.data;
};
