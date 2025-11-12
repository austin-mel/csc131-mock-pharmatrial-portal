import dotenv from 'dotenv';
import path from 'path';
import pkg from '@prisma/client';

// Load custom env file
dotenv.config({ path: path.resolve('environment/back-end.env') });

const { PrismaClient } = pkg;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.BACK_END_HOST,
    },
  },
});