import { z } from "zod";
export type MsItem = {
  id: number;
  itemCode?: string;
  itemName: string;
  vslType?: string;
  fileName?: string;
  fileLink?: string;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  isDeleted: boolean;
  photo?: File | null;
  type?: string;
};

export const saveMsItemZod = z.object({
  itemName: z.string().min(1, "Item Name is required"),
  vslType: z.string().optional(),
  id: z.number().optional(),
  mode: z.string().optional(),
  type: z.string().optional(),
  isDeleted: z.boolean().optional(),
  photo: z.instanceof(File).nullable().optional(),
  fileName: z.string().optional(),
});

export type saveMsItemDto = z.infer<typeof saveMsItemZod>;
