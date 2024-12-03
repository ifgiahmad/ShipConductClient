import { z } from "zod";

export type MsDrillCategory = {
  id: number;
  vslType: string;
  itemDrill: string;
  interval: string;
  shipSection: string;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  mode?: string;
  deleted: boolean;
};

export const saveMsDrillCategoryZod = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  itemDrill: z.string().min(1, "Item Drill is required"),
  interval: z.string().min(1, "Interval is required"),
  shipSection: z.string().min(1, "Ship Section is required"),
  id: z.number().optional(),
  mode: z.string().optional(),
  deleted: z.boolean().optional(),
});

export type saveMsDrillCategoryDto = z.infer<typeof saveMsDrillCategoryZod>;
