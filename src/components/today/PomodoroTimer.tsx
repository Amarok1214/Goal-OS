import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useFocusStore, 
  POMODORO_WORK, 
  POMODORO_SHORT_BREAK, 
  POMODORO_LONG_BREAK,
  POMODOROS_BEFORE_LONG_BREAK,
  playChime 
} from '../../store/focusStore'
import { useTaskStore } from '../../store/taskStore'
import { useScheduleStore } from '../../store/scheduleStore'
import { useGoalStore } from '../../store/goalStore'
import { 
  StopCircle, 
  Coffee, 
  Play, 
  Pause, 
  SkipForward,
  Target,
  AlertCircle,
  X,
  Calendar
} from 'lucide-react'

export function PomodoroTimer() {
  const { 
    activeTaskId,
    pomodoroPhase,
    pomodoroTimeLeft,
    pomodorosCompleted,
    isRunning,
    sessionIntention,
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    skipPhase,
    stopPomodoro,
    tick,
    addDistraction
  } = useFocusStore()
  
  const { tasks } = useTaskStore()
  const { getCurrentBlock } = useScheduleStore()
  const { getGoalById } = useGoalStore()
  
  const [showIntentionModal, setShowIntentionModal] = useState(false)
  const [intention, setIntention] = useState('')
  const [showDistractionInput, setShowDistractionInput] = useState(false)
  const [distractionText, setDistractionText] = useState('')
  const [showPhasePrompt, setShowPhasePrompt] = useState(false)
  const [pendingAction, setPendingAction] = useState<'startBreak' | 'startWork' | null>(null)
  
  const activeTask = tasks.find((t) => t.id === activeTaskId)
  
  // Get current schedule block if any
  const currentBlock = pomodoroPhase === 'work' && isRunning ? getCurrentBlock() : null
  const linkedGoal = currentBlock?.goalId ? getGoalById(currentBlock.goalId) : null
  
  // Timer tick
  useEffect(() => {
    if (!isRunning || pomodoroPhase === 'idle') return
    
    const interval = setInterval(() => {
      tick()
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isRunning, pomodoroPhase, tick])
  
  // Play chime when phase completes
  useEffect(() => {
    if (pomodoroTimeLeft === 0 && pomodoroPhase !== 'idle') {
      playChime()
      setShowPhasePrompt(true)
      
      if (pomodoroPhase === 'work') {
        setPendingAction('startBreak')
      } else {
        setPendingAction('startWork')
      }
    }
  }, [pomodoroTimeLeft, pomodoroPhase])
  
  // Browser notification
  useEffect(() => {
    if (pomodoroTimeLeft === 0 && pomodoroPhase !== 'idle') {
      if (Notification.permission === 'granted') {
        new Notification(
          pomodoroPhase === 'work' ? 'Work session complete!' : 'Break over!',
          { body: pomodoroPhase === 'work' ? 'Time for a break ☕' : 'Ready to focus again? 🍅' }
        )
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [pomodoroTimeLeft, pomodoroPhase])
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
  
  const handleStartWithIntention = () => {
    if (!activeTask || !activeTaskId) return
    const taskTitle = activeTask.title
    const goalId = activeTask.goalId || ''
    startPomodoro(activeTaskId, goalId, taskTitle, intention)
    setShowIntentionModal(false)
    setIntention('')
  }
  
  const handleDistractionSubmit = () => {
    if (distractionText.trim()) {
      addDistraction(distractionText.trim())
    }
    setDistractionText('')
    setShowDistractionInput(false)
  }
  
  const handlePhasePromptAction = (action: 'startBreak' | 'startWork') => {
    if (action === 'startBreak') {
      resumePomodoro()
    } else {
      resumePomodoro()
    }
    setShowPhasePrompt(false)
    setPendingAction(null)
  }
  
  const getPhaseColors = () => {
    switch (pomodoroPhase) {
      case 'work':
        return {
          primary: '#0ea5e9',
          secondary: '#38bdf8',
          bg: 'rgba(14,165,233,0.08)',
          border: 'rgba(14,165,233,0.3)',
          label: '🍅 Focus Time',
          gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        }
      case 'shortBreak':
        return {
          primary: '#22c55e',
          secondary: '#4ade80',
          bg: 'rgba(34,197,94,0.08)',
          border: 'rgba(34,197,94,0.3)',
          label: '☕ Short Break',
          gradient: 'linear-gradient(135deg, #4ade80, #22c55e)',
        }
      case 'longBreak':
        return {
          primary: '#a855f7',
          secondary: '#c084fc',
          bg: 'rgba(168,85,247,0.08)',
          border: 'rgba(168,85,247,0.3)',
          label: '🌟 Long Break',
          gradient: 'linear-gradient(135deg, #c084fc, #a855f7)',
        }
      default:
        return {
          primary: '#64748b',
          secondary: '#94a3b8',
          bg: 'rgba(100,116,139,0.08)',
          border: 'rgba(100,116,139,0.3)',
          label: 'Ready',
          gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
        }
    }
  }
  
  const colors = getPhaseColors()
  const totalTime = pomodoroPhase === 'work' ? POMODORO_WORK 
    : pomodoroPhase === 'shortBreak' ? POMODORO_SHORT_BREAK 
    : POMODORO_LONG_BREAK
  const progress = ((totalTime - pomodoroTimeLeft) / totalTime) * 100
  
  // No active task - show trigger button
  if (!activeTaskId || !activeTask) {
    return (
      <div className="glass-strong p-4 mb-6" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          Click the play button on a task to start a Pomodoro session
        </p>
      </div>
    )
  }
  
  return (
    <>
      <motion.div 
        className="glass-strong p-5 mb-6 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255, 255, 255, 0.07)',
          borderLeft: `4px solid ${colors.primary}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: colors.gradient,
                boxShadow: `0 4px 12px ${colors.primary}40`,
              }}
              animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
            >
              {pomodoroPhase === 'work' ? (
                <Target className="w-6 h-6 text-white" />
              ) : (
                <Coffee className="w-6 h-6 text-white" />
              )}
            </motion.div>
            
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                {colors.label}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {activeTask.title}
              </p>
            </div>
          </div>
          
          {/* Pomodoro counter */}
          <div className="flex items-center gap-1">
            {[...Array(POMODOROS_BEFORE_LONG_BREAK)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: i < pomodorosCompleted ? colors.primary : 'rgba(255,255,255,0.1)',
                }}
                animate={i === pomodorosCompleted && isRunning ? { scale: [1, 1.3, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            ))}
          </div>
        </div>
        
        {/* Intention display */}
        <AnimatePresence>
          {sessionIntention && pomodoroPhase === 'work' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: colors.primary }}>
                Session Intention
              </p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{sessionIntention}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Active Schedule Block indicator */}
        <AnimatePresence>
          {currentBlock && pomodoroPhase === 'work' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg"
              style={{ 
                background: 'rgba(168, 85, 247, 0.1)', 
                border: '1px solid rgba(168, 85, 247, 0.3)' 
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" style={{ color: '#a855f7' }} />
                <p className="text-xs font-medium" style={{ color: '#a855f7' }}>
                  Currently: {linkedGoal ? linkedGoal.title : currentBlock.title}
                </p>
              </div>
              {currentBlock.goalId && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Scheduled study block
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Timer display */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg className="w-48 h-48" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={colors.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 * (1 - progress / 100)}
                transform="rotate(-90 100 100)"
                style={{ filter: `drop-shadow(0 0 8px ${colors.primary}50)` }}
              />
            </svg>
            
            {/* Time in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-5xl font-bold font-mono"
                style={{ color: colors.primary }}
                key={pomodoroTimeLeft}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.1 }}
              >
                {formatTime(pomodoroTimeLeft)}
              </motion.span>
              <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {/* Stop button */}
          <button
            onClick={stopPomodoro}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
          >
            <StopCircle className="w-5 h-5" />
          </button>
          
          {/* Play/Pause button */}
          <motion.button
            onClick={isRunning ? pausePomodoro : resumePomodoro}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white"
            style={{ background: colors.gradient, boxShadow: `0 4px 16px ${colors.primary}40` }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </motion.button>
          
          {/* Skip button */}
          <button
            onClick={skipPhase}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        
        {/* Distraction log button */}
        {pomodoroPhase === 'work' && isRunning && (
          <motion.div 
            className="mt-4 pt-4 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setShowDistractionInput(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm"
              style={{ 
                background: 'rgba(251,191,36,0.1)', 
                color: '#fbbf24',
                border: '1px dashed rgba(251,191,36,0.2)'
              }}
            >
              <AlertCircle className="w-4 h-4" />
              Log Distraction
            </button>
          </motion.div>
        )}
      </motion.div>
      
      {/* Intention Modal */}
      <AnimatePresence>
        {showIntentionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowIntentionModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass rounded-xl p-6 w-full max-w-md"
              style={{ background: 'rgba(26, 47, 69, 0.98)' }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                What will you accomplish?
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Set an intention for this Pomodoro session
              </p>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="e.g., Write the introduction section..."
                className="glass-input w-full px-4 py-3 mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && intention.trim()) {
                    handleStartWithIntention()
                  }
                }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowIntentionModal(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartWithIntention}
                  disabled={!intention.trim()}
                  className="btn-primary"
                  style={{ 
                    background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                    opacity: intention.trim() ? 1 : 0.5
                  }}
                >
                  Start Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Distraction Input */}
      <AnimatePresence>
        {showDistractionInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDistractionInput(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass rounded-xl p-6 w-full max-w-md"
              style={{ background: 'rgba(26, 47, 69, 0.98)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Log Distraction
                </h3>
                <button
                  onClick={() => setShowDistractionInput(false)}
                  className="p-1 rounded hover:bg-white/10"
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>
              <input
                type="text"
                value={distractionText}
                onChange={(e) => setDistractionText(e.target.value)}
                placeholder="What distracted you?"
                className="glass-input w-full px-4 py-3 mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDistractionSubmit()
                  }
                }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDistractionInput(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDistractionSubmit}
                  disabled={!distractionText.trim()}
                  className="btn-primary"
                  style={{ 
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    opacity: distractionText.trim() ? 1 : 0.5
                  }}
                >
                  Log & Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Phase Complete Prompt */}
      <AnimatePresence>
        {showPhasePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPhasePrompt(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass rounded-2xl p-8 w-full max-w-sm text-center"
              style={{ background: 'rgba(26, 47, 69, 0.98)' }}
            >
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ 
                  background: pendingAction === 'startBreak' 
                    ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                    : 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {pendingAction === 'startBreak' ? (
                  <Coffee className="w-10 h-10 text-white" />
                ) : (
                  <Target className="w-10 h-10 text-white" />
                )}
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {pomodoroPhase === 'work' ? '🎉 Great work!' : '☕ Break over!'}
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                {pendingAction === 'startBreak' 
                  ? 'Time for a well-deserved break. You completed a Pomodoro!'
                  : 'Ready to focus again? Let\'s go!'}
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { stopPomodoro(); setShowPhasePrompt(false) }}
                  className="btn-ghost px-6"
                >
                  End Session
                </button>
                <button
                  onClick={() => handlePhasePromptAction(pendingAction!)}
                  className="btn-primary px-6"
                  style={{ 
                    background: pendingAction === 'startBreak' 
                      ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                      : 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                  }}
                >
                  {pendingAction === 'startBreak' ? 'Start Break' : 'Back to Work'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
