import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getPatients = async (_req: Request, res: Response) => {
  const patients = await prisma.patient.findMany({
    include: { trial: true },
  });
  res.json(patients);
};

export const getPatientById = async (req: Request, res: Response) => {
  const patient = await prisma.patient.findUnique({
    where: { id: req.params.id },
    include: { allergies: true, medications: true, history:true, appointments: true, trial: true },
  });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

export const createPatient = async (req: Request, res: Response) => {
  const patient = await prisma.patient.create({ data: req.body });
  res.status(201).json(patient);
};

export const updatePatient = async (req: Request, res: Response) => {
  const updated = await prisma.patient.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updated);
};

export const deletePatient = async (req: Request, res: Response) => {
  await prisma.patient.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
