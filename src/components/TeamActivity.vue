<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ActivityItem {
  id: string
  user: { name: string; initials: string; color: string; online: boolean }
  action: string
  target: string
  targetType: 'task' | 'course' | 'comment' | 'file' | 'member'
  time: string
  timeAgo: string
  detail?: string
}

interface OnlineUser {
  id: number
  name: string
  initials: string
  color: string
  role: string
  status: string
  activity: string
}

const activeTab = ref<'activity' | 'members'>('activity')

const activities = ref<ActivityItem[]>([
  { id: 'a1', user: { name: 'Maya Chen', initials: 'MC', color: 'linear-gradient(135deg, #4facfe, #00f5d4)', online: true }, action: 'moved', target: 'Real-time collaboration engine', targetType: 'task', time: '2:41 PM', timeAgo: 'just now', detail: 'Backlog → In Progress' },
  { id: 'a2', user: { name: 'Jordan Lee', initials: 'JL', color: 'linear-gradient(135deg, #7c5cfc, #4facfe)', online: true }, action: 'commented on', target: 'Dark mode design system tokens', targetType: 'comment', time: '2:38 PM', timeAgo: '3m ago', detail: '"Looks good — let\'s also add a high-contrast mode variant."' },
  { id: 'a3', user: { name: 'Sam Rivera', initials: 'SR', color: 'linear-gradient(135deg, #f093fb, #f5576c)', online: true }, action: 'uploaded', target: 'wireframes-v3.fig', targetType: 'file', time: '2:31 PM', timeAgo: '10m ago', detail: '4.2 MB · Figma file' }
])

const onlineMembers = ref<OnlineUser[]>([
  { id: 1, name: 'Maya Chen', initials: 'MC', color: 'linear-gradient(135deg, #4facfe, #00f5d4)', role: 'Design Lead', status: 'online', activity: 'Editing wireframes' },
  { id: 2, name: 'Jordan Lee', initials: 'JL', color: 'linear-gradient(135deg, #7c5cfc, #4facfe)', role: 'Frontend Eng', status: 'online', activity: 'Code review' },
  { id: 3, name: 'Sam Rivera', initials: 'SR', color: 'linear-gradient(135deg, #f093fb, #f5576c)', role: 'Product Mgr', status: 'online', activity: 'Sprint planning' },
  { id: 4, name: 'Alex Kim', initials: 'AK', color: 'linear-gradient(135deg, #4facfe, #7c5cfc)', role: 'Backend Eng', status: 'online', activity: 'Deploying to staging' },
  { id: 5, name: 'Riley Walsh', initials: 'RW', color: 'linear-gradient(135deg, #fa709a, #fee140)', role: 'QA Engineer', status: 'online', activity: 'Running test suite' },
  { id: 6, name: 'Dana Park', initials: 'DP', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', role: 'ML Engineer', status: 'away', activity: 'Away' },
])

const targetTypeColor: Record<ActivityItem['targetType'], string> = {
  task: '#4facfe', course: '#00f5d4', comment: '#7c5cfc', file: '#fa709a', member: '#43e97b'
}
const onlineCount = computed(() => onlineMembers.value.filter(m => m.status === 'online').length)

let streamIntervalId: number | null = null

const virtualActions = [
  { action: 'moved', target: 'LMS quiz auto-grading module', targetType: 'task', detail: 'In Progress → In Review' },
  { action: 'commented on', target: 'API rate limiting for file uploads', targetType: 'comment', detail: '"Throttling works fine, merge this PR tomorrow."' },
  { action: 'uploaded', target: 'benchmark-results.pdf', targetType: 'file', detail: '1.8 MB · Audit Document' },
  { action: 'updated', target: 'User authentication — OAuth 2.0', targetType: 'task', detail: 'Progress: 80% → 100% ✨' }
]

function generateLiveActivityFeed() {
  const randomUserIdx = Math.floor(Math.random() * onlineMembers.value.length)
  const selectedUser = onlineMembers.value[randomUserIdx]
  
  const randomActionIdx = Math.floor(Math.random() * virtualActions.length)
  const chosenAction = virtualActions[randomActionIdx]

  if (!selectedUser || !chosenAction) return

  const newFeedItem: ActivityItem = {
    id: `act-${Date.now()}`,
    user: {
      name: selectedUser.name,
      initials: selectedUser.initials,
      color: selectedUser.color,
      online: selectedUser.status === 'online'
    },
    action: chosenAction.action,
    target: chosenAction.target,
    targetType: chosenAction.targetType as any,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeAgo: 'just now',
    detail: chosenAction.detail
  }

  activities.value.unshift(newFeedItem)

  if (activities.value.length > 10) {
    activities.value.pop()
  }
}

onMounted(() => {
  streamIntervalId = window.setInterval(generateLiveActivityFeed, 15000)
})

onUnmounted(() => {
  if (streamIntervalId) clearInterval(streamIntervalId)
})
</script>

<template>
  <div class="h-full flex flex-col bg-[#080912]/70 backdrop-blur-xl border-l border-white/5 overflow-hidden select-none">
    
    <div class="p-5 pb-0 flex-shrink-0">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-bold text-[#e2e4ed] tracking-tight">Team Activity</span>
        
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00f5d4]/10 border border-[#00f5d4]/20">
          <div class="w-1.5 h-1.5 rounded-full bg-[#00f5d4] shadow-[0_0_6px_rgba(0,245,212,0.8)]"></div>
          <span class="text-[9px] font-bold text-[#00f5d4] tracking-widest uppercase">Live</span>
        </div>
      </div>

      <div class="flex border-b border-white/5 gap-2">
        <button 
          @click="activeTab = 'activity'"
          :class="[
            'pb-2 px-2 text-xs font-semibold border-b-2 transition-all duration-200',
            activeTab === 'activity' ? 'text-[#4facfe] border-[#4facfe]' : 'text-[#5a6175] border-transparent hover:text-[#8b92a8]'
          ]"
        >
          Activity
        </button>
        <button 
          @click="activeTab = 'members'"
          :class="[
            'pb-2 px-2 text-xs font-semibold border-b-2 transition-all duration-200',
            activeTab === 'members' ? 'text-[#4facfe] border-[#4facfe]' : 'text-[#5a6175] border-transparent hover:text-[#8b92a8]'
          ]"
        >
          Members ({{ onlineCount }})
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-5 pt-2 custom-scrollbar">
      
      <div v-if="activeTab === 'activity'" class="divide-y divide-white/[0.03]">
        <div 
          v-for="(item, index) in activities" 
          :key="item.id" 
          class="flex gap-3 py-3 items-start"
        >
          <div class="relative flex-shrink-0">
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-extrabold text-white"
              :style="{ background: item.user.color }"
            >
              {{ item.user.initials }}
            </div>
            <div 
              v-if="item.user.online" 
              class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00f5d4] border-2 border-[#07080f]"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <p class="text-xs text-[#8b92a8] leading-relaxed">
                <span class="text-[#e2e4ed] font-semibold">{{ item.user.name }}</span>
                {{ ' ' }}{{ item.action }}{' '}
                <span :style="{ color: targetTypeColor[item.targetType] }" class="font-medium">
                  {{ item.target }}
                </span>
              </p>
              <span class="text-[10px] text-[#5a6175] font-mono whitespace-nowrap flex-shrink-0 mt-0.5">
                {{ item.timeAgo }}
              </span>
            </div>

            <div 
              v-if="item.detail" 
              class="mt-1.5 py-1 px-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] text-[11px] text-[#5a6175] flex items-center gap-1.5"
            >
              <span :style="{ color: targetTypeColor[item.targetType] }" class="opacity-80 flex-shrink-0">
                <svg v-if="item.targetType === 'task'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                <svg v-else-if="item.targetType === 'course'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                <svg v-else-if="item.targetType === 'comment'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                <svg v-else-if="item.targetType === 'file'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                <svg v-else-if="item.targetType === 'member'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
              </span>
              <span class="truncate">{{ item.detail }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-2 pt-2">
        <div 
          v-for="member in onlineMembers" 
          :key="member.id"
          class="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all duration-150 cursor-pointer"
        >
          <div class="relative flex-shrink-0">
            <div 
              class="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold text-white"
              :style="{ background: member.color }"
            >
              {{ member.initials }}
            </div>
            <div 
              :class="[
                'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#080912]',
                member.status === 'online' ? 'bg-[#00f5d4] shadow-[0_0_6px_rgba(0,245,212,0.5)]' : 'bg-[#fee140] shadow-[0_0_6px_rgba(254,225,64,0.5)]'
              ]"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-[#e2e4ed]">{{ member.name }}</span>
              <span 
                :class="[
                  'text-[8px] font-bold tracking-wider uppercase',
                  member.status === 'online' ? 'text-[#00f5d4]' : 'text-[#fee140]'
                ]"
              >
                {{ member.status }}
              </span>
            </div>
            <div class="flex items-center gap-1.5 mt-0.5 text-[11px]">
              <span class="text-[#5a6175]">{{ member.role }}</span>
              <span class="text-[#3a3f52]">·</span>
              <span class="text-[#4a5068] italic truncate">{{ member.activity }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="p-4 border-t border-white/5 grid grid-cols-3 gap-2 bg-black/[0.08] flex-shrink-0">
      <div class="p-2 rounded-lg bg-white/[0.01] border border-white/[0.03] text-center">
        <div class="text-lg font-bold text-[#00f5d4] font-mono leading-none">24</div>
        <div class="text-[9px] text-[#5a6175] mt-1 font-medium uppercase tracking-wider">Tasks Done</div>
      </div>
      <div class="p-2 rounded-lg bg-white/[0.01] border border-white/[0.03] text-center">
        <div class="text-lg font-bold text-[#7c5cfc] font-mono leading-none">7</div>
        <div class="text-[9px] text-[#5a6175] mt-1 font-medium uppercase tracking-wider">In Review</div>
      </div>
      <div class="p-2 rounded-lg bg-white/[0.01] border border-white/[0.03] text-center">
        <div class="text-lg font-bold text-[#f5576c] font-mono leading-none">2</div>
        <div class="text-[9px] text-[#5a6175] mt-1 font-medium uppercase tracking-wider">Overdue</div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Styling Scrollbar Kustom agar Terlihat Sangat Tipis & Elegan */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>