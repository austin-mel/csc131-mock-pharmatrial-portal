import { z } from "zod";

export const CreateTrialSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  drug_id: z.uuid(),

  status: z.string().default("pending"),

  approvals: z.object({
    jh: z.boolean().optional().default(false),
    fda: z.boolean().optional().default(false),
    bav: z.boolean().optional().default(false),
  }).default({ jh: false, fda: false, bav: false }),

  active: z.boolean().optional().default(false),
  completed: z.boolean().optional().default(false),
  rejected: z.boolean().optional().default(false),
});

export const UpdateTrialSchema = CreateTrialSchema.partial();

export type CreateTrialInput = z.infer<typeof CreateTrialSchema>;
export type UpdateTrialInput = z.infer<typeof UpdateTrialSchema>;