<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
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
  ArrowLeft,
  FileText
} from 'lucide-vue-next'
import { NuxtLink } from '#components'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const route = useRoute()
const docId = route.params.id

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
}

const searchTerm = ref('')
const activeChapter = ref(MOCK_DOCUMENT.chapters[0]?.id)
const copiedId = ref<string | null>(null)

let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      // Find the first intersecting entry that covers a significant portion
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          activeChapter.value = entry.target.id
        }
      })
    },
    { rootMargin: '-100px 0px -40% 0px', threshold: [0.1, 0.5, 1.0] }
  )

  setTimeout(() => {
    MOCK_DOCUMENT.chapters.forEach(chap => {
      const el = document.getElementById(chap.id)
      if (el) observer.observe(el)
    })
  }, 100)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const scrollToAnchor = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    // Offset for sticky header
    const y = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const copyToClipboard = (text: string, id: string) => {
  navigator.clipboard.writeText(text)
  copiedId.value = id
  setTimeout(() => copiedId.value = null, 2000)
}

const handlePrint = () => {
  window.print()
}

const filteredChapters = computed(() => {
  return MOCK_DOCUMENT.chapters.filter(chap => 
    chap.title.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
    chap.subtitle.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
    
    <!-- LEFT SIDEBAR (TOC) -->
    <div class="hidden md:flex flex-col w-72 border-r bg-muted/20 shrink-0">
      <div class="p-4 border-b">
        <NuxtLink to="/documents" class="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft class="h-4 w-4 mr-1" /> Kembali ke Library
        </NuxtLink>
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari BAB..." 
            class="pl-8 bg-background" 
            v-model="searchTerm"
          />
        </div>
      </div>
      <ScrollArea class="flex-1">
        <div class="p-2 space-y-1">
          <button
            v-for="chap in filteredChapters"
            :key="chap.id"
            @click="scrollToAnchor(chap.id)"
            :class="cn(
              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex flex-col gap-0.5',
              activeChapter === chap.id 
                ? 'bg-[#1B2A4A]/10 text-[#1B2A4A] dark:bg-[#C9A84C]/20 dark:text-[#C9A84C] font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )"
          >
            <span class="font-semibold">{{ chap.title }}</span>
            <span class="text-xs truncate opacity-80">{{ chap.subtitle }}</span>
          </button>
          
          <template v-if="MOCK_DOCUMENT.attachments.length > 0">
            <Separator class="my-2" />
            <div class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lampiran
            </div>
            <button
              v-for="att in MOCK_DOCUMENT.attachments"
              :key="att.id"
              @click="scrollToAnchor(att.id)"
              class="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors truncate"
            >
              {{ att.title }}
            </button>
          </template>
        </div>
      </ScrollArea>
    </div>

    <!-- RIGHT CONTENT -->
    <div class="flex-1 flex flex-col min-w-0 bg-background relative overflow-y-auto print:overflow-visible">
      
      <!-- Sticky Action Header -->
      <div class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b p-4 flex items-center justify-between shadow-sm print:hidden">
        <div class="min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <Badge variant="outline" class="text-xs bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20">
              {{ MOCK_DOCUMENT.type }}
            </Badge>
            <Badge variant="secondary" class="text-xs">
              {{ MOCK_DOCUMENT.status }}
            </Badge>
          </div>
          <h1 class="text-lg font-bold truncate text-foreground">
            {{ MOCK_DOCUMENT.title }}
          </h1>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground" title="Bookmark Dokumen">
            <Bookmark class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground" @click="handlePrint" title="Cetak / Simpan PDF">
            <Printer class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground" title="Download Asli (PDF)">
            <Download class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-9 w-9 text-muted-foreground hover:text-foreground" title="Bagikan">
            <Share2 class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Document Body -->
      <div class="p-6 md:p-12 max-w-4xl mx-auto w-full print:p-0 print:max-w-none">
        
        <div class="text-center mb-16 space-y-4">
          <BookOpen class="h-12 w-12 mx-auto text-[#C9A84C] opacity-80" />
          <h2 class="text-2xl md:text-4xl font-extrabold tracking-tight text-[#1B2A4A] dark:text-white uppercase">
            {{ MOCK_DOCUMENT.type }} <br/> 
            REPUBLIK INDONESIA
          </h2>
          <p class="text-lg md:text-xl font-semibold">
            NOMOR {{ MOCK_DOCUMENT.number }} TAHUN {{ MOCK_DOCUMENT.year }}
          </p>
          <p class="text-lg md:text-xl font-semibold">
            TENTANG
          </p>
          <p class="text-xl md:text-2xl font-bold uppercase text-[#C9A84C]">
            {{ MOCK_DOCUMENT.title.replace(/Undang-Undang Nomor \d+ Tahun \d+ tentang /i, '') }}
          </p>
        </div>

        <div class="space-y-12">
          <section v-for="chap in MOCK_DOCUMENT.chapters" :key="chap.id" :id="chap.id" class="scroll-mt-28 print:break-before-auto">
            <div class="text-center mb-8">
              <h3 class="text-xl font-bold uppercase">{{ chap.title }}</h3>
              <h4 class="text-lg font-semibold uppercase">{{ chap.subtitle }}</h4>
            </div>

            <div class="space-y-8">
              <div v-for="art in chap.articles" :key="art.id" :id="art.id" class="scroll-mt-28 group relative">
                
                <!-- Copy Action Floating -->
                <div class="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block print:hidden">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-8 w-8 text-muted-foreground"
                    @click="copyToClipboard(`Pasal ${art.number}\n${art.paragraphs.map(p => p.number ? `(${p.number}) ${p.content}` : p.content).join('\n')}`, art.id)"
                  >
                    <CheckCircle2 v-if="copiedId === art.id" class="h-4 w-4 text-emerald-500" />
                    <Copy v-else class="h-4 w-4" />
                  </Button>
                </div>

                <h5 class="font-bold text-center mb-4">Pasal {{ art.number }}</h5>
                
                <div class="space-y-3 text-justify leading-relaxed">
                  <div v-for="par in art.paragraphs" :key="par.id" :id="par.id" class="flex gap-4">
                    <span v-if="par.number" class="shrink-0 w-6 font-medium">({{ par.number }})</span>
                    <span :class="cn('flex-1', !par.number && 'indent-8')">
                      {{ par.content }}
                    </span>
                  </div>
                </div>

                <div v-if="art.explanation" class="mt-4 p-4 bg-muted/50 rounded-lg text-sm border-l-4 border-[#C9A84C]">
                  <p class="font-semibold mb-1 text-[#1B2A4A] dark:text-white">Penjelasan Pasal {{ art.number }}:</p>
                  <p class="text-muted-foreground">{{ art.explanation }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Attachments Section -->
          <div v-if="MOCK_DOCUMENT.attachments.length > 0" class="pt-12 border-t">
            <section v-for="att in MOCK_DOCUMENT.attachments" :key="att.id" :id="att.id" class="scroll-mt-28 mb-8 print:break-before-page">
              <h3 class="text-xl font-bold uppercase text-center mb-6">{{ att.title }}</h3>
              <div class="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                <FileText class="h-10 w-10 mb-2 opacity-50" />
                <p>Dokumen lampiran ditampilkan di sini atau tersedia untuk diunduh.</p>
                <Button variant="outline" class="mt-4 gap-2">
                  <Download class="h-4 w-4" /> Download Lampiran
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
