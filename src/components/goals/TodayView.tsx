import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTaskStore } from '../../store/taskStore'
import { useGoalStore } from '../../store/goalStore'
import { useFocusStore } from '../../store/focusStore'
import { TaskItem } from './TaskItem'
import { TaskForm } from './TaskForm'
import { Calendar, Target, CheckSquare, Zap } from 'lucide-react'
import type { Task } from '../../types'

type FilterType = 'all' | 'due-today' | 'active'

export function TodayView() {
  const { tasks, getTodayTasks } = useTaskStore()
  const { goals } = useGoalStore()
  const { activeTaskId, getTodayPomodoros, getWeekPomodoros } = useFocusStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayPomodoros = getTodayPomodoros()
  const weekPomodoros = getWeekPomodoros()

  const getFilteredTasks = () => {
    const todayTasks = getTodayTasks()
    const activeTasks = tasks.filter(t => !t.completed)
    
    switch (filter) {
      case 'due-today':
        return tasks.filter(task => {
          if (!task.dueDate) return false
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        })
      case 'active':
        return activeTasks
      default:
        return todayTasks
    }
  }

  const filteredTasks = getFilteredTasks()
  const completedToday = filteredTasks.filter(t => t.completed).length

  const getGoalTitle = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId)
    return goal?.title || 'Unknown Goal'
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
          Today's Tasks
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your tasks for today and keep track of active work
        </p>
      </div>

      {/* Pomodoro Streak */}
      {(todayPomodoros > 0 || weekPomodoros > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 glass rounded-xl p-4"
          style={{ border: '1px solid rgba(251,191,36,0.3)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#fbbf24' }}>Focus Streak</p>
                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  🔥 {todayPomodoros} today · {weekPomodoros} this week
                </p>
              </div>
            </div>
            <div className="text-3xl">
              🍅
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'due-today', 'active'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: filter === f ? 'var(--accent-primary)' : 'var(--surface-glass)',
              color: filter === f ? '#fff' : 'var(--text-secondary)',
              border: '1px solid ' + (filter === f ? 'var(--accent-primary)' : 'var(--border-subtle)')
            }}
          >
            {f === 'all' && 'All Today'}
            {f === 'due-today' && 'Due Today'}
            {f === 'active' && 'Active'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--text-secondary)' }}>
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {filteredTasks.length}
          </span>
        </div>
        <div className="glass p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1" style={{ color: '#4ade80' }}>
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Done</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: '#4ade80' }}>
            {completedToday}
          </span>
        </div>
        <div className="glass p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--text-accent)' }}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Remaining</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {filteredTasks.length - completedToday}
          </span>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="glass w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <Target className="w-10 h-10" style={{ color: 'var(--text-accent)' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>
            No tasks {filter === 'all' ? 'today' : filter === 'due-today' ? 'due today' : 'active'}
          </h3>
          <p className="mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            {filter === 'all' 
              ? 'All caught up! Add tasks to your goals to see them here.'
              : filter === 'due-today'
              ? 'No tasks due today. Great job planning ahead!'
              : 'No active tasks. Complete some tasks or add new ones!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              className="glass rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                  background: 'var(--surface-glass)',
                  color: 'var(--text-secondary)'
                }}>
                  {getGoalTitle(task.goalId)}
                </span>
              </div>
              <TaskItem 
                task={task} 
                onEdit={handleEditTask} 
                dimmed={!!activeTaskId && activeTaskId !== task.id}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <TaskForm
          open={isTaskFormOpen}
          onOpenChange={setIsTaskFormOpen}
          goalId={editingTask?.goalId || goals[0]?.id || ''}
          editTask={editingTask}
        />
      )}
    </div>
  )
}
