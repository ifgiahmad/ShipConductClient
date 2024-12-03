import { z } from "zod";
export type MsCategorySection = {
  id: number;
  categorySection: string;
  kodeCategorySection: string;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  isDeleted: boolean;
};

export const saveMsCategorySectionZod = z.object({
  categorySection: z.string().min(1, "CategorySection is required"),
  kodeCategorySection: z.string().min(1, "KodeCategorySection is required"),
  id: z.number().optional(),
  mode: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export type saveMsCategorySectionDto = z.infer<typeof saveMsCategorySectionZod>;
