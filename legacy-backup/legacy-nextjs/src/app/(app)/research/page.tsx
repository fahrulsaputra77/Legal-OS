'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Clock, 
  FileText, 
  ChevronRight, 
  BookmarkPlus, 
  Share2, 
  Download, 
  Copy, 
  Target,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Info,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LEGAL_SOURCE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// -----------------------------------------------------------------------------
// Dynamic AI Simulation Database
// -----------------------------------------------------------------------------
// In a real application, this is replaced by the actual embedding -> vector db -> LLM pipeline.
const DB_DOCS = [
  {
    id: 'doc-1',
    title: 'Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan',
    sourceType: 'uu',
    year: '2003',
    reference: 'Pasal 156 ayat (2)',
    excerpt: 'Dalam hal terjadi pemutusan hubungan kerja, pengusaha diwajibkan membayar uang pesangon dan atau uang penghargaan masa kerja dan uang penggantian hak yang seharusnya diterima.',
    content: `Pasal 156\n(1) Dalam hal terjadi pemutusan hubungan kerja, pengusaha diwajibkan membayar uang pesangon dan atau uang penghargaan masa kerja dan uang penggantian hak yang seharusnya diterima.\n(2) Perhitungan uang pesangon sebagaimana dimaksud dalam ayat (1) paling sedikit sebagai berikut:\na. masa kerja kurang dari 1 (satu) tahun, 1 (satu) bulan upah;\nb. masa kerja 1 (satu) tahun atau lebih tetapi kurang dari 2 (dua) tahun, 2 (dua) bulan upah;\nc. masa kerja 2 (dua) tahun atau lebih tetapi kurang dari 3 (tiga) tahun, 3 (tiga) bulan upah;\n...\nh. masa kerja 7 (tujuh) tahun atau lebih tetapi kurang dari 8 (delapan) tahun, 8 (delapan) bulan upah;\ni. masa kerja 8 (delapan) tahun atau lebih, 9 (sembilan) bulan upah.`,
    tags: ['phk', 'pesangon', 'ketenagakerjaan', 'karyawan', 'pekerja'],
    date: '2003-03-25'
  },
  {
    id: 'doc-2',
    title: 'Peraturan Pemerintah Nomor 35 Tahun 2021',
    sourceType: 'pp',
    year: '2021',
    reference: 'Pasal 40',
    excerpt: 'Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja.',
    content: `Pasal 40\n(1) Dalam hal terjadi Pemutusan Hubungan Kerja, Pengusaha wajib membayar uang pesangon dan/atau uang penghargaan masa kerja, dan uang penggantian hak yang seharusnya diterima.\n(2) Uang pesangon sebagaimana dimaksud pada ayat (1) diberikan dengan ketentuan sebagai berikut:\na. masa kerja kurang dari 1 (satu) tahun, 1 (satu) bulan Upah;\nb. masa kerja 1 (satu) tahun atau lebih tetapi kurang dari 2 (dua) tahun, 2 (dua) bulan Upah;\n...\n(3) Uang penghargaan masa kerja sebagaimana dimaksud pada ayat (1) diberikan dengan ketentuan sebagai berikut:\na. masa kerja 3 (tiga) tahun atau lebih tetapi kurang dari 6 (enam) tahun, 2 (dua) bulan Upah;\nb. masa kerja 6 (enam) tahun atau lebih tetapi kurang dari 9 (sembilan) tahun, 3 (tiga) bulan Upah;`,
    tags: ['phk', 'pesangon', 'ketenagakerjaan', 'karyawan', 'pekerja'],
    date: '2021-02-02'
  },
  {
    id: 'doc-3',
    title: 'Putusan Mahkamah Agung Nomor 501 K/Pdt.Sus-PHI/2019',
    sourceType: 'putusan_ma',
    year: '2019',
    reference: 'Kaidah Hukum',
    excerpt: 'PHK sepihak oleh perusahaan tanpa alasan mendesak mewajibkan perusahaan membayar pesangon sebesar 2 (dua) kali ketentuan Pasal 156 ayat (2) UU Ketenagakerjaan.',
    content: `DUDUK PERKARA\nBahwa Penggugat telah bekerja pada Tergugat selama 8 tahun dengan jabatan terakhir sebagai Manajer Operasional. Bahwa pada tanggal 10 Januari 2019 Tergugat melakukan PHK secara sepihak dengan alasan efisiensi tanpa membuktikan perusahaan mengalami kerugian selama 2 tahun berturut-turut.\n\nPERTIMBANGAN HUKUM\nMenimbang, bahwa alasan PHK karena efisiensi tidak dapat dibenarkan apabila perusahaan tidak menutup usahanya, sehingga sesuai Putusan MK No. 19/PUU-IX/2011 dan ketentuan UU 13/2003, Penggugat berhak atas kompensasi pesangon 2 kali ketentuan Pasal 156 ayat (2), 1 kali Uang Penghargaan Masa Kerja Pasal 156 ayat (3), dan Uang Penggantian Hak Pasal 156 ayat (4).\n\nMENGADILI\n1. Mengabulkan gugatan Penggugat untuk sebagian;\n2. Menyatakan Putus Hubungan Kerja antara Penggugat dan Tergugat;\n3. Menghukum Tergugat untuk membayar hak Penggugat sebesar Rp 145.500.000,-`,
    tags: ['phk', 'pesangon', 'ketenagakerjaan', 'karyawan', 'pekerja', 'sepihak', 'efisiensi'],
    date: '2019-08-15'
  },
  {
    id: 'doc-4',
    title: 'Kitab Undang-Undang Hukum Pidana (KUHP)',
    sourceType: 'uu',
    year: '1946',
    reference: 'Pasal 372 & 378',
    excerpt: 'Penggelapan dan Penipuan.',
    content: `Pasal 372\nBarang siapa dengan sengaja dan melawan hukum memiliki barang sesuatu yang seluruhnya atau sebagian adalah kepunyaan orang lain, tetapi yang ada dalam kekuasaannya bukan karena kejahatan diancam karena penggelapan, dengan pidana penjara paling lama empat tahun atau pidana denda paling banyak sembilan ratus rupiah.\n\nPasal 378\nBarang siapa dengan maksud untuk menguntungkan diri sendiri atau orang lain secara melawan hukum, dengan memakai nama palsu atau martabat palsu, dengan tipu muslihat, ataupun rangkaian kebohongan, menggerakkan orang lain untuk menyerahkan barang sesuatu kepadanya, atau supaya memberi hutang maupun menghapuskan piutang, diancam karena penipuan dengan pidana penjara paling lama empat tahun.`,
    tags: ['pidana', 'penipuan', 'penggelapan', 'kriminal'],
    date: '1946-02-26'
  },
  {
    id: 'doc-5',
    title: 'Kitab Undang-Undang Hukum Perdata (KUHPerdata)',
    sourceType: 'uu',
    year: '1847',
    reference: 'Pasal 1365',
    excerpt: 'Perbuatan Melawan Hukum (Onrechtmatige Daad).',
    content: `Pasal 1365\nTiap perbuatan yang melanggar hukum dan membawa kerugian kepada orang lain, mewajibkan orang yang menimbulkan kerugian itu karena kesalahannya untuk menggantikan kerugian tersebut.`,
    tags: ['perdata', 'pmh', 'perbuatan melawan hukum', 'ganti rugi', 'kerugian'],
    date: '1847-04-30'
  },
  {
    id: 'doc-6',
    title: 'Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik',
    sourceType: 'uu',
    year: '2008',
    reference: 'Pasal 27 ayat (3)',
    excerpt: 'Pencemaran nama baik melalui media elektronik.',
    content: `Pasal 27\n(3) Setiap Orang dengan sengaja dan tanpa hak mendistribusikan dan/atau mentransmisikan dan/atau membuat dapat diaksesnya Informasi Elektronik dan/atau Dokumen Elektronik yang memiliki muatan penghinaan dan/atau pencemaran nama baik.`,
    tags: ['ite', 'pencemaran nama baik', 'elektronik', 'pidana', 'internet'],
    date: '2008-04-21'
  }
];

// Helper to simulate RAG logic based on query
const processResearchQuery = (query: string) => {
  const q = query.toLowerCase();
  let matchedDocs = [];
  let synthesisHtml = '';
  let confidence = 0;

  if (q.includes('phk') || q.includes('pesangon') || q.includes('kerja')) {
    matchedDocs = DB_DOCS.filter(d => d.tags.includes('phk'));
    confidence = 94;
    synthesisHtml = `<p className="mb-3">Berdasarkan analisis terhadap <strong>${matchedDocs.length} regulasi dan yurisprudensi</strong>, hak pesangon untuk karyawan yang di-PHK secara sepihak diatur secara tegas dalam <strong>UU Ketenagakerjaan</strong> dan diperbarui melalui <strong>PP 35/2021</strong>.</p>
    <ul className="space-y-2 mb-3 list-disc pl-5">
      <li><strong>Pesangon Utama:</strong> Sesuai Pasal 156 ayat (2) UU 13/2003, besaran pesangon disesuaikan dengan masa kerja karyawan.</li>
      <li><strong>Yurisprudensi Terkait:</strong> Mengacu pada Putusan MA No. 501 K/2019, jika PHK sepihak tanpa alasan mendesak atau efisiensi yang sah, pengadilan dapat mengabulkan gugatan pesangon sebesar <strong>2 (dua) kali ketentuan</strong>.</li>
    </ul>
    <p><strong>Rekomendasi Tindakan:</strong> Siapkan gugatan ke Pengadilan Hubungan Industrial (PHI) dengan menuntut pesangon sesuai ketentuan Pasal 156.</p>`;
  } else if (q.includes('pidana') || q.includes('penipuan') || q.includes('penggelapan')) {
    matchedDocs = DB_DOCS.filter(d => d.tags.includes('pidana'));
    confidence = 89;
    synthesisHtml = `<p className="mb-3">Kasus yang melibatkan unsur penipuan atau penggelapan diatur dalam <strong>KUHP</strong>.</p>
    <ul className="space-y-2 mb-3 list-disc pl-5">
      <li><strong>Penipuan:</strong> Diatur dalam Pasal 378 KUHP dengan ancaman pidana maksimal 4 tahun. Syarat utamanya adalah adanya <em>tipu muslihat atau rangkaian kebohongan</em>.</li>
      <li><strong>Penggelapan:</strong> Diatur dalam Pasal 372 KUHP, berlaku jika barang sudah ada dalam kekuasaan pelaku bukan karena kejahatan.</li>
    </ul>
    <p><strong>Rekomendasi Tindakan:</strong> Laporkan dugaan tindak pidana ke kepolisian dengan melampirkan bukti-bukti transaksi dan komunikasi yang menunjukkan unsur tipu muslihat atau niat jahat (mens rea).</p>`;
  } else if (q.includes('perdata') || q.includes('ganti rugi') || q.includes('melawan hukum') || q.includes('pmh')) {
    matchedDocs = DB_DOCS.filter(d => d.tags.includes('perdata'));
    confidence = 92;
    synthesisHtml = `<p className="mb-3">Gugatan atas Perbuatan Melawan Hukum (PMH) dapat diajukan berdasarkan <strong>Pasal 1365 KUHPerdata</strong>.</p>
    <ul className="space-y-2 mb-3 list-disc pl-5">
      <li><strong>Unsur PMH:</strong> Harus ada perbuatan yang melawan hukum, ada kesalahan, ada kerugian, dan ada hubungan kausalitas antara perbuatan dan kerugian.</li>
      <li><strong>Tuntutan:</strong> Pihak yang dirugikan berhak menuntut ganti rugi materiil maupun immateriil.</li>
    </ul>
    <p><strong>Rekomendasi Tindakan:</strong> Layangkan somasi terlebih dahulu. Jika tidak diindahkan, ajukan gugatan PMH ke Pengadilan Negeri setempat dengan rincian kerugian yang nyata.</p>`;
  } else if (q.includes('ite') || q.includes('pencemaran')) {
    matchedDocs = DB_DOCS.filter(d => d.tags.includes('ite'));
    confidence = 85;
    synthesisHtml = `<p className="mb-3">Pencemaran nama baik di media elektronik diatur secara khusus dalam <strong>UU ITE</strong>.</p>
    <ul className="space-y-2 mb-3 list-disc pl-5">
      <li><strong>Pasal Utama:</strong> Pasal 27 ayat (3) UU ITE melarang distribusi informasi yang memiliki muatan penghinaan atau pencemaran nama baik.</li>
      <li><strong>Delik Aduan:</strong> Tindak pidana ini merupakan delik aduan absolut, artinya hanya korban langsung yang dapat melaporkan.</li>
    </ul>
    <p><strong>Rekomendasi Tindakan:</strong> Amankan barang bukti (screenshot) yang menunjukkan URL dan identitas pelaku, lalu laporkan ke Siber Polri.</p>`;
  } else {
    // Generic fallback
    matchedDocs = DB_DOCS.slice(0, 3);
    confidence = 72;
    synthesisHtml = `<p className="mb-3">Berdasarkan kata kunci <strong>"${query}"</strong>, sistem menemukan beberapa dokumen hukum yang mungkin relevan secara kontekstual.</p>
    <ul className="space-y-2 mb-3 list-disc pl-5">
      <li>Mohon perjelas kata kunci pencarian Anda untuk mendapatkan analisis hukum yang lebih akurat (misal: "PHK sepihak", "Penipuan", "Perbuatan Melawan Hukum").</li>
      <li>AI mencoba mencocokkan teks dengan putusan dan undang-undang terdekat.</li>
    </ul>
    <p><strong>Rekomendasi:</strong> Gunakan terminologi hukum yang lebih spesifik.</p>`;
  }

  // Add random relevance scores to matched docs
  const docsWithScores = matchedDocs.map((doc, index) => ({
    ...doc,
    relevanceScore: Math.max(50, 98 - (index * 7) - Math.floor(Math.random() * 5))
  }));

  return {
    docs: docsWithScores,
    synthesisHtml,
    confidence,
  };
};


export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Research state
  const [resultDocs, setResultDocs] = useState<any[]>([]);
  const [synthesis, setSynthesis] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  // Filters
  const [activeSourceTypes, setActiveSourceTypes] = useState<string[]>([]);
  const [activeYears, setActiveYears] = useState<string[]>([]);

  const selectedDoc = resultDocs.find(d => d.id === selectedDocId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Clear previous results and set loading state
    setIsSearching(true);
    setHasSearched(false);
    setResultDocs([]);
    setSynthesis('');
    setConfidenceScore(0);
    setSelectedDocId(null);
    
    // Simulate backend processing latency (Embedding -> Vector DB -> LLM)
    setTimeout(() => {
      const data = processResearchQuery(searchQuery);
      setResultDocs(data.docs);
      setSynthesis(data.synthesisHtml);
      setConfidenceScore(data.confidence);
      setHasSearched(true);
      if (data.docs.length > 0) {
        setSelectedDocId(data.docs[0].id);
      }
      setIsSearching(false);
    }, 2000);
  };

  const toggleSourceType = (id: string) => {
    setActiveSourceTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleYear = (year: string) => {
    setActiveYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const filteredDocs = resultDocs.filter(doc => {
    if (activeSourceTypes.length > 0 && !activeSourceTypes.includes(doc.sourceType)) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] overflow-hidden gap-4 fade-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Legal Research
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Telusuri jutaan dokumen hukum dengan sintesis kecerdasan buatan.
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-6 mt-2">
        {/* LEFT PANEL: FILTERS (Hidden on small screens) */}
        <div className="hidden lg:flex w-64 shrink-0 flex-col gap-6 overflow-y-auto pr-2 pb-8">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-[#C9A84C]" />
              Filter Sumber
            </h3>
            <div className="flex flex-col gap-1.5">
              {LEGAL_SOURCE_TYPES.slice(0, 10).map((source) => {
                const isActive = activeSourceTypes.includes(source.id);
                return (
                  <button
                    key={source.id}
                    onClick={() => toggleSourceType(source.id)}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                      isActive 
                        ? "bg-[#C9A84C]/10 text-[#C9A84C] font-medium" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <span className="truncate">{source.label}</span>
                    {isActive && <div className="h-2 w-2 rounded-full bg-[#C9A84C]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-[#C9A84C]" />
              Tahun Penetapan
            </h3>
            <div className="flex flex-wrap gap-2">
              {['2024', '2023', '2022', '2021', '2020', '< 2020'].map((year) => {
                const isActive = activeYears.includes(year);
                return (
                  <Badge 
                    key={year} 
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      isActive ? "bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                    onClick={() => toggleYear(year)}
                  >
                    {year}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: SEARCH & RESULTS */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <form onSubmit={handleSearch} className="shrink-0 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Coba: hak pesangon PHK sepihak, atau unsur penipuan KUHP..."
                className="pl-10 pr-24 py-6 text-base bg-white dark:bg-slate-950 shadow-sm border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-[#C9A84C]"
              />
              <Button 
                type="submit" 
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#C9A84C] hover:bg-[#A68A3D] text-white rounded-lg px-6 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Riset'}
              </Button>
            </div>
          </form>

          {isSearching ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 animate-pulse">
              <Loader2 className="h-10 w-10 text-[#C9A84C] animate-spin mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-2">Memproses Kueri Riset...</h3>
              <p className="max-w-md text-sm">
                Mencari preseden, menganalisis undang-undang, dan menyusun sintesis hukum.
              </p>
            </div>
          ) : hasSearched ? (
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-4 pb-8">
                
                {/* AI SYNTHESIS CARD */}
                <Card className="border-[#C9A84C]/30 shadow-md bg-gradient-to-br from-white to-[#C9A84C]/5 dark:from-slate-900 dark:to-[#C9A84C]/10 overflow-hidden relative fade-in">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C]" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-[#1B2A4A] dark:text-slate-200">
                        <Sparkles className="h-5 w-5 text-[#C9A84C]" />
                        Sintesis AI
                      </CardTitle>
                      <Badge variant="outline" className={cn(
                        "bg-white/50 dark:bg-slate-950/50",
                        confidenceScore >= 90 ? "text-emerald-600 border-emerald-600/30" : "text-[#C9A84C] border-[#C9A84C]/30"
                      )}>
                        Tingkat Keyakinan: {confidenceScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <div dangerouslySetInnerHTML={{ __html: synthesis }} />
                  </CardContent>
                  <CardFooter className="pt-0 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Disintesis dari {filteredDocs.length} dokumen relevan.
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-green-600">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <div className="flex items-center justify-between mt-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dokumen Referensi Teratas</h3>
                  <span className="text-sm text-slate-500">{filteredDocs.length} Hasil ditemukan</span>
                </div>

                {/* RESULTS LIST */}
                <div className="flex flex-col gap-3">
                  {filteredDocs.map((doc) => {
                    const sourceInfo = LEGAL_SOURCE_TYPES.find(t => t.id === doc.sourceType);
                    const isSelected = selectedDocId === doc.id;
                    
                    return (
                      <Card 
                        key={doc.id} 
                        className={cn(
                          "cursor-pointer transition-all hover:border-[#C9A84C]/50 hover:shadow-md group fade-in",
                          isSelected ? "border-[#C9A84C] ring-1 ring-[#C9A84C] bg-white dark:bg-slate-900" : "bg-white/50 dark:bg-slate-950/50"
                        )}
                        onClick={() => setSelectedDocId(doc.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {sourceInfo && (
                                <Badge variant="secondary" className={cn("font-medium", sourceInfo.color)}>
                                  {sourceInfo.label}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-slate-500">
                                {doc.year}
                              </Badge>
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {doc.relevanceScore}% Cocok
                              </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-[#C9A84C] shrink-0">
                              <BookmarkPlus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <h4 className="font-semibold text-[#1B2A4A] dark:text-slate-200 line-clamp-1 mb-1">
                            {doc.title}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            <strong className="text-slate-700 dark:text-slate-300">{doc.reference}:</strong> {doc.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-2">Mulai Riset Hukum Anda</h3>
              <p className="max-w-md text-sm">
                Ketik pertanyaan hukum, pasal, atau kasus untuk mencari di database regulasi dan yurisprudensi terlengkap kami.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: READING PANE (Hidden on small screens unless active) */}
        {hasSearched && selectedDoc && (
          <div className="hidden xl:flex w-[400px] shrink-0 flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm fade-in">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C9A84C]" />
                Penampil Dokumen
              </h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Bagikan Referensi">
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Unduh PDF">
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-5">
              <div className="flex flex-col gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-[#1B2A4A] border-[#1B2A4A] dark:text-slate-300 dark:border-slate-700">
                    {LEGAL_SOURCE_TYPES.find(t => t.id === selectedDoc.sourceType)?.label}
                  </Badge>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedDoc.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Diundangkan: {selectedDoc.year}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      Status: Berlaku
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-[#C9A84C] mb-2">{selectedDoc.reference}</h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:mb-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedDoc.content}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#1B2A4A]/5 dark:bg-white/5 rounded-lg border border-[#1B2A4A]/10 dark:border-white/10">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C9A84C]" />
                    Catatan AI
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Dokumen ini sangat relevan (Tingkat Kecocokan {selectedDoc.relevanceScore}%) karena secara eksplisit mengatur tentang {selectedDoc.excerpt.toLowerCase()}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-3 flex items-center justify-center gap-2">
                    Jadikan Landasan Hukum <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
