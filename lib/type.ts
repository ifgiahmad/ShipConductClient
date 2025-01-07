export type MsAssessmentCategory = {
  id: number;
  vslType: string;
  item: string;
  interval?: string;
  shipSection?: string;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  mode?: string;
  deleted: boolean;
};

export type TrVesselAssessment = {
  Id: number;
  VslType?: string;
  VslName?: string;
  PeriodDate?: Date;
  FinalDate?: Date;
  GradeTotal?: number;
  Description?: string;
  Status?: string;
  LinkShared?: string;
  CreatedBy?: string;
  CreatedDate?: Date;
  ModifiedBy?: string;
  ModifiedDate?: Date;
};

export type TrVesselAssessmentDetail = {
  Id: number;
  VesselAssessmentId?: number;
  Item?: string;
  Interval?: string;
  ShipSection?: string;
  Grade?: number;
  GradeDescription?: string;
  FileName?: string;
  SmallFileLink?: string;
  NormalFileLink?: string;
  PhotoDescription?: string;
  IsDeleted?: boolean;
  UploadedBy?: string;
  UploadedDate?: Date;
  AssessedBy?: string;
  AssessedDate?: Date;
  CreatedBy?: string;
  CreatedDate?: Date;
  ModifiedBy?: string;
  ModifiedDate?: Date;
};

export type UserLogin = {
  username: string;
  password: string;
  superUser: boolean;
  roleCode?: string;
};

export type UserRole = {
  superUser: boolean;
  roleCode?: string;
};

export type Token = {
  token: string;
  expiration: Date;
};
