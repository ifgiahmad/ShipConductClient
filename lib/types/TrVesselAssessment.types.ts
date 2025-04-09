import { z } from "zod";

export type TrVesselAssessment = {
  id: number;
  vslType?: string;
  vslCode?: string;
  vslName?: string;
  vslMate?: string;
  periodDate?: Date;
  periodName?: string;
  finalDate?: Date;
  month?: number;
  year?: number;
  scoreItemGeneral?: number;
  scoreItemTechnical?: number;
  scoreItemMarine?: number;
  downtimeDaysGeneral?: number;
  downtimeDaysTechnical?: number;
  downtimeDaysMarine?: number;
  downtimeGeneral?: number;
  downtimeTechnical?: number;
  downtimeMarine?: number;
  scoreGeneral?: number;
  scoreTechnical?: number;
  scoreMarine?: number;
  totalScore?: number;
  scoreDescription?: string;
  description?: string;
  status?: string;
  linkShared?: string;
  linkCode?: string;
  createdBy?: string;
  modifiedBy?: string;
  closedDpaby?: string;
  closedTsby?: string;
  closedMsby?: string;
  closedDateDpa?: Date;
  closedDateTs?: Date;
  closedDateMs?: Date;
  percentageUpload?: string;
};

export const createTrVesselAssessmentZod = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  vslName: z.string().optional(),
  vslCode: z.string().optional(),
  vslMate: z.string().optional(),
  month: z.number().optional(),
  year: z.number().optional(),
  periodDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Period Date is required",
  }),
  finalDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Final Date is required",
  }),
  description: z.string().optional(),
  mode: z.string().optional(),
  role: z.string().optional(),
  id: z.number().optional(),
  scoreItemGeneral: z.number().optional(),
  scoreItemTechnical: z.number().optional(),
  scoreItemMarine: z.number().optional(),
  downtimeDaysGeneral: z
    .union([z.coerce.number().nonnegative(), z.undefined()])
    .optional(),
  downtimeDaysTechnical: z
    .union([z.coerce.number().nonnegative(), z.undefined()])
    .optional(),
  downtimeDaysMarine: z
    .union([z.coerce.number().nonnegative(), z.undefined()])
    .optional(),
  downtimeGeneral: z.number().optional(),
  downtimeTechnical: z.number().optional(),
  downtimeMarine: z.number().optional(),
  scoreGeneral: z.number().optional(),
  scoreTechnical: z.number().optional(),
  scoreMarine: z.number().optional(),
  totalScore: z.number().optional(),
  status: z.string().optional(),
  linkShared: z.string().optional(),
  linkCode: z.string().optional(),
  createdBy: z.string().optional(),
  modifiedBy: z.string().optional(),
  closedDpaby: z.string().optional(),
  closedTsby: z.string().optional(),
  closedMsby: z.string().optional(),
});

export type createTrVesselAssessmentDto = z.infer<
  typeof createTrVesselAssessmentZod
>;
