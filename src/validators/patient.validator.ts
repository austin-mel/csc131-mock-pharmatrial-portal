import { z } from "zod";

const allergySchema = z.object({
  name: z.string(),
  reactions: z.string(),
});

const medicationSchema = z.object({
  name: z.string(),
  purpose: z.string(),
});

const historySchema = z.object({
  disease: z.string(),
  carrier: z.string(),
});

const icdCodeSchema = z.object({
  code: z.string(),
});

const appointmentSchema = z.object({
  date: z.date(),
  o2: z.number().int(),
  bp: z.string(),
  temp: z.number(),
  hiv: z.number().int(),
  doctor: z.string(),
  notes: z.any(),      
});

export const patientSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),

  study_id: z.string().uuid(),
  drug_id: z.string(),

  dob: z.date(),

  address: z.string(),
  insurance_num: z.string(),

  height: z.number().positive(),
  weight: z.number().positive(),

  blood: z.string(),

  employed: z.boolean(),
  insured: z.boolean(),
  eligibility: z.boolean(),

  dose: z.number().positive(),

  phone_number: z.string(),
  email: z.string().email(),

  allergies: z.array(allergySchema).optional(),
  medications: z.array(medicationSchema).optional(),
  histories: z.array(historySchema).optional(),
  icdcodes: z.array(icdCodeSchema).optional(),
  appointments: z.array(appointmentSchema).optional(),
});

export const createPatientSchema = z.object({
  body: patientSchema,
});

export const updatePatientSchema = z.object({
  body: patientSchema.partial(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>["body"];
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>["body"];
