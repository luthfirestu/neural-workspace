import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Tag = 'Design' | 'Frontend' | 'Backend' | 'Research' | 'QA' | 'LMS'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  tags: Tag[]
  assignees: { initials: string; color: string }[]
  progress?: number
  comments: number
  dueDate: string
  hasAttachment?: boolean
}

export interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

const STORAGE_KEY = 'neural_workspace_kanban_data'

export const useKanbanStore = defineStore('kanban', () => {
  const isModalOpen = ref<boolean>(false)
  const targetColumnId = ref<string>('backlog')
  const defaultColumns: Column[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      color: '#5a6175',
      tasks: [
        { id: 't1', title: 'Redesign course enrollment flow', description: 'Simplify the multi-step enrollment process to reduce friction', priority: 'medium', tags: ['Design', 'LMS'], assignees: [{ initials: 'MC', color: 'linear-gradient(135deg, #4facfe, #00f5d4)' }], comments: 4, dueDate: 'Jul 22' },
        { id: 't2', title: 'API rate limiting for file uploads', description: 'Implement throttling on the media upload endpoints', priority: 'low', tags: ['Backend'], assignees: [{ initials: 'JL', color: 'linear-gradient(135deg, #7c5cfc, #4facfe)' }], comments: 1, dueDate: 'Jul 28' }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#4facfe',
      tasks: [
        { id: 't3', title: 'Real-time collaboration engine', description: 'WebSocket-based document syncing with operational transforms', priority: 'critical', tags: ['Frontend', 'Backend'], assignees: [{ initials: 'SR', color: 'linear-gradient(135deg, #f093fb, #f5576c)' }, { initials: 'AK', color: 'linear-gradient(135deg, #4facfe, #7c5cfc)' }], progress: 68, comments: 12, dueDate: 'Jul 18', hasAttachment: true }
      ]
    },
    { id: 'review', title: 'In Review', color: '#7c5cfc', tasks: [] },
    { id: 'done', title: 'Done', color: '#00f5d4', tasks: [] }
  ]

  const savedData = localStorage.getItem(STORAGE_KEY)
  const columns = ref<Column[]>(savedData ? JSON.parse(savedData) : defaultColumns)

  watch(columns, (newColumns) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newColumns))
  }, { deep: true })

  const totalTasks = computed(() => columns.value.reduce((acc, c) => acc + c.tasks.length, 0))
  const doneTasks = computed(() => columns.value.find(c => c.id === 'done')?.tasks.length ?? 0)
  const overallProgress = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((doneTasks.value / totalTasks.value) * 100)
  })

function addTask(columnId: string, task: Omit<Task, 'id'>) {
  const column = columns.value.find(c => c.id === columnId)
  if (column) {
    column.tasks.push({
      ...task,
      id: `t-${Date.now()}`
    })
  }
}

  function moveTask(taskId: string, targetColumnId: string) {
    let foundTask: Task | undefined = undefined
    for (const col of columns.value) {
      const index = col.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        foundTask = col.tasks.splice(index, 1)[0]
        break
      }
    }

    if (foundTask) {
      const targetCol = columns.value.find(c => c.id === targetColumnId)
      if (targetCol) {
        if (targetColumnId === 'done') {
          foundTask.progress = 100
        } else if (targetColumnId === 'backlog') {
          foundTask.progress = undefined
        } else if (targetColumnId === 'in-progress' && (foundTask.progress === undefined || foundTask.progress === 100)) {
          foundTask.progress = 20
        }
        targetCol.tasks.push(foundTask)
      }
    }
  }

  return { columns, isModalOpen, targetColumnId, totalTasks, doneTasks, overallProgress, addTask, moveTask }
})