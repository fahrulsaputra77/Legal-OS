<script setup lang="ts">
import { markRaw } from 'vue'
import { ref, watch, onMounted, nextTick } from 'vue'
import {
  Send,
  Paperclip,
  Mic,
  Plus,
  Scale,
  ThumbsUp,
  ThumbsDown,
  Copy,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
  ChevronDown,
  BookOpen,
  ExternalLink,
  Clock,
  Bot,
  User,
  Trash2,
  Search,
  FileText,
  FileCheck,
  Calculator,
} from 'lucide-vue-next'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const activeChat = ref<string | null>(null)
const input = ref('')
const messagesEndRef = ref<HTMLDivElement | null>(null)

const scrollToBottom = () => {
  if (messagesEndRef.value) {
    messagesEndRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

watch(activeChat, async () => {
  await nextTick()
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})

const handleStartChat = () => {
  activeChat.value = 'new'
}

const suggestedPrompts = [
  { icon: markRaw(Scale), text: 'Analisis kekuatan gugatan PHI ini' },
  { icon: markRaw(Search), text: 'Cari yurisprudensi tentang wanprestasi' },
  { icon: markRaw(FileText), text: 'Buatkan somasi untuk hutang piutang' },
  { icon: markRaw(FileCheck), text: 'Review kontrak kerja ini' },
  { icon: markRaw(Calculator), text: 'Hitung pesangon karyawan 10 tahun' },
  { icon: markRaw(Sparkles), text: 'Strategi banding putusan perdata' },
]
</script>

<template>
  <div class="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-background shadow-sm m-4 md:m-6">
    <!-- Left Sidebar - Chat History -->
    <div class="hidden w-[260px] flex-col border-r bg-muted/30 md:flex shrink-0">
      <div class="p-4">
        <Button 
          @click="handleStartChat"
          class="w-full justify-start gap-2 border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 text-foreground" 
          variant="outline"
        >
          <Plus class="h-4 w-4 text-[#C9A84C]" />
          Chat Baru
        </Button>
        <div class="relative mt-4">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari percakapan..." 
            class="w-full rounded-md border-none bg-background pl-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
          />
        </div>
      </div>
      <ScrollArea class="flex-1">
        <div class="px-3 pb-4">
          <div class="mb-4">
            <h4 class="mb-2 px-2 text-xs font-semibold text-muted-foreground">HARI INI</h4>
            <div class="space-y-1">
              <div 
                :class="cn('group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted', activeChat === '1' ? 'bg-muted border-l-2 border-[#C9A84C]' : '')"
                @click="activeChat = '1'"
              >
                <MessageSquare class="h-4 w-4 shrink-0 text-muted-foreground" />
                <div class="flex-1 truncate">Analisis Kontrak PT Maju Bersama</div>
                <Trash2 class="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity" />
              </div>
              <div 
                :class="cn('group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted', activeChat === '2' ? 'bg-muted border-l-2 border-[#C9A84C]' : '')"
                @click="activeChat = '2'"
              >
                <MessageSquare class="h-4 w-4 shrink-0 text-muted-foreground" />
                <div class="flex-1 truncate">Riset UU Cipta Kerja Pasal 81</div>
                <Trash2 class="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="mb-2 px-2 text-xs font-semibold text-muted-foreground">KEMARIN</h4>
            <div class="space-y-1">
              <div class="group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                <MessageSquare class="h-4 w-4 shrink-0 text-muted-foreground" />
                <div class="flex-1 truncate">Strategi Banding Perkara Perdata</div>
              </div>
              <div class="group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                <MessageSquare class="h-4 w-4 shrink-0 text-muted-foreground" />
                <div class="flex-1 truncate">Review Perjanjian Sewa</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>

    <!-- Main Chat Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <div class="flex h-14 items-center justify-between border-b px-4 shrink-0 bg-background">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-sm">
            {{ activeChat === '1' ? 'Analisis Kontrak PT Maju Bersama' : activeChat === '2' ? 'Riset UU Cipta Kerja Pasal 81' : 'Chat Baru' }}
          </span>
          <Badge variant="secondary" class="text-[10px] bg-[#1B2A4A]/10 text-[#1B2A4A] dark:bg-white/10 dark:text-white border-none">GPT-4 Turbo</Badge>
        </div>
        <Button variant="ghost" size="icon" class="h-8 w-8">
          <MoreHorizontal class="h-4 w-4" />
        </Button>
      </div>

      <!-- Messages -->
      <ScrollArea class="flex-1 p-4">
        <div class="mx-auto max-w-3xl space-y-6">
          <div v-if="!activeChat" class="flex h-[50vh] flex-col items-center justify-center text-center fade-in">
            <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A3D] shadow-lg">
              <Scale class="h-8 w-8 text-white" />
            </div>
            <h2 class="mb-2 text-2xl font-bold tracking-tight">AI Legal Copilot</h2>
            <p class="mb-8 text-muted-foreground max-w-md">
              Asisten AI khusus hukum Indonesia. Tanya apa saja tentang hukum, riset, atau review dokumen.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              <Card 
                v-for="(item, i) in suggestedPrompts" 
                :key="i" 
                class="cursor-pointer hover:border-[#C9A84C] hover:bg-muted/50 transition-colors border-dashed" 
                @click="activeChat = 'new'"
              >
                <CardContent class="flex items-center gap-3 p-4">
                  <component :is="item.icon" class="h-5 w-5 text-muted-foreground" />
                  <span class="text-sm font-medium">{{ item.text }}</span>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div v-else class="space-y-6 pb-6">
            <!-- User Message -->
            <div class="flex gap-4 fade-in">
              <Avatar class="h-8 w-8 mt-1 border">
                <AvatarFallback class="bg-muted">FS</AvatarFallback>
              </Avatar>
              <div class="flex-1 space-y-2">
                <div class="font-semibold text-sm">Anda</div>
                <div class="text-sm leading-relaxed text-foreground">
                  Klien saya dipecat tanpa pesangon setelah bekerja 8 tahun. Apa dasar hukum yang bisa digunakan untuk menuntut perusahaan?
                </div>
              </div>
            </div>

            <!-- AI Message -->
            <div class="flex gap-4 fade-in">
              <div class="flex h-8 w-8 mt-1 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-white shadow-sm">
                <Scale class="h-4 w-4 text-[#C9A84C]" />
              </div>
              <div class="flex-1 space-y-4">
                <div class="font-semibold text-sm flex items-center gap-2">
                  AI Legal Copilot
                  <Badge variant="outline" class="text-[9px] h-4 px-1 border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">Confidence: 92%</Badge>
                </div>
                
                <div class="text-sm leading-relaxed text-foreground space-y-4">
                  <p>Berdasarkan analisis saya, berikut dasar hukum yang relevan untuk kasus PHK tanpa pesangon setelah 8 tahun masa kerja:</p>
                  
                  <div>
                    <p class="font-bold">1. UU No. 13 Tahun 2003 tentang Ketenagakerjaan</p>
                    <ul class="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                      <li>Pasal 156 ayat (1): Mewajibkan pemberian uang pesangon dan/atau uang penghargaan masa kerja</li>
                      <li>Pasal 156 ayat (2): Untuk masa kerja 8 tahun, pesangon = 9 bulan upah</li>
                      <li>Pasal 156 ayat (3): UPMK untuk masa kerja 6-9 tahun = 3 bulan upah</li>
                    </ul>
                  </div>

                  <div>
                    <p class="font-bold">2. PP No. 35 Tahun 2021</p>
                    <ul class="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                      <li>Mengatur ketentuan terbaru tentang PKWT, PKWTT, dan PHK</li>
                      <li>Memperjelas komponen pesangon paska UU Cipta Kerja</li>
                    </ul>
                  </div>
                  
                  <div class="p-3 bg-muted/50 rounded-lg border">
                    <p class="font-bold text-sm mb-2 flex items-center gap-2"><BookOpen class="h-4 w-4 text-[#C9A84C]" /> Sumber Hukum & Yurisprudensi</p>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-xs p-2 bg-background rounded border">
                        <span class="font-medium">UU No. 13 Tahun 2003</span>
                        <Badge variant="secondary" class="text-[10px]">Relevance: 95%</Badge>
                      </div>
                      <div class="flex items-center justify-between text-xs p-2 bg-background rounded border">
                        <span class="font-medium">PP No. 35 Tahun 2021</span>
                        <Badge variant="secondary" class="text-[10px]">Relevance: 88%</Badge>
                      </div>
                      <div class="flex items-center justify-between text-xs p-2 bg-background rounded border">
                        <span class="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1">Putusan MA No. 501 K/Pdt.Sus-PHI/2019 <ExternalLink class="h-3 w-3" /></span>
                        <Badge variant="secondary" class="text-[10px]">Relevance: 82%</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p class="font-bold">Rekomendasi Tindakan:</p>
                    <ol class="list-decimal pl-5 mt-1 space-y-1 text-muted-foreground">
                      <li>Ajukan Bipartit terlebih dahulu sebagai syarat formil.</li>
                      <li>Jika gagal, ajukan Mediasi ke Disnaker setempat.</li>
                      <li>Siapkan gugatan ke Pengadilan Hubungan Industrial menuntut pesangon sesuai ketentuan di atas.</li>
                    </ol>
                  </div>
                </div>

                <div class="flex items-center gap-2 pt-2">
                  <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground"><ThumbsUp class="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground"><ThumbsDown class="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground"><Copy class="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          </div>
          <div ref="messagesEndRef" />
        </div>
      </ScrollArea>

      <!-- Input Area -->
      <div class="p-4 bg-background shrink-0">
        <div class="mx-auto max-w-3xl">
          <div class="relative rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-[#C9A84C] transition-shadow">
            <Textarea 
              placeholder="Ketik pertanyaan hukum Anda di sini..." 
              class="min-h-[60px] w-full resize-none border-0 bg-transparent py-3 pl-4 pr-12 focus-visible:ring-0"
              :rows="1"
              v-model="input"
            />
            <div class="flex items-center justify-between px-3 pb-3">
              <div class="flex items-center gap-1">
                <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted">
                  <Paperclip class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted">
                  <Mic class="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm" class="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white rounded-full h-8 w-8 p-0 shrink-0">
                <Send class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="text-center mt-2">
            <span class="text-[10px] text-muted-foreground">AI dapat membuat kesalahan. Harap verifikasi informasi penting.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
