// src/controllers/patientController.ts
import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        allergies: true,
        medications: true,
        histories: true,
        icdcodes: true,
        appointments: true,
        trial: true,
      },
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        allergies: true,
        medications: true,
        histories: true,
        icdcodes: true,
        appointments: true,
        trial: true,
      },
    });

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};
