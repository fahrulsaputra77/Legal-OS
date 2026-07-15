import { prisma } from '@/lib/db';
import { CreateDocumentInput, QueryDocumentInput } from '../dtos/document.dto';

export class DocumentRepository {
  async createDocument(data: CreateDocumentInput) {
    return prisma.legalDocument.create({
      data: {
        title: data.title,
        type: data.type,
        docNumber: data.docNumber,
        year: data.year,
        promulgatedDate: data.promulgatedDate ? new Date(data.promulgatedDate) : null,
        status: data.status,
        sourceUrl: data.sourceUrl,
        categoryId: data.categoryId,
      },
    });
  }

  async findDocuments(query: QueryDocumentInput) {
    const { type, year, status, search, limit, page } = query;
    const skip = (page - 1) * limit;

    return prisma.legalDocument.findMany({
      where: {
        ...(type && { type }),
        ...(year && { year }),
        ...(status && { status }),
        ...(search && {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }),
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findDocumentById(id: string) {
    return prisma.legalDocument.findUnique({
      where: { id },
      include: {
        chapters: {
          include: {
            articles: {
              include: {
                paragraphs: true,
                explanation: true,
              },
            },
          },
        },
        category: true,
      },
    });
  }
}

export const documentRepository = new DocumentRepository();
