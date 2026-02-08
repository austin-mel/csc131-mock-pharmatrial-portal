import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getTrials = async (_req: Request, res: Response) => {
  const trials = await prisma.trial.findMany();
  res.json(trials);
};

export const getTrialById = async (req: Request, res: Response) => {
  const trial = await prisma.trial.findUnique({
    where: { id: req.params.id },
    include: { patients: true },
  });
  if (!trial) return res.status(404).json({ message: 'Trial not found' });
  res.json(trial);
};

export const createTrial = async (req: Request, res: Response) => {
  const trial = await prisma.trial.create({ data: req.body });
  res.status(201).json(trial);
};

export const updateTrial = async (req: Request, res: Response) => {
  const updated = await prisma.trial.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updated);
};

export const deleteTrial = async (req: Request, res: Response) => {
  await prisma.trial.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
