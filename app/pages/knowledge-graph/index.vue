<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Network, Search, AlertCircle, ArrowRight, Expand } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const docId = ref('mock-uu-13')
const inputVal = ref('mock-uu-13')
const graphData = ref<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] })
const loading = ref(false)

const fetchGraph = async () => {
  if (!docId.value) return
  loading.value = true
  try {
    const res = await fetch(`/api/v1/relations/graph?documentId=${docId.value}&depth=2`)
    const json = await res.json()
    if (json.data) {
      graphData.value = json.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGraph()
})

watch(docId, () => {
  fetchGraph()
})

const handleSearch = (e: Event) => {
  e.preventDefault()
  docId.value = inputVal.value
}

const getNodeColor = (type: string) => {
  if (type === 'UU' || type === 'UUD_1945') return 'border-[#1B2A4A] bg-[#1B2A4A] text-white'
  if (type === 'PP' || type === 'PERPRES') return 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#1B2A4A]'
  return 'border-slate-300 bg-white text-slate-800'
}

const getRelationLabel = (type: string) => {
  switch(type) {
    case 'MENGUBAH': return 'Mengubah'
    case 'MENCABUT': return 'Mencabut'
    case 'MELAKSANAKAN': return 'Melaksanakan'
    case 'MENGACU': return 'Mengacu pada'
    case 'TURUNAN': return 'Turunan dari'
    default: return type
  }
}

const getIncomingEdge = (nodeId: string) => {
  return graphData.value.edges.find(e => e.source === nodeId && e.target === docId.value)
}

const getOutgoingEdge = (nodeId: string) => {
  return graphData.value.edges.find(e => e.target === nodeId && e.source === docId.value)
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0f172a]">
    <div class="bg-white dark:bg-slate-900 border-b p-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#1B2A4A] dark:text-white flex items-center gap-2 mb-1">
          <Network class="h-6 w-6 text-[#C9A84C]" />
          Knowledge Graph Relasi
        </h1>
        <p class="text-muted-foreground text-sm">
          Peta keterkaitan antar dokumen hukum. Lihat UU induk dan peraturan pelaksana di bawahnya.
        </p>
      </div>

      <form @submit="handleSearch" class="flex items-center gap-2 max-w-sm w-full">
        <Input 
          placeholder="ID Dokumen (contoh: mock-uu-13)"
          v-model="inputVal"
          class="flex-1"
        />
        <Button type="submit" variant="secondary" class="bg-[#C9A84C] text-white hover:bg-[#C9A84C]/90">
          Render
        </Button>
      </form>
    </div>

    <div class="flex-1 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
        <div class="text-center animate-pulse">
          <Network class="h-10 w-10 mx-auto text-[#C9A84C] mb-4 animate-spin-slow" />
          <p class="text-lg font-medium">Membangun simpul relasi...</p>
        </div>
      </div>
      
      <div v-else-if="graphData.nodes.length === 0" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-slate-500">
          <AlertCircle class="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p>Tidak ada jaringan relasi yang terdeteksi.</p>
        </div>
      </div>
      
      <div v-else class="p-8 h-full overflow-auto">
        <div class="min-w-[800px] min-h-[600px] flex flex-col items-center justify-center relative gap-16">
          
          <!-- Central Node -->
          <div class="z-20 text-center">
            <Badge class="mb-2 bg-[#1B2A4A]">Node Sentral</Badge>
            <Card 
              v-for="node in graphData.nodes.filter(n => n.id === docId)" 
              :key="node.id" 
              :class="`w-80 shadow-lg border-2 ${getNodeColor(node.type)}`"
            >
              <CardContent class="p-4 text-center">
                <div class="text-xs opacity-80 mb-1">{{ node.type }} {{ node.year ? `Tahun ${node.year}` : '' }}</div>
                <h3 class="font-bold text-sm leading-snug">{{ node.title }}</h3>
              </CardContent>
            </Card>
          </div>

          <!-- Edge/Relation visual representation (Mock CSS lines for now) -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-16 bg-[#C9A84C]" />
          
          <!-- Connected Nodes -->
          <div class="flex flex-wrap justify-center gap-8 z-20">
            <div 
              v-for="node in graphData.nodes.filter(n => n.id !== docId)" 
              :key="node.id" 
              class="flex flex-col items-center"
            >
              <Badge variant="outline" class="mb-2 text-[#C9A84C] border-[#C9A84C]">
                {{ (getIncomingEdge(node.id) || getOutgoingEdge(node.id)) ? getRelationLabel((getIncomingEdge(node.id) || getOutgoingEdge(node.id)).type) : 'Terkait' }}
              </Badge>
              <Card :class="`w-64 shadow border-2 ${getNodeColor(node.type)}`">
                <CardContent class="p-4 text-center">
                  <div class="text-xs opacity-70 mb-1">{{ node.type }} {{ node.year }}</div>
                  <h3 class="font-semibold text-xs leading-snug line-clamp-3">{{ node.title }}</h3>
                  <Button variant="link" size="sm" class="mt-2 h-auto text-[#C9A84C] text-xs p-0" @click="docId = node.id">
                    Jadikan Pusat <Expand class="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
