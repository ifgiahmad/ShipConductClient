import { z } from "zod";

export type TrVesselDrillDetail = {
  id: number;
  vesselDrillId?: number;
  itemName?: string;
  itemType?: string;
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
  doc2?: File | null;
  docName2?: string;
  docLink2?: string;
  doc3?: File | null;
  docName3?: string;
  docLink3?: string;
  doc4?: File | null;
  docName4?: string;
  docLink4?: string;
  doc5?: File | null;
  docName5?: string;
  docLink5?: string;
};

export const saveTrVesselDrillDetailZod = z.object({
  itemName: z.string().min(1, "Item is required"),
  itemType: z.string().optional(),
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
  doc2: z.instanceof(File).nullable().optional(),
  docName2: z.string().optional(),
  docLink2: z.string().optional(),
  doc3: z.instanceof(File).nullable().optional(),
  docName3: z.string().optional(),
  docLink3: z.string().optional(),
  doc4: z.instanceof(File).nullable().optional(),
  docName4: z.string().optional(),
  docLink4: z.string().optional(),
  doc5: z.instanceof(File).nullable().optional(),
  docName5: z.string().optional(),
  docLink5: z.string().optional(),
});

export const uploadVideoTrVesselDrillDetailZod = z
  .object({
    id: z.number().optional(),
    videoDescription: z.string().optional(),
    itemName: z.string().min(1, "Item is required"),
    itemType: z.string().optional(),
    interval: z.string().min(1, "Interval is required"),
    intervalId: z.number().min(1, "Interval is required"),
    video: z.instanceof(File).nullable().optional(),
    doc: z.instanceof(File).nullable().optional(),
    fileName: z.string().optional(),
    docName: z.string().optional(),
    smallFileLink: z.string().optional(),
    normalFileLink: z.string().optional(),
    docLink: z.string().optional(),
    doc2: z.instanceof(File).nullable().optional(),
    docLink2: z.string().optional(),
    docName2: z.string().optional(),
    doc3: z.instanceof(File).nullable().optional(),
    docLink3: z.string().optional(),
    docName3: z.string().optional(),
    doc4: z.instanceof(File).nullable().optional(),
    docLink4: z.string().optional(),
    docName4: z.string().optional(),
    doc5: z.instanceof(File).nullable().optional(),
    docLink5: z.string().optional(),
    docName5: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.itemType !== "Drill") return true; // Jika bukan Drill, validasi dilewati
      return (
        data.videoDescription ||
        data.video ||
        data.smallFileLink ||
        data.normalFileLink
      );
    },
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
