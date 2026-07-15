import { PrismaClient, RelationType } from '@prisma/client';
import { CacheService } from '@/lib/cache';
import { Logger } from '@/lib/logger';

const prisma = new PrismaClient();

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  year: number | null;
  status: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType;
}

export class RelationService {
  
  static async getKnowledgeGraph(documentId: string, maxDepth: number = 2) {
    const cacheKey = `graph:doc=${documentId}:depth=${maxDepth}`;
    
    return await CacheService.remember(cacheKey, 600, async () => {
      Logger.info(`Building Knowledge Graph for ${documentId} (Depth: ${maxDepth})`);
      const visitedNodes = new Set<string>();
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];
      const queue: { docId: string; depth: number }[] = [{ docId: documentId, depth: 0 }];

      while (queue.length > 0) {
        const { docId, depth } = queue.shift()!;
        
        if (visitedNodes.has(docId)) continue;
        
        const doc = await prisma.legalDocument.findUnique({
          where: { id: docId },
          select: { id: true, title: true, type: true, year: true, status: true }
        });

        if (!doc) continue;

        visitedNodes.add(docId);
        nodes.push({
          id: doc.id,
          title: doc.title,
          type: doc.type,
          year: doc.year,
          status: doc.status
        });

        if (depth < maxDepth) {
          const outgoing = await prisma.legalRelation.findMany({
            where: { sourceDocId: docId },
            select: { id: true, sourceDocId: true, targetDocId: true, type: true }
          });
          
          for (const rel of outgoing) {
            edges.push({ id: rel.id, source: rel.sourceDocId, target: rel.targetDocId, type: rel.type });
            if (!visitedNodes.has(rel.targetDocId)) {
              queue.push({ docId: rel.targetDocId, depth: depth + 1 });
            }
          }

          const incoming = await prisma.legalRelation.findMany({
            where: { targetDocId: docId },
            select: { id: true, sourceDocId: true, targetDocId: true, type: true }
          });

          for (const rel of incoming) {
            if (!edges.some(e => e.id === rel.id)) {
              edges.push({ id: rel.id, source: rel.sourceDocId, target: rel.targetDocId, type: rel.type });
            }
            if (!visitedNodes.has(rel.sourceDocId)) {
              queue.push({ docId: rel.sourceDocId, depth: depth + 1 });
            }
          }
        }
      }

      return { nodes, edges };
    });
  }

  static async getTimeline(documentId: string) {
    const cacheKey = `timeline:doc=${documentId}`;
    
    return await CacheService.remember(cacheKey, 600, async () => {
      Logger.info(`Fetching Timeline for ${documentId}`);
      const incomingRelations = await prisma.legalRelation.findMany({
        where: { targetDocId: documentId },
        select: {
          id: true,
          type: true,
          sourceDoc: {
            select: { id: true, title: true, type: true, year: true, status: true, promulgatedDate: true }
          }
        },
        orderBy: {
          sourceDoc: {
            promulgatedDate: 'asc'
          }
        }
      });

      const manualHistories = await prisma.legalHistory.findMany({
        where: { documentId: documentId },
        select: { id: true, action: true, date: true, relatedDocId: true },
        orderBy: { date: 'asc' }
      });

      const timeline = incomingRelations.map(rel => ({
        id: rel.id,
        date: rel.sourceDoc.promulgatedDate || new Date(`${rel.sourceDoc.year || 1970}-01-01`),
        type: rel.type,
        title: rel.sourceDoc.title,
        sourceDocId: rel.sourceDoc.id,
        description: `Dokumen ini di-${rel.type.toLowerCase()} oleh ${rel.sourceDoc.type} Tahun ${rel.sourceDoc.year}`
      }));

      const histories = manualHistories.map(hist => ({
        id: hist.id,
        date: hist.date,
        type: hist.action,
        title: hist.action,
        sourceDocId: hist.relatedDocId,
        description: hist.action
      }));

      const combinedTimeline = [...timeline, ...histories].sort((a, b) => a.date.getTime() - b.date.getTime());

      return combinedTimeline;
    });
  }
}
