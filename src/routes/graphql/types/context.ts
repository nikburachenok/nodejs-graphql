import { PrismaClient } from '@prisma/client';
import { getLoaders } from '../loader.js';

export type Context = {
    prisma: PrismaClient,
    dataLoader: ReturnType<typeof getLoaders>
}