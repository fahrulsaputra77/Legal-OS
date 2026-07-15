import { documentRepository } from '../repositories/document.repository';
import { CreateDocumentDto, QueryDocumentDto } from '../dtos/document.dto';

export class DocumentService {
  async createDocument(data: unknown) {
    // Validate input using Zod DTO
    const validatedData = CreateDocumentDto.parse(data);
    
    // Check for business rules (e.g. duplicate document check could go here)

    // Pass to repository
    return documentRepository.createDocument(validatedData);
  }

  async getDocuments(query: unknown) {
    const validatedQuery = QueryDocumentDto.parse(query);
    return documentRepository.findDocuments(validatedQuery);
  }

  async getDocumentById(id: string) {
    const document = await documentRepository.findDocumentById(id);
    if (!document) {
      throw new Error('Document not found');
    }
    return document;
  }
}

export const documentService = new DocumentService();
