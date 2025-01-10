import { z } from "zod";
export type MsRoleCategory = {
  id: number;
  roleCategory: string;
  codeRoleCategory: string;
  createdBy?: string;
  createdDate?: Date | null;
  modifiedBy?: string;
  modifiedDate?: Date | null;
  isDeleted: boolean;
};

export const saveMsRoleCategoryZod = z.object({
  roleCategory: z.string().min(1, "RoleCategory is required"),
  codeRoleCategory: z.string().min(1, "CodeRoleCategory is required"),
  id: z.number().optional(),
  mode: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export type saveMsRoleCategoryDto = z.infer<typeof saveMsRoleCategoryZod>;
