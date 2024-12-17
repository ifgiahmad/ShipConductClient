import { z } from "zod";

export type TrVesselDrillDetail = {
  id: number;
  vesselDrillId?: number;
  itemName?: string;
  itemId?: number;
  interval?: string;
  intervalId?: number;
  /*   shipSection?: string; */
  grade?: string;
  gradeDescription?: string;
  fileName?: string;
  docName?: string;
  smallFileLink?: string;
  normalFileLink?: string;
  docLink?: string;
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
  doc?: File | null;
};

export const saveTrVesselDrillDetailZod = z.object({
  itemName: z.string().min(1, "Item is required"),
  interval: z.string().min(1, "Interval is required"),
  itemId: z.number().min(1, "Item is required"),
  intervalId: z.number().min(1, "Interval is required"),
  mode: z.string().optional(),
  id: z.number().optional(),
  vesselDrillId: z.number().optional(),
  grade: z.string().optional(),
  gradeDescription: z.string().optional(),
  linkShared: z.string().optional(),
  fileName: z.string().optional(),
  docName: z.string().optional(),
  smallFileLink: z.string().optional(),
  normalFileLink: z.string().optional(),
  videoDescription: z.string().optional(),
  docLink: z.string().optional(),
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
  doc: z.instanceof(File).nullable().optional(),
});

export const uploadVideoTrVesselDrillDetailZod = z
  .object({
    id: z.number().optional(),
    videoDescription: z.string().optional(),
    itemName: z.string().min(1, "Item is required"),
    interval: z.string().min(1, "Interval is required"),
    intervalId: z.number().min(1, "Interval is required"),
    /*  shipSection: z.string().min(1, "Ship Section is required"), */
    video: z.instanceof(File).nullable().optional(),
    doc: z.instanceof(File).nullable().optional(),
    fileName: z.string().optional(),
    docName: z.string().optional(),
    smallFileLink: z.string().optional(),
    normalFileLink: z.string().optional(),
    docLink: z.string().optional(),
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
