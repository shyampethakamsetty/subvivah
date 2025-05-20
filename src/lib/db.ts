import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Handle database connection
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to MongoDB via Prisma');
  })
  .catch((err: Error) => {
    console.error('Failed to connect to database:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    process.exit(1); // Exit the process if we can't connect to the database
  }); 