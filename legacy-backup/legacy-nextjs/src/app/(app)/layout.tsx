'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { NAV_ITEMS, NAV_SECTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // Group nav items by section
  const navGroups = Object.entries(NAV_SECTIONS).map(([key, label]) => {
    return {
      label,
      items: NAV_ITEMS.filter((item) => item.section === key),
    };
  });

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1B2A4A] text-slate-200">
      {/* Brand */}
      <div className="flex h-16 items-center px-4 shrink-0 border-b border-white/10">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed ? "justify-center w-full" : "")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A68A3D] text-white shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Legal OS
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-2">
          {navGroups.map((group, i) => (
            <div key={i} className="px-2">
              {!collapsed && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <div key={item.id}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-slate-300 hover:bg-white/5 hover:text-white",
                          collapsed ? "justify-center" : "",
                          isActive && !collapsed ? "border-l-4 border-[#C9A84C] pl-2" : ""
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-[#C9A84C]" : "text-slate-400 group-hover:text-white")} />
                        {!collapsed && (
                          <div className="flex flex-1 items-center justify-between overflow-hidden">
                            <span className="truncate">{item.label}</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer / Profile */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && <span className="text-xs text-slate-400">Theme</span>}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-full text-slate-300 hover:bg-white/10 hover:text-white", collapsed ? "mx-auto" : "")}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <Avatar className="h-9 w-9 shrink-0 border border-white/10">
            <AvatarFallback className="bg-slate-800 text-white">FS</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-white">Fahrul Saputra, S.H</span>
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs text-slate-400">Advokat</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600"></span>
                  <span className="text-[10px] text-[#C9A84C] font-semibold">PRO</span>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r md:block transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "w-[72px]" : "w-[280px]"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetContent side="left" className="p-0 w-[280px] border-none bg-transparent">
          <SidebarContent />
        </SheetContent>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SheetTrigger className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="hidden md:flex text-muted-foreground hover:text-foreground"
              >
                {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              </Button>
              
              <div className="hidden lg:flex items-center text-sm text-muted-foreground">
                {pathname.split('/').filter(Boolean).map((segment, index, array) => (
                  <React.Fragment key={index}>
                    <span className="capitalize text-foreground font-medium">
                      {segment.replace(/-/g, ' ')}
                    </span>
                    {index < array.length - 1 && <span className="mx-2">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-[200px] lg:w-[300px] pl-9 bg-muted/50 rounded-full border-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
                />
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full focus:outline-none hover:ring-2 hover:ring-slate-200">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">FS</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Fahrul Saputra, S.H</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          fahrul.saputra@lawfirm.co.id
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-background/95 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl fade-in h-full">
              {children}
            </div>
          </main>
        </div>
      </Sheet>
    </div>
  );
}
