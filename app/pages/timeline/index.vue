<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { 
  GitCommit, 
  ArrowRight, 
  Search, 
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const docId = ref('mock-uu-13')
const inputVal = ref('mock-uu-13')
const timeline = ref<any[]>([])
const loading = ref(false)

const fetchTimeline = async () => {
  if (!docId.value) return
  loading.value = true
  try {
    const res = await fetch(`/api/v1/relations/timeline?documentId=${docId.value}`)
    const json = await res.json()
    if (json.data) {
      timeline.value = json.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTimeline()
})

watch(docId, () => {
  fetchTimeline()
})

const handleSearch = (e: Event) => {
  e.preventDefault()
  docId.value = inputVal.value
}

const getRelationColor = (type: string) => {
  switch (type) {
    case 'MENGUBAH': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'MENCABUT': return 'bg-red-100 text-red-800 border-red-200'
    case 'MENGGANTIKAN': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'MELAKSANAKAN': return 'bg-blue-100 text-blue-800 border-blue-200'
    default: return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0f172a]">
    <div class="bg-white dark:bg-slate-900 border-b p-6 shrink-0">
      <h1 class="text-2xl font-bold text-[#1B2A4A] dark:text-white flex items-center gap-2 mb-2">
        <Calendar class="h-6 w-6 text-[#C9A84C]" />
        Timeline Perubahan Regulasi
      </h1>
      <p class="text-muted-foreground text-sm max-w-3xl mb-6">
        Lacak riwayat hidup sebuah dokumen hukum. Lihat kapan dokumen ini diubah, dicabut, atau digantikan oleh regulasi baru secara kronologis.
      </p>

      <form @submit="handleSearch" class="flex items-center gap-2 max-w-md">
        <Input 
          placeholder="Masukkan ID Dokumen..."
          v-model="inputVal"
          class="flex-1"
        />
        <Button type="submit" class="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90">Cari Timeline</Button>
      </form>
    </div>

    <ScrollArea class="flex-1 p-6 md:p-10">
      <div class="max-w-3xl mx-auto">
        <div v-if="loading" class="text-center py-10 text-slate-500 animate-pulse">Memuat riwayat dokumen...</div>
        
        <div v-else-if="timeline.length === 0" class="text-center py-20 text-slate-500">
          <AlertCircle class="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p>Tidak ada riwayat perubahan ditemukan untuk dokumen ini.</p>
        </div>
        
        <div v-else class="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-6 space-y-8 pb-10">
          <div v-for="(item, idx) in timeline" :key="item.id || idx" class="relative pl-8 md:pl-10">
            <!-- Timeline Dot -->
            <div class="absolute -left-3 md:-left-3.5 top-1 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border-4 border-[#C9A84C] flex items-center justify-center shadow-sm">
              <div class="h-2 w-2 rounded-full bg-[#1B2A4A] dark:bg-white" />
            </div>

            <Card class="hover:shadow-md transition-shadow">
              <CardContent class="p-4 md:p-5">
                <div class="flex flex-wrap items-center gap-2 mb-2 text-sm text-slate-500">
                  <Calendar class="h-4 w-4" />
                  <time :datetime="item.date">{{ new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
                </div>
                
                <div class="mb-3">
                  <Badge variant="outline" :class="`text-xs ${getRelationColor(item.type)}`">
                    {{ item.type }}
                  </Badge>
                </div>

                <h3 class="font-semibold text-lg text-[#1B2A4A] dark:text-white leading-snug">
                  {{ item.title }}
                </h3>
                
                <p v-if="item.description" class="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                  {{ item.description }}
                </p>

                <div class="mt-4 pt-3 border-t">
                  <Button variant="ghost" size="sm" class="text-[#C9A84C] hover:text-[#C9A84C]/80 p-0 h-auto">
                    Lihat Dokumen <ArrowRight class="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
