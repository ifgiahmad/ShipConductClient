import { z } from "zod";

export type MsAssessmentCategory = {
  id: number;
  vslType: string;
  item: string;
  itemId: number;
  interval: string;
  intervalValue: number;
  intervalId: number;
  shipSection?: string;
  shipSectionId: number;
  categorySection: string;
  categorySectionId: number;
  roleCategory: string;
  roleCategoryId: number;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  mode?: string;
  deleted: boolean;
  startMonth: number;
  startMonthString: string;
};

export const saveMsAssessmentCategoryZod = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  item: z.string().min(1, "Item is required"),
  interval: z.string().min(1, "Interval is required"),
  shipSection: z.string().min(1, "Ship Section is required"),
  categorySection: z.string().min(1, "Category Section is required"),
  roleCategory: z.string().min(1, "Role Category is required"),
  id: z.number().optional(),
  itemId: z.number().optional(),
  intervalId: z.number().optional(),
  intervalValue: z.number().optional(),
  shipSectionId: z.number().optional(),
  roleCategoryId: z.number().optional(),
  mode: z.string().optional(),
  deleted: z.boolean().optional(),
  startMonth: z.number().min(1, "Start Month is required"),
  startMonthString: z.string().optional(),
});

export type saveMsAssessmentCategoryDto = z.infer<
  typeof saveMsAssessmentCategoryZod
>;
