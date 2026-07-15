'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  History, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  Filter,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SearchEnginePage() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [autocomplete, setAutocomplete] = useState<any[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch History on mount
  useEffect(() => {
    fetch('/api/v1/search/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch(console.error);
  }, []);

  // Handle click outside to close autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autocomplete fetching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        fetch(`/api/v1/search/autocomplete?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setAutocomplete(data);
          })
          .catch(console.error);
      } else {
        setAutocomplete([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Main Search fetching
  useEffect(() => {
    if (!activeQuery) return;
    setIsLoading(true);
    fetch(`/api/v1/search?q=${encodeURIComponent(activeQuery)}&page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setResults(data.data);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeQuery, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActiveQuery(query);
    setPage(1);
    setShowAutocomplete(false);
    
    // Optimistically add to history
    if (!history.find(h => h.query === query)) {
      setHistory(prev => [{ id: Date.now().toString(), query }, ...prev].slice(0, 10));
    }
  };

  const handleSelectAutocomplete = (title: string) => {
    setQuery(title);
    setActiveQuery(title);
    setPage(1);
    setShowAutocomplete(false);
  };

  const handleSelectHistory = (historyQuery: string) => {
    setQuery(historyQuery);
    setActiveQuery(historyQuery);
    setPage(1);
    setShowAutocomplete(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0f172a]">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 border-b p-6 md:p-8 flex flex-col items-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1B2A4A] dark:text-white mb-2 flex items-center gap-2">
          <Search className="h-8 w-8 text-[#C9A84C]" />
          Mesin Pencari Hukum
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-2xl">
          Pencarian *Full Text* berbasis PostgreSQL (Non-AI). Mendukung Ranking Relevansi, Autocomplete, History, dan Highlight Kata Kunci.
        </p>

        <div className="w-full max-w-3xl relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              className="w-full pl-12 pr-24 h-14 text-lg rounded-full shadow-sm border-slate-300 dark:border-slate-700 focus-visible:ring-[#C9A84C]"
              placeholder="Cari UU, PP, Pasal, atau topik hukum..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 bg-[#1B2A4A] hover:bg-[#1B2A4A]/90"
            >
              Cari
            </Button>
          </form>

          {/* Autocomplete & History Dropdown */}
          {showAutocomplete && (query.length >= 2 || history.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              
              {query.length < 2 && history.length > 0 && (
                <div className="p-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase px-3 py-2 flex items-center gap-1">
                    <History className="h-3 w-3" /> Pencarian Terakhir
                  </h4>
                  {history.map(h => (
                    <button
                      key={h.id}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2"
                      onClick={() => handleSelectHistory(h.query)}
                    >
                      <Clock className="h-4 w-4 text-slate-400" />
                      {h.query}
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && autocomplete.length > 0 && (
                <div className="p-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">Saran Pencarian</h4>
                  {autocomplete.map(item => (
                    <button
                      key={item.id}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex flex-col"
                      onClick={() => handleSelectAutocomplete(item.title)}
                    >
                      <span className="font-medium line-clamp-1">{item.title}</span>
                      <span className="text-xs text-slate-500">{item.type} {item.year}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length >= 2 && autocomplete.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  Tidak ada saran otomatis. Tekan Enter untuk mencari.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Filters Sidebar (Mock) */}
        <div className="hidden md:flex flex-col w-64 border-r bg-white/50 dark:bg-slate-900/50 p-4 shrink-0">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" /> Filter Pencarian
          </h3>
          <ScrollArea className="flex-1">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Kategori</h4>
                <div className="space-y-2">
                  {['Undang-Undang', 'Peraturan Pemerintah', 'Putusan MA', 'Surat Edaran'].map(c => (
                    <label key={c} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-slate-300 text-[#C9A84C] focus:ring-[#C9A84C]" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Tahun</h4>
                <div className="space-y-2">
                  {['2024', '2023', '2022', '2021', '2020'].map(y => (
                    <label key={y} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-slate-300 text-[#C9A84C] focus:ring-[#C9A84C]" />
                      {y}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Results Area */}
        <ScrollArea className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            {activeQuery && !isLoading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400">
                  Menemukan <strong className="text-[#1B2A4A] dark:text-white">{total}</strong> hasil untuk "{activeQuery}"
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Urutkan:</span>
                  <select className="bg-transparent border-none text-[#1B2A4A] dark:text-[#C9A84C] font-medium outline-none cursor-pointer">
                    <option value="relevance">Relevansi</option>
                    <option value="year_desc">Tahun Terbaru</option>
                  </select>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="opacity-50 animate-pulse">
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((doc, idx) => (
                  <Card key={doc.id || idx} className="hover:shadow-md transition-shadow group">
                    <CardContent className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20">
                          {doc.type || 'Dokumen'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs text-slate-500">
                          {doc.year || 'N/A'}
                        </Badge>
                        {doc.rank && (
                          <Badge variant="outline" className="text-xs text-emerald-600 bg-emerald-50 border-emerald-200 flex items-center gap-1">
                            <Target className="h-3 w-3" /> Relevansi: {(doc.rank * 100).toFixed(0)}%
                          </Badge>
                        )}
                        {(doc.category || doc.source) && (
                          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                            <FileText className="h-3 w-3" /> {doc.category} • {doc.source}
                          </span>
                        )}
                      </div>
                      
                      {/* Document Title with HTML Highlight */}
                      <Link href={`/documents/${doc.id}`} className="block group-hover:text-[#C9A84C] transition-colors">
                        <h3 
                          className="text-lg font-bold text-[#1B2A4A] dark:text-white leading-tight mb-2"
                          dangerouslySetInnerHTML={{ __html: doc.highlighted_title || doc.title }}
                        />
                      </Link>
                      
                      {/* Mock snippet since we didn't write full TS_HEADLINE for content in backend yet */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        Dokumen hukum ini memuat regulasi terkait <strong className="text-[#1B2A4A] dark:text-white">{activeQuery}</strong> yang berlaku di Indonesia. Klik untuk melihat detail pasal, ayat, dan penjelasan selengkapnya.
                      </p>
                      
                      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm">
                        <Link href={`/documents/${doc.id}`} className="text-[#C9A84C] font-medium flex items-center gap-1 hover:underline">
                          Baca Dokumen <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm font-medium">
                      Halaman {page} dari {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            ) : activeQuery ? (
              <div className="text-center py-20 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tidak ada hasil ditemukan</h3>
                <p>Coba gunakan kata kunci lain atau kurangi filter.</p>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <Target className="h-12 w-12 mx-auto mb-4 text-slate-200 dark:text-slate-800" />
                <p>Masukkan kata kunci di atas untuk mulai mencari di *Knowledge Base* hukum.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
