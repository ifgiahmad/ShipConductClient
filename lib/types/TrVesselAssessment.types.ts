import { z } from "zod";

export type TrVesselAssessment = {
  id: number;
  vslType?: string;
  vslCode?: string;
  vslName?: string;
  /*  interval?: string; */
  periodDate?: Date;
  finalDate?: Date;
  gradeTotal?: number;
  downtime?: number;
  totalScore?: number;
  scoreDescription?: string;
  description?: string;
  status?: string;
  linkShared?: string;
  linkCode?: string;
  createdBy?: string;
  /*  createdDate?: Date; */
  modifiedBy?: string;
  /*  modifiedDate?: Date; */
};

export const createTrVesselAssessmentZod = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  vslName: z.string().optional(),
  vslCode: z.string().min(1, "Vessel Code is required"),
  /* interval: z.string().min(1, "Interval is required"), */
  periodDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Period Date is required",
  }),
  finalDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Final Date is required",
  }),
  description: z.string().optional(),
  mode: z.string().optional(),
  id: z.number().optional(),
  gradeTotal: z.number().optional(),
  /* downtime: z.number().optional(), */
  downtime: z
    .union([z.coerce.number().nonnegative(), z.undefined()])
    .optional(),
  totalScore: z.number().optional(),
  status: z.string().optional(),
  linkShared: z.string().optional(),
  linkCode: z.string().optional(),
  createdBy: z.string().optional(),
  modifiedBy: z.string().optional(),
});

export type createTrVesselAssessmentDto = z.infer<
  typeof createTrVesselAssessmentZod
>;
