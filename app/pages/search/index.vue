<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
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
} from 'lucide-vue-next'
import { NuxtLink } from '#components'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const query = ref('')
const activeQuery = ref('')
const results = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

const autocomplete = ref<any[]>([])
const showAutocomplete = ref(false)
const searchHistory = ref<any[]>([])

const searchRef = ref<HTMLElement | null>(null)

// Fetch History on mount
onMounted(() => {
  fetch('/api/v1/search/history')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) searchHistory.value = data
    })
    .catch(console.error)
})

// Handle click outside to close autocomplete
const handleClickOutside = (event: MouseEvent) => {
  if (searchRef.value && !searchRef.value.contains(event.target as Node)) {
    showAutocomplete.value = false
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside)
})

// Autocomplete fetching
let delayDebounceFn: ReturnType<typeof setTimeout>
watch(query, (newQuery) => {
  clearTimeout(delayDebounceFn)
  delayDebounceFn = setTimeout(() => {
    if (newQuery.length >= 2) {
      fetch(`/api/v1/search/autocomplete?q=${encodeURIComponent(newQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) autocomplete.value = data
        })
        .catch(console.error)
    } else {
      autocomplete.value = []
    }
  }, 300)
})

// Main Search fetching
watch([activeQuery, page], () => {
  if (!activeQuery.value) return
  isLoading.value = true
  fetch(`/api/v1/search?q=${encodeURIComponent(activeQuery.value)}&page=${page.value}&limit=10`)
    .then(res => res.json())
    .then(data => {
      if (data.data) {
        results.value = data.data
        total.value = data.total || 0
        totalPages.value = data.totalPages || 1
      }
    })
    .catch(console.error)
    .finally(() => isLoading.value = false)
})

const handleSearchSubmit = (e: Event) => {
  e.preventDefault()
  if (!query.value.trim()) return
  activeQuery.value = query.value
  page.value = 1
  showAutocomplete.value = false
  
  // Optimistically add to history
  if (!searchHistory.value.find(h => h.query === query.value)) {
    searchHistory.value = [{ id: Date.now().toString(), query: query.value }, ...searchHistory.value].slice(0, 10)
  }
}

const handleSelectAutocomplete = (title: string) => {
  query.value = title
  activeQuery.value = title
  page.value = 1
  showAutocomplete.value = false
}

const handleSelectHistory = (historyQuery: string) => {
  query.value = historyQuery
  activeQuery.value = historyQuery
  page.value = 1
  showAutocomplete.value = false
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0f172a]">
    <!-- HEADER SECTION -->
    <div class="bg-white dark:bg-slate-900 border-b p-6 md:p-8 flex flex-col items-center shrink-0">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-[#1B2A4A] dark:text-white mb-2 flex items-center gap-2">
        <Search class="h-8 w-8 text-[#C9A84C]" />
        Mesin Pencari Hukum
      </h1>
      <p class="text-muted-foreground mb-8 text-center max-w-2xl">
        Pencarian *Full Text* berbasis PostgreSQL (Non-AI). Mendukung Ranking Relevansi, Autocomplete, History, dan Highlight Kata Kunci.
      </p>

      <div class="w-full max-w-3xl relative" ref="searchRef">
        <form @submit="handleSearchSubmit" class="relative flex items-center">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            class="w-full pl-12 pr-24 h-14 text-lg rounded-full shadow-sm border-slate-300 dark:border-slate-700 focus-visible:ring-[#C9A84C]"
            placeholder="Cari UU, PP, Pasal, atau topik hukum..."
            v-model="query"
            @focus="showAutocomplete = true"
          />
          <Button 
            type="submit" 
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white"
          >
            Cari
          </Button>
        </form>

        <!-- Autocomplete & History Dropdown -->
        <div v-if="showAutocomplete && (query.length >= 2 || searchHistory.length > 0)" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          
          <div v-if="query.length < 2 && searchHistory.length > 0" class="p-2">
            <h4 class="text-xs font-semibold text-slate-500 uppercase px-3 py-2 flex items-center gap-1">
              <History class="h-3 w-3" /> Pencarian Terakhir
            </h4>
            <button
              v-for="h in searchHistory"
              :key="h.id"
              class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center gap-2"
              @click="handleSelectHistory(h.query)"
            >
              <Clock class="h-4 w-4 text-slate-400" />
              {{ h.query }}
            </button>
          </div>

          <div v-if="query.length >= 2 && autocomplete.length > 0" class="p-2">
            <h4 class="text-xs font-semibold text-slate-500 uppercase px-3 py-2">Saran Pencarian</h4>
            <button
              v-for="item in autocomplete"
              :key="item.id"
              class="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex flex-col"
              @click="handleSelectAutocomplete(item.title)"
            >
              <span class="font-medium line-clamp-1">{{ item.title }}</span>
              <span class="text-xs text-slate-500">{{ item.type }} {{ item.year }}</span>
            </button>
          </div>

          <div v-if="query.length >= 2 && autocomplete.length === 0" class="p-4 text-center text-sm text-slate-500">
            Tidak ada saran otomatis. Tekan Enter untuk mencari.
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT AREA -->
    <div class="flex-1 flex overflow-hidden">
      
      <!-- Filters Sidebar (Mock) -->
      <div class="hidden md:flex flex-col w-64 border-r bg-white/50 dark:bg-slate-900/50 p-4 shrink-0">
        <h3 class="font-semibold flex items-center gap-2 mb-4">
          <Filter class="h-4 w-4" /> Filter Pencarian
        </h3>
        <ScrollArea class="flex-1">
          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-medium mb-2">Kategori</h4>
              <div class="space-y-2">
                <label v-for="c in ['Undang-Undang', 'Peraturan Pemerintah', 'Putusan MA', 'Surat Edaran']" :key="c" class="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" class="rounded border-slate-300 text-[#C9A84C] focus:ring-[#C9A84C]" />
                  {{ c }}
                </label>
              </div>
            </div>
            <Separator />
            <div>
              <h4 class="text-sm font-medium mb-2">Tahun</h4>
              <div class="space-y-2">
                <label v-for="y in ['2024', '2023', '2022', '2021', '2020']" :key="y" class="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" class="rounded border-slate-300 text-[#C9A84C] focus:ring-[#C9A84C]" />
                  {{ y }}
                </label>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <!-- Results Area -->
      <ScrollArea class="flex-1 p-4 md:p-8">
        <div class="max-w-4xl mx-auto">
          
          <div v-if="activeQuery && !isLoading" class="mb-6 flex items-center justify-between">
            <p class="text-slate-600 dark:text-slate-400">
              Menemukan <strong class="text-[#1B2A4A] dark:text-white">{{ total }}</strong> hasil untuk "{{ activeQuery }}"
            </p>
            <div class="flex items-center gap-2 text-sm">
              <span class="text-slate-500">Urutkan:</span>
              <select class="bg-transparent border-none text-[#1B2A4A] dark:text-[#C9A84C] font-medium outline-none cursor-pointer">
                <option value="relevance">Relevansi</option>
                <option value="year_desc">Tahun Terbaru</option>
              </select>
            </div>
          </div>

          <div v-if="isLoading" class="space-y-4">
            <Card v-for="i in 3" :key="i" class="opacity-50 animate-pulse">
              <CardContent class="p-6 space-y-4">
                <div class="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
                <div class="h-6 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
              </CardContent>
            </Card>
          </div>

          <div v-else-if="results.length > 0" class="space-y-4">
            <Card v-for="(doc, idx) in results" :key="doc.id || idx" class="hover:shadow-md transition-shadow group">
              <CardContent class="p-5">
                <div class="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" class="text-xs bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20">
                    {{ doc.type || 'Dokumen' }}
                  </Badge>
                  <Badge variant="secondary" class="text-xs text-slate-500">
                    {{ doc.year || 'N/A' }}
                  </Badge>
                  <Badge v-if="doc.rank" variant="outline" class="text-xs text-emerald-600 bg-emerald-50 border-emerald-200 flex items-center gap-1">
                    <Target class="h-3 w-3" /> Relevansi: {{ (doc.rank * 100).toFixed(0) }}%
                  </Badge>
                  <span v-if="doc.category || doc.source" class="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                    <FileText class="h-3 w-3" /> {{ doc.category }} • {{ doc.source }}
                  </span>
                </div>
                
                <!-- Document Title with HTML Highlight -->
                <NuxtLink :to="`/documents/${doc.id}`" class="block group-hover:text-[#C9A84C] transition-colors">
                  <h3 
                    class="text-lg font-bold text-[#1B2A4A] dark:text-white leading-tight mb-2"
                    v-html="doc.highlighted_title || doc.title"
                  />
                </NuxtLink>
                
                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  Dokumen hukum ini memuat regulasi terkait <strong class="text-[#1B2A4A] dark:text-white">{{ activeQuery }}</strong> yang berlaku di Indonesia. Klik untuk melihat detail pasal, ayat, dan penjelasan selengkapnya.
                </p>
                
                <div class="mt-4 pt-4 border-t flex items-center gap-4 text-sm">
                  <NuxtLink :to="`/documents/${doc.id}`" class="text-[#C9A84C] font-medium flex items-center gap-1 hover:underline">
                    Baca Dokumen <ArrowRight class="h-4 w-4" />
                  </NuxtLink>
                </div>
              </CardContent>
            </Card>

            <!-- PAGINATION -->
            <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
              <Button 
                variant="outline" 
                size="sm" 
                @click="page = Math.max(1, page - 1)"
                :disabled="page === 1"
              >
                <ChevronLeft class="h-4 w-4 mr-1" /> Prev
              </Button>
              <span class="text-sm font-medium">
                Halaman {{ page }} dari {{ totalPages }}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                @click="page = Math.min(totalPages, page + 1)"
                :disabled="page === totalPages"
              >
                Next <ChevronRight class="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div v-else-if="activeQuery" class="text-center py-20 text-slate-500">
            <Search class="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <h3 class="text-lg font-medium text-slate-900 dark:text-white">Tidak ada hasil ditemukan</h3>
            <p>Coba gunakan kata kunci lain atau kurangi filter.</p>
          </div>

          <div v-else class="text-center py-20 text-slate-400">
            <Target class="h-12 w-12 mx-auto mb-4 text-slate-200 dark:text-slate-800" />
            <p>Masukkan kata kunci di atas untuk mulai mencari di *Knowledge Base* hukum.</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
