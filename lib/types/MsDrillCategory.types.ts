import { z } from "zod";

export type MsDrillCategory = {
  id: number;
  vslType: string;
  itemDrill?: string;
  itemId: number;
  interval?: string;
  intervalId: number;
  startMonth: number;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  mode?: string;
  deleted: boolean;
  startMonthString: string;
};

export const saveMsDrillCategoryZod = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  itemDrill: z.string().optional(),
  interval: z.string().optional(),
  intervalId: z.number().min(1, "Interval is required"),
  itemId: z.number().min(1, "Item is required"),
  startMonth: z.number().min(1, "Start Month is required"),
  /*  shipSection: z.string().min(1, "Ship Section is required"), */
  id: z.number().optional(),
  mode: z.string().optional(),
  deleted: z.boolean().optional(),
  startMonthString: z.string().optional(),
});

export type saveMsDrillCategoryDto = z.infer<typeof saveMsDrillCategoryZod>;
