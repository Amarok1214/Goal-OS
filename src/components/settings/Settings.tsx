import { useState, useRef } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useSettingsStore } from '../../store/settingsStore'
import { exportAllData } from '../../utils/export'
import { importAllData, loadImportedData, clearAllData } from '../../utils/import'
import type { ImportResult } from '../../utils/import'
import { 
  Clock, 
  Bell, 
  Database, 
  Info, 
  Download, 
  Upload, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

export function Settings() {
  const settings = useSettingsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<ImportResult | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleExport = () => {
    exportAllData()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await importAllData(file)
    
    if (result.success && result.data) {
      const loadResult = loadImportedData(result.data)
      setImportStatus(loadResult)
    } else {
      setImportStatus(result)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClearData = () => {
    clearAllData()
    setShowClearConfirm(false)
  }

  return (
    <div className="settings-page">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>

      <div className="settings-sections space-y-6">
        {/* Pomodoro Settings */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
              <Clock className="w-5 h-5" style={{ color: '#fbbf24' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Pomodoro Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--text-secondary)' }}
              >
                Work Duration (min)
              </label>
              <Input
                type="number"
                min={1}
                max={120}
                value={settings.pomodoroWork}
                onChange={(e) => settings.updateSettings({ pomodoroWork: parseInt(e.target.value) || 25 })}
                className="glass-input"
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--text-secondary)' }}
              >
                Short Break (min)
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={settings.pomodoroShortBreak}
                onChange={(e) => settings.updateSettings({ pomodoroShortBreak: parseInt(e.target.value) || 5 })}
                className="glass-input"
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: 'var(--text-secondary)' }}
              >
                Long Break (min)
              </label>
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.pomodoroLongBreak}
                onChange={(e) => settings.updateSettings({ pomodoroLongBreak: parseInt(e.target.value) || 15 })}
                className="glass-input"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
              <Bell className="w-5 h-5" style={{ color: '#3b82f6' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer" 
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Browser Notifications
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Get notified when Pomodoro sessions complete
                </p>
              </div>
              <button
                onClick={() => {
                  if (!settings.notificationsEnabled) {
                    Notification.requestPermission()
                  }
                  settings.updateSettings({ notificationsEnabled: !settings.notificationsEnabled })
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer" 
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Sound Effects
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Play chime when Pomodoro phases complete
                </p>
              </div>
              <button
                onClick={() => settings.updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
              <Database className="w-5 h-5" style={{ color: '#a855f7' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Data Management
            </h2>
          </div>

          <div className="space-y-4">
            {/* Export */}
            <div className="flex items-center justify-between p-4 rounded-lg" 
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Export Data
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Download all your goals, tasks, and settings as JSON
                </p>
              </div>
              <Button
                onClick={handleExport}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>

            {/* Import */}
            <div className="flex items-center justify-between p-4 rounded-lg" 
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Import Data
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Restore from a previously exported JSON file
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={handleImportClick}
                  className="btn-outline flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
            </div>

            {/* Import Status */}
            {importStatus && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                importStatus.success 
                  ? 'bg-emerald-500/10 border border-emerald-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {importStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium" style={{ color: importStatus.success ? '#4ade80' : '#f87171' }}>
                    {importStatus.success ? 'Import Successful!' : 'Import Failed'}
                  </p>
                  {importStatus.success && importStatus.imported ? (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      Imported: {importStatus.imported.goals} goals, {importStatus.imported.tasks} tasks, 
                      {importStatus.imported.sessions} sessions, {importStatus.imported.blocks} schedule blocks
                    </p>
                  ) : (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      {importStatus.error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Clear Data */}
            <div className="flex items-center justify-between p-4 rounded-lg" 
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Clear All Data
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Delete all goals, tasks, and settings permanently
                </p>
              </div>
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowClearConfirm(false)}
                    className="btn-ghost text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClearData}
                    className="btn-danger flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Confirm
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowClearConfirm(true)}
                  className="btn-danger flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(100, 116, 139, 0.15)' }}>
              <Info className="w-5 h-5" style={{ color: '#94a3b8' }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              About
            </h2>
          </div>

          <div className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span>Version</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span>Storage</span>
              <span className="font-mono">localStorage</span>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span>Framework</span>
              <span className="font-mono">React + Vite</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <Button
              onClick={() => {
                settings.resetSettings()
                setImportStatus(null)
              }}
              className="btn-outline flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Settings to Defaults
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
