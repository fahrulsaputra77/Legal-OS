'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Bookmark, 
  Printer, 
  Download, 
  Copy, 
  Share2,
  CheckCircle2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- MOCK DATA ---
const MOCK_DOCUMENT = {
  id: 'uu-13-2003',
  type: 'Undang-Undang',
  number: '13',
  year: '2003',
  title: 'Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan',
  status: 'Berlaku',
  date: '25 Maret 2003',
  chapters: [
    {
      id: 'bab-1',
      title: 'BAB I',
      subtitle: 'KETENTUAN UMUM',
      articles: [
        {
          id: 'pasal-1',
          number: '1',
          paragraphs: [
            { id: 'ayat-1-1', number: '1', content: 'Ketenagakerjaan adalah segala hal yang berhubungan dengan tenaga kerja pada waktu sebelum, selama, dan sesudah masa kerja.' },
            { id: 'ayat-1-2', number: '2', content: 'Tenaga kerja adalah setiap orang yang mampu melakukan pekerjaan guna menghasilkan barang dan/atau jasa baik untuk memenuhi kebutuhan sendiri maupun untuk masyarakat.' },
            { id: 'ayat-1-3', number: '3', content: 'Pekerja/buruh adalah setiap orang yang bekerja dengan menerima upah atau imbalan dalam bentuk lain.' },
          ],
          explanation: 'Cukup jelas.'
        }
      ]
    },
    {
      id: 'bab-2',
      title: 'BAB II',
      subtitle: 'LANDASAN, ASAS, DAN TUJUAN',
      articles: [
        {
          id: 'pasal-2',
          number: '2',
          paragraphs: [
            { id: 'ayat-2-1', number: '', content: 'Pembangunan ketenagakerjaan berlandaskan Pancasila dan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.' }
          ]
        },
        {
          id: 'pasal-3',
          number: '3',
          paragraphs: [
            { id: 'ayat-3-1', number: '', content: 'Pembangunan ketenagakerjaan diselenggarakan atas asas keterpaduan dengan melalui koordinasi fungsional lintas sektoral pusat dan daerah.' }
          ]
        }
      ]
    },
    {
      id: 'bab-12',
      title: 'BAB XII',
      subtitle: 'PEMUTUSAN HUBUNGAN KERJA',
      articles: [
        {
          id: 'pasal-156',
          number: '156',
          paragraphs: [
            { id: 'ayat-156-1', number: '1', content: 'Dalam hal terjadi pemutusan hubungan kerja, pengusaha diwajibkan membayar uang pesangon dan/atau uang penghargaan masa kerja dan uang penggantian hak yang seharusnya diterima.' },
            { id: 'ayat-156-2', number: '2', content: 'Perhitungan uang pesangon sebagaimana dimaksud dalam ayat (1) paling sedikit sebagai berikut: ...' }
          ],
          explanation: 'Pemutusan hubungan kerja dalam pasal ini meliputi pemutusan yang terjadi di perusahaan swasta maupun BUMN.'
        }
      ]
    }
  ],
  attachments: [
    { id: 'lamp-1', title: 'Lampiran I - Penjelasan Umum' }
  ]
};

export default function DocumentViewerPage({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChapter, setActiveChapter] = useState(MOCK_DOCUMENT.chapters[0]?.id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Intersection Observer to highlight active TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry that covers a significant portion
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setActiveChapter(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -40% 0px', threshold: [0.1, 0.5, 1.0] }
    );

    MOCK_DOCUMENT.chapters.forEach(chap => {
      const el = document.getElementById(chap.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset for sticky header
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredChapters = MOCK_DOCUMENT.chapters.filter(chap => 
    chap.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    chap.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
      
      {/* LEFT SIDEBAR (TOC) */}
      <div className="hidden md:flex flex-col w-72 border-r bg-muted/20 shrink-0">
        <div className="p-4 border-b">
          <Link href="/documents" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Library
          </Link>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari BAB..." 
              className="pl-8 bg-background" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredChapters.map(chap => (
              <button
                key={chap.id}
                onClick={() => scrollToAnchor(chap.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex flex-col gap-0.5",
                  activeChapter === chap.id 
                    ? "bg-[#1B2A4A]/10 text-[#1B2A4A] dark:bg-[#C9A84C]/20 dark:text-[#C9A84C] font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="font-semibold">{chap.title}</span>
                <span className="text-xs truncate opacity-80">{chap.subtitle}</span>
              </button>
            ))}
            
            {MOCK_DOCUMENT.attachments.length > 0 && (
              <>
                <Separator className="my-2" />
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Lampiran
                </div>
                {MOCK_DOCUMENT.attachments.map(att => (
                  <button
                    key={att.id}
                    onClick={() => scrollToAnchor(att.id)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors truncate"
                  >
                    {att.title}
                  </button>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-y-auto print:overflow-visible">
        
        {/* Sticky Action Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b p-4 flex items-center justify-between shadow-sm print:hidden">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20">
                {MOCK_DOCUMENT.type}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {MOCK_DOCUMENT.status}
              </Badge>
            </div>
            <h1 className="text-lg font-bold truncate text-foreground">
              {MOCK_DOCUMENT.title}
            </h1>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Bookmark Dokumen">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={handlePrint} title="Cetak / Simpan PDF">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Download Asli (PDF)">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Bagikan">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 md:p-12 max-w-4xl mx-auto w-full print:p-0 print:max-w-none">
          
          <div className="text-center mb-16 space-y-4">
            <BookOpen className="h-12 w-12 mx-auto text-[#C9A84C] opacity-80" />
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#1B2A4A] dark:text-white uppercase">
              {MOCK_DOCUMENT.type} <br/> 
              REPUBLIK INDONESIA
            </h2>
            <p className="text-lg md:text-xl font-semibold">
              NOMOR {MOCK_DOCUMENT.number} TAHUN {MOCK_DOCUMENT.year}
            </p>
            <p className="text-lg md:text-xl font-semibold">
              TENTANG
            </p>
            <p className="text-xl md:text-2xl font-bold uppercase text-[#C9A84C]">
              {MOCK_DOCUMENT.title.replace(/Undang-Undang Nomor \d+ Tahun \d+ tentang /i, '')}
            </p>
          </div>

          <div className="space-y-12">
            {MOCK_DOCUMENT.chapters.map(chap => (
              <section key={chap.id} id={chap.id} className="scroll-mt-28 print:break-before-auto">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold uppercase">{chap.title}</h3>
                  <h4 className="text-lg font-semibold uppercase">{chap.subtitle}</h4>
                </div>

                <div className="space-y-8">
                  {chap.articles.map(art => (
                    <div key={art.id} id={art.id} className="scroll-mt-28 group relative">
                      
                      {/* Copy Action Floating */}
                      <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block print:hidden">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => copyToClipboard(`Pasal ${art.number}\n${art.paragraphs.map(p => p.number ? `(${p.number}) ${p.content}` : p.content).join('\n')}`, art.id)}
                        >
                          {copiedId === art.id ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>

                      <h5 className="font-bold text-center mb-4">Pasal {art.number}</h5>
                      
                      <div className="space-y-3 text-justify leading-relaxed">
                        {art.paragraphs.map(par => (
                          <div key={par.id} id={par.id} className="flex gap-4">
                            {par.number && (
                              <span className="shrink-0 w-6 font-medium">({par.number})</span>
                            )}
                            <span className={cn("flex-1", !par.number && "indent-8")}>
                              {par.content}
                            </span>
                          </div>
                        ))}
                      </div>

                      {(art as any).explanation && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm border-l-4 border-[#C9A84C]">
                          <p className="font-semibold mb-1 text-[#1B2A4A] dark:text-white">Penjelasan Pasal {art.number}:</p>
                          <p className="text-muted-foreground">{(art as any).explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Attachments Section */}
            {MOCK_DOCUMENT.attachments.length > 0 && (
              <div className="pt-12 border-t">
                {MOCK_DOCUMENT.attachments.map(att => (
                  <section key={att.id} id={att.id} className="scroll-mt-28 mb-8 print:break-before-page">
                    <h3 className="text-xl font-bold uppercase text-center mb-6">{att.title}</h3>
                    <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                      <FileText className="h-10 w-10 mb-2 opacity-50" />
                      <p>Dokumen lampiran ditampilkan di sini atau tersedia untuk diunduh.</p>
                      <Button variant="outline" className="mt-4 gap-2">
                        <Download className="h-4 w-4" /> Download Lampiran
                      </Button>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Icon for missing import
function FileText({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
}
