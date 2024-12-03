export type VwAssessmentDetailCompare = {
  idDetail: number;
  vslCode?: string;
  vslName?: string;
  periodDate?: Date;
  item?: string;
  fileName?: string;
  smallFileLink?: string;
  normalFileLink?: string;
  photoDescription?: string;
  grade?: number;
  gradeDescription?: string;
  shipSection?: string;
  interval?: string;
  categorySection?: string;
};

export interface AssessmentDetailCompareGroupByItem {
  item?: string;
  details: VwAssessmentDetailCompare[];
}

export type VwGroupByItem = {
  VslCode?: string;
  VslName?: string;
  Item?: string;
};
