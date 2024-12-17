import { z } from "zod";
export type MsShipSection = {
  id: number;
  vslType: string;
  sectionName: string;
  categorySection: string;
  categoryId: number;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  isDeleted: boolean;
};

export const saveMsShipSectionZod = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  sectionName: z.string().min(1, "sectionName is required"),
  categorySection: z.string().min(1, "Category Section is required"),
  categoryId: z.number().min(1, "Category Id is required"),
  id: z.number().optional(),
  mode: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export type saveMsShipSectionDto = z.infer<typeof saveMsShipSectionZod>;
