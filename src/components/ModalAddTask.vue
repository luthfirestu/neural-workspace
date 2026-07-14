<script setup lang="ts">
import { ref } from 'vue'
import { useKanbanStore, type Priority, type Tag } from '../stores/kanban'

const kanbanStore = useKanbanStore()

const title = ref<string>('')
const description = ref<string>('')
const priority = ref<Priority>('medium')
const selectedTags = ref<Tag[]>([])
const priorities: Priority[] = ['low', 'medium', 'high', 'critical']
const availableTags: Tag[] = ['Design', 'Frontend', 'Backend', 'Research', 'QA', 'LMS']

function toggleTag(tag: Tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

function handleSubmit() {
  if (!title.value.trim()) return
  
  kanbanStore.addTask(kanbanStore.targetColumnId, {
    title: title.value,
    description: description.value,
    priority: priority.value,
    tags: selectedTags.value,
    assignees: [{ initials: 'AK', color: 'linear-gradient(135deg, #4facfe, #7c5cfc)' }],
    dueDate: 'Jul 25',
    progress: kanbanStore.targetColumnId === 'done' ? 100 : (priority.value === 'high' ? 0 : undefined),
    comments: 0
  })

  title.value = ''
  description.value = ''
  priority.value = 'medium'
  selectedTags.value = []
  kanbanStore.isModalOpen = false
}
</script>

<template>
  <div v-if="kanbanStore.isModalOpen" class="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 p-4">
    <div @click="kanbanStore.isModalOpen = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
    
    <div class="bg-[#0c0e18] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 text-[#e2e4ed] animate-slide-in">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-bold tracking-tight">Create New Task</h3>
        <button @click="kanbanStore.isModalOpen = false" class="text-[#5a6175] hover:text-[#e2e4ed] text-sm cursor-pointer">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="modal-title" class="text-[11px] font-bold text-[#8b92a8] uppercase tracking-wider">Task Title</label>
          <input id="modal-title" v-model="title" type="text" placeholder="e.g., Integrate OAuth Endpoints" required class="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 text-xs outline-none focus:border-[#4facfe]/40" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="modal-desc" class="text-[11px] font-bold text-[#8b92a8] uppercase tracking-wider">Description</label>
          <textarea id="modal-desc" v-model="description" rows="3" placeholder="Describe the scope of this task..." class="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 text-xs outline-none focus:border-[#4facfe]/40 resize-none font-sans"></textarea>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[11px] font-bold text-[#8b92a8] uppercase tracking-wider">Priority Level</span>
          <div class="grid grid-cols-4 gap-2">
            <label v-for="p in priorities" :key="p" class="flex flex-col items-center justify-center py-2 border rounded-lg cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-all select-none" :class="[priority === p ? 'border-[#4facfe] bg-[#4facfe]/10 text-[#4facfe]' : 'border-white/[0.08] bg-white/[0.02] text-[#5a6175] hover:text-[#8b92a8]']">
              <input type="radio" name="priority" :value="p" v-model="priority" class="hidden" />
              {{ p }}
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[11px] font-bold text-[#8b92a8] uppercase tracking-wider">Select Tags</span>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="tag in availableTags" :key="tag" type="button" @click="toggleTag(tag)" :class="['px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer', selectedTags.includes(tag) ? 'bg-[#7c5cfc]/20 text-[#7c5cfc] border border-[#7c5cfc]/40' : 'bg-white/[0.03] text-[#5a6175] border border-white/[0.06] hover:text-[#8b92a8]']">
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 mt-2 pt-4 border-t border-white/5">
          <button type="button" @click="kanbanStore.isModalOpen = false" class="px-4 h-[34px] rounded-lg border border-white/[0.08] text-xs font-semibold text-[#5a6175] hover:text-[#8b92a8] cursor-pointer">Cancel</button>
          <button type="submit" class="px-4 h-[34px] rounded-lg bg-gradient-to-br from-[#4facfe] to-[#7c5cfc] text-white text-xs font-semibold shadow-lg shadow-[#4facfe]/20 cursor-pointer hover:opacity-95">Save Task</button>
        </div>
      </form>
    </div>
  </div>
</template>