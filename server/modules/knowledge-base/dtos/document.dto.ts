import { z } from 'zod';
import { LegalDocType, LegalStatus } from '@prisma/client';

export const CreateDocumentDto = z.object({
  title: z.string().min(3),
  type: z.nativeEnum(LegalDocType),
  docNumber: z.string().optional(),
  year: z.number().int().optional(),
  promulgatedDate: z.string().datetime().optional(),
  status: z.nativeEnum(LegalStatus).default('BERLAKU'),
  sourceUrl: z.string().url().optional(),
  categoryId: z.string().cuid().optional(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentDto>;

export const QueryDocumentDto = z.object({
  type: z.nativeEnum(LegalDocType).optional(),
  year: z.number().int().optional(),
  status: z.nativeEnum(LegalStatus).optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
});

export type QueryDocumentInput = z.infer<typeof QueryDocumentDto>;
