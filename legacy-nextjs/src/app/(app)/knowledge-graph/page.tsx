'use client';

import React, { useState, useEffect } from 'react';
import { Network, Search, AlertCircle, ArrowRight, Expand } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function KnowledgeGraphPage() {
  const [docId, setDocId] = useState('mock-uu-13');
  const [inputVal, setInputVal] = useState('mock-uu-13');
  const [graphData, setGraphData] = useState<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGraph();
  }, [docId]);

  const fetchGraph = async () => {
    if (!docId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/relations/graph?documentId=${docId}&depth=2`);
      const json = await res.json();
      if (json.data) {
        setGraphData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDocId(inputVal);
  };

  const getNodeColor = (type: string) => {
    if (type === 'UU' || type === 'UUD_1945') return 'border-[#1B2A4A] bg-[#1B2A4A] text-white';
    if (type === 'PP' || type === 'PERPRES') return 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#1B2A4A]';
    return 'border-slate-300 bg-white text-slate-800';
  };

  const getRelationLabel = (type: string) => {
    switch(type) {
      case 'MENGUBAH': return 'Mengubah';
      case 'MENCABUT': return 'Mencabut';
      case 'MELAKSANAKAN': return 'Melaksanakan';
      case 'MENGACU': return 'Mengacu pada';
      case 'TURUNAN': return 'Turunan dari';
      default: return type;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0f172a]">
      <div className="bg-white dark:bg-slate-900 border-b p-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white flex items-center gap-2 mb-1">
            <Network className="h-6 w-6 text-[#C9A84C]" />
            Knowledge Graph Relasi
          </h1>
          <p className="text-muted-foreground text-sm">
            Peta keterkaitan antar dokumen hukum. Lihat UU induk dan peraturan pelaksana di bawahnya.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
          <Input 
            placeholder="ID Dokumen (contoh: mock-uu-13)"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" className="bg-[#C9A84C] text-white hover:bg-[#C9A84C]/90">
            Render
          </Button>
        </form>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
            <div className="text-center animate-pulse">
              <Network className="h-10 w-10 mx-auto text-[#C9A84C] mb-4 animate-spin-slow" />
              <p className="text-lg font-medium">Membangun simpul relasi...</p>
            </div>
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <p>Tidak ada jaringan relasi yang terdeteksi.</p>
            </div>
          </div>
        ) : (
          <div className="p-8 h-full overflow-auto">
            <div className="min-w-[800px] min-h-[600px] flex flex-col items-center justify-center relative gap-16">
              
              {/* Central Node */}
              <div className="z-20 text-center">
                <Badge className="mb-2 bg-[#1B2A4A]">Node Sentral</Badge>
                {graphData.nodes.filter(n => n.id === docId).map(node => (
                  <Card key={node.id} className={`w-80 shadow-lg border-2 ${getNodeColor(node.type)}`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-xs opacity-80 mb-1">{node.type} {node.year ? `Tahun ${node.year}` : ''}</div>
                      <h3 className="font-bold text-sm leading-snug">{node.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Edge/Relation visual representation (Mock CSS lines for now) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-16 bg-[#C9A84C]" />
              
              {/* Connected Nodes */}
              <div className="flex flex-wrap justify-center gap-8 z-20">
                {graphData.nodes.filter(n => n.id !== docId).map(node => {
                  const incomingEdge = graphData.edges.find(e => e.source === node.id && e.target === docId);
                  const outgoingEdge = graphData.edges.find(e => e.target === node.id && e.source === docId);
                  const edge = incomingEdge || outgoingEdge;

                  return (
                    <div key={node.id} className="flex flex-col items-center">
                      <Badge variant="outline" className="mb-2 text-[#C9A84C] border-[#C9A84C]">
                        {edge ? getRelationLabel(edge.type) : 'Terkait'}
                      </Badge>
                      <Card className={`w-64 shadow border-2 ${getNodeColor(node.type)}`}>
                        <CardContent className="p-4 text-center">
                          <div className="text-xs opacity-70 mb-1">{node.type} {node.year}</div>
                          <h3 className="font-semibold text-xs leading-snug line-clamp-3">{node.title}</h3>
                          <Button variant="link" size="sm" className="mt-2 h-auto text-[#C9A84C] text-xs p-0" onClick={() => setDocId(node.id)}>
                            Jadikan Pusat <Expand className="h-3 w-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
