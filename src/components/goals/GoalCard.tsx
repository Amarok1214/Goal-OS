import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { GoalForm } from './GoalForm'
import { TaskForm } from './TaskForm'
import { TaskItemCompact } from './TaskItemCompact'
import { useGoalStore } from '../../store/goalStore'
import { useTaskStore } from '../../store/taskStore'
import { useFocusStore } from '../../store/focusStore'
import type { Goal, GoalStatus, Task } from '../../types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../types'
import { 
  Pencil, 
  Trash2, 
  Calendar, 
  Plus, 
  Zap,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  ListTodo,
  AlertTriangle,
  ExternalLink
} from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  highlight?: 'overdue' | 'soon'
}

const statusConfig: Record<GoalStatus, { label: string; bg: string; text: string; border: string }> = {
  active: { 
    label: 'Active', 
    bg: 'rgba(34, 197, 94, 0.15)', 
    text: '#4ade80',
    border: '#4ade80'
  },
  paused: { 
    label: 'Paused', 
    bg: 'rgba(251, 191, 36, 0.15)', 
    text: '#fbbf24',
    border: '#fbbf24'
  },
  completed: { 
    label: 'Completed', 
    bg: 'rgba(45, 212, 191, 0.15)', 
    text: '#2dd4bf',
    border: '#2dd4bf'
  },
  someday: { 
    label: 'Someday', 
    bg: 'rgba(148, 163, 184, 0.15)', 
    text: '#94a3b8',
    border: '#94a3b8'
  },
}

type TaskGroup = 'inProgress' | 'remaining' | 'completed'

interface TaskGroupConfig {
  key: TaskGroup
  label: string
  icon: React.ReactNode
  defaultExpanded: boolean
}

const TASK_GROUPS: TaskGroupConfig[] = [
  { key: 'inProgress', label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" />, defaultExpanded: true },
  { key: 'remaining', label: 'Remaining', icon: <Circle className="w-3.5 h-3.5" />, defaultExpanded: true },
  { key: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" />, defaultExpanded: false },
]

export function GoalCard({ goal, highlight }: GoalCardProps) {
  const { deleteGoal } = useGoalStore()
  const { getTasksByGoal } = useTaskStore()
  const { activeTaskId, stopPomodoro } = useFocusStore()
  
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<TaskGroup, boolean>>({
    inProgress: true,
    remaining: true,
    completed: false,
  })

  // Highlight background colors
  const highlightBg = highlight === 'overdue' 
    ? 'rgba(239, 68, 68, 0.08)' 
    : highlight === 'soon' 
    ? 'rgba(251, 191, 36, 0.08)' 
    : undefined

  const goalTasks = getTasksByGoal(goal.id)
  const status = statusConfig[goal.status]

  // Group tasks
  const { inProgressTasks, remainingTasks, completedTasks } = useMemo(() => {
    const inProgress = goalTasks.filter(t => !t.completed && hasActiveSubtasks(t))
    const remaining = goalTasks.filter(t => !t.completed && !hasActiveSubtasks(t))
    const completed = goalTasks.filter(t => t.completed)
    return { inProgressTasks: inProgress, remainingTasks: remaining, completedTasks: completed }
  }, [goalTasks])

  const hasActiveSubtasks = (task: Task): boolean => {
    return (task.subtasks?.some(s => s.completed) ?? false) && 
           (task.subtasks?.some(s => !s.completed) ?? false)
  }

  // Progress calculation
  const totalItems = goalTasks.reduce((acc, task) => acc + 1 + (task.subtasks?.length || 0), 0)
  const completedItems = goalTasks.reduce((acc, task) => {
    const taskCompleted = task.completed ? 1 : 0
    const subtasksCompleted = task.subtasks?.filter(s => s.completed).length || 0
    return acc + taskCompleted + subtasksCompleted
  }, 0)
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const completedTaskCount = goalTasks.filter(t => t.completed).length

  // Deadline helpers
  const getDeadlineStatus = () => {
    if (!goal.deadline) return 'none'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadline = new Date(goal.deadline)
    deadline.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'overdue'
    if (diffDays <= 2) return 'soon'
    return 'normal'
  }

  const deadlineStatus = getDeadlineStatus()
  const formatDeadline = (date: Date | null) => {
    if (!date) return null
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Estimate completion based on current pace
  const getEstimatedCompletion = () => {
    if (!goal.deadline || completedItems === 0 || progress === 100) return null
    const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysRemaining <= 0) return null
    
    const itemsRemaining = totalItems - completedItems
    const daysPerItem = daysRemaining / itemsRemaining
    const estimatedDate = new Date(Date.now() + (daysPerItem * itemsRemaining * 24 * 60 * 60 * 1000))
    
    if (estimatedDate > new Date(goal.deadline)) {
      return { type: 'ahead', date: estimatedDate }
    }
    return { type: 'behind', date: estimatedDate }
  }

  const estimatedCompletion = getEstimatedCompletion()

  // Focus on this goal - start pomodoro on first uncompleted task
  const handleFocusGoal = () => {
    const firstUncompleted = goalTasks.find(t => !t.completed)
    if (firstUncompleted) {
      if (activeTaskId) {
        stopPomodoro()
      }
      // The intention modal will be shown by TaskItemCompact
    }
  }

  const toggleGroup = (group: TaskGroup) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  const handleDelete = () => {
    deleteGoal(goal.id)
    setIsDeleteConfirmOpen(false)
  }

  const getGroupTasks = (group: TaskGroup): Task[] => {
    switch (group) {
      case 'inProgress': return inProgressTasks
      case 'remaining': return remainingTasks
      case 'completed': return completedTasks
    }
  }

  const renderProgressRing = () => {
    const size = 56
    const strokeWidth = 5
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    const progressColor = progress === 100 ? '#22c55e' : '#2dd4bf'

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${progressColor}50)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-sm font-bold"
            style={{ color: progressColor }}
          >
            {progress}%
          </span>
        </div>
      </div>
    )
  }

  const renderTaskGroup = (groupConfig: TaskGroupConfig) => {
    const groupTasks = getGroupTasks(groupConfig.key)
    const isExpanded = expandedGroups[groupConfig.key]
    const count = groupTasks.length

    if (count === 0 && groupConfig.key !== 'inProgress') return null

    return (
      <div key={groupConfig.key} className="mb-3">
        {/* Group header */}
        <button
          onClick={() => toggleGroup(groupConfig.key)}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors group"
        >
          <span style={{ color: 'var(--text-muted)' }}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{groupConfig.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            {groupConfig.label}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
            {count}
          </span>
        </button>

        {/* Group tasks */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-1 mt-1 pl-4">
                {groupTasks.length === 0 ? (
                  <p className="text-xs italic py-2 px-3" style={{ color: 'var(--text-muted)' }}>No tasks</p>
                ) : (
                  groupTasks.map((task) => (
                    <TaskItemCompact
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      goalId={goal.id}
                      isDimmed={false}
                    />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <Card 
        className="glass flex flex-col transition-all duration-300 overflow-hidden"
        style={{
          borderLeft: `4px solid ${status.border}`,
          background: highlightBg || 'rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Card Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Progress Ring */}
            {totalItems > 0 && (
              <div className="shrink-0">
                {renderProgressRing()}
              </div>
            )}

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 
                  className="text-xl font-bold leading-tight" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  {goal.title}
                </h3>
                <span 
                  className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ 
                    backgroundColor: status.bg, 
                    color: status.text,
                    border: `1px solid ${status.border}40`
                  }}
                >
                  {status.label}
                </span>
              </div>

              {/* Category badge */}
              {goal.category && (
                <span 
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-2"
                  style={{ 
                    backgroundColor: `${CATEGORY_COLORS[goal.category]}20`,
                    color: CATEGORY_COLORS[goal.category],
                  }}
                >
                  {CATEGORY_LABELS[goal.category]}
                </span>
              )}

              {/* Card Meta Row */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm">
                {/* Deadline */}
                <div className={`flex items-center gap-1.5 ${
                  deadlineStatus === 'overdue' ? 'text-red-400' :
                  deadlineStatus === 'soon' ? 'text-amber-400' :
                  'text-slate-400'
                }`}>
                  {deadlineStatus === 'overdue' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  <span className="text-xs">
                    {goal.deadline 
                      ? (deadlineStatus === 'overdue' ? 'Overdue!' : formatDeadline(goal.deadline))
                      : 'No deadline'
                    }
                  </span>
                </div>

                {/* Task summary */}
                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <ListTodo className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    {completedTaskCount} of {goalTasks.length} tasks done
                  </span>
                </div>

                {/* Estimated completion */}
                {estimatedCompletion && (
                  <div className={`flex items-center gap-1.5 ${
                    estimatedCompletion.type === 'ahead' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      {estimatedCompletion.type === 'ahead' ? 'On track' : 'Behind pace'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        {goalTasks.length > 0 && (
          <div className="px-5 pb-4">
            <div 
              className="border-t pt-4"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {/* In Progress Tasks */}
              {renderTaskGroup(TASK_GROUPS[0])}
              
              {/* Remaining Tasks */}
              {renderTaskGroup(TASK_GROUPS[1])}
              
              {/* Completed Tasks */}
              {renderTaskGroup(TASK_GROUPS[2])}
            </div>
          </div>
        )}

        {/* Links */}
        {goal.links && goal.links.length > 0 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {goal.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <ExternalLink className="w-3 h-3" />
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Card Footer */}
        <div 
          className="px-5 py-3 border-t flex items-center justify-between"
          style={{ 
            background: 'rgba(0,0,0,0.15)',
            borderColor: 'rgba(255,255,255,0.08)'
          }}
        >
          {/* Left: Add Task */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddTask}
            className="btn-ghost"
            style={{ color: 'var(--text-primary)' }}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="text-sm">Add Task</span>
          </Button>

          {/* Center: Focus on goal */}
          {goalTasks.some(t => !t.completed) && (
            <button
              onClick={handleFocusGoal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
              title="Start Pomodoro on first uncompleted task"
            >
              <Zap className="w-3.5 h-3.5" />
              Focus
            </button>
          )}

          {/* Right: Edit/Delete icons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="h-8 w-8 p-0 btn-ghost"
              title="Edit goal"
            >
              <Pencil className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="h-8 w-8 p-0"
              title="Delete goal"
            >
              <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Goal Modal */}
      <GoalForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        editGoal={goal}
      />

      {/* Task Form Modal */}
      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        goalId={goal.id}
        editTask={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <>
          <div
            className="dialog-overlay"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="dialog-content">
            <h3 className="text-xl font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>Delete Goal</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete "{goal.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn-outline"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
