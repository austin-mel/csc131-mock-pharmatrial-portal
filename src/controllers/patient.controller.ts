import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getPatients = async (_req: Request, res: Response) => {
  const patients = await prisma.patient.findMany({ include: { trial: true } });
  res.json(patients);
};

export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { allergies: true, medications: true, histories: true, appointments: true },
  });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

export const createPatient = async (req: Request, res: Response) => {
  const patient = await prisma.patient.create({ data: req.body });
  res.status(201).json(patient);
};

export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.patient.update({ where: { id }, data: req.body });
  res.json(updated);
};

export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.patient.delete({ where: { id } });
  res.status(204).end();
};
