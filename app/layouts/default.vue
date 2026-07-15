<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_ITEMS, NAV_SECTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

import {
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Scale,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const collapsed = ref(false)
const theme = ref('light')
const isProfileDropdownOpen = ref(false)

watch(() => route.path, () => {
  isProfileDropdownOpen.value = false
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  // basic theme toggle logic for Tailwind dark mode
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const navGroups = computed(() => {
  return Object.entries(NAV_SECTIONS).map(([key, label]) => {
    return {
      label,
      items: NAV_ITEMS.filter((item) => item.section === key),
    }
  })
})

const isActiveRoute = (href: string) => {
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
    <!-- Desktop Sidebar -->
    <aside
      :class="cn(
        'hidden md:flex flex-col bg-[#1B2A4A] text-slate-200 shadow-xl transition-all duration-300 z-20 relative',
        collapsed ? 'w-[72px]' : 'w-72'
      )"
    >
      <div class="flex h-16 items-center px-4 shrink-0 border-b border-white/10">
        <div :class="cn('flex items-center gap-3 overflow-hidden', collapsed ? 'justify-center w-full' : '')">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A68A3D] text-white shadow-sm">
            <Scale class="h-5 w-5" />
          </div>
          <span v-if="!collapsed" class="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Legal OS
          </span>
        </div>
      </div>

      <ScrollArea class="flex-1 py-4">
        <nav class="space-y-6 px-2">
          <div v-for="(group, i) in navGroups" :key="i" class="px-2">
            <h4 v-if="!collapsed" class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {{ group.label }}
            </h4>
            <div class="space-y-1">
              <div v-for="item in group.items" :key="item.id">
                <NuxtLink
                  :to="item.href"
                  :class="cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all',
                    isActiveRoute(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    collapsed ? 'justify-center' : '',
                    isActiveRoute(item.href) && !collapsed ? 'border-l-4 border-[#C9A84C] pl-2' : ''
                  )"
                  :title="collapsed ? item.label : undefined"
                >
                  <component
                    :is="item.icon"
                    :class="cn('h-5 w-5 shrink-0', isActiveRoute(item.href) ? 'text-[#C9A84C]' : 'text-slate-400 group-hover:text-white')"
                  />
                  <div v-if="!collapsed" class="flex flex-1 items-center justify-between overflow-hidden">
                    <span class="truncate">{{ item.label }}</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </nav>
      </ScrollArea>

      <!-- Footer / Profile -->
      <div class="shrink-0 border-t border-white/10 p-4">
        <div class="flex items-center justify-between mb-4">
          <span v-if="!collapsed" class="text-xs text-slate-400">Theme</span>
          <Button
            variant="ghost"
            size="icon"
            :class="cn('h-8 w-8 rounded-full text-slate-300 hover:bg-white/10 hover:text-white', collapsed ? 'mx-auto' : '')"
            @click="toggleTheme"
          >
            <Sun v-if="theme === 'dark'" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </Button>
        </div>
        
        <div :class="cn('flex items-center gap-3', collapsed ? 'justify-center' : '')">
          <Avatar class="h-9 w-9 shrink-0 border border-white/10">
            <AvatarFallback class="bg-slate-800 text-white">FS</AvatarFallback>
          </Avatar>
          <div v-if="!collapsed" class="flex flex-col min-w-0">
            <span class="truncate text-sm font-medium text-white">Fahrul Saputra, S.H</span>
            <div class="flex items-center gap-1">
              <span class="truncate text-xs text-slate-400">Advokat</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Toggle Button -->
      <button
        @click="toggleSidebar"
        class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 text-white shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
      >
        <PanelLeftClose v-if="!collapsed" class="h-3 w-3" />
        <PanelLeftOpen v-else class="h-3 w-3" />
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex h-16 shrink-0 items-center justify-between border-b bg-white dark:bg-slate-900 px-4 md:px-6 shadow-sm z-10 transition-colors">
        <div class="flex items-center gap-4">
          <Sheet>
            <SheetTrigger as-child>
              <Button variant="outline" size="icon" class="md:hidden">
                <Menu class="h-5 w-5" />
                <span class="sr-only">Toggle Sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" class="p-0 w-72 bg-[#1B2A4A] border-r-0">
              <!-- Mobile Sidebar Content (Simplified) -->
              <div class="flex h-16 items-center px-4 shrink-0 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A84C] text-white">
                    <Scale class="h-5 w-5" />
                  </div>
                  <span class="text-lg font-bold tracking-tight text-white">Legal OS</span>
                </div>
              </div>
              <ScrollArea class="h-[calc(100vh-4rem)] pb-20">
                <nav class="space-y-6 p-4">
                  <div v-for="(group, i) in navGroups" :key="i">
                    <h4 class="mb-2 text-xs font-semibold uppercase text-slate-400">{{ group.label }}</h4>
                    <div class="space-y-1">
                      <div v-for="item in group.items" :key="item.id">
                        <NuxtLink
                          :to="item.href"
                          :class="cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActiveRoute(item.href)
                              ? 'bg-white/10 text-white border-l-4 border-[#C9A84C]'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          )"
                        >
                          <component
                            :is="item.icon"
                            :class="cn('h-5 w-5', isActiveRoute(item.href) ? 'text-[#C9A84C]' : 'text-slate-400')"
                          />
                          <span>{{ item.label }}</span>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <div class="hidden md:flex items-center text-sm text-slate-500 dark:text-slate-400">
            <span class="font-medium text-slate-900 dark:text-slate-100">Firma Hukum</span>
            <span class="mx-2">/</span>
            <span class="capitalize">{{ route.path.split('/')[1] || 'Dashboard' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative hidden sm:block w-64 lg:w-96">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Cari perkara, dokumen, klien..."
              class="w-full bg-slate-50 dark:bg-slate-800 pl-9 border-slate-200 dark:border-slate-700"
            />
            <div class="absolute right-2.5 top-2.5 flex items-center gap-1">
              <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-700 px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-300">
                <Command class="h-3 w-3" />
                K
              </kbd>
            </div>
          </div>

          <Button variant="ghost" size="icon" class="relative text-slate-500">
            <Bell class="h-5 w-5" />
            <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600 border-2 border-white dark:border-slate-900"></span>
          </Button>

          <DropdownMenu v-model:open="isProfileDropdownOpen">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-9 w-9 rounded-full">
                <Avatar class="h-9 w-9">
                  <AvatarFallback class="bg-[#1B2A4A] text-white">FS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">Fahrul Saputra, S.H</p>
                  <p class="text-xs leading-none text-muted-foreground">
                    fahrul.saputra@lawfirm.co.id
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User class="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings class="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-red-600">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Keluar</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto relative">
        <slot />
      </div>
    </main>
  </div>
</template>
