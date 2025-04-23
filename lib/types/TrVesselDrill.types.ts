import { z } from "zod";

export type TrVesselDrill = {
  id: number;
  vslType?: string;
  vslCode?: string;
  vslName?: string;
  periodDate?: Date;
  finalDate?: Date;
  grade?: string;
  description?: string;
  status?: string;
  linkShared?: string;
  linkCode?: string;
  createdBy?: string;
  modifiedBy?: string;
  percentageUpload?: string;
  periodName?: string;
};

export const createTrVesselDrillZod = z.object({
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
  grade: z.string().optional(),
  status: z.string().optional(),
  linkShared: z.string().optional(),
  linkCode: z.string().optional(),
  createdBy: z.string().optional(),
  modifiedBy: z.string().optional(),
});

export type createTrVesselDrillDto = z.infer<typeof createTrVesselDrillZod>;
