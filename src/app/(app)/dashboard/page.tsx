'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Scale,
  CheckCircle,
  Users,
  DollarSign,
  Clock,
  FileText,
  Bot,
  Briefcase,
  Target,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

const revenueData = [
  { name: 'Jan', value: 180 },
  { name: 'Feb', value: 210 },
  { name: 'Mar', value: 195 },
  { name: 'Apr', value: 240 },
  { name: 'Mei', value: 220 },
  { name: 'Jun', value: 280 },
  { name: 'Jul', value: 245 },
];

const caseDistribution = [
  { name: 'Perdata', value: 35, color: '#1B2A4A' },
  { name: 'Pidana', value: 22, color: '#C9A84C' },
  { name: 'PHI', value: 18, color: '#10B981' },
  { name: 'PTUN', value: 12, color: '#6366F1' },
  { name: 'Arbitrase', value: 8, color: '#F59E0B' },
  { name: 'Lainnya', value: 5, color: '#94A3B8' },
];

const formatCurrency = (value: number) => {
  return 'Rp ' + new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Ringkasan aktivitas dan performa firma hukum Anda.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Perkara Aktif</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Scale className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Perkara Selesai</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +8% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Success Rate</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-[#C9A84C]">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1B2A4A] dark:text-white">87.5%</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +3.2% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Klien</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +15% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1B2A4A] text-white border-none shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-slate-300">Pendapatan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold tracking-tight">{formatCurrency(245800000)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#C9A84C] to-[#A68A3D] text-white border-none shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Briefcase className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-white/80">Pendapatan Tahunan</CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold tracking-tight">{formatCurrency(2890000000)}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Produktivitas</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 dark:bg-slate-800">
              <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Jam Kerja Teragih</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">168 <span className="text-sm font-normal text-slate-500">jam</span></div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 dark:bg-slate-800">
              <div className="bg-[#6366F1] h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-none shadow-sm col-span-1">
          <CardHeader>
            <CardTitle>Tren Pendapatan</CardTitle>
            <CardDescription>Pendapatan 7 bulan terakhir (dalam juta Rupiah)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B2A4A" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1B2A4A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}Jt`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`Rp ${value} Juta`, 'Pendapatan']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#1B2A4A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm col-span-1">
          <CardHeader>
            <CardTitle>Distribusi Perkara</CardTitle>
            <CardDescription>Berdasarkan jenis kasus aktif</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {caseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [`${value} Perkara`, 'Jumlah']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3 Columns Lists */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Deadline */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              Deadline Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="space-y-0">
                {[
                  { date: '15 Jul', title: 'PT Maju vs CV Jaya', type: 'Sidang', priority: 'high', color: 'bg-red-500' },
                  { date: '18 Jul', title: 'Jawaban Perkara Waris', type: 'Deadline', priority: 'urgent', color: 'bg-red-700' },
                  { date: '22 Jul', title: 'Mediasi PHI PT Abadi', type: 'Mediasi', priority: 'medium', color: 'bg-amber-500' },
                  { date: '25 Jul', title: 'Pembuktian Wanprestasi', type: 'Sidang', priority: 'high', color: 'bg-red-500' },
                  { date: '01 Aug', title: 'Memori Kasasi', type: 'Deadline', priority: 'medium', color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b last:border-0">
                    <div className="flex flex-col items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 w-12 h-12 shrink-0">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.date.split(' ')[0]}</span>
                      <span className="text-[10px] uppercase text-slate-500">{item.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate">{item.title}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1 rounded-sm">{item.type}</Badge>
                        <div className="flex items-center gap-1">
                          <div className={`h-1.5 w-1.5 rounded-full ${item.color}`}></div>
                          <span className="text-[10px] text-slate-500 capitalize">{item.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              Dokumen Terbaru
              <Button variant="link" size="sm" className="h-auto p-0 text-[#C9A84C]">Lihat Semua</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="space-y-0">
                {[
                  { name: 'Gugatan_PHI.docx', type: 'Gugatan', time: '2 jam lalu', ext: 'docx' },
                  { name: 'Legal_Opinion_Akuisisi.pdf', type: 'Legal Opinion', time: '5 jam lalu', ext: 'pdf' },
                  { name: 'Kontrak_Sewa.docx', type: 'Kontrak', time: '1 hari lalu', ext: 'docx' },
                  { name: 'Somasi_Hutang.pdf', type: 'Somasi', time: '2 hari lalu', ext: 'pdf' },
                  { name: 'NDA_Final.docx', type: 'NDA', time: '3 hari lalu', ext: 'docx' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b last:border-0 cursor-pointer">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      item.ext === 'pdf' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.type} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Activity */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#C9A84C]" />
              Aktivitas AI Terkini
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  { module: 'Copilot', desc: 'Analisis kontrak kerja PT Maju', time: '30 mnt lalu', icon: Bot },
                  { module: 'Research', desc: 'Pencarian yurisprudensi PHK', time: '1 jam lalu', icon: Scale },
                  { module: 'Drafting', desc: 'Generate gugatan wanprestasi', time: '3 jam lalu', icon: FileText },
                  { module: 'Analyzer', desc: 'Analisis SWOT perkara perdata', time: '5 jam lalu', icon: Target },
                  { module: 'Review', desc: 'Review NDA PT Tech', time: '1 hari lalu', icon: CheckCircle },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active p-4 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-white dark:border-slate-900 shadow-sm z-10 group-hover:bg-[#1B2A4A] group-hover:text-white transition-colors">
                        <item.icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#C9A84C]">{item.module}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{item.desc}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
