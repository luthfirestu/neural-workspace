<script setup lang="ts">
import { ref } from 'vue'
import { useKanbanStore, type Priority, type Tag } from '../stores/kanban'

const kanbanStore = useKanbanStore()
const currentView = ref<string>('Board')

const activeDragColumn = ref<string | null>(null)

function onDragStart(event: DragEvent, taskId: string) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function onDragOver(columnId: string) {
  activeDragColumn.value = columnId
}

function onDragLeave() {
  activeDragColumn.value = null
}

function onDrop(event: DragEvent, targetColumnId: string) {
  activeDragColumn.value = null
  if (event.dataTransfer) {
    const taskId = event.dataTransfer.getData('text/plain')
    if (taskId) {
      kanbanStore.moveTask(taskId, targetColumnId)
    }
  }
}

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#f5576c', bg: 'rgba(245,87,108,0.12)' },
  high: { label: 'High', color: '#fa709a', bg: 'rgba(250,112,154,0.12)' },
  medium: { label: 'Medium', color: '#fee140', bg: 'rgba(254,225,64,0.12)' },
  low: { label: 'Low', color: '#43e97b', bg: 'rgba(67,233,123,0.12)' },
}

const tagColors: Record<Tag, { color: string; bg: string }> = {
  Design: { color: '#4facfe', bg: 'rgba(79,172,254,0.1)' },
  Frontend: { color: '#7c5cfc', bg: 'rgba(124,92,252,0.1)' },
  Backend: { color: '#f093fb', bg: 'rgba(240,147,251,0.1)' },
  Research: { color: '#43e97b', bg: 'rgba(67,233,123,0.1)' },
  QA: { color: '#fee140', bg: 'rgba(254,225,64,0.1)' },
  LMS: { color: '#00f5d4', bg: 'rgba(0,245,212,0.1)' },
}

function openModalForColumn(columnId: string) {
  kanbanStore.targetColumnId = columnId
  kanbanStore.isModalOpen = true
}
</script>

<template>
  <div class="h-full flex flex-col p-5 pb-0 overflow-hidden select-none">
    
    <div class="flex items-center justify-between mb-5 flex-shrink-0">
      <div class="flex items-center gap-5">
        <div>
          <span class="text-lg font-bold text-[#e2e4ed] tracking-tight">Project Board</span>
          <span class="text-xs text-[#5a6175] ml-2.5">
            {{ kanbanStore.doneTasks }}/{{ kanbanStore.totalTasks }} tasks complete
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="w-[120px] h-1 rounded-full bg-white/5 overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-[#4facfe] to-[#7c5cfc] rounded-full transition-all duration-500 ease-out"
              :style="{ width: kanbanStore.overallProgress + '%' }"
            ></div>
          </div>
          <span class="text-[11px] text-[#5a6175] font-mono">{{ kanbanStore.overallProgress }}%</span>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button 
          v-for="view in ['Board', 'List', 'Timeline']" 
          :key="view"
          @click="currentView = view"
          :class="[
            'px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 border cursor-pointer',
            currentView === view 
              ? 'bg-[#4facfe]/10 text-[#4facfe] border-[#4facfe]/20' 
              : 'bg-transparent text-[#5a6175] border-white/[0.07] hover:text-[#8b92a8]'
          ]"
        >
          {{ view }}
        </button>
      </div>
    </div>

    <div class="flex gap-4 flex-1 overflow-x-auto overflow-y-hidden pb-5 custom-horizontal-scrollbar">
      
      <div 
        v-for="column in kanbanStore.columns" 
        :key="column.id" 
        class="flex flex-col min-w-[260px] max-w-[300px] flex-1"
      >
        <div class="flex items-center justify-between mb-3.5 pr-1">
          <div class="flex items-center gap-2">
            <div 
              class="w-2 h-2 rounded-full" 
              :style="{ background: column.color, boxShadow: `0 0 8px ${column.color}80` }"
            ></div>
            <span class="text-xs font-bold text-[#8b92a8] tracking-widest uppercase">
              {{ column.title }}
            </span>
            <span class="px-1.5 py-0.5 rounded-md bg-white/5 text-[11px] font-bold text-[#5a6175] font-mono">
              {{ column.tasks.length }}
            </span>
          </div>
          
          <button class="w-6 h-6 rounded-md border border-white/[0.08] bg-transparent text-[#5a6175] hover:text-[#8b92a8] flex items-center justify-center cursor-pointer active:scale-95 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div class="h-0.5 rounded-full mb-3 opacity-60" :style="{ background: column.color }"></div>

        <div 
          @dragover.prevent="onDragOver(column.id)"
          @dragleave="onDragLeave"
          @drop="onDrop($event, column.id)"
          :class="[
            'flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-vertical-scrollbar rounded-xl p-1 transition-all duration-200',
            activeDragColumn === column.id ? 'bg-[#4facfe]/5 border border-dashed border-[#4facfe]/30' : 'border border-transparent'
          ]"
        >
          
          <div 
            v-for="task in column.tasks" 
            :key="task.id"
            draggable="true"
            @dragstart="onDragStart($event, task.id)"
            class="bg-[#0c0e18]/80 backdrop-blur-md border border-white/5 rounded-xl p-3.5 shadow-md hover:shadow-2xl hover:shadow-[#4facfe]/5 hover:bg-[#10131f]/95 hover:border-[#4facfe]/20 hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing group"
          >
            <div class="flex items-center gap-1.5 mb-2.5 flex-wrap">
              <span 
                class="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase font-sans"
                :style="{ color: priorityConfig[task.priority].color, backgroundColor: priorityConfig[task.priority].bg }"
              >
                {{ priorityConfig[task.priority].label }}
              </span>
              <span 
                v-for="tag in task.tags" 
                :key="tag"
                class="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide"
                :style="{ color: tagColors[tag].color, backgroundColor: tagColors[tag].bg }"
              >
                {{ tag }}
              </span>
            </div>

            <h3 class="text-xs font-semibold text-[#e2e4ed] mb-1.5 leading-snug group-hover:text-white transition-colors">
              {{ task.title }}
            </h3>
            <p class="text-[11px] text-[#5a6175] mb-3 leading-relaxed">
              {{ task.description }}
            </p>

            <div v-if="task.progress !== undefined" class="mb-3">
              <div class="flex justify-between mb-1 text-[10px]">
                <span class="text-[#5a6175] font-medium">Progress</span>
                <span :class="['font-bold font-mono', task.progress === 100 ? 'text-[#00f5d4]' : 'text-[#8b92a8]']">
                  {{ task.progress }}%
                </span>
              </div>
              <div class="h-[3px] rounded-full bg-white/5 overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-300"
                  :class="task.progress === 100 ? 'bg-gradient-to-r from-[#43e97b] to-[#00f5d4]' : 'bg-gradient-to-r from-[#4facfe] to-[#7c5cfc]'"
                  :style="{ width: task.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-0.5 pointer-events-none">
              <div class="flex items-center">
                <div 
                  v-for="(a, idx) in task.assignees" 
                  :key="idx"
                  :title="a.initials"
                  class="w-[22px] h-[22px] rounded-full border border-[#0c0e18] flex items-center justify-center text-[8px] font-extrabold text-white relative transition-transform hover:-translate-y-0.5"
                  :style="{ 
                    background: a.color,
                    marginLeft: idx === 0 ? '0px' : '-6px',
                    zIndex: task.assignees.length - idx
                  }"
                >
                  {{ a.initials }}
                </div>
              </div>

              <div class="flex items-center gap-2.5 text-[#5a6175]">
                <div v-if="task.hasAttachment" class="flex items-center gap-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
                
                <div class="flex items-center gap-1 text-[10px] font-mono">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{{ task.comments }}</span>
                </div>

                <div class="flex items-center gap-1 text-[10px]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{{ task.dueDate }}</span>
                </div>
              </div>
            </div>

          </div>

          <button 
            @click="openModalForColumn(column.id)"
            class="w-full py-2.5 rounded-xl border border-dashed border-white/[0.08] bg-transparent text-[#5a6175] hover:border-[#4facfe]/30 hover:text-[#4facfe] hover:bg-[#4facfe]/5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer mt-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add task</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-horizontal-scrollbar::-webkit-scrollbar { height: 5px; }
.custom-horizontal-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.04); border-radius: 10px; }
.custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.08); }
.custom-vertical-scrollbar::-webkit-scrollbar { width: 0px; }
</style>