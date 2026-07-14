'use client';

import React, { useState } from 'react';
import { 
  Database, 
  FileText, 
  BookOpen, 
  List, 
  AlignLeft, 
  Paperclip, 
  DownloadCloud, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  HardDrive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock Data for Import History
const MOCK_IMPORT_HISTORY = [
  { id: 'IMP-001', source: 'JDIH BPHN', type: 'UU', items: 1250, status: 'SUCCESS', date: '2026-07-13T08:30:00Z' },
  { id: 'IMP-002', source: 'Mahkamah Agung', type: 'Putusan', items: 5420, status: 'SUCCESS', date: '2026-07-12T14:15:00Z' },
  { id: 'IMP-003', source: 'Kemenkumham', type: 'PP', items: 320, status: 'PARTIAL', date: '2026-07-11T09:45:00Z' },
  { id: 'IMP-004', source: 'JDIH BPHN', type: 'Perpres', items: 85, status: 'FAILED', date: '2026-07-10T16:20:00Z' },
  { id: 'IMP-005', source: 'Mahkamah Konstitusi', type: 'Putusan', items: 45, status: 'SUCCESS', date: '2026-07-09T11:10:00Z' },
  { id: 'IMP-006', source: 'OJK', type: 'POJK', items: 210, status: 'SUCCESS', date: '2026-07-08T10:05:00Z' },
  { id: 'IMP-007', source: 'Kemenkeu', type: 'PMK', items: 430, status: 'SUCCESS', date: '2026-07-07T13:40:00Z' },
  { id: 'IMP-008', source: 'JDIH BPHN', type: 'UU', items: 15, status: 'SUCCESS', date: '2026-07-06T15:30:00Z' },
];

export default function LegalDatabaseAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Upload & Progress State (Simulated)
  const [isUploading, setIsUploading] = useState(false);
  const [activeJob, setActiveJob] = useState<any>(null);
  
  const handleUploadClick = () => {
    // Simulate upload starting
    setActiveJob({
      id: `IMP-${Math.floor(Math.random() * 1000)}`,
      fileName: 'undang_undang_2024.json',
      status: 'PROCESSING',
      totalRecords: 1250,
      processed: 0,
      failed: 0,
    });
    setIsUploading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setActiveJob((prev: any) => {
        if (!prev || prev.status !== 'PROCESSING') return prev;
        const nextProcessed = prev.processed + 50;
        if (nextProcessed >= prev.totalRecords) {
          clearInterval(interval);
          setIsUploading(false);
          return { ...prev, processed: prev.totalRecords, status: 'COMPLETED' };
        }
        return { ...prev, processed: nextProcessed };
      });
    }, 1000);
  };

  const handleJobAction = (action: string) => {
    setActiveJob((prev: any) => {
      if (!prev) return prev;
      if (action === 'PAUSE') return { ...prev, status: 'PAUSED' };
      if (action === 'RESUME') return { ...prev, status: 'PROCESSING' }; // Progress interval needs restart in a real app
      if (action === 'CANCEL') { setIsUploading(false); return { ...prev, status: 'CANCELLED' }; }
      if (action === 'ROLLBACK') { setIsUploading(false); return null; }
      return prev;
    });
  };

  // Filter & Search Logic
  const filteredData = MOCK_IMPORT_HISTORY.filter(item => {
    const matchesSearch = item.source.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Success</Badge>;
      case 'PARTIAL': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Partial</Badge>;
      case 'FAILED': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      case 'PROCESSING': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse">Processing</Badge>;
      case 'PAUSED': return <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20">Paused</Badge>;
      case 'CANCELLED': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1B2A4A] dark:text-white flex items-center gap-2">
            <Database className="h-8 w-8 text-[#C9A84C]" />
            Legal Database Admin
          </h2>
          <p className="text-muted-foreground mt-1">
            Dashboard manajemen *Knowledge Base* hukum nasional.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" disabled={isUploading}>
            <Database className="h-4 w-4" /> Sync Database
          </Button>
          <Button 
            className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <DownloadCloud className="h-4 w-4 text-[#C9A84C]" /> Import Manual
          </Button>
        </div>
      </div>

      {/* Active Job Progress */}
      {activeJob && (
        <Card className="border-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 w-full md:w-1/2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{activeJob.fileName}</h3>
                  {getStatusBadge(activeJob.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Processed {activeJob.processed} of {activeJob.totalRecords} records.
                </p>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(activeJob.processed / activeJob.totalRecords) * 100}%` }} 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeJob.status === 'PROCESSING' && (
                  <Button variant="outline" size="sm" onClick={() => handleJobAction('PAUSE')}>Pause</Button>
                )}
                {activeJob.status === 'PAUSED' && (
                  <Button variant="outline" size="sm" onClick={() => handleJobAction('RESUME')}>Resume</Button>
                )}
                {(activeJob.status === 'PROCESSING' || activeJob.status === 'PAUSED') && (
                  <Button variant="destructive" size="sm" onClick={() => handleJobAction('CANCEL')}>Cancel</Button>
                )}
                {['COMPLETED', 'CANCELLED', 'FAILED'].includes(activeJob.status) && (
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleJobAction('ROLLBACK')}>Rollback</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Dokumen</p>
            <h3 className="text-2xl font-bold">14,205</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total BAB</p>
            <h3 className="text-2xl font-bold">8,432</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <List className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Pasal</p>
            <h3 className="text-2xl font-bold">142,890</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-full">
              <AlignLeft className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Ayat</p>
            <h3 className="text-2xl font-bold">384,120</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-full">
              <Paperclip className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Lampiran</p>
            <h3 className="text-2xl font-bold">5,210</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <DownloadCloud className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Import Hari Ini</p>
            <h3 className="text-2xl font-bold">125</h3>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: System Status & Import History */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: DB & Storage Status */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Status Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">PostgreSQL Sync</span>
                <Badge variant="outline" className="text-emerald-500">Connected</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Vector DB (Pinecone)</span>
                <Badge variant="outline" className="text-emerald-500">Connected</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Last Auto-Backup</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-blue-500" /> Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Relational DB</span>
                  <span className="font-medium">4.2 GB / 50 GB</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '8.4%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vector Embeddings</span>
                  <span className="font-medium">12.5 GB / 100 GB</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '12.5%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Import History Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Riwayat Import</CardTitle>
                <CardDescription>Log sinkronisasi data dari berbagai repositori hukum.</CardDescription>
              </div>
              
              {/* Filters & Search */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cari sumber..." 
                    className="pl-8 w-[150px] lg:w-[200px] h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select 
                    className="flex h-9 w-[110px] items-center justify-between rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="ALL">Semua</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">ID Import</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                        Sumber <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipe</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Jumlah Item</th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium text-xs">{item.id}</td>
                        <td className="p-4 align-middle text-sm">{item.source}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="secondary" className="font-normal text-xs">{item.type}</Badge>
                        </td>
                        <td className="p-4 align-middle text-right text-sm">
                          {new Intl.NumberFormat('id-ID').format(item.items)}
                        </td>
                        <td className="p-4 align-middle text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="p-4 align-middle text-right text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 h-24 text-center align-middle text-muted-foreground">
                        Tidak ada riwayat import ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} entri
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium">
                    {currentPage} / {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
