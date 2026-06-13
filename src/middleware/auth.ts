import { NextFunction, Request, Response } from 'express';
import { verifyToken, AuthTokenPayload } from '../auth/token';

export type PortalRole = 'jh-doctor' | 'jh-admin' | 'fda' | 'bavaria';

export interface AuthenticatedUser {
  id: string;
  portalId: PortalRole;
  role: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      authToken?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Missing bearer token' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: 'Invalid or expired token' });

  req.authToken = payload;
  req.user = {
    id: payload.sub,
    portalId: payload.portalId as PortalRole,
    role: payload.role,
    email: payload.email,
  };
  next();
}

export function requireRoles(...roles: PortalRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Missing authenticated user' });
    if (!roles.includes(req.user.portalId)) {
      return res.status(403).json({ message: 'Insufficient role for this workflow' });
    }
    next();
  };
}
