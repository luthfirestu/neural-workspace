<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKanbanStore } from '../stores/kanban'

const kanbanStore = useKanbanStore()
const searchFocused = ref<boolean>(false)
const searchVal = ref<string>('')

interface User {
  id: number
  name: string
  initials: string
  color: string
  status: 'online' | 'away'
}

const onlineUsers = ref<User[]>([
  { id: 1, name: 'Maya Chen', initials: 'MC', color: 'linear-gradient(135deg, #4facfe, #00f5d4)', status: 'online' },
  { id: 2, name: 'Jordan Lee', initials: 'JL', color: 'linear-gradient(135deg, #7c5cfc, #4facfe)', status: 'online' },
  { id: 3, name: 'Sam Rivera', initials: 'SR', color: 'linear-gradient(135deg, #f093fb, #f5576c)', status: 'online' },
  { id: 4, name: 'Alex Kim', initials: 'AK', color: 'linear-gradient(135deg, #4facfe, #7c5cfc)', status: 'online' },
  { id: 5, name: 'Dana Park', initials: 'DP', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', status: 'away' },
])

const onlineCount = computed(() => onlineUsers.value.filter(u => u.status === 'online').length)

function handleGlobalAddTask() {
  kanbanStore.targetColumnId = 'backlog'
  kanbanStore.isModalOpen = true
}
</script>

<template>
  <header class="w-full h-[60px] min-h-[60px] flex items-center justify-between px-6 bg-[#080912]/85 backdrop-blur-xl border-b border-white/5 relative z-20 select-none">
    
    <div class="flex items-center gap-4 flex-shrink-0">
      <div class="flex items-center gap-1.5 text-[13px]">
        <span class="text-[#5a6175] hover:text-[#8b92a8] transition-colors cursor-pointer">Workspace</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a6175" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="text-[#8b92a8] hover:text-[#e2e4ed] transition-colors cursor-pointer">Product Design</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a6175" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span class="font-semibold text-[#e2e4ed]">Q3 Sprint Board</span>
      </div>

      <div class="px-2.5 py-0.5 rounded-full bg-[#4facfe]/10 border border-[#4facfe]/20 text-[11px] font-bold text-[#4facfe] tracking-wider">
        SPRINT 14
      </div>
    </div>

    <div class="flex items-center gap-4">
      
      <div class="relative w-[240px]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          :stroke="searchFocused ? '#4facfe' : '#5a6175'"
          stroke-width="2"
          class="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="search-tasks"
          name="search-tasks"
          v-model="searchVal"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
          type="text"
          placeholder="Search tasks, people..."
          :class="[
            'w-full h-[34px] pl-[34px] pr-9 rounded-lg bg-white/[0.04] text-[#e2e4ed] text-xs outline-none transition-all duration-200 font-sans border',
            searchFocused ? 'border-[#4facfe]/40 bg-white/[0.06] shadow-[0_0_12px_rgba(79,172,254,0.05)]' : 'border-white/[0.08]'
          ]"
        />
        <span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#5a6175] font-mono pointer-events-none">
          ⌘K
        </span>
      </div>

      <div class="w-[1px] h-6 bg-white/[0.07]"></div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="w-2 h-2 rounded-full bg-[#00f5d4] shadow-[0_0_8px_rgba(0,245,212,0.6)]"></div>
          <span class="text-xs text-[#5a6175] font-medium">
            <span class="text-[#00f5d4] font-bold font-mono">{{ onlineCount }}</span> online
          </span>
        </div>

        <div class="flex items-center">
          <div
            v-for="(user, i) in onlineUsers.slice(0, 5)"
            :key="user.id"
            :title="`${user.name} — ${user.status}`"
            class="w-[30px] h-[30px] rounded-full border-2 border-[#07080f] flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-all duration-150 relative hover:-translate-y-0.5 hover:z-30"
            :style="{ background: user.color, marginLeft: i === 0 ? '0px' : '-8px', zIndex: 5 - i }"
          >
            {{ user.initials }}
          </div>
        </div>
      </div>

      <div class="w-[1px] h-6 bg-white/[0.07]"></div>

      <div class="flex items-center gap-2">
        <button 
          @click="handleGlobalAddTask" 
          class="px-4 h-[34px] rounded-lg bg-gradient-to-br from-[#4facfe] to-[#7c5cfc] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_20px_rgba(79,172,254,0.25)] hover:opacity-95 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Task</span>
        </button>

        <button class="w-[34px] h-[34px] rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-[#5a6175] hover:text-[#8b92a8] flex items-center justify-center relative transition-all duration-150 active:scale-95 cursor-pointer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7c5cfc] border border-[#07080f]"></span>
        </button>
      </div>

    </div>
  </header>
</template>