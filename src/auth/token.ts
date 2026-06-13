import crypto from 'crypto';

export interface AuthTokenPayload {
  sub: string;
  portalId: string;
  role: string;
  email: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function decodeBase64Url(input: string) {
  const padded = input.padEnd(input.length + ((4 - (input.length % 4)) % 4), '=');
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function secret() {
  return process.env.AUTH_TOKEN_SECRET || 'pharmatrial-local-dev-secret';
}

export function signToken(user: { id: string; portalId: string; role: string; email: string }) {
  const issuer = process.env.AUTH_TOKEN_ISSUER || 'pharmatrial-backend';
  const audience = process.env.AUTH_TOKEN_AUDIENCE || 'pharmatrial-frontend';
  const ttlSeconds = Number(process.env.AUTH_TOKEN_TTL_SECONDS || 28800);
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthTokenPayload = {
    sub: user.id,
    portalId: user.portalId,
    role: user.role,
    email: user.email,
    iss: issuer,
    aud: audience,
    iat: now,
    exp: now + ttlSeconds,
  };
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = crypto.createHmac('sha256', secret()).update(body).digest();

  return `${body}.${base64Url(signature)}`;
}

export function verifyToken(token: string): AuthTokenPayload | null {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

  const body = `${encodedHeader}.${encodedPayload}`;
  const expected = base64Url(crypto.createHmac('sha256', secret()).update(body).digest());
  const signature = Buffer.from(encodedSignature);
  const expectedSignature = Buffer.from(expected);

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(signature, expectedSignature)
  ) {
    return null;
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthTokenPayload;
  const now = Math.floor(Date.now() / 1000);
  const issuer = process.env.AUTH_TOKEN_ISSUER || 'pharmatrial-backend';
  const audience = process.env.AUTH_TOKEN_AUDIENCE || 'pharmatrial-frontend';

  if (payload.iss !== issuer || payload.aud !== audience || payload.exp <= now) return null;
  return payload;
}

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
