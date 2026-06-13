import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { hashPassword, signToken } from '../auth/token';

const demoUsers = [
  {
    id: 'demo-jh-doctor',
    portalId: 'jh-doctor',
    email: 'doctor@jh.example',
    password: 'jh-doctor-demo',
    role: 'Trial Physician',
    displayName: 'Dr. Sarah Chen',
    organization: 'Jane Hopkins Hospital',
  },
  {
    id: 'demo-jh-admin',
    portalId: 'jh-admin',
    email: 'admin@jh.example',
    password: 'jh-admin-demo',
    role: 'Admin Coordinator',
    displayName: 'Emily Rodriguez',
    organization: 'Jane Hopkins Hospital',
  },
  {
    id: 'demo-fda',
    portalId: 'fda',
    email: 'admin@fda.example',
    password: 'fda-demo',
    role: 'Federal Regulator',
    displayName: 'Michael Torres',
    organization: 'FDA Administration',
  },
  {
    id: 'demo-bavaria',
    portalId: 'bavaria',
    email: 'admin@bavaria.example',
    password: 'bavaria-demo',
    role: 'Pharmaceutical Co.',
    displayName: 'Anna Keller',
    organization: 'Bavaria Pharma',
  },
];

export async function login(req: Request, res: Response) {
  const { email, password, portalId } = req.body as {
    email?: string;
    password?: string;
    portalId?: string;
  };

  if (!email || !password || !portalId) {
    return res.status(400).json({ message: 'Email, password, and portalId are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const dbUser = await (prisma as any).portalUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (dbUser) {
    if (dbUser.portalId !== portalId || dbUser.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid email or password for selected portal' });
    }

    return res.json({
      token: signToken(dbUser),
      user: {
        id: dbUser.id,
        portalId: dbUser.portalId,
        email: dbUser.email,
        role: dbUser.role,
        displayName: dbUser.displayName,
        organization: dbUser.organization,
      },
    });
  }

  const demoUser = demoUsers.find(
    (user) => user.email === normalizedEmail && user.portalId === portalId && user.password === password,
  );
  if (!demoUser) {
    return res.status(401).json({ message: 'Invalid email or password for selected portal' });
  }

  return res.json({
    token: signToken(demoUser),
    user: {
      id: demoUser.id,
      portalId: demoUser.portalId,
      email: demoUser.email,
      role: demoUser.role,
      displayName: demoUser.displayName,
      organization: demoUser.organization,
    },
    demo: true,
  });
}
