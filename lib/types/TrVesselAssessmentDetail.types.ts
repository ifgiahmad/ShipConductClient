import { z } from "zod";

export type TrVesselAssessmentDetail = {
  id: number;
  vesselAssessmentId?: number;
  item?: string;
  interval?: string;
  shipSection?: string;
  categorySection?: string;
  roleCategory?: string;
  itemId?: number;
  intervalId?: number;
  shipSectionId?: number;
  categorySectionId?: number;
  roleCategoryId?: number;
  grade: number;
  gradeDescription?: string;
  fileName?: string;
  smallFileLink?: string;
  normalFileLink?: string;
  fileName2?: string;
  smallFileLink2?: string;
  normalFileLink2?: string;
  fileName3?: string;
  smallFileLink3: string;
  normalFileLink3?: string;
  photoDescription?: string;
  isDeleted?: boolean;
  uploadedBy?: string;
  uploadedDate?: Date;
  assessedBy?: string;
  assessedDate?: Date;
  createdBy?: string;
  createdDate?: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  mode?: string;
  photo?: File | null;
  photo2?: File | null;
  photo3?: File | null;
  itemSamplePhoto?: string;
};

export const saveTrVesselAssessmentDetailZod = z.object({
  item: z.string().min(1, "Item is required"),
  interval: z.string().min(1, "Interval is required"),
  shipSection: z.string().min(1, "Ship Section is required"),
  categorySection: z.string().min(1, "Ship Section is required"),
  roleCategory: z.string().min(1, "Role Category is required"),
  itemId: z.number().min(1, "Item is required"),
  intervalId: z.number().min(1, "Interval is required"),
  shipSectionId: z.number().min(1, "Ship Section is required"),
  categorySectionId: z.number().min(1, "Ship Section is required"),
  roleCategoryId: z.number().min(1, "Role Category is required"),
  mode: z.string().optional(),
  id: z.number().optional(),
  vesselAssessmentId: z.number().optional(),
  grade: z.number().optional(),
  gradeDescription: z.string().optional(),
  linkShared: z.string().optional(),
  fileName: z.string().optional(),
  smallFileLink: z.string().optional(),
  normalFileLink: z.string().optional(),
  fileName2: z.string().optional(),
  smallFileLink2: z.string().optional(),
  normalFileLink2: z.string().optional(),
  fileName3: z.string().optional(),
  smallFileLink3: z.string().optional(),
  normalFileLink3: z.string().optional(),
  photoDescription: z.string().optional(),
  isDeleted: z.boolean().optional(),
  uploadedBy: z.string().optional(),
  uploadedDate: z.date().optional(),
  assessedBy: z.string().optional(),
  assessedDate: z.date().optional(),
  createdBy: z.string().optional(),
  createdDate: z.date().optional(),
  modifiedBy: z.string().optional(),
  modifiedDate: z.date().optional(),
  photo: z.instanceof(File).nullable().optional(),
  photo2: z.instanceof(File).nullable().optional(),
  photo3: z.instanceof(File).nullable().optional(),
});

export const UploadPhotoTrVesselAssessmentDetailZod = z
  .object({
    id: z.number().optional(),
    photoDescription: z.string().optional(),
    item: z.string().min(1, "Item is required"),
    itemId: z.number().min(1, "Item is required"),
    shipSection: z.string().min(1, "Ship Section is required"),
    photo: z.instanceof(File).nullable().optional(),
    photo2: z.instanceof(File).nullable().optional(),
    photo3: z.instanceof(File).nullable().optional(),
    fileName: z.string().optional(),
    smallFileLink: z.string().optional(),
    normalFileLink: z.string().optional(),
    fileName2: z.string().optional(),
    smallFileLink2: z.string().optional(),
    normalFileLink2: z.string().optional(),
    fileName3: z.string().optional(),
    smallFileLink3: z.string().optional(),
    normalFileLink3: z.string().optional(),
  })
  .refine(
    (data) =>
      data.photoDescription ||
      ((data.photo || data.smallFileLink || data.normalFileLink) &&
        (data.photo2 || data.smallFileLink2 || data.normalFileLink2)),
    {
      message:
        "Jumlah Photo Yang DiUpload Minimal 2 atau Jika item tidak ada dikapal berikan keterangan di photo description",
    }
  );

export type saveTrVesselAssessmentDetailDto = z.infer<
  typeof saveTrVesselAssessmentDetailZod
>;

export type uploadPhotoTrVesselAssessmentDetailDto = z.infer<
  typeof UploadPhotoTrVesselAssessmentDetailZod
>;
