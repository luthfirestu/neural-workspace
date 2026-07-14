<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
  id: string
  label: string
  badge?: number
}

const activeItem = ref<string>('kanban')

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'courses', label: 'Courses' },
  { id: 'team', label: 'Team' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'messages', label: 'Messages', badge: 3 },
  { id: 'calendar', label: 'Calendar' },
]

const bottomItems: NavItem[] = [
  { id: 'settings', label: 'Settings' }
]
</script>

<template>
  <div class="w-16 h-screen flex flex-col items-center pt-5 pb-4 bg-[#080912]/90 backdrop-blur-xl border-r border-white/5 relative z-20 select-none flex-shrink-0">
    
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#7c5cfc] flex items-center justify-center mb-7 shadow-[0_0_20px_rgba(79,172,254,0.3)] flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <nav class="flex flex-col items-center gap-0.5 w-full px-2.5">
      <button 
        v-for="item in navItems" 
        :key="item.id"
        @click="activeItem = item.id"
        :title="item.label"
        :class="[
          'relative w-11 h-11 rounded-xl border-none flex items-center justify-center transition-all duration-200 outline-none cursor-pointer group',
          activeItem === item.id 
            ? 'bg-gradient-to-br from-[#4facfe]/15 to-[#7c5cfc]/15 text-[#4facfe]' 
            : 'bg-transparent text-[#5a6175] hover:bg-white/[0.04] hover:text-[#8b92a8]'
        ]"
      >
        <div 
          v-if="activeItem === item.id"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#4facfe] to-[#7c5cfc] rounded-r"
        ></div>

        <svg v-if="item.id === 'dashboard'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
        <svg v-else-if="item.id === 'kanban'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="5" height="18" rx="1" /><rect x="10" y="3" width="5" height="13" rx="1" /><rect x="17" y="3" width="5" height="9" rx="1" /></svg>
        <svg v-else-if="item.id === 'courses'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="13" y2="13" /></svg>
        <svg v-else-if="item.id === 'team'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        <svg v-else-if="item.id === 'analytics'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        <svg v-else-if="item.id === 'messages'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        <svg v-else-if="item.id === 'calendar'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>

        <span 
          v-if="item.badge"
          class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#7c5cfc] text-white text-[9px] font-bold flex items-center justify-center leading-none scale-90 group-hover:scale-100 transition-transform"
        >
          {{ item.badge }}
        </span>
      </button>
    </nav>

    <div class="flex-1"></div>

    <div class="flex flex-col items-center gap-0.5 w-full px-2.5">
      <button 
        v-for="item in bottomItems" 
        :key="item.id"
        @click="activeItem = item.id"
        :title="item.label"
        :class="[
          'w-11 h-11 rounded-xl border-none flex items-center justify-center transition-all duration-200 outline-none cursor-pointer',
          activeItem === item.id 
            ? 'bg-gradient-to-br from-[#4facfe]/15 to-[#7c5cfc]/15 text-[#4facfe]' 
            : 'bg-transparent text-[#5a6175] hover:bg-white/[0.04] hover:text-[#8b92a8]'
        ]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
      </button>

      <div class="mt-2 relative">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-xs font-semibold text-white border-2 border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
          AK
        </div>
        <div class="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-[#00f5d4] border-2 border-[#07080f] animate-pulse"></div>
      </div>
    </div>

  </div>
</template>