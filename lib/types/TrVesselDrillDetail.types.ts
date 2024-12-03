import { z } from "zod";

export type TrVesselDrillDetail = {
  id: number;
  vesselDrillId?: number;
  item?: string;
  interval?: string;
  shipSection?: string;
  grade?: string;
  gradeDescription?: string;
  fileName?: string;
  smallFileLink?: string;
  normalFileLink?: string;
  videoDescription?: string;
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
  video?: File | null;
};

export const saveTrVesselDrillDetailZod = z.object({
  item: z.string().min(1, "Item is required"),
  interval: z.string().min(1, "Interval is required"),
  shipSection: z.string().min(1, "Ship Section is required"),
  mode: z.string().optional(),
  id: z.number().optional(),
  vesselDrillId: z.number().optional(),
  grade: z.string().optional(),
  gradeDescription: z.string().optional(),
  linkShared: z.string().optional(),
  fileName: z.string().optional(),
  smallFileLink: z.string().optional(),
  normalFileLink: z.string().optional(),
  videoDescription: z.string().optional(),
  isDeleted: z.boolean().optional(),
  uploadedBy: z.string().optional(),
  uploadedDate: z.date().optional(),
  assessedBy: z.string().optional(),
  assessedDate: z.date().optional(),
  createdBy: z.string().optional(),
  createdDate: z.date().optional(),
  modifiedBy: z.string().optional(),
  modifiedDate: z.date().optional(),
  video: z.instanceof(File).nullable().optional(),
});

export const uploadVideoTrVesselDrillDetailZod = z
  .object({
    id: z.number().optional(),
    videoDescription: z.string().optional(),
    item: z.string().min(1, "Item is required"),
    shipSection: z.string().min(1, "Ship Section is required"),
    video: z.instanceof(File).nullable().optional(),
    fileName: z.string().optional(),
    smallFileLink: z.string().optional(),
    normalFileLink: z.string().optional(),
  })
  .refine(
    (data) =>
      data.videoDescription ||
      data.video ||
      data.smallFileLink ||
      data.normalFileLink,
    {
      message: "Salah satu antara video atau videoDescription harus diisi.",
    }
  );

export type saveTrVesselDrillDetailDto = z.infer<
  typeof saveTrVesselDrillDetailZod
>;

export type uploadVideoTrVesselDrillDetailDto = z.infer<
  typeof uploadVideoTrVesselDrillDetailZod
>;
