'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  Search, 
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TimelinePage() {
  const [docId, setDocId] = useState('mock-uu-13');
  const [inputVal, setInputVal] = useState('mock-uu-13');
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTimeline();
  }, [docId]);

  const fetchTimeline = async () => {
    if (!docId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/relations/timeline?documentId=${docId}`);
      const json = await res.json();
      if (json.data) {
        setTimeline(json.data);
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

  const getRelationColor = (type: string) => {
    switch (type) {
      case 'MENGUBAH': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MENCABUT': return 'bg-red-100 text-red-800 border-red-200';
      case 'MENGGANTIKAN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MELAKSANAKAN': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0f172a]">
      <div className="bg-white dark:bg-slate-900 border-b p-6 shrink-0">
        <h1 className="text-2xl font-bold text-[#1B2A4A] dark:text-white flex items-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-[#C9A84C]" />
          Timeline Perubahan Regulasi
        </h1>
        <p className="text-muted-foreground text-sm max-w-3xl mb-6">
          Lacak riwayat hidup sebuah dokumen hukum. Lihat kapan dokumen ini diubah, dicabut, atau digantikan oleh regulasi baru secara kronologis.
        </p>

        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md">
          <Input 
            placeholder="Masukkan ID Dokumen..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-[#1B2A4A]">Cari Timeline</Button>
        </form>
      </div>

      <ScrollArea className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="text-center py-10 text-slate-500 animate-pulse">Memuat riwayat dokumen...</div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <p>Tidak ada riwayat perubahan ditemukan untuk dokumen ini.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-6 space-y-8 pb-10">
              {timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative pl-8 md:pl-10">
                  {/* Timeline Dot */}
                  <div className="absolute -left-3 md:-left-3.5 top-1 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border-4 border-[#C9A84C] flex items-center justify-center shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-[#1B2A4A] dark:bg-white" />
                  </div>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                      </div>
                      
                      <div className="mb-3">
                        <Badge variant="outline" className={`text-xs ${getRelationColor(item.type)}`}>
                          {item.type}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-[#1B2A4A] dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      
                      {item.description && (
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t">
                        <Button variant="ghost" size="sm" className="text-[#C9A84C] hover:text-[#C9A84C]/80 p-0 h-auto">
                          Lihat Dokumen <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
