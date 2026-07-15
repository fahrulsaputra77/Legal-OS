<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
</script>

<template>
  <div class="flex flex-col gap-6 p-4 md:p-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
        documents
      </h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">
        Modul AI dalam tahap pengembangan.
      </p>
    </div>
    
    <Card class="border-dashed">
      <CardHeader class="text-center pb-2">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Sparkles class="h-6 w-6 text-[#C9A84C]" />
        </div>
        <CardTitle>Segera Hadir</CardTitle>
        <CardDescription>
          Fitur ini sedang dibangun oleh tim AI Legal OS.
        </CardDescription>
      </CardHeader>
      <CardContent class="text-center">
      </CardContent>
    </Card>
  </div>
</template>
