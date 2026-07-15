<script setup lang="ts">
import { ref, computed } from 'vue'
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
} from 'lucide-vue-next'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
]

const searchTerm = ref('')
const statusFilter = ref('ALL')
const currentPage = ref(1)
const itemsPerPage = 5

// Upload & Progress State (Simulated)
const isUploading = ref(false)
const activeJob = ref<any>(null)
let uploadInterval: ReturnType<typeof setInterval> | null = null
  
const handleUploadClick = () => {
  // Simulate upload starting
  activeJob.value = {
    id: `IMP-${Math.floor(Math.random() * 1000)}`,
    fileName: 'undang_undang_2024.json',
    status: 'PROCESSING',
    totalRecords: 1250,
    processed: 0,
    failed: 0,
  }
  isUploading.value = true
  
  // Simulate progress
  if (uploadInterval) clearInterval(uploadInterval)
  uploadInterval = setInterval(() => {
    if (!activeJob.value || activeJob.value.status !== 'PROCESSING') return
    const nextProcessed = activeJob.value.processed + 50
    if (nextProcessed >= activeJob.value.totalRecords) {
      if (uploadInterval) clearInterval(uploadInterval)
      isUploading.value = false
      activeJob.value.processed = activeJob.value.totalRecords
      activeJob.value.status = 'COMPLETED'
    } else {
      activeJob.value.processed = nextProcessed
    }
  }, 1000)
}

const handleJobAction = (action: string) => {
  if (!activeJob.value) return
  if (action === 'PAUSE') activeJob.value.status = 'PAUSED'
  if (action === 'RESUME') activeJob.value.status = 'PROCESSING'
  if (action === 'CANCEL') { isUploading.value = false; activeJob.value.status = 'CANCELLED' }
  if (action === 'ROLLBACK') { isUploading.value = false; activeJob.value = null }
}

// Filter & Search Logic
const filteredData = computed(() => {
  return MOCK_IMPORT_HISTORY.filter(item => {
    const matchesSearch = item.source.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'ALL' || item.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// Pagination Logic
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedData = computed(() => filteredData.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage))

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'SUCCESS':
    case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'PARTIAL': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'PROCESSING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'
    case 'PAUSED': return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20'
    default: return ''
  }
}
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'SUCCESS':
    case 'COMPLETED': return 'Success'
    case 'PARTIAL': return 'Partial'
    case 'FAILED': return 'Failed'
    case 'PROCESSING': return 'Processing'
    case 'PAUSED': return 'Paused'
    case 'CANCELLED': return 'Cancelled'
    default: return status
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>

<template>
  <div class="flex-1 space-y-6 p-4 md:p-8 pt-6 fade-in max-w-7xl mx-auto">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold tracking-tight text-[#1B2A4A] dark:text-white flex items-center gap-2">
          <Database class="h-8 w-8 text-[#C9A84C]" />
          Legal Database Admin
        </h2>
        <p class="text-muted-foreground mt-1">
          Dashboard manajemen *Knowledge Base* hukum nasional.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="gap-2" :disabled="isUploading">
          <Database class="h-4 w-4" /> Sync Database
        </Button>
        <Button 
          class="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white gap-2"
          @click="handleUploadClick"
          :disabled="isUploading"
        >
          <DownloadCloud class="h-4 w-4 text-[#C9A84C]" /> Import Manual
        </Button>
      </div>
    </div>

    <!-- Active Job Progress -->
    <Card v-if="activeJob" class="border-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10">
      <CardContent class="p-4 md:p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="space-y-1 w-full md:w-1/2">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold">{{ activeJob.fileName }}</h3>
              <Badge :class="getStatusBadgeClass(activeJob.status)">{{ getStatusLabel(activeJob.status) }}</Badge>
            </div>
            <p class="text-sm text-muted-foreground">
              Processed {{ activeJob.processed }} of {{ activeJob.totalRecords }} records.
            </p>
            <div class="w-full bg-secondary h-2.5 rounded-full overflow-hidden mt-2">
              <div 
                class="bg-blue-600 h-full rounded-full transition-all duration-500" 
                :style="`width: ${(activeJob.processed / activeJob.totalRecords) * 100}%`" 
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button v-if="activeJob.status === 'PROCESSING'" variant="outline" size="sm" @click="handleJobAction('PAUSE')">Pause</Button>
            <Button v-if="activeJob.status === 'PAUSED'" variant="outline" size="sm" @click="handleJobAction('RESUME')">Resume</Button>
            <Button v-if="['PROCESSING', 'PAUSED'].includes(activeJob.status)" variant="destructive" size="sm" @click="handleJobAction('CANCEL')">Cancel</Button>
            <Button v-if="['COMPLETED', 'CANCELLED', 'FAILED'].includes(activeJob.status)" variant="outline" size="sm" class="text-red-500" @click="handleJobAction('ROLLBACK')">Rollback</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Top Metrics Grid -->
    <div class="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <FileText class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p class="text-xs text-muted-foreground font-medium uppercase">Total Dokumen</p>
          <h3 class="text-2xl font-bold">14,205</h3>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
            <BookOpen class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p class="text-xs text-muted-foreground font-medium uppercase">Total BAB</p>
          <h3 class="text-2xl font-bold">8,432</h3>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
            <List class="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p class="text-xs text-muted-foreground font-medium uppercase">Total Pasal</p>
          <h3 class="text-2xl font-bold">142,890</h3>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-full">
            <AlignLeft class="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <p class="text-xs text-muted-foreground font-medium uppercase">Total Ayat</p>
          <h3 class="text-2xl font-bold">384,120</h3>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-full">
            <Paperclip class="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p class="text-xs text-muted-foreground font-medium uppercase">Lampiran</p>
          <h3 class="text-2xl font-bold">5,210</h3>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div class="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
            <DownloadCloud class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p class="text-xs text-muted-foreground font-medium uppercase">Import Hari Ini</p>
          <h3 class="text-2xl font-bold">125</h3>
        </CardContent>
      </Card>
    </div>

    <!-- Middle Section: System Status & Import History -->
    <div class="grid gap-6 md:grid-cols-3">
      
      <!-- Left Column: DB & Storage Status -->
      <div class="space-y-6 md:col-span-1">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 class="h-4 w-4 text-emerald-500" /> Status Database
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">PostgreSQL Sync</span>
              <Badge variant="outline" class="text-emerald-500">Connected</Badge>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">Vector DB (Pinecone)</span>
              <Badge variant="outline" class="text-emerald-500">Connected</Badge>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted-foreground">Last Auto-Backup</span>
              <span class="font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base font-semibold flex items-center gap-2">
              <HardDrive class="h-4 w-4 text-blue-500" /> Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-1">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Relational DB</span>
                <span class="font-medium">4.2 GB / 50 GB</span>
              </div>
              <div class="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-full rounded-full" style="width: 8.4%" />
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Vector Embeddings</span>
                <span class="font-medium">12.5 GB / 100 GB</span>
              </div>
              <div class="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div class="bg-purple-500 h-full rounded-full" style="width: 12.5%" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Import History Table -->
      <Card class="md:col-span-2">
        <CardHeader>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Riwayat Import</CardTitle>
              <CardDescription>Log sinkronisasi data dari berbagai repositori hukum.</CardDescription>
            </div>
            
            <!-- Filters & Search -->
            <div class="flex items-center gap-2">
              <div class="relative">
                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari sumber..." 
                  class="pl-8 w-[150px] lg:w-[200px] h-9 text-sm"
                  v-model="searchTerm"
                  @input="currentPage = 1"
                />
              </div>
              <div class="relative">
                <Filter class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <select 
                  class="flex h-9 w-[110px] items-center justify-between rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                  v-model="statusFilter"
                  @change="currentPage = 1"
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
          <div class="rounded-md border overflow-x-auto">
            <table class="w-full caption-bottom text-sm">
              <thead class="[&_tr]:border-b">
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">ID Import</th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div class="flex items-center gap-1 cursor-pointer hover:text-foreground">
                      Sumber <ArrowUpDown class="h-3 w-3" />
                    </div>
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipe</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Jumlah Item</th>
                  <th class="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Tanggal</th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0">
                <tr v-for="item in paginatedData" :key="item.id" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td class="p-4 align-middle font-medium text-xs">{{ item.id }}</td>
                  <td class="p-4 align-middle text-sm">{{ item.source }}</td>
                  <td class="p-4 align-middle">
                    <Badge variant="secondary" class="font-normal text-xs">{{ item.type }}</Badge>
                  </td>
                  <td class="p-4 align-middle text-right text-sm">
                    {{ formatNumber(item.items) }}
                  </td>
                  <td class="p-4 align-middle text-center">
                    <Badge :class="getStatusBadgeClass(item.status)">{{ getStatusLabel(item.status) }}</Badge>
                  </td>
                  <td class="p-4 align-middle text-right text-xs text-muted-foreground">
                    {{ formatDate(item.date) }}
                  </td>
                </tr>
                <tr v-if="paginatedData.length === 0">
                  <td colspan="6" class="p-4 h-24 text-center align-middle text-muted-foreground">
                    Tidak ada riwayat import ditemukan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
            <p class="text-sm text-muted-foreground">
              Menampilkan {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} dari {{ filteredData.length }} entri
            </p>
            <div class="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                @click="currentPage = Math.max(currentPage - 1, 1)"
                :disabled="currentPage === 1"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <div class="text-sm font-medium">
                {{ currentPage }} / {{ totalPages }}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                @click="currentPage = Math.min(currentPage + 1, totalPages)"
                :disabled="currentPage === totalPages"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  </div>
</template>
