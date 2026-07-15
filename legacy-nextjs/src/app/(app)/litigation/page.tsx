import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function litigationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
          litigation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Modul AI dalam tahap pengembangan.
        </p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Sparkles className="h-6 w-6 text-[#C9A84C]" />
          </div>
          <CardTitle>Segera Hadir</CardTitle>
          <CardDescription>
            Fitur ini sedang dibangun oleh tim AI Legal OS.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
        </CardContent>
      </Card>
    </div>
  );
}
