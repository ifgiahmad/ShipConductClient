export type MsGradeCriteria = {
  id?: number;
  grade: number;
  criteria: string;
  shipSection?: string;
  categorySection?: string;
  isDeleted?: boolean;
  createdBy?: string;
  createdDate?: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
};
