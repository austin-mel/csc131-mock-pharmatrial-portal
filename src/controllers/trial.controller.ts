import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getTrials = async (_req: Request, res: Response) => {
  const trials = await prisma.trial.findMany();
  res.json(trials);
};

export const getTrialById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const trial = await prisma.trial.findUnique({ where: { id }, include: { patients: { select: { id: true} } } });
  if (!trial) return res.status(404).json({ message: 'Trial not found' });
  res.json(trial);
};

export const createTrial = async (req: Request, res: Response) => {
  const trial = await prisma.trial.create({ data: req.body });
  res.status(201).json(trial);
};

export const updateTrial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await prisma.trial.update({ where: { id }, data: req.body });
  res.json(updated);
};

export const deleteTrial = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.trial.delete({ where: { id } });
  res.status(204).end();
};
