import {PrismaClient} from '@prisma/client'


declare global {
    var prisma: PrismaClient | undefined
}


const client = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== 'production') globalThis.prisma = client


export default client


/*
import {PrismaClient} from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const client: PrismaClient =
  typeof window === "undefined"
    ? globalForPrisma.prisma ?? new PrismaClient()
    : (undefined as unknown as PrismaClient);

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;


export default client
*/